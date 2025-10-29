const db = require("../config/database");

const saludController = {
  crear: async (req, res) => {
    const data = req.body;
    try {
      const [result] = await db
        .promise()
        .query(
          `INSERT INTO salud 
          (id_animal, estado_actual_salud, enfermedades_temporales, tratamientos_medicos, 
           esterilizacion, fecha_esterilizacion, cirugias_anteriores)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            data.id_animal,
            data.estado_actual_salud,
            data.enfermedades_temporales,
            data.tratamientos_medicos,
            data.esterilizacion,
            data.fecha_esterilizacion,
            data.cirugias_anteriores,
          ]
        );
      res.json({ message: "Registro de salud creado", id: result.insertId });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  },

  obtenerPorAnimal: async (req, res) => {
    const { id_animal } = req.params;
    try {
      const [rows] = await db.promise().query("SELECT * FROM salud WHERE id_animal = ?", [id_animal]);
      res.json(rows[0] || {});
    } catch (err) {
      res.status(500).json({ error: err });
    }
  },

  obtenerTodos: async (req, res) => {
    try {
      const [rows] = await db.promise().query("SELECT * FROM salud");
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  },

  actualizar: async (req, res) => {
    const { id_salud } = req.params;
    try {
      await db.promise().query("UPDATE salud SET ? WHERE id_salud = ?", [req.body, id_salud]);
      res.json({ message: "Registro de salud actualizado" });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  },

  eliminar: async (req, res) => {
    const { id_salud } = req.params;
    try {
      await db.promise().query("DELETE FROM salud WHERE id_salud = ?", [id_salud]);
      res.json({ message: "Registro de salud eliminado" });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  },
};

module.exports = saludController;
