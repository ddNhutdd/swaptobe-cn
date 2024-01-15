module.exports = {
  parserOptions: { sourceType: "module" },
  parser: "babel-eslint",
  plugins: ["react-hooks"],
  rules: {
    "react-hooks/exhaustive-deps": "off",
  },
};
