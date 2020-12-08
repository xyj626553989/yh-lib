module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    "airbnb",
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "prettier/@typescript-eslint",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint"],
  rules: {
    "react/jsx-filename-extension": ["error", { extensions: [".js", ".jsx", ".ts", ".tsx"] }],
    indent: ["error", 2],
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "no-console": "error",
    "arrow-parens": 0,
    "no-use-before-define": 0,
    "import/extensions": 0,
    "import/prefer-default-export": 0,
    "import/no-unresolved": 0,
  },
  globals: {
    document: true,
    localStorage: true,
    window: true,
    module: true,
    require: true,
  },
};
