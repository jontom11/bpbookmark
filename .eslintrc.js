module.exports = {
  parser: "babel-eslint",
  extends: ["eslint:recommended", "plugin:react/recommended"],
  parserOptions: {
    "sourceType": "module"
  },
  plugins: [
    "react"
  ],
  env: {
    browser: true
  },
  rules: {
    semi: 'error',
    "no-console": 'warn'
  },
  globals: {
    require: false,
    __dirname: false,
    module: false,
    process: false
  }
}
