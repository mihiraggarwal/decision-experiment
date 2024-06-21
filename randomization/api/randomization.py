import numpy as np
# from typing import Union
from numpy.random import randint, default_rng, randn, choice
import random

def int_fac(x: int):
    """
    Returns the factorial of x.

    Parameters
    ----------
    x: int
        The number whose factorial is to be calculated.

    Returns
    -------
    int
        The factorial of x.
    """

    if x == 0:
        return 1
    else:
        return x * int_fac(x-1)

def factorial(x):
    """
    Returns the factorial of x.

    Parameters
    ----------
    x: Union[int, list, np.ndarray]
        The number whose factorial is to be calculated.

    Returns
    -------
    np.ndarray
        The factorial of x.
    """

    x = np.asarray(x)

    ranges = np.array([int_fac(int(n)) for n in x])

    return ranges

def poisson_pmf(mu: float, x):
    """
    Returns the probability mass function of a Poisson distribution with mean mu at x.

    Parameters
    ----------
    mu: float
        The mean of the Poisson distribution.
    x: float
        The value at which the probability mass function is evaluated.

    Returns
    -------
    float
        The probability mass function at x.
    """

    return np.exp(-mu) * (mu**x) / factorial(x)

def norm_pdf(mu: float, sigma: float, x):
    """
    Returns the probability density function of a normal distribution with mean mu and standard deviation sigma at x.

    Parameters
    ----------
    mu: float
        The mean of the normal distribution.
    sigma: float
        The standard deviation of the normal distribution.
    x: float
        The value at which the probability density function is evaluated.

    Returns
    -------
    float
        The probability density function at x.
    """

    return np.exp(-0.5 * ((x - mu) / sigma)**2) / (sigma * np.sqrt(2 * np.pi))

def exponential_pdf(scale: float, x):
    """
    Returns the probability density function of an exponential distribution with rate lambda = (1/scale) at x.

    Parameters
    ----------
    scale: float
        The scale of the exponential distribution.
    x: float
        The value at which the probability density function is evaluated.

    Returns
    -------
    np.ndarray
        The probability density function at x.
    """

    x = np.asarray(x)

    return (1/scale) * np.exp(-(1/scale) * x)

def choose_distribution(S):
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

    S = np.asarray(S)

    poisson_probs = np.abs(poisson_pmf(1, S) + randn())
    poisson_probs /= np.sum(poisson_probs)
    normal_probs = np.abs(norm_pdf(np.mean(S), 1, S) + randn())
    normal_probs /= np.sum(normal_probs)

    dists = {'uniform': uniform, 'poisson': poisson_probs, 'normal': normal_probs}

    return dists[gen.choice(list(dists.keys()))]


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
            self.composition = np.asarray([n/2, n/2])
            self.prob = self.composition / n
        else:
            N = np.cumsum(np.ones(n))

            dist = choose_distribution(N)

            x = choice([1,2], p=[0.5, 0.5])

            if x == 1:
                red = choice(N, p=dist)
            else:
                red = n - choice(N, p=dist)

            urn = np.asarray([red, n-red])

            self.composition = urn
            self.prob = urn / n

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

        urn = np.asarray([blue, red, green])

        self.composition = urn
        self.prob = urn / n

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

            self.composition = urn
            self.prob = urn / n

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

        machina = np.concatenate((part_1, part_2), axis=None)

        self.composition = machina
        self.prob = machina / (m + M)

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

        split_urn = np.concatenate((risky_urn, amb_urn), axis=None)

        self.composition = split_urn
        self.prob = split_urn / (num_risk + num_amb)

    def draw(self, size:int = 1, replace:bool=True):

        S = np.cumsum(np.ones(self.col_risk + self.col_amb))

        return choice(S, size=size, replace=replace, p=self.prob)


class CP1_bet1:

    def __init__(self):
        """
        Instantiates the first bet from choice problem 1.

        Returns
        -------
        None
        """

        self.rewards = [400, 400, 0, 0, 0, 0]
        self.dist = np.ones(6) / 6

        self.colors = ['Purple', 'White', 'Red', 'Yellow', 'Blue', 'Green']

    def play(self, verbose:bool = False):
        """
        Plays the first bet from choice problem 1.

        Returns
        -------
        (str, int)
            The drawn ball color and winnings from the first bet.
        """

        if verbose:
            print('Generating the urn.')
        urn = ellsberg_split_urn(2, 4, 2, 4)

        if verbose:
            print('Drawing a ball from the generated urn.')
        ball = urn.draw()[0]

        draw_color = self.colors[int(ball-1)]

        if verbose:
            print(f'The ball drawn from the urn was {draw_color}')

        bet1 = self.rewards[int(ball-1)]

        if verbose:
            print(f'The winnings from this ticket would be {bet1}')

        return draw_color, bet1

