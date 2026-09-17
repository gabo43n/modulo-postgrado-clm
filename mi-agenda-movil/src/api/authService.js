import apiClient from './client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  async login(email, password) {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { token, user } = response.data;

      // Guardamos el token y los datos del usuario para persistencia
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(user));

      return response.data;
    } catch (error) {
      throw error.response?.data || new Error('Error en el login');
    }
  },

  async register(name, email, password) {
    try {
      const response = await apiClient.post('/auth/register',
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error('Error en el registro');
    }
  },

  async logout() {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
  }
};