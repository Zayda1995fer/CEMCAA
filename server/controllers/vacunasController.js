// ================================
// 📘 CONTROLADOR DE VACUNAS (CORREGIDO)
// ================================

const db = require("../config/database");

const vacunasController = {
  // ============================================
  // 🧩 CREAR REGISTRO DE VACUNA
  // ============================================
  crear: (req, res) => {
    const { id_salud, fecha_vacuna, tipo_vacuna, observaciones } = req.body;

    // Validar campos obligatorios
    if (!id_salud || !fecha_vacuna || !tipo_vacuna) {
      return res.status(400).json({
        message: "Faltan datos obligatorios (id_salud, fecha_vacuna, tipo_vacuna)",
      });
    }

    const query = `
      INSERT INTO vacunas (id_salud, fecha_vacuna, tipo_vacuna, observaciones)
      VALUES (?, ?, ?, ?)
    `;

    db.query(query, [id_salud, fecha_vacuna, tipo_vacuna, observaciones || null], (err, result) => {
      if (err) {
        console.error("❌ Error al registrar vacuna:", err);
        return res.status(500).json({
          message: "Error al registrar vacuna",
          error: err.sqlMessage || err.message,
        });
      }

      res.status(201).json({
        message: "✅ Vacuna registrada correctamente",
        id_vacuna: result.insertId,
      });
    });
  },

  // ============================================
  // 📋 OBTENER TODAS LAS VACUNAS POR ID_SALUD
  // ============================================
  obtenerPorSalud: (req, res) => {
    const { id_salud } = req.params;

    if (!id_salud) {
      return res.status(400).json({ message: "ID de salud requerido" });
    }

    const query = `
      SELECT id_vacuna, id_salud, fecha_vacuna, tipo_vacuna, observaciones, fecha_registro
      FROM vacunas
      WHERE id_salud = ?
      ORDER BY fecha_vacuna DESC
    `;

    db.query(query, [id_salud], (err, results) => {
      if (err) {
        console.error("❌ Error al obtener vacunas:", err);
        return res.status(500).json({
          message: "Error al obtener vacunas",
          error: err.sqlMessage || err.message,
        });
      }

      res.status(200).json(results);
    });
  },

  // ============================================
  // ✏️ ACTUALIZAR REGISTRO DE VACUNA
  // ============================================
  actualizar: (req, res) => {
    const { id_vacuna } = req.params;
    const { fecha_vacuna, tipo_vacuna, observaciones } = req.body;

    if (!id_vacuna || !fecha_vacuna || !tipo_vacuna) {
      return res.status(400).json({
        message: "Faltan datos obligatorios para actualizar (id_vacuna, fecha_vacuna, tipo_vacuna)",
      });
    }

    const query = `
      UPDATE vacunas
      SET fecha_vacuna = ?, tipo_vacuna = ?, observaciones = ?
      WHERE id_vacuna = ?
    `;

    db.query(query, [fecha_vacuna, tipo_vacuna, observaciones || null, id_vacuna], (err, result) => {
      if (err) {
        console.error("❌ Error al actualizar vacuna:", err);
        return res.status(500).json({
          message: "Error al actualizar vacuna",
          error: err.sqlMessage || err.message,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Vacuna no encontrada" });
      }

      res.status(200).json({ message: "✅ Vacuna actualizada correctamente" });
    });
  },

  // ============================================
  // 🗑️ ELIMINAR REGISTRO DE VACUNA
  // ============================================
  eliminar: (req, res) => {
    const { id_vacuna } = req.params;

    if (!id_vacuna) {
      return res.status(400).json({ message: "ID de vacuna requerido" });
    }

    const query = `DELETE FROM vacunas WHERE id_vacuna = ?`;

    db.query(query, [id_vacuna], (err, result) => {
      if (err) {
        console.error("❌ Error al eliminar vacuna:", err);
        return res.status(500).json({
          message: "Error al eliminar vacuna",
          error: err.sqlMessage || err.message,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Vacuna no encontrada" });
      }

      res.status(200).json({ message: "🧾 Vacuna eliminada correctamente" });
    });
  },
};

module.exports = vacunasController;
