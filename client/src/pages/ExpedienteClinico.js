import React, { useState, useEffect } from "react";
import { Button, Form, Card, Row, Col } from "react-bootstrap";
import Axios from "axios";
import Swal from "sweetalert2";
import HistorialVidaForm from "../components/HistorialVidaForm";
import SaludForm from "../components/SaludForm";
import VacunasForm from "../components/VacunasForm";
import DesparasitacionesForm from "../components/DesparasitacionesForm";
import ComportamientoForm from "../components/ComportamientoForm";
import "../App.css";

function ExpedienteClinico() {
  const [animales, setAnimales] = useState([]);
  const [idSeleccionado, setIdSeleccionado] = useState("");
  const [etapaActual, setEtapaActual] = useState("historial");

  useEffect(() => {
    obtenerAnimales();
  }, []);

  const obtenerAnimales = async () => {
    try {
      const res = await Axios.get("http://localhost:3001/animales");
      setAnimales(res.data);
    } catch (err) {
      console.log("Error al cargar animales:", err);
    }
  };

  const handleSeleccion = (e) => {
    setIdSeleccionado(e.target.value);
  };

  const renderContenido = () => {
    if (!idSeleccionado) {
      return (
        <p className="text-muted text-center mt-3">
          Selecciona un animal para ver su expediente clínico.
        </p>
      );
    }

    switch (etapaActual) {
      case "historial":
        return <HistorialVidaForm idAnimal={idSeleccionado} />;
      case "salud":
        return <SaludForm idAnimal={idSeleccionado} />;
      case "vacunas":
        return <VacunasForm idAnimal={idSeleccionado} />;
      case "desparasitaciones":
        return <DesparasitacionesForm idAnimal={idSeleccionado} />;
      case "comportamiento":
        return <ComportamientoForm idAnimal={idSeleccionado} />;
      default:
        return null;
    }
  };

  return (
    <div
      className="expediente-container"
      style={{
        background: "linear-gradient(to bottom right, #eef2ff, #e0e7ff)",
        minHeight: "100vh",
        padding: "2rem 1rem",
      }}
    >
      <Card
        className="shadow-lg mx-auto"
        style={{
          borderRadius: "1rem",
          maxWidth: "1100px",
          padding: "2rem",
        }}
      >
        <div className="text-center mb-4">
          <h2 style={{ color: "#4f46e5", fontWeight: "700" }}>
            🩺 Expediente Clínico Digital
          </h2>
          <p style={{ color: "#6b7280" }}>
            Revisa, registra y actualiza la información médica de cada animal.
          </p>
        </div>

        {/* Selección de animal */}
        <Form.Group as={Row} className="align-items-center mb-4">
          <Form.Label column sm={3} className="fw-semibold">
            Selecciona una mascota:
          </Form.Label>
          <Col sm={9}>
            <Form.Select
              value={idSeleccionado}
              onChange={handleSeleccion}
              style={{
                borderRadius: "0.5rem",
                border: "1px solid #d1d5db",
                boxShadow: "0 1px 4px rgba(0, 0, 0, 0.05)",
              }}
            >
              <option value="">-- Selecciona --</option>
              {animales.map((a) => (
                <option key={a.Id} value={a.Id}>
                  {a.nombre} ({a.especie})
                </option>
              ))}
            </Form.Select>
          </Col>
        </Form.Group>

        {/* Navegación por etapas */}
        <div
          className="d-flex flex-wrap justify-content-center gap-2 mb-4"
          style={{ borderBottom: "2px solid #e5e7eb", paddingBottom: "0.75rem" }}
        >
          <Button
            variant={etapaActual === "historial" ? "primary" : "outline-primary"}
            onClick={() => setEtapaActual("historial")}
          >
            🗂️ Historial de Vida
          </Button>
          <Button
            variant={etapaActual === "salud" ? "primary" : "outline-primary"}
            onClick={() => setEtapaActual("salud")}
          >
            💊 Salud General
          </Button>
          <Button
            variant={etapaActual === "vacunas" ? "primary" : "outline-primary"}
            onClick={() => setEtapaActual("vacunas")}
          >
            💉 Vacunas
          </Button>
          <Button
            variant={etapaActual === "desparasitaciones" ? "primary" : "outline-primary"}
            onClick={() => setEtapaActual("desparasitaciones")}
          >
            🧫 Desparasitaciones
          </Button>
          <Button
            variant={etapaActual === "comportamiento" ? "primary" : "outline-primary"}
            onClick={() => setEtapaActual("comportamiento")}
          >
            🐕 Comportamiento
          </Button>
        </div>

        {/* Contenido dinámico */}
        <div className="expediente-contenido">{renderContenido()}</div>
      </Card>
    </div>
  );
}

export default ExpedienteClinico;
