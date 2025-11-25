import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/solicitud.css";

function SolicitudesEmpleado() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [detalleSolicitud, setDetalleSolicitud] = useState(null);
  const [loading, setLoading] = useState(false);

  const cargarSolicitudes = () => {
    setLoading(true);
    axios.get("http://localhost:3001/adopcion/todas")
      .then(res => {
        if (res.data.success) {
          setSolicitudes(res.data.data);
        }
      })
      .catch(err => {
        console.error("Error al cargar solicitudes:", err);
        alert("Error al cargar las solicitudes");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const aprobarSolicitud = (id) => {
    if (!window.confirm("¿Estás seguro de aprobar esta solicitud?")) return;

    axios.put(`http://localhost:3001/adopcion/${id}/aprobar`)
      .then(res => {
        if (res.data.success) {
          alert("Solicitud aprobada exitosamente");
          cargarSolicitudes();
          setModalVisible(false);
        }
      })
      .catch(err => {
        console.error("Error al aprobar:", err);
        alert("Error al aprobar la solicitud");
      });
  };

  const rechazarSolicitud = (id) => {
    const observaciones = prompt("¿Por qué deseas rechazar esta solicitud?");
    if (!observaciones) return;

    axios.put(`http://localhost:3001/adopcion/${id}/rechazar`, { observaciones })
      .then(res => {
        if (res.data.success) {
          alert("Solicitud rechazada");
          cargarSolicitudes();
          setModalVisible(false);
        }
      })
      .catch(err => {
        console.error("Error al rechazar:", err);
        alert("Error al rechazar la solicitud");
      });
  };

  const verDetalles = (id) => {
    setLoading(true);
    axios.get(`http://localhost:3001/adopcion/${id}`)
      .then(res => {
        if (res.data.success) {
          setDetalleSolicitud(res.data.data);
          setModalVisible(true);
        }
      })
      .catch(err => {
        console.error("Error al cargar detalles:", err);
        alert("Error al cargar los detalles");
      })
      .finally(() => setLoading(false));
  };

  const getBadgeColor = (estado) => {
    switch(estado) {
      case "Aprobada": return "bg-green-100 text-green-800";
      case "Rechazada": return "bg-red-100 text-red-800";
      case "En Revisión": return "bg-blue-100 text-blue-800";
      case "Pendiente": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="solicitud-container min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 py-8 px-4">
      <div className="solicitud-card max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl p-8 border-t-4 border-indigo-500">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Gestión de Solicitudes
            </h2>
            <p className="text-gray-500 mt-1">Administra y revisa las solicitudes de adopción</p>
          </div>
          <button 
            onClick={cargarSolicitudes}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            disabled={loading}
          >
            {loading ? "🔄 Cargando..." : "🔄 Actualizar"}
          </button>
        </div>

        {loading && solicitudes.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando solicitudes...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Usuario</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Animal</th>
                  <th className="p-3 text-left">Especie</th>
                  <th className="p-3 text-center">Fecha</th>
                  <th className="p-3 text-center">Estado</th>
                  <th className="p-3 text-center">Puntaje</th>
                  <th className="p-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {solicitudes.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-8 text-gray-500">
                      No hay solicitudes registradas
                    </td>
                  </tr>
                ) : (
                  solicitudes.map(s => (
                    <tr key={s.id} className="border-t hover:bg-gray-50 transition-colors">
                      <td className="p-3">#{s.id}</td>
                      <td className="p-3">{s.usuario_nombre || "Desconocido"}</td>
                      <td className="p-3 text-sm text-gray-600">{s.usuario_email || "N/A"}</td>
                      <td className="p-3">{s.animal_nombre || "N/A"}</td>
                      <td className="p-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {s.animal_especie || "N/A"}
                        </span>
                      </td>
                      <td className="p-3 text-center text-sm">
                        {new Date(s.fecha_solicitud).toLocaleDateString('es-MX', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getBadgeColor(s.estado)}`}>
                          {s.estado}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className="font-bold text-indigo-600">{s.puntuacion_total || 0}</span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center gap-2">
                          {s.estado === "Pendiente" && (
                            <>
                              <button 
                                onClick={() => aprobarSolicitud(s.id)} 
                                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors text-sm"
                                title="Aprobar solicitud"
                              >
                                ✓ Aprobar
                              </button>
                              <button 
                                onClick={() => rechazarSolicitud(s.id)} 
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors text-sm"
                                title="Rechazar solicitud"
                              >
                                ✗ Rechazar
                              </button>
                            </>
                          )}
                          <button 
                            onClick={() => verDetalles(s.id)} 
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors text-sm"
                            title="Ver detalles completos"
                          >
                            👁 Ver
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de detalles */}
      {modalVisible && detalleSolicitud && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-10 z-50 overflow-auto p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl p-6 relative my-8">
            <button 
              onClick={() => setModalVisible(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-3xl font-bold leading-none"
            >
              &times;
            </button>

            {/* Header del modal */}
            <div className="mb-6 border-b pb-4">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Solicitud #{detalleSolicitud.solicitud.id}
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Usuario</p>
                  <p className="font-semibold">{detalleSolicitud.solicitud.nombre_completo}</p>
                </div>
                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="font-semibold">{detalleSolicitud.solicitud.email}</p>
                </div>
                <div>
                  <p className="text-gray-600">Teléfono</p>
                  <p className="font-semibold">{detalleSolicitud.solicitud.telefono || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-600">Animal</p>
                  <p className="font-semibold">
                    {detalleSolicitud.solicitud.animal_nombre} ({detalleSolicitud.solicitud.especie})
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Fecha de Solicitud</p>
                  <p className="font-semibold">
                    {new Date(detalleSolicitud.solicitud.fecha_solicitud).toLocaleString('es-MX')}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Estado</p>
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getBadgeColor(detalleSolicitud.solicitud.estado)}`}>
                    {detalleSolicitud.solicitud.estado}
                  </span>
                </div>
              </div>
              <div className="mt-4 bg-indigo-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Puntuación Total</p>
                <p className="text-3xl font-bold text-indigo-600">
                  {detalleSolicitud.solicitud.puntuacion_total || 0} puntos
                </p>
              </div>
            </div>

            {/* Contenido del modal con scroll */}
            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
              
              {/* Vivienda */}
              {detalleSolicitud.vivienda && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-lg mb-3 text-blue-900 flex items-center">
                    🏠 Información de Vivienda
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Tipo de vivienda</p>
                      <p className="font-semibold">{detalleSolicitud.vivienda.tipo_vivienda}</p>
                      <span className="text-xs text-blue-600">({detalleSolicitud.vivienda.puntos_tipo_vivienda} pts)</span>
                    </div>
                    <div>
                      <p className="text-gray-600">¿Es alquilada?</p>
                      <p className="font-semibold">{detalleSolicitud.vivienda.es_alquilada ? "Sí" : "No"}</p>
                    </div>
                    {detalleSolicitud.vivienda.es_alquilada === 1 && (
                      <div>
                        <p className="text-gray-600">Permiso escrito</p>
                        <p className="font-semibold">{detalleSolicitud.vivienda.tiene_permiso_escrito ? "Sí" : "No"}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-600">Puntos situación</p>
                      <p className="font-semibold text-blue-600">{detalleSolicitud.vivienda.puntos_situacion_vivienda} pts</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Hogar y Familia */}
              {detalleSolicitud.hogar && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-lg mb-3 text-green-900 flex items-center">
                    👨‍👩‍👧‍👦 Hogar y Familia
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Composición del hogar</p>
                      <div className="space-y-1 mt-1">
                        {detalleSolicitud.hogar.vive_solo === 1 && <span className="inline-block bg-white px-2 py-1 rounded text-xs mr-1">Solo/a</span>}
                        {detalleSolicitud.hogar.vive_con_adultos === 1 && <span className="inline-block bg-white px-2 py-1 rounded text-xs mr-1">Con adultos</span>}
                        {detalleSolicitud.hogar.vive_con_ninos_menores_5 === 1 && <span className="inline-block bg-white px-2 py-1 rounded text-xs mr-1">Niños &lt;5</span>}
                        {detalleSolicitud.hogar.vive_con_ninos_6_12 === 1 && <span className="inline-block bg-white px-2 py-1 rounded text-xs mr-1">Niños 6-12</span>}
                        {detalleSolicitud.hogar.vive_con_adolescentes === 1 && <span className="inline-block bg-white px-2 py-1 rounded text-xs mr-1">Adolescentes</span>}
                        {detalleSolicitud.hogar.vive_con_adultos_mayores === 1 && <span className="inline-block bg-white px-2 py-1 rounded text-xs mr-1">Adultos mayores</span>}
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-600">Horas solo al día</p>
                      <p className="font-semibold">{detalleSolicitud.hogar.horas_solo_al_dia}</p>
                      <span className="text-xs text-green-600">({detalleSolicitud.hogar.puntos_horas_solo} pts)</span>
                    </div>
                    <div>
                      <p className="text-gray-600">Otras mascotas</p>
                      <p className="font-semibold">{detalleSolicitud.hogar.vive_con_otras_mascotas ? "Sí" : "No"}</p>
                      {detalleSolicitud.hogar.tipos_mascotas_actuales && (
                        <p className="text-xs text-gray-500 mt-1">{detalleSolicitud.hogar.tipos_mascotas_actuales}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-gray-600">Responsable principal</p>
                      <p className="font-semibold">{detalleSolicitud.hogar.responsable_principal}</p>
                      <span className="text-xs text-green-600">({detalleSolicitud.hogar.puntos_responsable} pts)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Experiencia y Motivación */}
              {detalleSolicitud.experiencia && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-lg mb-3 text-purple-900 flex items-center">
                    📝 Experiencia y Motivación
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-600">Motivo de adopción</p>
                      <p className="font-semibold italic">"{detalleSolicitud.experiencia.motivo_adopcion}"</p>
                      <span className="text-xs text-purple-600">({detalleSolicitud.experiencia.puntos_motivo} pts)</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-gray-600">Ha tenido mascotas</p>
                        <p className="font-semibold">{detalleSolicitud.experiencia.ha_tenido_mascotas ? "Sí" : "No"}</p>
                        <span className="text-xs text-purple-600">({detalleSolicitud.experiencia.puntos_experiencia} pts)</span>
                      </div>
                      {detalleSolicitud.experiencia.tipo_mascotas_anteriores && (
                        <div>
                          <p className="text-gray-600">Tipo de mascotas anteriores</p>
                          <p className="font-semibold">{detalleSolicitud.experiencia.tipo_mascotas_anteriores}</p>
                          <span className="text-xs text-purple-600">({detalleSolicitud.experiencia.puntos_tipo_mascotas} pts)</span>
                        </div>
                      )}
                    </div>
                    {detalleSolicitud.experiencia.detalle_mascotas_anteriores && (
                      <div>
                        <p className="text-gray-600">Detalle de experiencia</p>
                        <p className="text-sm">{detalleSolicitud.experiencia.detalle_mascotas_anteriores}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-600">Compromiso largo plazo</p>
                      <p className="font-semibold">{detalleSolicitud.experiencia.preparado_compromiso_largo_plazo}</p>
                      <span className="text-xs text-purple-600">({detalleSolicitud.experiencia.puntos_compromiso} pts)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Compromiso Económico */}
              {detalleSolicitud.economico && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-lg mb-3 text-yellow-900 flex items-center">
                    💰 Compromiso Económico
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Actitud gastos veterinarios</p>
                      <p className="font-semibold">{detalleSolicitud.economico.actitud_gastos_veterinarios}</p>
                      <span className="text-xs text-yellow-600">({detalleSolicitud.economico.puntos_gastos_veterinarios} pts)</span>
                    </div>
                    <div>
                      <p className="text-gray-600">Dispuesto a esterilizar</p>
                      <p className="font-semibold">{detalleSolicitud.economico.dispuesto_esterilizar}</p>
                      <span className="text-xs text-yellow-600">({detalleSolicitud.economico.puntos_esterilizacion} pts)</span>
                    </div>
                    <div>
                      <p className="text-gray-600">Presupuesto mensual estimado</p>
                      <p className="font-semibold">${detalleSolicitud.economico.presupuesto_mensual_estimado} MXN</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Preferencia */}
              {detalleSolicitud.preferencia && (
                <div className="bg-pink-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-lg mb-3 text-pink-900 flex items-center">
                    🐾 Preferencias
                  </h4>
                  <div className="text-sm">
                    <p className="text-gray-600">Tipo de animal preferido</p>
                    <p className="font-semibold text-lg">{detalleSolicitud.preferencia.tipo_animal}</p>
                  </div>
                </div>
              )}

              {/* Datos específicos para Perros */}
              {detalleSolicitud.perros && (
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-lg mb-3 text-orange-900 flex items-center">
                    🐕 Cuidado Específico para Perros
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Frecuencia de paseos</p>
                      <p className="font-semibold">{detalleSolicitud.perros.frecuencia_paseos || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Duración de paseos</p>
                      <p className="font-semibold">{detalleSolicitud.perros.duracion_paseos || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Nivel de energía preferido</p>
                      <p className="font-semibold">{detalleSolicitud.perros.nivel_energia_preferido || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Disposición entrenamiento</p>
                      <p className="font-semibold">{detalleSolicitud.perros.disposicion_entrenamiento || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Conocimiento higiene</p>
                      <p className="font-semibold">{detalleSolicitud.perros.conocimiento_higiene || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Frecuencia baño/cepillado</p>
                      <p className="font-semibold">{detalleSolicitud.perros.frecuencia_bano_cepillado || "N/A"}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Datos específicos para Gatos */}
              {detalleSolicitud.gatos && (
                <div className="bg-teal-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-lg mb-3 text-teal-900 flex items-center">
                    🐈 Cuidado Específico para Gatos
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Ventanas protegidas</p>
                      <p className="font-semibold">{detalleSolicitud.gatos.ventanas_protegidas || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Adaptación del hogar</p>
                      <p className="font-semibold">{detalleSolicitud.gatos.adaptacion_hogar || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Limpieza arenero</p>
                      <p className="font-semibold">{detalleSolicitud.gatos.frecuencia_limpieza_arenero || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Personalidad preferida</p>
                      <p className="font-semibold">{detalleSolicitud.gatos.personalidad_preferida || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Plan de enriquecimiento</p>
                      <p className="font-semibold">{detalleSolicitud.gatos.plan_enriquecimiento || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Tipo de alimentación</p>
                      <p className="font-semibold">{detalleSolicitud.gatos.tipo_alimentacion || "N/A"}</p>
                    </div>
                    {detalleSolicitud.gatos.considera_desungulacion === 1 && (
                      <div className="col-span-2 bg-red-100 p-2 rounded">
                        <p className="text-red-700 font-semibold">⚠️ Considera desungulación (práctica no recomendada)</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer del modal con acciones */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              {detalleSolicitud.solicitud.estado === "Pendiente" && (
                <>
                  <button 
                    onClick={() => aprobarSolicitud(detalleSolicitud.solicitud.id)} 
                    className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors font-semibold"
                  >
                    ✓ Aprobar Solicitud
                  </button>
                  <button 
                    onClick={() => rechazarSolicitud(detalleSolicitud.solicitud.id)} 
                    className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors font-semibold"
                  >
                    ✗ Rechazar Solicitud
                  </button>
                </>
              )}
              <button 
                onClick={() => setModalVisible(false)} 
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SolicitudesEmpleado;