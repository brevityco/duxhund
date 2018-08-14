module.exports = {
  plugins: ['@babel/plugin-proposal-object-rest-spread'],
  presets: [
    [
      '@babel/preset-env',
      {
        loose: true,
        modules: process.env['NODE_ENV'] === 'test' ? 'commonjs' : false,
        exclude: ['transform-regenerator', 'transform-async-to-generator'],
        targets: {
          browsers: ['ie >= 11'],
        },
      },
    ],
  ],
}
