## 1. Application foundation

- [ ] 1.1 Add a dependency-free CommonJS package manifest, `src/server.js` startup, and an injectable server factory in `src/app.js`; verify `npm start` listens on the configured port and a `node:test` server lifecycle test starts and closes an ephemeral server.
- [ ] 1.2 Implement `PORT` and trusted `BASE_URL` configuration with localhost defaults and startup validation; verify tests reject invalid configuration and generated origins do not depend on the request Host header.

## 2. Destination handling and mapping

- [ ] 2.1 Add destination trimming and absolute HTTP/HTTPS validation using the built-in URL parser; verify tests accept both schemes, retain path/query/fragment semantics, and reject empty, malformed, relative, and non-HTTP(S) inputs.
- [ ] 2.2 Add `src/url-store.js` with process-local mappings, seven-character random base64url codes, and collision retries; verify deterministic collision tests preserve existing mappings and multiple destinations remain independently retrievable.

## 3. Creation and redirect journey

- [ ] 3.1 Add escaped server-rendered HTML in `src/views.js` and `GET /` with an associated field label and **Shorten URL** button; verify HTTP tests find the form controls and rendering tests treat markup as text.
- [ ] 3.2 Add `POST /shorten` URL-encoded parsing, a 16 KiB body limit, validation feedback, and a result area with an absolute clickable short URL; verify 200 success, 400 validation failures with safely retained input, 413 oversized requests, and 415 unsupported content types, with no mapping created for rejected requests.
- [ ] 3.3 Add `GET /<code>` redirects and understandable not-found responses; verify HTTP tests assert 302 and the destination Location (including query and fragment), and 404 without Location for unknown codes or routes.

## 4. Acceptance and documentation

- [ ] 4.1 Add an integration test spanning form retrieval, submission, extracting the displayed link, and resolving it from a separate request without session state; run `npm test` and verify all specification scenarios pass without external network requests.
- [ ] 4.2 Write README startup, test, `PORT`, and `BASE_URL` instructions and document that single-process mappings are lost on restart; verify each command against the application and check the documented defaults match startup behavior.
- [ ] 4.3 Run `npm start` and smoke-test the four INT-54 acceptance criteria in a browser: visible form, successful generation, visible result, and following the result; record the observed results for human review.
