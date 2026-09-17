// tests/clausulas.test.js
// -----------------------------------------------------------------------------
// CRUD de clausula + el "bloqueo optimista": el trigger
// fn_clausula_bloqueo_optimista impide cambiar el "contenido" de una
// clausula marcada como es_modificable = false.
// -----------------------------------------------------------------------------
const { crearAgenteAutenticado } = require('./helpers/authAgent');
const { limpiarBaseDatos, pool } = require('./helpers/resetDb');

let agent;
let idContrato;

beforeAll(async () => {
  agent = await crearAgenteAutenticado();
});

beforeEach(async () => {
  await limpiarBaseDatos();

  const empresa = await agent.post('/api/clm/empresas').send({
    razon_social: 'Empresa para clausulas', nit: '555444333', pais: 'Bolivia',
  });
  const contrato = await agent.post('/api/clm/contratos').send({
    id_empresa: empresa.body.id_empresa, titulo: 'Contrato base', contraparte_nombre: 'Proveedor',
  });
  idContrato = contrato.body.id_contrato;
});

afterAll(async () => {
  await pool.end();
});

describe('CRUD de clausulas', () => {
  test('crea una clausula con tipo_clausula por defecto "estandar"', async () => {
    const res = await agent.post('/api/clm/clausulas').send({
      id_contrato: idContrato, orden: 1, titulo: 'Clausula 1', contenido: 'Texto original',
    });

    expect(res.status).toBe(201);
    expect(res.body.tipo_clausula).toBe('estandar');
  });

  test('rechaza dos clausulas con el mismo "orden" en el mismo contrato (409, UNIQUE)', async () => {
    await agent.post('/api/clm/clausulas').send({
      id_contrato: idContrato, orden: 1, titulo: 'Clausula A', contenido: 'Texto A',
    });
    const res = await agent.post('/api/clm/clausulas').send({
      id_contrato: idContrato, orden: 1, titulo: 'Clausula B', contenido: 'Texto B',
    });
    expect(res.status).toBe(409);
  });

  test('elimina una clausula existente', async () => {
    const creada = await agent.post('/api/clm/clausulas').send({
      id_contrato: idContrato, orden: 1, titulo: 'Para borrar', contenido: 'Texto',
    });
    const res = await agent.delete(`/api/clm/clausulas/${creada.body.id_clausula}`);
    expect(res.status).toBe(204);
  });
});

describe('Bloqueo optimista de clausulas (trigger de Postgres)', () => {
  test('permite editar el contenido de una clausula modificable', async () => {
    const clausula = await agent.post('/api/clm/clausulas').send({
      id_contrato: idContrato, orden: 1, titulo: 'Clausula editable',
      contenido: 'Texto original', es_modificable: true,
    });

    const res = await agent
      .put(`/api/clm/clausulas/${clausula.body.id_clausula}`)
      .send({ contenido: 'Texto actualizado' });

    expect(res.status).toBe(200);
    expect(res.body.contenido).toBe('Texto actualizado');
  });

  test('rechaza editar el contenido de una clausula NO modificable (400, el trigger la bloquea)', async () => {
    const clausula = await agent.post('/api/clm/clausulas').send({
      id_contrato: idContrato, orden: 1, titulo: 'Clausula bloqueada',
      contenido: 'Texto fijo', es_modificable: false,
    });

    const res = await agent
      .put(`/api/clm/clausulas/${clausula.body.id_clausula}`)
      .send({ contenido: 'Intento de cambio' });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/no es modificable/i);
  });

  test('SI permite editar otro campo (titulo) de una clausula no modificable, mientras no se toque el contenido', async () => {
    const clausula = await agent.post('/api/clm/clausulas').send({
      id_contrato: idContrato, orden: 1, titulo: 'Titulo viejo',
      contenido: 'Texto fijo', es_modificable: false,
    });

    const res = await agent
      .put(`/api/clm/clausulas/${clausula.body.id_clausula}`)
      .send({ titulo: 'Titulo nuevo' });

    expect(res.status).toBe(200);
    expect(res.body.titulo).toBe('Titulo nuevo');
  });
});
