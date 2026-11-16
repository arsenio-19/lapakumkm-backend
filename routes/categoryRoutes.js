const express = require('express');
const router = express.Router();

const {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');

const {
    authenticateToken,
    authorizeRole
} = require('../middleware/authMiddleware');

// PUBLIC
router.get('/', getCategories);
router.get('/:id', getCategoryById);

// SELLER & ADMIN
router.post('/', authenticateToken, authorizeRole('seller', 'admin'), createCategory);
router.put('/:id', authenticateToken, authorizeRole('seller', 'admin'), updateCategory);
router.delete('/:id', authenticateToken, authorizeRole('seller', 'admin'), deleteCategory);

module.exports = router;