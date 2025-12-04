import React from 'react';

import { useParams } from 'react-router-dom';
import SolicitudViewer from '../components/Solicitud/SolicitudViewer';

const SolicitudDetalle = () => {
  const { id } = useParams();

  return (
    <div>
      <SolicitudViewer solicitudId={id} />
    </div>
  );
};

export default SolicitudDetalle;