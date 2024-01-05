import { log } from "./log";
import browser from "webextension-polyfill";

if (process.env.NODE_ENV === "development") {
    browser.storage.local.clear().then(() => {
        log("info", "DEV: cache storage cleared");
    });
}

// Start the extension
import "./handlers";

log("info", "Background Script Loaded");

export {};
