const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path"); // 👈 Cần để làm việc với đường dẫn views, public
const bodyParser = require("body-parser"); // 👈 Cần cho form data
const methodOverride = require("method-override"); // 👈 Cần cho PUT/DELETE trong form
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); // 👈 Xử lý form submissions
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(methodOverride('_method')); // 👈 Cho phép PUT và DELETE trong form

// Static files (public folder)
app.use(express.static(path.join(__dirname, 'public')));

// Thiết lập View Engine là EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Đặt thư mục views

// ------------------------------------------
// 1. Routes cho Giao diện người dùng (UI Routes) - Dùng để render EJS
app.use("/", require("./routes/index"));
app.use("/quizzes", require("./routes/quiz")); // <-- File UI mới
app.use("/questions", require("./routes/question")); // <-- File UI mới

// ------------------------------------------
// 2. Routes cho API (API Endpoints) - Trả về JSON, nên có tiền tố /api
app.use("/api/quizzes", require("./routes/quiz.routes")); // <-- File API cũ, giờ có tiền tố /api
app.use("/api/questions", require("./routes/question.routes")); // <-- File API cũ, giờ có tiền tố /api

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`⭕️ Server running on port ${PORT}`));