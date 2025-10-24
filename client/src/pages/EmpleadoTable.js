import React from "react";

function EmpleadoTable({ empleadosList, editarEmpleado, eliminar }) {
  return (
    <table className="table table-striped mt-4 empleado-table">
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
              <button className="btn btn-info m-1" onClick={() => editarEmpleado(val)}>Editar</button>
              <button className="btn btn-danger m-1" onClick={() => eliminar(val.id)}>Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default EmpleadoTable;
