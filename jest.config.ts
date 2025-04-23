// jest.config.ts
import type { Config } from 'jest';
import nextJest from 'next/jest.js'; // Use .js extension here

// Create the base Jest config function using next/jest
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom Jest configuration options here
const customJestConfig: Config = {
  // Set the test environment (jsdom for browser-like environment)
  testEnvironment: 'jest-environment-jsdom',

  // Add setup files after the environment is set up
  setupFilesAfterEnv: ['<rootDir>/tests/jest-setup.ts'],

  // Map module aliases (like @/*) to the correct paths
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // Paths to ignore during testing
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/tests/e2e/', // Keep ignoring E2E tests for unit testing
    // No need to ignore jest-setup.ts here, it's used in setupFilesAfterEnv
  ],

  // Automatically clear mock calls, instances, contexts and results before every test
  // (This is often default or handled by setup, but keeping it is fine)
  clearMocks: true,

  // Optionally collect coverage
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8', // 'babel' is often used with babel-jest, but v8 is fine

  // **IMPORTANT**: Remove the 'preset' and 'transform' properties you had before.
  // next/jest handles these internally.
};

// Export the async function that createJestConfig returns
// This way, next/jest can load the Next.js config which is async
export default createJestConfig(customJestConfig);