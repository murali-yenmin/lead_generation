const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('@rollup/plugin-typescript');
const dts = require('rollup-plugin-dts').default;
const packageJson = require('./package.json');
const copy = require('rollup-plugin-copy');

module.exports = [
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      resolve({
        browser: true,
        preferBuiltins: false,
      }),
      commonjs(),
      typescript(),
      copy({
        targets: [
          { src: 'src/**/*.scss', dest: 'dist/scss' }, // Copy SCSS files to the dist/scss directory
        ],
        flatten: false, // Ensure folder structure is preserved
        verbose: true, // Log copied files
      }),
    ],

    external: ['react', 'react-dom', 'axios', 'react-hot-toast'],
  },
  {
    input: 'dist/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [dts()],
  },
];
