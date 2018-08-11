import babel from 'rollup-plugin-babel'

const env = process.env.NODE_ENV
const config = {
  input: 'src/index.js',
  plugins: [],
  exports: 'named',
  external: ['redux', 'react-redux', 'redux-thunk', 'immer'],
}

if (env === 'es' || env === 'cjs') {
  config.output = {
    format: env,
    indent: false,
  }

  config.plugins.push(babel())
}

export default config
