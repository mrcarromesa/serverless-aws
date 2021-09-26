const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  collectCoverage: true,

  collectCoverageFrom: [
    '<rootDir>/src/modules/**/services/*.ts',
    '<rootDir>/src/modules/**/services/**/*.ts',
  ],

  coverageDirectory: '__tests__/coverage',

  coverageProvider: 'v8',

  coverageReporters: ['text-summary', 'lcov'],

  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/src/',
  }),

  preset: 'ts-jest',

  testEnvironment: 'node',

  testMatch: ['**/*.spec.ts'],

  setupFiles: ['./jest-setup-file.ts', './jest-set-env-vars.ts'],
};
