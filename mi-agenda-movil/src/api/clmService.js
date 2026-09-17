import apiClient from './client';

export const clmService = {
  async login(u, p) {
    const r = await apiClient.post('/auth/login', { username: u, password: p });
    return r.data;
  },
  async getEmpresas() {
    const r = await apiClient.get('/empresas');
    return r.data;
  },
  async createEmpresa(d) {
    const r = await apiClient.post('/empresas', d);
    return r.data;
  },
  async updateEmpresa(id, d) {
    const r = await apiClient.put(`/empresas/${id}`, d);
    return r.data;
  },
  async deleteEmpresa(id) {
    await apiClient.delete(`/empresas/${id}`);
    return true;
  },
  async getContratos(id) {
    const r = await apiClient.get('/contratos');
    return r.data.filter(c => c.id_empresa === id);
  },
  async createContrato(d) {
    const r = await apiClient.post('/contratos', d);
    return r.data;
  },
  async updateContrato(id, d) {
    const r = await apiClient.put(`/contratos/${id}`, d);
    return r.data;
  },
  async deleteContrato(id) {
    await apiClient.delete(`/contratos/${id}`);
    return true;
  },
  async getClausulas(id) {
    const r = await apiClient.get('/clausulas');
    return r.data.filter(cl => cl.id_contrato === id);
  },
  async createClausula(d) {
    const r = await apiClient.post('/clausulas', d);
    return r.data;
  },
  async updateClausula(id, d) {
    const r = await apiClient.put(`/clausulas/${id}`, d);
    return r.data;
  },
  async deleteClausula(id) {
    await apiClient.delete(`/clausulas/${id}`);
    return true;
  }
};