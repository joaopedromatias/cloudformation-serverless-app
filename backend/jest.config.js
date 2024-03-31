module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-node',
  verbose: true,
  testPathIgnorePatterns: ['/node_modules/'],
  detectOpenHandles: true,
  collectCoverage: true,
  setupFilesAfterEnv: ['./test/setup.ts'],
  collectCoverageFrom: ['/src/**/*.{ts}'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  moduleFileExtensions: ['js', 'ts', 'json'],
  testMatch: ['**/*.test.ts']
}
