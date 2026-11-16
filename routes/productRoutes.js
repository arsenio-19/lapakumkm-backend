const express = require('express');
const router = express.Router();

const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

const {
    authenticateToken,
    authorizeRole
} = require('../middleware/authMiddleware');

const upload = require('../middleware/uploadMiddleware');

// PUBLIC
router.get('/', getProducts);
router.get('/:id', getProductById);

// SELLER & ADMIN
router.post(
    '/',
    authenticateToken,
    authorizeRole('seller', 'admin'),
    upload.single('image'),
    createProduct
);

router.put(
    '/:id',
    authenticateToken,
    authorizeRole('seller', 'admin'),
    upload.single('image'),
    updateProduct
);

router.delete(
    '/:id',
    authenticateToken,
    authorizeRole('seller', 'admin'),
    deleteProduct
);

module.exports = router;