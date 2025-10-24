import { useEffect, useState } from "react";
import '../styles/Solicitud.css';

const initialFormData = {
  // Sección 1: Datos Personales
  nombreCompleto: "", edad: "", correo: "", telefono: "", direccion: "", 
  ocupacion: "", horarioLaboralInicio: "", horarioLaboralFin: "", password: "",
  
  // Sección 2: Vivienda
  tipoVivienda: "", esAlquilada: "", tienePermisoEscrito: "",
  
  // Sección 3: Experiencia y Motivación
  motivoAdopcion: "", haTenidoMascotas: "", detalleMascotasAnteriores: "", 
  tipoMascotasAnteriores: "", preparadoCompromisoLargoPlazo: "",
  
  // Sección 4: Hogar y Familia
  viveSolo: false, viveConSoloAdultos: false, viveConNinosMenores5: false,
  viveConNinos6_12: false, viveConAdultosMayores: false, viveConOtrasMascotas: false,
  horasSoloAlDia: "", responsablePrincipal: "",
  
  // Sección 5: Compromiso Económico
  actitudGastosVeterinarios: "", dispuestoEsterilizar: "",
  
  // Sección 6: Preferencia de Animal
  tipoAnimal: "", idAnimal: "",
  
  // Sección 7A: Datos específicos de PERROS
  frecuenciaPaseos: "", duracionPaseos: "", nivelEnergiaPreferido: "", 
  disposicionEntrenamiento: "", planSocializacion: "", conocimientoHigiene: "", 
  frecuenciaBanoCepillado: "", manejoMudaPelaje: "", conocimientoCuidadoDental: "",
  
  // Sección 7B: Datos específicos de GATOS
  ventanasProtegidas: "", adaptacionHogar: "", conocimientoHigieneGato: "",
  frecuenciaLimpiezaArenero: "", manejoCuidadoPelaje: "", conocimientoHigieneDental: "",
  personalidadPreferida: "", planEnriquecimiento: "", tipoAlimentacion: "",
  consideraDesungulacion: false,
};

// Sistema de puntuación según el documento
const puntuaciones = {
  tipoVivienda: {
    "casa_patio_grande": 5,
    "casa_patio_pequeno": 4,
    "depto_grande": 3,
    "depto_pequeno": 2,
    "otro": 1
  },
  situacionVivienda: {
    "propia": 5,
    "alquilada_con_permiso": 5,
    "alquilada_sin_permiso": 0,
    "no_seguro": 1
  },
  motivoAdopcion: {
    "Busco un miembro más para la familia": 5,
    "Principalmente por compañía": 3,
    "Para que haga compañía a niño": 2,
    "Otro": 1
  },
  experienciaMascotas: {
    "Actualmente tiene mascotas esterilizadas": 5,
    "Tuvo mascotas antes pero ya no": 3,
    "Nunca ha tenido": 1
  },
  tipoMascotasAnteriores: {
    "Perros y gatos": 5,
    "Solo perros": 4,
    "Solo gatos": 4,
    "Otras mascotas": 2,
    "Ninguna": 1
  },
  compromiso: {
    "Completamente consciente": 5,
    "Creo que sí": 2,
    "No lo había pensado": 0
  },
  horasSolo: {
    "Menos de 4 horas": 5,
    "4-8 horas": 3,
    "Más de 8 horas": 1
  },
  responsable: {
    "Yo": 5,
    "Familiar adulto": 4,
    "Responsabilidad compartida": 3,
    "No lo hemos decidido": 1
  },
  gastosVet: {
    "Pagaría sin dudar": 5,
    "Buscaría opciones económicas": 3,
    "No estoy seguro": 1,
    "Dependería del costo": 1
  },
  esterilizacion: {
    "Sí, es prioridad": 5,
    "Sí, eventualmente": 3,
    "No estoy seguro": 1,
    "No": 0
  },
  // Puntuaciones para PERROS
  frecuenciaPaseos: {
    "3 o más veces al día": 5,
    "1-2 veces al día": 3,
    "Solo fines de semana": 1,
    "Casi nunca": 0
  },
  duracionPaseos: {
    "Más de 30 minutos": 5,
    "15-30 minutos": 3,
    "Menos de 15 minutos": 1
  },
  nivelEnergia: {
    "Muy activo": 5,
    "Moderado": 3,
    "Tranquilo": 1
  },
  entrenamiento: {
    "Clases de adiestramiento": 5,
    "Lo entrenaré en casa": 4,
    "Lo básico": 2,
    "Prefiero perro entrenado": 1
  },
  socializacion: {
    "Parques, clases, otros perros": 5,
    "Paseos por el vecindario": 3,
    "Solo en casa y jardín": 1
  },
  conocimientoHigiene: {
    "Completo": 5,
    "Conozco lo básico": 3,
    "Sé que necesita baños": 1,
    "Dispuesto a aprender": 2
  },
  frecuenciaHigiene: {
    "Baño mensual + cepillado regular": 5,
    "Baño cada 2-3 meses": 3,
    "Solo cuando se ensucie": 1
  },
  mudaPelaje: {
    "Cepillado diario en muda": 5,
    "Cepillado semanal": 3,
    "Prefiero razas sin pelo": 2,
    "No había considerado": 1
  },
  cuidadoDental: {
    "Sí, cepillado regular": 5,
    "Conozco importancia pero no cómo hacerlo": 2,
    "No sabía que necesitaban": 1
  },
  // Puntuaciones para GATOS
  ventanasProtegidas: {
    "Sí, todos": 5,
    "Algunos": 3,
    "Me comprometo a instalarlos": 2,
    "Ninguno": 0
  },
  adaptacionHogar: {
    "Redes, rascadores, áreas elevadas": 5,
    "Lo básico": 3,
    "Solo lo indispensable": 1
  },
  conocimientoHigieneGato: {
    "Completo": 5,
    "Lo básico": 3,
    "Arenero y comida": 1,
    "Dispuesto a aprender": 2
  },
  limpiezaArenero: {
    "Diariamente": 5,
    "Cada 2-3 días": 3,
    "Una vez por semana": 1,
    "Cuando huela mal": 0
  },
  cuidadoPelaje: {
    "Cepillado regular + control bolas": 5,
    "Cepillado ocasional": 2,
    "Solo en época de muda": 1
  },
  higieneDental: {
    "Sí, conozco métodos": 5,
    "He oído que es importante": 2,
    "No sabía": 1
  },
  personalidad: {
    "Cariñoso y sociable": 5,
    "Independiente pero amigable": 4,
    "Tranquilo y reservado": 3,
    "No tengo preferencia": 5
  },
  enriquecimiento: {
    "Completo": 5,
    "Básico": 3,
    "Solo lo necesario": 1
  },
  alimentacion: {
    "Comida balanceada de calidad": 5,
    "Comida standard": 3,
    "Comida casera": 2,
    "Leche y sobras": 0
  }
};

