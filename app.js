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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`⭕️ Server running on port ${PORT}`));
