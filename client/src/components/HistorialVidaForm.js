import React, { useEffect, useState, useCallback } from "react";
import { Form, Button } from "react-bootstrap";
import Axios from "axios";
import Swal from "sweetalert2";

function HistorialVidaForm({ idAnimal }) {
  const [historial, setHistorial] = useState({
    origen: "",
    cantidad_duenos_previos: "",
    situacion_previa: "",
    ultimo_dueno_nombre_completo: "",
    ultimo_dueno_telefono: "",
  });
  const [modoEditar, setModoEditar] = useState(false);

  // ✅ Función estable con useCallback para evitar advertencias de dependencias
  const obtenerHistorial = useCallback(async () => {
    try {
      const res = await Axios.get(`http://localhost:3001/historial/${idAnimal}`);
      if (res.data) {
        setHistorial({
          origen: res.data.origen || "",
          cantidad_duenos_previos: res.data.cantidad_duenos_previos || "",
          situacion_previa: res.data.situacion_previa || "",
          ultimo_dueno_nombre_completo: res.data.ultimo_dueno_nombre_completo || "",
          ultimo_dueno_telefono: res.data.ultimo_dueno_telefono || "",
        });
        setModoEditar(true);
      }
    } catch (err) {
      console.log("No se encontró historial para este animal, se creará uno nuevo.");
    }
  }, [idAnimal]); // 👈 dependencia segura

  // ✅ useEffect limpio, sin advertencias
  useEffect(() => {
    if (idAnimal) obtenerHistorial();
  }, [idAnimal, obtenerHistorial]);

  const handleChange = (e) => {
    setHistorial({ ...historial, [e.target.name]: e.target.value });
  };

  const guardarHistorial = async () => {
    try {
      if (modoEditar) {
        await Axios.put(`http://localhost:3001/historial/update/${idAnimal}`, historial);
        Swal.fire("Actualizado", "Historial actualizado correctamente", "success");
      } else {
        await Axios.post(`http://localhost:3001/historial/create`, {
          id_animal: idAnimal,
          ...historial,
        });
        Swal.fire("Registrado", "Historial guardado correctamente", "success");
        setModoEditar(true);
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo guardar el historial", "error");
    }
  };

  return (
    <div className="expediente-section">
      <h5 className="mb-3" style={{ color: "#4f46e5", fontWeight: "600" }}>
        📜 Historial de Vida
      </h5>

      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Origen</Form.Label>
          <Form.Select
            name="origen"
            value={historial.origen}
            onChange={handleChange}
          >
            <option value="">Selecciona...</option>
            <option>Callejero</option>
            <option>Donado</option>
            <option>Rescatado</option>
            <option>Perdido</option>
            <option>Otro</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Cantidad de dueños previos</Form.Label>
          <Form.Control
            type="number"
            name="cantidad_duenos_previos"
            value={historial.cantidad_duenos_previos}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Situación previa</Form.Label>
          <Form.Control
            as="textarea"
            name="situacion_previa"
            rows={3}
            value={historial.situacion_previa}
            onChange={handleChange}
            placeholder="Ej: vivía en la calle, fue rescatado de maltrato..."
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Último dueño (nombre completo)</Form.Label>
          <Form.Control
            type="text"
            name="ultimo_dueno_nombre_completo"
            value={historial.ultimo_dueno_nombre_completo}
            onChange={handleChange}
            placeholder="Ej: Juan Pérez"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Teléfono del último dueño</Form.Label>
          <Form.Control
            type="text"
            name="ultimo_dueno_telefono"
            value={historial.ultimo_dueno_telefono}
            onChange={handleChange}
            placeholder="Ej: 555-123-4567"
          />
        </Form.Group>

        <div className="d-flex justify-content-end mt-3">
          <Button variant="primary" onClick={guardarHistorial}>
            💾 {modoEditar ? "Actualizar" : "Guardar"}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default HistorialVidaForm;
