const express = require('express');
const axios = require('axios');
require('dotenv').config();
const { findBestAnswer } = require('./faq_search'); // ← 検索ロジックを分離

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post('/webhook', async (req, res) => {
  const events = req.body.events;

  for (const event of events) {
    if (event.type === 'message' && event.message.type === 'text') {
      const replyToken = event.replyToken;
      const userMessage = event.message.text;

      const replyText = findBestAnswer(userMessage); // ← JSONベースの検索に変更

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
