const express = require("express");
const Transfer = require("../models/Transfer");
const Asset = require("../models/Asset");

const router = express.Router();

// Получение всех переводов пользователя
router.get("/", async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ message: "Не указан user_id" });

    const transfers = await Transfer.find({ user_id });
    res.json(transfers);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Получение перевода по ID
router.get("/:id", async (req, res) => {
  try {
    const transfer = await Transfer.findOne({ id: req.params.id });

    if (!transfer) {
      return res.status(404).json({ message: "Перевод не найден" });
    }

    res.json(transfer);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Создание нового перевода
router.post("/", async (req, res) => {
  try {
    const { user_id, datetime, amount, from_asset_id, to_asset_id, note } = req.body;

    if (!user_id || !amount || !from_asset_id || !to_asset_id) {
      return res.status(400).json({ message: "Заполните все обязательные поля" });
    }

    // Генерация ID вручную (автоинкремент)
    const lastTransfer = await Transfer.find().sort({ id: -1 }).limit(1);
    const newId = lastTransfer.length > 0 ? lastTransfer[0].id + 1 : 1;

    // Обновляем балансы активов
    const fromAsset = await Asset.findOne({ id: from_asset_id });
    const toAsset = await Asset.findOne({ id: to_asset_id });

    if (!fromAsset || !toAsset) {
      return res.status(400).json({ message: "Один из счетов не найден" });
    }

    fromAsset.balance -= amount;
    toAsset.balance += amount;

    await fromAsset.save();
    await toAsset.save();

    const transfer = new Transfer({
      id: newId,
      user_id,
      datetime: datetime || new Date(),
      amount,
      from_asset_id,
      to_asset_id,
      note,
    });

    await transfer.save();

    res.status(201).json(transfer);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Обновление перевода
router.put("/:id", async (req, res) => {
  try {
    const { amount, note } = req.body;
    const transfer = await Transfer.findOne({ id: req.params.id });

    if (!transfer) {
      return res.status(404).json({ message: "Перевод не найден" });
    }

    transfer.amount = amount || transfer.amount;
    transfer.note = note || transfer.note;

    await transfer.save();

    res.json(transfer);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Удаление перевода
router.delete("/:id", async (req, res) => {
  try {
    const transfer = await Transfer.findOne({ id: req.params.id });

    if (!transfer) {
      return res.status(404).json({ message: "Перевод не найден" });
    }

    await Transfer.deleteOne({ id: req.params.id });

    res.json({ message: "Перевод удален" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

module.exports = router;
