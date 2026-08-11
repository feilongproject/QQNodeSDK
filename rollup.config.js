import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { typescriptPaths } from 'rollup-plugin-typescript-paths';
import replace from '@rollup/plugin-replace';
import dts from 'rollup-plugin-dts';
import json from '@rollup/plugin-json';

const ENV = process.env.NODE_ENV;
const extensions = ['.ts', '.js'];
const external = ['ws', 'resty-client'];

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'lib/index.js',
      format: 'cjs',
      sourcemap: ENV === 'dev',
    },
    plugins: [
      json(),
      babel({
        exclude: 'node_modules/**',
        extensions,
        babelHelpers: 'runtime',
      }),
      nodeResolve({ browser: true, extensions }),
      typescriptPaths({
        preserveExtensions: true,
      }),
      commonjs(),
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify(ENV),
      }),
    ],
    external,
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'es/index.js',
      format: 'es',
      sourcemap: ENV === 'dev',
    },
    plugins: [
      json(),
      babel({
        exclude: 'node_modules/**',
        extensions,
        babelHelpers: 'runtime',
      }),
      nodeResolve({ browser: true, extensions }),
      typescriptPaths({
        preserveExtensions: true,
      }),
      commonjs(),
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify(ENV),
      }),
    ],
    external,
  },
  {
    input: 'src/index.ts',
    output: [{ file: 'typings/index.d.ts', format: 'es' }],
    // Keep ws external; resty-client is path-mapped below and inlined into typings.
    external: ['ws'],
    plugins: [
      json(),
      typescriptPaths({
        preserveExtensions: true,
      }),
      dts({
        compilerOptions: {
          baseUrl: '.',
          paths: {
            '@src/*': ['src/*'],
            // Inline public HTTP types so consumers need not resolve resty-client declarations
            'resty-client': ['src/types/resty.ts'],
          },
        },
      }),
    ],
  },
];
