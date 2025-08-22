from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer

app = Flask(__name__)
model = SentenceTransformer('all-MiniLM-L6-v2')

@app.route('/embed', methods=['POST'])
def embed():
    text = request.json['text']
    vec = model.encode(text).tolist()
    return jsonify(vec)

if __name__ == '__main__':
    app.run(port=5000)
