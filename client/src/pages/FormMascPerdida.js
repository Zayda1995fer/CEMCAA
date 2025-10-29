// src/pages/FormMascPerdida.js
import React, { useState } from "react";
import { Form, Button, Row, Col, Card, Image } from "react-bootstrap";
import Axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "../App.css";

function FormMascPerdida() {
  const navigate = useNavigate();

  const [nombreMascota, setNombreMascota] = useState("");
  const [especie, setEspecie] = useState("Perro");
  const [raza, setRaza] = useState("");
  const [color, setColor] = useState("");
  const [sexo, setSexo] = useState("Desconocido");
  const [descripcion, setDescripcion] = useState("");
  const [ultimaUbicacion, setUltimaUbicacion] = useState("");
  const [fechaPerdida, setFechaPerdida] = useState("");
  const [estado, setEstado] = useState("pendiente"); // controlado por front
  const [imagenFile, setImagenFile] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);

  const imagenPredeterminada =
    "https://www.shutterstock.com/es/image-vector/image-coming-soon-no-picture-video-2450891047";

  // Manejar carga de imagen
  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagenFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagenPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Guardar la publicación
  const guardarPublicacion = async () => {
    if (!nombreMascota || !descripcion || !ultimaUbicacion || !fechaPerdida) {
      Swal.fire({
        icon: "warning",
        title: "Campos obligatorios",
        text: "Por favor completa todos los campos requeridos.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("nombre_mascota", nombreMascota);
    formData.append("especie", especie);
    formData.append("raza", raza);
    formData.append("color", color);
    formData.append("sexo", sexo);
    formData.append("descripcion", descripcion);
    formData.append("ultima_ubicacion", ultimaUbicacion);
    formData.append("fecha_perdida", fechaPerdida);
    formData.append("estado", estado);
    if (imagenFile) formData.append("imagen", imagenFile);

    try {
      await Axios.post("http://localhost:3001/mascotas-perdidas/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire("✅ Publicado", "Tu reporte ha sido enviado para revisión.", "success");
      navigate("/mascotas-perdidas"); // redirige después de guardar
    } catch (err) {
      console.error(err);
      Swal.fire("❌ Error", "No se pudo registrar el reporte.", "error");
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
          <h2 style={{ color: "#4f46e5", fontWeight: "700" }}>🐾 Reportar Mascota Perdida</h2>
          <p style={{ color: "#6b7280", fontSize: "0.95rem" }}>
            Completa la información para reportar una mascota perdida.
          </p>
        </div>

        <Form>
          <h5 className="seccion-titulo mb-3" style={{ borderBottom: "2px solid #e0e7ff" }}>
            📋 Información de la Mascota
          </h5>

          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  value={nombreMascota}
                  onChange={(e) => setNombreMascota(e.target.value)}
                  placeholder="Ej: Rocky"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Especie</Form.Label>
                <Form.Select value={especie} onChange={(e) => setEspecie(e.target.value)}>
                  <option>Perro</option>
                  <option>Gato</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Raza</Form.Label>
                <Form.Control
                  type="text"
                  value={raza}
                  onChange={(e) => setRaza(e.target.value)}
                  placeholder="Ej: Mestizo"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Color</Form.Label>
                <Form.Control
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="Ej: Blanco con manchas negras"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Sexo</Form.Label>
                <Form.Select value={sexo} onChange={(e) => setSexo(e.target.value)}>
                  <option>Desconocido</option>
                  <option>Macho</option>
                  <option>Hembra</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Fecha en que se perdió</Form.Label>
                <Form.Control
                  type="date"
                  value={fechaPerdida}
                  onChange={(e) => setFechaPerdida(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mt-3">
            <Form.Label>Última ubicación conocida</Form.Label>
            <Form.Control
              type="text"
              value={ultimaUbicacion}
              onChange={(e) => setUltimaUbicacion(e.target.value)}
              placeholder="Ej: Cerca del parque central"
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Descripción y rasgos distintivos</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ej: Llevaba un collar rojo y es muy sociable."
            />
          </Form.Group>

          {/* Subida de imagen */}
          <Form.Group className="mt-4">
            <Form.Label>Fotografía</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleImagenChange} />
            <small className="text-muted">Tamaño máximo recomendado: 2 MB</small>
          </Form.Group>

          {imagenPreview && (
            <div className="text-center mt-3">
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

          {/* Botones */}
          <div className="mt-4 d-flex justify-content-between">
            <Button variant="secondary" onClick={() => navigate("/")}>
              ← Volver
            </Button>
            <Button variant="primary" onClick={guardarPublicacion}>
              📤 Publicar Reporte
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default FormMascPerdida;
