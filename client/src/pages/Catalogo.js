import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import Swal from "sweetalert2";
import "../App.css"; // estilos globales estandarizados

function Catalogo() {
  const navigate = useNavigate();
  const imagenPredeterminada =
    "https://www.shutterstock.com/es/image-vector/image-coming-soon-no-picture-video-2450891047";

  const [mascotas, setMascotas] = useState([]);

  useEffect(() => {
    getMascotas();
  }, []);

  const getMascotas = async () => {
    try {
      const res = await Axios.get("http://localhost:3001/animales");
      setMascotas(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const eliminarMascota = (Id, nombre) => {
    Swal.fire({
      title: `¿Eliminar a ${nombre}?`,
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await Axios.delete(`http://localhost:3001/animales/delete/${Id}`);
          Swal.fire({
            icon: "success",
            title: "Eliminado",
            text: `${nombre} fue eliminado correctamente.`,
            timer: 2000,
          });
          getMascotas();
        } catch (err) {
          console.log(err);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo eliminar la mascota.",
          });
        }
      }
    });
  };

  return (
    <Container className="catalogo-container my-5">
      {/* ENCABEZADO */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
        <h2 className="text-center text-md-start mb-3 mb-md-0" style={{ color: "#4f46e5", fontWeight: "700" }}>
          🐾 Mascotas disponibles para adopción
        </h2>

        {/* 🔹 BOTÓN AGREGAR MASCOTA */}
        <Button
          className="btn btn-primary d-flex align-items-center gap-2 shadow-sm"
          style={{ fontWeight: "600", borderRadius: "0.5rem" }}
          onClick={() => navigate("/form-catalogo")}
        >
          <i className="bi bi-plus-circle"></i> Agregar Mascota
        </Button>
      </div>

      {/* TARJETAS */}
      <Row className="g-4">
        {mascotas.map((m) => (
          <Col key={m.Id} xs={12} sm={6} lg={4}>
            <Card className="card-animal position-relative h-100 shadow-sm border-0">
              {/* Imagen */}
              <div style={{ position: "relative" }}>
                <Card.Img
                  variant="top"
                  src={m.imagenMain || imagenPredeterminada}
                  alt={m.nombre}
                  style={{
                    height: "250px",
                    objectFit: "cover",
                    borderTopLeftRadius: "0.75rem",
                    borderTopRightRadius: "0.75rem",
                  }}
                />
                <span
                  className="etiqueta-especie"
                  style={{
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    backgroundColor: "#6366f1",
                    color: "white",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "0.5rem",
                    fontSize: "0.8rem",
                    fontWeight: "500",
                  }}
                >
                  {m.especie || "Sin especie"}
                </span>
              </div>

              {/* Cuerpo del card */}
              <Card.Body className="card-animal-body d-flex flex-column">
                <h5 style={{ color: "#1f2937", fontWeight: "600" }}>{m.nombre}</h5>

                <ul style={{ listStyle: "none", paddingLeft: 0, fontSize: "0.9rem" }}>
                  <li>
                    <strong>Sexo:</strong> {m.sexo}
                  </li>
                  <li>
                    <strong>Edad:</strong> {m.edadAprox || "No especificada"}
                  </li>
                  <li>
                    <strong>Tamaño:</strong> {m.tamaño}
                  </li>
                  {m.rasgos && (
                    <li>
                      <strong>Carácter:</strong> {m.rasgos}
                    </li>
                  )}
                </ul>

                {m.descripcion && (
                  <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                    {m.descripcion.length > 100
                      ? m.descripcion.substring(0, 100) + "..."
                      : m.descripcion}
                  </p>
                )}

                {/* Botones */}
                <div className="d-flex justify-content-between mt-auto pt-3 border-top">
                  <Button
                    className="btn btn-success d-flex align-items-center gap-1"
                    size="sm"
                    onClick={() => navigate("/solicitud")}
                  >
                    <i className="bi bi-heart-fill"></i> Adoptar
                  </Button>

                  <Button
                    className="btn btn-warning d-flex align-items-center gap-1"
                    size="sm"
                    onClick={() => navigate(`/form-catalogo/${m.Id}`)}
                  >
                    <i className="bi bi-pencil-square"></i> Editar
                  </Button>

                  <Button
                    className="btn btn-danger d-flex align-items-center gap-1"
                    size="sm"
                    onClick={() => eliminarMascota(m.Id, m.nombre)}
                  >
                    <i className="bi bi-trash-fill"></i> Eliminar
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}

        {/* Si no hay mascotas */}
        {mascotas.length === 0 && (
          <div className="text-center mt-5">
            <p style={{ color: "#6b7280" }}>No hay mascotas registradas actualmente 🐶🐱</p>
          </div>
        )}
      </Row>
    </Container>
  );
}

export default Catalogo;
