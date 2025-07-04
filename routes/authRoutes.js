const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

router.post('/register', registerUser); // Route to register a new user
router.post('/login', loginUser); // Route to login an existing user

module.exports = router;