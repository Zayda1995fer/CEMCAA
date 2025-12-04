const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'cemcaa',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Exportar ambas versiones
module.exports = {
  // Para código que usa callbacks (empleados, etc.)
  query: (sql, params, callback) => pool.query(sql, params, callback),
  execute: (sql, params, callback) => pool.execute(sql, params, callback),
  
  // Para código que usa async/await (solicitudes)
  getConnection: () => pool.promise().getConnection(),
  
  // Exportar el pool original por si acaso
  pool: pool
};