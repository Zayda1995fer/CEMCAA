// src/pages/Catalogo.js
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Image,
  Modal,
} from "react-bootstrap";
import Axios from "axios";
import Swal from "sweetalert2";

function Catalogo() {
  const imagenPredeterminada =
    "https://www.shutterstock.com/es/image-vector/image-coming-soon-no-picture-video-2450891047";

  const [mascotas, setMascotas] = useState([]);
  const [nombre, setNombre] = useState("");
  const [especie, setEspecie] = useState("Perro");
  const [raza, setRaza] = useState("");
  const [sexo, setSexo] = useState("Macho");
  const [edadAprox, setEdadAprox] = useState("");
  const [tamaño, setTamaño] = useState("Mediano");
  const [marcas, setMarcas] = useState("");
  const [rasgos, setRasgos] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagenPreview, setImagenPreview] = useState(null);
  const [imagenFile, setImagenFile] = useState(null);
  const [editar, setEditar] = useState(false);
  const [idEditar, setIdEditar] = useState(null);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState(null);

  useEffect(() => {
    getMascotas();
  }, []);

  const getMascotas = async () => {
    try {
      const res = await Axios.get("http://localhost:3001/animales");
      setMascotas(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const limpiarCampos = () => {
    setNombre("");
    setEspecie("Perro");
    setRaza("");
    setSexo("Macho");
    setEdadAprox("");
    setTamaño("Mediano");
    setMarcas("");
    setRasgos("");
    setDescripcion("");
    setImagenPreview(null);
    setImagenFile(null);
    setEditar(false);
    setIdEditar(null);
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagenFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const agregarMascota = async () => {
    if (!nombre || !especie || !edadAprox) {
      Swal.fire({
        icon: "warning",
        title: "Campos obligatorios",
        text: "Por favor completa nombre, especie y edad aproximada.",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("nombre", nombre);
      formData.append("especie", especie);
      formData.append("raza", raza);
      formData.append("sexo", sexo);
      formData.append("edadAprox", edadAprox);
      formData.append("tamaño", tamaño);
      formData.append("marcas", marcas);
      formData.append("rasgos", rasgos);
      formData.append("descripcion", descripcion);
      if (imagenFile) formData.append("imagenMain", imagenFile);

      await Axios.post("http://localhost:3001/animales/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        icon: "success",
        title: "¡Mascota agregada!",
        text: `${nombre} fue registrada correctamente.`,
      });
      limpiarCampos();
      getMascotas();
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo agregar la mascota.",
      });
    }
  };

  const editarMascota = (animal) => {
    setEditar(true);
    setIdEditar(animal.Id);
    setNombre(animal.nombre);
    setEspecie(animal.especie);
    setRaza(animal.raza);
    setSexo(animal.sexo);
    setEdadAprox(animal.edadAprox);
    setTamaño(animal.tamaño);
    setMarcas(animal.marcas);
    setRasgos(animal.rasgos);
    setDescripcion(animal.descripcion);
    setImagenPreview(animal.imagenMain);
  };

  const actualizarMascota = async () => {
    if (!nombre || !especie || !edadAprox) {
      Swal.fire({
        icon: "warning",
        title: "Campos obligatorios",
        text: "Por favor completa nombre, especie y edad aproximada.",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("Id", idEditar);
      formData.append("nombre", nombre);
      formData.append("especie", especie);
      formData.append("raza", raza);
      formData.append("sexo", sexo);
      formData.append("edadAprox", edadAprox);
      formData.append("tamaño", tamaño);
      formData.append("marcas", marcas);
      formData.append("rasgos", rasgos);
      formData.append("descripcion", descripcion);
      if (imagenFile) formData.append("imagenMain", imagenFile);

      await Axios.put("http://localhost:3001/animales/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        icon: "success",
        title: "¡Mascota actualizada!",
        text: `${nombre} fue actualizada correctamente.`,
      });
      limpiarCampos();
      getMascotas();
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar la mascota.",
      });
    }
  };

  const eliminarMascota = (Id, nombre) => {
    Swal.fire({
      title: `¿Eliminar a ${nombre}?`,
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
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
          console.log(err);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo eliminar la mascota.",
          });
        }
      }
    });
  };

  return (
  <Container className="my-5">
    {/* Formulario */}
    <Card
      className="mb-5 shadow-sm p-4"
      style={{
        backgroundColor: "#FAF9F6",
        maxWidth: "700px",
        margin: "0 auto",
        borderRadius: "12px",
      }}
    >
      <h3 className="mb-4 text-center" style={{ color: "#E07A5F" }}>
        {editar ? "Editar mascota" : "Agregar nueva mascota"}
      </h3>
      <Form>
        {/* --- Mantener todos los inputs del formulario --- */}
        <Row className="mb-3">
          <Col xs={12} md={6}>
            <Form.Group controlId="nombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                size="sm"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre del animal"
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={6}>
            <Form.Group controlId="especie">
              <Form.Label>Especie</Form.Label>
              <Form.Select
                size="sm"
                value={especie}
                onChange={(e) => setEspecie(e.target.value)}
              >
                <option>Perro</option>
                <option>Gato</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col xs={12} md={6}>
            <Form.Group controlId="raza">
              <Form.Label>Raza</Form.Label>
              <Form.Control
                size="sm"
                type="text"
                value={raza}
                onChange={(e) => setRaza(e.target.value)}
                placeholder="Raza o mestizo"
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={6}>
            <Form.Group controlId="sexo">
              <Form.Label>Sexo</Form.Label>
              <Form.Select
                size="sm"
                value={sexo}
                onChange={(e) => setSexo(e.target.value)}
              >
                <option>Macho</option>
                <option>Hembra</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col xs={12} md={4}>
            <Form.Group controlId="edadAprox">
              <Form.Label>Edad aproximada</Form.Label>
              <Form.Control
                size="sm"
                type="text"
                value={edadAprox}
                onChange={(e) => setEdadAprox(e.target.value)}
                placeholder="Ej: 2 años"
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={4}>
            <Form.Group controlId="tamaño">
              <Form.Label>Tamaño</Form.Label>
              <Form.Select
                size="sm"
                value={tamaño}
                onChange={(e) => setTamaño(e.target.value)}
              >
                <option>Pequeño</option>
                <option>Mediano</option>
                <option>Grande</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col xs={12} md={4}>
            <Form.Group controlId="marcas">
              <Form.Label>Color / Marcas</Form.Label>
              <Form.Control
                size="sm"
                type="text"
                value={marcas}
                onChange={(e) => setMarcas(e.target.value)}
                placeholder="Pelaje, ojos, manchas"
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3" controlId="rasgos">
          <Form.Label>Rasgos especiales</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            size="sm"
            value={rasgos}
            onChange={(e) => setRasgos(e.target.value)}
            placeholder="Discapacidad, enfermedad, amputaciones..."
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="descripcion">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            size="sm"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Descripción de la mascota"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="imagenMain">
          <Form.Label>Subir imagen</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleImagenChange}
          />
        </Form.Group>

        <div className="text-center mb-3">
          <Image
            src={imagenPreview || imagenPredeterminada}
            alt="Preview"
            thumbnail
            style={{ height: "200px", objectFit: "cover" }}
          />
        </div>

        <div className="text-center">
          {editar ? (
            <Button
              variant="success"
              size="lg"
              className="mb-2 w-100"
              onClick={actualizarMascota}
            >
              Actualizar mascota
            </Button>
          ) : (
            <Button
              variant="success"
              size="lg"
              className="mb-2 w-100"
              onClick={agregarMascota}
            >
              Agregar mascota
            </Button>
          )}
          <Button
            variant="secondary"
            size="lg"
            className="w-100"
            onClick={limpiarCampos}
          >
            Limpiar
          </Button>
        </div>
      </Form>
    </Card>

    {/* Catálogo */}
