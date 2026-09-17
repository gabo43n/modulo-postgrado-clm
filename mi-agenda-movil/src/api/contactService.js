import apiClient from './client';

export const contactService = {
  async getContacts(page = 1, search = '') {
    try {
      const response = await apiClient.get(`/contacts`, {
        params: { page, search }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error('Error al obtener contactos');
    }
  },

  async createContact(contactData) {
    try {
      const response = await apiClient.post('/contacts', contactData);
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error('Error al crear contacto');
    }
  },

  async toggleFavorite(id) {
    try {
      const response = await apiClient.patch(`/contacts/${id}/
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error('Error al marcar favorito');
    }
  },

  async syncContacts(since) {
    try {
      const response = await apiClient.get(`/contacts/sync`, {
        params: { since }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error('Error de sincro
    }
  }
};