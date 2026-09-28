const http = require('node:http');
const { createStore } = require('./url-store');
const { renderForm } = require('./views');
const { validateDestination } = require('./destination');
const BODY_LIMIT = 16 * 1024;

function createServer({ baseUrl = 'http://localhost:3000', store = createStore() } = {}) {
  return http.createServer(async (req, res) => {
    const send = (status, html) => {
      res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    };
    const path = req.url.split('?')[0];
    if (req.method === 'GET' && path === '/') return send(200, renderForm());
    if (req.method === 'POST' && path === '/shorten') {
      if ((req.headers['content-type'] || '').split(';')[0].trim().toLowerCase() !== 'application/x-www-form-urlencoded') {
        req.resume();
        return send(415, renderForm({ error: 'Submit the URL using the form below.' }));
      }
      const chunks = [];
      let size = 0;
      try {
        for await (const chunk of req) {
          size += chunk.length;
          if (size > BODY_LIMIT) {
            send(413, renderForm({ error: 'The submitted form is too large (maximum 16 KiB).' }));
            return;
          }
          chunks.push(chunk);
        }
      } catch {
        if (!res.destroyed) send(400, renderForm({ error: 'Unable to read the submitted form.' }));
        return;
      }
      const destination = new URLSearchParams(Buffer.concat(chunks).toString('utf8')).get('destination') || '';
      let validated;
      try { validated = validateDestination(destination); } catch (error) {
        return send(400, renderForm({ destination, error: error.message }));
      }
      const code = store.create(validated);
      return send(200, renderForm({ destination, shortUrl: `${baseUrl}/${code}` }));
    }
    if (req.method === 'GET' && /^\/[A-Za-z0-9_-]{7}$/.test(path)) {
      const destination = store.get(path.slice(1));
      if (destination) {
        res.writeHead(302, { Location: destination });
        return res.end();
      }
    }
    send(404, '<!doctype html><html lang="en"><title>Not found</title><h1>Link not found</h1><p>This short link or page does not exist.</p><a href="/">Create a short URL</a></html>');
  });
}
module.exports = { createServer };
