const express = require("express");
const Asset = require("../models/Asset");

const router = express.Router();

// Получение всех активов пользователя
router.get("/", async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ message: "Не указан user_id" });

    const assets = await Asset.find({ user_id });
    res.json(assets);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Получение актива по ID
router.get("/:id", async (req, res) => {
  try {
    const asset = await Asset.findOne({ id: req.params.id });

    if (!asset) {
      return res.status(404).json({ message: "Актив не найден" });
    }

    res.json(asset);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Создание нового актива
router.post("/", async (req, res) => {
  try {
    const { user_id, name, type, balance, currency } = req.body;

    if (!user_id || !name || !type) {
      return res.status(400).json({ message: "Заполните все обязательные поля" });
    }

    // Генерация ID вручную (автоинкремент)
    const lastAsset = await Asset.find().sort({ id: -1 }).limit(1);
    const newId = lastAsset.length > 0 ? lastAsset[0].id + 1 : 1;

    const asset = new Asset({ 
      id: newId, 
      user_id, 
      name, 
      type, 
      balance: balance || 0, 
      currency: currency || "USD" 
    });

    await asset.save();

    res.status(201).json(asset);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Обновление актива
router.put("/:id", async (req, res) => {
  try {
    const { name, type, balance, currency } = req.body;
    const asset = await Asset.findOne({ id: req.params.id });

    if (!asset) {
      return res.status(404).json({ message: "Актив не найден" });
    }

    asset.name = name || asset.name;
    asset.type = type || asset.type;
    asset.balance = balance !== undefined ? balance : asset.balance;
    asset.currency = currency || asset.currency;

    await asset.save();

    res.json(asset);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Удаление актива
router.delete("/:id", async (req, res) => {
  try {
    const asset = await Asset.findOne({ id: req.params.id });

    if (!asset) {
      return res.status(404).json({ message: "Актив не найден" });
    }

    await Asset.deleteOne({ id: req.params.id });

    res.json({ message: "Актив удален" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

module.exports = router;
