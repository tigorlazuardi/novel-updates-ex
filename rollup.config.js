import { defineConfig } from "rollup";
import pkg from "./package.json" with { type: "json" };

import typescript from "@rollup/plugin-typescript";

import replace from "@rollup/plugin-replace";
import resolve from "@rollup/plugin-node-resolve";
import copy from "rollup-plugin-copy";
import commonjs from "@rollup/plugin-commonjs";
import cleanup from "rollup-plugin-cleanup";

import webext from "rollup-plugin-webext";

const production = !process.env.ROLLUP_WATCH;
if (production) process.env.NODE_ENV = "production";
const nodeEnv = process.env.NODE_ENV || "development";

const manifest = {
    manifest_version: 3,
    version: pkg.version,
    name: "Novel Updates EX",
    description: pkg.description,
    host_permissions: ["*://*.novelupdates.com"],
    content_scripts: [
        {
            matches: ["*://*.novelupdates.com/*"],
            js: ["content.js"],
        },
    ],
    icons: {
        48: "assets/icons/nuex_48.png",
        96: "assets/icons/nuex_96.png",
    },
    permissions: ["storage"],
};

const createManifest = {
    name: "create-manifest-json",
    generateBundle() {
        this.emitFile({
            type: "asset",
            fileName: "manifest.json",
            source: JSON.stringify(manifest, null, 4),
        });
    },
};

export default defineConfig([
    {
        input: {
            content: "src/content/index.ts",
        },
        output: {
            dir: "dist",
            format: "esm",
            sourcemap: !production,
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
                        src: "src/assets",
                        dest: "dist",
                    },
                ],
            }),
            createManifest,
            webext({
                url: "https://www.novelupdates.com",
                targets: ["chromium"],
                devtools: false,
                bundle: {
                    dir: "release",
                },
            }),
        ],
    },
]);
