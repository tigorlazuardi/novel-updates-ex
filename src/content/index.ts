import browser from "webextension-polyfill";
import { defaultConfig } from "../config";
import * as routes from "./routes";
import merge from "lodash.merge";

async function prepare() {
    // uncomment when needed

    // if (process.env.NODE_ENV === "development") {
    //     await browser.storage.local.clear();
    //     log("info", "DEV: cache cleared");
    // }
    const previousConfig = await browser.storage.local.get("config");
    const config = merge(defaultConfig, previousConfig.config);
    await browser.storage.local.set({ config });
}

prepare().then(() => routes.handle());
