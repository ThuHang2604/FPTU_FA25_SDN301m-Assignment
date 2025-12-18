const express = require("express");
const router = express.Router();
const questionController = require("../controllers/question.controller");
const authenticate = require("../middlewares/authenticate"); 

router.get("/", questionController.getAllQuestions);
router.get("/:questionId", questionController.getQuestionById);
router.post("/", authenticate.verifyUser, questionController.createQuestion);
router.put("/:questionId", authenticate.verifyUser, authenticate.verifyAuthor, questionController.updateQuestion);
router.delete("/:questionId", authenticate.verifyUser, authenticate.verifyAuthor, questionController.deleteQuestion);

module.exports = router;
