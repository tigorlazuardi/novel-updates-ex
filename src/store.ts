import { Config } from "./config";
import { StoreMap } from "./types/store";
import browser from "webextension-polyfill";

class Store {
    /**
     * setNamespaced sets a cache value on a specific namespace
     *
     * To avoid collisions with {@link Store#set} api, do not use keyof {@link StoreMap} as the namespace.
     */
    setNamespaced<K extends keyof StoreMap>(
        namespace: string,
        key: K,
        value: StoreMap[K],
    ) {
        return browser.storage.local.set({
            [namespace]: {
                [key]: value,
            },
        });
    }

    /**
     * getNamespaced gets a cache value on a namespace.
     */
    async getNamespaced<K extends keyof StoreMap>(
        namespace: string,
        key: K,
    ): Promise<StoreMap[K] | undefined> {
        const result = await browser.storage.local.get(namespace);
        if (result[namespace]) {
            return result[namespace][key];
        }
        return;
    }

    set<K extends keyof StoreMap>(key: K, value: StoreMap[K]) {
        return browser.storage.local.set({
            [key]: value,
        });
    }

    async get<K extends keyof StoreMap>(
        key: K,
    ): Promise<StoreMap[K] | undefined> {
        const result = await browser.storage.local.get(key);
        return result[key];
    }

    async config(): Promise<Config> {
        const result = await browser.storage.local.get("config");
        return result.config;
    }
}

/**
 * store abstracts browser storage's behavior for safer access and less
 * unexpected runtime error.
 */
export const store = new Store();

export default store;
