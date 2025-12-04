// client/src/components/Solicitud/ResumenSolicitud.js
import { useState, useEffect } from "react";
import axios from "../../config/axios";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Spinner, Alert, Button } from "react-bootstrap";
import SeccionSolicitud from "./SeccionSolicitud";
import "../../styles/solicitud.css";

const ResumenSolicitud = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [solicitud, setSolicitud] = useState(null);
  const [progreso, setProgreso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seccionExpandida, setSeccionExpandida] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [cambiandoEstado, setCambiandoEstado] = useState(false);

  // ----------- CARGAR SOLICITUD -----------  
  const cargarSolicitud = async () => {
    try {
      setLoading(true);
      setError(null);

      const resp = await axios.get(`/adopcion/solicitud/${id}`);

      if (resp.data.success) {
        setSolicitud(resp.data.solicitud);
        setProgreso(resp.data.progreso);
      } else {
        setError("No se pudo cargar la solicitud");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error al cargar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  // ----------- USE EFFECT -----------  
  useEffect(() => {
    cargarSolicitud();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ---- ESTADOS DISPONIBLES ----
  const estados = [
    { valor: "Pendiente", color: "warning", icono: "⏳" },
    { valor: "En Revisión", color: "info", icono: "🔍" },
    { valor: "Aprobada", color: "success", icono: "✅" },
    { valor: "Rechazada", color: "danger", icono: "❌" },
    { valor: "Can", color: "secondary", icono: "🚫" }
  ];

  const estadoActualObj =
    estados.find((e) => e.valor === solicitud?.estado) || estados[0];

  // ----------- CAMBIAR ESTADO -----------  
  const cambiarEstado = async (nuevoEstado) => {
    if (!solicitud) return;

    const ok = window.confirm(
      `¿Seguro que desea cambiar el estado a "${nuevoEstado}"?`
    );
    if (!ok) return;

    setCambiandoEstado(true);
    setMensaje(null);

    try {
      const resp = await axios.put(`/adopcion/solicitud/${id}/estatus`, {
        estatus: nuevoEstado
      });

      if (resp.data.success) {
        setMensaje({
          tipo: "success",
          texto: `Estado actualizado correctamente a "${nuevoEstado}"`
        });

        // Actualizamos localmente el estado
        setSolicitud({ ...solicitud, estado: nuevoEstado });
      }
    } catch (err) {
      setMensaje({
        tipo: "error",
        texto:
          err.response?.data?.message || "Error al intentar cambiar el estado"
      });
    } finally {
      setCambiandoEstado(false);
    }
  };

  const porcentaje = progreso?.porcentaje || 0;
  const completas = progreso?.completas || 0;
  const total = progreso?.total || 0;

  const toggleSeccion = (nombre) => {
    setSeccionExpandida(seccionExpandida === nombre ? null : nombre);
  };

  // ----------- UI -----------  
  if (loading || !solicitud) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
        <p>Cargando solicitud...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={cargarSolicitud}>
            Reintentar
          </Button>
          <Button
            variant="outline-secondary"
            className="ms-2"
            onClick={() => navigate("/solicitudes")}
          >
            Volver a la lista
          </Button>
        </Alert>
      </Container>
    );
  }

  const secciones = solicitud.secciones || {};

  return (
    <Container className="my-5">
      {/* ENCABEZADO */}
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h1 className="text-primary fw-bold">📋 Solicitud #{id}</h1>
          <p className="text-muted">Usuario: {solicitud.usuario_id}</p>
          <p className="text-muted small">
            Fecha:{" "}
            {solicitud.fecha_solicitud
              ? new Date(solicitud.fecha_solicitud).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
        <Button variant="outline-primary" onClick={() => navigate("/solicitudes")}>
          ← Volver
        </Button>
      </div>

      {/* MENSAJE */}
      {mensaje && (
        <div
          className={`alert alert-${
            mensaje.tipo === "success" ? "success" : "danger"
          }`}
        >
          {mensaje.texto}
        </div>
      )}

      {/* RESUMEN */}
      <div className="resumen-solicitud card p-4 mb-4">
        <h2>📊 Resumen de la Solicitud</h2>
        <div className="d-flex justify-content-between py-3 border-bottom">
          <div>
            <p className="fw-bold">Estado actual</p>
            <span style={{ fontSize: "20px" }}>
              {estadoActualObj.icono} {estadoActualObj.valor}
            </span>
          </div>
          <div>
            <p className="fw-bold mb-2">Cambiar estado</p>
            <div className="d-flex gap-2 flex-wrap">
              {estados.map((estado) => (
                <button
                  key={estado.valor}
                  disabled={cambiandoEstado || estadoActualObj.valor === estado.valor}
                  className="btn btn-sm text-white"
                  style={{
                    backgroundColor:
                      estado.color === "success"
                        ? "#10b981"
                        : estado.color === "danger"
                        ? "#ef4444"
                        : estado.color === "info"
                        ? "#3b82f6"
                        : "#6b7280"
                  }}
                  onClick={() => cambiarEstado(estado.valor)}
                >
                  {estado.icono} {estado.valor}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* COMPLETITUD */}
        <div className="d-flex justify-content-between mt-3">
          <p>
            {completas} de {total} secciones completas
          </p>
          <span className="badge bg-secondary">
            Progreso: {porcentaje.toFixed(1)}%
          </span>
        </div>
        <div className="rs-progress-track mt-2">
          <div
            className="rs-progress-fill"
            style={{
              width: `${porcentaje}%`,
              backgroundColor: "#3b82f6",
              height: "10px",
              borderRadius: "8px"
            }}
          />
        </div>
      </div>

      {/* INFORMACIÓN DE EVALUACIÓN */}
      {solicitud.puntuacion_total !== undefined && (
        <div className="card mb-4 p-4">
          <h4>📊 Evaluación</h4>
          <div className="row">
            <div className="col-md-4">
              <strong>Puntuación:</strong> {solicitud.puntuacion_total}
            </div>
            <div className="col-md-4">
              <strong>Clasificación:</strong> {solicitud.clasificacion || "N/A"}
            </div>
            <div className="col-md-4">
              <strong>Recomendación:</strong> {solicitud.recomendacion || "N/A"}
            </div>
          </div>
          {solicitud.observaciones && (
            <div className="mt-3">
              <strong>Observaciones:</strong>
              <p>{solicitud.observaciones}</p>
            </div>
          )}
        </div>
      )}

      {/* SECCIONES */}
      <h3 className="mb-3">📝 Información Detallada</h3>
      {Object.entries(secciones).length > 0 ? (
        Object.entries(secciones).map(([nombre, datos]) => (
          <SeccionSolicitud
            key={nombre}
            seccion={{
              nombre,
              datos,
              esCompleto: datos && Object.keys(datos).length > 0
            }}
            isExpanded={seccionExpandida === nombre}
            onToggle={() => toggleSeccion(nombre)}
          />
        ))
      ) : (
        <Alert variant="info">No hay información detallada disponible.</Alert>
      )}
    </Container>
  );
};

export default ResumenSolicitud;
