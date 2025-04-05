const mongoose = require("mongoose");

const AssetSchema = new mongoose.Schema({
  id: { type: Number, unique: true }, // Числовой ID
  user_id: { type: Number, required: true }, // ID пользователя
  name: { type: String, required: true }, // Название (Кошелек 1, Optima Bank)
  type: { 
    type: String, 
    enum: ["wallet", "bank", "card", "investment", "loan", "insurance", "other"], 
    required: true 
  }, // Тип
  balance: { type: Number, default: 0 }, // Баланс
  currency: { type: String, default: "USD" }, // Валюта
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Asset", AssetSchema);
  
