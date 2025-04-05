const express = require("express");
const Category = require("../models/Category");

const router = express.Router();

// Получение всех категорий пользователя
router.get("/", async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ message: "Не указан user_id" });

    const categories = await Category.find({ user_id });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Получение категории по ID
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findOne({ id: req.params.id });

    if (!category) {
      return res.status(404).json({ message: "Категория не найдена" });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Создание новой категории
router.post("/", async (req, res) => {
  try {
    const { user_id, type, name } = req.body;

    if (!user_id || !type || !name) {
      return res.status(400).json({ message: "Заполните все поля" });
    }

    // Генерация ID вручную (автоинкремент)
    const lastCategory = await Category.find().sort({ id: -1 }).limit(1);
    const newId = lastCategory.length > 0 ? lastCategory[0].id + 1 : 1;

    const category = new Category({ id: newId, user_id, type, name });
    await category.save();

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Обновление категории
router.put("/:id", async (req, res) => {
  try {
    const { name, type } = req.body;
    const category = await Category.findOne({ id: req.params.id });

    if (!category) {
      return res.status(404).json({ message: "Категория не найдена" });
    }

    category.name = name || category.name;
    category.type = type || category.type;

    await category.save();

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Удаление категории
router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findOne({ id: req.params.id });

    if (!category) {
      return res.status(404).json({ message: "Категория не найдена" });
    }

    await Category.deleteOne({ id: req.params.id });

    res.json({ message: "Категория удалена" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

module.exports = router;
