/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1', // Map the .js imports back to .ts for testing.
  },
  transform: {
    '^.+\\.tsx?$': [ // Won't need tsx, but adding it for brevity.
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
};