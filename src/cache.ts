import { CacheMap } from "./types/cache";
import browser from "webextension-polyfill";

class StorageCache {
    /**
     * setNamespaced sets a cache value on a specific namespace
     *
     * To avoid collisions with {@link StorageCache#set} api, do not use keyof {@link CacheMap} as the namespace.
     */
    setNamespaced<K extends keyof CacheMap>(
        namespace: string,
        key: K,
        value: CacheMap[K],
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
    async getNamespaced<K extends keyof CacheMap>(
        namespace: string,
        key: K,
    ): Promise<CacheMap[K] | undefined> {
        const result = await browser.storage.local.get(namespace);
        if (result[namespace]) {
            return result[namespace][key];
        }
        return;
    }

    set<K extends keyof CacheMap>(key: K, value: CacheMap[K]) {
        return browser.storage.local.set({
            [key]: value,
        });
    }

    async get<K extends keyof CacheMap>(
        key: K,
    ): Promise<CacheMap[K] | undefined> {
        const result = await browser.storage.local.get(key);
        return result[key];
    }
}

export const cache = new StorageCache();

export default cache;
