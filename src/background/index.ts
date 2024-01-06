import { log } from "./log";
import browser from "webextension-polyfill";
import { defaultConfig } from "../config";

import "./handlers";

if (process.env.NODE_ENV === "development") {
    browser.storage.local.get("config").then((result) => {
        browser.storage.local.clear().then(() => {
            log("info", "DEV: cache cleared");
            const config = {
                ...defaultConfig,
                ...result.config,
            };
            browser.storage.local.set({ config });
        });
    });
} else {
    browser.storage.local.get("config").then((result) => {
        const config = {
            ...defaultConfig,
            ...result.config,
        };
        browser.storage.local.set({ config });
    });
}

log("info", "Background Script Loaded");

export {};
