const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();


// Login para empleados
app.post('/login/empleado', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email y contraseña son requeridos' 
    });
  }

  const sql = 'SELECT * FROM empleados WHERE email = ?';
  
  db.query(sql, [email], async (err, result) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Error en el servidor' 
      });
    }

    if (result.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Credenciales incorrectas' 
      });
    }

    const empleado = result[0];
    
    // Comparar contraseñas (si están hasheadas con bcrypt)
    try {
      const passwordMatch = await bcrypt.compare(password, empleado.password);
      
      if (passwordMatch) {
        return res.json({
          success: true,
          tipo: 'empleado',
          usuario: {
            id: empleado.id,
            nombre: empleado.nombre,
            email: empleado.email,
            cargo: empleado.cargo,
            edad: empleado.edad,
            pais: empleado.pais,
            años: empleado.años
          }
        });
      } else {
        return res.status(401).json({ 
          success: false, 
          message: 'Credenciales incorrectas' 
        });
      }
    } catch (error) {
      // Si la contraseña no está hasheada, comparar directamente
      if (password === empleado.password) {
        return res.json({
          success: true,
          tipo: 'empleado',
          usuario: {
            id: empleado.id,
            nombre: empleado.nombre,
            email: empleado.email,
            cargo: empleado.cargo,
            edad: empleado.edad,
            pais: empleado.pais,
            años: empleado.años
          }
        });
      } else {
        return res.status(401).json({ 
          success: false, 
          message: 'Credenciales incorrectas' 
        });
      }
    }
  });
});

// Login para usuarios
app.post('/login/usuario', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email y contraseña son requeridos' 
    });
  }

  const sql = 'SELECT * FROM usuarios WHERE email = ?';
  
  db.query(sql, [email], async (err, result) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Error en el servidor' 
      });
    }

    if (result.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Credenciales incorrectas' 
      });
    }

    const usuario = result[0];
    
    // Comparar contraseñas (si están hasheadas con bcrypt)
    try {
      const passwordMatch = await bcrypt.compare(password, usuario.password);
      
      if (passwordMatch) {
        return res.json({
          success: true,
          tipo: 'usuario',
          usuario: {
            id: usuario.id,
            nombre_completo: usuario.nombre_completo,
            email: usuario.email,
            edad: usuario.edad,
            telefono: usuario.telefono,
            direccion: usuario.direccion,
            ocupacion: usuario.ocupacion
          }
        });
      } else {
        return res.status(401).json({ 
          success: false, 
          message: 'Credenciales incorrectas' 
        });
      }
    } catch (error) {
      // Si la contraseña no está hasheada, comparar directamente
      if (password === usuario.password) {
        return res.json({
          success: true,
          tipo: 'usuario',
          usuario: {
            id: usuario.id,
            nombre_completo: usuario.nombre_completo,
            email: usuario.email,
            edad: usuario.edad,
            telefono: usuario.telefono,
            direccion: usuario.direccion,
            ocupacion: usuario.ocupacion
          }
        });
      } else {
        return res.status(401).json({ 
          success: false, 
          message: 'Credenciales incorrectas' 
        });
      }
    }
  });
});

// ====================================
// RUTAS DE REGISTRO
// ====================================

// Registro de usuarios
app.post('/register/usuario', async (req, res) => {
  const {
    nombre_completo,
    edad,
    telefono,
    email,
    direccion,
    ocupacion,
    horario_laboral_inicio,
    horario_laboral_fin,
    password
  } = req.body;

  // Validaciones
  if (!nombre_completo || !edad || !telefono || !email || !direccion || !ocupacion || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Todos los campos obligatorios deben ser completados' 
    });
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email inválido' 
    });
  }

  // Verificar si el email ya existe
  const checkEmailSql = 'SELECT * FROM usuarios WHERE email = ?';
  
  db.query(checkEmailSql, [email], async (err, result) => {
    if (err) {
      console.error('Error verificando email:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Error en el servidor' 
      });
    }

    if (result.length > 0) {
      return res.status(409).json({ 
        success: false, 
        message: 'Este email ya está registrado' 
      });
    }

    // Hashear la contraseña
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const insertSql = `
        INSERT INTO usuarios 
        (nombre_completo, edad, telefono, email, direccion, ocupacion, 
         horario_laboral_inicio, horario_laboral_fin, password, fecha_registro) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `;

      const values = [
        nombre_completo,
        edad,
        telefono,
        email,
        direccion,
        ocupacion,
        horario_laboral_inicio || null,
        horario_laboral_fin || null,
        hashedPassword
      ];

      db.query(insertSql, values, (err, result) => {
        if (err) {
          console.error('Error insertando usuario:', err);
          return res.status(500).json({ 
            success: false, 
            message: 'Error al registrar usuario' 
          });
       }

        res