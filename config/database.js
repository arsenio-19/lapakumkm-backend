const { Pool } = require('pg');
require('dotenv').config();

const db = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

// Test Database Connection
const checkDatabase = async () => {
    try {
        const result = await db.query(`
            SELECT
                current_database() AS database,
                current_user AS username,
                current_schema() AS schema,
                current_setting('search_path') AS search_path,
                to_regclass('public.users') AS users_table
        `);

        console.log('DATABASE CONNECTION SUCCESSFUL!');
        console.log(result.rows[0]);

    } catch (error) {
        console.error('DATABASE CONNECTION FAILED!');
        console.error(error.message);
    }
};

checkDatabase();

module.exports = db;