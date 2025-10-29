import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import Swal from "sweetalert2";
import "../App.css";

function Catalogo() {
  const navigate = useNavigate();
  const imagenPredeterminada =
    "https://www.shutterstock.com/image-vector/image-coming-soon-no-picture-video-2450891047";

  const [mascotas, setMascotas] = useState([]);
  const [filtroEstatus, setFiltroEstatus] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [usuario, setUsuario] = useState(null); // usuario logueado

  useEffect(() => {
    getMascotas();
    verificarUsuario();
  }, []);

  // ✅ Verificar tipo de usuario logueado
  const verificarUsuario = async () => {
    try {
      const res = await Axios.get("http://localhost:3001/usuario-actual", {
        withCredentials: true,
      });
      setUsuario(res.data); // Ejemplo: { tipo: 'empleado' o 'usuario' }
      console.log("Usuario detectado:", res.data);
    } catch (err) {
      console.log("No se pudo verificar usuario:", err);
    }
  };

  // ✅ Obtener mascotas del backend
  const getMascotas = async () => {
    try {
      const res = await Axios.get("http://localhost:3001/animales");
      setMascotas(res.data);
    } catch (err) {
      console.log("Error al obtener animales:", err);
    }
  };

  // ✅ Eliminar mascota
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

  // ✅ Filtrar mascotas por estatus y nombre
  const mascotasFiltradas = mascotas.filter((m) => {
    const coincideEstatus = !filtroEstatus || m.estatus === filtroEstatus;
    const coincideBusqueda =
      !busqueda ||
      m.nombre?.toLowerCase().includes(busqueda.trim().toLowerCase());
    return coincideEstatus && coincideBusqueda;
  });

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

        {/* 🔍 Buscador */}
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
        >
          <option value="">Todos los estatus</option>
          <option value="En adopción">En adopción</option>
          <option value="Adoptado">Adoptado</option>
          <option value="Perdido">Perdido</option>
          <option value="Entregado">Entregado</option>
        </Form.Select>

        {/* 🟢 Botones solo para empleados */}
        {usuario?.tipo === "empleado" && (
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
        )}
      </div>

      {/* ===============================
          🐶 LISTADO DE MASCOTAS
      ================================ */}
      <Row className="g-4">
        {mascotasFiltradas.length > 0 ? (
          mascotasFiltradas.map((m) => (
            <Col key={m.Id} xs={12} sm={6} lg={4}>
              <Card className="card-animal position-relative shadow-sm border-0 h-100">
                <div style={{ position: "relative" }}>
                  <Card.Img
                    variant="top"
                    src={m.imagen || m.imagenMain || imagenPredeterminada}
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

                    {usuario?.tipo === "empleado" && (
                      <>
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
                      </>
                    )}
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
    </Container>
  );
}

export default Catalogo;