<Card
  className="mb-5 shadow-sm p-4"
  style={{ backgroundColor: "#FAF9F6", borderRadius: "12px" }}
>
  <h3 className="mb-4 text-center" style={{ color: "#81B29A" }}>
    Mascotas disponibles
  </h3>

  <Row className="g-4">
    {mascotas.map((m) => (
      <Col md={4} sm={6} xs={12} key={m.Id} className="fade-in">
        <Card
          className="h-100 shadow-sm card-hover"
          style={{
            borderRadius: "12px",
            border: `3px solid ${m.especie === "Perro" ? "#6CACE4" : "#E07A5F"}`,
          }}
        >
          <div style={{ position: "relative", height: "250px", overflow: "hidden" }}>
            <Card.Img
              src={m.imagenMain || imagenPredeterminada}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              alt={m.nombre}
            />
            <div className="overlay">{m.especie} - {m.edadAprox} - {m.tamaño}</div>
          </div>

          <Card.Body>
            <Card.Title>{m.nombre}</Card.Title>

            <div className="d-flex gap-2 w-100 justify-content-between mt-2">
              <Button
                size="sm"
                style={{ backgroundColor: "#3CB371", color: "white" }}
                onClick={() => {
                  setMascotaSeleccionada(m); // <- selecciona la mascota
                  setModalAbierto(true);     // <- abre el modal
                }}
              >
                <i className="bi bi-eye-fill me-1"></i> Ver más
              </Button>

              <Button
                size="sm"
                style={{ backgroundColor: "#F4D35E", color: "#333" }}
                onClick={() => editarMascota(m)}
              >
                <i className="bi bi-pencil-fill me-1"></i> Editar
              </Button>

              <Button
                size="sm"
                style={{ backgroundColor: "#EF476F", color: "white" }}
                onClick={() => eliminarMascota(m.Id, m.nombre)}
              >
                <i className="bi bi-trash3-fill me-1"></i> Eliminar
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Col>
    ))}
  </Row>