class CP1_bet2:

        def __init__(self):
            """
            Instantiates the second bet from choice problem 1.

            Returns
            -------
            None
            """

            self.rewards = [0, 0, 0, 0, 400, 400]
            self.dist = np.ones(6) / 6

            self.colors = ['Purple', 'White', 'Red', 'Yellow', 'Blue', 'Green']

        def play(self, verbose:bool = False):
            """
            Plays the second bet from choice problem 1.

            Returns
            -------
            (str, int)
                The drawn ball's color and winnings from the second bet.
            """

            if verbose:
                print('Generating the urn.')
            urn = ellsberg_split_urn(2, 4, 2, 4)

            if verbose:
                print('Drawing a ball from the generated urn.')
            ball = urn.draw()[0]

            draw_color = self.colors[int(ball-1)]

            if verbose:
                print(f'The ball drawn from the urn was {draw_color}')

            bet2 = self.rewards[int(ball-1)]

            if verbose:
                print(f'The winnings from this ticket would be {bet2}')

            return draw_color, bet2

class CP1_bet3:

    def __init__(self):
        """
        Instantiates the third bet from choice problem 1.

        Returns
        -------
        None
        """

        self.rewards = [0, 0, 0, 0, 0, 400]
        self.dist = np.ones(6) / 6

        self.colors = ['Purple', 'White', 'Red', 'Yellow', 'Blue', 'Green']

    def play(self, verbose:bool = False):
        """
        Plays the third bet from choice problem 1.

        Returns
        -------
        (str, int)
            The drawn ball's color and winnings from the third bet.
        """

        if verbose:
            print('Generating the urn.')
        urn = ellsberg_split_urn(2, 4, 2, 4)

        if verbose:
            print('Drawing a ball from the generated urn.')
        ball = urn.draw()[0]

        draw_color = self.colors[int(ball-1)]

        if verbose:
            print(f'The ball drawn from the urn was {draw_color}')

        bet3 = self.rewards[int(ball-1)]

        if verbose:
            print(f'The winnings from this ticket would be {bet3}')

        return draw_color, bet3


class CP1_bet4:

    def __init__(self):
        """
        Instantiates the fourth bet from choice problem 1.

        Returns
        -------
        None
        """

        self.rewards = [0, 0, 0, 400, 0, 0]
        self.dist = np.ones(6) / 6

        self.colors = ['Purple', 'White', 'Red', 'Yellow', 'Blue', 'Green']

    def play(self, verbose:bool = False):
        """
        Plays the fourth bet from choice problem 1.

        Returns
        -------
        (str, int)
            The drawn ball's color and winnings from the fourth bet.
        """

        if verbose:
            print('Generating the urn.')
        urn = ellsberg_split_urn(2, 4, 2, 4)

        if verbose:
            print('Drawing a ball from the generated urn.')
        ball = urn.draw()[0]

        draw_color = self.colors[int(ball-1)]

        if verbose:
            print(f'The ball drawn from the urn was {draw_color}')

        bet4 = self.rewards[int(ball-1)]

        if verbose:
            print(f'The winnings from this ticket would be {bet4}')

        return draw_color, bet4


class CP2_bet1:

        def __init__(self):
            """
            Instantiates the first bet from choice problem 2.

            Returns
            -------
            None
            """

            self.rewards = [500, 0, 100, 0]
            self.dist = np.ones(4) / 4

            self.colors = ['Blue', 'Yellow', 'Pink', 'Orange']

        def play(self, verbose:bool = False):
            """
            Plays the first bet from choice problem 2.

            Returns
            -------
            (str, int)
                The drawn ball's color and winnings from the first bet.
            """

            if verbose:
                print('Generating the urn.')
            urn = ellsberg_split_urn(2, 2, 2, 2)

            if verbose:
                print('Drawing a ball from the generated urn.')
            ball = urn.draw()[0]

            draw_color = self.colors[int(ball-1)]

            if verbose:
                print(f'The ball drawn from the urn was {draw_color}')

            bet1 = self.rewards[int(ball-1)]

            if verbose:
                print(f'The winnings from this ticket would be {bet1}')

            return draw_color, bet1


