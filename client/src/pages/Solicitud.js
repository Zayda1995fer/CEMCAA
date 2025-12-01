import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const Solicitud = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [animal, setAnimal] = useState(null);
  const [seccionActual, setSeccionActual] = useState(1);
  const totalSecciones = 6;

  const [formData, setFormData] = useState({
    // Sección 1: selección
    animal_id: id || "",
    nombre_animal: "",

    // Sección 2: Vivienda
    tipo_vivienda: "",
    vivienda_alquilada: "",
    permiso_escrito: "",
    patio: "",
    tamano_patio: "",

    // Sección 3: Hogar y familia
    personas_hogar: "",
    ninos_hogar: "",
    edades_ninos: "",
    alergias: "",
    otras_mascotas: "",
    cuales_mascotas: "",

    // Sección 4: Experiencia
    motivo_adopcion: "",
    experiencia_previas: "",
    tiempo_solo: "",
    responsable_principal: "",

    // Sección 5: Económico
    dispuesto_esterilizar: "",
    gastos_veterinarios: "",
    presupuesto_mensual: "",

    // Sección 6: Preferencias Perros / Gatos
    prefiere_animal: "",
    // Perros
    paseos_diarios: "",
    duracion_paseos: "",
    energia_perro: "",
    entrenamiento: "",
    socializacion: "",
    banio: "",
    muda: "",
    cuidado_dental_perro: "",
    // Gatos
    ventanas_protegidas: "",
    adaptacion_gatos: "",
    higiene_gato: "",
    arenero: "",
    pelaje_gato: "",
    cuidado_dental_gato: "",
    personalidad_gato: "",
    enriquecimiento: "",
    alimentacion_gato: "",
    desungulacion: false,
  });

  // =============================
  // Cargar datos del animal
  // =============================
  useEffect(() => {
    if (id) {
      axios.get(`/api/animales/${id}`).then((res) => {
        setAnimal(res.data);

        setFormData((prev) => ({
          ...prev,
          animal_id: id,
          nombre_animal: res.data.nombre,
        }));
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const siguiente = () => {
    if (seccionActual < totalSecciones) setSeccionActual(seccionActual + 1);
  };

  const anterior = () => {
    if (seccionActual > 1) setSeccionActual(seccionActual - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/solicitudes", formData);
      navigate("/solicitud-enviada");
    } catch (error) {
      console.error("Error al enviar solicitud", error);
      alert("Hubo un error al enviar tu solicitud.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">

      {/* Barra de progreso */}
      <div className="w-full bg-gray-300 rounded-full h-3 mb-6">
        <div
          className="bg-green-500 h-3 rounded-full"
          style={{ width: `${(seccionActual / totalSecciones) * 100}%` }}
        ></div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* =========================
            SECCIÓN 1: SELECCIÓN
        ========================== */}
        {seccionActual === 1 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Selecciona tu mascota</h2>

            {animal ? (
              <div className="p-4 border rounded-lg shadow-sm bg-gray-100">
                <img
                  src={animal.imagenMain}   // <--- CORREGIDO
                  alt={animal.nombre}
                  className="w-40 h-40 object-cover rounded-lg mx-auto"
                />
                <h3 className="text-center text-lg font-semibold mt-2">
                  {animal.nombre}
                </h3>
                <p className="text-center text-gray-600">
                  {animal.especie} · {animal.raza}
                </p>
              </div>
            ) : (
              <p>Cargando datos...</p>
            )}
          </div>
        )}

        {/* =========================
            SECCIÓN 2: VIVIENDA
        ========================== */}
        {seccionActual === 2 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Información de vivienda</h2>

            <label className="block mt-3">Tipo de vivienda</label>
            <select name="tipo_vivienda" value={formData.tipo_vivienda} onChange={handleChange} className="input">
              <option value="">Selecciona</option>
              <option>Casa</option>
              <option>Departamento</option>
              <option>Rancho</option>
            </select>

            <label className="block mt-3">¿Es alquilada?</label>
            <select
              name="vivienda_alquilada"
              value={formData.vivienda_alquilada}
              onChange={handleChange}
              className="input"
            >
              <option value="">Selecciona</option>
              <option>Sí</option>
              <option>No</option>
            </select>

            {formData.vivienda_alquilada === "Sí" && (
              <>
                <label className="block mt-3">¿Cuentas con permiso escrito?</label>
                <select
                  name="permiso_escrito"
                  value={formData.permiso_escrito}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Selecciona</option>
                  <option>Sí</option>
                  <option>No</option>
                </select>
              </>
            )}

            <label className="block mt-3">¿Tienes patio?</label>
            <select name="patio" value={formData.patio} onChange={handleChange} className="input">
              <option value="">Selecciona</option>
              <option>Sí</option>
              <option>No</option>
            </select>

            {formData.patio === "Sí" && (
              <input
                type="text"
                name="tamano_patio"
                className="input mt-3"
                placeholder="Tamaño del patio"
                value={formData.tamano_patio}
                onChange={handleChange}
              />
            )}
          </div>
        )}

        {/* =========================
            SECCIÓN 3: HOGAR Y FAMILIA
        ========================== */}
        {seccionActual === 3 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Hogar y familia</h2>

            <label className="block mt-3">¿Cuántas personas viven contigo?</label>
            <input
              type="number"
              name="personas_hogar"
              className="input"
              value={formData.personas_hogar}
              onChange={handleChange}
            />

            <label className="block mt-3">¿Hay niños en casa?</label>
            <select name="ninos_hogar" value={formData.ninos_hogar} onChange={handleChange} className="input">
              <option value="">Selecciona</option>
              <option>Sí</option>
              <option>No</option>
            </select>

            {formData.ninos_hogar === "Sí" && (
              <input
                type="text"
                name="edades_ninos"
                className="input mt-3"
                placeholder="Edades de los niños"
                value={formData.edades_ninos}
                onChange={handleChange}
              />
            )}

            <label className="block mt-3">¿Alguien tiene alergias?</label>
            <select name="alergias" value={formData.alergias} onChange={handleChange} className="input">
              <option value="">Selecciona</option>
              <option>Sí</option>
              <option>No</option>
            </select>

            <label className="block mt-3">¿Tienes otras mascotas?</label>
            <select name="otras_mascotas" value={formData.otras_mascotas} onChange={handleChange} className="input">
              <option value="">Selecciona</option>
              <option>Sí</option>
              <option>No</option>
            </select>

            {formData.otras_mascotas === "Sí" && (
              <textarea
                name="cuales_mascotas"
                className="input mt-3"
                placeholder="¿Cuáles?"
                value={formData.cuales_mascotas}
                onChange={handleChange}
              ></textarea>
            )}
          </div>
        )}

        {/* =========================
            SECCIÓN 4: EXPERIENCIA
        ========================== */}
        {seccionActual === 4 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Experiencia y motivación</h2>

            <textarea
              name="motivo_adopcion"
              className="input mt-3"
              placeholder="¿Por qué deseas adoptar?"
              value={formData.motivo_adopcion}
              onChange={handleChange}
            ></textarea>

            <textarea
              name="experiencia_previas"
              className="input mt-3"
              placeholder="¿Tienes experiencia previa con mascotas?"
              value={formData.experiencia_previas}
              onChange={handleChange}
            ></textarea>

            <label className="block mt-3">¿Cuántas horas estará solo?</label>
            <input
              type="text"
              name="tiempo_solo"
              className="input"
              value={formData.tiempo_solo}
              onChange={handleChange}
            />

            <label className="block mt-3">Responsable principal</label>
            <input
              type="text"
              name="responsable_principal"
              className="input"
              value={formData.responsable_principal}
              onChange={handleChange}
            />
          </div>
        )}

        {/* =========================
            SECCIÓN 5: ECONÓMICO
        ========================== */}
        {seccionActual === 5 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Compromiso económico</h2>

            <label>¿Estás dispuesto a esterilizar si no lo está?</label>
            <select
              name="dispuesto_esterilizar"
              value={formData.dispuesto_esterilizar}
              onChange={handleChange}
              className="input mt-3"
            >
              <option value="">Selecciona</option>
              <option>Sí</option>
              <option>No</option>
            </select>

            <label className="block mt-3">¿Puedes cubrir gastos veterinarios?</label>
            <select
              name="gastos_veterinarios"
              value={formData.gastos_veterinarios}
              onChange={handleChange}
              className="input"
            >
              <option value="">Selecciona</option>
              <option>Sí</option>
              <option>No</option>
            </select>

            <label className="block mt-3">Presupuesto mensual estimado</label>
            <input
              type="number"
              name="presupuesto_mensual"
              className="input"
              value={formData.presupuesto_mensual}
              onChange={handleChange}
            />
          </div>
        )}

        {/* =========================
            SECCIÓN 6: PREFERENCIAS
        ========================== */}
        {seccionActual === 6 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Preferencias del animal</h2>

            <label>¿Prefieres perro, gato o sin preferencia?</label>
            <select
              name="prefiere_animal"
              value={formData.prefiere_animal}
              onChange={handleChange}
              className="input mt-3"
            >
              <option value="">Selecciona</option>
              <option>Perro</option>
              <option>Gato</option>
              <option>Sin preferencia</option>
            </select>

            {/* Perros */}
            {(formData.prefiere_animal === "Perro" ||
              formData.prefiere_animal === "Sin preferencia") && (
              <div className="mt-6 border-t pt-4">
                <h3 className="font-bold mb-2">Preferencias para perros</h3>

                <label>Paseos diarios</label>
                <select
                  name="paseos_diarios"
                  value={formData.paseos_diarios}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Selecciona</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3 o más</option>
                </select>

                <label className="mt-3">Duración de paseos</label>
                <input
                  type="text"
                  name="duracion_paseos"
                  className="input"
                  value={formData.duracion_paseos}
                  onChange={handleChange}
                />

                <label className="mt-3">Nivel de energía</label>
                <select
                  name="energia_perro"
                  value={formData.energia_perro}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Selecciona</option>
                  <option>Baja</option>
                  <option>Media</option>
                  <option>Alta</option>
                </select>

                <label className="mt-3">Entrenamiento</label>
                <select
                  name="entrenamiento"
                  value={formData.entrenamiento}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Selecciona</option>
                  <option>Necesita básico</option>
                  <option>Intermedio</option>
                  <option>Avanzado</option>
                </select>

                <label className="mt-3">Socialización</label>
                <select
                  name="socializacion"
                  value={formData.socializacion}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Selecciona</option>
                  <option>Con otros perros</option>
                  <option>Con personas</option>
                  <option>Ambos</option>
                </select>

                <label className="mt-3">Baño</label>
                <select
                  name="banio"
                  value={formData.banio}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Selecciona</option>
                  <option>Semanal</option>
                  <option>Quincenal</option>
                  <option>Mensual</option>
                </select>

                <label className="mt-3">Muda</label>
                <select
                  name="muda"
                  value={formData.muda}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Selecciona</option>
                  <option>Poca</option>
                  <option>Moderada</option>
                  <option>Mucha</option>
                </select>

                <label className="mt-3">Cuidado dental</label>
                <select
                  name="cuidado_dental_perro"
                  value={formData.cuidado_dental_perro}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Selecciona</option>
                  <option>Bajo</option>
                  <option>Medio</option>
                  <option>Alto</option>
                </select>
              </div>
            )}

            {/* Gatos */}
            {(formData.prefiere_animal === "Gato" ||
              formData.prefiere_animal === "Sin preferencia") && (
              <div className="mt-6 border-t pt-4">
                <h3 className="font-bold mb-2">Preferencias para gatos</h3>

                <label>¿Tus ventanas están protegidas?</label>
                <select
                  name="ventanas_protegidas"
                  value={formData.ventanas_protegidas}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Selecciona</option>
                  <option>Sí</option>
                  <option>No</option>
                </select>

                <label className="mt-3">Adaptación a otros gatos</label>
                <select
                  name="adaptacion_gatos"
                  value={formData.adaptacion_gatos}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Selecciona</option>
                  <option>Buena</option>
                  <option>Regular</option>
                  <option>Mala</option>
                </select>

                <label className="mt-3">Higiene</label>
                <select
                  name="higiene_gato"
                  value={formData.higiene_gato}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Selecciona</option>
                  <option>Básica</option>
                  <option>Media</option>
                  <option>Alta</option>
                </select>

                <label className="mt-3">Arenero</label>
                <select
                  name="arenero"
                  value={formData.arenero}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Selecciona</option>
                  <option>Abierto</option>
                  <option>Cerrado</option>
                </select>

                <label className="mt-3">Pelaje</label>
                <select
                  name="pelaje_gato"
                  value={formData.pelaje_gato}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Selecciona</option>
                  <option>Corto</option>
                  <option>Medio</option>
                  <option>Largo</option>
                </select>

                <label className="mt-3">Cuidado dental</label>
                <select
                  name="cuidado_dental_gato"
                  value={formData.cuidado_dental_gato}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Selecciona</option>
                  <option>Bajo</option>
                  <option>Medio</option>
                  <option>Alto</option>
                </select>

                <label className="mt-3">Personalidad del gato</label>
                <select
                  name="personalidad_gato"
                  value={formData.personalidad_gato}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Selecciona</option>
                  <option>Tranquilo</option>
                  <option>Juguetón</option>
                  <option>Independiente</option>
                </select>

                <label className="mt-3">Enriquecimiento</label>
                <input
                  type="text"
                  name="enriquecimiento"
                  className="input"
                  value={formData.enriquecimiento}
                  onChange={handleChange}
                />

                <label className="mt-3">Alimentación</label>
                <input
                  type="text"
                  name="alimentacion_gato"
                  className="input"
                  value={formData.alimentacion_gato}
                  onChange={handleChange}
                />

                <div className="flex items-center gap-2 mt-3">
                  <input
                    type="checkbox"
                    name="desungulacion"
                    checked={formData.desungulacion}
                    onChange={handleChange}
                  />
                  <label>No practicaría desungulación</label>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ---------- Navegación ---------- */}
        <div className="flex justify-between mt-6">
          {seccionActual > 1 && (
            <button
              type="button"
              onClick={anterior}
              className="px-4 py-2 bg-gray-400 text-white rounded-md"
            >
              Anterior
            </button>
          )}

          {seccionActual < totalSecciones ? (
            <button
              type="button"
              onClick={siguiente}
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Siguiente
            </button>
          ) : (
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md"
            >
              Enviar Solicitud
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Solicitud;
