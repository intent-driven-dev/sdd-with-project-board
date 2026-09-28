const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createStore } = require('../src/url-store');
test('collision retries preserve existing mappings', () => {
  const codes = ['AAAAAAA', 'AAAAAAA', 'BBBBBBB'];
  const store = createStore({ generateCode: () => codes.shift() });
  assert.equal(store.create('https://one.example/'), 'AAAAAAA');
  assert.equal(store.create('https://two.example/'), 'BBBBBBB');
  assert.equal(store.get('AAAAAAA'), 'https://one.example/');
  assert.equal(store.get('BBBBBBB'), 'https://two.example/');
  assert.equal(store.get('missing'), undefined);
  assert.equal(store.size, 2);
});
test('default codes are seven base64url characters and stores are isolated', () => {
  const store = createStore();
  const code = store.create('https://example.com/');
  assert.match(code, /^[A-Za-z0-9_-]{7}$/);
  assert.equal(createStore().get(code), undefined);
});
