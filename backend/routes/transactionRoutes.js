const express = require("express");
const Transaction = require("../models/Transaction");
const Asset = require("../models/Asset");

const router = express.Router();

// Получение всех транзакций пользователя
router.get("/", async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ message: "Не указан user_id" });

    const transactions = await Transaction.find({ user_id });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Получение транзакции по ID
router.get("/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ id: req.params.id });

    if (!transaction) {
      return res.status(404).json({ message: "Транзакция не найдена" });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Создание новой транзакции
router.post("/", async (req, res) => {
  try {
    const { user_id, datetime, amount, category_id, asset_id, type, from_asset_id, to_asset_id, note } = req.body;

    if (!user_id || !amount || !type) {
      return res.status(400).json({ message: "Заполните все обязательные поля" });
    }

    // Генерация ID вручную (автоинкремент)
    const lastTransaction = await Transaction.find().sort({ id: -1 }).limit(1);
    const newId = lastTransaction.length > 0 ? lastTransaction[0].id + 1 : 1;

    // Если это перевод, проверяем активы
    if (type === "transfer") {
      if (!from_asset_id || !to_asset_id) {
        return res.status(400).json({ message: "Для перевода укажите from_asset_id и to_asset_id" });
      }

      // Обновляем баланс исходного счета
      const fromAsset = await Asset.findOne({ id: from_asset_id });
      const toAsset = await Asset.findOne({ id: to_asset_id });

      if (!fromAsset || !toAsset) {
        return res.status(400).json({ message: "Один из счетов не найден" });
      }

      fromAsset.balance -= amount;
      toAsset.balance += amount;

      await fromAsset.save();
      await toAsset.save();
    }

    const transaction = new Transaction({
      id: newId,
      user_id,
      datetime: datetime || new Date(),
      amount,
      category_id: category_id || null,
      asset_id: asset_id || null,
      type,
      from_asset_id,
      to_asset_id,
      note,
    });

    await transaction.save();

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Обновление транзакции
router.put("/:id", async (req, res) => {
  try {
    const { amount, category_id, asset_id, note } = req.body;
    const transaction = await Transaction.findOne({ id: req.params.id });

    if (!transaction) {
      return res.status(404).json({ message: "Транзакция не найдена" });
    }

    transaction.amount = amount || transaction.amount;
    transaction.category_id = category_id || transaction.category_id;
    transaction.asset_id = asset_id || transaction.asset_id;
    transaction.note = note || transaction.note;

    await transaction.save();

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Удаление транзакции
router.delete("/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ id: req.params.id });

    if (!transaction) {
      return res.status(404).json({ message: "Транзакция не найдена" });
    }

    await Transaction.deleteOne({ id: req.params.id });

    res.json({ message: "Транзакция удалена" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

module.exports = router;
