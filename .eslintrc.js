module.exports = {
  parser: 'babel-eslint',
  extends: ['standard', 'prettier', 'prettier/standard'],

  overrides: [
    {
      files: 'test/**/*.js',
      env: {
        jest: true,
      },
    },
  ],
}
