const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quiz.controller");
const questionController = require("../controllers/question.controller");

router.get("/", quizController.getAllQuizzes);
router.get("/:quizId", quizController.getQuizById);
router.post("/", quizController.createQuiz);
router.put("/:quizId", quizController.updateQuiz);
router.delete("/:quizId", quizController.deleteQuiz);
router.get("/:quizId/populate", quizController.getQuizQuestionsWithCapital);
router.post("/:quizId/question", questionController.createQuestionByQuizId);
router.post("/:quizId/questions", questionController.createManyQuestionsByQuizId);


module.exports = router;
