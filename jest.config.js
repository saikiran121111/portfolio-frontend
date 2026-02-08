/** @type {import('jest').Config} */
const config = {
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
        "\\.(css|less|sass|scss)$": "<rootDir>/__mocks__/fileMock.js",
    },
    testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
    collectCoverageFrom: [
        "src/**/*.{ts,tsx}",
        "!src/**/*.d.ts",
        "!src/**/index.ts",
        "!src/app/layout.tsx", // specific exclusions for files that are hard to test or non-logic
    ],
    transform: {
        "^.+\\.(ts|tsx)$": ["@swc/jest", {
            jsc: {
                transform: {
                    react: {
                        runtime: "automatic"
                    }
                }
            }
        }],
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
