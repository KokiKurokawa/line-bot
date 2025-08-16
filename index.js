const express = require('express');
const axios = require('axios');
require('dotenv').config(); // .envファイルの読み込み

const app = express();
app.use(express.json()); // LINEのWebhookはJSON形式


app.post('/webhook', async (req, res) => {
  const events = req.body.events;

  for (const event of events) {
    if (event.type === 'message' && event.message.type === 'text') {
      const replyToken = event.replyToken;
      const userMessage = event.message.text;

      // 🎯 条件分岐でメッセージを変える
      let replyText = `あなたのメッセージ: ${userMessage}`;
      if (userMessage === 'こんにちは') {
        replyText = 'こんにちは！ごきげんいかがですか？';
      }
      if (userMessage === 'こんばんは') {
        replyText = 'こんばんは！おやすみなさい';
      }

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

const PORT = process.env.PORT || 3000;  
app.listen(PORT, () => {
  console.log(`サーバーがポート${PORT}で起動しました`);
});