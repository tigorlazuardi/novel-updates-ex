import mergeWith from "lodash.mergewith";
import browser from "webextension-polyfill";
import { Config } from "./config";
import { StoreMap } from "./types/store";

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

    async updateConfig(config: DeepPartial<Config>) {
        const currentConfig = await this.config();
        const newConfig = mergeWith(currentConfig, config, (_, mod) => {
            if (Array.isArray(mod)) {
                return mod;
            }
            return undefined;
        });
        browser.storage.local.set({
            config: newConfig,
        });
        return newConfig as Config;
    }

    getSize(obj: object): number {
        return sizeOf(obj);
    }
}

type DeepPartial<T> = T extends object
    ? {
          [P in keyof T]?: DeepPartial<T[P]>;
      }
    : T;

const typeSizes = {
    undefined: () => 0,
    boolean: () => 4,
    number: () => 8,
    symbol: () => 8,
    bigint: () => 24,
    function: () => 0,
    string: (item: string) => 2 * item.length,
    object: (item: any): number =>
        !item
            ? 0
            : Object.keys(item).reduce(
                  (total, key) => sizeOf(key) + sizeOf(item[key]) + total,
                  0,
              ),
};

const sizeOf = (value: any) => typeSizes[typeof value](value);

/**
 * store abstracts browser storage's behavior for safer access and less
 * unexpected runtime error.
 */
export const store = new Store();

export default store;
