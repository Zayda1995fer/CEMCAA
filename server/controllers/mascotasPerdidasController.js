// controllers/mascotasPerdidasController.js
const db = require("../config/database");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

// ====================================================
// 📦 Configuración de subida de imágenes con Multer
// ====================================================

// Verifica si la carpeta existe, si no, la crea automáticamente
const uploadDir = path.join(__dirname, "../uploads/mascotas_perdidas");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configura el almacenamiento local
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// ====================================================
// 🧩 Controlador principal
// ====================================================
const mascotasPerdidasController = {
  // 🐾 Crear una nueva publicación
  crear: (req, res) => {
    const {
      usuario_id,
      nombre_mascota,
      especie,
      raza,
      color,
      sexo,
      descripcion,
      ultima_ubicacion,
      fecha_perdida,
      estado,
    } = req.body;

    // Ruta de imagen (si se envía una)
    const imagenFinal = req.file
      ? `http://localhost:3001/uploads/mascotas_perdidas/${req.file.filename}`
      : null;

    const sql = `
      INSERT INTO mascotas_perdidas 
      (usuario_id, nombre_mascota, especie, raza, color, sexo, descripcion, ultima_ubicacion, fecha_perdida, imagen, estado)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        usuario_id || null,
        nombre_mascota,
        especie,
        raza,
        color,
        sexo,
        descripcion,
        ultima_ubicacion,
        fecha_perdida,
        imagenFinal,
        estado || "Perdido",
      ],
      (err, result) => {
        if (err) {
          console.error("❌ Error al registrar mascota perdida:", err);
          return res.status(500).json({ error: "Error al registrar la mascota perdida" });
        }
        res.status(201).json({ message: "🐾 Mascota perdida registrada correctamente" });
      }
    );
  },

  // 📋 Listar todas las publicaciones
  listar: (req, res) => {
    const sql = "SELECT * FROM mascotas_perdidas ORDER BY id DESC";
    db.query(sql, (err, rows) => {
      if (err) {
        console.error("❌ Error al listar mascotas perdidas:", err);
        return res.status(500).json({ error: "Error al obtener las mascotas perdidas" });
      }
      res.status(200).json(rows);
    });
  },

  // 🔍 Obtener una mascota por ID
  obtenerPorId: (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM mascotas_perdidas WHERE id = ?";
    db.query(sql, [id], (err, rows) => {
      if (err) {
        console.error("❌ Error al buscar mascota:", err);
        return res.status(500).json({ error: "Error al buscar la mascota perdida" });
      }
      if (rows.length === 0) return res.status(404).json({ message: "No encontrada" });
      res.status(200).json(rows[0]);
    });
  },

  // 🔄 Actualizar estado (Aprobado, Rechazado, Encontrada)
  actualizarEstado: (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    const sql = "UPDATE mascotas_perdidas SET estado = ? WHERE id = ?";
    db.query(sql, [estado, id], (err, result) => {
      if (err) {
        console.error("❌ Error al actualizar estado:", err);
        return res.status(500).json({ error: "Error al actualizar el estado" });
      }
      res.status(200).json({ message: "✅ Estado actualizado correctamente" });
    });
  },
};

// Exportar controlador y función de carga
module.exports = { mascotasPerdidasController, upload };
