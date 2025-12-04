import React, { useEffect, useState, useCallback } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import Axios from "../config/axios";
import Swal from "sweetalert2";

function ComportamientoForm({ idAnimal }) {
  const [comportamiento, setComportamiento] = useState({
    caracter_general: "",
    compatibilidad_ninos: false,
    compatibilidad_perros: false,
    compatibilidad_gatos: false,
    nivel_energia: "",
    entrenamiento: "",
  });

  const [modoEditar, setModoEditar] = useState(false);

  // ✅ useCallback evita recrear la función en cada render
  const obtenerComportamiento = useCallback(async () => {
    try {
      const res = await Axios.get(
        `http://localhost:3001/comportamiento/${idAnimal}`
      );
      if (res.data) {
        setComportamiento({
          caracter_general: res.data.caracter_general || "",
          compatibilidad_ninos: !!res.data.compatibilidad_ninos,
          compatibilidad_perros: !!res.data.compatibilidad_perros,
          compatibilidad_gatos: !!res.data.compatibilidad_gatos,
          nivel_energia: res.data.nivel_energia || "",
          entrenamiento: res.data.entrenamiento || "",
        });
        setModoEditar(true);
      }
    } catch (err) {
      console.log("Sin registro de comportamiento previo.");
    }
  }, [idAnimal]); // 👈 dependencias necesarias

  // ✅ ahora sin advertencia de dependencias faltantes
  useEffect(() => {
    if (idAnimal) obtenerComportamiento();
  }, [idAnimal, obtenerComportamiento]);

  const handleChange = (e) => {
    setComportamiento({ ...comportamiento, [e.target.name]: e.target.value });
  };

  const handleCheck = (e) => {
    setComportamiento({
      ...comportamiento,
      [e.target.name]: e.target.checked,
    });
  };

  const guardarComportamiento = async () => {
    try {
      if (modoEditar) {
        await Axios.put(
          `http://localhost:3001/comportamiento/update/${idAnimal}`,
          comportamiento
        );
        Swal.fire(
          "Actualizado",
          "Comportamiento actualizado correctamente",
          "success"
        );
      } else {
        await Axios.post("http://localhost:3001/comportamiento/create", {
          id_animal: idAnimal,
          ...comportamiento,
        });
        Swal.fire("Registrado", "Comportamiento guardado correctamente", "success");
        setModoEditar(true);
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo guardar el comportamiento.", "error");
    }
  };

  return (
    <div className="expediente-section">
      <h5 className="mb-3" style={{ color: "#4f46e5", fontWeight: "600" }}>
        🐕 Comportamiento y Conducta
      </h5>

      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Carácter general</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            name="caracter_general"
            value={comportamiento.caracter_general}
            onChange={handleChange}
            placeholder="Ej: dócil, tímido, juguetón, territorial..."
          />
        </Form.Group>

        <Row>
          <Col md={4}>
            <Form.Check
              type="checkbox"
              label="Compatible con niños"
              name="compatibilidad_ninos"
              checked={comportamiento.compatibilidad_ninos}
              onChange={handleCheck}
            />
          </Col>
          <Col md={4}>
            <Form.Check
              type="checkbox"
              label="Compatible con perros"
              name="compatibilidad_perros"
              checked={comportamiento.compatibilidad_perros}
              onChange={handleCheck}
            />
          </Col>
          <Col md={4}>
            <Form.Check
              type="checkbox"
              label="Compatible con gatos"
              name="compatibilidad_gatos"
              checked={comportamiento.compatibilidad_gatos}
              onChange={handleCheck}
            />
          </Col>
        </Row>

        <Row className="mt-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Nivel de energía</Form.Label>
              <Form.Select
                name="nivel_energia"
                value={comportamiento.nivel_energia}
                onChange={handleChange}
              >
                <option value="">Selecciona...</option>
                <option>Alto</option>
                <option>Medio</option>
                <option>Bajo</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mt-3">
          <Form.Label>Entrenamiento y observaciones</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="entrenamiento"
            value={comportamiento.entrenamiento}
            onChange={handleChange}
            placeholder="Ej: sabe sentarse, camina con correa, usa arenero..."
          />
        </Form.Group>

        <div className="d-flex justify-content-end mt-4">
          <Button variant="primary" onClick={guardarComportamiento}>
            💾 {modoEditar ? "Actualizar" : "Guardar"}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default ComportamientoForm;
