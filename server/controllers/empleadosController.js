// ===================================================================
// 3. controllers/empleadosController.js
// ===================================================================
const db = require("../config/database");
const bcrypt = require("bcryptjs");

const empleadosController = {
  // Crear empleado
  crear: async (req, res) => {
    try {
      const { nombre, edad, pais, cargo, años, email, password } = req.body;

      if (!nombre || !edad || !pais || !cargo || !años || !email || !password) {
        return res
          .status(400)
          .json({ error: "Todos los campos son obligatorios" });
      }

      // Encriptar contraseña antes de guardar
      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        "INSERT INTO empleados(nombre, edad, pais, cargo, años, email, password) VALUES(?,?,?,?,?,?,?)",
        [nombre, edad, pais, cargo, años, email, hashedPassword],
        (err, result) => {
          if (err) {
            console.error("Error al crear empleado:", err);
            return res.status(500).json({ error: "Error al crear empleado" });
          }
          res.json({
            mensaje: "Empleado registrado con éxito",
            id: result.insertId,
          });
        }
      );
    } catch (error) {
      console.error("Error en el proceso de creación:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  // Obtener todos los empleados
  obtenerTodos: (req, res) => {
    db.query("SELECT * FROM empleados", (err, result) => {
      if (err) {
        console.error("Error al obtener empleados:", err);
        return res.status(500).json({ error: "Error al obtener empleados" });
      }
      res.json(result);
    });
  },

  // Actualizar empleado
  actualizar: async (req, res) => {
    try {
      const { id, nombre, edad, pais, cargo, años, email, password } = req.body;

      if (!id) {
        return res
          .status(400)
          .json({ error: "El ID del empleado es obligatorio" });
      }

      // Si se envía una nueva contraseña, se encripta; si no, se mantiene la actual
      let hashedPassword = password;
      if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
      }

      db.query(
        "UPDATE empleados SET nombre=?, edad=?, pais=?, cargo=?, años=?, email=?, password=? WHERE id=?",
        [nombre, edad, pais, cargo, años, email, hashedPassword, id],
        (err) => {
          if (err) {
            console.error("Error al actualizar empleado:", err);
            return res
              .status(500)
              .json({ error: "Error al actualizar empleado" });
          }
          res.json({ mensaje: "Empleado actualizado con éxito" });
        }
      );
    } catch (error) {
      console.error("Error en el proceso de actualización:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  // Eliminar empleado
  eliminar: (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM empleados WHERE id=?", [id], (err) => {
      if (err) {
        console.error("Error al eliminar empleado:", err);
        return res.status(500).json({ error: "Error al eliminar empleado" });
      }
      res.json({ mensaje: "Empleado eliminado con éxito" });
    });
  },
};

module.exports = empleadosController;
