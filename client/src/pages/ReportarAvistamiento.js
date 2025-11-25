import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Axios from "axios";
import { Container, Form, Button } from "react-bootstrap";
import "../App.css";

function ReportarAvistamiento() {
  const { id } = useParams(); // id de la mascota perdida
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const [nombreContacto, setNombreContacto] = useState("");
  const [telefonoContacto, setTelefonoContacto] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [seLoLlevo, setSeLoLlevo] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // API base
  const api = Axios.create({ baseURL: "http://localhost:3001/avistamientos" });

  useEffect(() => {
    obtenerUsuarioActual();
  }, []);

  const obtenerUsuarioActual = async () => {
    try {
      const res = await Axios.get("http://localhost:3001/usuario-actual", { withCredentials: true });
      setUsuario(res.data);
      setNombreContacto(res.data.nombre || "");
      setTelefonoContacto(res.data.telefono || "");
    } catch (err) {
      console.log("Error al obtener usuario:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombreContacto || !telefonoContacto || !ubicacion) {
      setMensaje("Por favor completa todos los campos obligatorios.");
      return;
    }

    try {
      await api.post("/create", {
        mascota_id: Number(id), // convertir a número
        usuario_id: usuario?.id || null, // enviar null si no hay usuario
        nombre_contacto: nombreContacto,
        telefono_contacto: telefonoContacto,
        ubicacion_avistamiento: ubicacion,
        descripcion,
        se_lo_llevo: seLoLlevo ? 1 : 0, // convertir a tinyint
      });

      setMensaje("Reporte enviado con éxito.");
      setTimeout(() => navigate("/catalogo"), 1500);
    } catch (err) {
      console.log("Error al registrar avistamiento:", err);
      setMensaje("Ocurrió un error al enviar el reporte.");
    }
  };

  return (
    <Container className="my-5" style={{ maxWidth: "600px" }}>
      <h2 className="mb-4">Reportar Avistamiento</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nombre de contacto</Form.Label>
          <Form.Control
            type="text"
            value={nombreContacto}
            onChange={(e) => setNombreContacto(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Teléfono de contacto</Form.Label>
          <Form.Control
            type="text"
            value={telefonoContacto}
            onChange={(e) => setTelefonoContacto(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Ubicación del avistamiento</Form.Label>
          <Form.Control
            type="text"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Descripción adicional</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="La mascota fue llevada por alguien"
            checked={seLoLlevo}
            onChange={(e) => setSeLoLlevo(e.target.checked)}
          />
        </Form.Group>

        <Button type="submit" className="btn btn-primary">
          Enviar Reporte
        </Button>
      </Form>

      {mensaje && (
        <p
          className={`mt-3 ${
            mensaje.includes("éxito") ? "text-success" : "text-danger"
          }`}
        >
          {mensaje}
        </p>
      )}
    </Container>
  );
}

export default ReportarAvistamiento;
