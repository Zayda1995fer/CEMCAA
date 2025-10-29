const db = require("../config/database");

const comportamientoController = {
  crear: async (req, res) => {
    const data = req.body;
    try {
      const [result] = await db
        .promise()
        .query(
          `INSERT INTO comportamiento
          (id_animal, caracter_general, compatibilidad_ninos, compatibilidad_perros, 
           compatibilidad_gatos, nivel_energia, entrenamiento)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            data.id_animal,
            data.caracter_general,
            data.compatibilidad_ninos,
            data.compatibilidad_perros,
            data.compatibilidad_gatos,
            data.nivel_energia,
            data.entrenamiento,
          ]
        );
      res.json({ message: "Registro de comportamiento agregado", id: result.insertId });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  },

  obtenerPorAnimal: async (req, res) => {
    const { id_animal } = req.params;
    try {
      const [rows] = await db.promise().query("SELECT * FROM comportamiento WHERE id_animal = ?", [id_animal]);
      res.json(rows[0] || {});
    } catch (err) {
      res.status(500).json({ error: err });
    }
  },

  obtenerTodos: async (_, res) => {
    try {
      const [rows] = await db.promise().query("SELECT * FROM comportamiento");
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  },

  actualizar: async (req, res) => {
    const { id_comportamiento } = req.params;
    try {
      await db.promise().query("UPDATE comportamiento SET ? WHERE id_comportamiento = ?", [req.body, id_comportamiento]);
      res.json({ message: "Comportamiento actualizado" });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  },

  eliminar: async (req, res) => {
    const { id_comportamiento } = req.params;
    try {
      await db.promise().query("DELETE FROM comportamiento WHERE id_comportamiento = ?", [id_comportamiento]);
      res.json({ message: "Registro eliminado correctamente" });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  },
};

module.exports = comportamientoController;
