import axios from "axios";
import { auth } from "../config/firebase-config";
const baseUrl = "http://localhost:3003/api/conversations/";

const getAll = async (id, pagination) => {
  const token = await auth.currentUser.getIdToken();
  const url = `${baseUrl}${id}/messages`;
  return axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
    params: { limit: pagination.limit, skip: pagination.skip },
  });
};

const create = async (id, body) => {
  const token = await auth.currentUser.getIdToken();
  const url = `${baseUrl}${id}/messages`;
  return axios.post(url, body, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export default { getAll, create };