</Card>

{/* Modal */}
{mascotaSeleccionada && (
  <Modal
    show={modalAbierto}               // <- controla visibilidad
    onHide={() => setModalAbierto(false)}
    size="lg"
    centered
  >
    <Modal.Header closeButton>
      <Modal.Title>{mascotaSeleccionada.nombre}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Image
        src={mascotaSeleccionada.imagenMain || imagenPredeterminada}
        alt={mascotaSeleccionada.nombre}
        fluid
        style={{ borderRadius: "12px", marginBottom: "15px" }}
      />
      <p>
        <strong>Edad:</strong> {mascotaSeleccionada.edadAprox} <br />
        <strong>Especie:</strong> {mascotaSeleccionada.especie} <br />
        <strong>Raza:</strong> {mascotaSeleccionada.raza} <br />
        <strong>Sexo:</strong> {mascotaSeleccionada.sexo} <br />
        <strong>Tamaño:</strong> {mascotaSeleccionada.tamaño} <br />
        {mascotaSeleccionada.marcas && (
          <>
            <strong>Color / Marcas:</strong> {mascotaSeleccionada.marcas} <br />
          </>
        )}
        {mascotaSeleccionada.rasgos && (
          <>
            <strong>Rasgos especiales:</strong> {mascotaSeleccionada.rasgos} <br />
          </>
        )}
        {mascotaSeleccionada.descripcion && (
          <>
            <strong>Descripción:</strong> {mascotaSeleccionada.descripcion}
          </>
        )}
      </p>
    </Modal.Body>
    <Modal.Footer className="d-flex justify-content-end">
      <Button variant="success" disabled>
        Adoptar
      </Button>
    </Modal.Footer>
  </Modal>
)}

  </Container>
);

}
export default Catalogo;
