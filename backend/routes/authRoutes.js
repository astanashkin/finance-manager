const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Генерация JWT токена
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Регистрация
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Проверка, существует ли пользователь
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Пользователь уже существует" });

    // Создание ID вручную (автоинкремент)
    const lastUser = await User.find().sort({ id: -1 }).limit(1);
    const newId = lastUser.length > 0 ? lastUser[0].id + 1 : 1;

    // Хеширование пароля
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Создание пользователя
    user = new User({
      id: newId,
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
    });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Вход
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Проверка пользователя
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Неверный email или пароль" });

    // Проверка пароля
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Неверный email или пароль" });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
    });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Получение данных о пользователе (защищенный маршрут)
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Нет доступа" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ id: decoded.id }).select("-password");

    if (!user) return res.status(404).json({ message: "Пользователь не найден" });

    res.json(user);
  } catch (error) {
    res.status(401).json({ message: "Неверный токен" });
  }
});

// Получение пользователя по ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

module.exports = router;
