// controllers/auth.controller.js
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// SECRET_KEY: Trong thực tế nên để trong file .env
// Ví dụ: process.env.SECRET_KEY
const SECRET_KEY = process.env.SECRET_KEY;

exports.signup = async (req, res, next) => {
  try {
    const { username, password, admin } = req.body;

    // 1. Kiểm tra username đã tồn tại chưa
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists!" });
    }

    // 2. Mã hóa mật khẩu (Hashing)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Tạo user mới
    // Lưu ý: Cho phép set admin từ body để thuận tiện test bài tập.
    // Thực tế sẽ không cho phép client tự set quyền admin.
    const newUser = new User({
      username,
      password: hashedPassword,
      admin: admin || false 
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // 1. Tìm user theo username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Authentication failed. User not found." });
    }

    // 2. So sánh mật khẩu (nhập vào) với mật khẩu đã mã hóa (trong DB)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Authentication failed. Wrong password." });
    }

    // 3. Nếu đúng, tạo Token
    // Payload chứa _id để verifyUser có thể tìm ra user
    const token = jwt.sign(
      { _id: user._id, admin: user.admin }, 
      SECRET_KEY, 
      { expiresIn: "2h" } // Token hết hạn sau 2 giờ
    );

    res.json({
      message: "Login successful!",
      token: token,
      admin: user.admin
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};