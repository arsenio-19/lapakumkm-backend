const db = require('../config/database');

// Membuat atau mengambil keranjang pembeli
const getOrCreateCart = async (buyerId) => {
    const result = await db.query(
        `INSERT INTO carts (buyer_id)
         VALUES ($1)
         ON CONFLICT (buyer_id)
         DO UPDATE SET updated_at = CURRENT_TIMESTAMP
         RETURNING id`,
        [buyerId]
    );

    return result.rows[0].id;
};

// 1. Melihat isi keranjang
const getCart = async (req, res) => {
    try {
        const cartId = await getOrCreateCart(req.user.id);

        const result = await db.query(
            `SELECT
                ci.id,
                ci.product_id,
                p.name,
                p.description,
                p.price,
                p.image,
                p.stock,
                ci.quantity,
                (p.price * ci.quantity) AS subtotal
             FROM cart_items ci
             JOIN products p ON ci.product_id = p.id
             WHERE ci.cart_id = $1
             ORDER BY ci.id DESC`,
            [cartId]
        );

        const total = result.rows.reduce(
            (sum, item) => sum + Number(item.subtotal),
            0
        );

        return res.status(200).json({
            success: true,
            message: 'Berhasil mengambil keranjang.',
            data: {
                items: result.rows,
                total_items: result.rows.length,
                total_price: total
            }
        });

    } catch (error) {
        console.error('Get Cart Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Gagal mengambil keranjang.'
        });
    }
};

// 2. Menambahkan produk ke keranjang
const addToCart = async (req, res) => {
    try {
        const { product_id, quantity } = req.body;

        const productId = Number(product_id);
        const productQuantity = quantity === undefined ? 1 : Number(quantity);

        if (
            !Number.isInteger(productId) ||
            productId <= 0 ||
            !Number.isInteger(productQuantity) ||
            productQuantity <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: 'ID produk dan jumlah harus berupa angka positif.'
            });
        }

        const product = await db.query(
            'SELECT id, name, price, stock FROM products WHERE id = $1',
            [productId]
        );

        if (product.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Produk tidak ditemukan.'
            });
        }

        const cartId = await getOrCreateCart(req.user.id);

        const existingItem = await db.query(
            `SELECT quantity
             FROM cart_items
             WHERE cart_id = $1 AND product_id = $2`,
            [cartId, productId]
        );

        const currentQuantity = existingItem.rows.length > 0
            ? existingItem.rows[0].quantity
            : 0;

        if (currentQuantity + productQuantity > product.rows[0].stock) {
            return res.status(400).json({
                success: false,
                message: 'Jumlah produk melebihi stok yang tersedia.'
            });
        }

        await db.query(
            `INSERT INTO cart_items (cart_id, product_id, quantity)
             VALUES ($1, $2, $3)
             ON CONFLICT (cart_id, product_id)
             DO UPDATE SET
                quantity = cart_items.quantity + EXCLUDED.quantity,
                updated_at = CURRENT_TIMESTAMP`,
            [cartId, productId, productQuantity]
        );

        return res.status(201).json({
            success: true,
            message: 'Produk berhasil ditambahkan ke keranjang.'
        });

    } catch (error) {
        console.error('Add Cart Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Gagal menambahkan produk ke keranjang.'
        });
    }
};

// 3. Mengubah jumlah produk
const updateCartItem = async (req, res) => {
    try {
        const itemId = Number(req.params.id);
        const quantity = Number(req.body.quantity);

        if (
            !Number.isInteger(itemId) ||
            itemId <= 0 ||
            !Number.isInteger(quantity) ||
            quantity <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: 'ID item dan jumlah harus berupa angka positif.'
            });
        }

        const cartId = await getOrCreateCart(req.user.id);

        const item = await db.query(
            `SELECT ci.id, p.stock
             FROM cart_items ci
             JOIN products p ON ci.product_id = p.id
             WHERE ci.id = $1 AND ci.cart_id = $2`,
            [itemId, cartId]
        );

        if (item.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Produk tidak ditemukan dalam keranjang.'
            });
        }

        if (quantity > item.rows[0].stock) {
            return res.status(400).json({
                success: false,
                message: 'Jumlah melebihi stok yang tersedia.'
            });
        }

        await db.query(
            `UPDATE cart_items
             SET quantity = $1,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $2 AND cart_id = $3`,
            [quantity, itemId, cartId]
        );

        return res.status(200).json({
            success: true,
            message: 'Jumlah produk berhasil diperbarui.'
        });

    } catch (error) {
        console.error('Update Cart Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Gagal memperbarui keranjang.'
        });
    }
};

// 4. Menghapus produk dari keranjang
const removeCartItem = async (req, res) => {
    try {
        const itemId = Number(req.params.id);

        if (!Number.isInteger(itemId) || itemId <= 0) {
            return res.status(400).json({
                success: false,
                message: 'ID item tidak valid.'
            });
        }

        const cartId = await getOrCreateCart(req.user.id);

        const result = await db.query(
            `DELETE FROM cart_items
             WHERE id = $1 AND cart_id = $2
             RETURNING id`,
            [itemId, cartId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Produk tidak ditemukan dalam keranjang.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Produk berhasil dihapus dari keranjang.'
        });

    } catch (error) {
        console.error('Remove Cart Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Gagal menghapus produk dari keranjang.'
        });
    }
};

// 5. Mengosongkan keranjang
const clearCart = async (req, res) => {
    try {
        const cartId = await getOrCreateCart(req.user.id);

        await db.query(
            'DELETE FROM cart_items WHERE cart_id = $1',
            [cartId]
        );

        return res.status(200).json({
            success: true,
            message: 'Keranjang berhasil dikosongkan.'
        });

    } catch (error) {
        console.error('Clear Cart Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Gagal mengosongkan keranjang.'
        });
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart
};