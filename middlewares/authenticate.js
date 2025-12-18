// authenticate.js
const jwt = require('jsonwebtoken'); 
const User = require('../models/user.model');
const Question = require('../models/question.model');

// Hàm verifyUser (Giả định đã có theo đề bài - đây là implementation mẫu dùng JWT)
exports.verifyUser = (req, res, next) => {
    // Lấy token từ header (VD: Bearer token...)
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        const err = new Error('You are not authenticated!');
        err.status = 401;
        return next(err);
    }
    
    // Giả sử dùng Bearer token, bạn có thể tùy chỉnh lại theo logic login của bạn
    const token = authHeader.split(' ')[1]; 
    
    // SECRET_KEY nên để trong .env
    const secretKey = process.env.SECRET_KEY || "12345-67890-09876-54321"; 

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            const err = new Error('You are not authenticated!');
            err.status = 401;
            return next(err);
        } else {
            // Load user vào req (Theo yêu cầu [cite: 34])
            User.findById(decoded._id) // Giả sử payload token chứa _id
                .then(user => {
                    req.user = user; 
                    next();
                })
                .catch(err => next(err));
        }
    });
};

// TASK 1: Hàm verifyAdmin
exports.verifyAdmin = (req, res, next) => {
    // Kiểm tra user đã được load từ verifyUser chưa và check cờ admin
    if (req.user && req.user.admin === true) {
        next(); // Là Admin, cho phép đi tiếp [cite: 38]
    } else {
        const err = new Error("You are not authorized to perform this operation!");
        err.status = 403;
        return next(err); // Không phải Admin, trả lỗi 403 [cite: 40]
    }
};

// TASK 1: Hàm verifyAuthor (Dùng cho Question)
exports.verifyAuthor = async (req, res, next) => {
    try {
        const questionId = req.params.questionId;
        const question = await Question.findById(questionId);
        
        if (!question) {
            const err = new Error("Question not found");
            err.status = 404;
            return next(err);
        }

        // So sánh ID tác giả và ID user đang đăng nhập [cite: 43]
        if (question.author && question.author.equals(req.user._id)) {
            next(); // Khớp, cho phép đi tiếp
        } else {
            const err = new Error("You are not the author of this question");
            err.status = 403;
            return next(err); // Không khớp [cite: 44]
        }
    } catch (err) {
        next(err);
    }
};