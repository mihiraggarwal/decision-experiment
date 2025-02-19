from flask import Flask, request
from flask_cors import CORS

from api.randomization import *

app = Flask(__name__)
CORS(app)

@app.route("/")
def index():
    return "decision experiment"

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

    output = []
    if cp == 1:
        if bet == 1:
            output = CP1_bet1().play()
        elif bet == 2:
            output = CP1_bet2().play()
        elif bet == 3:
            output = CP1_bet3().play()
        elif bet == 4:
            output = CP1_bet4().play()
    elif cp == 2:
        if bet == 1:
            output = CP2_bet1().play()
        elif bet == 2:
            output = CP2_bet2().play()
        elif bet == 3:
            output = CP2_bet3().play()
        elif bet == 4:
            output = CP2_bet4().play()
    elif cp == 3:
        if bet == 1:
            output = CP3_bet1().play(guess)
        elif bet == 2:
            output = CP3_bet2().play(guess)
    elif cp == 4:
        if bet == 1:
            output = CP4_bet1().play()
        elif bet == 2:
            output = CP4_bet2().play()
        elif bet == 3:
            output = CP4_bet3().play()
        
    return {
        "draw_colour": output[0],
        "bet": output[1]
    }