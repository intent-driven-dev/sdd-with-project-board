function readConfig(env = process.env) {
  const rawPort = env.PORT ?? '3000';
  if (!/^\d+$/.test(rawPort) || Number(rawPort) < 1 || Number(rawPort) > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535.');
  }
  const port = Number(rawPort);
  let url;
  try { url = new URL(env.BASE_URL ?? `http://localhost:${port}`); } catch {
    throw new Error('BASE_URL must be an absolute HTTP(S) origin.');
  }
  if (!['http:', 'https:'].includes(url.protocol) || !url.hostname || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('BASE_URL must be an HTTP(S) origin without credentials, path, query, or fragment.');
  }
  return { port, baseUrl: url.origin };
}
module.exports = { readConfig };
