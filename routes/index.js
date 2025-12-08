const express = require("express");
const router = express.Router();

// Trang chủ
router.get('/', (req, res) => {
    res.render('index', { title: 'Trang Chủ' });
});

module.exports = router;