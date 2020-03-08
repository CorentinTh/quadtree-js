import pkg from './package.json';
import {terser} from "rollup-plugin-terser";
import typescript from 'rollup-plugin-typescript2';

export default {
    input: 'src/index.ts',
    output: [
        {
            file: pkg.main,
            format: 'umd',
            name: 'QT',
            sourcemap: true,
        },
        {
            file: pkg.module,
            format: 'es',
            sourcemap: true,
        }
    ],
    external: [
        ...Object.keys(pkg.dependencies || {})
    ],
    plugins: [
        typescript(),
        terser()
    ]
}