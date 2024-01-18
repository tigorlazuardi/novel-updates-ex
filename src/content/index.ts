import browser from "webextension-polyfill";
import { defaultConfig } from "../config";
import * as routes from "./routes";
import mergeWith from "lodash.mergewith";

async function prepare() {
    // uncomment when needed

    // if (process.env.NODE_ENV === "development") {
    //     await browser.storage.local.clear();
    //     console.log("info", "DEV: cache cleared");
    // }
    const previousConfig = await browser.storage.local.get("config");
    const config = mergeWith(
        defaultConfig,
        previousConfig.config,
        (_: any, mod: any) => (Array.isArray(mod) ? mod : undefined),
    );
    await browser.storage.local.set({ config });
}

prepare().then(() => routes.handle());
