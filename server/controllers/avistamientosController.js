const db = require("../config/database");

const avistamientosController = {
  // 🐾 Crear nuevo aviso
  crear: (req, res) => {
    const {
      mascota_id,
      usuario_id,
      nombre_contacto,
      telefono_contacto,
      ubicacion_avistamiento,
      descripcion,
      se_lo_llevo,
    } = req.body;

    const sql = `
      INSERT INTO avistamientos_perdidas 
      (mascota_id, usuario_id, nombre_contacto, telefono_contacto, ubicacion_avistamiento, descripcion, se_lo_llevo)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        mascota_id,
        usuario_id || null,
        nombre_contacto,
        telefono_contacto,
        ubicacion_avistamiento,
        descripcion,
        se_lo_llevo || false,
      ],
      (err, result) => {
        if (err) {
          console.error("❌ Error al registrar avistamiento:", err);
          return res.status(500).json({ error: "Error al registrar el avistamiento" });
        }
        res.status(201).json({ message: "📢 Aviso registrado correctamente" });
      }
    );
  },

  // 📋 Listar todos los avisos
  listar: (req, res) => {
    const sql = `
      SELECT a.*, m.nombre_mascota, m.especie, m.color
      FROM avistamientos_perdidas a
      JOIN mascotas_perdidas m ON a.mascota_id = m.id
      ORDER BY a.fecha_avistamiento DESC
    `;
    db.query(sql, (err, rows) => {
      if (err) {
        console.error("❌ Error al obtener avisos:", err);
        return res.status(500).json({ error: "Error al obtener los avisos" });
      }
      res.status(200).json(rows);
    });
  },

  // 🔍 Buscar avisos por mascota
  listarPorMascota: (req, res) => {
    const { id } = req.params;
    const sql = `
      SELECT * FROM avistamientos_perdidas 
      WHERE mascota_id = ? ORDER BY fecha_avistamiento DESC
    `;
    db.query(sql, [id], (err, rows) => {
      if (err) {
        console.error("❌ Error al obtener avisos por mascota:", err);
        return res.status(500).json({ error: "Error al obtener los avisos" });
      }
      res.status(200).json(rows);
    });
  },
};

module.exports = avistamientosController;
