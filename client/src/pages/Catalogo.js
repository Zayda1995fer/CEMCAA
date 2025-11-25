import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import "../App.css";

function Catalogo() {
  const navigate = useNavigate();
  const imagenPredeterminada =
    "https://www.shutterstock.com/image-vector/image-coming-soon-no-picture-video-2450891047";

  const [mascotas, setMascotas] = useState([]);
  const [perdidas, setPerdidas] = useState([]);
  const [filtroEstatus, setFiltroEstatus] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    verificarUsuario();
    cargarMascotas();
    cargarMascotasPerdidas();
  }, []);

  const verificarUsuario = async () => {
    try {
      const res = await Axios.get("http://localhost:3001/usuario-actual", {
        withCredentials: true,
      });
      setUsuario(res.data);
    } catch (err) {
      console.log("No se pudo verificar usuario:", err);
    }
  };

  const cargarMascotas = async () => {
    try {
      const res = await Axios.get("http://localhost:3001/animales");
      setMascotas(res.data);
    } catch (err) {
      console.log("Error al obtener animales:", err);
    }
  };

  const cargarMascotasPerdidas = async () => {
    try {
      const res = await Axios.get("http://localhost:3001/mascotas-perdidas");
      setPerdidas(res.data);
    } catch (err) {
      console.log("Error al obtener mascotas perdidas:", err);
    }
  };

  const handleFiltro = (e) => {
    setFiltroEstatus(e.target.value);
  };

  const mascotasFiltradas = mascotas.filter(
    (m) =>
      (!busqueda ||
        m.nombre?.toLowerCase().includes(busqueda.trim().toLowerCase())) &&
      (!filtroEstatus || m.estatus === filtroEstatus)
  );

  const perdidasFiltradas = perdidas.filter(
    (m) =>
      !busqueda || m.nombre?.toLowerCase().includes(busqueda.trim().toLowerCase())
  );

  return (
    <Container className="catalogo-container my-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h2
          className="text-center text-md-start mb-0"
          style={{ color: "#4f46e5", fontWeight: "700" }}
        >
          🐾 Catálogo de Mascotas
        </h2>

        <Form.Control
          type="text"
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            width: "250px",
            fontSize: "1rem",
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            border: "1px solid #d1d5db",
          }}
        />

        <Form.Select
          value={filtroEstatus}
          onChange={handleFiltro}
          style={{
            width: "220px",
            fontSize: "1rem",
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            border: "1px solid #d1d5db",
            boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
          }}
        >
          <option value="">Todos los estatus</option>
          <option value="En Adopción">En Adopción</option>
          <option value="Adoptado">Adoptado</option>
          <option value="Perdido">Perdido</option>
          <option value="Entregado">Entregado</option>
        </Form.Select>

        <div className="d-flex gap-2">
          {usuario && (
            <Button
              className="btn btn-warning d-flex align-items-center gap-2 shadow-sm"
              style={{
                fontWeight: "600",
                borderRadius: "0.5rem",
                color: "#1f2937",
              }}
              onClick={() => navigate("/form-mascota-perdida")}
            >
              <i className="bi bi-exclamation-triangle-fill"></i> Publicar Mascota
              Perdida
            </Button>
          )}
        </div>
      </div>

      {/* Mascotas normales */}
      <Row className="g-4 mb-5">
        {mascotasFiltradas.length > 0 ? (
          mascotasFiltradas.map((m) => (
            <Col key={m.id} xs={12} sm={6} lg={4}>
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
                    className={`etiqueta-estatus ${
                      (m.estatus || "En adopción").toLowerCase().replace(" ", "-")
                    }`}
                  >
                    {m.estatus || "En adopción"}
                  </span>
                </div>
                <Card.Body className="card-animal-body d-flex flex-column">
                  <div className="contenido-scroll">
                    <h5>{m.nombre}</h5>
                    <ul>
                      <li>
                        <strong>Sexo:</strong> {m.sexo}
                      </li>
                      <li>
                        <strong>Edad:</strong> {m.edadAprox || "No especificada"}
                      </li>
                      <li>
                        <strong>Tamaño:</strong> {m.tamaño}
                      </li>
                      {m.marcas && <li><strong>Color / Marcas:</strong> {m.marcas}</li>}
                      {m.rasgos && <li><strong>Rasgos:</strong> {m.rasgos}</li>}
                    </ul>
                    {m.descripcion && <p className="text-muted">{m.descripcion}</p>}
                  </div>
                  <div className="d-flex justify-content-between mt-auto pt-3 border-top">
                    <Button
                      className="btn btn-success d-flex align-items-center gap-1"
                      size="sm"
                      onClick={() => navigate("/solicitud")}
                    >
                      <i className="bi bi-heart-fill"></i> Adoptar
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-center mt-4 text-muted">
            No hay mascotas que coincidan con tu búsqueda o filtro.
          </p>
        )}
      </Row>

      {/* Mascotas perdidas */}
      <h3 style={{ color: "#dc2626", fontWeight: "700", marginBottom: "15px" }}>
        🐾 Mascotas Perdidas por la Ciudadanía
      </h3>
      <Row className="g-4">
        {perdidasFiltradas.length > 0 ? (
          perdidasFiltradas.map((m) => (
            <Col key={m.id} xs={12} sm={6} lg={4}>
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
                </div>
                <Card.Body className="card-animal-body d-flex flex-column">
                  <div className="contenido-scroll">
                    <h5>{m.nombre}</h5>
                    <ul>
                      <li>
                        <strong>Sexo:</strong> {m.sexo}
                      </li>
                      <li>
                        <strong>Edad:</strong> {m.edadAprox || "No especificada"}
                      </li>
                      <li>
                        <strong>Tamaño:</strong> {m.tamaño}
                      </li>
                      {m.marcas && <li><strong>Color / Marcas:</strong> {m.marcas}</li>}
                      {m.rasgos && <li><strong>Rasgos:</strong> {m.rasgos}</li>}
                    </ul>
                    {m.descripcion && <p className="text-muted">{m.descripcion}</p>}
                  </div>
                  <div className="d-flex justify-content-between mt-auto pt-3 border-top">
                    <Button
                      className="btn btn-info d-flex align-items-center gap-1"
                      size="sm"
                      onClick={() => {
                        console.log("Mascota perdida seleccionada ID:", m.id);
                        navigate(`/reportar-avistamiento/${m.id}`);
                      }}
                    >
                      <i className="bi bi-exclamation-triangle"></i> Reportar Avistamiento
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-center mt-4 text-muted">No hay mascotas perdidas registradas.</p>
        )}
      </Row>
    </Container>
  );
}

export default Catalogo;
