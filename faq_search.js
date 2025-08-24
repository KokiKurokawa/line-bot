const faqData = require('./faq_data.json');
const { getEmbedding } = require('./faq_embed_client'); // ベクトル取得関数をインポート
const cosineSimilarity = require('compute-cosine-similarity'); // npmで追加しておくと便利

async function findBestAnswer(userMessage) {
  const userVector = await getEmbedding(userMessage);
  if (!userVector) {
    return 'すみません、検索に失敗しました。もう一度試してみてください。';
  }

  let bestMatch = null;
  let highestSim = -1;

  for (const faq of faqData) {
    for (const q of faq.question) {
      const qVector = await getEmbedding(q);
      const sim = cosineSimilarity(userVector, qVector);
      if (sim > highestSim) {
        highestSim = sim;
        bestMatch = faq;
      }
    }
  }

  // 類似度のしきい値を設定（例：0.75以上なら採用）
  if (highestSim >= 0.75 && bestMatch) {
    return bestMatch.answer;
  } else {
    return 'すみません、うまく答えられませんでした。別の言い方で聞いてみてください。';
  }
}

module.exports = { findBestAnswer };
