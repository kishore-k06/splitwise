const express = require('express');
const router = express.Router();
const { createGroup, getMyGroups, getGroupBalance, getSettlementPlan } = require('../controllers/groupController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create', authMiddleware, createGroup); // Route to create a new group
router.get('/', authMiddleware, getMyGroups); // Route to get all groups
router.get('/:id/balance', authMiddleware, getGroupBalance); // Route to get group balance
router.get('/:groupId/settlements', authMiddleware, getSettlementPlan); // Route to get settlement plan for a group

module.exports = router;