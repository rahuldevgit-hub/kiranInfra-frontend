const nextJest = require('next/jest.js'); // note the .js

const createJestConfig = nextJest({ dir: './' });

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom',

  // Ignore Playwright tests
  testPathIgnorePatterns: ['/node_modules/', '/e2e/', '/playwright/'],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
};

export default createJestConfig(customJestConfig);
