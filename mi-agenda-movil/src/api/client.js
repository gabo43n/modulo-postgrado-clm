import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = "https://unhearing-smartness-unless.ngrok-free.dev/api/clm";
console.log("API_URL:", API_URL); // Agrega esta línea para depuración
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use(
  async (config) => {
    // No enviar token en peticiones de login o logout
    if (
      config.url?.includes("/auth/login") ||
      config.url?.includes("/auth/logout")
    ) {
      return config;
    }

    const token = await AsyncStorage.getItem("clmToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default apiClient;
