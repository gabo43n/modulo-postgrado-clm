// tests/helpers/authAgent.js
// -----------------------------------------------------------------------------
// request.agent(app) de supertest funciona como un navegador: guarda
// automaticamente la cookie que devuelve el login y la reenvia en cada
// peticion siguiente hecha con ese mismo "agent" — asi los tests no tienen
// que leer/copiar la cookie a mano.
//
// USUARIO_TEST/PASSWORD_TEST son credenciales SOLO para los tests, definidas
// en .env.test (ver ese archivo) — no son tu usuario/contraseña real del
// dashboard.
// -----------------------------------------------------------------------------
const request = require('supertest');
const app = require('../../src/app');

const USUARIO_TEST = process.env.CLM_ADMIN_USER;
const PASSWORD_TEST = 'test12345';

async function crearAgenteAutenticado() {
  const agent = request.agent(app);
  const res = await agent
    .post('/api/clm/auth/login')
    .send({ username: USUARIO_TEST, password: PASSWORD_TEST });

  if (res.status !== 200) {
    throw new Error(
      'No se pudo iniciar sesion en los tests (revisa CLM_ADMIN_USER y ' +
      'CLM_ADMIN_PASSWORD_HASH en tu .env.test — deben coincidir con la ' +
      'contraseña "test12345"). Respuesta: ' + JSON.stringify(res.body)
    );
  }
  return agent;
}

module.exports = { crearAgenteAutenticado, USUARIO_TEST, PASSWORD_TEST };
