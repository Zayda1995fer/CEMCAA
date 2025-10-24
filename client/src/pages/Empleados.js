import React, { useState, useEffect } from "react";
import Axios from "axios";
import EmpleadoForm from "./EmpleadoForm";
import EmpleadoTable from "./EmpleadoTable";

function Empleados() {
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState(0);
  const [pais, setPais] = useState("");
  const [cargo, setCargo] = useState("");
  const [años, setAños] = useState(0);
  const [id, setId] = useState(null);
  const [editar, setEditar] = useState(false);
  const [empleadosList, setEmpleados] = useState([]);

  const getEmpleados = () => {
    Axios.get("http://localhost:3001/empleados").then((res) => setEmpleados(res.data));
  };

  const add = () => {
    Axios.post("http://localhost:3001/create", { nombre, edad, pais, cargo, años })
      .then(() => { getEmpleados(); limpiarCampos(); });
  };

  const update = () => {
    Axios.put("http://localhost:3001/update", { id, nombre, edad, pais, cargo, años })
      .then(() => { getEmpleados(); limpiarCampos(); setEditar(false); });
  };

  const eliminar = (id) => {
    Axios.delete(`http://localhost:3001/delete/${id}`).then(() => getEmpleados());
  };

  const editarEmpleado = (val) => {
    setEditar(true);
    setId(val.id);
    setNombre(val.nombre);
    setEdad(val.edad);
    setPais(val.pais);
    setCargo(val.cargo);
    setAños(val.años);
  };

  const limpiarCampos = () => {
    setId(null); setNombre(""); setEdad(0); setPais(""); setCargo(""); setAños(0);
    setEditar(false);
  };

  useEffect(() => { getEmpleados(); }, []);

  return (
    <div className="container">
      <EmpleadoForm
        nombre={nombre} setNombre={setNombre}
        edad={edad} setEdad={setEdad}
        pais={pais} setPais={setPais}
        cargo={cargo} setCargo={setCargo}
        años={años} setAños={setAños}
        editar={editar} onSubmit={editar ? update : add} onCancel={limpiarCampos}
      />
      <EmpleadoTable empleadosList={empleadosList} editarEmpleado={editarEmpleado} eliminar={eliminar} />
    </div>
  );
}

export default Empleados;
