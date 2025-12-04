// client/src/components/Solicitud/SeccionSolicitud.js
import React from 'react';
import "../../styles/solicitud.css";


const SeccionSolicitud = ({ seccion, isExpanded, onToggle }) => {
  const getIcono = (nombre) => {
    const iconos = {
      'Vivienda': '🏠',
      'HogarFamilia': '👨‍👩‍👧‍👦',
      'Experiencia': '📚',
      'Economico': '💰',
      'Preferencia': '❤️',
      'Perros': '🐕',
      'Gatos': '🐱'
    };
    return iconos[nombre] || '📄';
  };

  const renderValor = (valor) => {
    if (typeof valor === 'boolean' || valor === 0 || valor === 1) {
      return valor ? '✅ Sí' : '❌ No';
    }
    if (valor === null || valor === undefined || valor === '') {
      return <span className="text-gray-400 italic">No especificado</span>;
    }
    return valor;
  };

  const getNombreAmigable = (key) => {
    const nombres = {
      // Vivienda
      'tipo_vivienda': 'Tipo de vivienda',
      'es_alquilada': 'Vivienda alquilada',
      'tiene_permiso_escrito': 'Permiso escrito del propietario',
      
      // Hogar y Familia
      'vive_solo': 'Vive solo/a',
      'vive_con_adultos': 'Vive con adultos',
      'vive_con_ninos_menores_5': 'Vive con niños menores de 5 años',
      'vive_con_ninos_6_12': 'Vive con niños de 6 a 12 años',
      'vive_con_adolescentes': 'Vive con adolescentes',
      'vive_con_adultos_mayores': 'Vive con adultos mayores',
      'vive_con_otras_mascotas': 'Tiene otras mascotas',
      'tipos_mascotas_actuales': 'Tipos de mascotas actuales',
      'horas_solo_al_dia': 'Horas que estará solo al día',
      'responsable_principal': 'Responsable principal del cuidado',
      
      // Experiencia
      'motivo_adopcion': 'Motivo de la adopción',
      'ha_tenido_mascotas': 'Ha tenido mascotas anteriormente',
      'detalle_mascotas_anteriores': 'Detalle de mascotas anteriores',
      'tipo_mascotas_anteriores': 'Tipo de mascotas anteriores',
      'preparado_compromiso_largo_plazo': 'Preparado para compromiso a largo plazo',
      
      // Económico
      'actitud_gastos_veterinarios': 'Actitud hacia gastos veterinarios',
      'dispuesto_esterilizar': 'Dispuesto a esterilizar',
      'presupuesto_mensual_estimado': 'Presupuesto mensual estimado (MXN)',
      
      // Preferencia
      'tipo_animal': 'Tipo de animal preferido',
      
      // Perros
      'frecuencia_paseos': 'Frecuencia de paseos',
      'duracion_paseos': 'Duración de paseos',
      'nivel_energia_preferido': 'Nivel de energía preferido',
      'disposicion_entrenamiento': 'Disposición para entrenamiento',
      'plan_socializacion': 'Plan de socialización',
      'conocimiento_higiene': 'Conocimiento sobre higiene',
      'frecuencia_bano_cepillado': 'Frecuencia de baño y cepillado',
      'manejo_muda_pelaje': 'Manejo de muda de pelaje',
      'conocimiento_cuidado_dental': 'Conocimiento sobre cuidado dental',
      
      // Gatos
      'ventanas_protegidas': 'Ventanas protegidas',
      'adaptacion_hogar': 'Adaptación del hogar',
      'frecuencia_limpieza_arenero': 'Frecuencia de limpieza del arenero',
      'manejo_cuidado_pelaje': 'Manejo del cuidado del pelaje',
      'conocimiento_higiene_dental': 'Conocimiento sobre higiene dental',
      'personalidad_preferida': 'Personalidad preferida',
      'plan_enriquecimiento': 'Plan de enriquecimiento ambiental',
      'tipo_alimentacion': 'Tipo de alimentación',
      'considera_desungulacion': 'Considera la desungulación'
    };
    return nombres[key] || key;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getIcono(seccion.nombre)}</span>
          <h3 className="text-xl font-semibold text-gray-800">
            {seccion.nombre}
          </h3>
          {seccion.esCompleto ? (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-semibold">
              ✓ Completa
            </span>
          ) : (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-semibold">
              ⚠ Incompleta
            </span>
          )}
        </div>
        <svg
          className={`w-6 h-6 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isExpanded && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(seccion.datos).map(([key, value]) => (
              <div key={key} className="bg-white p-3 rounded-lg shadow-sm">
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  {getNombreAmigable(key)}
                </p>
                <p className="text-gray-800">
                  {renderValor(value)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SeccionSolicitud;