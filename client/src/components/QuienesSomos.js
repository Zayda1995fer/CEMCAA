import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../styles/QuienesSomos.css";

function QuienesSomos() {
  return (
    <Container className="my-5 quienes-container">
      <Row className="align-items-center">
        <Col md={6} className="text-center">
          <img
            src="https://www.shutterstock.com/shutterstock/photos/760768426/display_1500/stock-vector-dog-s-logo-with-a-cat-in-a-flat-style-760768426.jpg"
            alt="Logo CEMCAA"
            className="quienes-logo"
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
            Nuestra labor se basa en la empatía, el respeto y el compromiso hacia cada vida animal.
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default QuienesSomos;
// End of recent edits