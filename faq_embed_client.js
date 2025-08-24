const axios = require("axios");

// RenderでホストされたAPIのURLに変更
const EMBED_API_URL = "https://line-bot-5i66.onrender.com"; // ←ここを実際のURLに置き換えて！

async function getEmbedding(text) {
  try {
    const res = await axios.post(EMBED_API_URL, { text });
    return res.data; // 384次元ベクトル
  } catch (error) {
    console.error("Embedding API呼び出しエラー:", error.message);
    return null;
  }
}

module.exports = { getEmbedding };
