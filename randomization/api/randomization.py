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


class ellsberg_two_color_urn:

    def __init__(self, n: int, risk:bool, suburn:bool = False, labels:list=['Red', 'Black']):
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
        labels: list, optional
            The labels associated with the different colors.
        """

        self.labels = labels
        self.n = n
        self.risk = risk
        self.suburn = suburn

        if not suburn:
            try:
                assert int(n / 2) == n / 2
            except:
                raise ValueError('Total number of balls must be even')

        if risk:
            self.composition = np.asarray([n/2, n/2]).reshape(1, 2)
            self.prob = normalize(self.composition, axis=1, norm='l1').flatten()
        else:
            N = np.cumsum(np.ones(n))

            dist = choose_distribution(N)

            x = choice([1,2], p=[0.5, 0.5])

            if x == 1:
                red = choice(N, p=dist)
            else:
                red = n - choice(N, p=dist)

            urn = np.asarray([red, n-red]).reshape(1, 2)

            self.composition = urn.flatten()
            self.prob = normalize(urn, axis=1, norm='l1').flatten()
    
    def draw(self, size: int = 1, replace: bool = True):

        return choice(self.labels, size=size, replace=replace, p=self.prob)

class ellsberg_three_color_urn:

    def __init__(self, n: int):
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

        self.n = n

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

        self.composition = urn.flatten()
        self.prob = normalize(urn, axis=1, norm='l1').flatten()
    
    def draw(self, size: int = 1, replace:bool = True):

        return choice(['Blue', 'Red', 'Green'], size=size, replace=replace, p=self.prob)

class ellsberg_k_color_urn:

    def __init__(self, k:int, n:int, risk:bool):
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

        self.k = k
        self.n = n
        self.risk = risk

        try:
            assert n/k == int(n/k)
        except:
            raise ValueError(f'Total number of balls must be divisible by {k}')

        if risk:
            self.prob = np.ones(k) / k
            self.composition = np.repeat(n/k, k)
        else:
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

            self.composition = urn.flatten()
            self.prob = normalize(urn, axis=1, norm='l1').flatten()

    def draw(self, size:int = 1, replace:bool = True):

        S = np.cumsum(np.ones(self.k))

        return choice(S, size=size, replace=replace, p=self.prob)

class machina_50_51_modified:

    def __init__(self, m:int, M:int):
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

        self.m, self.M = m, M

        part_1 = ellsberg_two_color_urn(m, risk=False, suburn=True).composition

        part_2 = ellsberg_two_color_urn(M, risk=False, suburn=True).composition

        machina = np.concatenate((part_1, part_2), axis=None).reshape(1, 4)

        self.composition = machina.flatten()
        self.prob = normalize(machina, axis=1, norm='l1').flatten()
    
    def draw(self, size:int = 1, replace:bool = True):

        return choice([1, 2, 3, 4], size=size, replace=replace, p=self.prob)
    
class ellsberg_split_urn:

    def __init__(self, col_risk:int, col_amb:int, num_risk:int, num_amb:int):
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

        self.col_risk = col_risk
        self.col_amb = col_amb
        self.num_risk = num_risk
        self.num_amb = num_amb

        risky_urn = ellsberg_k_color_urn(col_risk, num_risk, risk=True).composition
        amb_urn = ellsberg_k_color_urn(col_amb, num_amb, risk=False).composition

        split_urn = np.concatenate((risky_urn, amb_urn), axis=None).reshape(1, col_risk+col_amb)

        self.composition = split_urn.flatten()
        self.prob = normalize(split_urn, axis=1, norm='l1').flatten()

    def draw(self, size:int = 1, replace:bool=True):

        S = np.cumsum(np.ones(self.col_risk + self.col_amb))

        return choice(S, size=size, replace=replace, p=self.prob)


def CP1(cond:int, cond6:int = None, cond7:int = None, cond8:int = None):
    """
    Evaluates bets from choice problem 1 according to the condition specified.

    Parameters
    ----------
    cond: int
        The treatment condition ranging from 1 to 8.
    cond6: int, optional
        The response to the choice problem in condition 6.
    cond7: int, optional
        The response to the choice problem in condition 7.
    cond8: int, optional
        The response to the choice problem in condition 8.

    Returns
    -------
    int
        The winnings from the tickets.
    """

    try:
        assert cond <= 8
    except:
        raise ValueError('There are only 8 conditions')
    
    print('Generating the urn.')
    urn = ellsberg_split_urn(2, 4, 2, 4)
    print('Drawing a ball from the generated urn.')
    ball = urn.draw()[0]

    colors = ['Purple', 'White', 'Red', 'Yellow', 'Blue', 'Green']

    print(f'The ball drawn from the urn was {colors[int(ball-1)]}')

    bet1 = np.nan
    bet2 = np.nan
    bet3 = np.nan
    bet4 = np.nan

    if cond == 1:
        if ball == 1 or ball == 2:
            bet1 = 500
        else:
            bet1 = 0
        
        print(f'The winnings from this ticket would be {bet1}')
    
    elif cond == 2:
        if ball == 4 or ball == 5:
            bet2 = 500
        else:
            bet2 = 0
        
        print(f'The winnings from this ticket would be {bet2}')

    elif cond == 3:
        if ball == 1 or ball == 2:
            bet1 = 500
        else:
            bet1 = 0
        
        if ball == 4 or ball == 5:
            bet2 = 500
        else:
            bet2 = 0
        
        print(f'The winnings from the ticket A would be {bet1}') # replace bet 1 with the bet corresponding to ticket A
        print(f'The winnings from the ticket B would be {bet2}') # replace bet 2 with the bet corresponding to ticket B

    elif cond == 4:
        if ball == 4 or ball == 5:
            bet2 = 500
        else:
            bet2 = 0
        
        if ball == 1 or ball == 2:
            bet1 = 500
        else:
            bet1 = 0
        
        if ball == 5:
            bet3 = 500
        else:
            bet3 = 0
        
        print(f'The winnings from the ticket A would be {bet1}') # replace bet 1 with the bet corresponding to ticket A
        print(f'The winnings from the ticket B would be {bet2}') # replace bet 2 with the bet corresponding to ticket B
        print(f'The winnings from the ticket C would be {bet3}') # replace bet 3 with the bet corresponding to ticket C

    elif cond == 5:
        if ball == 1 or ball == 2:
            bet1 = 500
        else:
            bet1 = 0
        
        if ball == 4 or ball == 5:
            bet2 = 500
        else:
            bet2 = 0
        
        if ball == 6:
            bet4 = 500
        else:
            bet4 = 0
        
        print(f'The winnings from the ticket A would be {bet1}') # replace bet 1 with the bet corresponding to ticket A
        print(f'The winnings from the ticket B would be {bet2}') # replace bet 2 with the bet corresponding to ticket B
        print(f'The winnings from the ticket C would be {bet4}') # replace bet 4 with the bet corresponding to ticket C
    
    elif cond == 6:
        assert cond6 is not None

        if cond6 == 1:
            if ball == 1 or ball == 2:
                bet1 = 500
            else:
                bet1 = 0

            print(f'The winnings from your chosen ticket would be {bet1}')

        elif cond6 == 2:
            if ball == 4 or ball == 5:
                bet2 = 500
            else:
                bet2 = 0

            print(f'The winnings from your chosen ticket would be {bet2}')
    
    elif cond == 7:
        assert cond7 is not None

        if cond7 == 1:
            if ball == 1 or ball == 2:
                bet1 = 500
            else:
                bet1 = 0
            
            print(f'The winnings from your chosen ticket would be {bet1}')

        elif cond7 == 2:
            if ball == 4 or ball == 5:
                bet2 = 500
            else:
                bet2 = 0

            print(f'The winnings from your chosen ticket would be {bet2}')
        
        elif cond7 == 3:
            if ball == 5:
                bet3 = 500
            else:
                bet3 = 0
            
            print(f'The winnings from your chosen ticket would be {bet3}')
    
    elif cond == 8:
        assert cond8 is not None

        if cond8 == 1:
            if ball == 1 or ball == 2:
                bet1 = 500
            else:
                bet1 = 0

            print(f'The winnings from your chosen ticket would be {bet1}')

        elif cond8 == 2:
            if ball == 4 or ball == 5:
                bet2 = 500
            else:
                bet2 = 0

            print(f'The winnings from your chosen ticket would be {bet2}')
        
        elif cond8 == 4:
            if ball == 6:
                bet4 = 500
            else:
                bet4 = 0

            print(f'The winnings from your chosen ticket would be {bet4}')
    
    return (bet1, bet2, bet3, bet4)

if __name__ == "__main__":
    CP1(7, cond7=3) # Try different conditions and responses