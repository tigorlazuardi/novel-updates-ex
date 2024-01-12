import * as routes from "./routes";
import browser from "webextension-polyfill";
import { defaultConfig } from "../config";
import { log } from "./log";

async function prepare() {
    if (process.env.NODE_ENV === "development") {
        await browser.storage.local.clear();
        log("info", "DEV: cache cleared");
    }
    const previousConfig = await browser.storage.local.get("config");
    const config = {
        ...defaultConfig,
        ...previousConfig.config,
    };
    await browser.storage.local.set({ config });
}

prepare().then(() => routes.handle());
