const db = require("../config/database");

const animalesController = {
  // 🟢 Crear animal
  crear: (req, res) => {
    const {
      nombre,
      especie,
      raza,
      sexo,
      edadAprox,
      tamaño,
      marcas,
      rasgos,
      descripcion,
      estatus, // nuevo campo
    } = req.body;

    const imagenFinal = req.file
      ? `http://localhost:3001/uploads/${req.file.filename}`
      : "https://www.shutterstock.com/es/image-vector/image-coming-soon-no-picture-video-2450891047";

    const edadFinal = edadAprox || "Desconocida";
    const tamañoFinal = tamaño || "Mediano";
    const estatusFinal = estatus || "En adopción";

    db.query(
      `INSERT INTO animales
        (nombre, especie, raza, sexo, edadAprox, tamaño, marcas, rasgos, descripcion, imagenMain, estatus)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre,
        especie,
        raza,
        sexo,
        edadFinal,
        tamañoFinal,
        marcas || "",
        rasgos || "",
        descripcion || "",
        imagenFinal,
        estatusFinal,
      ],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Error al registrar el animal" });
        }
        res.json({
          mensaje: "Animal registrado con éxito",
          id: result.insertId,
        });
      }
    );
  },

  // 🟡 Obtener todos los animales
  obtenerTodos: (req, res) => {
    db.query("SELECT * FROM animales", (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error al obtener los animales" });
      }
      res.json(result);
    });
  },

  // 🟠 Actualizar animal
  actualizar: (req, res) => {
    const {
      Id,
      nombre,
      especie,
      raza,
      sexo,
      edadAprox,
      tamaño,
      marcas,
      rasgos,
      descripcion,
      imagenMain,
      estatus, // nuevo campo
    } = req.body;

    const imagenFinal = req.file
      ? `http://localhost:3001/uploads/${req.file.filename}`
      : imagenMain || "https://www.shutterstock.com/es/image-vector/image-coming-soon-no-picture-video-2450891047";

    const edadFinal = edadAprox || "Desconocida";
    const tamañoFinal = tamaño || "Mediano";
    const estatusFinal = estatus || "En adopción";

    db.query(
      `UPDATE animales 
       SET nombre=?, especie=?, raza=?, sexo=?, edadAprox=?, tamaño=?, marcas=?, rasgos=?, descripcion=?, imagenMain=?, estatus=?
       WHERE Id=?`,
      [
        nombre,
        especie,
        raza,
        sexo,
        edadFinal,
        tamañoFinal,
        marcas || "",
        rasgos || "",
        descripcion || "",
        imagenFinal,
        estatusFinal,
        Id,
      ],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Error al actualizar el animal" });
        }
        res.json({ mensaje: "Animal actualizado con éxito" });
      }
    );
  },

  // 🔴 Eliminar animal
  eliminar: (req, res) => {
    const { Id } = req.params;

    db.query("DELETE FROM animales WHERE Id=?", [Id], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error al eliminar el animal" });
      }
      res.json({ mensaje: "Animal eliminado con éxito" });
    });
  },
};

module.exports = animalesController;
