const express = require("express");
const Currency = require("../models/Currency");

const router = express.Router();

// Получение всех валют
router.get("/", async (req, res) => {
  try {
    const currencies = await Currency.find();
    res.json(currencies);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Получение валюты по ID
router.get("/:id", async (req, res) => {
  try {
    const currency = await Currency.findOne({ id: req.params.id });

    if (!currency) {
      return res.status(404).json({ message: "Валюта не найдена" });
    }

    res.json(currency);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Добавление новой валюты
router.post("/", async (req, res) => {
  try {
    const { code, name, symbol, rate_to_usd } = req.body;

    if (!code || !name || !symbol || !rate_to_usd) {
      return res.status(400).json({ message: "Заполните все обязательные поля" });
    }

    // Генерация ID вручную (автоинкремент)
    const lastCurrency = await Currency.find().sort({ id: -1 }).limit(1);
    const newId = lastCurrency.length > 0 ? lastCurrency[0].id + 1 : 1;

    const currency = new Currency({ 
      id: newId, 
      code, 
      name, 
      symbol, 
      rate_to_usd 
    });

    await currency.save();

    res.status(201).json(currency);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Обновление валюты
router.put("/:id", async (req, res) => {
  try {
    const { name, symbol, rate_to_usd } = req.body;
    const currency = await Currency.findOne({ id: req.params.id });

    if (!currency) {
      return res.status(404).json({ message: "Валюта не найдена" });
    }

    currency.name = name || currency.name;
    currency.symbol = symbol || currency.symbol;
    currency.rate_to_usd = rate_to_usd || currency.rate_to_usd;

    await currency.save();

    res.json(currency);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Удаление валюты
router.delete("/:id", async (req, res) => {
  try {
    const currency = await Currency.findOne({ id: req.params.id });

    if (!currency) {
      return res.status(404).json({ message: "Валюта не найдена" });
    }

    await Currency.deleteOne({ id: req.params.id });

    res.json({ message: "Валюта удалена" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

module.exports = router;
