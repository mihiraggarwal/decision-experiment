from flask import Flask, request
from flask_cors import CORS

from api.randomization import choose_distribution

app = Flask(__name__)
CORS(app)

@app.route("/")
def index():
    return "comparative ambiguity"
