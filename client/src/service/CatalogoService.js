// src/pages/CatalogoService.js
import Axios from "axios";

const API_URL = "http://localhost:3001/animales";

export const getMascotasService = async () => {
  const res = await Axios.get(API_URL);
  return res.data;
};

export const createMascotaService = async (formData) => {
  await Axios.post(`${API_URL}/create`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateMascotaService = async (formData) => {
  await Axios.put(`${API_URL}/update`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteMascotaService = async (id) => {
  await Axios.delete(`${API_URL}/delete/${id}`);
};
