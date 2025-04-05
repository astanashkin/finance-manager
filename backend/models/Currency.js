const mongoose = require("mongoose");

const CurrencySchema = new mongoose.Schema({
  id: { type: Number, unique: true }, // Числовой ID
  code: { type: String, required: true, unique: true }, // Код валюты (USD, EUR, KZT)
  name: { type: String, required: true }, // Полное название (Доллар США, Евро, Тенге)
  symbol: { type: String, required: true }, // Символ ($, €, ₸)
  rate_to_usd: { type: Number, required: true }, // Курс к USD
});

module.exports = mongoose.model("Currency", CurrencySchema);
