// 3. controllers/empleadosController.js
// ===================================================================
const db = require("../config/database");

const empleadosController = {
  // Crear empleado
  crear: (req, res) => {
    const { nombre, edad, pais, cargo, años } = req.body;

    db.query(
      "INSERT INTO empleados(nombre, edad, pais, cargo, años) VALUES(?,?,?,?,?)",
      [nombre, edad, pais, cargo, años],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Error al crear empleado" });
        }
        res.json({ 
          mensaje: "Empleado registrado con éxito",
          id: result.insertId 
        });
      }
    );
  },

  // Obtener todos los empleados
  obtenerTodos: (req, res) => {
    db.query("SELECT * FROM empleados", (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Error al obtener empleados" });
      }
      res.json(result);
    });
  },

  // Actualizar empleado
  actualizar: (req, res) => {
    const { id, nombre, edad, pais, cargo, años } = req.body;

    db.query(
      "UPDATE empleados SET nombre=?, edad=?, pais=?, cargo=?, años=? WHERE id=?",
      [nombre, edad, pais, cargo, años, id],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Error al actualizar empleado" });
        }
        res.json({ mensaje: "Empleado actualizado con éxito" });
      }
    );
  },

  // Eliminar empleado
  eliminar: (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM empleados WHERE id=?", [id], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Error al eliminar empleado" });
      }
      res.json({ mensaje: "Empleado eliminado con éxito" });
    });
  },
};

module.exports = empleadosController;