const db = require("../config/database");

const historialVidaController = {
  crear: async (req, res) => {
    const data = req.body;
    try {
      const [result] = await db
        .promise()
        .query(
          `INSERT INTO historial_vida 
          (id_animal, origen, cantidad_duenos_previos, situacion_previa, 
           ultimo_dueno_nombre_completo, ultimo_dueno_telefono)
          VALUES (?, ?, ?, ?, ?, ?)`,
          [
            data.id_animal,
            data.origen,
            data.cantidad_duenos_previos,
            data.situacion_previa,
            data.ultimo_dueno_nombre_completo,
            data.ultimo_dueno_telefono,
          ]
        );
      res.json({ message: "Historial creado correctamente", id: result.insertId });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  },

  obtenerPorAnimal: async (req, res) => {
    const { id_animal } = req.params;
    try {
      const [rows] = await db.promise().query("SELECT * FROM historial_vida WHERE id_animal = ?", [id_animal]);
      res.json(rows[0] || {});
    } catch (err) {
      res.status(500).json({ error: err });
    }
  },

  obtenerTodos: async (_, res) => {
    try {
      const [rows] = await db.promise().query("SELECT * FROM historial_vida");
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  },

  actualizar: async (req, res) => {
    const { id_historial } = req.params;
    try {
      await db.promise().query("UPDATE historial_vida SET ? WHERE id_historial = ?", [req.body, id_historial]);
      res.json({ message: "Historial actualizado correctamente" });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  },

  eliminar: async (req, res) => {
    const { id_historial } = req.params;
    try {
      await db.promise().query("DELETE FROM historial_vida WHERE id_historial = ?", [id_historial]);
      res.json({ message: "Historial eliminado correctamente" });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  },
};

module.exports = historialVidaController;
