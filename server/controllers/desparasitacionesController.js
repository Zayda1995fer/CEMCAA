const db = require("../config/database");

const desparasitacionesController = {
  crear: async (req, res) => {
    const { id_salud, fecha_desparasitacion, producto, observaciones } = req.body;
    try {
      const [result] = await db
        .promise()
        .query(
          "INSERT INTO desparasitaciones (id_salud, fecha_desparasitacion, producto, observaciones) VALUES (?, ?, ?, ?)",
          [id_salud, fecha_desparasitacion, producto, observaciones]
        );
      res.json({ message: "Desparasitación registrada", id: result.insertId });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  },

  obtenerPorSalud: async (req, res) => {
    const { id_salud } = req.params;
    try {
      const [rows] = await db.promise().query("SELECT * FROM desparasitaciones WHERE id_salud = ?", [id_salud]);
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  },

  obtenerTodas: async (req, res) => {
    try {
      const [rows] = await db.promise().query("SELECT * FROM desparasitaciones");
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  },

  actualizar: async (req, res) => {
    const { id_desparasitacion } = req.params;
    try {
      await db.promise().query("UPDATE desparasitaciones SET ? WHERE id_desparasitacion = ?", [req.body, id_desparasitacion]);
      res.json({ message: "Registro actualizado correctamente" });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  },

  eliminar: async (req, res) => {
    const { id_desparasitacion } = req.params;
    try {
      await db.promise().query("DELETE FROM desparasitaciones WHERE id_desparasitacion = ?", [id_desparasitacion]);
      res.json({ message: "Registro eliminado correctamente" });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  },
};

module.exports = desparasitacionesController;
