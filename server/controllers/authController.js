const db = require("../config/database");
const bcrypt = require("bcryptjs");

const authController = {
  // 🔹 LOGIN UNIFICADO CON SESIÓN
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      console.log("🔍 Intento de login:");
      console.log("Email recibido:", email);
      console.log("Password recibido:", password ? "***" : "VACÍO");

      if (!email || !password) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
      }

      const connection = await db.getConnection();

      try {
        // Buscar primero en usuarios
        const [usuariosResults] = await connection.execute(
          "SELECT * FROM usuarios WHERE email = ?",
          [email]
        );

        console.log("📊 Usuarios encontrados:", usuariosResults.length);

        if (usuariosResults.length > 0) {
          const user = usuariosResults[0];
          console.log("✅ Usuario encontrado:", user.email);
          console.log("🔐 Hash en BD:", user.password.substring(0, 30) + "...");
          
          const passwordIsValid = bcrypt.compareSync(password, user.password);
          console.log("🔑 Contraseña válida:", passwordIsValid);

          if (!passwordIsValid) {
            connection.release();
            return res.status(401).json({ error: "Contraseña incorrecta" });
          }

          // ✅ GUARDAR EN SESIÓN
          const userData = {
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
            tipo: "usuario"
          };

          req.session.usuario = userData;
          connection.release();

          console.log("✅ Login exitoso como usuario");

          return res.json({
            mensaje: "Inicio de sesión exitoso",
            tipo: "usuario",
            usuario: userData,
          });
        }

        // Si no existe en usuarios, buscar en empleados
        const [empleadosResults] = await connection.execute(
          "SELECT * FROM empleados WHERE email = ?",
          [email]
        );

        console.log("📊 Empleados encontrados:", empleadosResults.length);

        connection.release();

        if (empleadosResults.length === 0) {
          console.log("❌ Usuario no encontrado en ninguna tabla");
          return res.status(404).json({ error: "Usuario no encontrado" });
        }

        const empleado = empleadosResults[0];
        console.log("✅ Empleado encontrado:", empleado.email);
        console.log("🔐 Hash en BD:", empleado.password.substring(0, 30) + "...");
        
        const passwordIsValid = bcrypt.compareSync(password, empleado.password);
        console.log("🔑 Contraseña válida:", passwordIsValid);

        if (!passwordIsValid) {
          return res.status(401).json({ error: "Contraseña incorrecta" });
        }

        // ✅ GUARDAR EN SESIÓN
        const empleadoData = {
          id: empleado.id,
          nombre: empleado.nombre,
          edad: empleado.edad,
          pais: empleado.pais,
          cargo: empleado.cargo,
          años: empleado.años,
          email: empleado.email,
          tipo: "empleado"
        };

        req.session.usuario = empleadoData;

        console.log("✅ Login exitoso como empleado");

        return res.json({
          mensaje: "Inicio de sesión exitoso",
          tipo: "empleado",
          usuario: empleadoData,
        });

      } catch (queryError) {
        connection.release();
        throw queryError;
      }

    } catch (error) {
      console.error("❌ Error en login:", error);
      return res.status(500).json({ error: "Error en el servidor" });
    }
  },

  // 🔹 LOGOUT
  logout: (req, res) => {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ error: "Error al cerrar sesión" });
        }
        res.clearCookie("cemcaa_session");
        return res.json({ mensaje: "Sesión cerrada exitosamente" });
      });
    } else {
      return res.status(400).json({ error: "No hay sesión activa" });
    }
  },

  // 🔹 REGISTRO DE USUARIO NORMAL
  registerUsuario: async (req, res) => {
    try {
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

      console.log("📝 Registro de usuario:");
      console.log("Email:", email);

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
      console.log("🔐 Password hasheado:", hashedPassword.substring(0, 30) + "...");

      const connection = await db.getConnection();

      try {
        const [results] = await connection.execute(
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
          ]
        );

        const newUserId = results.insertId;
        console.log("✅ Usuario registrado con ID:", newUserId);

        // ✅ AUTO-LOGIN DESPUÉS DEL REGISTRO
        const [userResults] = await connection.execute(
          "SELECT * FROM usuarios WHERE id = ?",
          [newUserId]
        );

        connection.release();

        if (userResults.length === 0) {
          return res.json({ mensaje: "Usuario registrado exitosamente", id: newUserId });
        }

        const user = userResults[0];
        const userData = {
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
          tipo: "usuario"
        };

        req.session.usuario = userData;

        console.log("✅ Auto-login exitoso");

        res.json({
          mensaje: "Usuario registrado exitosamente",
          id: newUserId,
          usuario: userData
        });

      } catch (queryError) {
        connection.release();
        console.error("❌ Error en query de registro:", queryError);
        throw queryError;
      }

    } catch (error) {
      console.error("❌ Error al registrar usuario:", error);
      return res.status(500).json({ error: "Error al registrar usuario" });
    }
  },

  // 🔹 REGISTRO DE EMPLEADO
  registerEmpleado: async (req, res) => {
    try {
      const { nombre, edad, pais, cargo, años, email, password } = req.body;

      console.log("📝 Registro de empleado:");
      console.log("Email:", email);

      if (!nombre || !edad || !pais || !cargo || !años || !email || !password) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);
      console.log("🔐 Password hasheado:", hashedPassword.substring(0, 30) + "...");

      const connection = await db.getConnection();

      try {
        const [results] = await connection.execute(
          `INSERT INTO empleados (nombre, edad, pais, cargo, años, email, password)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [nombre, edad, pais, cargo, años, email, hashedPassword]
        );

        connection.release();

        console.log("✅ Empleado registrado con ID:", results.insertId);

        res.json({ mensaje: "Empleado registrado exitosamente", id: results.insertId });

      } catch (queryError) {
        connection.release();
        console.error("❌ Error en query de registro empleado:", queryError);
        throw queryError;
      }

    } catch (error) {
      console.error("❌ Error al registrar empleado:", error);
      return res.status(500).json({ error: "Error al registrar empleado" });
    }
  },
};

module.exports = authController;