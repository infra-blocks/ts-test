module.exports = {
  extends: "../../.eslintrc.cjs",
  rules: {
    // Often times we refer to a method by name because we want the stub object, we don't
    // really care if its bound or not.
    "@typescript-eslint/unbound-method": "off",
  },
};
