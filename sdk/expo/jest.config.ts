import type {Config} from 'jest'

export default (): Config => {
  return {
    preset: 'ts-jest',
    clearMocks: true,
    moduleFileExtensions: ['js', 'ts', 'json'],
    testEnvironment: 'node',
    testMatch: ['**/*.test.ts'],
    transform: {
      '^.+\\.ts$': 'ts-jest'
    },
    verbose: true,
    collectCoverage: true,
    collectCoverageFrom: ['./src/**']
  }
}