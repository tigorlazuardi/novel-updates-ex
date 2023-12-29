import { defineConfig } from "rollup";

import typescript from "@rollup/plugin-typescript";

import replace from "@rollup/plugin-replace";
import resolve from "@rollup/plugin-node-resolve";
import copy from "rollup-plugin-copy";
import commonjs from "@rollup/plugin-commonjs";

const production = !process.env.ROLLUP_WATCH;
if (production) process.env.NODE_ENV = "production";
const nodeEnv = process.env.NODE_ENV || "development";

export default defineConfig([
    {
        /* content scripts */
        input: "src/content/index.ts",
        output: {
            sourcemap: !production,
            dir: "dist/content",
            format: "esm",
        },
        plugins: [
            typescript(),
            replace({
                preventAssignment: true,
                values: {
                    "process.env.NODE_ENV": JSON.stringify(nodeEnv),
                },
                delimiters: ["", ""],
            }),
            resolve({ browser: true, preferBuiltins: false }),
            commonjs(),
            copy({
                targets: [
                    {
                        src: "src/manifest.json",
                        dest: "dist/",
                    },
                ],
            }),
        ],
        watch: {
            clearScreen: true,
        },
    },
]);
