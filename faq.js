const similarity = require('string-similarity');

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

module.exports = { findBestAnswer };
