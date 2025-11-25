// src/pages/Solicitud.js
import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/solicitud.css";

function Solicitud() {
  const [animales, setAnimales] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [seccionActual, setSeccionActual] = useState(1);
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });

  const initialFormData = {
    // Datos principales de solicitud
    usuario_id: "",
    animal_id: "",
    
    // Vivienda
    tipo_vivienda: "",
    es_alquilada: false,
    tiene_permiso_escrito: false,
    
    // Hogar y Familia
    vive_solo: false,
    vive_con_adultos: false,
    vive_con_ninos_menores_5: false,
    vive_con_ninos_6_12: false,
    vive_con_adolescentes: false,
    vive_con_adultos_mayores: false,
    vive_con_otras_mascotas: false,
    tipos_mascotas_actuales: "",
    horas_solo_al_dia: "",
    responsable_principal: "",
    
    // Experiencia y Motivación
    motivo_adopcion: "",
    ha_tenido_mascotas: false,
    detalle_mascotas_anteriores: "",
    tipo_mascotas_anteriores: "",
    preparado_compromiso_largo_plazo: "",
    
    // Compromiso Económico
    actitud_gastos_veterinarios: "",
    dispuesto_esterilizar: "",
    presupuesto_mensual_estimado: "",
    
    // Preferencia de Animal
    tipo_animal_preferido: "",
    
    // Datos Adopción Perros
    frecuencia_paseos: "",
    duracion_paseos: "",
    nivel_energia_preferido: "",
    disposicion_entrenamiento: "",
    plan_socializacion: "",
    conocimiento_higiene_perros: "",
    frecuencia_bano_cepillado: "",
    manejo_muda_pelaje: "",
    conocimiento_cuidado_dental_perros: "",
    
    // Datos Adopción Gatos
    ventanas_protegidas: "",
    adaptacion_hogar: "",
    conocimiento_higiene_gatos: "",
    frecuencia_limpieza_arenero: "",
    manejo_cuidado_pelaje_gatos: "",
    conocimiento_higiene_dental_gatos: "",
    personalidad_preferida: "",
    plan_enriquecimiento: "",
    tipo_alimentacion: "",
    considera_desungulacion: false
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    axios.get("http://localhost:3001/animales")
      .then(res => setAnimales(res.data))
      .catch(err => console.error("Error al obtener animales:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox") {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (name === "animal_id") {
      const animal = animales.find(a => a.id === parseInt(value));
      setSelectedAnimal(animal || null);
    }
  };

  const siguiente = () => {
    setSeccionActual(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  const anterior = () => {
    setSeccionActual(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.animal_id) {
      setMensaje({ texto: "Selecciona un animal", tipo: "error" });
      setMostrarMensaje(true);
      setTimeout(() => setMostrarMensaje(false), 3000);
      return;
    }

    const userId = 1; // TODO: Reemplazar con el ID real del usuario logueado

    // Preparar datos en el formato que espera el backend
    const dataEnviar = {
      // Solicitud principal
      usuario_id: userId,
      animal_id: parseInt(formData.animal_id),
      
      // Vivienda (tabla: vivienda_adoptante)
      vivienda: {
        tipo_vivienda: formData.tipo_vivienda,
        es_alquilada: formData.es_alquilada ? 1 : 0,
        tiene_permiso_escrito: formData.tiene_permiso_escrito ? 1 : 0
      },
      
      // Hogar y Familia (tabla: hogar_familia)
      hogar: {
        vive_solo: formData.vive_solo ? 1 : 0,
        vive_con_adultos: formData.vive_con_adultos ? 1 : 0,
        vive_con_ninos_menores_5: formData.vive_con_ninos_menores_5 ? 1 : 0,
        vive_con_ninos_6_12: formData.vive_con_ninos_6_12 ? 1 : 0,
        vive_con_adolescentes: formData.vive_con_adolescentes ? 1 : 0,
        vive_con_adultos_mayores: formData.vive_con_adultos_mayores ? 1 : 0,
        vive_con_otras_mascotas: formData.vive_con_otras_mascotas ? 1 : 0,
        tipos_mascotas_actuales: formData.tipos_mascotas_actuales || null,
        horas_solo_al_dia: formData.horas_solo_al_dia,
        responsable_principal: formData.responsable_principal
      },
      
      // Experiencia y Motivación (tabla: experiencia_motivacion)
      experiencia: {
        motivo_adopcion: formData.motivo_adopcion,
        ha_tenido_mascotas: formData.ha_tenido_mascotas ? 1 : 0,
        detalle_mascotas_anteriores: formData.detalle_mascotas_anteriores || null,
        tipo_mascotas_anteriores: formData.tipo_mascotas_anteriores || null,
        preparado_compromiso_largo_plazo: formData.preparado_compromiso_largo_plazo
      },
      
      // Compromiso Económico (tabla: compromiso_economico)
      economico: {
        actitud_gastos_veterinarios: formData.actitud_gastos_veterinarios,
        dispuesto_esterilizar: formData.dispuesto_esterilizar,
        presupuesto_mensual_estimado: parseFloat(formData.presupuesto_mensual_estimado) || 0
      },
      
      // Preferencia de Animal (tabla: preferencia_animal)
      preferencia: {
        tipo_animal: formData.tipo_animal_preferido
      },
      
      // Datos Adopción Perros (tabla: datos_adopcion_perros)
      // Solo si seleccionó Perro o Sin Preferencia
      perros: (formData.tipo_animal_preferido === "Perro" || formData.tipo_animal_preferido === "Sin Preferencia") ? {
        frecuencia_paseos: formData.frecuencia_paseos || null,
        duracion_paseos: formData.duracion_paseos || null,
        nivel_energia_preferido: formData.nivel_energia_preferido || null,
        disposicion_entrenamiento: formData.disposicion_entrenamiento || null,
        plan_socializacion: formData.plan_socializacion || null,
        conocimiento_higiene: formData.conocimiento_higiene_perros || null,
        frecuencia_bano_cepillado: formData.frecuencia_bano_cepillado || null,
        manejo_muda_pelaje: formData.manejo_muda_pelaje || null,
        conocimiento_cuidado_dental: formData.conocimiento_cuidado_dental_perros || null
      } : null,
      
      // Datos Adopción Gatos (tabla: datos_adopcion_gatos)
      // Solo si seleccionó Gato o Sin Preferencia
      gatos: (formData.tipo_animal_preferido === "Gato" || formData.tipo_animal_preferido === "Sin Preferencia") ? {
        ventanas_protegidas: formData.ventanas_protegidas || null,
        adaptacion_hogar: formData.adaptacion_hogar || null,
        conocimiento_higiene: formData.conocimiento_higiene_gatos || null,
        frecuencia_limpieza_arenero: formData.frecuencia_limpieza_arenero || null,
        manejo_cuidado_pelaje: formData.manejo_cuidado_pelaje_gatos || null,
        conocimiento_higiene_dental: formData.conocimiento_higiene_dental_gatos || null,
        personalidad_preferida: formData.personalidad_preferida || null,
        plan_enriquecimiento: formData.plan_enriquecimiento || null,
        tipo_alimentacion: formData.tipo_alimentacion || null,
        considera_desungulacion: formData.considera_desungulacion ? 1 : 0
      } : null
    };

    try {
      const response = await axios.post("http://localhost:3001/adopcion/crear", dataEnviar);
      console.log("Respuesta del servidor:", response.data);
      
      setMensaje({ texto: "Solicitud enviada con éxito", tipo: "exito" });
      setMostrarMensaje(true);
      setFormData(initialFormData);
      setSelectedAnimal(null);
      setSeccionActual(1);
      setTimeout(() => setMostrarMensaje(false), 3000);
    } catch (err) {
      console.error("Error al enviar la solicitud:", err);
      const errorMsg = err.response?.data?.message || "Error al enviar la solicitud";
      setMensaje({ texto: errorMsg, tipo: "error" });
      setMostrarMensaje(true);
      setTimeout(() => setMostrarMensaje(false), 3000);
    }
  };

  return (
    <div className="solicitud-container min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="solicitud-card max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-8 relative">
        {mostrarMensaje && (
          <div className={`mensaje-emergente ${mensaje.tipo === "exito" ? "bg-green-500" : "bg-red-500"} text-white px-4 py-2 rounded absolute top-4 left-1/2 transform -translate-x-1/2 z-50`}>
            {mensaje.texto}
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Solicitud de Adopción</h2>
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-gray-600">Sección {seccionActual} de 6</span>
            <div className="flex-1 mx-4 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 transition-all duration-300"
                style={{ width: `${(seccionActual / 6) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Sección 1: Selección de Animal */}
          {seccionActual === 1 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">Selección de Mascota</h3>
              
              <div>
                <label className="block mb-2 font-semibold">Selecciona un Animal: <span className="text-red-500">*</span></label>
                <select 
                  name="animal_id" 
                  value={formData.animal_id} 
                  onChange={handleChange} 
                  className="w-full border p-2 rounded"
                  required
                >
                  <option value="">-- Selecciona --</option>
                  {animales.filter(a => a.estatus === 'En Adopción').map(animal => (
                    <option key={animal.id} value={animal.id}>
                      {animal.nombre} - {animal.especie} ({animal.raza})
                    </option>
                  ))}
                </select>
                {selectedAnimal && (
                  <div className="mt-3 p-3 bg-blue-50 rounded">
                    <p className="text-gray-700">
                      <strong>Seleccionado:</strong> {selectedAnimal.nombre}<br/>
                      <strong>Especie:</strong> {selectedAnimal.especie}<br/>
                      <strong>Raza:</strong> {selectedAnimal.raza}<br/>
                      <strong>Tamaño:</strong> {selectedAnimal.tamaño}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block mb-2 font-semibold">¿Qué tipo de animal prefieres? <span className="text-red-500">*</span></label>
                <select 
                  name="tipo_animal_preferido" 
                  value={formData.tipo_animal_preferido} 
                  onChange={handleChange} 
                  className="w-full border p-2 rounded"
                  required
                >
                  <option value="">-- Selecciona --</option>
                  <option value="Perro">Perro</option>
                  <option value="Gato">Gato</option>
                  <option value="Sin Preferencia">Sin Preferencia</option>
                </select>
              </div>
            </div>
          )}

          {/* Sección 2: Información sobre la Vivienda */}
          {seccionActual === 2 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">Información sobre la Vivienda</h3>
              
              <div>
                <label className="block mb-2 font-semibold">Tipo de vivienda: <span className="text-red-500">*</span></label>
                <select 
                  name="tipo_vivienda" 
                  value={formData.tipo_vivienda} 
                  onChange={handleChange} 
                  className="w-full border p-2 rounded"
                  required
                >
                  <option value="">-- Selecciona --</option>
                  <option value="Casa Patio Grande">Casa con Patio Grande</option>
                  <option value="Casa Patio Pequeño">Casa con Patio Pequeño</option>
                  <option value="Depto Grande">Departamento Grande</option>
                  <option value="Depto Pequeño">Departamento Pequeño</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    name="es_alquilada" 
                    checked={formData.es_alquilada} 
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <span className="font-semibold">La vivienda es alquilada</span>
                </label>
              </div>

              {formData.es_alquilada && (
                <div>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      name="tiene_permiso_escrito" 
                      checked={formData.tiene_permiso_escrito} 
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <span className="font-semibold">Cuento con permiso escrito del propietario</span>
                  </label>
                </div>
              )}
            </div>
          )}

          {/* Sección 3: Hogar y Familia */}
          {seccionActual === 3 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">Hogar y Familia</h3>
              
              <div className="space-y-2">
                <p className="font-semibold mb-2">¿Con quién vives? (Selecciona todas las que apliquen)</p>
                
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    name="vive_solo" 
                    checked={formData.vive_solo} 
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <span>Vivo solo/a</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    name="vive_con_adultos" 
                    checked={formData.vive_con_adultos} 
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <span>Con otros adultos</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    name="vive_con_ninos_menores_5" 
                    checked={formData.vive_con_ninos_menores_5} 
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <span>Con niños menores de 5 años</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    name="vive_con_ninos_6_12" 
                    checked={formData.vive_con_ninos_6_12} 
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <span>Con niños de 6 a 12 años</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    name="vive_con_adolescentes" 
                    checked={formData.vive_con_adolescentes} 
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <span>Con adolescentes (13-17 años)</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    name="vive_con_adultos_mayores" 
                    checked={formData.vive_con_adultos_mayores} 
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <span>Con adultos mayores</span>
                </label>
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    name="vive_con_otras_mascotas" 
                    checked={formData.vive_con_otras_mascotas} 
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <span className="font-semibold">Tengo otras mascotas actualmente</span>
                </label>
              </div>

              {formData.vive_con_otras_mascotas && (
                <div>
                  <label className="block mb-2 font-semibold">¿Qué tipo de mascotas tienes?</label>
                  <input 
                    type="text" 
                    name="tipos_mascotas_actuales" 
                    value={formData.tipos_mascotas_actuales} 
                    onChange={handleChange}
                    placeholder="Ej: 2 perros, 1 gato"
                    className="w-full border p-2 rounded"
                  />
                </div>
              )}

              <div>
                <label className="block mb-2 font-semibold">¿Cuántas horas estará solo el animal al día? <span className="text-red-500">*</span></label>
                <select 
                  name="horas_solo_al_dia" 
                  value={formData.horas_solo_al_dia} 
                  onChange={handleChange} 
                  className="w-full border p-2 rounded"
                  required
                >
                  <option value="">-- Selecciona --</option>
                  <option value="0-2 horas">0-2 horas</option>
                  <option value="3-4 horas">3-4 horas</option>
                  <option value="5-6 horas">5-6 horas</option>
                  <option value="7-8 horas">7-8 horas</option>
                  <option value="Más de 8 horas">Más de 8 horas</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-semibold">¿Quién será el responsable principal del cuidado? <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="responsable_principal" 
                  value={formData.responsable_principal} 
                  onChange={handleChange}
                  placeholder="Nombre de la persona"
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
            </div>
          )}

          {/* Sección 4: Experiencia y Motivación */}
          {seccionActual === 4 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">Experiencia y Motivación</h3>
              
              <div>
                <label className="block mb-2 font-semibold">¿Por qué quieres adoptar una mascota? <span className="text-red-500">*</span></label>
                <textarea 
                  name="motivo_adopcion" 
                  value={formData.motivo_adopcion} 
                  onChange={handleChange}
                  placeholder="Explica tus razones..."
                  className="w-full border p-2 rounded h-24"
                  required
                />
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    name="ha_tenido_mascotas" 
                    checked={formData.ha_tenido_mascotas} 
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <span className="font-semibold">He tenido mascotas anteriormente</span>
                </label>
              </div>

              {formData.ha_tenido_mascotas && (
                <>
                  <div>
                    <label className="block mb-2 font-semibold">¿Qué tipo de mascotas has tenido?</label>
                    <input 
                      type="text" 
                      name="tipo_mascotas_anteriores" 
                      value={formData.tipo_mascotas_anteriores} 
                      onChange={handleChange}
                      placeholder="Ej: Perros, Gatos"
                      className="w-full border p-2 rounded"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold">Detalla tu experiencia con mascotas:</label>
                    <textarea 
                      name="detalle_mascotas_anteriores" 
                      value={formData.detalle_mascotas_anteriores} 
                      onChange={handleChange}
                      placeholder="Cuéntanos sobre tus mascotas anteriores..."
                      className="w-full border p-2 rounded h-24"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block mb-2 font-semibold">¿Estás preparado para un compromiso de largo plazo (10-15 años)? <span className="text-red-500">*</span></label>
                <select 
                  name="preparado_compromiso_largo_plazo" 
                  value={formData.preparado_compromiso_largo_plazo} 
                  onChange={handleChange} 
                  className="w-full border p-2 rounded"
                  required
                >
                  <option value="">-- Selecciona --</option>
                  <option value="Completamente preparado">Completamente preparado</option>
                  <option value="Preparado">Preparado</option>
                  <option value="Algo preparado">Algo preparado</option>
                  <option value="No estoy seguro">No estoy seguro</option>
                </select>
              </div>
            </div>
          )}

          {/* Sección 5: Compromiso Económico */}
          {seccionActual === 5 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">Compromiso Económico</h3>
              
              <div>
                <label className="block mb-2 font-semibold">¿Cuál es tu actitud hacia los gastos veterinarios? <span className="text-red-500">*</span></label>
                <select 
                  name="actitud_gastos_veterinarios" 
                  value={formData.actitud_gastos_veterinarios} 
                  onChange={handleChange} 
                  className="w-full border p-2 rounded"
                  required
                >
                  <option value="">-- Selecciona --</option>
                  <option value="Dispuesto a cualquier costo necesario">Dispuesto a cualquier costo necesario</option>
                  <option value="Dispuesto dentro de lo razonable">Dispuesto dentro de lo razonable</option>
                  <option value="Solo gastos básicos">Solo gastos básicos</option>
                  <option value="Preocupado por los costos">Preocupado por los costos</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-semibold">¿Estás dispuesto a esterilizar a la mascota? <span className="text-red-500">*</span></label>
                <select 
                  name="dispuesto_esterilizar" 
                  value={formData.dispuesto_esterilizar} 
                  onChange={handleChange} 
                  className="w-full border p-2 rounded"
                  required
                >
                  <option value="">-- Selecciona --</option>
                  <option value="Sí, definitivamente">Sí, definitivamente</option>
                  <option value="Sí, si es necesario">Sí, si es necesario</option>
                  <option value="No estoy seguro">No estoy seguro</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-semibold">Presupuesto mensual estimado para la mascota (MXN): <span className="text-red-500">*</span></label>
                <input 
                  type="number" 
                  name="presupuesto_mensual_estimado" 
                  value={formData.presupuesto_mensual_estimado} 
                  onChange={handleChange}
                  placeholder="Ej: 1500"
                  className="w-full border p-2 rounded"
                  min="0"
                  step="0.01"
                  required
                />
                <p className="text-sm text-gray-600 mt-1">
                  Considera: alimento, veterinario, productos de higiene, juguetes, etc.
                </p>
              </div>
            </div>
          )}

          {/* Sección 6: Información Específica según el tipo de animal */}
          {seccionActual === 6 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">
                Información Específica
              </h3>
              
              {(formData.tipo_animal_preferido === "Perro" || formData.tipo_animal_preferido === "Sin Preferencia") && (
                <div className="border p-4 rounded bg-blue-50 space-y-4">
                  <h4 className="font-semibold text-lg">Cuidado de Perros</h4>
                  
                  <div>
                    <label className="block mb-2 font-semibold">¿Con qué frecuencia lo sacarías a pasear?</label>
                    <select 
                      name="frecuencia_paseos" 
                      value={formData.frecuencia_paseos} 
                      onChange={handleChange} 
                      className="w-full border p-2 rounded"
                    >
                      <option value="">-- Selecciona --</option>
                      <option value="3+ veces al día">3 o más veces al día</option>
                      <option value="2 veces al día">2 veces al día</option>
                      <option value="1 vez al día">1 vez al día</option>
                      <option value="Ocasionalmente">Ocasionalmente</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold">Duración típica de los paseos:</label>
                    <select 
                      name="duracion_paseos" 
                      value={formData.duracion_paseos} 
                      onChange={handleChange} 
                      className="w-full border p-2 rounded"
                    >
                      <option value="">-- Selecciona --</option>
                      <option value="Más de 1 hora">Más de 1 hora</option>
                      <option value="30-60 minutos">30-60 minutos</option>
                      <option value="15-30 minutos">15-30 minutos</option>
                      <option value="Menos de 15 minutos">Menos de 15 minutos</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold">Nivel de energía preferido:</label>
                    <select 
                      name="nivel_energia_preferido" 
                      value={formData.nivel_energia_preferido} 
                      onChange={handleChange} 
                      className="w-full border p-2 rounded"
                    >
                      <option value="">-- Selecciona --</option>
                      <option value="Muy Alto">Muy Alto (Deportista)</option>
                      <option value="Alto">Alto (Activo)</option>
                      <option value="Medio">Medio (Moderado)</option>
                      <option value="Bajo">Bajo (Tranquilo)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold">Disposición para entrenamiento:</label>
                    <select 
                      name="disposicion_entrenamiento" 
                      value={formData.disposicion_entrenamiento} 
                      onChange={handleChange} 
                      className="w-full border p-2 rounded"
                    >
                      <option value="">-- Selecciona --</option>
                      <option value="Muy dispuesto">Muy dispuesto (clases profesionales)</option>
                      <option value="Dispuesto">Dispuesto (entrenamiento en casa)</option>
                      <option value="Algo dispuesto">Algo dispuesto (básico)</option>
                      <option value="Poco dispuesto">Poco dispuesto</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold">Plan de socialización:</label>
                    <input 
                      type="text" 
                      name="plan_socializacion" 
                      value={formData.plan_socializacion} 
                      onChange={handleChange}
                      placeholder="Ej: Parques, otros perros"
                      className="w-full border p-2 rounded"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold">Conocimiento sobre higiene:</label>
                    <select 
                      name="conocimiento_higiene_perros" 
                      value={formData.conocimiento_higiene_perros} 
                      onChange={handleChange} 
                      className="w-full border p-2 rounded"
                    >
                      <option value="">-- Selecciona --</option>
                      <option value="Experto">Experto</option>
                      <option value="Bueno">Bueno</option>
                      <option value="Básico">Básico</option>
                      <option value="Ninguno">Ninguno</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold">Frecuencia de baño y cepillado:</label>
                    <select 
                      name="frecuencia_bano_cepillado" 
                      value={formData.frecuencia_bano_cepillado} 
                      onChange={handleChange} 
                      className="w-full border p-2 rounded"
                    >
                      <option value="">-- Selecciona --</option>
                      <option value="Semanal">Semanal</option>
                      <option value="Quincenal">Quincenal</option>
                      <option value="Mensual">Mensual</option>
                      <option value="Ocasional">Ocasional</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold">Manejo de muda de pelaje:</label>
                    <select 
                      name="manejo_muda_pelaje" 
                      value={formData.manejo_muda_pelaje} 
                      onChange={handleChange} 
                      className="w-full border p-2 rounded"
                    >
                      <option value="">-- Selecciona --</option>
                      <option value="Muy preparado">Muy preparado</option>
                      <option value="Preparado">Preparado</option>
                      <option value="Algo preparado">Algo preparado</option>
                      <option value="No me importa">No me importa</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold">Conocimiento sobre cuidado dental:</label>
                    <select 
                      name="conocimiento_cuidado_dental_perros" 
                      value={formData.conocimiento_cuidado_dental_perros} 
                      onChange={handleChange} 
                      className="w-full border p-2 rounded"
                    >
                      <option value="">-- Selecciona --</option>
                      <option value="Experto">Experto</option>
                      <option value="Bueno">Bueno</option>
                      <option value="Básico">Básico</option>
                      <option value="Ninguno">Ninguno</option>
                    </select>
                  </div>
                </div>
              )}

              {(formData.tipo_animal_preferido === "Gato" || formData.tipo_animal_preferido === "Sin Preferencia") && (
                <div className="border p-4 rounded bg-purple-50 space-y-4 mt-4">
                  <h4 className="font-semibold text-lg">Cuidado de Gatos</h4>
                  
                  <div>
                    <label className="block mb-2 font-semibold">¿Ventanas protegidas?</label>
                    <select 
                      name="ventanas_protegidas" 
                      value={formData.ventanas_protegidas} 
                      onChange={handleChange} 
                      className="w-full border p-2 rounded"
                    >
                      <option value="">-- Selecciona --</option>
                      <option value="Sí, todas">Sí, todas</option>
                      <option value="Algunas">Algunas</option>
                      <option value="No, pero las protegeré">No, pero las protegeré</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold">Adaptación del hogar para gatos:</label>
                    <select 
                      name="adaptacion_hogar" 
                      value={formData.adaptacion_hogar} 
                      onChange={handleChange} 
                      className="w-full border p-2 rounded"
                    >
                      <option value="">-- Selecciona --</option>
                      <option value="Completamente preparado">Completamente preparado (rascadores, juguetes, etc.)</option>
                      <option value="Parcialmente preparado">Parcialmente preparado</option>
                      <option value="Compraré lo necesario">Compraré lo necesario</option>
                      <option value="No lo he considerado">No lo he considerado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold">Conocimiento sobre higiene de gatos:</label>
                    <select 
                      name="conocimiento_higiene_gatos" 
                      value={formData.conocimiento_higiene_gatos} 
                      onChange={handleChange} 
                      className="w-full border p-2 rounded"
                    >
                      <option value="">-- Selecciona --</option>
                      <option value="Experto">Experto</option>
                      <option value="Bueno">Bueno</option>
                      <option value="Básico">Básico</option>
                      <option value="Ninguno">Ninguno</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold">Frecuencia de limpieza del arenero:</label>
                    <select 
                      name="frecuencia_limpieza_arenero" 
                      value={formData.frecuencia_limpieza_arenero} 
                      onChange={handleChange} 
                      className="w-full border p-2 rounded"
                    >
                      <option value="">-- Selecciona --</option>
                      <option value="Diaria">Diaria</option>
                      <option value="Cada 2-3 días">Cada 2-3 días</option>
                      <option value="Semanal">Semanal</option>
                      <option value="Ocasional">Ocasional</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold">Manejo del cuidado del pelaje:</label>
                    <select 
                      name="manejo_cuidado_pelaje_gatos" 
                      value={formData.manejo_cuidado_pelaje_gatos} 
                      onChange={handleChange} 
                      className="w-full border p-2 rounded"
                    >
                      <option value="">-- Selecciona --</option>
                      <option value="Cepillado diario">Cepillado diario</option>
                      <option value="Cepillado semanal">Cepillado semanal</option>
                      <option value="Ocasional">Ocasional</option>
                      <option value="Solo cuando sea necesario">Solo cuando sea necesario</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold">Conocimiento sobre higiene dental:</label>
                    <select 
                      name="conocimiento_higiene_dental_gatos" 
                      value={formData.conocimiento_higiene_dental_gatos} 
                      onChange={handleChange} 
                      className="w-full border p-2 rounded"
                    >
                      <option value="">-- Selecciona --</option>
                      <option value="Experto">Experto</option>
                      <option value="Bueno">Bueno</option>
                      <option value="Básico">Básico</option>
                      <option value="Ninguno">Ninguno</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold">Personalidad preferida:</label>
                    <select 
                      name="personalidad_preferida" 
                      value={formData.personalidad_preferida} 
                      onChange={handleChange} 
                      className="w-full border p-2 rounded"
                    >
                      <option value="">-- Selecciona --</option>
                      <option value="Muy sociable">Muy sociable</option>
                      <option value="Sociable">Sociable</option>
                      <option value="Independiente">Independiente</option>
                      <option value="Tímido">Tímido</option>
                      <option value="Sin preferencia">Sin preferencia</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold">Plan de enriquecimiento ambiental:</label>
                    <select 
                      name="plan_enriquecimiento" 
                      value={formData.plan_enriquecimiento} 
                      onChange={handleChange} 
                      className="w-full border p-2 rounded"
                    >
                      <option value="">-- Selecciona --</option>
                      <option value="Completo">Completo (torres, juguetes, zonas de escalada)</option>
                      <option value="Bueno">Bueno (rascadores y juguetes)</option>
                      <option value="Básico">Básico (mínimo necesario)</option>
                      <option value="Ninguno">Ninguno aún</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold">Tipo de alimentación que planeas dar:</label>
                    <select 
                      name="tipo_alimentacion" 
                      value={formData.tipo_alimentacion} 
                      onChange={handleChange} 
                      className="w-full border p-2 rounded"
                    >
                      <option value="">-- Selecciona --</option>
                      <option value="Premium">Premium (alta calidad)</option>
                      <option value="Estándar">Estándar (buena calidad)</option>
                      <option value="Económica">Económica</option>
                      <option value="Casera">Casera</option>
                      <option value="Mixta">Mixta</option>
                    </select>
                  </div>

                  <div className="bg-yellow-50 p-3 rounded">
                    <label className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        name="considera_desungulacion" 
                        checked={formData.considera_desungulacion} 
                        onChange={handleChange}
                        className="w-4 h-4"
                      />
                      <span className="font-semibold">Consideraría la desungulación</span>
                    </label>
                    <p className="text-sm text-red-600 mt-2">
                      ⚠️ Nota: La desungulación es considerada una práctica cruel y está prohibida en muchos países. Puede causar dolor crónico y problemas de comportamiento.
                    </p>
                  </div>
                </div>
              )}

              {!formData.tipo_animal_preferido && (
                <div className="text-center text-gray-500 py-8 bg-gray-50 rounded">
                  <p className="text-lg">Por favor, selecciona un tipo de animal en la Sección 1 para ver las preguntas específicas.</p>
                  <button 
                    type="button"
                    onClick={() => setSeccionActual(1)}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    Ir a Sección 1
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Botones de navegación */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            {seccionActual > 1 && (
              <button 
                type="button" 
                onClick={anterior} 
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
              >
                ← Anterior
              </button>
            )}
            {seccionActual < 6 ? (
              <button 
                type="button" 
                onClick={siguiente} 
                className="ml-auto px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
              >
                Siguiente →
              </button>
            ) : (
              <button 
                type="submit" 
                className="ml-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-lg"
              >
                ✓ Enviar Solicitud
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Solicitud;