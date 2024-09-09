# ESLint & Prettier

## Installation

Install the following packages:

- eslint
- prettier
- eslint-config-prettier
- eslint-plugin-prettier
- @eslint/js

## Configuration

**Example eslint.config.cjs**

```js
const js = require("@eslint/js");
const prettier = require("eslint-config-prettier");
const typescript = require("@typescript-eslint/eslint-plugin");

module.exports = [
  prettier,
  js.configs.recommended,
  {
    plugins: {
      ts: typescript
    },
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    rules: {}
  },
  {
    ignores: ["dist/", "node_modules/"]
  }
];
```