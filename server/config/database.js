// database.js - CON POOL DE CONEXIONES
const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  host: "localhost",
  user: "root",
  password: "",

  database: "cemcaa2",  // ← Asegúrate que sea CEMCAA o cemcaa2
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Probar la conexión
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Error conectando a la base de datos:", err);
    return;
  }
  console.log("✓ Conectado a MySQL ");
  connection.release();
});

// ⚠️ CAMBIA ESTA LÍNEA:
// module.exports = promisePool; // ❌ Esto solo exporta promesas
module.exports = pool; // ✅ Esto exporta callbacks