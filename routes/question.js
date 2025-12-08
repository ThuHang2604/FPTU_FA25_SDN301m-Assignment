const express = require('express');
const router = express.Router();
const axios = require('axios');
const https = require('https'); 

// Cấu hình URL API cơ sở (giống như quiz.js)
const API_BASE_URL = 'http://localhost:5000/api'; 

// Thiết lập Axios Client
const client = axios.create({
    baseURL: API_BASE_URL,
    // httpsAgent: new https.Agent({ rejectUnauthorized: false }) // Bỏ comment nếu dùng HTTPS
});

// Helper function để lấy danh sách Quizzes
const fetchQuizzes = async () => {
    const response = await client.get('/quizzes');
    return response.data;
};

// GET: /questions - Danh sách tất cả Questions
router.get('/', async (req, res) => {
    try {
        const response = await client.get('/questions');
        res.render('question/list.ejs', { 
            questions: response.data, 
            title: 'Quản lý Câu Hỏi' 
        });
    } catch (err) {
        console.error("Lỗi khi lấy danh sách Question:", err.message);
        res.status(500).render('error', { title: 'Lỗi', message: 'Không thể tải danh sách Câu Hỏi.' });
    }
});

// GET: /questions/create - Hiển thị form tạo Question mới
router.get('/create', async (req, res) => {
    try {
        const quizzes = await fetchQuizzes();
        res.render('question/create.ejs', { 
            title: 'Tạo Câu Hỏi Mới', 
            quizzes: quizzes,
            error: null 
        });
    } catch (err) {
        console.error("Lỗi khi lấy danh sách Quiz cho form:", err.message);
        res.status(500).render('error', { title: 'Lỗi', message: 'Không thể tải dữ liệu cần thiết để tạo Câu Hỏi.' });
    }
});

// POST: /questions - Xử lý tạo Question mới
router.post('/', async (req, res) => {
    try {
        // Chuyển đổi options từ chuỗi form thành mảng (dùng dấu phẩy ngăn cách)
        const data = {
            ...req.body,
            options: req.body.options.split(',').map(s => s.trim()),
            correctAnswerIndex: parseInt(req.body.correctAnswerIndex, 10)
        };
        
        await client.post('/questions', data);
        res.redirect('/questions'); 
    } catch (err) {
        const errorMessage = err.response ? (err.response.data.error || 'Lỗi không xác định') : 'Không thể kết nối API.';
        console.error("Lỗi khi tạo Question:", errorMessage);
        const quizzes = await fetchQuizzes();

        res.render('question/create.ejs', { 
            title: 'Tạo Câu Hỏi Mới',
            error: errorMessage,
            quizzes: quizzes,
            question: req.body // Giữ lại dữ liệu form
        });
    }
});

// GET: /questions/:id/details - Hiển thị chi tiết Question
router.get('/:id/details', async (req, res) => {
    try {
        const response = await client.get(`/questions/${req.params.id}`);
        // Lấy thêm thông tin Quiz để hiển thị
        const quizResponse = await client.get(`/quizzes/${response.data.quizId}`);
        
        res.render('question/details.ejs', { 
            question: response.data, 
            quiz: quizResponse.data,
            title: `Chi tiết Câu Hỏi: ${response.data.text.substring(0, 30)}...` 
        });
    } catch (err) {
        console.error("Lỗi khi lấy chi tiết Question:", err.message);
        res.status(404).render('error', { title: 'Không tìm thấy', message: 'Không tìm thấy Câu Hỏi này.' });
    }
});

// GET: /questions/:id/edit - Hiển thị form chỉnh sửa Question
router.get('/:id/edit', async (req, res) => {
    try {
        const [questionResponse, quizzes] = await Promise.all([
            client.get(`/questions/${req.params.id}`),
            fetchQuizzes()
        ]);

        const question = questionResponse.data;
        // Chuyển mảng options thành chuỗi để hiển thị trong form
        question.optionsString = question.options.join(', ');

        res.render('question/edit.ejs', { 
            question: question, 
            quizzes: quizzes,
            title: `Sửa Câu Hỏi`,
            error: null
        });
    } catch (err) {
        console.error("Lỗi khi lấy Question để sửa:", err.message);
        res.status(404).render('error', { title: 'Không tìm thấy', message: 'Không tìm thấy Câu Hỏi để sửa.' });
    }
});

// POST (hoặc PUT với method-override): /questions/:id - Xử lý chỉnh sửa Question
router.put('/:id', async (req, res) => {
    const questionId = req.params.id;
    try {
        const data = {
            ...req.body,
            options: req.body.options.split(',').map(s => s.trim()),
            correctAnswerIndex: parseInt(req.body.correctAnswerIndex, 10)
        };
        
        await client.put(`/questions/${questionId}`, data);
        res.redirect(`/questions/${questionId}/details`); 
    } catch (err) {
        const errorMessage = err.response ? (err.response.data.error || 'Lỗi không xác định') : 'Không thể kết nối API.';
        console.error("Lỗi khi cập nhật Question:", errorMessage);
        
        const quizzes = await fetchQuizzes();
        const question = { _id: questionId, ...req.body, optionsString: req.body.options };

        res.render('question/edit.ejs', {
            title: 'Sửa Câu Hỏi',
            error: errorMessage,
            quizzes: quizzes,
            question: question
        });
    }
});

// POST (hoặc DELETE với method-override): /questions/:id - Xử lý xóa Question
router.delete('/:id', async (req, res) => {
    try {
        await client.delete(`/questions/${req.params.id}`);
        res.redirect('/questions'); 
    } catch (err) {
        console.error("Lỗi khi xóa Question:", err.message);
        res.redirect('/questions'); 
    }
});

module.exports = router;
