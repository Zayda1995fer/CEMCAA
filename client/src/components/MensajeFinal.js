import React from "react";
import { Container, Card } from "react-bootstrap";
import "../styles/MensajeFinal.css";

function MensajeFinal() {
  return (
    <Container className="my-5">
      <Card className="mensaje-card text-center shadow-sm border-0 p-5">
        <h3 className="fw-bold mb-3">Ellos solo necesitan una oportunidad</h3>
        <p>
          Cada adopción es una historia de esperanza. Gracias a personas como
          tú, seguimos cambiando vidas y creando hogares felices.
        </p>
      </Card>
    </Container>
  );
}

export default MensajeFinal;
