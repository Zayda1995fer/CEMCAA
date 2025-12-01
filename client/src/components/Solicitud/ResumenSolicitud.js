// client/src/components/Solicitud/ResumenSolicitud.js
import React from 'react';

const ResumenSolicitud = ({ progreso, esCompleto }) => {
  const porcentaje = progreso ? progreso.porcentaje : 0;
  const completas = progreso ? progreso.completas : 0;
  const total = progreso ? progreso.total : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        📊 Resumen de la Solicitud
      </h2>

      <div className="space-y-4">
        {/* Estado general */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold text-gray-700">
              Estado de completitud
            </p>
            <p className="text-sm text-gray-500">
              {completas} de {total} secciones completas
            </p>
          </div>
          <div>
            {esCompleto ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
                <span className="font-semibold text-green-800">
                  Solicitud Completa
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">⚠️</span>
                <span className="font-semibold text-yellow-800">
                  Solicitud Incompleta
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Barra de progreso */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-600">
              Progreso general
            </span>
            <span className="text-sm font-bold text-indigo-600">
              {porcentaje.toFixed(1)}%
            </span>
          </div>
          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                esCompleto
                  ? 'bg-gradient-to-r from-green-400 to-green-600'
                  : 'bg-gradient-to-r from-indigo-400 to-indigo-600'
              }`}
              style={{ width: `${porcentaje}%` }}
            />
          </div>
        </div>

        {/* Información adicional */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600">
              {total}
            </div>
            <div className="text-sm text-gray-600">
              Secciones totales
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {completas}
            </div>
            <div className="text-sm text-gray-600">
              Secciones completas
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600">
              {total - completas}
            </div>
            <div className="text-sm text-gray-600">
              Secciones pendientes
            </div>
          </div>
        </div>

        {/* Mensaje de advertencia si está incompleta */}
        {!esCompleto && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="font-semibold text-yellow-800">
                  Atención: Solicitud incompleta
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  Algunas secciones tienen información faltante o errores de validación.
                  Por favor, revisa las secciones marcadas como incompletas.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumenSolicitud;