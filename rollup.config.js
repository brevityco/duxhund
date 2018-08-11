import babel from 'rollup-plugin-babel'

const env = process.env.NODE_ENV
const config = {
  input: 'src/index.js',
  plugins: [],
  external: ['redux', 'react-redux', 'redux-thunk', 'immer'],
  output: {
    exports: 'named',
  },
}

if (env === 'es' || env === 'cjs') {
  Object.assign(config.output, {
    format: env,
    indent: false,
  })

  config.plugins.push(babel())
}

export default config
