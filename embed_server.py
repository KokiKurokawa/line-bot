import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from sentence_transformers import SentenceTransformer, util

app = Flask(__name__)
CORS(app)

# モデルのロード
#model = SentenceTransformer('all-MiniLM-L6-v2')
model = SentenceTransformer('paraphrase-MiniLM-L3-v2')

# FAQデータの読み込み（絶対パスで安全に）
faq_path = os.path.join(os.path.dirname(__file__), "faq_data.json")
with open(faq_path, "r", encoding="utf-8") as f:
    faq_data = json.load(f)

# FAQの埋め込みを事前計算してキャッシュ
faq_embeddings = [er
    (model.encode(faq["question"], convert_to_tensor=True), faq)
    for faq in faq_data
]

# 類似度検索API
@app.route("/embed", methods=["POST"])
def embed():
    user_question = request.json.get("question", "")
    if not user_question:
        return jsonify({"error": "質問が空です"}), 400

    user_embedding = model.encode(user_question, convert_to_tensor=True)
    scores = [
        (util.pytorch_cos_sim(user_embedding, emb).item(), faq)
        for emb, faq in faq_embeddings
    ]

    best_match = max(scores, key=lambda x: x[0])[1]
    return jsonify({"answer": best_match["answer"]})

# ヘルスチェック用エンドポイント
@app.route("/", methods=["GET"])
def health():
    return "Embed Server is running", 200

# Render用ポート設定
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
