// tests/contratos.test.js
// -----------------------------------------------------------------------------
// CRUD de contrato + la regla de negocio mas importante del modelo: la
// "maquina de estados" (trigger fn_validar_transicion_estado en Postgres).
// Estos dos ultimos tests son los que demuestran que las reglas de negocio
// estan protegidas hasta en la base de datos, no solo en el formulario web.
// -----------------------------------------------------------------------------
const { crearAgenteAutenticado } = require('./helpers/authAgent');
const { limpiarBaseDatos, pool } = require('./helpers/resetDb');

let agent;
let idEmpresa;

async function crearEmpresaDePrueba(nit) {
  const res = await agent.post('/api/clm/empresas').send({
    razon_social: 'Empresa para contratos', nit, pais: 'Bolivia',
  });
  return res.body.id_empresa;
}

beforeAll(async () => {
  agent = await crearAgenteAutenticado();
});

beforeEach(async () => {
  await limpiarBaseDatos();
  idEmpresa = await crearEmpresaDePrueba('321321321');
});

afterAll(async () => {
  await pool.end();
});

describe('CRUD de contratos', () => {
  test('crea un contrato con estado por defecto "Borrador"', async () => {
    const res = await agent.post('/api/clm/contratos').send({
      id_empresa: idEmpresa, titulo: 'Contrato 1', contraparte_nombre: 'Proveedor X',
    });

    expect(res.status).toBe(201);
    expect(res.body.estado).toBe('Borrador');
  });

  test('rechaza un contrato sin titulo (400, validacion)', async () => {
    const res = await agent.post('/api/clm/contratos').send({
      id_empresa: idEmpresa, contraparte_nombre: 'Proveedor X',
    });
    expect(res.status).toBe(400);
  });

  test('rechaza un contrato con id_empresa que no existe (400, foreign key)', async () => {
    const res = await agent.post('/api/clm/contratos').send({
      id_empresa: '550e8400-e29b-41d4-a716-446655440000',
      titulo: 'Contrato huerfano',
      contraparte_nombre: 'Proveedor Y',
    });
    expect(res.status).toBe(400);
  });

  test('elimina un contrato existente', async () => {
    const creado = await agent.post('/api/clm/contratos').send({
      id_empresa: idEmpresa, titulo: 'Para borrar', contraparte_nombre: 'Proveedor Z',
    });
    const res = await agent.delete(`/api/clm/contratos/${creado.body.id_contrato}`);
    expect(res.status).toBe(204);
  });
});

describe('Maquina de estados del contrato (trigger de Postgres)', () => {
  test('permite una transicion valida: Borrador -> Negociacion', async () => {
    const creado = await agent.post('/api/clm/contratos').send({
      id_empresa: idEmpresa, titulo: 'Contrato en negociacion', contraparte_nombre: 'Proveedor A',
    });

    const res = await agent
      .put(`/api/clm/contratos/${creado.body.id_contrato}`)
      .send({ estado: 'Negociacion' });

    expect(res.status).toBe(200);
    expect(res.body.estado).toBe('Negociacion');
  });

  test('permite una transicion valida: Borrador -> Anulado', async () => {
    const creado = await agent.post('/api/clm/contratos').send({
      id_empresa: idEmpresa, titulo: 'Contrato a anular', contraparte_nombre: 'Proveedor B',
    });

    const res = await agent
      .put(`/api/clm/contratos/${creado.body.id_contrato}`)
      .send({ estado: 'Anulado' });

    expect(res.status).toBe(200);
    expect(res.body.estado).toBe('Anulado');
  });

  test('rechaza un salto invalido: Borrador -> Validez_Legal (el trigger lo bloquea con 400)', async () => {
    const creado = await agent.post('/api/clm/contratos').send({
      id_empresa: idEmpresa, titulo: 'Contrato con salto invalido', contraparte_nombre: 'Proveedor C',
    });

    const res = await agent
      .put(`/api/clm/contratos/${creado.body.id_contrato}`)
      .send({ estado: 'Validez_Legal' });

    expect(res.status).toBe(400);
    // El mensaje viene tal cual del RAISE EXCEPTION del trigger (ver
    // fn_validar_transicion_estado en 3_tablas_principales.sql).
    expect(res.body.message).toMatch(/Transici[oó]n de estado no permitida/i);
  });

  test('rechaza volver a un estado ya anulado: Anulado -> Negociacion', async () => {
    const creado = await agent.post('/api/clm/contratos').send({
      id_empresa: idEmpresa, titulo: 'Contrato ya anulado', contraparte_nombre: 'Proveedor D',
    });
    await agent.put(`/api/clm/contratos/${creado.body.id_contrato}`).send({ estado: 'Anulado' });

    const res = await agent
      .put(`/api/clm/contratos/${creado.body.id_contrato}`)
      .send({ estado: 'Negociacion' });

    expect(res.status).toBe(400);
  });
});
