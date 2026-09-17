// jest.config.js
// -----------------------------------------------------------------------------
// Configuracion de Jest para los tests del modulo CLM.
//
// - setupFiles: carga las variables de entorno de PRUEBA (.env.test) ANTES de
//   que se importe cualquier otro archivo (incluido src/db/postgres.js). Asi,
//   cuando ese archivo haga su propio "require('dotenv').config()" mas tarde,
//   dotenv NO sobreescribe las variables que .env.test ya puso en process.env
//   (ese es el comportamiento por defecto de dotenv: nunca pisa una variable
//   que ya existe) — por eso los tests usan clm_db_test en vez de tu base real.
// -----------------------------------------------------------------------------
module.exports = {
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/tests/setupEnv.js'],
  testTimeout: 15000,
};
