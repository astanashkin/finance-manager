const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  id: { type: Number, unique: true }, // Числовой ID
  user_id: { type: Number, required: true }, // ID пользователя
  type: { type: String, enum: ["expense", "income", "asset"], required: true }, // Тип (расход, доход, актив)
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Category", CategorySchema);
