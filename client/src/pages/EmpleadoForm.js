import React from "react";

function EmpleadoForm({
  nombre, setNombre,
  edad, setEdad,
  pais, setPais,
  cargo, setCargo,
  años, setAños,
  editar,
  onSubmit,
  onCancel
}) {
  return (
    <div className="card text-center mb-4 empleado-form">
      <div className="card-header">Gestión de Empleados</div>
      <div className="card-body">
        <div className="input-group mb-3">
          <input
            type="text"
            placeholder="Nombre"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <input
            type="number"
            placeholder="Edad"
            className="form-control"
            value={edad}
            onChange={(e) => setEdad(e.target.value)}
          />
          <input
            type="text"
            placeholder="País"
            className="form-control"
            value={pais}
            onChange={(e) => setPais(e.target.value)}
          />
        </div>
        <div className="input-group mb-3">
          <input
            type="text"
            placeholder="Cargo"
            className="form-control"
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
          />
          <input
            type="number"
            placeholder="Años de experiencia"
            className="form-control"
            value={años}
            onChange={(e) => setAños(e.target.value)}
          />
        </div>
        {editar ? (
          <div>
            <button className="btn btn-warning m-2" onClick={onSubmit}>Actualizar</button>
            <button className="btn btn-secondary m-2" onClick={onCancel}>Cancelar</button>
          </div>
        ) : (
          <button className="btn btn-success" onClick={onSubmit}>Registrar</button>
        )}
      </div>
    </div>
  );
}

export default EmpleadoForm;
