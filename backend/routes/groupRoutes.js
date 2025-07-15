const express = require('express');
const router = express.Router();
const { createGroup, getMyGroups, getGroupMembers, getGroupById, deleteGroup, getGroupBalance, getSettlementPlan } = require('../controllers/groupController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create', authMiddleware, createGroup); // Route to create a new group
router.get('/', authMiddleware, getMyGroups); // Route to get all groups
router.get('/:id', authMiddleware, getGroupById); // Route to get group by ID
router.delete('/:groupId/delete', authMiddleware, deleteGroup); // Route to delete a group
router.get('/:id/members', authMiddleware, getGroupMembers); // Route to get members of a group
router.get('/:id/balance', authMiddleware, getGroupBalance); // Route to get group balance
router.get('/:groupId/settlements', authMiddleware, getSettlementPlan); // Route to get settlement plan for a group

module.exports = router;