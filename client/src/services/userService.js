import axios from "axios";
const baseUrl = `${import.meta.env.VITE_BASEURL}/api/users`;
import { auth } from "../config/firebase-config";

const create = (newObject) => {
  return axios.post(baseUrl, newObject);
};

const getUser = async (userID) => {
  const token = await auth.currentUser.getIdToken();
  const url = `${baseUrl}/${userID}`;
  return axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const getUserFirebaseUID = async () => {
  const token = await auth.currentUser.getIdToken();
  const url = `${baseUrl}/firebase`;
  return axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const update = async (id, newObject) => {
  const token = await auth.currentUser.getIdToken();
  const url = `${baseUrl}/${id}`;
  return axios.put(url, newObject, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export default {
  getUser,
  getUserFirebaseUID,
  create,
  update,
};
