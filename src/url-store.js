const { randomBytes } = require('node:crypto');
function createStore({ generateCode = () => randomBytes(6).toString('base64url').slice(0, 7) } = {}) {
  const mappings = new Map();
  return {
    create(destination) {
      let code;
      do { code = generateCode(); } while (mappings.has(code));
      mappings.set(code, destination);
      return code;
    },
    get(code) { return mappings.get(code); },
    get size() { return mappings.size; },
  };
}
module.exports = { createStore };
