import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import Swal from "sweetalert2";
import "../App.css";

function Catalogo() {
  const navigate = useNavigate();
  const imagenPredeterminada =
    "https://www.shutterstock.com/es/image-vector/image-coming-soon-no-picture-video-2450891047";

  const [mascotas, setMascotas] = useState([]);
  const [mascotasPerdidas, setMascotasPerdidas] = useState([]);
  const [filtroEstatus, setFiltroEstatus] = useState("");

  // Estados del modal de aviso
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState(null);
  const [nombreContacto, setNombreContacto] = useState("");
  const [telefonoContacto, setTelefonoContacto] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [seLoLlevo, setSeLoLlevo] = useState(false);
  const [fechaAvistamiento, setFechaAvistamiento] = useState("");

  useEffect(() => {
    getMascotas();
    getMascotasPerdidas();
  }, []);

  // 🔹 Cargar mascotas en adopción
  const getMascotas = async () => {
    try {
      const res = await Axios.get("http://localhost:3001/animales");
      setMascotas(res.data);
    } catch (err) {
      console.log("Error al obtener animales:", err);
    }
  };

  // 🔹 Cargar mascotas perdidas
  const getMascotasPerdidas = async () => {
    try {
      const res = await Axios.get("http://localhost:3001/mascotas-perdidas");
      setMascotasPerdidas(res.data);
    } catch (err) {
      console.log("Error al obtener mascotas perdidas:", err);
    }
  };

  // 🔹 Eliminar mascota (solo adopción)
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
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo eliminar la mascota.",
          });
        }
      }
    });
  };

  // 🔹 Abrir modal para aviso
  const abrirModalAviso = (mascota) => {
    setMascotaSeleccionada(mascota);
    setMostrarModal(true);
  };

  // 🔹 Enviar aviso real
  const enviarAviso = async () => {
    if (!nombreContacto || !telefonoContacto || !ubicacion || !fechaAvistamiento) {
      Swal.fire({
        icon: "warning",
        title: "Campos obligatorios",
        text: "Completa todos los campos requeridos antes de enviar el aviso.",
      });
      return;
    }

    try {
      await Axios.post("http://localhost:3001/avistamientos/create", {
        mascota_id: mascotaSeleccionada.id,
        nombre_contacto: nombreContacto,
        telefono_contacto: telefonoContacto,
        ubicacion_avistamiento: ubicacion,
        descripcion: descripcion,
        se_lo_llevo: seLoLlevo,
        fecha_avistamiento: fechaAvistamiento,
      });

      Swal.fire({
        icon: "success",
        title: "Aviso enviado",
        text: "Tu reporte ha sido registrado. ¡Gracias por ayudar!",
      });

      // limpiar
      setMostrarModal(false);
      setNombreContacto("");
      setTelefonoContacto("");
      setUbicacion("");
      setDescripcion("");
      setSeLoLlevo(false);
      setFechaAvistamiento("");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo registrar el aviso. Intenta de nuevo.",
      });
    }
  };

  // 🔹 Filtrar mascotas
  const mascotasFiltradas = mascotas.filter(
    (m) => !filtroEstatus || m.estatus === filtroEstatus
  );

  return (
    <Container className="catalogo-container my-5">
      {/* 🏷️ Encabezado */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h2
          className="text-center text-md-start mb-0"
          style={{ color: "#4f46e5", fontWeight: "700" }}
        >
          🐾 Catálogo de Mascotas
        </h2>

        {/* 🟣 Filtro por estatus */}
        <Form.Select
          value={filtroEstatus}
          onChange={(e) => setFiltroEstatus(e.target.value)}
          style={{
            width: "220px",
            fontSize: "1rem",
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            border: "1px solid #d1d5db",
            boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
            outline: "none",
            color: "#374151",
            backgroundColor: "#fff",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#4f46e5")}
          onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
        >
          <option value="">Todos los estatus</option>
          <option value="En adopción">En adopción</option>
          <option value="Adoptado">Adoptado</option>
          <option value="Perdido">Perdido</option>
          <option value="Entregado">Entregado</option>
        </Form.Select>

        {/* 🟢 Botones */}
        <div className="d-flex gap-2">
          <Button
            className="btn btn-primary d-flex align-items-center gap-2 shadow-sm"
            style={{ fontWeight: "600", borderRadius: "0.5rem" }}
            onClick={() => navigate("/form-catalogo")}
          >
            <i className="bi bi-plus-circle"></i> Agregar Mascota
          </Button>

          <Button
            className="btn btn-warning d-flex align-items-center gap-2 shadow-sm"
            style={{
              fontWeight: "600",
              borderRadius: "0.5rem",
              color: "#1f2937",
            }}
            onClick={() => navigate("/form-mascota-perdida")}
          >
            <i className="bi bi-exclamation-triangle-fill"></i>{" "}
            Publicar Mascota Perdida
          </Button>
        </div>
      </div>

      {/* ===============================
          🐶 MASCOTAS EN ADOPCIÓN
      ================================ */}
      <h4 className="mb-3" style={{ color: "#374151" }}>
        🏡 Mascotas en Adopción
      </h4>

      <Row className="g-4">
        {mascotasFiltradas.length > 0 ? (
          mascotasFiltradas.map((m) => (
            <Col key={m.Id} xs={12} sm={6} lg={4}>
              <Card className="card-animal position-relative shadow-sm border-0">
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
                  <span className="etiqueta-especie">{m.especie || "Desconocido"}</span>
                  <span
                    className={`etiqueta-estatus ${(
                      m.estatus || "En adopción"
                    )
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {m.estatus || "En adopción"}
                  </span>
                </div>

                <Card.Body className="card-animal-body d-flex flex-column">
                  <div className="contenido-scroll">
                    <h5>{m.nombre}</h5>
                    <ul>
                      <li><strong>Sexo:</strong> {m.sexo}</li>
                      <li><strong>Edad:</strong> {m.edadAprox || "No especificada"}</li>
                      <li><strong>Tamaño:</strong> {m.tamaño}</li>
                      {m.marcas && <li><strong>Color / Marcas:</strong> {m.marcas}</li>}
                      {m.rasgos && <li><strong>Rasgos:</strong> {m.rasgos}</li>}
                    </ul>
                    {m.descripcion && (
                      <p className="text-muted">{m.descripcion}</p>
                    )}
                  </div>

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
          ))
        ) : (
          <p className="text-center mt-4 text-muted">No hay mascotas con este estatus.</p>
        )}
      </Row>

      {/* ===============================
          🐾 MASCOTAS PERDIDAS
      ================================ */}
      <h4 className="mt-5 mb-3" style={{ color: "#b45309" }}>
        ⚠️ Mascotas Perdidas
      </h4>

      <Row className="g-4">
        {mascotasPerdidas.length > 0 ? (
          mascotasPerdidas.map((m) => (
            <Col key={m.id} xs={12} sm={6} lg={4}>
              <Card className="card-animal shadow-sm border-warning border-2 h-100" style={{ borderRadius: "0.75rem" }}>
                <div style={{ position: "relative" }}>
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
                  <span className="etiqueta-especie bg-warning text-dark">{m.especie || "Desconocido"}</span>
                  <span className="position-absolute top-0 end-0 bg-danger text-white px-2 py-1 rounded-bottom-start" style={{ fontSize: "0.85rem", fontWeight: "bold" }}>
                    {m.estado?.toUpperCase() || "PENDIENTE"}
                  </span>
                </div>

                <Card.Body className="d-flex flex-column">
                  <div className="contenido-scroll">
                    <h5>{m.nombre_mascota}</h5>
                    <ul>
                      <li><strong>Color:</strong> {m.color || "No especificado"}</li>
                      <li><strong>Sexo:</strong> {m.sexo || "Desconocido"}</li>
                      <li><strong>Última ubicación:</strong> {m.ultima_ubicacion || "No indicada"}</li>
                      <li><strong>Fecha pérdida:</strong> {m.fecha_perdida ? new Date(m.fecha_perdida).toLocaleDateString() : "No registrada"}</li>
                    </ul>
                    {m.descripcion && <p className="text-muted">{m.descripcion}</p>}
                  </div>

                  <div className="d-flex justify-content-end mt-auto pt-3 border-top">
                    <Button
                      className="btn btn-warning d-flex align-items-center gap-1"
                      size="sm"
                      onClick={() => abrirModalAviso(m)}
                    >
                      <i className="bi bi-megaphone-fill"></i> Avisar
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-center mt-4 text-muted">No hay reportes de mascotas perdidas.</p>
        )}
      </Row>

      {/* 🪟 MODAL DE AVISO */}
      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            📢 Avisar sobre {mascotaSeleccionada?.nombre_mascota}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tu nombre</Form.Label>
              <Form.Control
                type="text"
                value={nombreContacto}
                onChange={(e) => setNombreContacto(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Teléfono o WhatsApp</Form.Label>
              <Form.Control
                type="text"
                value={telefonoContacto}
                onChange={(e) => setTelefonoContacto(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>¿Dónde la viste?</Form.Label>
              <Form.Control
                type="text"
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>📅 Fecha del avistamiento</Form.Label>
              <Form.Control
                type="date"
                value={fechaAvistamiento}
                onChange={(e) => setFechaAvistamiento(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción adicional</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="✅ Tengo a la mascota conmigo"
                checked={seLoLlevo}
                onChange={(e) => setSeLoLlevo(e.target.checked)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={enviarAviso}>
            Enviar Aviso
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Catalogo;
