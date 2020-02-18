import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import buble from 'rollup-plugin-buble';
import json from 'rollup-plugin-json';
import { terser } from "rollup-plugin-terser";
import { version, author, license, description, name } from './package.json';

const moduleName = 'Offset';

const banner = `\
/**
 * ${name} v${version}
 * ${description}
 *
 * @author ${author}
 * @license ${license}
 * @preserve
 */
`;

module.exports = [{
  input: 'src/index.js',
  output: {
    file: `dist/${name}.js`,
    name: moduleName,
    sourcemap: true,
    format: 'umd',
    banner
  },
  plugins: [
    resolve(),  // so Rollup can find external libs
    commonjs(), // so Rollup can convert commonJS to an ES module
    buble()
  ]
}, {
  input: `example/app.js`,
  external: ['leaflet', 'leaflet-editable'],
  output: {
    file: `example/bundle.js`,
    name: moduleName,
    sourcemap: true,
    format: 'iife',
    banner,
    globals: {
      'leaflet': 'L',
      'leaflet-editable': 'L.Editable'
    }
  },
  plugins: [
    resolve(),  // so Rollup can find external libs
    commonjs(), // so Rollup can convert commonJS to an ES module
    json(),
    buble()
  ]
}, {
  input: `src/index.js`,
  output: {
    file: `dist/${name}.min.js`,
    name: moduleName,
    sourcemap: true,
    format: 'umd',
    banner
  },
  plugins: [
    resolve(),  // so Rollup can find external libs
    commonjs(), // so Rollup can convert commonJS to an ES module
    buble(),
    terser({
      sourcemap: true,
      output: {
        comments: 'some'
      }
    })
  ]
}];
