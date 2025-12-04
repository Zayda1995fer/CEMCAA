import React, { useEffect, useState, useCallback } from "react";
import { Form, Button, Row, Col, Table } from "react-bootstrap";
import Axios from "../config/axios";
import Swal from "sweetalert2";

function SaludForm({ idAnimal }) {
  const [salud, setSalud] = useState({
    estado_actual_salud: "",
    enfermedades_temporales: "",
    tratamientos_medicos: "",
    esterilizacion: false,
    fecha_esterilizacion: "",
    cirugias_anteriores: "",
  });

  const [modoEditar, setModoEditar] = useState(false);
  const [idEditando, setIdEditando] = useState(null);
  const [registros, setRegistros] = useState([]);

  // ✅ Obtener registros al montar
  const obtenerRegistros = useCallback(async () => {
    if (!idAnimal) return;
    try {
      const res = await Axios.get(`http://localhost:3001/salud/${idAnimal}`);
      if (Array.isArray(res.data)) {
        setRegistros(res.data);
      } else if (res.data.id_salud) {
        setRegistros([res.data]);
      } else {
        setRegistros([]);
      }
    } catch (err) {
      console.error("Error al obtener registros de salud:", err);
      setRegistros([]);
    }
  }, [idAnimal]);

  useEffect(() => {
    obtenerRegistros();
  }, [obtenerRegistros]);

  // ✅ Manejar cambios del formulario
  const handleChange = (e) => {
    setSalud({ ...salud, [e.target.name]: e.target.value });
  };

  const handleCheck = (e) => {
    setSalud({
      ...salud,
      esterilizacion: e.target.checked,
      fecha_esterilizacion: e.target.checked ? salud.fecha_esterilizacion : "",
    });
  };

  const limpiarFormulario = () => {
    setSalud({
      estado_actual_salud: "",
      enfermedades_temporales: "",
      tratamientos_medicos: "",
      esterilizacion: false,
      fecha_esterilizacion: "",
      cirugias_anteriores: "",
    });
    setModoEditar(false);
    setIdEditando(null);
  };

  // ✅ Guardar o actualizar registro
  const guardarRegistro = async () => {
    const datos = {
      ...salud,
      fecha_esterilizacion:
        salud.esterilizacion && salud.fecha_esterilizacion
          ? salud.fecha_esterilizacion
          : null,
    };

    try {
      if (modoEditar && idEditando) {
        await Axios.put(
          `http://localhost:3001/salud/update/${idEditando}`,
          datos
        );
        Swal.fire("Actualizado", "Registro actualizado correctamente", "success");
      } else {
        await Axios.post("http://localhost:3001/salud/create", {
          id_animal: idAnimal,
          ...datos,
        });
        Swal.fire("Registrado", "Nuevo registro de salud agregado correctamente", "success");
      }
      limpiarFormulario();
      obtenerRegistros();
    } catch (err) {
      console.error("Error al guardar:", err);
      Swal.fire("Error", "No se pudo guardar el registro de salud", "error");
    }
  };

  // ✅ Editar registro
  const editarRegistro = (reg) => {
    setSalud({
      estado_actual_salud: reg.estado_actual_salud || "",
      enfermedades_temporales: reg.enfermedades_temporales || "",
      tratamientos_medicos: reg.tratamientos_medicos || "",
      esterilizacion: !!reg.esterilizacion,
      fecha_esterilizacion: reg.fecha_esterilizacion
        ? reg.fecha_esterilizacion.split("T")[0]
        : "",
      cirugias_anteriores: reg.cirugias_anteriores || "",
    });
    setModoEditar(true);
    setIdEditando(reg.id_salud);
  };

  // ✅ Eliminar registro
  const eliminarRegistro = async (id_salud) => {
    Swal.fire({
      title: "¿Eliminar registro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await Axios.delete(`http://localhost:3001/salud/delete/${id_salud}`);
          Swal.fire("Eliminado", "Registro eliminado correctamente", "success");
          obtenerRegistros();
          if (id_salud === idEditando) limpiarFormulario();
        } catch (err) {
          console.error("Error al eliminar:", err);
          Swal.fire("Error", "No se pudo eliminar el registro", "error");
        }
      }
    });
  };

  return (
    <div className="expediente-section">
      <h5 style={{ color: "#4f46e5", fontWeight: "600" }}>🩺 Salud General</h5>

      {/* Formulario */}
      <Form className="mb-4 mt-3">
        <Row>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Estado actual de salud</Form.Label>
              <Form.Select
                name="estado_actual_salud"
                value={salud.estado_actual_salud}
                onChange={handleChange}
              >
                <option value="">Selecciona...</option>
                <option>Sano</option>
                <option>Enfermo</option>
                <option>En recuperación</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Check
                type="checkbox"
                label="Esterilizado"
                checked={salud.esterilizacion}
                onChange={handleCheck}
              />
              {salud.esterilizacion && (
                <Form.Control
                  type="date"
                  name="fecha_esterilizacion"
                  value={salud.fecha_esterilizacion}
                  onChange={handleChange}
                  className="mt-2"
                />
              )}
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mt-3">
          <Form.Label>Enfermedades temporales</Form.Label>
          <Form.Control
            as="textarea"
            name="enfermedades_temporales"
            value={salud.enfermedades_temporales}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Tratamientos médicos</Form.Label>
          <Form.Control
            as="textarea"
            name="tratamientos_medicos"
            value={salud.tratamientos_medicos}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Cirugías anteriores</Form.Label>
          <Form.Control
            as="textarea"
            name="cirugias_anteriores"
            value={salud.cirugias_anteriores}
            onChange={handleChange}
          />
        </Form.Group>

        <div className="d-flex justify-content-end mt-4 gap-2">
          {modoEditar && (
            <Button variant="secondary" onClick={limpiarFormulario}>
              Cancelar
            </Button>
          )}
          <Button variant="primary" onClick={guardarRegistro}>
            💾 {modoEditar ? "Actualizar" : "Agregar Registro"}
          </Button>
        </div>
      </Form>

      {/* Tabla de registros */}
      <h6 style={{ color: "#4f46e5", fontWeight: "600" }}>📋 Registros de Salud</h6>
      <Table striped bordered hover responsive className="shadow-sm mt-3">
        <thead className="table-light">
          <tr>
            <th>Estado</th>
            <th>Esterilizado</th>
            <th>Fecha Esterilización</th>
            <th>Enfermedades</th>
            <th>Tratamientos</th>
            <th>Cirugías</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {registros.length > 0 ? (
            registros.map((r) => (
              <tr key={r.id_salud}>
                <td>{r.estado_actual_salud || "-"}</td>
                <td>{r.esterilizacion ? "Sí" : "No"}</td>
                <td>
                  {r.fecha_esterilizacion
                    ? new Date(r.fecha_esterilizacion).toLocaleDateString("es-MX")
                    : "-"}
                </td>
                <td>{r.enfermedades_temporales || "-"}</td>
                <td>{r.tratamientos_medicos || "-"}</td>
                <td>{r.cirugias_anteriores || "-"}</td>
                <td className="text-center">
                  <Button
                    size="sm"
                    variant="warning"
                    className="me-2"
                    onClick={() => editarRegistro(r)}
                  >
                    ✏️
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => eliminarRegistro(r.id_salud)}
                  >
                    🗑️
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center text-muted">
                No hay registros de salud disponibles.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default SaludForm;
