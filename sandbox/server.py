from flask import Flask, request, jsonify
from executor import execute

app = Flask(__name__)


@app.route("/health")
def health():
    return "ok"


@app.route("/execute", methods=["POST"])
def run():
    data = request.get_json()
    result = execute(data["code"], data.get("timeout", 30))
    return jsonify(result)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
