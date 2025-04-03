import axios from "axios";
import { BASE_URL } from "./constants";

const axiosInstance = axios.create({
  baseURL: BASE_URL, // Base URL del backend
  timeout: 10000,
  headers: {
    "Content-Type": "application/json", // Header correcto para enviar JSON
  },
  withCredentials: true, // Permite el envío de cookies entre frontend y backend
});

export default axiosInstance;
