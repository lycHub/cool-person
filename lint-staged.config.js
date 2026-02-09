export default {
  "packages/*/**/*.{ts,tsx,vue}": "eslint --fix --max-warnings 0 --no-warn-ignored",
  "packages/*/src/**/*.{scss,css,vue}": "stylelint --fix --max-warnings 0",
};
