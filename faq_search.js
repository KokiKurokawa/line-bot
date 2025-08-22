const faqData = require('./faq_data.json');

function findBestAnswer(userMessage) {
  for (const faq of faqData) {
    for (const q of faq.question) {
      if (userMessage.includes(q)) {
        return faq.answer;
      }
    }
  }
  return 'すみません、うまく答えられませんでした。別の言い方で聞いてみてください。';
}

module.exports = { findBestAnswer };
