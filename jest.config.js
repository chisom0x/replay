export default {
    testEnvironment: 'node', // Use Node.js environment for testing
    verbose: true,           // Display detailed test results
    setupFiles: ['dotenv/config'], // Load environment variables
    roots: ['<rootDir>/src/tests'], // Set the root directory for tests
    transform: {
      '^.+\\.js$': 'babel-jest', // Transpile ES6+ files using Babel
    },
    collectCoverage: true, // Enable test coverage
    collectCoverageFrom: [
      'src/**/*.js', // Include all JS files in coverage
      '!src/**/*.test.js', // Exclude test files from coverage
    ],
    coverageDirectory: 'coverage', // Output directory for coverage reports
    coverageReporters: ['json', 'text', 'lcov', 'clover'], // Coverage formats
    testMatch: ['**/*.test.js'], // Match test files
  };
  