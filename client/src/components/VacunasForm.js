import React, { useState, useEffect, useCallback } from "react";
import { Form, Button, Table, Card } from "react-bootstrap";
import Axios from "axios";
import Swal from "sweetalert2";

function VacunasForm({ idAnimal }) {
  const [vacunas, setVacunas] = useState([]);
  const [idSalud, setIdSalud] = useState(null);
  const [fechaVacuna, setFechaVacuna] = useState("");
  const [tipoVacuna, setTipoVacuna] = useState("");
  const [observaciones, setObservaciones] = useState("");

  // ✅ Primero definimos obtenerVacunas
  const obtenerVacunas = useCallback(async (idSalud) => {
    try {
      const res = await Axios.get(`http://localhost:3001/vacunas/${idSalud}`);
      setVacunas(res.data || []);
    } catch (err) {
      console.error("Error al obtener vacunas:", err);
      setVacunas([]);
    }
  }, []);

  // ✅ Luego definimos obtenerIdSalud (ahora puede usar obtenerVacunas)
  const obtenerIdSalud = useCallback(async (id) => {
    try {
      const res = await Axios.get(`http://localhost:3001/salud/por-animal/${id}`);

      if (res.data && res.data.ultimo && res.data.ultimo.id_salud) {
        const ultimo = res.data.ultimo;
        setIdSalud(ultimo.id_salud);
        obtenerVacunas(ultimo.id_salud);
      } else {
        setIdSalud(null);
        setVacunas([]);
        Swal.fire({
          icon: "info",
          title: "Sin registro de salud",
          text: "Primero debes registrar la salud del animal antes de agregar vacunas.",
        });
      }
    } catch (err) {
      console.error("Error al obtener ID de salud:", err);
      setIdSalud(null);
    }
  }, [obtenerVacunas]);

  // ✅ useEffect sin advertencias ni errores
  useEffect(() => {
    if (idAnimal) {
      obtenerIdSalud(idAnimal);
    }
  }, [idAnimal, obtenerIdSalud]);

  // ✅ Registrar nueva vacuna
  const registrarVacuna = async () => {
    if (!fechaVacuna || !tipoVacuna) {
      Swal.fire({
        icon: "warning",
        title: "Campos obligatorios",
        text: "Por favor completa la fecha y el tipo de vacuna.",
      });
      return;
    }

    if (!idSalud) {
      Swal.fire({
        icon: "info",
        title: "Falta registro de salud",
        text: "Debes tener un registro de salud antes de añadir vacunas.",
      });
      return;
    }

    try {
      await Axios.post("http://localhost:3001/vacunas/create", {
        id_salud: idSalud,
        fecha_vacuna: fechaVacuna,
        tipo_vacuna: tipoVacuna,
        observaciones: observaciones || null,
      });

      Swal.fire({
        icon: "success",
        title: "Vacuna registrada",
        text: "Se ha agregado correctamente al historial médico.",
      });

      // Refrescar lista
      obtenerVacunas(idSalud);
      setFechaVacuna("");
      setTipoVacuna("");
      setObservaciones("");
    } catch (err) {
      console.error("Error al registrar vacuna:", err);
      Swal.fire({
        icon: "error",
        title: "Error al guardar",
        text: "Ocurrió un problema al registrar la vacuna.",
      });
    }
  };

  // ✅ Eliminar vacuna
  const eliminarVacuna = async (idVacuna) => {
    Swal.fire({
      title: "¿Eliminar vacuna?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await Axios.delete(`http://localhost:3001/vacunas/delete/${idVacuna}`);
          Swal.fire("Eliminada", "La vacuna fue eliminada correctamente.", "success");
          obtenerVacunas(idSalud);
        } catch (err) {
          console.error("Error al eliminar vacuna:", err);
          Swal.fire("Error", "No se pudo eliminar la vacuna.", "error");
        }
      }
    });
  };

  return (
    <div className="vacunas-form">
      <Card
        className="shadow-sm"
        style={{
          borderRadius: "0.75rem",
          padding: "1.5rem",
          backgroundColor: "#fff",
        }}
      >
        <h5
          className="mb-3"
          style={{
            color: "#4f46e5",
            fontWeight: "700",
            borderBottom: "2px solid #e0e7ff",
            paddingBottom: "0.5rem",
          }}
        >
          💉 Registro de Vacunas
        </h5>

        {/* Formulario de ingreso */}
        <Form className="mb-4">
          <Form.Group className="mb-3">
            <Form.Label>Fecha de Vacunación</Form.Label>
            <Form.Control
              type="date"
              value={fechaVacuna}
              onChange={(e) => setFechaVacuna(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tipo de Vacuna</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej: Antirrábica, Parvovirus, etc."
              value={tipoVacuna}
              onChange={(e) => setTipoVacuna(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Observaciones</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Notas adicionales..."
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
            />
          </Form.Group>

          <Button
            variant="primary"
            className="w-100"
            onClick={registrarVacuna}
          >
            💾 Agregar Vacuna
          </Button>
        </Form>

        {/* Tabla de vacunas registradas */}
        <h6 style={{ color: "#4f46e5", fontWeight: "600" }}>📋 Vacunas registradas</h6>
        <Table striped bordered hover responsive className="mt-3 shadow-sm">
          <thead className="table-light">
            <tr>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Observaciones</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {vacunas.length > 0 ? (
              vacunas.map((v) => (
                <tr key={v.id_vacuna}>
                  <td>{new Date(v.fecha_vacuna).toLocaleDateString("es-MX")}</td>
                  <td>{v.tipo_vacuna}</td>
                  <td>{v.observaciones || "-"}</td>
                  <td className="text-center">
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => eliminarVacuna(v.id_vacuna)}
                    >
                      🗑️
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  No hay vacunas registradas todavía.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}

export default VacunasForm;
