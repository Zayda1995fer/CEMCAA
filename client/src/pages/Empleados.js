import React, { useState, useEffect } from "react";
import Axios from "axios";

function Empleados() {
  const [id, setId] = useState(null);
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [pais, setPais] = useState("");
  const [cargo, setCargo] = useState("");
  const [años, setAños] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Generada automáticamente
  const [editar, setEditar] = useState(false);
  const [empleadosList, setEmpleados] = useState([]);

  // Generar contraseña segura automáticamente
  useEffect(() => {
    if (nombre && edad && pais && cargo && años && email) {
      // Generar contraseña combinando campos + número aleatorio
      const base = nombre.split(" ")[0].toLowerCase();
      const cargoPart = cargo.substring(0, 3).toLowerCase();
      const paisPart = pais.substring(0, 2).toUpperCase();
      const random = Math.floor(Math.random() * 900 + 100); // número de 3 cifras
      const pass = `${base}${cargoPart}${random}${paisPart}!`;
      setPassword(pass);
    } else {
      setPassword("");
    }
  }, [nombre, edad, pais, cargo, años, email]);

  // Crear empleado
  const add = () => {
    Axios.post("http://localhost:3001/empleados/create", {
      nombre,
      edad,
      pais,
      cargo,
      años,
      email,
      password,
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
    Axios.put("http://localhost:3001/empleados/update", {
      id,
      nombre,
      edad,
      pais,
      cargo,
      años,
      email,
      password,
    }).then(() => {
      getEmpleados();
      limpiarCampos();
      setEditar(false);
    });
  };

  // Eliminar empleado
  const eliminar = (id) => {
    Axios.delete(`http://localhost:3001/empleados/delete/${id}`).then(() => {
      getEmpleados();
    });
  };

  // Llenar formulario al editar
  const editarEmpleado = (val) => {
    setEditar(true);
    setId(val.id);
    setNombre(val.nombre);
    setEdad(val.edad);
    setPais(val.pais);
    setCargo(val.cargo);
    setAños(val.años);
    setEmail(val.email);
    setPassword(val.password);
  };

  // Limpiar campos
  const limpiarCampos = () => {
    setId(null);
    setNombre("");
    setEdad("");
    setPais("");
    setCargo("");
    setAños("");
    setEmail("");
    setPassword("");
  };

  useEffect(() => {
    getEmpleados();
  }, []);

  return (
    <div className="container mt-4">
      <div className="card text-center shadow-lg">
        <div className="card-header bg-primary text-white fs-5 fw-bold">
          Gestión de Empleados
        </div>
        <div className="card-body">
          <div className="input-group mb-3">
            <input
              type="text"
              placeholder="Nombre completo"
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

          <div className="input-group mb-3">
            <input
              type="email"
              placeholder="Correo electrónico"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="text"
              placeholder="Contraseña generada automáticamente"
              className="form-control"
              value={password}
              readOnly
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

      <table className="table table-striped mt-4 text-center align-middle shadow-sm">
        <thead className="table-primary">
          <tr>
            <th>Nombre</th>
            <th>Edad</th>
            <th>País</th>
            <th>Cargo</th>
            <th>Años</th>
            <th>Email</th>
            <th>Contraseña</th>
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
              <td>{val.email}</td>
              <td>
                <input
                  type="text"
                  value={val.password}
                  className="form-control text-center"
                  readOnly
                />
              </td>
              <td>
                <button
                  className="btn btn-info btn-sm m-1"
                  onClick={() => editarEmpleado(val)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm m-1"
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
