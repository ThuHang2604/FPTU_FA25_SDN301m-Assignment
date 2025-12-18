// controllers/user.controller.js
const User = require('../models/user.model');

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({});
        res.json(users); 
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};