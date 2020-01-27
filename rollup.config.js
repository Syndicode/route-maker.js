import babel from 'rollup-plugin-babel';

const plugins = [
  babel({
    exclude: 'node_modules/**'
  })
]

module.exports = [{
  input: 'src/route-maker.js',
  output: [{
    file: 'route-maker.js',
    format: 'umd',
    name: 'route-maker',
  }],
  plugins
}, {
  input: 'src/lib/match.js',
  output: [{
    file: 'match.js',
    format: 'umd',
    name: 'match',
  }]
}]
