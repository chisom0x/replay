export default {
  testEnvironment: 'node',
  verbose: true,
  setupFiles: ['dotenv/config'],
  roots: ['<rootDir>/src/tests'],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'text', 'lcov', 'clover'],
  testMatch: ['**/*.test.js'],
};
