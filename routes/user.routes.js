// routes/user.routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authenticate = require('../middlewares/authenticate');

// GET /users: Chỉ Admin mới được truy cập [cite: 51, 67, 68]
router.get('/', authenticate.verifyUser, authenticate.verifyAdmin, userController.getAllUsers);

module.exports = router;