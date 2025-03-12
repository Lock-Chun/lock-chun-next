/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';

const config: Config = {
  // Use 'ts-jest' preset to handle TypeScript and JSX/TSX
  preset: 'ts-jest',

  // Set test environment (jsdom for browser-like environment, or node for Node.js)
  testEnvironment: 'jsdom',

  // Define transformations for specific file types
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest', // Transform TypeScript and TSX files with ts-jest
  },

  // Specify module file extensions Jest should recognize
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // Define where Jest should look for test files (adjust if needed)
  testMatch: ['**/tests/**/*.+(ts|tsx|js|jsx)', '**/?(*.)+(spec|test).+(ts|tsx|js|jsx)'],

  testPathIgnorePatterns: [
    "/node_modules/",
    "<rootDir>/tests/e2e/", // Add this line to ignore the e2e directory
  ],

  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8',
};

export default config;