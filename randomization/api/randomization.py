import numpy as np
from typing import Union
from numpy.random import randint, default_rng, randn, choice
from scipy.stats import poisson, norm
from sklearn.preprocessing import normalize
import random

def choose_distribution(S: Union[list, np.ndarray]):
    """
    Returns a randomly generated distribution over the state space S.

    Parameters
    ----------
    S: Union[list, np.ndarray]
        The state space over which the distribution is generated.

    Returns
    -------
    np.ndarray
        The generated distribution
    """

    seed = int(''.join([str(i) for i in randint(low=0, high=9, size=20)]))

    gen = default_rng(seed=seed)

    uniform = np.array([1/len(S) for _ in S])

    S = np.asarray(S).reshape(1, len(S))

    poisson_dist = poisson(mu=1)
    poisson_pmf = normalize(np.abs(poisson_dist.pmf(S) + randn()), norm='l1')
    normal_dist = norm(loc=np.mean(S), scale=1)
    normal_pmf = normalize(np.abs(normal_dist.pdf(S) + randn()), norm='l1')

    dists = {'uniform': uniform, 'poisson': poisson_pmf, 'normal': normal_pmf}

    return dists[gen.choice(list(dists.keys()))].flatten()

def ellsberg_two_color_urn(n: int, risk:bool, suburn:bool == False):
    """
    Given a total number of balls, returns a two-color Ellsberg urn. If it is used as an intermediate calculation for the Machina urn, the number of balls may be odd. However, by itself, the number of balls must be even.

    Parameters
    ----------
    n: int
        The total number of balls in the urn.
    risk: bool
        Whether the urn is risky or ambiguous.
    suburn: bool, optional
        Whether the function is being used to create a Machina urn.

    Returns
    -------
    np.ndarray
        The probabilities of drawing balls of either color.
    """

    if not suburn:
        try:
            assert int(n / 2) == n / 2
        except:
            raise ValueError('Total number of balls must be even')

    if risk:
        return np.asarray([0.5, 0.5])

    N = np.cumsum(np.ones(n))

    dist = choose_distribution(N)

    x = choice([1,2], p=[0.5, 0.5])

    if x == 1:
        red = choice(N, p=dist)
    else:
        red = n - choice(N, p=dist)

    urn = np.asarray([red, n-red]).reshape(1, 2)

    return normalize(urn, axis=1, norm='l1').flatten()

def ellsberg_three_color_urn(n: int):
    """
    Given a total number of balls (n), this function generates a three-color Ellsberg urn, which has n/3 blue balls, and remaining either red or green balls.

    Parameters
    ----------
    n: int
        The total number of balls in the urn.

    Returns
    -------
    np.ndarray
        The probabilities of drawing balls of each color.
    """

    try:
        assert n/3 == int(n/3)
    except:
        raise ValueError('Total number of balls must be divisible by 3')

    N = np.cumsum(np.ones(int(2*n/3)))

    dist = choose_distribution(N)

    x = choice([1,2], p=[0.5, 0.5])

    if x == 1:
        red = choice(N, p=dist)
    else:
        red = int(2*n / 3) - choice(N, p=dist)

    blue = n/3
    green = int(2*n/3) - red

    urn = np.asarray([blue, red, green]).reshape(1, 3)

    return normalize(urn, axis=1, norm='l1').flatten()

def ellsberg_k_color_urn(k: int, n: int, risk:bool):
    """
    Generates an Ellsberg k color urn. If risky, returns a uniform distribution over k atoms. Else, returns an ambiguous urn of k colors.

    Parameters
    ----------
    k: int
        Number of colors
    n: int
        Total number of balls
    risk: bool
        Whether the urn is risky

    Returns
    -------
    np.ndarray
        Probability distribution corresponding to the generated urn.
    """

    try:
        assert n/k == int(n/k)
    except:
        raise ValueError(f'Total number of balls must be divisible by {k}')

    if risk:
        return np.ones(k) / k

    urn = np.zeros(k)

    K = [i for i in range(k)]

    random.shuffle(K)

    for i, pos in enumerate(K):
        if i == k-1:
            urn[pos] = n - np.sum(urn)
        elif np.sum(urn) < n:
            m = n - np.sum(urn)

            N = np.cumsum(np.ones(int(m)))

            dist = choose_distribution(N)

            balls = choice(N, p=dist)

            urn[pos] = balls

    urn = urn.reshape(1, k)

    return normalize(urn, axis=1, norm='l1').flatten()

def machina_50_51_modified(m: int, M: int):
    """
    Generates a modified version of the 50-51 Machina urn, where the 50 is replaced by m and 51 by M, though as in the original example, balls numbered 1 or 2 amount to m and balls numbered 3 or 4 amount to M.

    Parameters
    ----------
    m: int
        The number of balls in the smaller part of the urn.
    M: int
        The number of balls in the larger part of the urn.

    Returns
    -------
    np.ndarray
        Distribution of the generated Machina urn.
    """
    if not m <= M:
        m, M = M, m

    part_1 = ellsberg_two_color_urn(m, suburn=True) * m

    part_2 = ellsberg_two_color_urn(M, suburn=True) * M

    machina = np.concatenate((part_1, part_2), axis=None).reshape(1, 4)

    return normalize(machina, axis=1, norm='l1').flatten()

def ellsberg_split_urn(col_risk:int, col_amb:int, num_risk:int, num_amb:int):
    """
    Generates an Ellsberg-style urn, where some colors constitute a risky portion of the urn, and others the ambiguous portion. A more generalized version of the three-color urn.

    Parameters
    ----------
    col_risk: int
        Number of colors that constitute the risky portion
    col_amb: int
        Number of colors that constitute the ambiguous portion
    num_risk: int
        Number of balls in the risky portion of the urn
    num_amb: int
        Number of balls in the ambiguous portion of the urn

    Returns
    -------
    np.ndarray
        Distribution of the generated Ellsberg-style urn.
    """

    risky_urn = ellsberg_k_color_urn(col_risk, num_risk, risk=True) * num_risk
    amb_urn = ellsberg_k_color_urn(col_amb, num_amb, risk=False) * num_amb

    split_urn = np.concatenate((risky_urn, amb_urn), axis=None).reshape(1, col_risk+col_amb)

    return normalize(split_urn, axis=1, norm='l1').flatten()

if __name__ == '__main__':
    print(ellsberg_split_urn(1, 4, 2, 4))