// src/pages/PanelEmpleados.js
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Spinner, Badge } from "react-bootstrap";
import Axios from "axios";
import Swal from "sweetalert2";
import "../App.css";

function PanelEmpleados() {
  const [vistaActiva, setVistaActiva] = useState("solicitudes");
  const [mascotasPerdidas, setMascotasPerdidas] = useState([]);
  const [avistamientos, setAvistamientos] = useState([]);
  const [loading, setLoading] = useState(false);

  const imagenPredeterminada =
    "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";

  useEffect(() => {
    cargarMascotasPerdidas();
    cargarAvistamientos();
  }, []);

  const cargarMascotasPerdidas = async () => {
    setLoading(true);
    try {
      const res = await Axios.get("http://localhost:3001/mascotas-perdidas");
      setMascotasPerdidas(res.data);
    } catch (err) {
      console.error("Error al obtener mascotas perdidas:", err);
      Swal.fire("❌ Error", "No se pudieron cargar las solicitudes.", "error");
    } finally {
      setLoading(false);
    }
  };

  const cargarAvistamientos = async () => {
    try {
      const res = await Axios.get("http://localhost:3001/avistamientos");
      setAvistamientos(res.data);
    } catch (err) {
      console.error("Error al obtener avistamientos:", err);
    }
  };

  const cambiarEstado = async (idMascotaPerdida, nuevoEstado) => {
    if (!idMascotaPerdida) {
      Swal.fire("Error", "ID de mascota no definido.", "error");
      return;
    }

    Swal.fire({
      title: `¿Confirmas cambiar el estado a "${nuevoEstado}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, cambiar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#6b7280",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await Axios.put(
            `http://localhost:3001/mascotas-perdidas/${idMascotaPerdida}/estado`,
            { estado: nuevoEstado }
          );
          Swal.fire("✅ Estado actualizado", "", "success");
          cargarMascotasPerdidas();
        } catch (err) {
          console.error("Error al actualizar estado:", err);
          Swal.fire("Error", "No se pudo actualizar el estado.", "error");
        }
      }
    });
  };

  // Función para color del badge según estado
  const colorEstado = (estado) => {
    switch (estado) {
      case "Perdido":
        return "danger"; // rojo
      case "Encontrado":
        return "success"; // verde
      default:
        return "secondary"; // gris
    }
  };

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4" style={{ color: "#4f46e5", fontWeight: "700" }}>
        🐾 Panel de Empleados
      </h2>

      {/* Pestañas */}
      <div className="d-flex justify-content-center mb-4 gap-3">
        <Button
          variant={vistaActiva === "solicitudes" ? "primary" : "outline-primary"}
          onClick={() => setVistaActiva("solicitudes")}
          style={{ minWidth: "180px", fontWeight: "600" }}
        >
          📋 Solicitudes
        </Button>
        <Button
          variant={vistaActiva === "avisos" ? "warning" : "outline-warning"}
          onClick={() => setVistaActiva("avisos")}
          style={{ minWidth: "180px", fontWeight: "600", color: "#1f2937" }}
        >
          📢 Avisos
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="text-muted mt-2">Cargando datos...</p>
        </div>
      ) : (
        <>
          {vistaActiva === "solicitudes" && (
            <>
              <h4 className="mb-4" style={{ color: "#374151" }}>
                🐶 Mascotas Perdidas Reportadas
              </h4>
              <Row className="g-4">
                {mascotasPerdidas.length > 0 ? (
                  mascotasPerdidas.map((m) => (
                    <Col key={m.id} xs={12} sm={6} lg={4}>
                      <Card
                        className="shadow-sm border-0 h-100"
                        style={{
                          borderTop: "4px solid #4f46e5",
                          borderRadius: "0.75rem",
                        }}
                      >
                        <Card.Img
                          variant="top"
                          src={m.imagen || imagenPredeterminada}
                          alt={m.nombre_mascota}
                          style={{
                            height: "250px",
                            objectFit: "cover",
                            borderTopLeftRadius: "0.75rem",
                            borderTopRightRadius: "0.75rem",
                          }}
                        />
                        <Card.Body className="d-flex flex-column">
                          <h5>{m.nombre_mascota}</h5>
                          <ul className="mb-3">
                            <li><strong>Especie:</strong> {m.especie}</li>
                            <li><strong>Raza:</strong> {m.raza || "N/A"}</li>
                            <li><strong>Color:</strong> {m.color || "N/A"}</li>
                            <li><strong>Sexo:</strong> {m.sexo}</li>
                            <li><strong>Última ubicación:</strong> {m.ultima_ubicacion || "No especificada"}</li>
                            <li><strong>Fecha pérdida:</strong> {m.fecha_perdida ? new Date(m.fecha_perdida).toLocaleDateString() : "No registrada"}</li>
                            <li>
                              <strong>Estado actual:</strong>{" "}
                              <Badge bg={colorEstado(m.estado)}>{m.estado}</Badge>
                            </li>
                          </ul>
                          <div className="d-flex flex-wrap gap-2 mt-auto pt-2 border-top">
                            <Button size="sm" variant="success" onClick={() => cambiarEstado(m.id, "Encontrado")}>
                              🐕 Marcar como Encontrado
                            </Button>
                            <Button size="sm" variant="secondary" onClick={() => cambiarEstado(m.id, "Perdido")}>
                              🔄 Volver a Perdido
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))
                ) : (
                  <p className="text-center text-muted mt-5">
                    No hay mascotas reportadas actualmente.
                  </p>
                )}
              </Row>
            </>
          )}

          {vistaActiva === "avisos" && (
            <>
              <h4 className="mb-4" style={{ color: "#b45309" }}>
                📢 Avistamientos Registrados
              </h4>
              <Row className="g-4">
                {avistamientos.length > 0 ? (
                  avistamientos.map((a) => (
                    <Col key={a.id} xs={12} sm={6} lg={4}>
                      <Card
                        className="shadow-sm border-warning border-2 h-100"
                        style={{
                          borderRadius: "0.75rem",
                          backgroundColor: "#fffdf4",
                        }}
                      >
                        <Card.Body className="d-flex flex-column">
                          <h5 style={{ color: "#92400e" }}>👀 Avistamiento #{a.id}</h5>
                          <p><strong>📅 Fecha vista:</strong>{" "} {a.fecha_avistamiento ? new Date(a.fecha_avistamiento).toLocaleDateString() : "No registrada"}</p>
                          <p><strong>👤 Reportó:</strong> {a.nombre_contacto || "Anónimo"}</p>
                          <p><strong>📞 Teléfono:</strong> {a.telefono_contacto || "No proporcionado"}</p>
                          <p><strong>📍 Ubicación:</strong> {a.ubicacion_avistamiento}</p>
                          <p><strong>📝 Descripción:</strong> {a.descripcion || "Sin detalles"}</p>
                          <p><strong>🏠 ¿Se la llevó?:</strong> {a.se_lo_llevo ? "Sí" : "No"}</p>
                          <div className="mt-auto pt-2 border-top">
                            <Button size="sm" variant="outline-secondary" disabled>🐶 ID Mascota: {a.mascota_id}</Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))
                ) : (
                  <p className="text-center text-muted mt-5">No hay avistamientos registrados aún.</p>
                )}
              </Row>
            </>
          )}
        </>
      )}
    </Container>
  );
}

export default PanelEmpleados;
