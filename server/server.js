// ==============================
// 🌎 DEPENDENCIAS PRINCIPALES
// ==============================
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// ==============================
// 🔧 MIDDLEWARES GLOBALES
// ==============================
app.use(cors()); // Permitir peticiones desde el frontend
app.use(express.json()); // Parsear JSON
app.use(express.urlencoded({ extended: true })); // Aceptar formularios (opcional)
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Servir imágenes y archivos estáticos

// ==============================
// 📦 IMPORTAR RUTAS PRINCIPALES
// ==============================
const empleadosRoutes = require("./routes/empleadosRoutes");
const animalesRoutes = require("./routes/animalesRoutes");
const adopcionRoutes = require("./routes/adopcionRoutes");
const authRoutes = require("./routes/authRoutes");
const mascotasPerdidasRoutes = require("./routes/mascotasPerdidasRoutes");
const avistamientosRoutes = require("./routes/avistamientosRoutes");
const expedienteClinicoRoutes = require("./routes/expedienteClinicoRoutes");

// ==============================
// 🚏 USAR RUTAS PRINCIPALES
// ==============================
app.use("/empleados", empleadosRoutes);
app.use("/animales", animalesRoutes);
app.use("/adopcion", adopcionRoutes);
app.use("/auth", authRoutes);
app.use("/mascotas-perdidas", mascotasPerdidasRoutes);
app.use("/avistamientos", avistamientosRoutes);
app.use("/expediente-medico", expedienteClinicoRoutes);

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
        "/expediente-medico",
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
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
