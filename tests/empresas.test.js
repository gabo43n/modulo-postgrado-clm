// tests/empresas.test.js
// -----------------------------------------------------------------------------
// CRUD de empresa_cliente: crear, listar, editar, eliminar, y las reglas que
// vienen de la base de datos (NIT unico) y de la validacion (campos
// requeridos).
// -----------------------------------------------------------------------------
const { crearAgenteAutenticado } = require('./helpers/authAgent');
const { limpiarBaseDatos, pool } = require('./helpers/resetDb');

let agent;

beforeAll(async () => {
  agent = await crearAgenteAutenticado();
});

beforeEach(async () => {
  await limpiarBaseDatos();
});

afterAll(async () => {
  await pool.end();
});

describe('CRUD de empresas', () => {
  test('crea una empresa valida (201) con los valores por defecto correctos', async () => {
    const res = await agent.post('/api/clm/empresas').send({
      razon_social: 'Empresa de prueba',
      nit: '999888777',
      pais: 'Bolivia',
    });

    expect(res.status).toBe(201);
    expect(res.body.id_empresa).toBeDefined();
    expect(res.body.razon_social).toBe('Empresa de prueba');
    expect(res.body.activo).toBe(true); // valor por defecto del schema (DEFAULT true)
  });

  test('rechaza crear una empresa sin razon_social (400)', async () => {
    const res = await agent.post('/api/clm/empresas').send({ nit: '123', pais: 'Bolivia' });
    expect(res.status).toBe(400);
  });

  test('rechaza un NIT duplicado (409, viene del CONSTRAINT UNIQUE de la tabla)', async () => {
    const datos = { razon_social: 'Empresa A', nit: '111222333', pais: 'Bolivia' };
    await agent.post('/api/clm/empresas').send(datos);

    const res = await agent.post('/api/clm/empresas').send({ ...datos, razon_social: 'Empresa B' });
    expect(res.status).toBe(409);
  });

  test('lista las empresas creadas', async () => {
    await agent.post('/api/clm/empresas').send({ razon_social: 'E1', nit: '100', pais: 'Bolivia' });
    await agent.post('/api/clm/empresas').send({ razon_social: 'E2', nit: '200', pais: 'Bolivia' });

    const res = await agent.get('/api/clm/empresas');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  test('edita una empresa existente (solo el campo enviado cambia)', async () => {
    const creada = await agent.post('/api/clm/empresas').send({
      razon_social: 'Nombre viejo', nit: '444555666', pais: 'Bolivia',
    });

    const res = await agent.put(`/api/clm/empresas/${creada.body.id_empresa}`).send({
      razon_social: 'Nombre nuevo',
    });

    expect(res.status).toBe(200);
    expect(res.body.razon_social).toBe('Nombre nuevo');
    expect(res.body.nit).toBe('444555666'); // no se mando -> se mantiene (COALESCE)
  });

  test('devuelve 404 al editar un id que no existe', async () => {
    const res = await agent
      .put('/api/clm/empresas/550e8400-e29b-41d4-a716-446655440000')
      .send({ razon_social: 'X' });
    expect(res.status).toBe(404);
  });

  test('elimina una empresa existente (204)', async () => {
    const creada = await agent.post('/api/clm/empresas').send({
      razon_social: 'Para borrar', nit: '777888999', pais: 'Bolivia',
    });

    const res = await agent.delete(`/api/clm/empresas/${creada.body.id_empresa}`);
    expect(res.status).toBe(204);

    const lista = await agent.get('/api/clm/empresas');
    expect(lista.body).toHaveLength(0);
  });

  test('devuelve 404 al eliminar un id que no existe', async () => {
    const res = await agent.delete('/api/clm/empresas/550e8400-e29b-41d4-a716-446655440000');
    expect(res.status).toBe(404);
  });
});
