from flask import Flask, request
from flask_cors import CORS

from api.randomization import *

app = Flask(__name__)
CORS(app)

@app.route("/")
def index():
    return "comparative ambiguity"

@app.route("/price", methods=["POST"])
def price():
    data = request.get_json()
    print(data)
    return { "price": int(randomize_price(data)) }

@app.route("/bet", methods=["POST"])
def bet():
    data = request.get_json()
    cp = data["cp"]
    bet = data["bet"]
    guess = data["guess"]

    import sys
    print(sys.version_info)
    assert sys.version_info >= (3, 10)

    output = []
    match cp:
        case 1:
            match bet:
                case 1:
                    output = CP1_bet1().play()
                case 2:
                    output = CP1_bet2().play()
                case 3:
                    output = CP1_bet3().play()
                case 4:
                    output = CP1_bet4().play()
        case 2:
            match bet:
                case 1:
                    output = CP2_bet1().play()
                case 2:
                    output = CP2_bet2().play()
                case 3:
                    output = CP2_bet3().play()
                case 4:
                    output = CP2_bet4().play()
        case 3:
            match bet:
                case 1:
                    output = CP3_bet1().play(guess)
                case 2:
                    output = CP3_bet2().play(guess)
        case 4:
            match bet:
                case 1:
                    output = CP4_bet1().play()
                case 2:
                    output = CP4_bet2().play()
                case 3:
                    output = CP4_bet3().play()
        
    return {
        "draw_colour": output[0],
        "bet": output[1]
    }