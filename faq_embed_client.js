const axios = require("axios");

async function getEmbedding(text) {
  const res = await axios.post("http://localhost:5000/embed", { text });
  return res.data; // 384次元ベクトル
}
