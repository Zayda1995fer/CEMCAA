import React, { useState, useEffect, useCallback } from 'react';
import axios from '../../config/axios';
import "../../styles/solicitudre.css";
import SeccionSolicitud from './SeccionSolicitud';
import ResumenSolicitud from './ResumenSolicitud';

const SolicitudViewer = ({ solicitudId }) => {
  const [solicitud, setSolicitud] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seccionExpandida, setSeccionExpandida] = useState(null);

  const cargarSolicitud = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/adopcion/solicitud/${solicitudId}`);
      if (response.data.success) {
        setSolicitud(response.data.solicitud);
      } else {
        setError("No se pudo cargar la solicitud");
      }
    } catch (err) {
      console.error("Error al cargar solicitud:", err);
      setError("Error al cargar la solicitud");
    } finally {
      setLoading(false);
    }
  }, [solicitudId]);

  useEffect(() => {
    cargarSolicitud();
  }, [cargarSolicitud]);

  const toggleSeccion = (nombreSeccion) => {
    setSeccionExpandida(seccionExpandida === nombreSeccion ? null : nombreSeccion);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="font-semibold">❌ {error}</p>
        </div>
      </div>
    );
  }

  if (!solicitud) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-700">
          <p>No se encontró información de la solicitud</p>
        </div>
      </div>
    );
  }

  const datos = solicitud.datosGenerales || {};

  // Convertimos secciones a array
  const seccionesArray = Object.entries(solicitud.secciones || {}).map(
    ([nombre, datos]) => ({
      nombre,
      datos,
      esCompleto: datos && Object.keys(datos).length > 0
    })
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {solicitud.nombre || "Solicitud"}
              </h1>

              <div className="flex gap-4 text-sm text-gray-600">
                <span>
                  <strong>Usuario ID:</strong> {datos.usuario_id || "N/A"}
                </span>

                <span>
                  <strong>Animal ID:</strong> {datos.animal_id || "N/A"}
                </span>

                <span>
                  <strong>Fecha:</strong>{" "}
                  {datos.fecha_solicitud ? new Date(datos.fecha_solicitud).toLocaleDateString() : "N/A"}
                </span>
              </div>
            </div>

            <div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  datos.estatus === 'Aprobada'
                    ? 'bg-green-100 text-green-800'
                    : datos.estatus === 'Rechazada'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {datos.estatus || "Pendiente"}
              </span>
            </div>
          </div>
        </div>

        {/* Resumen y Progreso */}
        <ResumenSolicitud
          solicitud={solicitud}
          progreso={solicitud.progreso}
          esCompleto={solicitud.esCompleto}
        />

        {/* Secciones */}
        <div className="space-y-4">
          {seccionesArray.length > 0 ? (
            seccionesArray.map((seccion, index) => (
              <SeccionSolicitud
                key={index}
                seccion={seccion}
                isExpanded={seccionExpandida === seccion.nombre}
                onToggle={() => toggleSeccion(seccion.nombre)}
              />
            ))
          ) : (
            <p>No hay secciones disponibles.</p>
          )}
        </div>

        {/* Botones */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center">
            <button
              onClick={() => window.print()}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              🖨️ Imprimir
            </button>

            <button
              onClick={() => window.history.back()}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              ← Volver
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SolicitudViewer;
