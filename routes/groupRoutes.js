const express = require('express');
const router = express.Router();
const { createGroup, getAllGroups } = require('../controllers/groupController');

router.post('/create', createGroup); // Route to create a new group
router.get('/', getAllGroups); // Route to get all groups

module.exports = router;