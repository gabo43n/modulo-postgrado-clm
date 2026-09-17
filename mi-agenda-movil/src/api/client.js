import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:3000/api/clm';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true, // Importante para que el servidor reconozca la sesión
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('clmToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;