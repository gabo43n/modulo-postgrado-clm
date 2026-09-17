// tests/auth.test.js
// -----------------------------------------------------------------------------
// Prueba el requisito de "login con restriccion": la API rechaza peticiones
// sin sesion, y el dashboard redirige al login en vez de mostrarse.
// -----------------------------------------------------------------------------
const request = require('supertest');
const app = require('../src/app');
const { crearAgenteAutenticado, USUARIO_TEST, PASSWORD_TEST } = require('./helpers/authAgent');
const { pool } = require('./helpers/resetDb');

afterAll(async () => {
  await pool.end();
});

describe('Autenticacion del dashboard CLM', () => {
  test('rechaza login con contraseña incorrecta', async () => {
    const res = await request(app)
      .post('/api/clm/auth/login')
      .send({ username: USUARIO_TEST, password: 'clave-incorrecta' });

    expect(res.status).toBe(401);
  });

  test('rechaza login con usuario que no existe', async () => {
    const res = await request(app)
      .post('/api/clm/auth/login')
      .send({ username: 'no_existe', password: PASSWORD_TEST });

    expect(res.status).toBe(401);
  });

  test('acepta login con credenciales correctas y entrega una cookie de sesion', async () => {
    const res = await request(app)
      .post('/api/clm/auth/login')
      .send({ username: USUARIO_TEST, password: PASSWORD_TEST });

    expect(res.status).toBe(200);
    expect(res.headers['set-cookie']).toBeDefined();
    expect(res.headers['set-cookie'][0]).toMatch(/clm_token=/);
  });

  test('bloquea la API sin sesion (401), no solo la pagina', async () => {
    const res = await request(app).get('/api/clm/empresas');
    expect(res.status).toBe(401);
  });

  test('el dashboard redirige a /clm/login.html si no hay sesion', async () => {
    const res = await request(app).get('/clm/');
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/clm/login.html');
  });

  test('el dashboard SI responde 200 con una sesion valida', async () => {
    const agent = await crearAgenteAutenticado();
    const res = await agent.get('/clm/');
    expect(res.status).toBe(200);
  });

  test('logout invalida la sesion (una llamada posterior vuelve a dar 401)', async () => {
    const agent = await crearAgenteAutenticado();
    await agent.post('/api/clm/auth/logout');

    const res = await agent.get('/api/clm/empresas');
    expect(res.status).toBe(401);
  });
});