class CP2_bet2:

        def __init__(self):
            """
            Instantiates the second bet from choice problem 2.

            Returns
            -------
            None
            """

            self.rewards = [0, 100, 0, 600]
            self.dist = np.ones(4) / 4

            self.colors = ['Blue', 'Yellow', 'Pink', 'Orange']

        def play(self, verbose:bool = False):
            """
            Plays the second bet from choice problem 2.

            Returns
            -------
            (str, int)
                The drawn ball's color and winnings from the second bet.
            """

            if verbose:
                print('Generating the urn.')
            urn = ellsberg_split_urn(2, 2, 2, 2)

            if verbose:
                print('Drawing a ball from the generated urn.')
            ball = urn.draw()[0]

            draw_color = self.colors[int(ball-1)]

            if verbose:
                print(f'The ball drawn from the urn was {draw_color}')

            bet2 = self.rewards[int(ball-1)]

            if verbose:
                print(f'The winnings from this ticket would be {bet2}')

            return draw_color, bet2


class CP2_bet3:

        def __init__(self):
            """
            Instantiates the third bet from choice problem 2.

            Returns
            -------
            None
            """

            self.rewards = [500, 0, 0, 0]
            self.dist = np.ones(4) / 4

            self.colors = ['Blue', 'Yellow', 'Pink', 'Orange']

        def play(self, verbose:bool = False):
            """
            Plays the third bet from choice problem 2.

            Returns
            -------
            (str, int)
                The drawn ball's color and winnings from the third bet.
            """

            if verbose:
                print('Generating the urn.')
            urn = ellsberg_split_urn(2, 2, 2, 2)

            if verbose:
                print('Drawing a ball from the generated urn.')
            ball = urn.draw()[0]

            draw_color = self.colors[int(ball-1)]

            if verbose:
                print(f'The ball drawn from the urn was {draw_color}')

            bet3 = self.rewards[int(ball-1)]

            if verbose:
                print(f'The winnings from this ticket would be {bet3}')

            return draw_color, bet3

class CP2_bet4:

        def __init__(self):
            """
            Instantiates the fourth bet from choice problem 2.

            Returns
            -------
            None
            """

            self.rewards = [0, 500, 0, 0]
            self.dist = np.ones(4) / 4

            self.colors = ['Blue', 'Yellow', 'Pink', 'Orange']

        def play(self, verbose:bool = False):
            """
            Plays the fourth bet from choice problem 2.

            Returns
            -------
            (str, int)
                The drawn ball's color and winnings from the fourth bet.
            """

            if verbose:
                print('Generating the urn.')
            urn = ellsberg_split_urn(2, 2, 2, 2)

            if verbose:
                print('Drawing a ball from the generated urn.')
            ball = urn.draw()[0]

            draw_color = self.colors[int(ball-1)]

            if verbose:
                print(f'The ball drawn from the urn was {draw_color}')

            bet4 = self.rewards[int(ball-1)]

            if verbose:
                print(f'The winnings from this ticket would be {bet4}')

            return draw_color, bet4


class CP3_bet1:

        def __init__(self):
            """
            Instantiates the first bet from choice problem 3.

            Returns
            -------
            None
            """

            self.rewards = [500, 0, 0, 0, 0, 0, 0, 0]
            self.dist = np.ones(8) / 8

            self.colors = ['Pink', 'Orange', 'Purple', 'Green', 'Red', 'Black', 'Yellow', 'Blue']

        def play(self, guess:str, verbose:bool = False):
            """
            Plays the first bet from choice problem 3.

            Returns
            -------
            (str, int)
                The drawn ball's color and winnings from the first bet.
            """

            if verbose:
                print('Generating the urn.')
            urn = ellsberg_k_color_urn(8, 8, risk=True)

            if verbose:
                print('Drawing a ball from the generated urn.')
            ball = urn.draw()[0]

            draw_color = self.colors[int(ball-1)]

            if verbose:
                print(f'The ball drawn from the urn was {draw_color}')

            if guess == draw_color:
                bet1 = self.rewards[0]
            else:
                bet1 = 0

            if verbose:
                print(f'The winnings from this ticket would be {bet1}')

            return draw_color, bet1


