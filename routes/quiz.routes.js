const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quiz.controller");
const questionController = require("../controllers/question.controller");
const authenticate = require("../middlewares/authenticate"); 

router.get("/", quizController.getAllQuizzes);
router.get("/:quizId", quizController.getQuizById);
router.post("/", authenticate.verifyUser, authenticate.verifyAdmin, quizController.createQuiz);
router.put("/:quizId", authenticate.verifyUser, authenticate.verifyAdmin, quizController.updateQuiz);
router.delete("/:quizId", authenticate.verifyUser, authenticate.verifyAdmin, quizController.deleteQuiz);
router.get("/:quizId/populate", quizController.getQuizQuestionsWithCapital);
router.post("/:quizId/question", authenticate.verifyUser, questionController.createQuestionByQuizId);
router.post("/:quizId/questions", authenticate.verifyUser, questionController.createManyQuestionsByQuizId);


module.exports = router;
