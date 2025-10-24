import Axios from "axios";

const API_URL = "http://localhost:3001";

export const getEmpleadosService = async () => {
  const response = await Axios.get(`${API_URL}/empleados`);
  return response.data;
};

export const createEmpleadoService = async (empleado) => {
  await Axios.post(`${API_URL}/create`, empleado);
};

export const updateEmpleadoService = async (empleado) => {
  await Axios.put(`${API_URL}/update`, empleado);
};

export const deleteEmpleadoService = async (id) => {
  await Axios.delete(`${API_URL}/delete/${id}`);
};
