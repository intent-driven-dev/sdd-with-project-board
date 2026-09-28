const { createServer } = require('./app');
const { readConfig } = require('./config');

try {
  const { port, baseUrl } = readConfig();
  const server = createServer({ baseUrl });
  server.on('error', error => { console.error(error.message); process.exitCode = 1; });
  server.listen(port, () => console.log(`URL shortener listening on ${baseUrl} (port ${port})`));
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
