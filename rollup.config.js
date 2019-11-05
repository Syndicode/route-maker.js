import babel from 'rollup-plugin-babel';

module.exports = {
  input: "route-maker.js",
  output: {
    file: "bundle.js",
    format: "umd",
    name: "bundle"
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ],
};
