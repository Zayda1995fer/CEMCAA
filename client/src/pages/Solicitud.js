import { useEffect, useState } from "react";
import axios from "axios";

function Solicitud() {
  const [animales, setAnimales] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [seccionActual, setSeccionActual] = useState(1);
  
  const [formData, setFormData] = useState({
    // Datos Usuario
    nombreCompleto: "",
    edad: "",
    correo: "",
    telefono: "",
    direccion: "",
    ocupacion: "",
    horarioLaboralInicio: "",
    horarioLaboralFin: "",
    password: "",
    
    // Vivienda
    tipoVivienda: "",
    esAlquilada: "",
    tienePermisoEscrito: "",
    
    // Experiencia y Motivación
    motivoAdopcion: "",
    haTenidoMascotas: "",
    detalleMascotasAnteriores: "",
    tipoMascotasAnteriores: "",
    preparadoCompromisoLargoPlazo: "",
    
    // Hogar y Familia
    viveSolo: false,
    viveConSoloAdultos: false,
    viveConNinosMenores5: false,
    viveConNinos6_12: false,
    viveConAdultosMayores: false,
    viveConOtrasMascotas: false,
    horasSoloAlDia: "",
    responsablePrincipal: "",
    
    // Compromiso Económico
    actitudGastosVeterinarios: "",
    dispuestoEsterilizar: "",
    
    // Preferencia Animal
    tipoAnimal: "",
    idAnimal: "",
    
    // Datos Perros
    frecuenciaPaseos: "",
    duracionPaseos: "",
    nivelEnergiaPreferido: "",
    disposicionEntrenamiento: "",
    planSocializacion: "",
    conocimientoHigiene: "",
    frecuenciaBanoCepillado: "",
    manejoMudaPelaje: "",
    conocimientoCuidadoDental: "",
    
    // Datos Gatos
    ventanasProtegidas: "",
    adaptacionHogar: "",
    conocimientoHigieneGato: "",
    frecuenciaLimpiezaArenero: "",
    manejoCuidadoPelaje: "",
    conocimientoHigieneDental: "",
    personalidadPreferida: "",
    planEnriquecimiento: "",
    tipoAlimentacion: "",
    consideraDesungulacion: false,
  });

  useEffect(() => {
    axios.get("http://localhost:3001/animales")
      .then(res => setAnimales(res.data))
      .catch(err => console.error(err));
  }, []);

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
    setSeccionActual(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  const anterior = () => {
    setSeccionActual(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3001/solicitudes", formData)
      .then(res => {
        alert("Solicitud enviada con éxito");
        setFormData({
          nombreCompleto: "",
          edad: "",
          correo: "",
          telefono: "",
          direccion: "",
          ocupacion: "",
          horarioLaboralInicio: "",
          horarioLaboralFin: "",
          password: "",
          tipoVivienda: "",
          esAlquilada: "",
          tienePermisoEscrito: "",
          motivoAdopcion: "",
          haTenidoMascotas: "",
          detalleMascotasAnteriores: "",
          tipoMascotasAnteriores: "",
          preparadoCompromisoLargoPlazo: "",
          viveSolo: false,
          viveConSoloAdultos: false,
          viveConNinosMenores5: false,
          viveConNinos6_12: false,
          viveConAdultosMayores: false,
          viveConOtrasMascotas: false,
          horasSoloAlDia: "",
          responsablePrincipal: "",
          actitudGastosVeterinarios: "",
          dispuestoEsterilizar: "",
          tipoAnimal: "",
          idAnimal: "",
          frecuenciaPaseos: "",
          duracionPaseos: "",
          nivelEnergiaPreferido: "",
          disposicionEntrenamiento: "",
          planSocializacion: "",
          conocimientoHigiene: "",
          frecuenciaBanoCepillado: "",
          manejoMudaPelaje: "",
          conocimientoCuidadoDental: "",
          ventanasProtegidas: "",
          adaptacionHogar: "",
          conocimientoHigieneGato: "",
          frecuenciaLimpiezaArenero: "",
          manejoCuidadoPelaje: "",
          conocimientoHigieneDental: "",
          personalidadPreferida: "",
          planEnriquecimiento: "",
          tipoAlimentacion: "",
          consideraDesungulacion: false,
        });
        setSelectedAnimal(null);
        setSeccionActual(1);
      })
      .catch(err => {
        console.error(err);
        alert("Error al enviar la solicitud");
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Solicitud de Adopción</h2>
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-gray-600">Sección {seccionActual} de 7</span>
            <div className="flex-1 mx-4 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 transition-all duration-300"
                style={{ width: `${(seccionActual / 7) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* SECCIÓN 1: DATOS PERSONALES */}
          {seccionActual === 1 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-indigo-700 mb-4">📋 Datos Personales</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  name="nombreCompleto"
                  value={formData.nombreCompleto}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Edad *</label>
                <input
                  type="number"
                  name="edad"
                  value={formData.edad}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                  min="18"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico *</label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección Completa *</label>
                <textarea
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows="2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ocupación *</label>
                <input
                  type="text"
                  name="ocupacion"
                  value={formData.ocupacion}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Horario Laboral (Inicio)</label>
                  <input
                    type="time"
                    name="horarioLaboralInicio"
                    value={formData.horarioLaboralInicio}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Horario Laboral (Fin)</label>
                  <input
                    type="time"
                    name="horarioLaboralFin"
                    value={formData.horarioLaboralFin}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                  minLength="6"
                />
              </div>
            </div>
          )}

          {/* SECCIÓN 2: VIVIENDA */}
          {seccionActual === 2 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-indigo-700 mb-4">🏠 Información de Vivienda</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Vivienda * (5 pts máx)</label>
                <select
                  name="tipoVivienda"
                  value={formData.tipoVivienda}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">-- Selecciona --</option>
                  <option value="casa_patio_grande">Casa con patio grande (5 pts)</option>
                  <option value="casa_patio_pequeno">Casa con patio pequeño (4 pts)</option>
                  <option value="depto_grande">Departamento grande (3 pts)</option>
                  <option value="depto_pequeno">Departamento pequeño (2 pts)</option>
                  <option value="otro">Otro (1 pt)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">¿La vivienda es alquilada? *</label>
                <select
                  name="esAlquilada"
                  value={formData.esAlquilada}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">-- Selecciona --</option>
                  <option value="no">No, es propia (5 pts)</option>
                  <option value="si">Sí, es alquilada</option>
                </select>
              </div>

              {formData.esAlquilada === "si" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">¿Tiene permiso escrito del arrendador para tener mascotas? *</label>
                  <select
                    name="tienePermisoEscrito"
                    value={formData.tienePermisoEscrito}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  >
                    <option value="">-- Selecciona --</option>
                    <option value="si">Sí (5 pts)</option>
                    <option value="no">No (0 pts - Revisión manual)</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {/* SECCIÓN 3: EXPERIENCIA Y MOTIVACIÓN */}
          {seccionActual === 3 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-indigo-700 mb-4">💭 Experiencia y Motivación</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">¿Por qué quieres adoptar? * (5 pts máx)</label>
                <select
                  name="motivoAdopcion"
                  value={formData.motivoAdopcion}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">-- Selecciona --</option>
                  <option value="familia">Busco un miembro más para la familia (5 pts)</option>
                  <option value="salvar">Quiero salvar a un animal (4 pts)</option>
                  <option value="compania">Principalmente por compañía (3 pts)</option>
                  <option value="nino">Para que haga compañía a niño (2 pts)</option>
                  <option value="regalo">Es un regalo (1 pt)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">¿Has tenido mascotas antes? * (5 pts máx)</label>
                <select
                  name="haTenidoMascotas"
                  value={formData.haTenidoMascotas}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">-- Selecciona --</option>
                  <option value="actual_esterilizadas">Actualmente tiene mascotas esterilizadas (5 pts)</option>
                  <option value="actual_no_esterilizadas">Actualmente tiene mascotas no esterilizadas (3 pts)</option>
                  <option value="antes_ya_no">Tuvo mascotas antes pero ya no (3 pts)</option>
                  <option value="nunca">Nunca ha tenido (1 pt)</option>
                </select>
              </div>

              {formData.haTenidoMascotas !== "nunca" && formData.haTenidoMascotas !== "" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">¿Qué tipo de mascotas? * (5 pts máx)</label>
                  <select
                    name="tipoMascotasAnteriores"
                    value={formData.tipoMascotasAnteriores}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  >
                    <option value="">-- Selecciona --</option>
                    <option value="perros_gatos">Perros y gatos (5 pts)</option>
                    <option value="solo_perros">Solo perros (4 pts)</option>
                    <option value="solo_gatos">Solo gatos (4 pts)</option>
                    <option value="otras">Otras mascotas (hamster, peces, etc.) (2 pts)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">¿Estás preparado para el compromiso de 10-15 años? * (5 pts máx)</label>
                <select
                  name="preparadoCompromisoLargoPlazo"
                  value={formData.preparadoCompromisoLargoPlazo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">-- Selecciona --</option>
                  <option value="completamente">Completamente consciente (5 pts)</option>
                  <option value="creo_si">Creo que sí (2 pts)</option>
                  <option value="no_pensado">No lo había pensado (0 pts - Revisión manual)</option>
                </select>
              </div>
            </div>
          )}

          {/* SECCIÓN 4: HOGAR Y FAMILIA */}
          {seccionActual === 4 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-indigo-700 mb-4">👨‍👩‍👧‍👦 Hogar y Familia</h3>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">¿Con quién vives? (Marca todas las que apliquen)</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="viveSolo"
                      checked={formData.viveSolo}
                      onChange={handleChange}
                      className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="text-sm">Vivo solo/a</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="viveConSoloAdultos"
                      checked={formData.viveConSoloAdultos}
                      onChange={handleChange}
                      className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="text-sm">Solo adultos</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="viveConNinosMenores5"
                      checked={formData.viveConNinosMenores5}
                      onChange={handleChange}
                      className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="text-sm">Niños menores de 5 años</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="viveConNinos6_12"
                      checked={formData.viveConNinos6_12}
                      onChange={handleChange}
                      className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="text-sm">Niños de 6-12 años</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="viveConAdultosMayores"
                      checked={formData.viveConAdultosMayores}
                      onChange={handleChange}
                      className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="text-sm">Adultos mayores</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="viveConOtrasMascotas"
                      checked={formData.viveConOtrasMascotas}
                      onChange={handleChange}
                      className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="text-sm">Otras mascotas</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">¿Cuántas horas al día estaría solo el animal? * (5 pts máx)</label>
                <select
                  name="horasSoloAlDia"
                  value={formData.horasSoloAlDia}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">-- Selecciona --</option>
                  <option value="menos_4">Menos de 4 horas (5 pts)</option>
                  <option value="4_8">4-8 horas (3 pts)</option>
                  <option value="mas_8">Más de 8 horas (1 pt - Revisión manual)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">¿Quién será el responsable principal? * (5 pts máx)</label>
                <select
                  name="responsablePrincipal"
                  value={formData.responsablePrincipal}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">-- Selecciona --</option>
                  <option value="yo">Yo (5 pts)</option>
                  <option value="compartida">Responsabilidad compartida (3 pts)</option>
                  <option value="no_decidido">No lo hemos decidido (1 pt)</option>
                </select>
              </div>
            </div>
          )}

          {/* SECCIÓN 5: COMPROMISO ECONÓMICO Y SELECCIÓN DE MASCOTA */}
          {seccionActual === 5 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-indigo-700 mb-4">💰 Compromiso Económico</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">¿Cómo manejarías gastos veterinarios de emergencia? * (5 pts máx)</label>
                <select
                  name="actitudGastosVeterinarios"
                  value={formData.actitudGastosVeterinarios}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">-- Selecciona --</option>
                  <option value="pagaria">Pagaría sin dudar (5 pts)</option>
                  <option value="economicas">Buscaría opciones económicas (3 pts)</option>
                  <option value="no_seguro">No estoy seguro (1 pt - Revisión manual)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">¿Estás dispuesto a esterilizar? * (5 pts máx)</label>
                <select
                  name="dispuestoEsterilizar"
                  value={formData.dispuestoEsterilizar}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">-- Selecciona --</option>
                  <option value="prioridad">Sí, es prioridad (5 pts)</option>
                  <option value="no_seguro">No estoy seguro (1 pt - Revisión manual)</option>
                  <option value="no">No (0 pts - Revisión manual obligatoria)</option>
                </select>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-xl font-semibold text-indigo-700 mb-4">🐾 Selección de Mascota</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Selecciona la mascota que deseas adoptar *</label>
                  <select
                    name="idAnimal"
                    value={formData.idAnimal}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  >
                    <option value="">-- Selecciona --</option>
                    {animales.map(animal => (
                      <option key={animal.Id} value={animal.Id}>
                        {animal.nombre} ({animal.especie} - {animal.raza})
                      </option>
                    ))}
                  </select>
                </div>

                {selectedAnimal && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center">
                    <h5 className="font-semibold text-lg mb-2">{selectedAnimal.nombre}</h5>
                    <img
                      src={selectedAnimal.imagenMain}
                      alt={selectedAnimal.nombre}
                      className="max-w-xs mx-auto rounded-lg shadow-md"
                    />
                    <p className="mt-2 text-sm text-gray-600">
                      {selectedAnimal.especie} - {selectedAnimal.raza} - {selectedAnimal.edadAprox}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECCIÓN 6: PREGUNTAS ESPECÍFICAS PARA PERROS */}
          {seccionActual === 6 && formData.tipoAnimal === "perro" && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-indigo-700 mb-4">🐕 Cuidados Específicos para Perros</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">¿Con qué frecuencia sacarías a pasear al perro? * (5 pts máx)</label>
                <select
                  name="frecuenciaPaseos"
                  value={formData.frecuenciaPaseos}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">-- Selecciona --</option>
                  <option value="3_veces">3 o más veces al día (5 pts)</option>
                  <option value="1_2_veces">1-2 veces al día (3 pts)</option>
                  <option value="fines_semana">Solo fines de semana (1 pt)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">¿Cuánto duraría cada paseo? * (5 pts máx)</label>
                <select
                  name="duracionPaseos"
                  value={formData.duracionPaseos}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">-- Selecciona --</option>
                  <option value="mas_30">Más de 30 minutos (5 pts)</option>
                  <option value="15_30">15-30 minutos (3 pts)</option>
                  <option value="menos_15">Menos de 15 minutos (1 pt)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">¿Qué nivel de energía prefieres? * (5 pts máx)</label>
                <select
                  name="nivelEnergiaPreferido"
                  value={formData.nivelEnergiaPreferido}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">-- Selecciona --</option>
                  <option value="alto">Alto - deportista activo (5 pts)</option>
                  <option value="moderado">Moderado - ejercicio regular (3 pts)</option>
                  <option value="tranquilo">Tranquilo - paseos cortos (1 pt)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Disposición para entrenamiento * (5 pts máx)</label>
                <select
                  name="disposicionEntrenamiento"
                  value={formData.disposicionEntrenamiento}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">-- Selecciona --</option>
                  <option value="clases">Tomaré clases profesionales (5 pts)</option>
                  <option value="casa">Lo entrenaré en casa (4 pts)</option>
                  <option value="entrenado">Prefiero perro entrenado (1 pt)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan de socialización * (5 pts máx)</label>
                <select
                  name="planSocializacion"
                  value={formData.planSocializacion}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">-- Selecciona --</option>
                  <option value="parques">Parques, eventos caninos (5 pts)</option>
                  <option value="vecindario">Paseos por el vecindario (3 pts)</option>
                  <option value="casa">Solo en casa y jardín (1 pt)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Conocimiento sobre higiene del perro * (5 pts máx)</label>
                <select
                  name="conocimientoHigiene"
                  value={formData.conocimientoHigiene}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">-- Selecciona --</option>
                  <option value="experto">Soy experto en cuidado (5 pts)</option>
                  <option value="basico">Conozco lo básico (3 pts)</option>
                  <option value="bano">Sé que necesita baños (1 pt)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Frecuencia de baño y cepillado * (5 pts máx)</label>
                <select
                  name="frecuenciaBanoCepillado"
                  value={formData.frecuenciaBanoCepillado}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">-- Selecciona --</option>
                  <option value="semanal">Cepillado diario, baño mensual (5 pts)</option>
                  <option value="mensual">Baño cada 2-3 meses (3 pts)</option>
                  <option value="ensucie">Solo cuando se ensucie (1 pt)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Manejo de muda de pelaje * (5 pts máx)</label>
                <select
                  name="manejoMudaPelaje"
                  value={formData.manejoMudaPelaje}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">-- Selecciona --</option>
                  <option value="herramientas">Uso herramientas especiales (5 pts)</option>
                  <option value="cepillado">Cepillado semanal (3 pts)</option>
                  <option value="no_considerado">No había considerado (1 pt)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Conocimiento del cuidado dental * (5 pts máx)</label>
                <select
                  name="conocimientoCuidadoDental"
                  value={formData.conocimientoCuidadoDental}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">-- Selecciona --</option>
                  <option value="si_metodos">Sí, conozco métodos (5 pts)</option>
                  <option value="importancia">Conozco importancia pero no cómo hacerlo (2 pts)</option>
                  <option value="no_sabia">No sabía que necesitaban (1 pt)</option>
                </select>
              </div>
            </div>
          )}

          {/* SECCIÓN 6: PREGUNTAS ESPECÍFICAS PARA GATOS */}
          {seccionActual === 6 && formData.tipoAnimal === "gato" && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-indigo-700 mb-4">🐱 Cuidados Específicos para Gatos</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">¿Las ventanas están protegidas? * (5 pts máx)</label>
                <select
                  name="ventanasProtegidas"
                  value={formData.ventanasProtegidas}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">-- Selecciona --</option>
                  <option value="todas">Sí, todas (5 pts)</option>
                  <option value="algunas">Algunas (2 pts)</option>
                  <option value="no">No (0 pts - Revisión manual)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adaptación del hogar para gatos * (5 pts máx)</label>
                <select
                  name="adaptacionHogar"
                  value={formData.adaptacionHogar}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">-- Selecciona --</option>
                  <option value="completo">Redes, rascadores, áreas elevadas (5 pts)</option>
                  <option value="basico">Rascadores y arenero (3 pts)</option>
                  <option value="solo_arenero">Solo arenero (1 pt)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Conocimiento sobre higiene del gato * (5 pts máx)</label>
                <select
                  name="conocimientoHigieneGato"
                  value={formData.conocimientoHigieneGato}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">-- Selecciona --</option>
                  <option value="completo">Sí, limpieza completa (5 pts)</option>
                  <option value="basico">Sé que necesitan arenero (3 pts)</option>
                  <option value="ninguno">No tenía idea (1 pt)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Frecuencia de limpieza del arenero * (5 pts máx)</label>
                <select
                  name="frecuenciaLimpiezaArenero"
                  value={formData.frecuenciaLimpiezaArenero}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">-- Selecciona --</option>
                  <option value="diario">Diariamente (5 pts)</option>
                  <option value="cada_2_3">Cada 2-3 días (3 pts)</option>
                  <option value="semanal">Una vez por semana (1 pt)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Manejo del cuidado del pelaje * (5 pts máx)</label>
                <select
                  name="manejoCuidadoPelaje"
                  value={formData.manejoCuidadoPelaje}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">-- Selecciona --</option>
                  <option value="regular">Cepillado regular (5 pts)</option>
                  <option value="ocasional">Cepillado ocasional (3 pts)</option>
                  <option value="ninguno">Se limpian solos (1 pt)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Conocimiento de higiene dental * (5 pts máx)</label>
                <select
                  name="conocimientoHigieneDental"
                  value={formData.conocimientoHigieneDental}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">-- Selecciona --</option>
                  <option value="si_metodos">Sí, conozco métodos (5 pts)</option>
                  <option value="importancia">Conozco importancia (2 pts)</option>
                  <option value="no_sabia">No sabía (1 pt)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Personalidad preferida * (5 pts máx)</label>
                <select
                  name="personalidadPreferida"
                  value={formData.personalidadPreferida}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">-- Selecciona --</option>
                  <option value="sin_preferencia">No tengo preferencia (5 pts)</option>
                  <option value="carinoso">Cariñoso y sociable (3 pts)</option>
                  <option value="independiente">Independiente y tranquilo (3 pts)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan de enriquecimiento ambiental * (5 pts máx)</label>
                <select
                  name="planEnriquecimiento"
                  value={formData.planEnriquecimiento}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">-- Selecciona --</option>
                  <option value="completo">Juguetes, rascadores, interacción (5 pts)</option>
                  <option value="basico">Algunos juguetes (3 pts)</option>
                  <option value="ninguno">No había considerado (1 pt)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de alimentación * (5 pts máx)</label>
                <select
                  name="tipoAlimentacion"
                  value={formData.tipoAlimentacion}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">-- Selecciona --</option>
                  <option value="balanceada">Comida balanceada de calidad (5 pts)</option>
                  <option value="regular">Comida de gatos regular (3 pts)</option>
                  <option value="sobras">Sobras de comida (1 pt)</option>
                </select>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="consideraDesungulacion"
                    checked={formData.consideraDesungulacion}
                    onChange={handleChange}
                    className="mr-2 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-red-700">
                    ¿Considerarías la desungulación? (Si marcas esto, se rechazará automáticamente)
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* SECCIÓN 7: RESUMEN Y ENVÍO */}
          {seccionActual === 7 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-indigo-700 mb-4">📝 Resumen de tu Solicitud</h3>
              
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-semibold text-gray-700">Nombre:</span>
                  <span className="text-gray-900">{formData.nombreCompleto}</span>
                </div>
                
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-semibold text-gray-700">Edad:</span>
                  <span className="text-gray-900">{formData.edad} años</span>
                </div>
                
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-semibold text-gray-700">Correo:</span>
                  <span className="text-gray-900">{formData.correo}</span>
                </div>
                
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-semibold text-gray-700">Tipo de vivienda:</span>
                  <span className="text-gray-900">{formData.tipoVivienda}</span>
                </div>
                
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-semibold text-gray-700">Animal seleccionado:</span>
                  <span className="text-gray-900">{selectedAnimal ? selectedAnimal.nombre : "No seleccionado"}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-700">Tipo de animal:</span>
                  <span className="text-gray-900 capitalize">{formData.tipoAnimal || "No especificado"}</span>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-yellow-800">
                  <strong>⚠️ Importante:</strong> Al enviar esta solicitud, un miembro de nuestro equipo revisará tu perfil. 
                  Te contactaremos por correo electrónico o teléfono en un plazo de 3-5 días hábiles con el resultado de tu evaluación.
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-green-800">
                  <strong>✅ Verifica que toda la información sea correcta</strong> antes de enviar. 
                  Si necesitas hacer cambios, puedes regresar a las secciones anteriores usando el botón "Anterior".
                </p>
              </div>
            </div>
          )}

          {/* BOTONES DE NAVEGACIÓN */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            {seccionActual > 1 && (
              <button
                type="button"
                onClick={anterior}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                ← Anterior
              </button>
            )}
            
            {seccionActual < 7 && (
              <button
                type="button"
                onClick={siguiente}
                className="ml-auto px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Siguiente →
              </button>
            )}
            
            {seccionActual === 7 && (
              <button
                type="submit"
                className="ml-auto px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold text-lg shadow-lg"
              >
                📨 Enviar Solicitud
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Solicitud;