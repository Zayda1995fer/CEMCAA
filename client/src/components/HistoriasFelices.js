import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "../styles/HistoriasFelises.css";

function HistoriasFelices() {
  const historias = [
    {
      nombre: "Luna",
      texto: "Luna fue rescatada de las calles y ahora disfruta de una familia que la ama.",
      img: "https://image.shutterstock.com/image-photo/beagle-dog-suitcase-things-260nw-2481066257.jpg",
    },
    {
      nombre: "Max",
      texto: "Max encontró su hogar ideal donde recibe cariño y cuidados diarios.",
      img: "https://image.shutterstock.com/image-photo/family-enjoying-quality-time-together-260nw-2585353217.jpg",
    },
    {
      nombre: "Kitty",
      texto: "Kitty, antes llamada Michi, ahora vive feliz y segura con su nueva familia.",
      img: "https://image.shutterstock.com/image-photo/daily-concept-japanese-bobtail-cat-260nw-2318160345.jpg",
    },
  ];

  return (
    <Container className="my-5 text-center historias-container">
      <h3 className="fw-bold text-warning mb-4">Historias que inspiran</h3>
      <Row className="g-4 mb-5">
        {historias.map((h, index) => (
          <Col md={4} key={index}>
            <Card className="h-100 shadow-sm historia-card">
              <Card.Img variant="top" src={h.img} alt={h.nombre} />
              <Card.Body>
                <Card.Title>{h.nombre}</Card.Title>
                <Card.Text>{h.texto}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default HistoriasFelices;
