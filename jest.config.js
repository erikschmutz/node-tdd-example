const { defaults } = require("jest-config");

module.exports = {
  moduleFileExtensions: [...defaults.moduleFileExtensions, "ts", "tsx"],
  testEnvironment: "node",
  preset: "ts-jest",
  // Ingores the build folder
  modulePathIgnorePatterns: ["dist"],
  // 100 seconds for all tests
  testTimeout: 100_000,
  // collectCoverage: true,
  coverageReporters: ["json", "lcov", "text", "clover"],
};
