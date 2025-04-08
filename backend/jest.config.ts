/* eslint-disable */
export default {
  displayName: 'comp5347-2024-l8-g4-a2',
  preset: './jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: './coverage/comp5347-2024-l8-g4-a2',
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.[jt]s?(x)',
    '<rootDir>/src/**/*(*.)@(spec|test).[jt]s?(x)',
    "**/src/**/*.spec.ts",
    "**/src/**/*.test.ts",
  ],
};
