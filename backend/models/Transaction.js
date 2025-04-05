const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  id: { type: Number, unique: true }, // Числовой ID
  user_id: { type: Number, required: true }, // ID пользователя
  datetime: { type: Date, required: true, default: Date.now }, // Дата транзакции
  amount: { type: Number, required: true }, // Сумма
  category_id: { type: Number, required: true }, // ID категории (расход/доход)
  asset_id: { type: Number, required: true }, // ID актива (кошелек/банк)
  type: { type: String, enum: ["income", "expense", "transfer"], required: true }, // Тип транзакции
  from_asset_id: { type: Number }, // ID счета, с которого перевод (если type="transfer")
  to_asset_id: { type: Number }, // ID счета, на который перевод (если type="transfer")
  note: { type: String }, // Заметка
});

module.exports = mongoose.model("Transaction", TransactionSchema);
