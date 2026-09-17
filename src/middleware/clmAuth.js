// src/middleware/clmAuth.js
// -----------------------------------------------------------------------------
// Autenticacion del modulo CLM: un solo usuario "admin" definido por
// variables de entorno (no una tabla de usuarios en Postgres — el schema del
// practico se queda en solo 3 tablas: empresa_cliente, contrato, clausula).
// La sesion se guarda en una cookie httpOnly con un JWT adentro.
// -----------------------------------------------------------------------------

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const CLM_JWT_SECRET = process.env.CLM_JWT_SECRET || 'clm-dev-secret-change-in-production';
const COOKIE_NAME = 'clm_token';
const DURACION_SESION_MS = 8 * 60 * 60 * 1000; // 8 horas

function verificarCredenciales(username, password) {
  const usuarioConfigurado = process.env.CLM_ADMIN_USER;
  const hashConfigurado = process.env.CLM_ADMIN_PASSWORD_HASH;

  console.log('--- DEBUG LOGIN ---');
  console.log('Usuario recibido:', username);
  console.log('Usuario esperado:', usuarioConfigurado);
  console.log('¿Coinciden usuarios?:', username === usuarioConfigurado);

  if (!usuarioConfigurado || !hashConfigurado) {
    console.error('[CLM] Falta CLM_ADMIN_USER o CLM_ADMIN_PASSWORD_HASH en .env');
    return false;
  }
  if (username !== usuarioConfigurado) return false;

  const coincidePass = bcrypt.compareSync(password, hashConfigurado);
  console.log('¿Coincide contraseña?:', coincidePass);
  console.log('-------------------');

  return coincidePass;
}

function emitirSesion(res, username) {
  const token = jwt.sign({ sub: username }, CLM_JWT_SECRET, { expiresIn: '8h' });
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: DURACION_SESION_MS,
  });
  return token;
}

function cerrarSesion(res) {
  res.clearCookie(COOKIE_NAME);
}

function leerSesion(req) {
  // 1. Intentar leer desde la cookie (Web)
  let token = req.cookies?.[COOKIE_NAME];

  // 2. Si no hay cookie, intentar leer desde el header Authorization (Móvil)
  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  if (!token) return null;
  try {
    return jwt.verify(token, CLM_JWT_SECRET);
  } catch {
    return null;
  }
}

function requireAuthApi(req, res, next) {
  const sesion = leerSesion(req);
  if (!sesion) {
    return res.status(401).json({ error: 'NoAutenticado', message: 'Inicia sesion para usar este endpoint' });
  }
  req.clmUser = sesion;
  next();
}

function requireAuthPage(req, res, next) {
  const sesion = leerSesion(req);
  if (!sesion) {
    return res.redirect('/clm/login.html');
  }
  req.clmUser = sesion;
  next();
}

module.exports = {
  verificarCredenciales,
  emitirSesion,
  cerrarSesion,
  requireAuthApi,
  requireAuthPage,
};
