const express = require('express');
const router = express.Router();
const { createUser, getAllUsers } = require('../controllers/userController');

router.post('/create', createUser); // Route to create a new user
router.get('/', getAllUsers); // Route to get all users

module.exports = router;