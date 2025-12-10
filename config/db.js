const mysql = require('mysql2');

// ✅ PAKAI DATABASE_URL DARI RAILWAY
const pool = mysql.createPool(process.env.DATABASE_URL);

const promisePool = pool.promise();

module.exports = promisePool;