function Solicitud() {
  const [animales, setAnimales] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [seccionActual, setSeccionActual] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [puntuacionTotal, setPuntuacionTotal] = useState(0);
  const [revisionManual, setRevisionManual] = useState(false);
  const [motivosRevision, setMotivosRevision] = useState([]);

  useEffect(() => {
    const animalesEjemplo = [
      { Id: 1, nombre: "Max", especie: "Perro", raza: "Labrador", sexo: "Macho", edadAprox: "3 años" },
      { Id: 2, nombre: "Luna", especie: "Gato", raza: "Siamés", sexo: "Hembra", edadAprox: "2 años" },
      { Id: 3, nombre: "Rocky", especie: "Perro", raza: "Mestizo", sexo: "Macho", edadAprox: "5 años" },
      { Id: 4, nombre: "Mimi", especie: "Gato", raza: "Persa", sexo: "Hembra", edadAprox: "1 año" },
      { Id: 5, nombre: "Toby", especie: "Perro", raza: "Chihuahua", sexo: "Macho", edadAprox: "4 años" }
    ];
    setAnimales(animalesEjemplo);
  }, []);

  // Calcular puntuación automáticamente
  useEffect(() => {
    let puntos = 0;
    const motivos = [];

    // Sección 2: Vivienda
    if (formData.tipoVivienda) {
      puntos += puntuaciones.tipoVivienda[formData.tipoVivienda] || 0;
    }
    
    if (formData.esAlquilada === "no") {
      puntos += 5;
    } else if (formData.esAlquilada === "si" && formData.tienePermisoEscrito === "si") {
      puntos += 5;
    } else if (formData.esAlquilada === "si" && formData.tienePermisoEscrito === "no") {
      puntos += 0;
      motivos.push("Sin permiso de arrendador escrito");
    }

    // Sección 3: Experiencia y Motivación
    if (formData.motivoAdopcion) {
      puntos += puntuaciones.motivoAdopcion[formData.motivoAdopcion] || 0;
    }
    if (formData.detalleMascotasAnteriores) {
      puntos += puntuaciones.experienciaMascotas[formData.detalleMascotasAnteriores] || 0;
    }
    if (formData.tipoMascotasAnteriores) {
      puntos += puntuaciones.tipoMascotasAnteriores[formData.tipoMascotasAnteriores] || 0;
    }
    if (formData.preparadoCompromisoLargoPlazo) {
      puntos += puntuaciones.compromiso[formData.preparadoCompromisoLargoPlazo] || 0;
    }

    // Sección 4: Hogar y Familia
    if (formData.horasSoloAlDia) {
      const puntosHoras = puntuaciones.horasSolo[formData.horasSoloAlDia] || 0;
      puntos += puntosHoras;
      if (puntosHoras === 1 && formData.responsablePrincipal === "No lo hemos decidido") {
        motivos.push("Más de 8 horas solo + sin responsable alternativo");
      }
    }
    if (formData.responsablePrincipal) {
      puntos += puntuaciones.responsable[formData.responsablePrincipal] || 0;
    }

    // Sección 5: Compromiso Económico
    if (formData.actitudGastosVeterinarios) {
      puntos += puntuaciones.gastosVet[formData.actitudGastosVeterinarios] || 0;
    }
    if (formData.dispuestoEsterilizar) {
      const puntosEst = puntuaciones.esterilizacion[formData.dispuestoEsterilizar] || 0;
      puntos += puntosEst;
      if (formData.dispuestoEsterilizar === "No") {
        motivos.push("No dispuesto a esterilizar");
      }
    }

    // Sección 7A: PERROS
    if (formData.tipoAnimal === "perro") {
      if (formData.frecuenciaPaseos) puntos += puntuaciones.frecuenciaPaseos[formData.frecuenciaPaseos] || 0;
      if (formData.duracionPaseos) puntos += puntuaciones.duracionPaseos[formData.duracionPaseos] || 0;
      if (formData.nivelEnergiaPreferido) puntos += puntuaciones.nivelEnergia[formData.nivelEnergiaPreferido] || 0;
      if (formData.disposicionEntrenamiento) puntos += puntuaciones.entrenamiento[formData.disposicionEntrenamiento] || 0;
      if (formData.planSocializacion) puntos += puntuaciones.socializacion[formData.planSocializacion] || 0;
      if (formData.conocimientoHigiene) puntos += puntuaciones.conocimientoHigiene[formData.conocimientoHigiene] || 0;
      if (formData.frecuenciaBanoCepillado) puntos += puntuaciones.frecuenciaHigiene[formData.frecuenciaBanoCepillado] || 0;
      if (formData.manejoMudaPelaje) puntos += puntuaciones.mudaPelaje[formData.manejoMudaPelaje] || 0;
      if (formData.conocimientoCuidadoDental) puntos += puntuaciones.cuidadoDental[formData.conocimientoCuidadoDental] || 0;
    }

    // Sección 7B: GATOS
    if (formData.tipoAnimal === "gato") {
      if (formData.ventanasProtegidas) puntos += puntuaciones.ventanasProtegidas[formData.ventanasProtegidas] || 0;
      if (formData.adaptacionHogar) puntos += puntuaciones.adaptacionHogar[formData.adaptacionHogar] || 0;
      if (formData.conocimientoHigieneGato) puntos += puntuaciones.conocimientoHigieneGato[formData.conocimientoHigieneGato] || 0;
      if (formData.frecuenciaLimpiezaArenero) puntos += puntuaciones.limpiezaArenero[formData.frecuenciaLimpiezaArenero] || 0;
      if (formData.manejoCuidadoPelaje) puntos += puntuaciones.cuidadoPelaje[formData.manejoCuidadoPelaje] || 0;
      if (formData.conocimientoHigieneDental) puntos += puntuaciones.higieneDental[formData.conocimientoHigieneDental] || 0;
      if (formData.personalidadPreferida) puntos += puntuaciones.personalidad[formData.personalidadPreferida] || 0;
      if (formData.planEnriquecimiento) puntos += puntuaciones.enriquecimiento[formData.planEnriquecimiento] || 0;
      if (formData.tipoAlimentacion) puntos += puntuaciones.alimentacion[formData.tipoAlimentacion] || 0;
      
      if (formData.consideraDesungulacion) {
        motivos.push("Considera la desungulación (maltrato animal)");
      }
    }

    // Revisar si necesita revisión manual
    if (puntos < 15) {
      motivos.push("Menos de 15 puntos totales");
    }

    setPuntuacionTotal(puntos);
    setRevisionManual(motivos.length > 0);
    setMotivosRevision(motivos);
  }, [formData]);

  const getClasificacion = () => {
    if (puntuacionTotal >= 45) return { texto: "Excelente candidato", color: "clasificacion-excelente", emoji: "🟢" };
    if (puntuacionTotal >= 35) return { texto: "Buen candidato", color: "clasificacion-bueno", emoji: "🔵" };
    if (puntuacionTotal >= 25) return { texto: "Candidato adecuado", color: "clasificacion-adecuado", emoji: "🟡" };
    if (puntuacionTotal >= 15) return { texto: "Candidato con reservas", color: "clasificacion-reserva", emoji: "🟠" };
    return { texto: "No recomendado", color: "clasificacion-no-recomendado", emoji: "🔴" };
  };

  const getRecomendacion = () => {
    if (puntuacionTotal >= 45) return "Ideal para cualquier animal";
    if (puntuacionTotal >= 35) return "Perros medianos/pequeños o gatos adultos";
    if (puntuacionTotal >= 25) return "Gatos adultos o perros pequeños tranquilos";
    if (puntuacionTotal >= 15) return "Solo gatos adultos tranquilos, requiere seguimiento";
    return "Revisión manual obligatoria";
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));

    if (name === "idAnimal") {
      const animal = animales.find(a => a.Id === parseInt(value));
      setSelectedAnimal(animal || null);
      if (animal) {
        setFormData(prev => ({ ...prev, tipoAnimal: animal.especie.toLowerCase() }));
      }
    }
  };

  const siguiente = () => {
    if (seccionActual === 6 && formData.tipoAnimal) {
      setSeccionActual(7);
    } else {
      setSeccionActual(prev => Math.min(prev + 1, 7));
    }
  };

  const anterior = () => setSeccionActual(prev => Math.max(prev - 1, 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const clasificacion = getClasificacion();
    const solicitudCompleta = {
      ...formData,
      puntuacionTotal,
      clasificacion: clasificacion.texto,
      recomendacion: getRecomendacion(),
      revisionManualRequerida: revisionManual,
      motivoRevisionManual: motivosRevision.join(", "),
      fechaSolicitud: new Date().toISOString()
    };

    console.log("📋 SOLICITUD COMPLETA:", solicitudCompleta);
    alert(`✅ Solicitud enviada con éxito\n\n${clasificacion.emoji} Clasificación: ${clasificacion.texto}\n📊 Puntuación: ${puntuacionTotal} puntos\n\nGracias por tu interés en adoptar. Te contactaremos pronto.`);
    
    setFormData(initialFormData);
    setSelectedAnimal(null);
    setSeccionActual(1);
  };

  const clasificacion = getClasificacion();

  return (
    <div className="solicitud-container">
      <div className="solicitud-card">
        <div className="solicitud-header">
          <h2 className="solicitud-title">🐾 Solicitud de Adopción - CEMCAA</h2>
          
          <div className="progress-container">
            <span className="progress-text">Sección {seccionActual} de 7</span>
            <div className="progress-bar-container">
              <div 
                className="progress-bar"
                style={{ width: `${(seccionActual / 7) * 100}%` }}
              />
            </div>
            <span className="progress-percentage">{Math.round((seccionActual / 7) * 100)}%</span>
          </div>

          {seccionActual > 1 && (
            <div className="puntuacion-card">
              <div className="puntuacion-content">
                <div>
                  <p className="puntuacion-label">Puntuación actual</p>
                  <p className={`puntuacion-valor ${clasificacion.color}`}>
                    {clasificacion.emoji} {puntuacionTotal} puntos
                  </p>
                  <p className="clasificacion-text">{clasificacion.texto}</p>
                </div>
                {revisionManual && (
                  <div className="revision-badge">
                    <p className="revision-text">⚠️ Revisión manual</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="solicitud-form">
          {/* SECCIÓN 1: Datos Personales */}
          {seccionActual === 1 && (
            <div className="seccion">
              <h3 className="seccion-titulo">
                <span className="seccion-numero">1</span>
                📋 Información Personal
              </h3>
              
              <div className="form-group">
                <label className="form-label">Nombre completo *</label>
                <input
                  type="text" name="nombreCompleto" value={formData.nombreCompleto} 
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Juan Pérez García"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Edad *</label>
                  <input
                    type="number" name="edad" value={formData.edad} 
                    onChange={handleChange} min="18" max="100"
                    className="form-input"
                    placeholder="25"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Teléfono *</label>
                  <input
                    type="tel" name="telefono" value={formData.telefono} 
                    onChange={handleChange}
                    className="form-input"
                    placeholder="555-123-4567"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Correo electrónico *</label>
                <input
                  type="email" name="correo" value={formData.correo} 
                  onChange={handleChange}
                  className="form-input"
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Dirección completa *</label>
                <textarea
                  name="direccion" value={formData.direccion} 
                  onChange={handleChange}
                  className="form-input"
                  rows="2"
                  placeholder="Calle, número, colonia, ciudad, estado"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Ocupación</label>
                <input
                  type="text" name="ocupacion" value={formData.ocupacion} 
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Ingeniero, Maestro, Estudiante..."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Horario laboral - Inicio</label>
                  <input
                    type="time" name="horarioLaboralInicio" value={formData.horarioLaboralInicio} 
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Horario laboral - Fin</label>
                  <input
                    type="time" name="horarioLaboralFin" value={formData.horarioLaboralFin} 
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Contraseña *</label>
                <input
                  type="password" name="password" value={formData.password} 
                  onChange={handleChange} minLength="6"
                  className="form-input"
                  placeholder="Mínimo 6 caracteres"
                  required
                />
                <p className="form-help">Para acceder a tu cuenta y seguimiento</p>
              </div>
            </div>
          )}

          {/* SECCIÓN 2: Vivienda */}
          {seccionActual === 2 && (
            <div className="seccion">
              <h3 className="seccion-titulo">
                <span className="seccion-numero">2</span>
                🏠 Situación de Vivienda
              </h3>
              
              <div className="form-group">
                <label className="form-label">¿Qué tipo de vivienda tienes? *</label>
                <select
                  name="tipoVivienda" value={formData.tipoVivienda} 
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  <option value="">-- Selecciona una opción --</option>
                  <option value="casa_patio_grande">🏡 Casa propia con patio cercado (más de 50m²) - 5 pts</option>
                  <option value="casa_patio_pequeno">🏘️ Casa con patio pequeño o no cercado - 4 pts</option>
                  <option value="depto_grande">🏢 Departamento grande (más de 70m²) - 3 pts</option>
                  <option value="depto_pequeno">🏬 Departamento pequeño (menos de 70m²) - 2 pts</option>
                  <option value="otro">🏚️ Otro - 1 pt</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">¿Actualmente alquilas tu vivienda? *</label>
                <select
                  name="esAlquilada" value={formData.esAlquilada} 
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  <option value="">-- Selecciona --</option>
                  <option value="no">No, es propia - 5 pts</option>
                  <option value="si">Sí, la alquilo</option>
                </select>
              </div>

              {formData.esAlquilada === "si" && (
                <div className="form-group alert-warning">
                  <label className="form-label">¿Tienes permiso POR ESCRITO del arrendador? *</label>
                  <select
                    name="tienePermisoEscrito" value={formData.tienePermisoEscrito} 
                    onChange={handleChange}
                    className="form-input"
                    required
                  >
                    <option value="">-- Selecciona --</option>
                    <option value="si">Sí, tengo permiso escrito - 5 pts</option>
                    <option value="no">No tengo permiso escrito - 0 pts (⚠️ Revisión manual)</option>
                  </select>
                  {formData.tienePermisoEscrito === "no" && (
                    <p className="form-alert">⚠️ Sin permiso escrito se requiere revisión manual obligatoria</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* SECCIÓN 3: Experiencia y Motivación */}
          {seccionActual === 3 && (
            <div className="seccion">
              <h3 className="seccion-titulo">
                <span className="seccion-numero">3</span>
                💭 Experiencia y Motivación
              </h3>
              
              <div className="form-group">
                <label className="form-label">¿Por qué deseas adoptar un animal? *</label>
                <select
                  name="motivoAdopcion" value={formData.motivoAdopcion} 
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  <option value="">-- Selecciona --</option>
                  <option value="Busco un miembro más para la familia">💚 Busco un miembro más para la familia - 5 pts</option>
                  <option value="Principalmente por compañía">👥 Principalmente por compañía - 3 pts</option>
                  <option value="Para que haga compañía a niño">👶 Para que haga compañía a otra mascota/niño - 2 pts</option>
                  <option value="Otro">📝 Otro - 1 pt</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">¿Has tenido mascotas antes? *</label>
                <select
                  name="haTenidoMascotas" value={formData.haTenidoMascotas} 
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  <option value="">-- Selecciona --</option>
                  <option value="si">Sí</option>
                  <option value="no">No</option>
                </select>
              </div>

              {formData.haTenidoMascotas === "si" && (
                <>
                  <div className="form-group">
                    <label className="form-label">Detalle de mascotas anteriores</label>
                    <select
                      name="detalleMascotasAnteriores" value={formData.detalleMascotasAnteriores} 
                      onChange={handleChange}
                      className="form-input"
                    >
                      <option value="">-- Selecciona --</option>
                      <option value="Actualmente tiene mascotas esterilizadas">✅ Actualmente tengo (esterilizadas y vacunadas) - 5 pts</option>
                      <option value="Tuvo mascotas antes pero ya no">📅 Sí, pero ya no - 3 pts</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">¿Qué tipo de mascotas has tenido?</label>
                    <select
                      name="tipoMascotasAnteriores" value={formData.tipoMascotasAnteriores} 
                      onChange={handleChange}
                      className="form-input"
                    >
                      <option value="">-- Selecciona --</option>
                      <option value="Perros y gatos">🐶🐱 Perros y gatos - 5 pts</option>
                      <option value="Solo perros">🐶 Solo perros - 4 pts</option>
                      <option value="Solo gatos">🐱 Solo gatos - 4 pts</option>
                      <option value="Otras mascotas">🐹 Otras mascotas - 2 pts</option>
                    </select>
                  </div>
                </>
              )}

              {formData.haTenidoMascotas === "no" && (
                <div className="form-group">
                  <input type="hidden" name="detalleMascotasAnteriores" value="Nunca ha tenido" />
                  <input type="hidden" name="tipoMascotasAnteriores" value="Ninguna" />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">¿Estás preparado para cuidar de un animal durante 10-15 años? *</label>
                <select
                  name="preparadoCompromisoLargoPlazo" value={formData.preparadoCompromisoLargoPlazo} 
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  <option value="">-- Selecciona --</option>
                  <option value="Completamente consciente">💯 Sí, completamente consciente del compromiso - 5 pts</option>
                  <option value="Creo que sí">🤔 Creo que sí, pero no estoy 100% seguro - 2 pts</option>
                  <option value="No lo había pensado">❌ No lo había pensado - 0 pts</option>
                </select>
              </div>
            </div>
          )}

          {/* SECCIÓN 4: Hogar y Familia */}
          {seccionActual === 4 && (
            <div className="seccion">
              <h3 className="seccion-titulo">
                <span className="seccion-numero">4</span>
                👨‍👩‍👧‍👦 Hogar y Familia
              </h3>
              
              <div className="form-group">
                <label className="form-label">¿Quién vive contigo? (puedes seleccionar varios)</label>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox" name="viveSolo" checked={formData.viveSolo} 
                      onChange={handleChange}
                      className="checkbox-input"
                    />
                    <span>🧍 Vivo solo</span>
                  </label>

                  <label className="checkbox-label">
                    <input
                      type="checkbox" name="viveConSoloAdultos" checked={formData.viveConSoloAdultos} 
                      onChange={handleChange}
                      className="checkbox-input"
                    />
                    <span>👥 Solo con adultos</span>
                  </label>

                  <label className="checkbox-label">
                    <input
                      type="checkbox" name="viveConNinosMenores5" checked={formData.viveConNinosMenores5} 
                      onChange={handleChange}
                      className="checkbox-input"
                    />
                    <span>👶 Con niños menores de 5 años</span>
                  </label>

                  <label className="checkbox-label">
                    <input
                      type="checkbox" name="viveConNinos6_12" checked={formData.viveConNinos6_12} 
                      onChange={handleChange}
                      className="checkbox-input"
                    />
                    <span>🧒 Con niños de 6-12 años</span>
                  </label>

                  <label className="checkbox-label">
                    <input
                      type="checkbox" name="viveConAdultosMayores" checked={formData.viveConAdultosMayores} 
                      onChange={handleChange}
                      className="checkbox-input"
                    />
                    <span>👴 Con adultos mayores</span>
                  </label>

                  <label className="checkbox-label">
                    <input
                      type="checkbox" name="viveConOtrasMascotas" checked={formData.viveConOtrasMascotas} 
                      onChange={handleChange}
                      className="checkbox-input"
                    />
                    <span>🐾 Con otras mascotas</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">¿Cuántas horas al día estará solo el animal? *</label>
                <select
                  name="horasSoloAlDia" value={formData.horasSoloAlDia} 
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  <option value="">-- Selecciona --</option>
                  <option value="Menos de 4 horas">⏰ Menos de 4 horas - 5 pts</option>
                  <option value="4-8 horas">⏱️ Entre 4 y 8 horas - 3 pts</option>
                  <option value="Más de 8 horas">⏳ Más de 8 horas - 1 pt</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">¿Quién será el principal responsable del cuidado? *</label>
                <select
                  name="responsablePrincipal" value={formData.responsablePrincipal} 
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  <option value="">-- Selecciona --</option>
                  <option value="Yo">🙋 Yo - 5 pts</option>
                  <option value="Familiar adulto">👤 Un familiar adulto - 4 pts</option>
                  <option value="Responsabilidad compartida">👨‍👩‍👧 Entre varios miembros de la familia - 3 pts</option>
                  <option value="No lo hemos decidido">❓ No lo hemos decidido - 1 pt</option>
                </select>
              </div>
            </div>
          )}

          {/* SECCIÓN 5: Compromiso Económico */}
          {seccionActual === 5 && (
            <div className="seccion">
              <h3 className="seccion-titulo">
                <span className="seccion-numero">5</span>
                💰 Compromiso Económico y Salud
              </h3>
              
              <div className="form-group">
                <label className="form-label">¿Qué harías si tu mascota requiere atención veterinaria costosa? *</label>
                <select
                  name="actitudGastosVeterinarios" value={formData.actitudGastosVeterinarios} 
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  <option value="">-- Selecciona --</option>
                  <option value="Pagaría sin dudar">💚 Pagaría el tratamiento necesario sin dudar - 5 pts</option>
                  <option value="Buscaría opciones económicas">💡 Buscaría opciones más económicas, pero le daría tratamiento - 3 pts</option>
                  <option value="No estoy seguro">🤔 No estoy seguro de qué haría - 1 pt</option>
                  <option value="Dependería del costo">💸 Dependería del costo - 1 pt</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">¿Estás dispuesto a esterilizar a tu mascota si aún no lo está? *</label>
                <select
                  name="dispuestoEsterilizar" value={formData.dispuestoEsterilizar} 
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  <option value="">-- Selecciona --</option>
                  <option value="Sí, es prioridad">✅ Sí, es una prioridad para mí - 5 pts</option>
                  <option value="Sí, eventualmente">📅 Sí, eventualmente - 3 pts</option>
                  <option value="No estoy seguro">❓ No estoy seguro - 1 pt</option>
                  <option value="No">❌ No, no creo necesario - 0 pts (⚠️ Revisión manual)</option>
                </select>
                {formData.dispuestoEsterilizar === "No" && (
                  <p className="form-alert">⚠️ No estar dispuesto a esterilizar requiere revisión manual obligatoria</p>
                )}
              </div>
            </div>
          )}

          {/* SECCIÓN 6: Selección de Animal */}
          {seccionActual === 6 && (
            <div className="seccion">
              <h3 className="seccion-titulo">
                <span className="seccion-numero">6</span>
                🐶🐱 Elección del Animal
              </h3>
              
              <div className="form-group">
                <label className="form-label">¿Qué animal deseas adoptar? *</label>
                <select
                  name="tipoAnimal" value={formData.tipoAnimal} 
                  onChange={handleChange}
                  className="form-input"
                  required
                >
                  <option value="">-- Selecciona --</option>
                  <option value="perro">🐶 Perro</option>
                  <option value="gato">🐱 Gato</option>
                  <option value="sin_preferencia">🐾 No tengo preferencia</option>
                </select>
              </div>

              {formData.tipoAnimal && (
                <div className="form-group">
                  <label className="form-label">Selecciona un animal específico (opcional)</label>
                  <select
                    name="idAnimal" value={formData.idAnimal} 
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="">-- Aún no tengo preferencia --</option>
                    {animales
                      .filter(a => formData.tipoAnimal === "sin_preferencia" || a.especie.toLowerCase() === formData.tipoAnimal)
                      .map(animal => (
                        <option key={animal.Id} value={animal.Id}>
                          {animal.nombre} - {animal.especie} {animal.raza} ({animal.sexo}, {animal.edadAprox})
                        </option>
                      ))}
                  </select>
                </div>
              )}

              {selectedAnimal && (
                <div className="animal-card">
                  <h4 className="animal-card-title">Animal seleccionado:</h4>
                  <p><strong>Nombre:</strong> {selectedAnimal.nombre}</p>
                  <p><strong>Especie:</strong> {selectedAnimal.especie}</p>
                  <p><strong>Raza:</strong> {selectedAnimal.raza}</p>
                  <p><strong>Sexo:</strong> {selectedAnimal.sexo}</p>
                  <p><strong>Edad aproximada:</strong> {selectedAnimal.edadAprox}</p>
                </div>
              )}
            </div>
          )}

          {/* SECCIÓN 7A: Cuidados Específicos - PERROS */}
          {seccionActual === 7 && (formData.tipoAnimal === "perro" || formData.tipoAnimal === "sin_preferencia") && (
            <div className="seccion">
              <h3 className="seccion-titulo">
                <span className="seccion-numero">7</span>
                🐶 Cuidados Específicos para Perros
              </h3>

              <h4 className="subseccion-titulo">Actividad y Ejercicio</h4>

              <div className="form-group">
                <label className="form-label">¿Con qué frecuencia podrás sacarlo a pasear? *</label>
                <select
                  name="frecuenciaPaseos" value={formData.frecuenciaPaseos} 
                  onChange={handleChange}
                  className="form-input"
                  required={formData.tipoAnimal === "perro"}
                >
                  <option value="">-- Selecciona --</option>
                  <option value="3 o más veces al día">🏃 3 o más veces al día - 5 pts</option>
                  <option value="1-2 veces al día">🚶 1-2 veces al día - 3 pts</option>
                  <option value="Solo fines de semana">📅 Solo los fines de semana - 1 pt</option>
                  <option value="Casi nunca">❌ Casi nunca - 0 pts</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">¿Cuánto tiempo durarán estos paseos en promedio? *</label>
                <select
                  name="duracionPaseos" value={formData.duracionPaseos} 
                  onChange={handleChange}
                  className="form-input"
                  required={formData.tipoAnimal === "perro"}
                >
                  <option value="">-- Selecciona --</option>
                  <option value="Más de 30 minutos">⏰ Más de 30 minutos cada paseo - 5 pts</option>
                  <option value="15-30 minutos">⏱️ 15-30 minutos - 3 pts</option>
                  <option value="Menos de 15 minutos">⏳ Menos de 15 minutos - 1 pt</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">¿Qué nivel de energía prefieres en un perro? *</label>
                <select
                  name="nivelEnergiaPreferido" value={formData.nivelEnergiaPreferido} 
                  onChange={handleChange}
                  className="form-input"
                  required={formData.tipoAnimal === "perro"}
                >
                  <option value="">-- Selecciona --</option>
                  <option value="Muy activo">⚡ Muy activo (necesita mucho ejercicio y estimulación) - 5 pts</option>
                  <option value="Moderado">🎾 Moderado (paseos diarios y juego regular) - 3 pts</option>
                  <option value="Tranquilo">😌 Tranquilo (poco ejercicio, más tiempo de descanso) - 1 pt</option>
                </select>
              </div>

              <h4 className="subseccion-titulo">Entrenamiento y Socialización</h4>

              <div className="form-group">
                <label className="form-label">¿Estás dispuesto a dedicar tiempo al entrenamiento básico? *</label>
                <select
                  name="disposicionEntrenamiento" value={formData.disposicionEntrenamiento} 
                  onChange={handleChange}
                  className="form-input"
                  required={formData.tipoAnimal === "perro"}
                >
                  <option value="">-- Selecciona --</option>
                  <option value="Clases de adiestramiento">🎓 Sí, planeo asistir a clases de adiestramiento - 5 pts</option>
                  <option value="Lo entrenaré en casa">🏠 Sí, lo entrenaré en casa - 4 pts</option>
                  <option value="Lo básico">📝 Lo básico (hacer necesidades fuera) - 2 pts</option>
                  <option value="Prefiero perro entrenado">✅ Prefiero un perro ya entrenado - 1 pt</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">¿Cómo planeas socializar al perro? *</label>
                <select
                  name="planSocializacion" value={formData.planSocializacion} 
                  onChange={handleChange}
                  className="form-input"
                  required={formData.tipoAnimal === "perro"}
                >
                  <option value="">-- Selecciona --</option>
                  <option value="Parques, clases, otros perros">🌳 Parques para perros, clases, encuentros con otros perros - 5 pts</option>
                  <option value="Paseos por el vecindario">🚶 Paseos por el vecindario - 3 pts</option>
                  <option value="Solo en casa y jardín">🏡 Solo en casa y jardín - 1 pt</option>
                </select>
              </div>

              <h4 className="subseccion-titulo">Cuidados Higiénicos y Mantenimiento</h4>

              <div className="form-group">
                <label className="form-label">¿Conoces los cuidados higiénicos que necesita un perro? *</label>
                <select
                  name="conocimientoHigiene" value={formData.conocimientoHigiene} 
                  onChange={handleChange}
                  className="form-input"
                  required={formData.tipoAnimal === "perro"}
                >
                  <option value="">-- Selecciona --</option>
                  <option value="Completo">✅ Sí, baños regulares, cepillado dental, corte de uñas y limpieza de oídos - 5 pts</option>
                  <option value="Conozco lo básico">📚 Conozco lo básico: baños y cepillado - 3 pts</option>
                  <option value="Sé que necesita baños">🛁 Sé que necesita baños ocasionales - 1 pt</option>
                  <option value="Dispuesto a aprender">🎓 No, pero estoy dispuesto a aprender - 2 pts</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">¿Con qué frecuencia puedes bañar y cepillar a tu perro? *</label>
                <select
                  name="frecuenciaBanoCepillado" value={formData.frecuenciaBanoCepillado} 
                  onChange={handleChange}
                  className="form-input"
                  required={formData.tipoAnimal === "perro"}
                >
                  <option value="">-- Selecciona --</option>
                  <option value="Baño mensual + cepillado regular">⭐ Baño mensual + cepillado según necesidad del pelaje - 5 pts</option>
                  <option value="Baño cada 2-3 meses">📅 Baño cada 2-3 meses + cepillado ocasional - 3 pts</option>
                  <option value="Solo cuando se ensucie">🛁 Solo cuando se ensucie - 1 pt</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">¿Cómo manejarías el cuidado del pelaje durante la muda? *</label>
                <select
                  name="manejoMudaPelaje" value={formData.manejoMudaPelaje} 
                  onChange={handleChange}
                  className="form-input"
                  required={formData.tipoAnimal === "perro"}
                >
                  <option value="">-- Selecciona --</option>
                  <option value="Cepillado diario en muda">✨ Cepillado diario durante época de muda y limpieza frecuente - 5 pts</option>
                  <option value="Cepillado semanal">📅 Cepillado semanal - 3 pts</option>
                  <option value="Prefiero razas sin pelo">🐕 Prefiero razas que no suelten pelo - 2 pts</option>
                  <option value="No había considerado">❓ No había considerado este aspecto - 1 pt</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">¿Estás informado sobre los cuidados dentales para perros? *</label>
                <select
                  name="conocimientoCuidadoDental" value={formData.conocimientoCuidadoDental} 
                  onChange={handleChange}
                  className="form-input"
                  required={formData.tipoAnimal === "perro"}
                >
                  <option value="">-- Selecciona --</option>
                  <option value="Sí, cepillado regular">🦷 Sí, cepillado dental regular y limpiezas veterinarias - 5 pts</option>
                  <option value="Conozco importancia pero no cómo hacerlo">📚 Conozco la importancia, pero no sé cómo hacerlo - 2 pts</option>
                  <option value="No sabía que necesitaban">❓ No sabía que necesitaban cuidado dental - 1 pt</option>
                </select>
              </div>
            </div>
          )}

          {/* SECCIÓN 7B: Cuidados Específicos - GATOS */}
          {seccionActual === 7 && (formData.tipoAnimal === "gato" || formData.tipoAnimal === "sin_preferencia") && formData.tipoAnimal !== "perro" && (
            <div className="seccion">
              <h3 className="seccion-titulo">
                <span className="seccion-numero">7</span>
                🐱 Cuidados Específicos para Gatos
              </h3>

              <h4 className="subseccion-titulo">Seguridad y Entorno</h4>

              <div className="form-group">
                <label className="form-label">¿Tienes ventanas/balcones protegidos con redes de seguridad? *</label>
                <select
                  name="ventanasProtegidas" value={formData.ventanasProtegidas} 
                  onChange={handleChange}
                  className="form-input"
                  required={formData.tipoAnimal === "gato"}
                >
                  <option value="">-- Selecciona --</option>
                  <option value="Sí, todos">✅ Sí, todos - 5 pts</option>
                  <option value="Algunos">⚠️ Algunos - 3 pts</option>
                  <option value="Me comprometo a instalarlos">📝 Ninguno, pero me comprometo a instalarlos antes de la adopción - 2 pts</option>
                  <option value="Ninguno">❌ Ninguno - 0 pts</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">¿Cómo adaptarías tu hogar para un gato? *</label>
                <select
                  name="adaptacionHogar" value={formData.adaptacionHogar} 
                  onChange={handleChange}
                  className="form-input"
                  required={formData.tipoAnimal === "gato"}
                >
                  <option value="">-- Selecciona --</option>
                  <option value="Redes, rascadores, áreas elevadas">⭐ Redes en todas las ventanas, rascadores, áreas elevadas - 5 pts</option>
                  <option value="Lo básico">📦 Lo básico: arenero, comida, rascador - 3 pts</option>
                  <option value="Solo lo indispensable">📝 Solo lo indispensable - 1 pt</option>
                </select>
              </div>

              <h4 className="subseccion-titulo">Cuidados Higiénicos y Mantenimiento</h4>

              <div className="form-group">
                <label className="form-label">¿Conoces los cuidados higiénicos específicos para gatos? *</label>
                <select
                  name="conocimientoHigieneGato" value={formData.conocimientoHigieneGato} 
                  onChange={handleChange}
                  className="form-input"
                  required={formData.tipoAnimal === "gato"}
                >
                  <option value="">-- Selecciona --</option>
                  <option value="Completo">✅ Sí: limpieza de arenero diaria, cepillado regular, cuidado dental y limpieza de oídos - 5 pts</option>
                  <option value="Lo básico">📚 Conozco lo básico: arenero y cepillado - 3 pts</option>
                  <option value="Arenero y comida">📝 Sé que necesitan arenero y comida - 1 pt</option>
                  <option value="Dispuesto a aprender">🎓 No, pero estoy dispuesto a aprender - 2 pts</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">¿Con qué frecuencia limpiarías el arenero? *</label>
                <select
                  name="frecuenciaLimpiezaArenero" value={formData.frecuenciaLimpiezaArenero} 
                  onChange={handleChange}
                  className="form-input"
                  required={formData.tipoAnimal === "gato"}
                >
                  <option value="">-- Selecciona --</option>
                  <option value="Diariamente">⭐ Diariamente y desinfección semanal - 5 pts</option>
                  <option value="Cada 2-3 días">📅 Cada 2-3 días - 3 pts</option>
                  <option value="Una vez por semana">📆 Una vez por semana - 1 pt</option>
                  <option value="Cuando huela mal">❌ Cuando huela mal - 0 pts</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">¿Cómo manejarías el cuidado del pelaje? *</label>
                <select
                  name="manejoCuidadoPelaje" value={formData.manejoCuidadoPelaje} 
                  onChange={handleChange}
                  className="form-input"
                  required={formData.tipoAnimal === "gato"}
                >
                  <option value="">-- Selecciona --</option>
                  <option value="Cepillado regular + control bolas">✨ Cepillado regular según tipo de pelaje + control de bolas de pelo - 5 pts</option>
                  <option value="Cepillado ocasional">📅 Cepillado ocasional - 2 pts</option>
                  <option value="Solo en época de muda">📆 Solo en época de muda - 1 pt</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">¿Estás informado sobre la higiene dental en gatos? *</label>
                <select
                  name="conocimientoHigieneDental" value={formData.conocimientoHigieneDental} 
                  onChange={handleChange}
                  className="form-input"
                  required={formData.tipoAnimal === "gato"}
                >
                  <option value="">-- Selecciona --</option>
                  <option value="Sí, conozco métodos">🦷 Sí, conozco la importancia y métodos de limpieza dental - 5 pts</option>
                  <option value="He oído que es importante">📚 He oído que es importante pero no sé cómo hacerlo - 2 pts</option>
                  <option value="No sabía">❓ No sabía que los gatos necesitan cuidado dental - 1 pt</option>
                </select>
              </div>

              <h4 className="subseccion-titulo">Comportamiento y Salud</h4>

              <div className="form-group">
                <label className="form-label">¿Qué tipo de personalidad prefieres en un gato? *</label>
                <select
                  name="personalidadPreferida" value={formData.personalidadPreferida} 
                  onChange={handleChange}
                  className="form-input"
                  required={formData.tipoAnimal === "gato"}
                >
                  <option value="">-- Selecciona --</option>
                  <option value="Cariñoso y sociable">💕 Cariñoso y sociable - 5 pts</option>
                  <option value="Independiente pero amigable">😸 Independiente pero amigable - 4 pts</option>
                  <option value="Tranquilo y reservado">😌 Tranquilo y reservado - 3 pts</option>
                  <option value="No tengo preferencia">🐱 No tengo preferencia - 5 pts</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">¿Cómo planeas enriquecer su ambiente? *</label>
                <select
                  name="planEnriquecimiento" value={formData.planEnriquecimiento} 
                  onChange={handleChange}
                  className="form-input"
                  required={formData.tipoAnimal === "gato"}
                >
                  <option value="">-- Selecciona --</option>
                  <option value="Completo">⭐ Juguetes, rascadores, estantes, interacción diaria - 5 pts</option>
                  <option value="Básico">📦 Juguetes y rascadores básicos - 3 pts</option>
                  <option value="Solo lo necesario">📝 Solo lo necesario - 1 pt</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">¿Qué tipo de alimentación planeas ofrecer? *</label>
                <select
                  name="tipoAlimentacion" value={formData.tipoAlimentacion} 
                  onChange={handleChange}
                  className="form-input"
                  required={formData.tipoAnimal === "gato"}
                >
                  <option value="">-- Selecciona --</option>
                  <option value="Comida balanceada de calidad">⭐ Comida balanceada de calidad + agua fresca siempre disponible - 5 pts</option>
                  <option value="Comida standard">📦 Comida standard de supermercado - 3 pts</option>
                  <option value="Comida casera">🍲 Comida casera - 2 pts</option>
                  <option value="Leche y sobras">❌ Leche y sobras - 0 pts</option>
                </select>
              </div>

              <div className="form-group alert-warning">
                <label className="checkbox-label">
                  <input
                    type="checkbox" name="consideraDesungulacion" checked={formData.consideraDesungulacion} 
                    onChange={handleChange}
                    className="checkbox-input"
                  />
                  <span>❗ Consideraría la desungulación (quitar las garras definitivamente)</span>
                </label>
                {formData.consideraDesungulacion && (
                  <p className="form-alert">⚠️ La desungulación es considerada maltrato animal y requiere revisión manual obligatoria</p>
                )}
              </div>
            </div>
          )}

          {/* Botones de navegación */}
          <div className="form-navigation">
            {seccionActual > 1 && (
              <button type="button" onClick={anterior} className="btn btn-secondary">
                ← Anterior
              </button>
            )}
            <div className="flex-spacer"></div>
            {seccionActual < 7 && (
              <button type="button" onClick={siguiente} className="btn btn-primary">
                Siguiente →
              </button>
            )}
            {seccionActual === 7 && (
              <button type="submit" className="btn btn-success">
                ✓ Enviar Solicitud
              </button>
            )}
          </div>

          {/* Resumen de puntuación al final */}
          {seccionActual === 7 && (
            <div className="resumen-final">
              <h3 className="resumen-titulo">📊 Resumen de tu Solicitud</h3>
              <div className="resumen-content">
                <div className="resumen-item">
                  <span className="resumen-label">Puntuación Total:</span>
                  <span className={`resumen-valor ${clasificacion.color}`}>
                    {clasificacion.emoji} {puntuacionTotal} puntos
                  </span>
                </div>
                <div className="resumen-item">
                  <span className="resumen-label">Clasificación:</span>
                  <span className={`resumen-valor ${clasificacion.color}`}>
                    {clasificacion.texto}
                  </span>
                </div>
                <div className="resumen-item">
                  <span className="resumen-label">Recomendación:</span>
                  <span className="resumen-valor">
                    {getRecomendacion()}
                  </span>
                </div>
                {revisionManual && (
                  <div className="resumen-alerta">
                    <p className="resumen-alerta-titulo">⚠️ Requiere revisión manual</p>
                    <p className="resumen-alerta-text">Motivos:</p>
                    <ul className="resumen-alerta-lista">
                      {motivosRevision.map((motivo, index) => (
                        <li key={index}>{motivo}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <p className="resumen-nota">
                📝 Al enviar esta solicitud, el personal del CEMCAA revisará tu información y se pondrá en contacto contigo.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Solicitud;