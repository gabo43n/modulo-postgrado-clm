// tests/helpers/resetDb.js
// -----------------------------------------------------------------------------
// Deja las 3 tablas del CLM vacias antes de cada test, para que un test nunca
// dependa de datos que dejo otro test (por ejemplo, un NIT repetido rompiendo
// una prueba que no tiene nada que ver con eso).
//
// TRUNCATE ... CASCADE borra tambien las filas de las tablas relacionadas
// (contrato/clausula dependen de empresa_cliente via FOREIGN KEY), y
// RESTART IDENTITY no aplica aqui (los ids son UUID, no numeros
// autoincrementales) pero se deja igual por si el schema cambiara.
// -----------------------------------------------------------------------------
const { pool } = require('../../src/db/postgres');

async function limpiarBaseDatos() {
  await pool.query('TRUNCATE TABLE clausula, contrato, empresa_cliente RESTART IDENTITY CASCADE');
}

module.exports = { limpiarBaseDatos, pool };
