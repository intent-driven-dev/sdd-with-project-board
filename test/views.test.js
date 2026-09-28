const { test } = require('node:test');
const assert = require('node:assert/strict');
const { escapeHtml, renderForm } = require('../src/views');
test('all dynamic text and attributes are escaped', () => {
  assert.equal(escapeHtml('&<>"\''), '&amp;&lt;&gt;&quot;&#39;');
  const html = renderForm({ destination: '"><script>alert(1)</script>', error: '<b>error</b>', shortUrl: 'https://example.com/"<tag>' });
  assert.ok(!html.includes('<script>'));
  assert.ok(!html.includes('<b>'));
  assert.ok(!html.includes('<tag>'));
  assert.match(html, /&quot;&gt;&lt;script&gt;/);
});
