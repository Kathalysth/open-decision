// @ts-ignore - I do not want an ES6 module here
module.exports = {
  extends: [
    "eslint:recommended",
    "prettier",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:react-hooks/recommended",
  ],
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.eslint.json",
    tsconfigRootDir: __dirname,
  },
  plugins: [
    "react",
    "@typescript-eslint",
    "react-hooks",
    "prettier",
    "simple-import-sort",
  ],
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
    ],
  },
  settings: {
    react: {
      pragma: "React",
      version: "detect",
    },
  },
  ignorePatterns: ["generated/*", "*.config*", "node_modules/*"],
};