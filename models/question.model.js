const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
  },
  keywords: {
    type: [String],
    default: []
  },
  correctAnswerIndex: {
    type: Number,
    required: true
  },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model("Question", QuestionSchema);
