const Currency = require("../models/Currency");

const defaultCurrencies = [
  { id: 1, code: "USD", name: "US Dollar", symbol: "$", rate_to_usd: 1 },
  { id: 2, code: "EUR", name: "Euro", symbol: "€", rate_to_usd: 1.09 },
  { id: 3, code: "RUB", name: "Russian Ruble", symbol: "₽", rate_to_usd: 0.011 },
  { id: 4, code: "GBP", name: "British Pound", symbol: "£", rate_to_usd: 1.27 },
  { id: 5, code: "JPY", name: "Japanese Yen", symbol: "¥", rate_to_usd: 0.0066 },
  { id: 6, code: "CNY", name: "Chinese Yuan", symbol: "¥", rate_to_usd: 0.14 },
  { id: 7, code: "AUD", name: "Australian Dollar", symbol: "A$", rate_to_usd: 0.66 },
  { id: 8, code: "CAD", name: "Canadian Dollar", symbol: "C$", rate_to_usd: 0.74 },
  { id: 9, code: "CHF", name: "Swiss Franc", symbol: "CHF", rate_to_usd: 1.11 },
];

const seedCurrencies = async () => {
  try {
    const count = await Currency.countDocuments();
    if (count === 0) {
      await Currency.insertMany(defaultCurrencies);
      console.log("✅ Валюты успешно добавлены в базу");
    } else {
      console.log("ℹ️ Валюты уже существуют в базе, пропуск добавления");
    }
  } catch (error) {
    console.error("Ошибка при автозаполнении валют:", error);
  }
};

module.exports = seedCurrencies;
