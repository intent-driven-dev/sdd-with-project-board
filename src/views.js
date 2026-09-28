function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
}
function renderForm({ destination = '', error = '', shortUrl = '' } = {}) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>URL Shortener</title>
<style>body{font:18px system-ui,sans-serif;max-width:680px;margin:60px auto;padding:0 24px;color:#17243a;background:#f5f7fb}main{background:white;padding:32px;border-radius:16px}label{display:block;margin-bottom:8px}input{box-sizing:border-box;width:100%;padding:12px;font:inherit;border:1px solid #67758a;border-radius:6px}button{margin-top:16px;padding:12px 20px;background:#234fc4;color:white;border:0;border-radius:6px;font:inherit;cursor:pointer}a{color:#234fc4;overflow-wrap:anywhere}.error{color:#a31919}section{margin-top:28px}</style></head>
<body><main><h1>URL Shortener</h1><p>Create a simpler link to share.</p>
<form method="post" action="/shorten"><label for="destination">Destination URL</label>
<input id="destination" name="destination" type="text" inputmode="url" placeholder="https://example.com/articles" value="${escapeHtml(destination)}"${error ? ' aria-invalid="true" aria-describedby="error"' : ''}>
${error ? `<p id="error" class="error" role="alert">${escapeHtml(error)}</p>` : ''}
<button type="submit">Shorten URL</button></form>
${shortUrl ? `<section aria-labelledby="result-title"><h2 id="result-title">Your short URL</h2><a id="short-url" href="${escapeHtml(shortUrl)}">${escapeHtml(shortUrl)}</a></section>` : ''}
</main></body></html>`;
}
module.exports = { escapeHtml, renderForm };
