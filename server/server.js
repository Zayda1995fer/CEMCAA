// ==============================
// 🌎 DEPENDENCIAS PRINCIPALES
// ==============================
const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session"); // ✅ NUEVO
const MySQLStore = require("express-mysql-session")(session); // ✅ NUEVO (opcional pero recomendado)

const app = express();

// ==============================
// 🔧 CONFIGURACIÓN DE SESIONES
// ==============================
const db = require("./config/database"); // Tu conexión a MySQL

const sessionStore = new MySQLStore({
  clearExpired: true,
  checkExpirationInterval: 900000, // 15 minutos
  expiration: 86400000, // 24 horas
  createDatabaseTable: true,
  schema: {
    tableName: 'sessions',
    columnNames: {
      session_id: 'session_id',
      expires: 'expires',
      data: 'data'
    }
  }
}, db);

app.use(
  session({
    key: "cemcaa_session",
    secret: "tu_secreto_super_seguro_aqui_2024", // ⚠️ CAMBIAR EN PRODUCCIÓN
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24 horas
      httpOnly: true,
      secure: false, // ⚠️ Cambiar a true en producción con HTTPS
      sameSite: "lax",
    },
  })
);

// ==============================
// 🔧 MIDDLEWARES GLOBALES
// ==============================
app.use(
  cors({
    origin: "http://localhost:3000", // ✅ URL del frontend
    credentials: true, // ✅ CRÍTICO: Permitir envío de cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ==============================
// 📦 IMPORTAR RUTAS
// ==============================
const empleadosRoutes = require("./routes/empleadosRoutes");
const animalesRoutes = require("./routes/animalesRoutes");
const adopcionRoutes = require("./routes/adopcionRoutes");
const authRoutes = require("./routes/authRoutes");
const mascotasPerdidasRoutes = require("./routes/mascotasPerdidasRoutes");
const avistamientosRoutes = require("./routes/avistamientosRoutes");
const expedienteRoutes = require("./routes/expedienteRoutes");

// ==============================
// 🚏 USAR RUTAS
// ==============================
app.use("/empleados", empleadosRoutes);
app.use("/animales", animalesRoutes);
app.use("/adopcion", adopcionRoutes);
app.use("/auth", authRoutes);
app.use("/mascotas-perdidas", mascotasPerdidasRoutes);
app.use("/avistamientos", avistamientosRoutes);
app.use("/expediente", expedienteRoutes);

// ==============================
// ✅ ENDPOINT PARA VERIFICAR USUARIO ACTUAL
// ==============================
app.get("/usuario-actual", (req, res) => {
  if (req.session && req.session.usuario) {
    return res.json(req.session.usuario);
  }
  return res.status(401).json({ error: "No hay sesión activa" });
});

// ==============================
// 🌐 RUTA DE PRUEBA / STATUS
// ==============================
app.get("/", (req, res) => {
  res.json({
    mensaje: "✅ API CEMCAA funcionando correctamente",
    version: "1.0.0",
    autor: "CEMCAA Backend",
    rutas: {
      principales: [
        "/empleados",
        "/animales",
        "/adopcion",
        "/auth",
        "/mascotas-perdidas",
        "/avistamientos",
        "/expediente",
        "/usuario-actual",
      ],
    },
  });
});

// ==============================
// ⚠️ MANEJO DE ERRORES 404
// ==============================
app.use((req, res) => {
  res.status(404).json({
    message: "❌ Ruta no encontrada",
    ruta: req.originalUrl,
  });
});

// ==============================
// ⚙️ MANEJO DE ERRORES GENERALES
// ==============================
app.use((err, req, res, next) => {
  console.error("💥 Error interno del servidor:", err);
  res.status(500).json({
    message: "💥 Error interno del servidor",
    error: err.message,
  });
});

// ==============================
// 🚀 INICIAR SERVIDOR
// ==============================
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("=====================================");
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log("✅ API CEMCAA lista para recibir peticiones");
  console.log("✅ Sesiones configuradas correctamente");
  console.log("=====================================");
});