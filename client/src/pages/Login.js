import React, { useState, useEffect } from "react";
import Axios from "axios";

function Empleados() {
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState(0);
  const [pais, setPais] = useState("");
  const [cargo, setCargo] = useState("");
  const [años, setAños] = useState(0);
  const [id, setId] = useState(null);
  const [editar, setEditar] = useState(false);
  const [empleadosList, setEmpleados] = useState([]);

  // Crear empleado
  const add = () => {
    Axios.post("http://localhost:3001/create", {
      nombre: nombre,
      edad: edad,
      pais: pais,
      cargo: cargo,
      años: años,
    }).then(() => {
      getEmpleados();
      limpiarCampos();
    });
  };

  // Obtener empleados
  const getEmpleados = () => {
    Axios.get("http://localhost:3001/empleados").then((response) => {
      setEmpleados(response.data);
    });
  };

  // Actualizar empleado
  const update = () => {
    Axios.put("http://localhost:3001/update", {
      id: id,
      nombre: nombre,
      edad: edad,
      pais: pais,
      cargo: cargo,
      años: años,
    }).then(() => {
      getEmpleados();
      limpiarCampos();
      setEditar(false);
    });
  };

  // Eliminar empleado
  const eliminar = (id) => {
    Axios.delete(`http://localhost:3001/delete/${id}`).then(() => {
      getEmpleados();
    });
  };

  // Llenar formulario con datos al editar
  const editarEmpleado = (val) => {
    setEditar(true);
    setId(val.id);
    setNombre(val.nombre);
    setEdad(val.edad);
    setPais(val.pais);
    setCargo(val.cargo);
    setAños(val.años);
  };

  // Limpiar campos
  const limpiarCampos = () => {
    setId(null);
    setNombre("");
    setEdad(0);
    setPais("");
    setCargo("");
    setAños(0);
  };

  useEffect(() => {
    getEmpleados();
  }, []);

  return (
    <div className="container">
      <div className="card text-center">
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
              <button className="btn btn-warning m-2" onClick={update}>
                Actualizar
              </button>
              <button className="btn btn-secondary m-2" onClick={limpiarCampos}>
                Cancelar
              </button>
            </div>
          ) : (
            <button className="btn btn-success" onClick={add}>
              Registrar
            </button>
          )}
        </div>
      </div>

      <table className="table table-striped mt-4">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Edad</th>
            <th>País</th>
            <th>Cargo</th>
            <th>Años</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empleadosList.map((val) => (
            <tr key={val.id}>
              <td>{val.nombre}</td>
              <td>{val.edad}</td>
              <td>{val.pais}</td>
              <td>{val.cargo}</td>
              <td>{val.años}</td>
              <td>
                <button
                  className="btn btn-info m-1"
                  onClick={() => editarEmpleado(val)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger m-1"
                  onClick={() => eliminar(val.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Empleados;
