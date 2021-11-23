import typescript from "rollup-plugin-typescript2";
import external from "rollup-plugin-peer-deps-external";
import resolve from "rollup-plugin-node-resolve";

import pkg from "./package.json";

export default {
    input: "src/index.ts",
    output: [
        {
            file: 'dist/' + pkg.main,
            format: "umd",
            name: "shared-js-lib",
            exports: "named",
            sourcemap: true
        },
        {
            file: 'dist/' + pkg.module,
            format: "es",
            exports: "named",
            sourcemap: true
        }
    ],
    plugins: [
        external(),
        resolve(),
        typescript({
        })
    ]
};