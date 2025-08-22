const express = require('express');
const axios = require('axios');
const similarity = require('string-similarity');
require('dotenv').config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ✅ FAQデータ（質問のバリエーションを含む）
const faqList = [
  {
    question: ["営業時間は？", "何時まで営業？", "開いてる時間教えて"],
    answer: "営業時間は平日10:00〜18:00です。"
  },
  {
    question: ["支払い方法は？", "どんな決済が使える？", "キャッシュレス対応してる？"],
    answer: "現金・クレジットカード・PayPayがご利用いただけます。"
  },
  {
    question: ["定休日は？", "休みの日は？", "いつ休み？"],
    answer: "定休日は土日祝です。"
  }
];

// 🧠 類似度検索関数
function findBestAnswer(userInput) {
  let bestMatch = { score: 0, answer: "すみません、うまく理解できませんでした。" };

  faqList.forEach(faq => {
    faq.question.forEach(q => {
      const score = similarity.compareTwoStrings(userInput, q);
      if (score > bestMatch.score) {
        bestMatch = { score, answer: faq.answer };
      }
    });
  });

  return bestMatch.answer;
}

// 🚀 LINE Webhookエンドポイント
app.post('/webhook', async (req, res) => {
  const events = req.body.events;

  for (const event of events) {
    if (event.type === 'message' && event.message.type === 'text') {
      const replyToken = event.replyToken;
      const userMessage = event.message.text;

      // 🎯 類似度検索で応答文を決定
      const replyText = findBestAnswer(userMessage);

      try {
        await axios.post('https://api.line.me/v2/bot/message/reply', {
          replyToken: replyToken,
          messages: [{ type: 'text', text: replyText }]
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`
          }
        });
      } catch (error) {
        console.error('LINE返信エラー:', error.response?.data || error.message);
      }
    }
  }

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`サーバーがポート${PORT}で起動しました`);
});
