import { defineConfig } from "rollup";

import typescript from "@rollup/plugin-typescript";

import replace from "@rollup/plugin-replace";
import resolve from "@rollup/plugin-node-resolve";
import copy from "rollup-plugin-copy";
import commonjs from "@rollup/plugin-commonjs";
import cleanup from "rollup-plugin-cleanup";

const production = !process.env.ROLLUP_WATCH;
if (production) process.env.NODE_ENV = "production";
const nodeEnv = process.env.NODE_ENV || "development";

export default defineConfig([
    {
        /* content scripts firefox */
        input: "src/content/index.ts",
        output: {
            sourcemap: !production,
            file: "dist/firefox/content.js",
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
            cleanup({ comments: "none" }),
        ],
        watch: {
            clearScreen: true,
            chokidar: {
                usePolling: true,
            },
        },
    },
    {
        /* content scripts chrome */
        input: "src/content/index.ts",
        output: {
            sourcemap: !production,
            file: "dist/chrome/content.js",
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
            cleanup({ comments: "none" }),
        ],
        watch: {
            clearScreen: true,
            chokidar: {
                usePolling: true,
            },
        },
    },
    {
        /* background scripts firefox */
        input: "src/background/index.ts",
        output: {
            sourcemap: !production,
            file: "dist/firefox/background.js",
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
            cleanup({ comments: "none" }),
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
            chokidar: {
                usePolling: true,
            },
            clearScreen: true,
        },
    },
    {
        /* background scripts chrome */
        input: "src/background/index.ts",
        output: {
            sourcemap: !production,
            file: "dist/chrome/background.js",
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
            cleanup({ comments: "none" }),
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
            chokidar: {
                usePolling: true,
            },
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
        watch: {
            include: ["src/manifest.*.json", "src/dummy.ts"],
            clearScreen: true,
            chokidar: {
                usePolling: true,
            },
        },
    },
]);
