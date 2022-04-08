const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');

// Register
router.post('/register', userController.register);
// Login
router.post('/login', userController.login);
// Logout
router.get('/logout/:id', userController.logout);
// Refresh token
router.get('/refreshToken', userController.refreshToken);

module.exports = router;
