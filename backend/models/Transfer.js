const mongoose = require("mongoose");

const TransferSchema = new mongoose.Schema({
  id: { type: Number, unique: true }, // Числовой ID
  user_id: { type: Number, required: true }, // ID пользователя
  datetime: { type: Date, required: true, default: Date.now }, // Дата перевода
  amount: { type: Number, required: true }, // Сумма перевода
  from_asset_id: { type: Number, required: true }, // ID счета, с которого перевод
  to_asset_id: { type: Number, required: true }, // ID счета, на который перевод
  note: { type: String }, // Заметка
});

module.exports = mongoose.model("Transfer", TransferSchema);
