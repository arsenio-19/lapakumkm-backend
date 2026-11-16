const db = require('../config/database');

// GET ALL CATEGORIES
const getCategories = async (req, res) => {
    try {
        const result = await db.query(
            `SELECT * FROM product_categories
             ORDER BY id DESC`
        );

        res.status(200).json({
            success: true,
            message: 'Berhasil mengambil kategori.',
            data: result.rows
        });

    } catch (error) {
        console.error('Get Categories Error:', error);

        res.status(500).json({
            success: false,
            message: 'Gagal mengambil kategori.'
        });
    }
};

// GET CATEGORY BY ID
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            'SELECT * FROM product_categories WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Kategori tidak ditemukan.'
            });
        }

        res.status(200).json({
            success: true,
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Get Category Error:', error);

        res.status(500).json({
            success: false,
            message: 'Gagal mengambil kategori.'
        });
    }
};

// CREATE CATEGORY
const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Nama kategori wajib diisi.'
            });
        }

        const result = await db.query(
            `INSERT INTO product_categories (name, description)
             VALUES ($1, $2)
             RETURNING *`,
            [name.trim(), description || null]
        );

        res.status(201).json({
            success: true,
            message: 'Kategori berhasil ditambahkan.',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Create Category Error:', error);

        res.status(500).json({
            success: false,
            message: 'Gagal menambahkan kategori.'
        });
    }
};

// UPDATE CATEGORY
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Nama kategori wajib diisi.'
            });
        }

        const result = await db.query(
            `UPDATE product_categories
             SET name = $1, description = $2
             WHERE id = $3
             RETURNING *`,
            [name.trim(), description || null, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Kategori tidak ditemukan.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Kategori berhasil diperbarui.',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Update Category Error:', error);

        res.status(500).json({
            success: false,
            message: 'Gagal memperbarui kategori.'
        });
    }
};

// DELETE CATEGORY
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            `DELETE FROM product_categories
             WHERE id = $1
             RETURNING id`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Kategori tidak ditemukan.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Kategori berhasil dihapus.'
        });

    } catch (error) {
        console.error('Delete Category Error:', error);

        res.status(500).json({
            success: false,
            message: 'Gagal menghapus kategori.'
        });
    }
};

module.exports = {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};