const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readConfig } = require('../src/config');

test('configuration defaults and explicit origin', () => {
  assert.deepEqual(readConfig({}), { port: 3000, baseUrl: 'http://localhost:3000' });
  assert.deepEqual(readConfig({ PORT: '4000' }), { port: 4000, baseUrl: 'http://localhost:4000' });
  assert.deepEqual(readConfig({ PORT: '4000', BASE_URL: 'https://short.example/' }), { port: 4000, baseUrl: 'https://short.example' });
});
test('invalid configuration is rejected', () => {
  for (const PORT of ['', '0', '-1', '65536', 'abc', '3.5']) assert.throws(() => readConfig({ PORT }), /PORT/);
  for (const BASE_URL of ['', 'bad', '/relative', 'ftp://example.com', 'https://user:pass@example.com', 'https://example.com/path', 'https://example.com/?x=1', 'https://example.com/#x']) assert.throws(() => readConfig({ BASE_URL }), /BASE_URL/);
});
