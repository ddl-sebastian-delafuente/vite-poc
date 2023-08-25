const storageMock = (function() {
  const store = {};

  return {
    getItem: function(key) {
      return store[key] || null;
    },
    setItem: function(key, value) {
      store[key] = value || '';
    },
    removeItem: function(key) {
      delete store[key]
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: storageMock
});

Object.defineProperty(window, 'sessionStorage', {
  value: storageMock
});
