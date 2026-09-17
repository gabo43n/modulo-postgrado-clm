// tests/setupEnv.js
// -----------------------------------------------------------------------------
// Se ejecuta ANTES de cargar cualquier test o el codigo de la app (ver
// jest.config.js -> setupFiles). Carga .env.test en vez de .env, para que los
// tests corran contra una base de datos separada (clm_db_test) y nunca toquen
// los datos reales que usas para tu demo.
// -----------------------------------------------------------------------------
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env.test') });
