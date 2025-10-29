import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

function Solicitud() {
  const [animales, setAnimales] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [seccionActual, setSeccionActual] = useState(1);

  const initialFormData = {
    usuario_id: "", // ID del usuario logueado
    animal_id: "",
    mensaje: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    axios.get("http://localhost:3001/animales")
      .then(res => setAnimales(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === "animal_id") {
      const animal = animales.find(a => a.Id === parseInt(value));
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

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post("http://localhost:3001/solicitudes", formData)
      .then(res => {
        alert("Solicitud enviada con éxito");
        setFormData(initialFormData);
        setSelectedAnimal(null);
        setSeccionActual(1);
      })
      .catch(err => {
        console.error(err);
        alert("Error al enviar la solicitud");
      });
  };

  return (
    <div className="solicitud-container min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="solicitud-card max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Solicitud de Adopción</h2>
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-gray-600">Sección {seccionActual} de 2</span>
            <div className="flex-1 mx-4 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 transition-all duration-300"
                style={{ width: `${(seccionActual / 2) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {seccionActual === 1 && (
            <div>
              <label className="block mb-2 font-semibold">Selecciona un Animal:</label>
              <select name="animal_id" value={formData.animal_id} onChange={handleChange} className="w-full border p-2 rounded">
                <option value="">-- Selecciona --</option>
                {animales.map(animal => (
                  <option key={animal.Id} value={animal.Id}>{animal.nombre}</option>
                ))}
              </select>

              {selectedAnimal && (
                <p className="mt-3 text-gray-600">Has seleccionado a <b>{selectedAnimal.nombre}</b>.</p>
              )}
            </div>
          )}

          {seccionActual === 2 && (
            <div>
              <label className="block mb-2 font-semibold">Mensaje adicional:</label>
              <textarea
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                placeholder="Cuéntanos por qué quieres adoptar..."
                className="w-full border p-2 rounded h-28"
              />
            </div>
          )}

          <div className="flex justify-between mt-6">
            {seccionActual > 1 && (
              <button type="button" onClick={anterior} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                Anterior
              </button>
            )}
            {seccionActual < 2 && (
              <button type="button" onClick={siguiente} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 ml-auto">
                Siguiente
              </button>
            )}
            {seccionActual === 2 && (
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 ml-auto">
                Enviar Solicitud
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Solicitud;
