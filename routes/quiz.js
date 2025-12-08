const express = require('express');
const router = express.Router();
const axios = require('axios');
const https = require('https'); // Cần cho cấu hình bỏ qua chứng chỉ nếu dùng HTTPS

// Cấu hình URL API cơ sở
// *Thay đổi PORT và giao thức (http/https) nếu API của bạn chạy khác*
const API_BASE_URL = 'http://localhost:5000/api'; 

// Thiết lập Axios Client
const client = axios.create({
    baseURL: API_BASE_URL,
    // Nếu bạn đang dùng HTTPS cục bộ và gặp lỗi self-signed certificate, 
    // hãy dùng httpsAgent như sau. Nếu dùng HTTP thì bỏ qua.
    // httpsAgent: new https.Agent({ rejectUnauthorized: false }) 
});

// GET: /quizzes - Danh sách tất cả Quizzes
router.get('/', async (req, res) => {
    try {
        const response = await client.get('/quizzes');
        res.render('quiz/list.ejs', { 
            quizzes: response.data, 
            title: 'Quản lý Quizzes' 
        });
    } catch (err) {
        console.error("Lỗi khi lấy danh sách Quiz:", err.message);
        // Có thể render một trang lỗi chung
        res.status(500).render('error', { title: 'Lỗi', message: 'Không thể tải danh sách Quiz.' });
    }
});

// GET: /quizzes/create - Hiển thị form tạo Quiz mới
router.get('/create', (req, res) => {
    res.render('quiz/create.ejs', { title: 'Tạo Quiz Mới', error: null });
});

// POST: /quizzes - Xử lý tạo Quiz mới
router.post('/', async (req, res) => {
    try {
        const { title, description } = req.body;
        await client.post('/quizzes', { title, description });
        res.redirect('/quizzes'); 
    } catch (err) {
        const errorMessage = err.response ? (err.response.data.error || 'Lỗi không xác định') : 'Không thể kết nối API.';
        console.error("Lỗi khi tạo Quiz:", errorMessage);
        // Render lại form kèm theo thông báo lỗi
        res.render('quiz/create.ejs', { 
            title: 'Tạo Quiz Mới',
            error: errorMessage,
            // Giữ lại giá trị cũ của form để người dùng không phải nhập lại
            quiz: req.body 
        });
    }
});

// GET: /quizzes/:id/details - Hiển thị chi tiết Quiz (bao gồm câu hỏi)
router.get('/:id/details', async (req, res) => {
    try {
        // API controller đã tự động populate questions
        const response = await client.get(`/quizzes/${req.params.id}`); 
        res.render('quiz/details.ejs', { 
            quiz: response.data, 
            title: `Chi tiết Quiz: ${response.data.title}` 
        });
    } catch (err) {
        console.error("Lỗi khi lấy chi tiết Quiz:", err.message);
        res.status(404).render('error', { title: 'Không tìm thấy', message: 'Không tìm thấy Quiz này.' });
    }
});

// GET: /quizzes/:id/edit - Hiển thị form chỉnh sửa Quiz
router.get('/:id/edit', async (req, res) => {
    try {
        const response = await client.get(`/quizzes/${req.params.id}`);
        res.render('quiz/edit.ejs', { 
            quiz: response.data, 
            title: `Sửa Quiz: ${response.data.title}`,
            error: null
        });
    } catch (err) {
        console.error("Lỗi khi lấy Quiz để sửa:", err.message);
        res.status(404).render('error', { title: 'Không tìm thấy', message: 'Không tìm thấy Quiz để sửa.' });
    }
});

// POST (hoặc PUT với method-override): /quizzes/:id - Xử lý chỉnh sửa Quiz
router.put('/:id', async (req, res) => {
    const quizId = req.params.id;
    try {
        const { title, description } = req.body;
        await client.put(`/quizzes/${quizId}`, { title, description });
        res.redirect(`/quizzes/${quizId}/details`); 
    } catch (err) {
        const errorMessage = err.response ? (err.response.data.error || 'Lỗi không xác định') : 'Không thể kết nối API.';
        console.error("Lỗi khi cập nhật Quiz:", errorMessage);
        // Lấy lại dữ liệu quiz cũ (chỉ cần id) để render form lỗi
        const quiz = { _id: quizId, ...req.body };
        res.render('quiz/edit.ejs', {
            title: 'Sửa Quiz',
            error: errorMessage,
            quiz: quiz
        });
    }
});

// POST (hoặc DELETE với method-override): /quizzes/:id - Xử lý xóa Quiz
router.delete('/:id', async (req, res) => {
    try {
        await client.delete(`/quizzes/${req.params.id}`);
        res.redirect('/quizzes'); 
    } catch (err) {
        console.error("Lỗi khi xóa Quiz:", err.message);
        // Có thể chuyển hướng về trang danh sách với một thông báo lỗi flash (nếu dùng session)
        res.redirect('/quizzes'); 
    }
});

module.exports = router;