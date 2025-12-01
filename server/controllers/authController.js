const db = require("../config/database");
const bcrypt = require("bcryptjs");

const authController = {
  // 🔹 LOGIN UNIFICADO
  login: (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    // Buscar primero en usuarios
    db.query("SELECT * FROM usuarios WHERE email = ?", [email], (err, results) => {
      if (err) return res.status(500).json({ error: "Error en la consulta usuarios" });

      if (results.length > 0) {
        const user = results[0];
        const passwordIsValid = bcrypt.compareSync(password, user.password);

        if (!passwordIsValid)
          return res.status(401).json({ error: "Contraseña incorrecta" });

        return res.json({
          mensaje: "Inicio de sesión exitoso",
          tipo: "usuario",
          usuario: {
            id: user.id,
            nombre_completo: user.nombre_completo,
            edad: user.edad,
            telefono: user.telefono,
            email: user.email,
            direccion: user.direccion,
            ocupacion: user.ocupacion,
            horario_laboral_inicio: user.horario_laboral_inicio,
            horario_laboral_fin: user.horario_laboral_fin,
            fecha_registro: user.fecha_registro,
          },
        });
      }

      // ---- Si no existe en usuarios, buscar en empleados ----
      db.query("SELECT * FROM empleados WHERE email = ?", [email], (err2, results2) => {
        if (err2) return res.status(500).json({ error: "Error en la consulta empleados" });

        if (results2.length === 0)
          return res.status(404).json({ error: "Usuario no encontrado" });

        const empleado = results2[0];
        const passwordIsValid = bcrypt.compareSync(password, empleado.password);

        if (!passwordIsValid)
          return res.status(401).json({ error: "Contraseña incorrecta" });

        return res.json({
          mensaje: "Inicio de sesión exitoso",
          tipo: "empleado",
          usuario: {
            id: empleado.id,
            nombre: empleado.nombre,
            edad: empleado.edad,
            pais: empleado.pais,
            cargo: empleado.cargo,
            años: empleado.años,
            email: empleado.email,
          },
        });
      });
    });
  },

  // 🔹 REGISTRO DE USUARIO NORMAL
  registerUsuario: (req, res) => {
    const {
      nombre_completo,
      edad,
      telefono,
      email,
      direccion,
      ocupacion,
      horario_laboral_inicio,
      horario_laboral_fin,
      password,
    } = req.body;

    if (
      !nombre_completo ||
      !edad ||
      !telefono ||
      !email ||
      !direccion ||
      !ocupacion ||
      !horario_laboral_inicio ||
      !horario_laboral_fin ||
      !password
    ) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    db.query(
      `INSERT INTO usuarios 
        (nombre_completo, edad, telefono, email, direccion, ocupacion, horario_laboral_inicio, horario_laboral_fin, fecha_registro, password)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)`,
      [
        nombre_completo,
        edad,
        telefono,
        email,
        direccion,
        ocupacion,
        horario_laboral_inicio,
        horario_laboral_fin,
        hashedPassword,
      ],
      (err, results) => {
        if (err) return res.status(500).json({ error: "Error al registrar usuario" });
        res.json({ mensaje: "Usuario registrado exitosamente", id: results.insertId });
      }
    );
  },

  // 🔹 REGISTRO DE EMPLEADO
  registerEmpleado: (req, res) => {
    const { nombre, edad, pais, cargo, años, email, password } = req.body;

    if (!nombre || !edad || !pais || !cargo || !años || !email || !password) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    db.query(
      `INSERT INTO empleados (nombre, edad, pais, cargo, años, email, password)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nombre, edad, pais, cargo, años, email, hashedPassword],
      (err, results) => {
        if (err) return res.status(500).json({ error: "Error al registrar empleado" });
        res.json({ mensaje: "Empleado registrado exitosamente", id: results.insertId });
      }
    );
  },
};

module.exports = authController;
