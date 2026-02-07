function createTTLCache(ttlMs) {
    let value = null;
    let expiresAt = 0;
  
    return {
      get() {
        if (!value) return null;
        if (Date.now() > expiresAt) {
          value = null;
          expiresAt = 0;
          return null;
        }
        return value;
      },
      set(v) {
        value = v;
        expiresAt = Date.now() + ttlMs;
      },
      clear() {
        value = null;
        expiresAt = 0;
      }
    };
  }
  
  module.exports = { createTTLCache };
  