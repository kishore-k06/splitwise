const express = require('express');
const router = express.Router();
const { createGroup, getAllGroups, getGroupBalance } = require('../controllers/groupController');

router.post('/create', createGroup); // Route to create a new group
router.get('/', getAllGroups); // Route to get all groups
router.get('/:id/balance', getGroupBalance); // Route to get group balance

module.exports = router;