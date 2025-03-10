require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Підключення до MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log(err));

// Модель користувача
const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String
});

const User = mongoose.model("User", UserSchema);

// **Middleware для перевірки токена**
const authMiddleware = (req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token) return res.status(401).json({ msg: "Немає токена, авторизація заборонена" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ msg: "Недійсний токен" });
    }
};

// **Реєстрація користувача**
app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ msg: "Заповніть усі поля" });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "Користувач з таким email вже існує" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });

    try {
        await user.save();
        res.json({ msg: "Користувач зареєстрований" });
    } catch (err) {
        res.status(500).json({ msg: "Помилка сервера" });
    }
});

// **Вхід користувача**
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Користувач не знайдений" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Невірний пароль" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
});

// **Отримати дані профілю**
app.get("/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (err) {
        res.status(500).json({ msg: "Помилка сервера" });
    }
});

// **Оновлення профілю**
app.put("/profile", authMiddleware, async (req, res) => {
    const { name, email, password } = req.body;
    let updatedFields = {};

    if (name) updatedFields.name = name;
    if (email) updatedFields.email = email;
    if (password) updatedFields.password = await bcrypt.hash(password, 10);

    try {
        const user = await User.findByIdAndUpdate(req.user.id, updatedFields, { new: true }).select("-password");
        res.json(user);
    } catch (err) {
        res.status(500).json({ msg: "Помилка сервера" });
    }
});

app.use(express.static("public"));

const path = require("path");

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});


// **Запуск сервера**
app.listen(PORT, () => console.log(`🚀 Сервер запущений на порті ${PORT}`));
