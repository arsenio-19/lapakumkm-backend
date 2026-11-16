const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER
const register = async (req, res) => {
    try {
        const { name, email, password, phone, address, role } = req.body;

        // Validasi input
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Nama, email, dan password wajib diisi.'
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Password minimal 8 karakter.'
            });
        }

        // Role yang diperbolehkan untuk pendaftaran
        const allowedRoles = ['buyer', 'seller'];
        const selectedRole = role || 'buyer';

        if (!allowedRoles.includes(selectedRole)) {
            return res.status(400).json({
                success: false,
                message: 'Role tidak valid.'
            });
        }

        // Periksa email
        const existingUser = await db.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Email sudah terdaftar.'
            });
        }

        // Enkripsi password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Simpan pengguna
        const result = await db.query(
            `INSERT INTO users
            (name, email, password, phone, address, role)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, name, email, phone, address, role`,
            [
                name,
                email,
                hashedPassword,
                phone || null,
                address || null,
                selectedRole
            ]
        );

        return res.status(201).json({
            success: true,
            message: 'Registrasi berhasil.',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Register Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server.'
        });
    }
};


// LOGIN
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email dan password wajib diisi.'
            });
        }

        // Cari pengguna
        const result = await db.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Email atau password salah.'
            });
        }

        const user = result.rows[0];

        // Periksa password
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Email atau password salah.'
            });
        }

        // Buat JWT
        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1d'
            }
        );

        return res.status(200).json({
            success: true,
            message: 'Login berhasil.',
            token,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server.'
        });
    }
};


// GET PROFILE
const getProfile = async (req, res) => {
    try {
        const result = await db.query(
            `SELECT id, name, email, phone, address, role
             FROM users
             WHERE id = $1`,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Pengguna tidak ditemukan.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Berhasil mengambil profil.',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Profile Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server.'
        });
    }
};

module.exports = {
    register,
    login,
    getProfile
};