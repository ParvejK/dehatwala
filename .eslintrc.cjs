const pluginQuery = require("@tanstack/eslint-plugin-query");

module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh", "@tanstack/query"],
  rules: {
    ...pluginQuery.configs["flat/recommended"][0].rules,
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
  },
};
