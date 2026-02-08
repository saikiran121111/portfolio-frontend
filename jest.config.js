/** @type {import('jest').Config} */
const config = {
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },
    testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
    collectCoverageFrom: [
        "src/components/page-transition/**/*.{ts,tsx}",
        "!src/components/page-transition/**/*.d.ts",
        "!src/components/page-transition/**/index.ts",
    ],
    transform: {
        "^.+\\.(ts|tsx)$": ["@swc/jest"],
    },
    transformIgnorePatterns: [
        "/node_modules/",
    ],
    // Look for tests in __tests__ folder at root level
    testMatch: [
        "<rootDir>/__tests__/**/*.test.{ts,tsx}",
    ],
};

module.exports = config;
