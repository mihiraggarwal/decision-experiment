from flask import Flask, request
from flask_cors import CORS

from api.randomization import randomize_price

app = Flask(__name__)
CORS(app)

@app.route("/")
def index():
    return "comparative ambiguity"

@app.route("/price", methods=["POST"])
def price():
    data = request.get_json()
    return { "price": int(randomize_price(data)) }
