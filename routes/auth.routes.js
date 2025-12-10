// routes/auth.routes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// Định nghĩa các endpoint cho auth
router.post("/signup", authController.signup);
router.post("/login", authController.login);

module.exports = router;