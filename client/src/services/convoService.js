import axios from "axios";
import { auth } from "../config/firebase-config";
const baseUrl = "http://localhost:3003/api/conversations";

const getAll = async () => {
  const token = await auth.currentUser.getIdToken();
  return axios.get(baseUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const create = async (object) => {
  const token = await auth.currentUser.getIdToken();
  return axios.post(baseUrl, object, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const update = () => {};

const remove = () => {};

export default {
  getAll,
  create,
  update,
  remove,
};
