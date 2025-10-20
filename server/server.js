const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());



// Servir archivos estáticos (uploads)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Importar rutas
const empleadosRoutes = require("./routes/empleadosRoutes");
const animalesRoutes = require("./routes/animalesRoutes");
const adopcionRoutes = require("./routes/adopcionRoutes");
const authRoutes = require("./routes/authRoutes");

// Usar rutas
app.use("/empleados", empleadosRoutes);
app.use("/animales", animalesRoutes);
app.use("/adopcion", adopcionRoutes);
app.use("/auth", authRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ mensaje: "API CEMCAA funcionando correctamente" });
});

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
