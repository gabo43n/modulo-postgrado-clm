const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Agenda Telefónica API corriendo en http://0.0.0.0:${PORT}`);
  console.log(`Documentación OpenAPI: http://localhost:${PORT}/api/docs`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
