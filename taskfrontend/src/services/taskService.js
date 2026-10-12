import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:1234/get",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllTasks = async () => {
  const response = await api.get("/Alldata");
  return response.data;
};

export const getTaskById = async (id) => {
  const response = await api.get(`/${id}`);
  return response.data;
};

export const createTask = async (task) => {
  const response = await api.post("/postdata", task);
  return response.data;
};

export const updateTask = async (id, task) => {
  const response = await api.put(`/update/${id}`, task);
  return response.data;
};

export const deleteTask = async (id) => {
  await api.delete(`/delete/${id}`);
};