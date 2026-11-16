const express = require('express');
const router = express.Router();

const {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart
} = require('../controllers/cartController');

const {
    authenticateToken,
    authorizeRole
} = require('../middleware/authMiddleware');

// Semua fitur keranjang hanya untuk pembeli
router.use(authenticateToken, authorizeRole('buyer'));

// Melihat isi keranjang
router.get('/', getCart);

// Menambahkan produk
router.post('/items', addToCart);

// Mengubah jumlah produk
router.put('/items/:id', updateCartItem);

// Menghapus produk tertentu
router.delete('/items/:id', removeCartItem);

// Mengosongkan keranjang
router.delete('/clear', clearCart);

module.exports = router;