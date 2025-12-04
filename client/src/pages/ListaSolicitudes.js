import React, { useState, useEffect, useCallback } from 'react';
import axios from '../config/axios';
import { useNavigate } from 'react-router-dom';
import { Container, Table, Badge, Button, Form, Spinner, Alert } from 'react-bootstrap';

const ListaSolicitudes = ({ userId }) => {
  const navigate = useNavigate();
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroEstatus, setFiltroEstatus] = useState('');

  // ✅ useCallback para evitar el warning
  const cargarSolicitudes = useCallback(async () => {
    try {
      setLoading(true);
      
      // ✅ Endpoint para listar solicitudes
      const response = await axios.get('http://localhost:3001/adopcion/solicitudes', {
        params: userId ? { usuario_id: userId } : {}, // Si hay userId, filtrar por usuario
        withCredentials: true
      });

      if (response.data.success) {
        setSolicitudes(response.data.solicitudes || []);
      } else {
        setError('No se pudieron cargar las solicitudes');
      }
    } catch (err) {
      console.error('Error al cargar solicitudes:', err);
      setError('Error al cargar las solicitudes');
    } finally {
      setLoading(false);
    }
  }, [userId]); // ✅ Dependencia correcta

  useEffect(() => {
    cargarSolicitudes();
  }, [cargarSolicitudes]); // ✅ Ahora sí incluye la dependencia

  const getEstatusBadge = (estatus) => {
    const estilos = {
      'Pendiente': 'warning',
      'En Revisión': 'info',
      'Aprobada': 'success',
      'Rechazada': 'danger'
    };
    return estilos[estatus] || 'secondary';
  };

  const solicitudesFiltradas = filtroEstatus
    ? solicitudes.filter(s => s.estatus === filtroEstatus)
    : solicitudes;

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando solicitudes...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={cargarSolicitudes}>
            Reintentar
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary fw-bold">
          📋 {userId ? 'Mis Solicitudes' : 'Solicitudes de Adopción'}
        </h2>

        <Form.Select
          value={filtroEstatus}
          onChange={(e) => setFiltroEstatus(e.target.value)}
          style={{ width: '200px' }}
        >
          <option value="">Todos los estatus</option>
          <option value="Pendiente">Pendiente</option>
          <option value="En Revisión">En Revisión</option>
          <option value="Aprobada">Aprobada</option>
          <option value="Rechazada">Rechazada</option>
        </Form.Select>
      </div>

      {solicitudesFiltradas.length === 0 ? (
        <Alert variant="info">
          <i className="bi bi-info-circle me-2"></i>
          {userId 
            ? 'No has realizado ninguna solicitud de adopción todavía.'
            : 'No hay solicitudes registradas.'}
        </Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Usuario</th>
              <th>Animal</th>
              <th>Fecha</th>
              <th>Estatus</th>
              <th>Progreso</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {solicitudesFiltradas.map((solicitud) => (
              <tr key={solicitud.id}>
                <td>{solicitud.id}</td>
                <td>{solicitud.nombre_usuario || 'N/A'}</td>
                <td>{solicitud.nombre_animal || 'N/A'}</td>
                <td>{new Date(solicitud.fecha_solicitud).toLocaleDateString()}</td>
                <td>
                  <Badge bg={getEstatusBadge(solicitud.estatus)}>
                    {solicitud.estatus}
                  </Badge>
                </td>
                <td>
                  <div className="progress" style={{ height: '20px' }}>
                    <div
                      className={`progress-bar ${
                        solicitud.progreso >= 100 ? 'bg-success' : 'bg-info'
                      }`}
                      role="progressbar"
                      style={{ width: `${solicitud.progreso || 0}%` }}
                      aria-valuenow={solicitud.progreso || 0}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {solicitud.progreso || 0}%
                    </div>
                  </div>
                </td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate(`/solicitud-detalle/${solicitud.id}`)}
                  >
                    <i className="bi bi-eye me-1"></i>
                    Ver Detalle
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Botón para crear nueva solicitud (solo para usuarios) */}
      {userId && (
        <div className="text-center mt-4">
          <Button
            variant="success"
            onClick={() => navigate('/catalogo')}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Ver Catálogo de Mascotas
          </Button>
        </div>
      )}
    </Container>
  );
};

export default ListaSolicitudes;