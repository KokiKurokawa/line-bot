require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
  const events = req.body.events;
  events.forEach(event => {
    if (event.type === 'message' && event.message.type === 'text') {
      const replyToken = event.replyToken;
      const userMessage = event.message.text;

      axios.post('https://api.line.me/v2/bot/message/reply', {
        replyToken: replyToken,
        messages: [{ type: 'text', text: `あなたのメッセージ: ${userMessage}` }]
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`
        }
      });
    }
  });
  res.sendStatus(200);
});

app.get('/', (req, res) => {
  res.send('LINE Bot is running!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
