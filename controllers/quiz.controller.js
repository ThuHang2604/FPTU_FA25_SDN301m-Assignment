const Quiz = require("../models/quiz.model");
const Question = require("../models/question.model");

exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate("questions");
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId).populate("questions");
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createQuiz = async (req, res) => {
  try {
    const newQuiz = await Quiz.create(req.body);
    res.status(201).json({ message: "Quiz created successfully!", quiz: newQuiz });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const updated = await Quiz.findByIdAndUpdate(
      req.params.quizId,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Quiz not found" });
    res.json({ message: "Quiz updated successfully!", quiz: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    const quizId = req.params.quizId;
    await Question.deleteMany({ quizId });
    await Quiz.findByIdAndDelete(quizId);
    res.json({ message: "Quiz and related questions deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getQuizQuestionsWithCapital = async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const quiz = await Quiz.findById(quizId).populate("questions");

    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const filteredQuestions = quiz.questions.filter((q) => {
      const keywordMatch = Array.isArray(q.keywords) && q.keywords.some(k =>
        k.toLowerCase().includes("capital")
      );
      const textMatch = q.text && q.text.toLowerCase().includes("capital");
      const optionMatch = Array.isArray(q.options) && q.options.some(o =>
        o.toLowerCase().includes("capital")
      );
      return keywordMatch || textMatch || optionMatch;
    });

    res.json({
      quizId,
      totalMatched: filteredQuestions.length,
      questions: filteredQuestions
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
