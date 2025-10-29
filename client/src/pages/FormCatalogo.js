import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col, Image, Card } from "react-bootstrap";
import Axios from "axios";
import Swal from "sweetalert2";
import "../App.css";

function FormCatalogo() {
  const { id } = useParams();
  const navigate = useNavigate();

  const imagenPredeterminada =
    "https://www.shutterstock.com/es/image-vector/image-coming-soon-no-picture-video-2450891047";

  // Estados del formulario
  const [nombre, setNombre] = useState("");
  const [especie, setEspecie] = useState("Perro");
  const [raza, setRaza] = useState("");
  const [sexo, setSexo] = useState("Macho");
  const [edadAprox, setEdadAprox] = useState("");
  const [tamaño, setTamaño] = useState("Mediano");
  const [marcas, setMarcas] = useState("");
  const [rasgos, setRasgos] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estatus, setEstatus] = useState("En adopción");
  const [imagenPreview, setImagenPreview] = useState(null);
  const [imagenFile, setImagenFile] = useState(null);
  const [modoEditar, setModoEditar] = useState(false);

  useEffect(() => {
    if (id) {
      setModoEditar(true);
      obtenerMascota();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const obtenerMascota = async () => {
    try {
      let res = await Axios.get(`http://localhost:3001/animales/${id}`).catch(() => null);
      if (!res || !res.data) {
        const lista = await Axios.get("http://localhost:3001/animales");
        const mascota = lista.data.find((a) => String(a.Id) === String(id));
        if (mascota) res = { data: mascota };
      }

      if (res?.data) {
        const m = res.data;
        setNombre(m.nombre || "");
        setEspecie(m.especie || "Perro");
        setRaza(m.raza || "");
        setSexo(m.sexo || "Macho");
        setEdadAprox(m.edadAprox || "");
        setTamaño(m.tamaño || "Mediano");
        setMarcas(m.marcas || "");
        setRasgos(m.rasgos || "");
        setDescripcion(m.descripcion || "");
        setEstatus(m.estatus || "En adopción");
        setImagenPreview(m.imagenMain || imagenPredeterminada);
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo cargar la información de la mascota.", "error");
    }
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire({
          icon: "warning",
          title: "Imagen demasiado grande",
          text: "Por favor selecciona una imagen menor a 2 MB.",
        });
        e.target.value = "";
        return;
      }

      const img = new window.Image();
      img.onload = () => {
        if (img.width < 800 || img.height < 600) {
          Swal.fire({
            icon: "warning",
            title: "Resolución muy baja",
            text: "La imagen debe tener al menos 800x600 píxeles (horizontal).",
          });
          e.target.value = "";
          return;
        }
      };
      img.src = URL.createObjectURL(file);

      setImagenFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagenPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const guardarMascota = async () => {
    if (!nombre || !especie || !edadAprox) {
      Swal.fire({
        icon: "warning",
        title: "Campos obligatorios",
        text: "Por favor completa nombre, especie y edad aproximada.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("especie", especie);
    formData.append("raza", raza);
    formData.append("sexo", sexo);
    formData.append("edadAprox", edadAprox);
    formData.append("tamaño", tamaño);
    formData.append("marcas", marcas);
    formData.append("rasgos", rasgos);
    formData.append("descripcion", descripcion);
    formData.append("estatus", estatus);

    try {
      if (modoEditar) {
        formData.append("Id", id);

        if (imagenFile) {
          formData.append("imagenMain", imagenFile);
        } else if (imagenPreview) {
          const response = await fetch(imagenPreview);
          const blob = await response.blob();
          formData.append("imagenMain", blob, "imagenActual.jpg");
        }

        await Axios.put("http://localhost:3001/animales/update", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire("Actualizado", "La mascota fue actualizada correctamente.", "success");
      } else {
        if (imagenFile) formData.append("imagenMain", imagenFile);
        await Axios.post("http://localhost:3001/animales/create", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire("Agregado", "La mascota fue registrada correctamente.", "success");
      }

      navigate("/catalogo");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo guardar la mascota.", "error");
    }
  };

  return (
    <div
      className="solicitud-container"
      style={{
        background: "linear-gradient(to bottom right, #eef2ff, #e0e7ff)",
        padding: "3rem 1rem",
        minHeight: "100vh",
      }}
    >
      <Card
        className="solicitud-card shadow"
        style={{
          borderRadius: "1rem",
          padding: "2rem",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <div className="text-center mb-4">
          <h2 style={{ color: "#4f46e5", fontWeight: "700" }}>
            {modoEditar ? "🐾 Editar Mascota" : "➕ Agregar Nueva Mascota"}
          </h2>
          <p style={{ color: "#6b7280", fontSize: "0.95rem" }}>
            Completa la información para registrar o actualizar una mascota.
          </p>
        </div>

        <Form className="solicitud-form">
          {/* Datos Generales */}
          <div className="mb-4">
            <h5 className="seccion-titulo" style={{ borderBottom: "2px solid #e0e7ff" }}>
              🐶 Datos Generales
            </h5>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="form-label">Nombre</Form.Label>
                  <Form.Control
                    className="form-input"
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: Rocky"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="form-label">Especie</Form.Label>
                  <Form.Select
                    className="form-input"
                    value={especie}
                    onChange={(e) => setEspecie(e.target.value)}
                  >
                    <option>Perro</option>
                    <option>Gato</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="form-label">Raza</Form.Label>
                  <Form.Control
                    className="form-input"
                    type="text"
                    value={raza}
                    onChange={(e) => setRaza(e.target.value)}
                    placeholder="Ej: Mestizo"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="form-label">Sexo</Form.Label>
                  <Form.Select
                    className="form-input"
                    value={sexo}
                    onChange={(e) => setSexo(e.target.value)}
                  >
                    <option>Macho</option>
                    <option>Hembra</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="form-label">Edad Aproximada</Form.Label>
                  <Form.Control
                    className="form-input"
                    type="text"
                    value={edadAprox}
                    onChange={(e) => setEdadAprox(e.target.value)}
                    placeholder="Ej: 3 años"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="form-label">Tamaño</Form.Label>
                  <Form.Select
                    className="form-input"
                    value={tamaño}
                    onChange={(e) => setTamaño(e.target.value)}
                  >
                    <option>Pequeño</option>
                    <option>Mediano</option>
                    <option>Grande</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="form-label">Estatus</Form.Label>
                  <Form.Select
                    className="form-input"
                    value={estatus}
                    onChange={(e) => setEstatus(e.target.value)}
                  >
                    <option>En adopción</option>
                    <option>Perdido</option>
                    <option>Adoptado</option>
                    <option>Entregado</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="form-label">Color / Marcas</Form.Label>
                  <Form.Control
                    as="textarea"
                    className="form-input"
                    rows={2}
                    value={marcas}
                    onChange={(e) => setMarcas(e.target.value)}
                    placeholder="Ej: Mancha blanca en el pecho, orejas negras..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="form-label">Rasgos distintivos</Form.Label>
                  <Form.Control
                    as="textarea"
                    className="form-input"
                    rows={2}
                    value={rasgos}
                    onChange={(e) => setRasgos(e.target.value)}
                    placeholder="Ej: Cojea de la pata trasera, muy sociable..."
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>

          {/* Descripción e Imagen */}
          <div className="mb-4">
            <h5 className="seccion-titulo" style={{ borderBottom: "2px solid #e0e7ff" }}>
              📸 Descripción y Fotografía
            </h5>

            <Form.Group className="mb-3">
              <Form.Label className="form-label">Descripción</Form.Label>
              <Form.Control
                as="textarea"
                className="form-input"
                rows={3}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Describe el temperamento o características del animal..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="form-label">Subir Imagen</Form.Label>
              <Form.Control
                className="form-input"
                type="file"
                accept="image/*"
                onChange={handleImagenChange}
              />
              <small className="form-help">
                Formato horizontal (mínimo 800x600 px, máximo 2 MB)
              </small>
            </Form.Group>

            {imagenPreview && (
              <div className="text-center mb-3">
                <Image
                  src={imagenPreview || imagenPredeterminada}
                  alt="Preview"
                  thumbnail
                  style={{
                    height: "250px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              </div>
            )}
          </div>

          <div className="form-navigation">
            <Button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/catalogo")}
            >
              <i className="bi bi-arrow-left"></i> Volver al Catálogo
            </Button>

            <div className="flex-spacer"></div>

            <Button
              type="button"
              className="btn btn-primary"
              onClick={guardarMascota}
            >
              <i className="bi bi-save"></i>{" "}
              {modoEditar ? "Actualizar Mascota" : "Registrar Mascota"}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default FormCatalogo;
