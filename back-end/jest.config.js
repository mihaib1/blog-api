export default {
    testEnvironment: 'node',
    coveragePathIgnorePatterns: ['/node_modules/'],
    testMatch: ['**/__tests__/**/*.test.js'],
    collectCoverageFrom: [
        'controllers/**/*.js',
        'routes/**/*.js',
        'middleware/**/*.js',
        'db/**/*.js',
        '!node_modules/**'
    ],
    forceExit: true,
    detectOpenHandles: true,
    testTimeout: 10000  // ← Add this for longer timeout
};