import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Image, Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import {
  getMascotasService,
  createMascotaService,
  updateMascotaService,
  deleteMascotaService,
} from "../service/CatalogoService";
//import "../styles/Catalogo.css";

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
    obtenerMascotas();
  }, []);

  const obtenerMascotas = async () => {
    try {
      const data = await getMascotasService();
      setMascotas(data);
    } catch (err) {
      console.error(err);
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
      reader.onloadend = () => setImagenPreview(reader.result);
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

      await createMascotaService(formData);
      Swal.fire("¡Mascota agregada!", `${nombre} fue registrada correctamente.`, "success");
      limpiarCampos();
      obtenerMascotas();
    } catch {
      Swal.fire("Error", "No se pudo agregar la mascota.", "error");
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

      await updateMascotaService(formData);
      Swal.fire("¡Actualizado!", `${nombre} fue actualizada correctamente.`, "success");
      limpiarCampos();
      obtenerMascotas();
    } catch {
      Swal.fire("Error", "No se pudo actualizar la mascota.", "error");
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteMascotaService(Id);
          Swal.fire("Eliminado", `${nombre} fue eliminado correctamente.`, "success");
          obtenerMascotas();
        } catch {
          Swal.fire("Error", "No se pudo eliminar la mascota.", "error");
        }
      }
    });
  };

  return (
    <Container className="catalogo-container">
      {/* Formulario */}
      <Card className="formulario-card">
        <h3 className="titulo-formulario">
          {editar ? "Editar mascota" : "Agregar nueva mascota"}
        </h3>
        <Form>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="nombre">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Nombre del animal"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="especie">
                <Form.Label>Especie</Form.Label>
                <Form.Select value={especie} onChange={(e) => setEspecie(e.target.value)}>
                  <option>Perro</option>
                  <option>Gato</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="imagenMain">
            <Form.Label>Subir imagen</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleImagenChange} />
          </Form.Group>

          <div className="text-center mb-3">
            <Image
              src={imagenPreview || imagenPredeterminada}
              alt="Preview"
              className="imagen-preview"
              thumbnail
            />
          </div>

          <div className="botones-formulario">
            {editar ? (
              <Button variant="success" onClick={actualizarMascota}>
                Actualizar mascota
              </Button>
            ) : (
              <Button variant="success" onClick={agregarMascota}>
                Agregar mascota
              </Button>
            )}
            <Button variant="secondary" onClick={limpiarCampos}>
              Limpiar
            </Button>
          </div>
        </Form>
      </Card>

      {/* Catálogo */}
      <Card className="catalogo-card">
        <h3 className="titulo-catalogo">Mascotas disponibles</h3>
        <Row className="g-4">
          {mascotas.map((m) => (
            <Col md={4} key={m.Id}>
              <Card className="card-mascota">
                <Card.Img src={m.imagenMain || imagenPredeterminada} alt={m.nombre} />
                <Card.Body>
                  <Card.Title>{m.nombre}</Card.Title>
                  <div className="botones-acciones">
                    <Button onClick={() => { setMascotaSeleccionada(m); setModalAbierto(true); }}>
                      Ver más
                    </Button>
                    <Button onClick={() => editarMascota(m)}>Editar</Button>
                    <Button variant="danger" onClick={() => eliminarMascota(m.Id, m.nombre)}>
                      Eliminar
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
        <Modal show={modalAbierto} onHide={() => setModalAbierto(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{mascotaSeleccionada.nombre}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Image
              src={mascotaSeleccionada.imagenMain || imagenPredeterminada}
              alt={mascotaSeleccionada.nombre}
              className="imagen-modal"
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" disabled>Adoptar</Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
}

export default Catalogo;
