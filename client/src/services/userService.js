import axios from "axios";
const baseUrl = "http://localhost:3003/api/users";

const create = (newObject) => {
  return axios.post(baseUrl, newObject);
};

//REFACTOR THESE TO USE FIREBASE AUTH TOKEN IN HEADER

const getAll = () => {
  return axios.get(baseUrl);
};

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject);
};

const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`);
};

export default {
  getAll,
  create,
  update,
  remove,
};
