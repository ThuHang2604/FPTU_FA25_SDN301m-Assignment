const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const { engine } = require("express-handlebars"); // 👈 Đã thêm import engine
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// Middleware (giữ nguyên)
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(methodOverride('_method')); 

// Static files (giữ nguyên)
app.use(express.static(path.join(__dirname, 'public')));

// ------------------------------------------
// 1. Thiết lập Handlebars làm View Engine chính
// ------------------------------------------
app.engine('.hbs', engine({
    extname: '.hbs', 
    defaultLayout: 'main', 
    layoutsDir: path.join(__dirname, 'views/layouts'), 
    partialsDir: path.join(__dirname, 'views/partials'), 
}));

app.set('view engine', '.hbs'); // Đặt HBS là mặc định
app.set('views', path.join(__dirname, 'views')); // Đặt thư mục views
// ------------------------------------------

// Vì EJS là engine mặc định của Express cho đuôi .ejs, ta chỉ cần gọi view bằng đuôi.

// Routes (giữ nguyên)
app.use("/", require("./routes/index"));
app.use("/quizzes", require("./routes/quiz"));
app.use("/questions", require("./routes/question"));
app.use("/api/quizzes", require("./routes/quiz.routes"));
app.use("/api/questions", require("./routes/question.routes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`⭕️ Server running on port ${PORT}`));