module.exports = {
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'], // Load dotenv for environment variables
  globalTeardown: './lib/teardownJest.js',
  testTimeout: 10000, // Increase this, depending on server and/or database configurations (i.e. increase if they are slow).
}