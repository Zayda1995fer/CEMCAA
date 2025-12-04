const db = require("../config/database");
const bcrypt = require("bcryptjs");

const empleadosController = {
  // Crear empleado
  crear: async (req, res) => {
    try {
      const { nombre, edad, pais, cargo, años, email, password } = req.body;

      if (!nombre || !edad || !pais || !cargo || !años || !email || !password) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const connection = await db.getConnection();

      try {
        const [result] = await connection.execute(
          "INSERT INTO empleados(nombre, edad, pais, cargo, años, email, password) VALUES(?,?,?,?,?,?,?)",
          [nombre, edad, pais, cargo, años, email, hashedPassword]
        );

        connection.release();

        res.json({
          mensaje: "Empleado registrado con éxito",
          id: result.insertId,
        });
      } catch (queryError) {
        connection.release();
        throw queryError;
      }
    } catch (error) {
      console.error("Error en el proceso de creación:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  // Obtener todos los empleados
  obtenerTodos: async (req, res) => {
    try {
      const connection = await db.getConnection();

      try {
        const [result] = await connection.execute("SELECT * FROM empleados");
        connection.release();
        res.json(result);
      } catch (queryError) {
        connection.release();
        throw queryError;
      }
    } catch (error) {
      console.error("Error al obtener empleados:", error);
      return res.status(500).json({ error: "Error al obtener empleados" });
    }
  },

  // Actualizar empleado
  actualizar: async (req, res) => {
    try {
      const { id, nombre, edad, pais, cargo, años, email, password } = req.body;

      if (!id) {
        return res.status(400).json({ error: "El ID del empleado es obligatorio" });
      }

      let hashedPassword = password;
      if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
      }

      const connection = await db.getConnection();

      try {
        await connection.execute(
          "UPDATE empleados SET nombre=?, edad=?, pais=?, cargo=?, años=?, email=?, password=? WHERE id=?",
          [nombre, edad, pais, cargo, años, email, hashedPassword, id]
        );

        connection.release();
        res.json({ mensaje: "Empleado actualizado con éxito" });
      } catch (queryError) {
        connection.release();
        throw queryError;
      }
    } catch (error) {
      console.error("Error en el proceso de actualización:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  // Eliminar empleado
  eliminar: async (req, res) => {
    try {
      const { id } = req.params;
      const connection = await db.getConnection();

      try {
        await connection.execute("DELETE FROM empleados WHERE id=?", [id]);
        connection.release();
        res.json({ mensaje: "Empleado eliminado con éxito" });
      } catch (queryError) {
        connection.release();
        throw queryError;
      }
    } catch (error) {
      console.error("Error al eliminar empleado:", error);
      return res.status(500).json({ error: "Error al eliminar empleado" });
    }
  },
};

module.exports = empleadosController;