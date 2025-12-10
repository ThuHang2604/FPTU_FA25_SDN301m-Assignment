const Question = require("../models/question.model");
const Quiz = require("../models/quiz.model"); 

exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.questionId);
    if (!question) return res.status(404).json({ message: "Question not found" });
    res.json(question);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createQuestion = async (req, res) => {
  try {
    // validate basics
    const { quizId, options, correctAnswerIndex, text } = req.body;
    if (!quizId) return res.status(400).json({ message: "quizId is required" });
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const author = req.user._id;

    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ message: "options must be an array with at least 2 items" });
    }
    if (typeof correctAnswerIndex !== "number" || correctAnswerIndex < 0 || correctAnswerIndex >= options.length) {
      return res.status(400).json({ message: "correctAnswerIndex is invalid" });
    }
    if (!text) return res.status(400).json({ message: "text is required" });

    const newQuestion = await Question.create({
        ...req.body,
        author: author // Lưu author
    });

    // push to quiz.questions
    await Quiz.findByIdAndUpdate(quizId, { $push: { questions: newQuestion._id } });

    res.status(201).json({ message: "Question created successfully!", question: newQuestion });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const updated = await Question.findByIdAndUpdate(
      req.params.questionId,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Question not found" });
    res.json({ message: "Question updated successfully!", question: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.questionId);
    if (!question) return res.status(404).json({ message: "Question not found" });

    // remove reference from quiz
    await Quiz.findByIdAndUpdate(question.quizId, { $pull: { questions: question._id } });

    await Question.findByIdAndDelete(req.params.questionId);
    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// create one question for quiz/:quizId
exports.createQuestionByQuizId = async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const author = req.user._id; // Lấy ID user
    const data = { ...req.body, quizId, author };

    if (!Array.isArray(data.options) || data.options.length < 2) {
      return res.status(400).json({ message: "options must be an array with at least 2 items" });
    }
    if (typeof data.correctAnswerIndex !== "number" || data.correctAnswerIndex < 0 || data.correctAnswerIndex >= data.options.length) {
      return res.status(400).json({ message: "correctAnswerIndex is invalid" });
    }

    const newQ = new Question(data);
    await newQ.save();

    await Quiz.findByIdAndUpdate(quizId, { $push: { questions: newQ._id } });

    res.status(201).json({ message: "Question created for quiz", question: newQ });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// create many for quiz/:quizId
exports.createManyQuestionsByQuizId = async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ message: "Request body must be a non-empty array" });
    }

    const questionsData = req.body.map(q => {
      if (!Array.isArray(q.options) || q.options.length < 2) {
        throw new Error("Each question must have options array with at least 2 items");
      }
      if (typeof q.correctAnswerIndex !== "number" || q.correctAnswerIndex < 0 || q.correctAnswerIndex >= q.options.length) {
        throw new Error("Each question must have a valid correctAnswerIndex");
      }
      return { ...q, quizId };
    });

    const createdQuestions = await Question.insertMany(questionsData);

    const questionIds = createdQuestions.map(q => q._id);
    await Quiz.findByIdAndUpdate(quizId, { $push: { questions: { $each: questionIds } } });

    res.status(201).json({
      message: "Multiple questions created",
      count: createdQuestions.length,
      questions: createdQuestions
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
