const jestConfig = require('../../jest.config.bzl');

module.exports = {
  ...jestConfig,
  testPathIgnorePatterns: [
    "<rootDir>/(build|node_modules|config)/",
    "<rootDir>/dist/"
  ],
  testMatch: [
    "<rootDir>/**/(tests|__tests__)/**/*.test.(j|t)s?(x)"
  ],
};
