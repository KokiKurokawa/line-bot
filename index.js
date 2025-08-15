const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
  const events = req.body.events;
  events.forEach(event => {
    console.log('Received event:', event);
    // ここに返信処理などを追加
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
