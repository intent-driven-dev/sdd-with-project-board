# URL Shortener

A dependency-free CommonJS Node.js application. Requires Node.js 22 or newer. No installation step is needed.

Start the application:

```sh
npm start
```

Open http://localhost:3000, enter an absolute HTTP or HTTPS destination, and choose **Shorten URL**. The result is a clickable short URL. Anyone with that link can follow it while the application remains running.

Run the automated tests (no external network requests):

```sh
npm test
```

## Configuration

`PORT` defaults to `3000` and must be an integer from 1 to 65535. For example:

```sh
PORT=3100 npm start
```

`BASE_URL` controls the origin displayed in generated links, defaulting to `http://localhost:<PORT>`. Set it to the browser-accessible origin if different:

```sh
PORT=3100 BASE_URL=http://127.0.0.1:3100 npm start
```

It must be an absolute HTTP(S) origin without credentials, a path other than `/`, query, or fragment. Invalid configuration stops startup. The incoming Host header never controls generated links. `BASE_URL` does not configure TLS or a proxy.

## Behavior and limitations

- Destinations are trimmed and serialized with Node's URL parser; path, query, and fragment semantics are retained.
- Creation accepts URL-encoded form bodies up to 16 KiB. Invalid destinations return 400, oversized bodies 413, and unsupported content types 415.
- Short links redirect with HTTP 302. Unknown links and routes return 404.
- Mappings exist only in memory in a **single process**. Every restart loses all links. Multiple processes do not share mappings.
- Persistence, expiry, accounts, analytics, custom aliases, and link management are outside this version.