class CP3_bet2:

    def __init__(self):
        """
        Instantiates the second bet from choice problem 3.

        Returns
        -------
        None
        """

        self.rewards = [500, 0, 0, 0, 0, 0, 0, 0]
        self.dist = np.ones(8) / 8

        self.colors = ['Pink', 'Orange', 'Purple', 'Green', 'Red', 'Black', 'Yellow', 'Blue']

    def play(self, guess:str, verbose:bool = False):
        """
        Plays the second bet from choice problem 3.

        Returns
        -------
        (str, int)
            The drawn ball's color and winnings from the second bet.
        """

        if verbose:
            print('Generating the urn.')
        urn = ellsberg_k_color_urn(8, 8, risk=False)

        if verbose:
            print('Drawing a ball from the generated urn.')
        ball = urn.draw()[0]

        draw_color = self.colors[int(ball-1)]

        if verbose:
            print(f'The ball drawn from the urn was {draw_color}')

        if guess == draw_color:
            bet2 = self.rewards[0]
        else:
            bet2 = 0

        if verbose:
            print(f'The winnings from this ticket would be {bet2}')

        return draw_color, bet2


class CP4_bet1:

    def __init__(self):
        """
        Instantiates the first bet from choice problem 4.

        Returns
        -------
        None
        """

        self.rewards = [300, 0, 0]
        self.dist = np.ones(3) / 3

        self.colors = ['Green', 'Red', 'Purple']

    def play(self, verbose:bool = False):
        """
        Plays the first bet from choice problem 4.

        Returns
        -------
        (str, int)
            The drawn ball's color and winnings from the first bet.
        """

        if verbose:
            print('Generating the urn.')
        urn = ellsberg_three_color_urn(3)

        if verbose:
            print('Drawing a ball from the generated urn.')
        ball = urn.draw()[0]

        draw_color = self.colors[int(ball-1)]

        if verbose:
            print(f'The ball drawn from the urn was {draw_color}')

        bet1 = self.rewards[int(ball-1)]

        if verbose:
            print(f'The winnings from this ticket would be {bet1}')

        return draw_color, bet1


class CP4_bet2:

    def __init__(self):
        """
        Instantiates the second bet from choice problem 4.

        Returns
        -------
        None
        """

        self.rewards = [0, 300, 0]
        self.dist = np.ones(3) / 3

        self.colors = ['Green', 'Red', 'Purple']

    def play(self, verbose:bool = False):
        """
        Plays the second bet from choice problem 4.

        Returns
        -------
        (str, int)
            The drawn ball's color and winnings from the second bet.
        """

        if verbose:
            print('Generating the urn.')
        urn = ellsberg_three_color_urn(3)

        if verbose:
            print('Drawing a ball from the generated urn.')
        ball = urn.draw()[0]

        draw_color = self.colors[int(ball-1)]

        if verbose:
            print(f'The ball drawn from the urn was {draw_color}')

        bet2 = self.rewards[int(ball-1)]

        if verbose:
            print(f'The winnings from this ticket would be {bet2}')

        return draw_color, bet2


class CP4_bet3:

    def __init__(self):
        """
        Instantiates the third bet from choice problem 4.

        Returns
        -------
        None
        """

        self.rewards = [300, 0]
        self.dist = np.ones(2) / 2

        self.colors = ['Yellow', 'Cyan']

    def play(self, verbose:bool = False):
        """
        Plays the third bet from choice problem 4.

        Returns
        -------
        (str, int)
            The drawn ball's color and winnings from the third bet.
        """

        if verbose:
            print('Generating the urn.')
        urn = ellsberg_two_color_urn(2, risk=True, suburn=False)

        if verbose:
            print('Drawing a ball from the generated urn.')
        ball = urn.draw()[0]

        draw_color = self.colors[int(ball-1)]

        if verbose:
            print(f'The ball drawn from the urn was {draw_color}')

        bet3 = self.rewards[int(ball-1)]

        if verbose:
            print(f'The winnings from this ticket would be {bet3}')

        return draw_color, bet3


def randomize_price(bet):
    """
    Randomly determines the price of a bet.

    Parameters
    ----------
    bet: object
        The bet object whose price is to be randomized.

    Returns
    -------
    int
        The randomized price of the bet.
    """

    max_prize = max(bet["rewards"])
    mean_prize = float(np.mean(bet["rewards"]))

    N = [n for n in range(max_prize + 1)]

    dist = exponential_pdf(mean_prize, N)
    dist /= np.sum(dist)

    price = choice(N, p=dist)

    return price
