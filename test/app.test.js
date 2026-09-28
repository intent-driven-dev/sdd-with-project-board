const { test } = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');
const { createServer } = require('../src/app');

test('server starts and closes on an ephemeral port', async () => {
  const server = createServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  assert.ok(server.address().port > 0);
  await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  assert.equal(server.listening, false);
});

const http = require('node:http');
const { createStore } = require('../src/url-store');
async function fixture(t) {
  const store = createStore();
  const server = createServer({ store, baseUrl: 'https://short.example' });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise(resolve => server.close(resolve)));
  function request(path, { method = 'GET', body, headers = {} } = {}) {
    return new Promise((resolve, reject) => {
      const req = http.request({ hostname: '127.0.0.1', port: server.address().port, path, method, headers }, res => {
        const chunks = [];
        res.on('data', chunk => chunks.push(chunk));
        res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks).toString() }));
      });
      req.on('error', reject);
      req.end(body);
    });
  }
  const submit = destination => request('/shorten', { method: 'POST', body: new URLSearchParams({ destination }).toString(), headers: { 'Content-Type': 'application/x-www-form-urlencoded', Host: 'attacker.example' } });
  return { store, request, submit };
}

test('creation form has associated label and submit control', async t => {
  const { request } = await fixture(t);
  const res = await request('/');
  assert.equal(res.status, 200);
  assert.match(res.headers['content-type'], /text\/html/);
  assert.match(res.body, /<label for="destination">Destination URL<\/label>/);
  assert.match(res.body, /<input id="destination" name="destination"/);
  assert.match(res.body, /<button type="submit">Shorten URL<\/button>/);
});

test('full journey creates trusted clickable URLs and resolves shared links independently', async t => {
  const { request, submit, store } = await fixture(t);
  assert.equal((await request('/')).status, 200);
  const destinations = ['https://example.com/articles?id=42#details', 'http://example.org/other?x=1&y=2#end'];
  const links = [];
  for (const destination of destinations) {
    const res = await submit(`  ${destination}\n`);
    assert.equal(res.status, 200);
    const match = res.body.match(/<a id="short-url" href="([^"]+)">([^<]+)<\/a>/);
    assert.ok(match);
    assert.equal(match[1], match[2]);
    assert.match(match[1], /^https:\/\/short\.example\/[A-Za-z0-9_-]{7}$/);
    assert.ok(!res.body.includes('attacker.example'));
    assert.equal(res.headers['set-cookie'], undefined);
    links.push(new URL(match[1]).pathname);
  }
  assert.equal(store.size, 2);
  for (let i = 0; i < links.length; i++) {
    const redirect = await request(links[i]);
    assert.equal(redirect.status, 302);
    assert.equal(redirect.headers.location, destinations[i]);
  }
});

test('invalid input is retained safely and creates no mappings', async t => {
  const { submit, store } = await fixture(t);
  for (const destination of ['', 'not-a-url', '/relative', 'javascript:alert(1)', 'https://[bad', '"><script>alert(1)</script>']) {
    const res = await submit(destination);
    assert.equal(res.status, 400);
    assert.match(res.body, /role="alert"/);
    assert.ok(!res.body.includes('id="short-url"'));
    assert.ok(!res.body.includes('<script>'));
    if (destination === 'not-a-url') assert.match(res.body, /value="not-a-url"/);
    if (destination.includes('<script>')) assert.match(res.body, /value="&quot;&gt;&lt;script&gt;alert\(1\)&lt;\/script&gt;"/);
  }
  assert.equal(store.size, 0);
});

test('body limit and content type reject requests without mappings', async t => {
  const { request, store } = await fixture(t);
  const tooLarge = await request('/shorten', { method: 'POST', body: 'destination=' + 'a'.repeat(16 * 1024), headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
  assert.equal(tooLarge.status, 413);
  for (const headers of [{}, { 'Content-Type': 'application/json' }]) {
    const res = await request('/shorten', { method: 'POST', body: '{"destination":"https://example.com"}', headers });
    assert.equal(res.status, 415);
  }
  assert.equal(store.size, 0);
  const prefix = 'destination=https://example.com/';
  const boundary = await request('/shorten', { method: 'POST', body: prefix + 'a'.repeat(16 * 1024 - prefix.length), headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' } });
  assert.equal(boundary.status, 200);
  assert.equal(store.size, 1);
});

test('unknown codes, routes and unsupported methods return 404 without redirect', async t => {
  const { request } = await fixture(t);
  for (const path of ['/ZZZZZZZ', '/unknown-route', '/shorten', '/abc/def']) {
    const res = await request(path);
    assert.equal(res.status, 404);
    assert.equal(res.headers.location, undefined);
    assert.match(res.body, /not found/i);
  }
  assert.equal((await request('/', { method: 'POST' })).status, 404);
});
