const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

// KẾT NỐI DB: Bỏ dòng connectDB() ở đây đi để tránh lỗi async
// connectDB(); <--- XÓA HOẶC COMMENT DÒNG NÀY

const app = express();
app.use(cors());
app.use(express.json());

// KẾT NỐI DB TRƯỚC KHI XỬ LÝ REQUEST
// Middleware này đảm bảo DB luôn kết nối khi có request tới
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

app.get("/", (req, res) => {
    res.send("✅ Hello! Quiz App API is running...");
});

// Routes
app.use("/quizzes", require("./routes/quiz.routes"));
app.use("/questions", require("./routes/question.routes"));
app.use("/users", require("./routes/user.routes"));
app.use("/auth", require("./routes/auth.routes"));

// Error Handling
app.use((err, req, res, next) => {
    const statusCode = err.status || 500;
    res.status(statusCode).json({
        message: err.message || "Internal Server Error",
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// CHỈ CHẠY LISTEN KHI Ở LOCALHOST (Không chạy trên Vercel)
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    connectDB().then(() => {
        app.listen(PORT, () => console.log(`⭕️ Server running on port ${PORT}`));
    });
}

// XUẤT APP CHO VERCEL
module.exports = app;