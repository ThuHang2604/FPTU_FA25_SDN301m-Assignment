const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const { engine } = require("express-handlebars"); // 👈 Import Handlebars
const connectDB = require("./config/db");

dotenv.config();
connectDB();

// Thêm các hàm helper
const hbsHelpers = {
    // Helper để kiểm tra nếu hai giá trị bằng nhau (Dùng cho form select/option)
    eq: function (v1, v2) {
        return v1.toString() === v2.toString();
    },
    // Helper để kiểm tra index đáp án (Dùng cho chi tiết Question)
    isCorrect: function (currentIndex, correctIndex, options) {
        return currentIndex === correctIndex;
    }
};

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
// Thiết lập View Engine là Handlebars (với Helpers)
// ------------------------------------------
app.engine('.hbs', engine({
    extname: '.hbs', 
    defaultLayout: 'main', 
    layoutsDir: path.join(__dirname, 'views/layouts'), 
    partialsDir: path.join(__dirname, 'views/partials'), 
    helpers: hbsHelpers // 👈 Thêm helpers vào đây
}));

app.set('view engine', '.hbs'); // Đặt View Engine mặc định là Handlebars
app.set('views', path.join(__dirname, 'views')); 
// ------------------------------------------

// Routes (Giữ nguyên việc sử dụng các file UI Routes cũ, nhưng giờ chúng render HBS)
app.use("/", require("./routes/index"));
app.use("/quizzes", require("./routes/quiz")); 
app.use("/questions", require("./routes/question")); 

// API Routes (Giữ nguyên)
app.use("/api/quizzes", require("./routes/quiz.routes")); 
app.use("/api/questions", require("./routes/question.routes")); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`⭕️ Server running on port ${PORT}`));