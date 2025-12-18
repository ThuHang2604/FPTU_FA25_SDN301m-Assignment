const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/quizzes", require("./routes/quiz.routes"));
app.use("/questions", require("./routes/question.routes"));
app.use("/users", require("./routes/user.routes"));
app.use("/auth", require("./routes/auth.routes"));

app.use((err, req, res, next) => {
    // Lấy status code từ lỗi (nếu có), mặc định là 500
    const statusCode = err.status || 500;
    
    // Trả về JSON thay vì HTML/Stack trace
    res.status(statusCode).json({
        message: err.message || "Internal Server Error",
        // (Tùy chọn) Chỉ hiện stack trace nếu đang ở môi trường development
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`⭕️ Server running on port ${PORT}`));

module.exports = app;
