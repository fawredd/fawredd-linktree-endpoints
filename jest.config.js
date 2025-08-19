module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/components/(.*)$': '<rootDir>/components/$1',
  },
  preset: 'ts-jest',
  transform: {
    '^.+\.(ts|tsx)?$': ['ts-jest', { tsconfig: './tsconfig.jest.json' }],
  },
};