## Why

Visitors need a simpler link to share instead of a long destination URL. [INT-54: URL Creation](https://linear.app/intent-driven-dev/issue/INT-54/url-creation) establishes the creation and follow-link journey in this currently empty application repository.

## What Changes

- Provide a destination URL field and a **Shorten URL** button.
- Generate a short URL for a valid HTTP or HTTPS destination and display it as a clickable link in a result area.
- Resolve generated links to their original destinations.
- Reject invalid destinations with a clear form error and return a not-found response for unknown short links.
- Establish dependency-free Node.js startup and automated tests.
- Keep expiry (INT-55), accounts, analytics, custom aliases, and link management outside this change.

## Capabilities

### New Capabilities

- `url-creation`: Submit a destination, receive a clickable short URL, and follow it to the destination.

### Modified Capabilities

None. The main specification directory has no existing capabilities.

## Impact

Introduces the initial CommonJS application, HTML form rendering, URL mapping storage, HTTP creation and redirect routes, and tests using only built-in Node.js APIs. `npm start` and `npm test` will be the entry points. No existing code or API is changed. The initial scope assumes mappings last for the running process; persistence across restarts is deferred and will be disclosed in the application documentation.
