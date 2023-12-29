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
        /* content scripts firefox */
        input: "src/content/index.ts",
        output: {
            sourcemap: !production,
            dir: "dist/firefox/content",
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
        ],
        watch: {
            clearScreen: true,
        },
    },
    {
        /* content scripts chrome */
        input: "src/content/index.ts",
        output: {
            sourcemap: !production,
            dir: "dist/chrome/content",
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
        ],
        watch: {
            clearScreen: true,
        },
    },
    {
        /* background scripts firefox */
        input: "src/background/index.ts",
        output: {
            sourcemap: !production,
            dir: "dist/firefox/background",
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
                        src: "src/background/index.html",
                        dest: "dist/firefox/background",
                    },
                ],
            }),
        ],
        watch: {
            clearScreen: true,
        },
    },
    {
        /* background scripts chrome */
        input: "src/background/index.ts",
        output: {
            sourcemap: !production,
            dir: "dist/chrome/background",
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
                        src: "src/background/index.html",
                        dest: "dist/chrome/background",
                    },
                ],
            }),
        ],
        watch: {
            clearScreen: true,
        },
    },
    {
        input: "src/dummy.ts",
        output: {
            sourcemap: !production,
            dir: "dist",
            format: "esm",
        },
        plugins: [
            copy({
                targets: [
                    {
                        src: "src/manifest.chrome.json",
                        dest: "dist/chrome",
                        rename: "manifest.json",
                    },
                    {
                        src: "src/manifest.firefox.json",
                        dest: "dist/firefox",
                        rename: "manifest.json",
                    },
                ],
            }),
        ],
    },
]);
