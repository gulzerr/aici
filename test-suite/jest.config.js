module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/services"],
  testMatch: ["**/*.test.ts", "**/*.test.js"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  collectCoverageFrom: ["services/**/*.ts", "!services/**/*.d.ts"],
};
