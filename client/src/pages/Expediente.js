import React, { useEffect, useState } from "react";
import axios from "axios";

const Expediente = () => {
  const [expedientes, setExpedientes] = useState([]);
  const [animales, setAnimales] = useState([]);
  const [expedienteSeleccionado, setExpedienteSeleccionado] = useState(null);
  const [modo, setModo] = useState("lista");
  const [animalSeleccionado, setAnimalSeleccionado] = useState("");
  const [expedienteAEditar, setExpedienteAEditar] = useState(null);

  // Estados para el formulario de NUEVO expediente
  const [formData, setFormData] = useState({
    historial_vida: {
      origen: "",cantidad_duenos_previos: 0,
      situacion_previa: "",
      ultimo_dueno_nombre_completo: "",
      ultimo_dueno_telefono: "",
      fecha_registro: new Date().toISOString().split("T")[0],
    },
    salud: {
      estado_actual_salud: "",
      enfermedades_temporales: "",
      tratamientos_medicos: "",
      esterilizacion: "",
      fecha_esterilizacion: "",
      cirugias_anteriores: "",
      fecha_actualizacion: new Date().toISOString().split("T")[0],
    },
    vacunas: [
      {
        fecha_vacuna: "",
        tipo_vacuna: "",
        producto: "",
        lote: "",
        dosis: "",
        proxima_dosis: "",
        veterinario: "",
        observaciones: "",
        fecha_registro: new Date().toISOString().split("T")[0],
      },
    ],
    desparasitaciones: [
      {
        fecha_desparasitacion: "",
        tipo: "",
        producto: "",
        dosis: "",
        proxima_aplicacion: "",
        veterinario: "",
        observaciones: "",
        fecha_registro: new Date().toISOString().split("T")[0],
      },
    ],
    comportamiento: {
      caracter_general: "",
      compatibilidad_ninos: "",
      compatibilidad_perros: "",
      compatibilidad_gatos: "",
      nivel_energia: "",
      entrenamiento: "",
      fecha_evaluacion: new Date().toISOString().split("T")[0],
    },
    expediente_clinico: {
      fecha: new Date().toISOString().split("T")[0],
      tipo: "",
      motivo: "",
      diagnostico: "",
      tratamiento: "",
      peso: "",
      temperatura: "",
      observaciones: "",
      veterinario: "",
      fecha_proxima_revision: "",
      fecha_registro: new Date().toISOString().split("T")[0],
    },
  });

  // Estado para el formulario de ACTUALIZACIÓN
  const [formDataActualizar, setFormDataActualizar] = useState({
    salud: {
      estado_actual_salud: "",
      enfermedades_temporales: "",
      tratamientos_medicos: "",
      esterilizacion: "",
      fecha_actualizacion: new Date().toISOString().split('T')[0]
    },
    nueva_vacuna: {
      fecha_vacuna: "",
      tipo_vacuna: "",
      producto: "",
      lote: "",
      dosis: "",
      proxima_dosis: "",
      veterinario: "",
      observaciones: "",
      fecha_registro: new Date().toISOString().split('T')[0]
    },
    nueva_desparasitacion: {
      fecha_desparasitacion: "",
      tipo: "",
      producto: "",
      dosis: "",
      proxima_aplicacion: "",
      veterinario: "",
      observaciones: "",
      fecha_registro: new Date().toISOString().split('T')[0]
    },
    nueva_revision: {
      fecha: new Date().toISOString().split('T')[0],
      tipo: "",
      motivo: "",
      diagnostico: "",
      tratamiento: "",
      peso: "",
      temperatura: "",
      observaciones: "",
      veterinario: "",
      fecha_proxima_revision: "",
      fecha_registro: new Date().toISOString().split('T')[0]
    }
  });

  useEffect(() => {
    cargarAnimales();
    cargarExpedientes();
  }, []);

  const cargarAnimales = () => {
    axios
      .get("http://localhost:3001/animales")
      .then((res) => {
        setAnimales(res.data);
      })
      .catch((err) => {
        console.error("Error cargando animales:", err);
      });
  };

  const cargarExpedientes = () => {
    axios
      .get("http://localhost:3001/animales")
      .then((res) => setExpedientes(res.data))
      .catch((err) => console.error(err));
  };

  const verExpediente = (id) => {
    axios
      .get(`http://localhost:3001/expediente/${id}`)
      .then((res) => {
        setExpedienteSeleccionado(res.data);
        setModo("detalle");
      })
      .catch((err) => {
        console.error("Error cargando expediente:", err);
      });
  };

  const editarExpedienteDesdeLista = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3001/expediente/${id}`);
      const expedienteCompleto = response.data;
      
      setExpedienteAEditar(expedienteCompleto);
      precargarFormularioEdicion(expedienteCompleto);
      setModo("editarDesdeLista");
      
    } catch (error) {
      console.error("Error cargando expediente para editar:", error);
      alert("Error al cargar el expediente para editar: " + error.message);
    }
  };

  const precargarFormularioEdicion = (expediente) => {
    if (!expediente) return;

    setAnimalSeleccionado(expediente.animal?.Id?.toString() || "");

    if (expediente.historial_vida) {
      setFormData(prev => ({
        ...prev,
        historial_vida: {
          ...prev.historial_vida,
          ...expediente.historial_vida
        }
      }));
    }

    if (expediente.salud) {
      setFormData(prev => ({
        ...prev,
        salud: {
          ...prev.salud,
          ...expediente.salud
        }
      }));
    }

    if (expediente.comportamiento) {
      setFormData(prev => ({
        ...prev,
        comportamiento: {
          ...prev.comportamiento,
          ...expediente.comportamiento
        }
      }));
    }

    if (expediente.vacunas && expediente.vacunas.length > 0) {
      setFormData(prev => ({
        ...prev,
        vacunas: expediente.vacunas.map(vacuna => ({
          fecha_vacuna: vacuna.fecha_vacuna || "",
          tipo_vacuna: vacuna.tipo_vacuna || "",
          producto: vacuna.producto || "",
          lote: vacuna.lote || "",
          dosis: vacuna.dosis || "",
          proxima_dosis: vacuna.proxima_dosis || "",
          veterinario: vacuna.veterinario || "",
          observaciones: vacuna.observaciones || "",
          fecha_registro: vacuna.fecha_registro || new Date().toISOString().split("T")[0]
        }))
      }));
    }

    if (expediente.desparasitaciones && expediente.desparasitaciones.length > 0) {
      setFormData(prev => ({
        ...prev,
        desparasitaciones: expediente.desparasitaciones.map(desp => ({
          fecha_desparasitacion: desp.fecha_desparasitacion || "",
          tipo: desp.tipo || "",
          producto: desp.producto || "",
          dosis: desp.dosis || "",
          proxima_aplicacion: desp.proxima_aplicacion || "",
          veterinario: desp.veterinario || "",
          observaciones: desp.observaciones || "",
          fecha_registro: desp.fecha_registro || new Date().toISOString().split("T")[0]
        }))
      }));
    }

    if (expediente.revisiones && expediente.revisiones.length > 0) {
      const ultimaRevision = expediente.revisiones[expediente.revisiones.length - 1];
      setFormData(prev => ({
        ...prev,
        expediente_clinico: {
          ...prev.expediente_clinico,
          ...ultimaRevision
        }
      }));
    }
  };

  const resetearFormulario = () => {
    setAnimalSeleccionado("");
    setFormData({
      historial_vida: {
        origen: "",
        cantidad_duenos_previos: 0,
        situacion_previa: "",
        ultimo_dueno_nombre_completo: "",
        ultimo_dueno_telefono: "",
        fecha_registro: new Date().toISOString().split("T")[0],
      },
      salud: {
        estado_actual_salud: "",
        enfermedades_temporales: "",
        tratamientos_medicos: "",
        esterilizacion: "",
        fecha_esterilizacion: "",
        cirugias_anteriores: "",
        fecha_actualizacion: new Date().toISOString().split("T")[0],
      },
      vacunas: [
        {
          fecha_vacuna: "",
          tipo_vacuna: "",
          producto: "",
          lote: "",
          dosis: "",
          proxima_dosis: "",
          veterinario: "",
          observaciones: "",
          fecha_registro: new Date().toISOString().split("T")[0],
        },
      ],
      desparasitaciones: [
        {
          fecha_desparasitacion: "",
          tipo: "",
          producto: "",
          dosis: "",
          proxima_aplicacion: "",
          veterinario: "",
          observaciones: "",
          fecha_registro: new Date().toISOString().split("T")[0],
        },
      ],
      comportamiento: {
        caracter_general: "",
        compatibilidad_ninos: "",
        compatibilidad_perros: "",
        compatibilidad_gatos: "",
        nivel_energia: "",
        entrenamiento: "",
        fecha_evaluacion: new Date().toISOString().split("T")[0],
      },
      expediente_clinico: {
        fecha: new Date().toISOString().split("T")[0],
        tipo: "",
        motivo: "",
        diagnostico: "",
        tratamiento: "",
        peso: "",
        temperatura: "",
        observaciones: "",
        veterinario: "",
        fecha_proxima_revision: "",
        fecha_registro: new Date().toISOString().split("T")[0],
      },
    });
  };

  const agregarVacuna = () => {
    setFormData((prev) => ({
      ...prev,
      vacunas: [
        ...prev.vacunas,
        {
          fecha_vacuna: "",
          tipo_vacuna: "",
          producto: "",
          lote: "",
          dosis: "",
          proxima_dosis: "",
          veterinario: "",
          observaciones: "",
          fecha_registro: new Date().toISOString().split("T")[0],
        },
      ],
    }));
  };

  const eliminarVacuna = (index) => {
    setFormData((prev) => ({
      ...prev,
      vacunas: prev.vacunas.filter((_, i) => i !== index),
    }));
  };

  const agregarDesparasitacion = () => {
    setFormData((prev) => ({
      ...prev,
      desparasitaciones: [
        ...prev.desparasitaciones,
        {
          fecha_desparasitacion: "",
          tipo: "",
          producto: "",
          dosis: "",
          proxima_aplicacion: "",
          veterinario: "",
          observaciones: "",
          fecha_registro: new Date().toISOString().split("T")[0],
        },
      ],
    }));
  };

  const eliminarDesparasitacion = (index) => {
    setFormData((prev) => ({
      ...prev,
      desparasitaciones: prev.desparasitaciones.filter((_, i) => i !== index),
    }));
  };

  const handleInputChange = (seccion, campo, valor, index = null) => {
    if (index !== null) {
      setFormData((prev) => ({
        ...prev,
        [seccion]: prev[seccion].map((item, i) =>
          i === index ? { ...item, [campo]: valor } : item
        ),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [seccion]: {
          ...prev[seccion],
          [campo]: valor,
        },
      }));
    }
  };

  const handleInputChangeActualizar = (seccion, campo, valor) => {
    setFormDataActualizar(prev => ({
      ...prev,
      [seccion]: {
        ...prev[seccion],
        [campo]: valor
      }
    }));
  };

  const handleActualizarExpediente = async (e) => {
    e.preventDefault();
    
    if (!expedienteSeleccionado) {
      alert("No hay expediente seleccionado");
      return;
    }

    try {
      const datosActualizacion = {
        id_animal: expedienteSeleccionado.animal.Id,
        salud: formDataActualizar.salud,
        nueva_vacuna: formDataActualizar.nueva_vacuna,
        nueva_desparasitacion: formDataActualizar.nueva_desparasitacion,
        nueva_revision: formDataActualizar.nueva_revision
      };

      const response = await axios.put(
        `http://localhost:3001/expediente/${expedienteSeleccionado.animal.Id}`,
        datosActualizacion
      );
      
      if (response.status === 200) {
        alert("✅ Expediente actualizado exitosamente");
        verExpediente(expedienteSeleccionado.animal.Id);
        setModo("detalle");
        
        setFormDataActualizar({
          salud: {
            estado_actual_salud: "",
            enfermedades_temporales: "",
            tratamientos_medicos: "",
            esterilizacion: "",
            fecha_actualizacion: new Date().toISOString().split('T')[0]
          },
          nueva_vacuna: {
            fecha_vacuna: "",
            tipo_vacuna: "",
            producto: "",
            lote: "",
            dosis: "",
            proxima_dosis: "",
            veterinario: "",
            observaciones: "",
            fecha_registro: new Date().toISOString().split('T')[0]
          },
          nueva_desparasitacion: {
            fecha_desparasitacion: "",
            tipo: "",
            producto: "",
            dosis: "",
            proxima_aplicacion: "",
            veterinario: "",
            observaciones: "",
            fecha_registro: new Date().toISOString().split('T')[0]
          },
          nueva_revision: {
            fecha: new Date().toISOString().split('T')[0],
            tipo: "",
            motivo: "",
            diagnostico: "",
            tratamiento: "",
            peso: "",
            temperatura: "",
            observaciones: "",
            veterinario: "",
            fecha_proxima_revision: "",
            fecha_registro: new Date().toISOString().split('T')[0]
          }
        });
      }
    } catch (error) {
      console.error("Error al actualizar expediente:", error);
      alert("Error al actualizar el expediente: " + (error.response?.data?.error || error.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!animalSeleccionado) {
      alert("Por favor selecciona un animal");
      return;
    }

    try {
      const expedienteCompleto = {
        id_animal: parseInt(animalSeleccionado),
        historial_vida: formData.historial_vida,
        salud: formData.salud,
        comportamiento: formData.comportamiento,
        vacunas: formData.vacunas.filter((vacuna) =>
          Object.values(vacuna).some((val) => val !== "" && val !== 0)
        ),
        desparasitaciones: formData.desparasitaciones.filter(
          (desparasitacion) =>
            Object.values(desparasitacion).some(
              (val) => val !== "" && val !== 0
            )
        ),
        revisiones: [formData.expediente_clinico].filter((revision) =>
          Object.values(revision).some((val) => val !== "" && val !== 0)
        ),
      };

      const response = await axios.post(
        "http://localhost:3001/expediente",
        expedienteCompleto
      );

      if (response.status === 201 || response.status === 207) {
        if (response.status === 207) {
          alert("Expediente creado con algunas advertencias");
        } else {
          alert("Expediente creado exitosamente");
        }
        setModo("lista");
        cargarExpedientes();
        resetearFormulario();
      }
    } catch (error) {
      console.error("Error al crear expediente:", error);
      alert(
        "Error al crear el expediente: " +
          (error.response?.data?.error || error.message)
      );
    }
  };

  const encontrarHistorial = (expediente) => {
    const posiblesCampos = [
      'historial_vida',
      'historialVida', 
      'historial',
      'datos_historial',
      'historialDeVida',
      'vida_historial',
      'life_history'
    ];
    
    for (let campo of posiblesCampos) {
      if (expediente[campo]) {
        return expediente[campo];
      }
    }
    
    const buscarEnObjeto = (obj, profundidad = 0) => {
      if (profundidad > 3) return null;
      
      for (let key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          const posiblesKeysHistorial = ['origen', 'cantidad_duenos_previos', 'situacion_previa'];
          const tieneCamposHistorial = posiblesKeysHistorial.some(k => k in obj[key]);
          
          if (tieneCamposHistorial) {
            return obj[key];
          }
          
          const resultado = buscarEnObjeto(obj[key], profundidad + 1);
          if (resultado) return resultado;
        }
      }
      return null;
    };
    
    return buscarEnObjeto(expediente);
  };

  return (
    <div className="container my-5">
      {modo === "lista" && (
        <>
          <div className="header-with-button">
            <h2>📋 Lista de Expedientes</h2>
            <button
              className="btn-nuevo-expediente"
              onClick={() => setModo("nuevo")}
            >
              ➕ Crear nuevo expediente
            </button>
          </div>

          {expedientes.length > 0 ? (
            <div className="expediente-list">
              {expedientes.map((e) => (
                <div key={e.Id} className="expediente-item">
                  <div className="expediente-header">
                    <div className="expediente-basic-info">
                      <h4 className="expediente-title">{e.nombre}</h4>
                      <div className="expediente-details">
                        <span>
                          <strong>Especie:</strong> {e.especie}
                        </span>
                        <span>
                          <strong>Raza:</strong> {e.raza}
                        </span>
                        <span>
                          <strong>Sexo:</strong> {e.sexo}
                        </span>
                        <span>
                          <strong>Edad:</strong>{" "}
                          {e.edadAprox || "No especificada"}
                        </span>
                        <span>
                          <strong>Estatus:</strong> {e.estatus}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="expediente-actions">
                    <button
                      className="btn-ver-expediente"
                      onClick={() => verExpediente(e.Id)}
                    >
                      📄 Ver expediente
                    </button>
                    <button
                      className="btn-agregar-info"
                      onClick={() => {
                        verExpediente(e.Id);
                        setModo("editar");
                      }}
                    >
                      ✏️ Agregar información
                    </button>
                    <button
                      className="btn-editar-expediente"
                      onClick={() => editarExpedienteDesdeLista(e.Id)}
                    >
                      📝 Editar expediente
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-expedientes">
              <div className="no-expedientes-icon">📂</div>
              <h3>No hay expedientes creados</h3>
              <p>
                Comienza creando tu primer expediente para organizar la
                información de los animales.
              </p>
            </div>
          )}
        </>
      )}

      {modo === "detalle" && expedienteSeleccionado && (
        <>
          <div className="header-with-button">
            <h2>Expediente de {expedienteSeleccionado.animal.nombre}</h2>
            <div>
              <button 
                className="btn-agregar-info"
                onClick={() => setModo("editar")}
                style={{marginRight: '10px'}}
              >
                ✏️ Agregar información
              </button>
              <button onClick={() => setModo("lista")}>
                ⬅️ Volver al listado
              </button>
            </div>
          </div>

          <div className="expediente-detalle">
            <section className="detail-section">
              <h3>🐾 Datos Básicos</h3>
              <div className="detail-grid">
                <div>
                  <strong>Especie:</strong>{" "}
                  {expedienteSeleccionado.animal.especie}
                </div>
                <div>
                  <strong>Raza:</strong> {expedienteSeleccionado.animal.raza}
                </div>
                <div>
                  <strong>Sexo:</strong> {expedienteSeleccionado.animal.sexo}
                </div>
                <div>
                  <strong>Edad:</strong>{" "}
                  {expedienteSeleccionado.animal.edadAprox || "No especificada"}
                </div>
                <div>
                  <strong>Estatus:</strong>{" "}
                  {expedienteSeleccionado.animal.estatus}
                </div>
              </div>
            </section>

            <section className="detail-section">
              <h3>📖 Historial de Vida</h3>
              
              {(() => {
                const historial = encontrarHistorial(expedienteSeleccionado);
                
                return historial ? (
                  <div className="detail-grid">
                    <div>
                      <strong>Origen:</strong>{" "}
                      {historial.origen || historial.Origen || "No especificado"}
                    </div>
                    <div>
                      <strong>Dueños Previos:</strong>{" "}
                      {historial.cantidad_duenos_previos ?? historial.cantidadDuenosPrevios ?? historial.duenos_previos ?? "0"}
                    </div>
                    <div>
                      <strong>Situación Previa:</strong>{" "}
                      {historial.situacion_previa || historial.situacionPrevia || historial.situacion || "No especificada"}
                    </div>
                    <div>
                      <strong>Último Dueño:</strong>{" "}
                      {historial.ultimo_dueno_nombre_completo || historial.ultimoDuenoNombreCompleto || historial.ultimo_dueno || "No especificado"}
                    </div>
                    <div>
                      <strong>Teléfono:</strong>{" "}
                      {historial.ultimo_dueno_telefono || historial.ultimoDuenoTelefono || historial.telefono_dueno || "No especificado"}
                    </div>
                  </div>
                ) : (
                  <div className="no-data">
                    <p>📝 No se encontró información de historial de vida</p>
                  </div>
                );
              })()}
            </section>

            <section className="detail-section">
              <h3>🏥 Salud</h3>
              {expedienteSeleccionado.salud ? (
                <div className="detail-grid">
                  <div>
                    <strong>Estado de Salud:</strong>{" "}
                    {expedienteSeleccionado.salud.estado_actual_salud ||
                      "No especificado"}
                  </div>
                  <div>
                    <strong>Esterilización:</strong>{" "}
                    {expedienteSeleccionado.salud.esterilizacion ||
                      "No especificado"}
                  </div>
                  <div>
                    <strong>Enfermedades Temporales:</strong>{" "}
                    {expedienteSeleccionado.salud.enfermedades_temporales ||
                      "Ninguna"}
                  </div>
                  <div>
                    <strong>Tratamientos Médicos:</strong>{" "}
                    {expedienteSeleccionado.salud.tratamientos_medicos ||
                      "Ninguno"}
                  </div>
                  <div>
                    <strong>Cirugías Anteriores:</strong>{" "}
                    {expedienteSeleccionado.salud.cirugias_anteriores ||
                      "Ninguna"}
                  </div>
                </div>
              ) : (
                <p>No hay información de salud</p>
              )}
            </section>

            <section className="detail-section">
              <h3>💉 Vacunas</h3>
              {expedienteSeleccionado.vacunas &&
              expedienteSeleccionado.vacunas.length > 0 ? (
                <div className="vacunas-list">
                  {expedienteSeleccionado.vacunas.map((vacuna, index) => (
                    <div key={index} className="vacuna-item">
                      <h5>Vacuna #{index + 1}</h5>
                      <div className="detail-grid">
                        <div>
                          <strong>Tipo:</strong> {vacuna.tipo_vacuna}
                        </div>
                        <div>
                          <strong>Producto:</strong> {vacuna.producto}
                        </div>
                        <div>
                          <strong>Fecha:</strong> {vacuna.fecha_vacuna}
                        </div>
                        <div>
                          <strong>Próxima Dosis:</strong>{" "}
                          {vacuna.proxima_dosis || "No especificada"}
                        </div>
                        <div>
                          <strong>Veterinario:</strong>{" "}
                          {vacuna.veterinario || "No especificado"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No hay registros de vacunas</p>
              )}
            </section>

            <section className="detail-section">
              <h3>💊 Desparasitaciones</h3>
              {expedienteSeleccionado.desparasitaciones &&
              expedienteSeleccionado.desparasitaciones.length > 0 ? (
                <div className="desparasitaciones-list">
                  {expedienteSeleccionado.desparasitaciones.map(
                    (desparasitacion, index) => (
                      <div key={index} className="desparasitacion-item">
                        <h5>Desparasitación #{index + 1}</h5>
                        <div className="detail-grid">
                          <div>
                            <strong>Tipo:</strong> {desparasitacion.tipo}
                          </div>
                          <div>
                            <strong>Producto:</strong>{" "}
                            {desparasitacion.producto}
                          </div>
                          <div>
                            <strong>Fecha:</strong>{" "}
                            {desparasitacion.fecha_desparasitacion}
                          </div>
                          <div>
                            <strong>Próxima Aplicación:</strong>{" "}
                            {desparasitacion.proxima_aplicacion ||
                              "No especificada"}
                          </div>
                          <div>
                            <strong>Veterinario:</strong>{" "}
                            {desparasitacion.veterinario || "No especificado"}
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p>No hay registros de desparasitaciones</p>
              )}
            </section>

            <section className="detail-section">
              <h3>🧠 Comportamiento</h3>
              {expedienteSeleccionado.comportamiento ? (
                <div className="detail-grid">
                  <div>
                    <strong>Carácter General:</strong>{" "}
                    {expedienteSeleccionado.comportamiento.caracter_general ||
                      "No especificado"}
                  </div>
                  <div>
                    <strong>Compatibilidad con Niños:</strong>{" "}
                    {expedienteSeleccionado.comportamiento
                      .compatibilidad_ninos || "No especificado"}
                  </div>
                  <div>
                    <strong>Compatibilidad con Perros:</strong>{" "}
                    {expedienteSeleccionado.comportamiento
                      .compatibilidad_perros || "No especificado"}
                  </div>
                  <div>
                    <strong>Compatibilidad con Gatos:</strong>{" "}
                    {expedienteSeleccionado.comportamiento
                      .compatibilidad_gatos || "No especificado"}
                  </div>
                  <div>
                    <strong>Nivel de Energía:</strong>{" "}
                    {expedienteSeleccionado.comportamiento.nivel_energia ||
                      "No especificado"}
                  </div>
                  <div>
                    <strong>Entrenamiento:</strong>{" "}
                    {expedienteSeleccionado.comportamiento.entrenamiento ||
                      "No especificado"}
                  </div>
                </div>
              ) : (
                <p>No hay información de comportamiento</p>
              )}
            </section>

            <section className="detail-section">
              <h3>📋 Revisiones Clínicas</h3>
              {expedienteSeleccionado.revisiones &&
              expedienteSeleccionado.revisiones.length > 0 ? (
                <div className="revisiones-list">
                  {expedienteSeleccionado.revisiones.map((revision, index) => (
                    <div key={index} className="revision-item">
                      <h5>
                        Revisión #{index + 1} - {revision.tipo}
                      </h5>
                      <div className="detail-grid">
                        <div>
                          <strong>Fecha:</strong> {revision.fecha}
                        </div>
                        <div>
                          <strong>Motivo:</strong> {revision.motivo}
                        </div>
                        <div>
                          <strong>Diagnóstico:</strong>{" "}
                          {revision.diagnostico || "No especificado"}
                        </div>
                        <div>
                          <strong>Tratamiento:</strong>{" "}
                          {revision.tratamiento || "No especificado"}
                        </div>
                        <div>
                          <strong>Peso:</strong>{" "}
                          {revision.peso || "No registrado"}
                        </div>
                        <div>
                          <strong>Temperatura:</strong>{" "}
                          {revision.temperatura || "No registrada"}
                        </div>
                        <div>
                          <strong>Veterinario:</strong>{" "}
                          {revision.veterinario || "No especificado"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No hay revisiones clínicas registradas</p>
              )}
            </section>
          </div>
        </>
      )}

      {modo === "editar" && expedienteSeleccionado && (
        <>
          <div className="header-with-button">
            <h2>✏️ Actualizar Expediente de {expedienteSeleccionado.animal.nombre}</h2>
            <button onClick={() => setModo("detalle")}>⬅️ Volver al expediente</button>
          </div>

          <div className="editar-form">
            <div className="alert-info">
              <strong>💡 Información:</strong> Estás actualizando el expediente existente. 
              Los nuevos datos se agregarán a la información actual.
            </div>

            <form onSubmit={handleActualizarExpediente} className="expediente-form">
              <div className="form-section">
                <h3>🏥 Actualizar Salud</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Estado de Salud Actual:</label>
                    <select 
                      value={formDataActualizar.salud.estado_actual_salud}
                      onChange={(e) => handleInputChangeActualizar('salud', 'estado_actual_salud', e.target.value)}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="Excelente">Excelente</option>
                      <option value="Bueno">Bueno</option>
                      <option value="Regular">Regular</option>
                      <option value="Malo">Malo</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Esterilización:</label>
                    <select 
                      value={formDataActualizar.salud.esterilizacion}
                      onChange={(e) => handleInputChangeActualizar('salud', 'esterilizacion', e.target.value)}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="Si">Sí</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Enfermedades/Problemas Actuales:</label>
                  <textarea 
                    value={formDataActualizar.salud.enfermedades_temporales}
                    onChange={(e) => handleInputChangeActualizar('salud', 'enfermedades_temporales', e.target.value)}
                    rows="2"
                    placeholder="Describa cualquier enfermedad o problema de salud actual"
                  />
                </div>
                <div className="form-group">
                  <label>Tratamientos en Curso:</label>
                  <textarea 
                    value={formDataActualizar.salud.tratamientos_medicos}
                    onChange={(e) => handleInputChangeActualizar('salud', 'tratamientos_medicos', e.target.value)}
                    rows="2"
                    placeholder="Tratamientos médicos actuales"
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>💉 Agregar Nueva Vacuna</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Fecha Vacuna:</label>
                    <input 
                      type="date" 
                      value={formDataActualizar.nueva_vacuna.fecha_vacuna}
                      onChange={(e) => handleInputChangeActualizar('nueva_vacuna', 'fecha_vacuna', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Tipo Vacuna:</label>
                    <input 
                      type="text" 
                      value={formDataActualizar.nueva_vacuna.tipo_vacuna}
                      onChange={(e) => handleInputChangeActualizar('nueva_vacuna', 'tipo_vacuna', e.target.value)}
                      placeholder="Ej: Rabia, Moquillo, etc."
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Producto:</label>
                    <input 
                      type="text" 
                      value={formDataActualizar.nueva_vacuna.producto}
                      onChange={(e) => handleInputChangeActualizar('nueva_vacuna', 'producto', e.target.value)}
                      placeholder="Nombre del producto"
                    />
                  </div>
                  <div className="form-group">
                    <label>Próxima Dosis:</label>
                    <input 
                      type="date" 
                      value={formDataActualizar.nueva_vacuna.proxima_dosis}
                      onChange={(e) => handleInputChangeActualizar('nueva_vacuna', 'proxima_dosis', e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Veterinario:</label>
                  <input 
                    type="text" 
                    value={formDataActualizar.nueva_vacuna.veterinario}
                    onChange={(e) => handleInputChangeActualizar('nueva_vacuna', 'veterinario', e.target.value)}
                    placeholder="Nombre del veterinario"
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>💊 Agregar Nueva Desparasitación</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Fecha Desparasitación:</label>
                    <input 
                      type="date" 
                      value={formDataActualizar.nueva_desparasitacion.fecha_desparasitacion}
                      onChange={(e) => handleInputChangeActualizar('nueva_desparasitacion', 'fecha_desparasitacion', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Tipo:</label>
                    <select 
                      value={formDataActualizar.nueva_desparasitacion.tipo}
                      onChange={(e) => handleInputChangeActualizar('nueva_desparasitacion', 'tipo', e.target.value)}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="Interna">Interna</option>
                      <option value="Externa">Externa</option>
                      <option value="Combinada">Combinada</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Producto:</label>
                    <input 
                      type="text" 
                      value={formDataActualizar.nueva_desparasitacion.producto}
                      onChange={(e) => handleInputChangeActualizar('nueva_desparasitacion', 'producto', e.target.value)}
                      placeholder="Nombre del producto"
                    />
                  </div>
                  <div className="form-group">
                    <label>Próxima Aplicación:</label>
                    <input 
                      type="date" 
                      value={formDataActualizar.nueva_desparasitacion.proxima_aplicacion}
                      onChange={(e) => handleInputChangeActualizar('nueva_desparasitacion', 'proxima_aplicacion', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>📋 Agregar Nueva Revisión Clínica</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Fecha Revisión:</label>
                    <input 
                      type="date" 
                      value={formDataActualizar.nueva_revision.fecha}
                      onChange={(e) => handleInputChangeActualizar('nueva_revision', 'fecha', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Tipo:</label>
                    <select 
                      value={formDataActualizar.nueva_revision.tipo}
                      onChange={(e) => handleInputChangeActualizar('nueva_revision', 'tipo', e.target.value)}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="Consulta">Consulta</option>
                      <option value="Vacunación">Vacunación</option>
                      <option value="Desparasitación">Desparasitación</option>
                      <option value="Cirugía">Cirugía</option>
                      <option value="Emergencia">Emergencia</option>
                      <option value="Chequeo">Chequeo General</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Motivo:</label>
                  <textarea 
                    value={formDataActualizar.nueva_revision.motivo}
                    onChange={(e) => handleInputChangeActualizar('nueva_revision', 'motivo', e.target.value)}
                    rows="2"
                    placeholder="Motivo de la consulta o revisión"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Peso (kg):</label>
                    <input 
                      type="text" 
                      value={formDataActualizar.nueva_revision.peso}
                      onChange={(e) => handleInputChangeActualizar('nueva_revision', 'peso', e.target.value)}
                      placeholder="Ej: 5.2 kg"
                    />
                  </div>
                  <div className="form-group">
                    <label>Temperatura (°C):</label>
                    <input 
                      type="text" 
                      value={formDataActualizar.nueva_revision.temperatura}
                      onChange={(e) => handleInputChangeActualizar('nueva_revision', 'temperatura', e.target.value)}
                      placeholder="Ej: 38.5°C"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Diagnóstico/Observaciones:</label>
                  <textarea 
                    value={formDataActualizar.nueva_revision.diagnostico}
                    onChange={(e) => handleInputChangeActualizar('nueva_revision', 'diagnostico', e.target.value)}
                    rows="3"
                    placeholder="Diagnóstico y observaciones del veterinario"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-guardar">
                  💾 Guardar Actualizaciones
                </button>
                <button 
                  type="button" 
                  className="btn-cancelar"
                  onClick={() => setModo("detalle")}
                >
                  ❌ Cancelar
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {modo === "editarDesdeLista" && expedienteAEditar && (
        <>
          <div className="header-with-button">
            <h2>✏️ Editando Expediente de {expedienteAEditar.animal?.nombre}</h2>
            <button className="btn-cancelar" onClick={() => {
              setModo("lista");
              setExpedienteAEditar(null);
              resetearFormulario();
            }}>
              ↩️ Volver al listado
            </button>
          </div>

          <div className="alert-info">
            <strong>💡 Estás editando el expediente existente:</strong> 
            {expedienteAEditar.animal?.nombre} - {expedienteAEditar.animal?.especie} - {expedienteAEditar.animal?.raza}
            <br />
            <small>Puedes modificar cualquier campo y guardar los cambios.</small>
          </div>

          <form onSubmit={handleSubmit} className="expediente-form">
            <div className="form-section">
              <h3>🐾 Animal Seleccionado</h3>
              <div className="form-group">
                <label>Animal:</label>
                <input
                  type="text"
                  value={`${expedienteAEditar.animal?.nombre} - ${expedienteAEditar.animal?.especie} - ${expedienteAEditar.animal?.raza}`}
                  disabled
                  className="input-disabled"
                />
                <small style={{color: '#666', fontStyle: 'italic'}}>
                  No puedes cambiar el animal asociado al expediente
                </small>
              </div>
            </div>

            <div className="form-section">
              <h3>📖 Historial de Vida</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Origen:</label>
                  <input
                    type="text"
                    value={formData.historial_vida.origen}
                    onChange={(e) =>
                      handleInputChange(
                        "historial_vida",
                        "origen",
                        e.target.value
                      )
                    }
                    placeholder="Ej: Rescate, Donación, etc."
                  />
                </div>
                <div className="form-group">
                  <label>Dueños Previos:</label>
                  <input
                    type="number"
                    value={formData.historial_vida.cantidad_duenos_previos}
                    onChange={(e) =>
                      handleInputChange(
                        "historial_vida",
                        "cantidad_duenos_previos",
                        parseInt(e.target.value) || 0
                      )
                    }
                    min="0"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Situación Previa:</label>
                <textarea
                  value={formData.historial_vida.situacion_previa}
                  onChange={(e) =>
                    handleInputChange(
                      "historial_vida",
                      "situacion_previa",
                      e.target.value
                    )
                  }
                  rows="3"
                  placeholder="Describe la situación anterior del animal"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Último Dueño:</label>
                  <input
                    type="text"
                    value={formData.historial_vida.ultimo_dueno_nombre_completo}
                    onChange={(e) =>
                      handleInputChange(
                        "historial_vida",
                        "ultimo_dueno_nombre_completo",
                        e.target.value
                      )
                    }
                    placeholder="Nombre completo"
                  />
                </div>
                <div className="form-group">
                  <label>Teléfono Dueño:</label>
                  <input
                    type="tel"
                    value={formData.historial_vida.ultimo_dueno_telefono}
                    onChange={(e) =>
                      handleInputChange(
                        "historial_vida",
                        "ultimo_dueno_telefono",
                        e.target.value
                      )
                    }
                    placeholder="Número de teléfono"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>🏥 Salud</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Estado de Salud:</label>
                  <select
                    value={formData.salud.estado_actual_salud}
                    onChange={(e) =>
                      handleInputChange(
                        "salud",
                        "estado_actual_salud",
                        e.target.value
                      )
                    }
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Excelente">Excelente</option>
                    <option value="Bueno">Bueno</option>
                    <option value="Regular">Regular</option>
                    <option value="Malo">Malo</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Esterilización:</label>
                  <select
                    value={formData.salud.esterilizacion}
                    onChange={(e) =>
                      handleInputChange(
                        "salud",
                        "esterilizacion",
                        e.target.value
                      )
                    }
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Si">Sí</option>
                    <option value="No">No</option>
                  </select>
                </div>
                {formData.salud.esterilizacion === "Si" && (
                  <div className="form-group">
                    <label>Fecha Esterilización:</label>
                    <input
                      type="date"
                      value={formData.salud.fecha_esterilizacion}
                      onChange={(e) =>
                        handleInputChange(
                          "salud",
                          "fecha_esterilizacion",
                          e.target.value
                        )
                      }
                    />
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Enfermedades Temporales:</label>
                <textarea
                  value={formData.salud.enfermedades_temporales}
                  onChange={(e) =>
                    handleInputChange(
                      "salud",
                      "enfermedades_temporales",
                      e.target.value
                    )
                  }
                  rows="2"
                  placeholder="Enfermedades actuales o recientes"
                />
              </div>
              <div className="form-group">
                <label>Tratamientos Médicos:</label>
                <textarea
                  value={formData.salud.tratamientos_medicos}
                  onChange={(e) =>
                    handleInputChange(
                      "salud",
                      "tratamientos_medicos",
                      e.target.value
                    )
                  }
                  rows="2"
                  placeholder="Tratamientos en curso o recientes"
                />
              </div>
              <div className="form-group">
                <label>Cirugías Anteriores:</label>
                <textarea
                  value={formData.salud.cirugias_anteriores}
                  onChange={(e) =>
                    handleInputChange(
                      "salud",
                      "cirugias_anteriores",
                      e.target.value
                    )
                  }
                  rows="2"
                  placeholder="Cirugías previas realizadas"
                />
              </div>
            </div>

            <div className="form-section">
              <h3>💉 Vacunas</h3>
              {formData.vacunas.map((vacuna, index) => (
                <div key={index} className="subform-item">
                  <div className="subform-header">
                    <h4>Vacuna #{index + 1}</h4>
                    {formData.vacunas.length > 1 && (
                      <button
                        type="button"
                        className="btn-eliminar"
                        onClick={() => eliminarVacuna(index)}
                      >
                        🗑️ Eliminar
                      </button>
                    )}
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Fecha Vacuna:</label>
                      <input
                        type="date"
                        value={vacuna.fecha_vacuna}
                        onChange={(e) =>
                          handleInputChange(
                            "vacunas",
                            "fecha_vacuna",
                            e.target.value,
                            index
                          )
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Tipo Vacuna:</label>
                      <input
                        type="text"
                        value={vacuna.tipo_vacuna}
                        onChange={(e) =>
                          handleInputChange(
                            "vacunas",
                            "tipo_vacuna",
                            e.target.value,
                            index
                          )
                        }
                        placeholder="Ej: Rabia, Moquillo, etc."
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Producto:</label>
                      <input
                        type="text"
                        value={vacuna.producto}
                        onChange={(e) =>
                          handleInputChange(
                            "vacunas",
                            "producto",
                            e.target.value,
                            index
                          )
                        }
                        placeholder="Nombre del producto"
                      />
                    </div>
                    <div className="form-group">
                      <label>Lote:</label>
                      <input
                        type="text"
                        value={vacuna.lote}
                        onChange={(e) =>
                          handleInputChange(
                            "vacunas",
                            "lote",
                            e.target.value,
                            index
                          )
                        }
                        placeholder="Número de lote"
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Dosis:</label>
                      <input
                        type="text"
                        value={vacuna.dosis}
                        onChange={(e) =>
                          handleInputChange(
                            "vacunas",
                            "dosis",
                            e.target.value,
                            index
                          )
                        }
                        placeholder="Ej: 1ml, 0.5ml, etc."
                      />
                    </div>
                    <div className="form-group">
                      <label>Próxima Dosis:</label>
                      <input
                        type="date"
                        value={vacuna.proxima_dosis}
                        onChange={(e) =>
                          handleInputChange(
                            "vacunas",
                            "proxima_dosis",
                            e.target.value,
                            index
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Veterinario:</label>
                    <input
                      type="text"
                      value={vacuna.veterinario}
                      onChange={(e) =>
                        handleInputChange(
                          "vacunas",
                          "veterinario",
                          e.target.value,
                          index
                        )
                      }
                      placeholder="Nombre del veterinario"
                    />
                  </div>
                  <div className="form-group">
                    <label>Observaciones:</label>
                    <textarea
                      value={vacuna.observaciones}
                      onChange={(e) =>
                        handleInputChange(
                          "vacunas",
                          "observaciones",
                          e.target.value,
                          index
                        )
                      }
                      rows="2"
                      placeholder="Observaciones adicionales"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="btn-agregar"
                onClick={agregarVacuna}
              >
                ➕ Agregar otra vacuna
              </button>
            </div>

            <div className="form-section">
              <h3>💊 Desparasitaciones</h3>
              {formData.desparasitaciones.map((desparasitacion, index) => (
                <div key={index} className="subform-item">
                  <div className="subform-header">
                    <h4>Desparasitación #{index + 1}</h4>
                    {formData.desparasitaciones.length > 1 && (
                      <button
                        type="button"
                        className="btn-eliminar"
                        onClick={() => eliminarDesparasitacion(index)}
                      >
                        🗑️ Eliminar
                      </button>
                    )}
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Fecha Desparasitación:</label>
                      <input
                        type="date"
                        value={desparasitacion.fecha_desparasitacion}
                        onChange={(e) =>
                          handleInputChange(
                            "desparasitaciones",
                            "fecha_desparasitacion",
                            e.target.value,
                            index
                          )
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Tipo:</label>
                      <select
                        value={desparasitacion.tipo}
                        onChange={(e) =>
                          handleInputChange(
                            "desparasitaciones",
                            "tipo",
                            e.target.value,
                            index
                          )
                        }
                      >
                        <option value="">Seleccionar...</option>
                        <option value="Interna">Interna</option>
                        <option value="Externa">Externa</option>
                        <option value="Combinada">Combinada</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Producto:</label>
                      <input
                        type="text"
                        value={desparasitacion.producto}
                        onChange={(e) =>
                          handleInputChange(
                            "desparasitaciones",
                            "producto",
                            e.target.value,
                            index
                          )
                        }
                        placeholder="Nombre del producto"
                      />
                    </div>
                    <div className="form-group">
                      <label>Dosis:</label>
                      <input
                        type="text"
                        value={desparasitacion.dosis}
                        onChange={(e) =>
                          handleInputChange(
                            "desparasitaciones",
                            "dosis",
                            e.target.value,
                            index
                          )
                        }
                        placeholder="Ej: 1 tableta, 0.5ml, etc."
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Próxima Aplicación:</label>
                      <input
                        type="date"
                        value={desparasitacion.proxima_aplicacion}
                        onChange={(e) =>
                          handleInputChange(
                            "desparasitaciones",
                            "proxima_aplicacion",
                            e.target.value,
                            index
                          )
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Veterinario:</label>
                      <input
                        type="text"
                        value={desparasitacion.veterinario}
                        onChange={(e) =>
                          handleInputChange(
                            "desparasitaciones",
                            "veterinario",
                            e.target.value,
                            index
                          )
                        }
                        placeholder="Nombre del veterinario"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Observaciones:</label>
                    <textarea
                      value={desparasitacion.observaciones}
                      onChange={(e) =>
                        handleInputChange(
                          "desparasitaciones",
                          "observaciones",
                          e.target.value,
                          index
                        )
                      }
                      rows="2"
                      placeholder="Observaciones adicionales"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="btn-agregar"
                onClick={agregarDesparasitacion}
              >
                ➕ Agregar otra desparasitación
              </button>
            </div>

            <div className="form-section">
              <h3>🧠 Comportamiento</h3>
              <div className="form-group">
                <label>Carácter General:</label>
                <textarea
                  value={formData.comportamiento.caracter_general}
                  onChange={(e) =>
                    handleInputChange(
                      "comportamiento",
                      "caracter_general",
                      e.target.value
                    )
                  }
                  rows="3"
                  placeholder="Describe el carácter y personalidad del animal"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Compatibilidad con Niños:</label>
                  <select
                    value={formData.comportamiento.compatibilidad_ninos}
                    onChange={(e) =>
                      handleInputChange(
                        "comportamiento",
                        "compatibilidad_ninos",
                        e.target.value
                      )
                    }
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Excelente">Excelente</option>
                    <option value="Buena">Buena</option>
                    <option value="Regular">Regular</option>
                    <option value="Mala">Mala</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Compatibilidad con Perros:</label>
                  <select
                    value={formData.comportamiento.compatibilidad_perros}
                    onChange={(e) =>
                      handleInputChange(
                        "comportamiento",
                        "compatibilidad_perros",
                        e.target.value
                      )
                    }
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Excelente">Excelente</option>
                    <option value="Buena">Buena</option>
                    <option value="Regular">Regular</option>
                    <option value="Mala">Mala</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Compatibilidad con Gatos:</label>
                  <select
                    value={formData.comportamiento.compatibilidad_gatos}
                    onChange={(e) =>
                      handleInputChange(
                        "comportamiento",
                        "compatibilidad_gatos",
                        e.target.value
                      )
                    }
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Excelente">Excelente</option>
                    <option value="Buena">Buena</option>
                    <option value="Regular">Regular</option>
                    <option value="Mala">Mala</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Nivel de Energía:</label>
                  <select
                    value={formData.comportamiento.nivel_energia}
                    onChange={(e) =>
                      handleInputChange(
                        "comportamiento",
                        "nivel_energia",
                        e.target.value
                      )
                    }
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Bajo">Bajo</option>
                    <option value="Moderado">Moderado</option>
                    <option value="Alto">Alto</option>
                    <option value="Muy Alto">Muy Alto</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Entrenamiento:</label>
                  <textarea
                    value={formData.comportamiento.entrenamiento}
                    onChange={(e) =>
                      handleInputChange(
                        "comportamiento",
                        "entrenamiento",
                        e.target.value
                      )
                    }
                    rows="2"
                    placeholder="Nivel de entrenamiento y comandos que conoce"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>📋 Expediente Clínico</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Fecha:</label>
                  <input
                    type="date"
                    value={formData.expediente_clinico.fecha}
                    onChange={(e) =>
                      handleInputChange(
                        "expediente_clinico",
                        "fecha",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Tipo:</label>
                  <select
                    value={formData.expediente_clinico.tipo}
                    onChange={(e) =>
                      handleInputChange(
                        "expediente_clinico",
                        "tipo",
                        e.target.value
                      )
                    }
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Consulta">Consulta</option>
                    <option value="Vacunación">Vacunación</option>
                    <option value="Desparasitación">Desparasitación</option>
                    <option value="Cirugía">Cirugía</option>
                    <option value="Emergencia">Emergencia</option>
                    <option value="Chequeo">Chequeo General</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Motivo:</label>
                <textarea
                  value={formData.expediente_clinico.motivo}
                  onChange={(e) =>
                    handleInputChange(
                      "expediente_clinico",
                      "motivo",
                      e.target.value
                    )
                  }
                  rows="2"
                  placeholder="Motivo de la consulta o revisión"
                />
              </div>
              <div className="form-group">
                <label>Diagnóstico:</label>
                <textarea
                  value={formData.expediente_clinico.diagnostico}
                  onChange={(e) =>
                    handleInputChange(
                      "expediente_clinico",
                      "diagnostico",
                      e.target.value
                    )
                  }
                  rows="2"
                  placeholder="Diagnóstico médico"
                />
              </div>
              <div className="form-group">
                <label>Tratamiento:</label>
                <textarea
                  value={formData.expediente_clinico.tratamiento}
                  onChange={(e) =>
                    handleInputChange(
                      "expediente_clinico",
                      "tratamiento",
                      e.target.value
                    )
                  }
                  rows="2"
                  placeholder="Tratamiento prescrito"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Peso (kg):</label>
                  <input
                    type="text"
                    value={formData.expediente_clinico.peso}
                    onChange={(e) =>
                      handleInputChange(
                        "expediente_clinico",
                        "peso",
                        e.target.value
                      )
                    }
                    placeholder="Ej: 5.2 kg"
                  />
                </div>
                <div className="form-group">
                  <label>Temperatura (°C):</label>
                  <input
                    type="text"
                    value={formData.expediente_clinico.temperatura}
                    onChange={(e) =>
                      handleInputChange(
                        "expediente_clinico",
                        "temperatura",
                        e.target.value
                      )
                    }
                    placeholder="Ej: 38.5°C"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Veterinario:</label>
                <input
                  type="text"
                  value={formData.expediente_clinico.veterinario}
                  onChange={(e) =>
                    handleInputChange(
                      "expediente_clinico",
                      "veterinario",
                      e.target.value
                    )
                  }
                  placeholder="Nombre del veterinario"
                />
              </div>
              <div className="form-group">
                <label>Observaciones:</label>
                <textarea
                  value={formData.expediente_clinico.observaciones}
                  onChange={(e) =>
                    handleInputChange(
                      "expediente_clinico",
                      "observaciones",
                      e.target.value
                    )
                  }
                  rows="3"
                  placeholder="Observaciones adicionales del veterinario"
                />
              </div>
              <div className="form-group">
                <label>Próxima Revisión:</label>
                <input
                  type="date"
                  value={formData.expediente_clinico.fecha_proxima_revision}
                  onChange={(e) =>
                    handleInputChange(
                      "expediente_clinico",
                      "fecha_proxima_revision",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-guardar">
                💾 Guardar Cambios
              </button>
              <button
                type="button"
                className="btn-cancelar"
                onClick={() => {
                  setModo("lista");
                  setExpedienteAEditar(null);
                  resetearFormulario();
                }}
              >
                ❌ Cancelar
              </button>
            </div>
          </form>
        </>
      )}

      {modo === "nuevo" && (
        <>
          <div className="header-with-button">
            <h2>Crear Nuevo Expediente</h2>
            <button className="btn-cancelar" onClick={() => setModo("lista")}>
              ↩️ Volver al listado
            </button>
          </div>

          <form onSubmit={handleSubmit} className="expediente-form">
            <div className="form-section">
              <h3>🐾 Seleccionar Animal</h3>
              <div className="form-group">
                <label>Animal:</label>
                <select
                  value={animalSeleccionado}
                  onChange={(e) => setAnimalSeleccionado(e.target.value)}
                  required
                >
                  <option value="">
                    Selecciona un animal
                  </option>
                  {animales.map((animal) => (
                    <option key={animal.Id} value={animal.Id}>
                      {animal.nombre} - {animal.especie} - {animal.raza}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-section">
              <h3>📖 Historial de Vida</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Origen:</label>
                  <input
                    type="text"
                    value={formData.historial_vida.origen}
                    onChange={(e) =>
                      handleInputChange(
                        "historial_vida",
                        "origen",
                        e.target.value
                      )
                    }
                    placeholder="Ej: Rescate, Donación, etc."
                  />
                </div>
                <div className="form-group">
                  <label>Dueños Previos:</label>
                  <input
                    type="number"
                    value={formData.historial_vida.cantidad_duenos_previos}
                    onChange={(e) =>
                      handleInputChange(
                        "historial_vida",
                        "cantidad_duenos_previos",
                        parseInt(e.target.value) || 0
                      )
                    }
                    min="0"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Situación Previa:</label>
                <textarea
                  value={formData.historial_vida.situacion_previa}
                  onChange={(e) =>
                    handleInputChange(
                      "historial_vida",
                      "situacion_previa",
                      e.target.value
                    )
                  }
                  rows="3"
                  placeholder="Describe la situación anterior del animal"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Último Dueño:</label>
                  <input
                    type="text"
                    value={formData.historial_vida.ultimo_dueno_nombre_completo}
                    onChange={(e) =>
                      handleInputChange(
                        "historial_vida",
                        "ultimo_dueno_nombre_completo",
                        e.target.value
                      )
                    }
                    placeholder="Nombre completo"
                  />
                </div>
                <div className="form-group">
                  <label>Teléfono Dueño:</label>
                  <input
                    type="tel"
                    value={formData.historial_vida.ultimo_dueno_telefono}
                    onChange={(e) =>
                      handleInputChange(
                        "historial_vida",
                        "ultimo_dueno_telefono",
                        e.target.value
                      )
                    }
                    placeholder="Número de teléfono"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>🏥 Salud</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Estado de Salud:</label>
                  <select
                    value={formData.salud.estado_actual_salud}
                    onChange={(e) =>
                      handleInputChange(
                        "salud",
                        "estado_actual_salud",
                        e.target.value
                      )
                    }
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Excelente">Excelente</option>
                    <option value="Bueno">Bueno</option>
                    <option value="Regular">Regular</option>
                    <option value="Malo">Malo</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Esterilización:</label>
                  <select
                    value={formData.salud.esterilizacion}
                    onChange={(e) =>
                      handleInputChange(
                        "salud",
                        "esterilizacion",
                        e.target.value
                      )
                    }
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Si">Sí</option>
                    <option value="No">No</option>
                  </select>
                </div>
                {formData.salud.esterilizacion === "Si" && (
                  <div className="form-group">
                    <label>Fecha Esterilización:</label>
                    <input
                      type="date"
                      value={formData.salud.fecha_esterilizacion}
                      onChange={(e) =>
                        handleInputChange(
                          "salud",
                          "fecha_esterilizacion",
                          e.target.value
                        )
                      }
                    />
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Enfermedades Temporales:</label>
                <textarea
                  value={formData.salud.enfermedades_temporales}
                  onChange={(e) =>
                    handleInputChange(
                      "salud",
                      "enfermedades_temporales",
                      e.target.value
                    )
                  }
                  rows="2"
                  placeholder="Enfermedades actuales o recientes"
                />
              </div>
              <div className="form-group">
                <label>Tratamientos Médicos:</label>
                <textarea
                  value={formData.salud.tratamientos_medicos}
                  onChange={(e) =>
                    handleInputChange(
                      "salud",
                      "tratamientos_medicos",
                      e.target.value
                    )
                  }
                  rows="2"
                  placeholder="Tratamientos en curso o recientes"
                />
              </div>
              <div className="form-group">
                <label>Cirugías Anteriores:</label>
                <textarea
                  value={formData.salud.cirugias_anteriores}
                  onChange={(e) =>
                    handleInputChange(
                      "salud",
                      "cirugias_anteriores",
                      e.target.value
                    )
                  }
                  rows="2"
                  placeholder="Cirugías previas realizadas"
                />
              </div>
            </div>

            <div className="form-section">
              <h3>💉 Vacunas</h3>
              {formData.vacunas.map((vacuna, index) => (
                <div key={index} className="subform-item">
                  <div className="subform-header">
                    <h4>Vacuna #{index + 1}</h4>
                    {formData.vacunas.length > 1 && (
                      <button
                        type="button"
                        className="btn-eliminar"
                        onClick={() => eliminarVacuna(index)}
                      >
                        🗑️ Eliminar
                      </button>
                    )}
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Fecha Vacuna:</label>
                      <input
                        type="date"
                        value={vacuna.fecha_vacuna}
                        onChange={(e) =>
                          handleInputChange(
                            "vacunas",
                            "fecha_vacuna",
                            e.target.value,
                            index
                          )
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Tipo Vacuna:</label>
                      <input
                        type="text"
                        value={vacuna.tipo_vacuna}
                        onChange={(e) =>
                          handleInputChange(
                            "vacunas",
                            "tipo_vacuna",
                            e.target.value,
                            index
                          )
                        }
                        placeholder="Ej: Rabia, Moquillo, etc."
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Producto:</label>
                      <input
                        type="text"
                        value={vacuna.producto}
                        onChange={(e) =>
                          handleInputChange(
                            "vacunas",
                            "producto",
                            e.target.value,
                            index
                          )
                        }
                        placeholder="Nombre del producto"
                      />
                    </div>
                    <div className="form-group">
                      <label>Lote:</label>
                      <input
                        type="text"
                        value={vacuna.lote}
                        onChange={(e) =>
                          handleInputChange(
                            "vacunas",
                            "lote",
                            e.target.value,
                            index
                          )
                        }
                        placeholder="Número de lote"
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Dosis:</label>
                      <input
                        type="text"
                        value={vacuna.dosis}
                        onChange={(e) =>
                          handleInputChange(
                            "vacunas",
                            "dosis",
                            e.target.value,
                            index
                          )
                        }
                        placeholder="Ej: 1ml, 0.5ml, etc."
                      />
                    </div>
                    <div className="form-group">
                      <label>Próxima Dosis:</label>
                      <input
                        type="date"
                        value={vacuna.proxima_dosis}
                        onChange={(e) =>
                          handleInputChange(
                            "vacunas",
                            "proxima_dosis",
                            e.target.value,
                            index
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Veterinario:</label>
                    <input
                      type="text"
                      value={vacuna.veterinario}
                      onChange={(e) =>
                        handleInputChange(
                          "vacunas",
                          "veterinario",
                          e.target.value,
                          index
                        )
                      }
                      placeholder="Nombre del veterinario"
                    />
                  </div>
                  <div className="form-group">
                    <label>Observaciones:</label>
                    <textarea
                      value={vacuna.observaciones}
                      onChange={(e) =>
                        handleInputChange(
                          "vacunas",
                          "observaciones",
                          e.target.value,
                          index
                        )
                      }
                      rows="2"
                      placeholder="Observaciones adicionales"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="btn-agregar"
                onClick={agregarVacuna}
              >
                ➕ Agregar otra vacuna
              </button>
            </div>

            <div className="form-section">
              <h3>💊 Desparasitaciones</h3>
              {formData.desparasitaciones.map((desparasitacion, index) => (
                <div key={index} className="subform-item">
                  <div className="subform-header">
                    <h4>Desparasitación #{index + 1}</h4>
                    {formData.desparasitaciones.length > 1 && (
                      <button
                        type="button"
                        className="btn-eliminar"
                        onClick={() => eliminarDesparasitacion(index)}
                      >
                        🗑️ Eliminar
                      </button>
                    )}
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Fecha Desparasitación:</label>
                      <input
                        type="date"
                        value={desparasitacion.fecha_desparasitacion}
                        onChange={(e) =>
                          handleInputChange(
                            "desparasitaciones",
                            "fecha_desparasitacion",
                            e.target.value,
                            index
                          )
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Tipo:</label>
                      <select
                        value={desparasitacion.tipo}
                        onChange={(e) =>
                          handleInputChange(
                            "desparasitaciones",
                            "tipo",
                            e.target.value,
                            index
                          )
                        }
                      >
                        <option value="">Seleccionar...</option>
                        <option value="Interna">Interna</option>
                        <option value="Externa">Externa</option>
                        <option value="Combinada">Combinada</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Producto:</label>
                      <input
                        type="text"
                        value={desparasitacion.producto}
                        onChange={(e) =>
                          handleInputChange(
                            "desparasitaciones",
                            "producto",
                            e.target.value,
                            index
                          )
                        }
                        placeholder="Nombre del producto"
                      />
                    </div>
                    <div className="form-group">
                      <label>Dosis:</label>
                      <input
                        type="text"
                        value={desparasitacion.dosis}
                        onChange={(e) =>
                          handleInputChange(
                            "desparasitaciones",
                            "dosis",
                            e.target.value,
                            index
                          )
                        }
                        placeholder="Ej: 1 tableta, 0.5ml, etc."
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Próxima Aplicación:</label>
                      <input
                        type="date"
                        value={desparasitacion.proxima_aplicacion}
                        onChange={(e) =>
                          handleInputChange(
                            "desparasitaciones",
                            "proxima_aplicacion",
                            e.target.value,
                            index
                          )
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Veterinario:</label>
                      <input
                        type="text"
                        value={desparasitacion.veterinario}
                        onChange={(e) =>
                          handleInputChange(
                            "desparasitaciones",
                            "veterinario",
                            e.target.value,
                            index
                          )
                        }
                        placeholder="Nombre del veterinario"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Observaciones:</label>
                    <textarea
                      value={desparasitacion.observaciones}
                      onChange={(e) =>
                        handleInputChange(
                          "desparasitaciones",
                          "observaciones",
                          e.target.value,
                          index
                        )
                      }
                      rows="2"
                      placeholder="Observaciones adicionales"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="btn-agregar"
                onClick={agregarDesparasitacion}
              >
                ➕ Agregar otra desparasitación
              </button>
            </div>

            <div className="form-section">
              <h3>🧠 Comportamiento</h3>
              <div className="form-group">
                <label>Carácter General:</label>
                <textarea
                  value={formData.comportamiento.caracter_general}
                  onChange={(e) =>
                    handleInputChange(
                      "comportamiento",
                      "caracter_general",
                      e.target.value
                    )
                  }
                  rows="3"
                  placeholder="Describe el carácter y personalidad del animal"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Compatibilidad con Niños:</label>
                  <select
                    value={formData.comportamiento.compatibilidad_ninos}
                    onChange={(e) =>
                      handleInputChange(
                        "comportamiento",
                        "compatibilidad_ninos",
                        e.target.value
                      )
                    }
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Excelente">Excelente</option>
                    <option value="Buena">Buena</option>
                    <option value="Regular">Regular</option>
                    <option value="Mala">Mala</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Compatibilidad con Perros:</label>
                  <select
                    value={formData.comportamiento.compatibilidad_perros}
                    onChange={(e) =>
                      handleInputChange(
                        "comportamiento",
                        "compatibilidad_perros",
                        e.target.value
                      )
                    }
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Excelente">Excelente</option>
                    <option value="Buena">Buena</option>
                    <option value="Regular">Regular</option>
                    <option value="Mala">Mala</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Compatibilidad con Gatos:</label>
                  <select
                    value={formData.comportamiento.compatibilidad_gatos}
                    onChange={(e) =>
                      handleInputChange(
                        "comportamiento",
                        "compatibilidad_gatos",
                        e.target.value
                      )
                    }
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Excelente">Excelente</option>
                    <option value="Buena">Buena</option>
                    <option value="Regular">Regular</option>
                    <option value="Mala">Mala</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Nivel de Energía:</label>
                  <select
                    value={formData.comportamiento.nivel_energia}
                    onChange={(e) =>
                      handleInputChange(
                        "comportamiento",
                        "nivel_energia",
                        e.target.value
                      )
                    }
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Bajo">Bajo</option>
                    <option value="Moderado">Moderado</option>
                    <option value="Alto">Alto</option>
                    <option value="Muy Alto">Muy Alto</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Entrenamiento:</label>
                  <textarea
                    value={formData.comportamiento.entrenamiento}
                    onChange={(e) =>
                      handleInputChange(
                        "comportamiento",
                        "entrenamiento",
                        e.target.value
                      )
                    }
                    rows="2"
                    placeholder="Nivel de entrenamiento y comandos que conoce"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>📋 Expediente Clínico</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Fecha:</label>
                  <input
                    type="date"
                    value={formData.expediente_clinico.fecha}
                    onChange={(e) =>
                      handleInputChange(
                        "expediente_clinico",
                        "fecha",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Tipo:</label>
                  <select
                    value={formData.expediente_clinico.tipo}
                    onChange={(e) =>
                      handleInputChange(
                        "expediente_clinico",
                        "tipo",
                        e.target.value
                      )
                    }
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Consulta">Consulta</option>
                    <option value="Vacunación">Vacunación</option>
                    <option value="Desparasitación">Desparasitación</option>
                    <option value="Cirugía">Cirugía</option>
                    <option value="Emergencia">Emergencia</option>
                    <option value="Chequeo">Chequeo General</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Motivo:</label>
                <textarea
                  value={formData.expediente_clinico.motivo}
                  onChange={(e) =>
                    handleInputChange(
                      "expediente_clinico",
                      "motivo",
                      e.target.value
                    )
                  }
                  rows="2"
                  placeholder="Motivo de la consulta o revisión"
                />
              </div>
              <div className="form-group">
                <label>Diagnóstico:</label>
                <textarea
                  value={formData.expediente_clinico.diagnostico}
                  onChange={(e) =>
                    handleInputChange(
                      "expediente_clinico",
                      "diagnostico",
                      e.target.value
                    )
                  }
                  rows="2"
                  placeholder="Diagnóstico médico"
                />
              </div>
              <div className="form-group">
                <label>Tratamiento:</label>
                <textarea
                  value={formData.expediente_clinico.tratamiento}
                  onChange={(e) =>
                    handleInputChange(
                      "expediente_clinico",
                      "tratamiento",
                      e.target.value
                    )
                  }
                  rows="2"
                  placeholder="Tratamiento prescrito"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Peso (kg):</label>
                  <input
                    type="text"
                    value={formData.expediente_clinico.peso}
                    onChange={(e) =>
                      handleInputChange(
                        "expediente_clinico",
                        "peso",
                        e.target.value
                      )
                    }
                    placeholder="Ej: 5.2 kg"
                  />
                </div>
                <div className="form-group">
                  <label>Temperatura (°C):</label>
                  <input
                    type="text"
                    value={formData.expediente_clinico.temperatura}
                    onChange={(e) =>
                      handleInputChange(
                        "expediente_clinico",
                        "temperatura",
                        e.target.value
                      )
                    }
                    placeholder="Ej: 38.5°C"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Veterinario:</label>
                <input
                  type="text"
                  value={formData.expediente_clinico.veterinario}
                  onChange={(e) =>
                    handleInputChange(
                      "expediente_clinico",
                      "veterinario",
                      e.target.value
                    )
                  }
                  placeholder="Nombre del veterinario"
                />
              </div>
              <div className="form-group">
                <label>Observaciones:</label>
                <textarea
                  value={formData.expediente_clinico.observaciones}
                  onChange={(e) =>
                    handleInputChange(
                      "expediente_clinico",
                      "observaciones",
                      e.target.value
                    )
                  }
                  rows="3"
                  placeholder="Observaciones adicionales del veterinario"
                />
              </div>
              <div className="form-group">
                <label>Próxima Revisión:</label>
                <input
                  type="date"
                  value={formData.expediente_clinico.fecha_proxima_revision}
                  onChange={(e) =>
                    handleInputChange(
                      "expediente_clinico",
                      "fecha_proxima_revision",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-guardar">
                💾 Guardar Expediente Completo
              </button>
              <button
                type="button"
                className="btn-cancelar"
                onClick={() => setModo("lista")}
              >
                ❌ Cancelar
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default Expediente;