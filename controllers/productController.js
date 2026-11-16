const db = require('../config/database');

// GET ALL PRODUCTS
const getProducts = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT
                p.*,
                u.name AS seller_name,
                c.name AS category_name
            FROM products p
            JOIN users u ON p.seller_id = u.id
            LEFT JOIN product_categories c ON p.category_id = c.id
            ORDER BY p.id DESC
        `);

        res.status(200).json({
            success: true,
            message: 'Berhasil mengambil produk.',
            data: result.rows
        });

    } catch (error) {
        console.error('Get Products Error:', error);

        res.status(500).json({
            success: false,
            message: 'Gagal mengambil produk.'
        });
    }
};

// GET PRODUCT BY ID
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(`
            SELECT
                p.*,
                u.name AS seller_name,
                c.name AS category_name
            FROM products p
            JOIN users u ON p.seller_id = u.id
            LEFT JOIN product_categories c ON p.category_id = c.id
            WHERE p.id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Produk tidak ditemukan.'
            });
        }

        res.status(200).json({
            success: true,
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Get Product Error:', error);

        res.status(500).json({
            success: false,
            message: 'Gagal mengambil detail produk.'
        });
    }
};

// CREATE PRODUCT
const createProduct = async (req, res) => {
    try {
        const {
            category_id,
            name,
            description,
            price,
            stock
        } = req.body;

        if (!name || !name.trim() || price === undefined || stock === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Nama, harga, dan stok wajib diisi.'
            });
        }

        const productPrice = Number(price);
        const productStock = Number(stock);
        const categoryId = category_id ? Number(category_id) : null;

        if (!Number.isFinite(productPrice) || productPrice < 0 ||
            !Number.isInteger(productStock) || productStock < 0) {
            return res.status(400).json({
                success: false,
                message: 'Harga atau stok tidak valid.'
            });
        }

        if (categoryId !== null && (!Number.isInteger(categoryId) || categoryId <= 0)) {
            return res.status(400).json({
                success: false,
                message: 'Kategori tidak valid.'
            });
        }

        const image = req.file ? req.file.filename : null;

        const result = await db.query(`
            INSERT INTO products
            (seller_id, category_id, name, description, price, stock, image)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `, [
            req.user.id,
            categoryId,
            name.trim(),
            description || null,
            productPrice,
            productStock,
            image
        ]);

        res.status(201).json({
            success: true,
            message: 'Produk berhasil ditambahkan.',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Create Product Error:', error);

        res.status(500).json({
            success: false,
            message: 'Gagal menambahkan produk.'
        });
    }
};

// UPDATE PRODUCT
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const existing = await db.query(
            'SELECT * FROM products WHERE id = $1',
            [id]
        );

        if (existing.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Produk tidak ditemukan.'
            });
        }

        const product = existing.rows[0];

        if (req.user.role !== 'admin' && product.seller_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Kamu hanya dapat mengedit produk milik sendiri.'
            });
        }

        const categoryId = req.body.category_id !== undefined
            ? (req.body.category_id ? Number(req.body.category_id) : null)
            : product.category_id;

        const name = req.body.name ?? product.name;
        const description = req.body.description ?? product.description;
        const price = req.body.price !== undefined
            ? Number(req.body.price)
            : Number(product.price);
        const stock = req.body.stock !== undefined
            ? Number(req.body.stock)
            : product.stock;

        if (!name || !name.trim() ||
            !Number.isFinite(price) || price < 0 ||
            !Number.isInteger(stock) || stock < 0) {
            return res.status(400).json({
                success: false,
                message: 'Data produk tidak valid.'
            });
        }

        if (categoryId !== null &&
            (!Number.isInteger(categoryId) || categoryId <= 0)) {
            return res.status(400).json({
                success: false,
                message: 'Kategori tidak valid.'
            });
        }

        const image = req.file ? req.file.filename : product.image;

        const result = await db.query(`
            UPDATE products
            SET category_id = $1,
                name = $2,
                description = $3,
                price = $4,
                stock = $5,
                image = $6,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $7
            RETURNING *
        `, [
            categoryId,
            name.trim(),
            description,
            price,
            stock,
            image,
            id
        ]);

        res.status(200).json({
            success: true,
            message: 'Produk berhasil diperbarui.',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Update Product Error:', error);

        res.status(500).json({
            success: false,
            message: 'Gagal memperbarui produk.'
        });
    }
};

// DELETE PRODUCT
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const existing = await db.query(
            'SELECT seller_id FROM products WHERE id = $1',
            [id]
        );

        if (existing.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Produk tidak ditemukan.'
            });
        }

        if (req.user.role !== 'admin' &&
            existing.rows[0].seller_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Kamu hanya dapat menghapus produk milik sendiri.'
            });
        }

        await db.query(
            'DELETE FROM products WHERE id = $1',
            [id]
        );

        res.status(200).json({
            success: true,
            message: 'Produk berhasil dihapus.'
        });

    } catch (error) {
        console.error('Delete Product Error:', error);

        res.status(500).json({
            success: false,
            message: 'Gagal menghapus produk.'
        });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};