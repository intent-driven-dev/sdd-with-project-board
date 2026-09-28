const { test } = require('node:test');
const assert = require('node:assert/strict');
const { validateDestination } = require('../src/destination');
test('accepts HTTP(S), trims whitespace, preserves destination components', () => {
  for (const scheme of ['http', 'https']) {
    const url = `${scheme}://example.com/articles?id=42&name=a%20b#details`;
    assert.equal(validateDestination(`  ${url}\n`), url);
  }
});
test('rejects empty, malformed, relative and other schemes', () => {
  for (const input of ['', '  ', 'not-a-url', '/relative', 'javascript:alert(1)', 'ftp://example.com', 'https://', 'https://[bad', 'http:example.com']) assert.throws(() => validateDestination(input));
});
