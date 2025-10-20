// src/pages/Home.js
import React from "react";
import { Container, Card, Row, Col } from "react-bootstrap";

function Home() {
  return (
    <div style={{ backgroundColor: "#FAF9F6" }}>
      {/* Banner principal fijo */}
      <div
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1601758123927-3b7b4d2b27d3?auto=format&fit=crop&w=1350&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "450px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "white",
          position: "relative",
          filter: "brightness(90%)",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.45)",
            padding: "40px",
            borderRadius: "10px",
          }}
        >
          <h1 className="fw-bold">CEMCAA</h1>
          <p style={{ fontSize: "1.2rem" }}>
            Amor, rescate y esperanza para cada peludo sin hogar. 🐾
          </p>
        </div>
      </div>

      {/* Sección: Quiénes somos */}
      <Container className="my-5">
        <Row className="align-items-center">
          <Col md={6}>
            <img
              src="https://www.shutterstock.com/shutterstock/photos/760768426/display_1500/stock-vector-dog-s-logo-with-a-cat-in-a-flat-style-760768426.jpg"
              alt="Logo CEMCAA"
              style={{ width: "200px", height: "auto" }}
            />
          </Col>
          <Col md={6}>
            <h3 className="fw-bold text-success mb-3">¿Quiénes somos?</h3>
            <p>
              En <strong>CEMCAA</strong> trabajamos para rescatar, cuidar y
              rehabilitar perros y gatos en situación de calle. Les brindamos
              refugio, atención médica y amor hasta encontrarles un hogar
              permanente.
            </p>
            <p>
              Nuestra labor se basa en la empatía, el respeto y el compromiso
              hacia cada vida animal.
            </p>
          </Col>
        </Row>
      </Container>

      {/* Sección: Historias felices */}
      <Container className="my-5 text-center">
        <h3 className="fw-bold text-warning mb-4">Historias que inspiran</h3>
        <Row className="g-4 mb-5">
          {/* Luna */}
          <Col md={4}>
            <Card className="h-100 shadow-sm">
              <Card.Img
                variant="top"
                src="https://image.shutterstock.com/image-photo/beagle-dog-suitcase-things-260nw-2481066257.jpg"
                style={{ height: "250px", objectFit: "cover" }}
                alt="Luna"
              />
              <Card.Body>
                <Card.Title>Luna</Card.Title>
                <Card.Text>
                  Luna fue rescatada de las calles y ahora disfruta de una
                  familia que la ama.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          {/* Max */}
          <Col md={4}>
            <Card className="h-100 shadow-sm">
              <Card.Img
                variant="top"
                src="https://image.shutterstock.com/image-photo/family-enjoying-quality-time-together-260nw-2585353217.jpg"
                style={{ height: "250px", objectFit: "cover" }}
                alt="Max"
              />
              <Card.Body>
                <Card.Title>Max</Card.Title>
                <Card.Text>
                  Max encontró su hogar ideal donde recibe cariño y cuidados
                  diarios.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          {/* Kitty */}
          <Col md={4}>
            <Card className="h-100 shadow-sm">
              <Card.Img
                variant="top"
                src="https://image.shutterstock.com/image-photo/daily-concept-japanese-bobtail-cat-260nw-2318160345.jpg"
                style={{ height: "250px", objectFit: "cover" }}
                alt="Kitty"
              />
              <Card.Body>
                <Card.Title>Kitty</Card.Title>
                <Card.Text>
                  Kitty, antes llamada Michi, ahora vive feliz y segura con su
                  nueva familia.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Sección: Mensaje final */}
      <Container className="my-5">
        <Card
          className="text-center shadow-sm border-0 p-5"
          style={{
            backgroundColor: "#81B29A",
            color: "white",
            borderRadius: "15px",
          }}
        >
          <h3 className="fw-bold mb-3">Ellos solo necesitan una oportunidad</h3>
          <p style={{ maxWidth: "700px", margin: "0 auto" }}>
            Cada adopción es una historia de esperanza. Gracias a personas como
            tú, seguimos cambiando vidas y creando hogares felices.
          </p>
        </Card>
      </Container>

      {/* Pie de página visual */}
      <div
        style={{
          backgroundColor: "#E07A5F",
          color: "white",
          padding: "20px 0",
          textAlign: "center",
        }}
      >
        <p className="mb-0">
          © 2025 CEMCAA — Amor y esperanza para cada peludo 🐾
        </p>
      </div>
    </div>
  );
}

export default Home;
