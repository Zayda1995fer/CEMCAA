import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Axios from "../config/axios";
import "../App.css";

function Catalogo() {
  const navigate = useNavigate();
  const imagenPredeterminada =
    "https://www.shutterstock.com/image-vector/image-coming-soon-no-picture-video-2450891047";

  const [mascotas, setMascotas] = useState([]);
  const [perdidas, setPerdidas] = useState([]);
  const [filtroEstatus, setFiltroEstatus] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [mostrarAlerta, setMostrarAlerta] = useState(false);

  useEffect(() => {
    cargarMascotas();
    cargarMascotasPerdidas();
  }, []);

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

  const handleAdoptar = async (mascotaId) => {
    // ✅ VERIFICAR SESIÓN ANTES DE ADOPTAR
    try {
      await Axios.get("http://localhost:3001/usuario-actual", {
        withCredentials: true,
      });
      
      // Si llegamos aquí, hay sesión activa
      navigate(`/solicitud/${mascotaId}`);
      
    } catch (err) {
      // No hay sesión, mostrar alerta y redirigir
      setMostrarAlerta(true);
      setTimeout(() => {
        navigate("/auth");
      }, 2000);
    }
  };

  const mascotasFiltradas = mascotas.filter(
    (m) =>
      (!busqueda ||
        m.nombre?.toLowerCase().includes(busqueda.trim().toLowerCase())) &&
      (!filtroEstatus || m.estatus === filtroEstatus)
  );

  const perdidasFiltradas = perdidas.filter(
    (m) =>
      !busqueda ||
      m.nombre?.toLowerCase().includes(busqueda.trim().toLowerCase())
  );

  return (
    <Container className="catalogo-container my-5">
      {/* Alerta de inicio de sesión requerido */}
      {mostrarAlerta && (
        <Alert 
          variant="warning" 
          dismissible 
          onClose={() => setMostrarAlerta(false)}
          className="position-fixed top-0 start-50 translate-middle-x mt-3"
          style={{ zIndex: 9999, width: "90%", maxWidth: "500px" }}
        >
          <Alert.Heading>
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            Inicio de sesión requerido
          </Alert.Heading>
          <p>Por favor inicia sesión para poder adoptar una mascota. Serás redirigido al login...</p>
        </Alert>
      )}

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
      </div>

      {/* Mascotas normales */}
      <Row className="g-4 mb-5">
        {mascotasFiltradas.length > 0 ? (
          mascotasFiltradas.map((m) => (
            <Col key={m.id} xs={12} sm={6} lg={4}>
              <Card className="card-animal position-relative shadow-sm border-0 h-100">
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
                  <span className="etiqueta-especie">
                    {m.especie || "Desconocido"}
                  </span>
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
                  <div className="contenido-scroll flex-grow-1">
                    <h5 className="mb-3">{m.nombre}</h5>
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <i className="bi bi-gender-ambiguous text-primary me-2"></i>
                        <strong>Sexo:</strong> {m.sexo}
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-calendar-heart text-primary me-2"></i>
                        <strong>Edad:</strong>{" "}
                        {m.edadAprox || "No especificada"}
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-rulers text-primary me-2"></i>
                        <strong>Tamaño:</strong> {m.tamaño}
                      </li>
                      {m.marcas && (
                        <li className="mb-2">
                          <i className="bi bi-palette text-primary me-2"></i>
                          <strong>Color / Marcas:</strong> {m.marcas}
                        </li>
                      )}
                      {m.rasgos && (
                        <li className="mb-2">
                          <i className="bi bi-star text-primary me-2"></i>
                          <strong>Rasgos:</strong> {m.rasgos}
                        </li>
                      )}
                    </ul>
                    {m.descripcion && (
                      <p className="text-muted small mt-2">{m.descripcion}</p>
                    )}
                  </div>

                  <div className="d-flex justify-content-between mt-3 pt-3 border-top">
                    

                    <Button
                      className="btn btn-success d-flex align-items-center gap-1"
                      size="sm"
                      onClick={() => handleAdoptar(m.id)}
                      disabled={m.estatus !== "En Adopción"}
                      title={m.estatus !== "En Adopción" ? "Esta mascota no está disponible para adopción" : "Iniciar proceso de adopción"}
                    >
                      <i className="bi bi-heart-fill"></i> Adoptar
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col xs={12}>
            <Alert variant="info" className="text-center">
              <i className="bi bi-info-circle me-2"></i>
              No hay mascotas que coincidan con tu búsqueda o filtro.
            </Alert>
          </Col>
        )}
      </Row>

      {/* Mascotas perdidas */}
      <h3 style={{ color: "#dc2626", fontWeight: "700", marginBottom: "20px" }}>
        🆘 Mascotas Perdidas por la Ciudadanía
      </h3>

      <Row className="g-4">
        {perdidasFiltradas.length > 0 ? (
          perdidasFiltradas.map((m) => (
            <Col key={m.id} xs={12} sm={6} lg={4}>
              <Card className="card-animal position-relative shadow-sm border-0 h-100 border-danger">
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
                  <span className="etiqueta-especie bg-danger">
                    {m.especie || "Desconocido"}
                  </span>
                  <span className="badge bg-danger position-absolute top-0 end-0 m-2">
                    PERDIDO
                  </span>
                </div>

                <Card.Body className="card-animal-body d-flex flex-column">
                  <div className="contenido-scroll flex-grow-1">
                    <h5 className="mb-3 text-danger">{m.nombre}</h5>
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <i className="bi bi-gender-ambiguous text-danger me-2"></i>
                        <strong>Sexo:</strong> {m.sexo}
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-calendar-heart text-danger me-2"></i>
                        <strong>Edad:</strong>{" "}
                        {m.edadAprox || "No especificada"}
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-rulers text-danger me-2"></i>
                        <strong>Tamaño:</strong> {m.tamaño}
                      </li>
                      {m.marcas && (
                        <li className="mb-2">
                          <i className="bi bi-palette text-danger me-2"></i>
                          <strong>Color / Marcas:</strong> {m.marcas}
                        </li>
                      )}
                      {m.rasgos && (
                        <li className="mb-2">
                          <i className="bi bi-star text-danger me-2"></i>
                          <strong>Rasgos:</strong> {m.rasgos}
                        </li>
                      )}
                    </ul>
                    {m.descripcion && (
                      <p className="text-muted small mt-2">{m.descripcion}</p>
                    )}
                  </div>

                  <div className="d-flex justify-content-center mt-3 pt-3 border-top">
                    <Button
                      className="btn btn-danger d-flex align-items-center gap-2 w-100"
                      size="sm"
                      onClick={() =>
                        navigate(`/reportar-avistamiento/${m.id}`)
                      }
                    >
                      <i className="bi bi-exclamation-triangle"></i> Reportar
                      Avistamiento
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col xs={12}>
            <Alert variant="success" className="text-center">
              <i className="bi bi-check-circle me-2"></i>
              No hay mascotas perdidas registradas en este momento.
            </Alert>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default Catalogo;