import React, { useEffect, useState, useCallback } from "react";
import { Form, Button, Row, Col, Table } from "react-bootstrap";
import Axios from "../config/axios";
import Swal from "sweetalert2";

function HistorialVidaForm({ idAnimal }) {
  const [historiales, setHistoriales] = useState([]);
  const [nuevoHistorial, setNuevoHistorial] = useState({
    fecha_evento: "",
    descripcion: "",
  });

  const [modoEditar, setModoEditar] = useState(false);
  const [idEditando, setIdEditando] = useState(null);

  // ✅ useCallback estabiliza la función
  const obtenerHistorial = useCallback(async () => {
    try {
      const res = await Axios.get(
        `http://localhost:3001/historial/${idAnimal}`
      );
      setHistoriales(res.data || []);
    } catch (err) {
      console.error("Error al obtener el historial de vida:", err);
    }
  }, [idAnimal]);

  // ✅ useEffect sin advertencias
  useEffect(() => {
    if (idAnimal) obtenerHistorial();
  }, [idAnimal, obtenerHistorial]);

  const handleChange = (e) => {
    setNuevoHistorial({
      ...nuevoHistorial,
      [e.target.name]: e.target.value,
    });
  };

  const guardarHistorial = async () => {
    if (!nuevoHistorial.fecha_evento || !nuevoHistorial.descripcion) {
      Swal.fire("Campos incompletos", "Completa todos los campos.", "warning");
      return;
    }

    try {
      if (modoEditar && idEditando) {
        await Axios.put(
          `http://localhost:3001/historial/update/${idEditando}`,
          nuevoHistorial
        );
        Swal.fire("Actualizado", "Evento actualizado correctamente", "success");
      } else {
        await Axios.post("http://localhost:3001/historial/create", {
          id_animal: idAnimal,
          ...nuevoHistorial,
        });
        Swal.fire("Agregado", "Evento agregado correctamente", "success");
      }

      setNuevoHistorial({ fecha_evento: "", descripcion: "" });
      setModoEditar(false);
      setIdEditando(null);
      obtenerHistorial();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo guardar el evento.", "error");
    }
  };

  const editarHistorial = (evento) => {
    setNuevoHistorial({
      fecha_evento: evento.fecha_evento.split("T")[0],
      descripcion: evento.descripcion,
    });
    setModoEditar(true);
    setIdEditando(evento.id_historial);
  };

  const eliminarHistorial = async (id) => {
    Swal.fire({
      title: "¿Eliminar evento?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await Axios.delete(`http://localhost:3001/historial/delete/${id}`);
          Swal.fire("Eliminado", "Evento eliminado correctamente", "success");
          obtenerHistorial();
        } catch (err) {
          console.error(err);
          Swal.fire("Error", "No se pudo eliminar el evento.", "error");
        }
      }
    });
  };

  return (
    <div className="expediente-section">
      <h5 className="mb-3" style={{ color: "#4f46e5", fontWeight: "600" }}>
        📜 Historial de Vida
      </h5>

      {/* Formulario */}
      <Form className="mb-4">
        <Row className="g-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Fecha del evento</Form.Label>
              <Form.Control
                type="date"
                name="fecha_evento"
                value={nuevoHistorial.fecha_evento}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                name="descripcion"
                placeholder="Ej: adopción, rescate, cirugía..."
                value={nuevoHistorial.descripcion}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={2} className="d-flex align-items-end">
            <Button
              variant="primary"
              className="w-100"
              onClick={guardarHistorial}
            >
              {modoEditar ? "Actualizar" : "Agregar"}
            </Button>
          </Col>
        </Row>
      </Form>

      {/* Tabla de eventos */}
      <Table striped bordered hover responsive className="shadow-sm">
        <thead className="table-light">
          <tr>
            <th>Fecha</th>
            <th>Descripción</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {historiales.length > 0 ? (
            historiales.map((h) => (
              <tr key={h.id_historial}>
                <td>
                  {new Date(h.fecha_evento).toLocaleDateString("es-MX")}
                </td>
                <td>{h.descripcion}</td>
                <td className="text-center">
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => editarHistorial(h)}
                    className="me-2"
                  >
                    ✏️
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => eliminarHistorial(h.id_historial)}
                  >
                    🗑️
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center text-muted">
                No hay eventos registrados en el historial.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default HistorialVidaForm;
