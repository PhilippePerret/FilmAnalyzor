// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

// const common = require('./jest.common.config')

module.exports = {
  projects: [
    {
      // ...common,
      runner: '@jest-runner/electron/main',
      testEnvironment: 'node',
      testMatch: ['**/__tests__/**/*.(spec|test).js']
    },
    {
      // ...common,
      runner: '@jest-runner/electron',
      testEnvironment: '@jest-runner/electron/environment',
      testMatch: ['**/__tests__/**/*.(spec|test).jsx']
    }
  ]
}
