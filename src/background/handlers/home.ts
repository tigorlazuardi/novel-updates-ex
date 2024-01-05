import { bgEvent } from "../events";
import { parseDocument } from "htmlparser2";
import { Document, Element, Text } from "domhandler";
import { selectOne, selectAll } from "css-select";
import { log } from "../log";
import { Message } from "../../types/message";
import { type Entry } from "../../content/routes/home/extract_tables";
import browser from "webextension-polyfill";

type ReleaseTableImageFetchPayload = {
    index: {
        table: number;
        entry: number;
    };
    entry: Entry;
    image: string | null;
    description: string[];
};

export type ReleaseTableImageFetchMessage = Message<
    "home::release-table::fetch-details::response",
    ReleaseTableImageFetchPayload
>;

const cacheKey = "release-table::fetch-details";

type CacheItem = {
    image: string;
    description: string[];
};

type CacheResult = {
    [key: string]: {
        [cacheKey]?: CacheItem;
    };
};

bgEvent.on("home::release-table::fetch-details::request", (message) => {
    for (const table of message.data) {
        for (const entry of table.entries) {
            const url = entry.title.url;
            browser.storage.local.get(url).then((result: CacheResult) => {
                const store = result[url];
                if (store) {
                    const cache = store[cacheKey];
                    if (cache && cache.image && cache.description) {
                        const payload: ReleaseTableImageFetchPayload = {
                            index: {
                                table: table.index,
                                entry: entry.index,
                            },
                            entry,
                            image: cache.image,
                            description: cache.description,
                        };
                        bgEvent.emit({
                            event: "home::release-table::fetch-details::response",
                            data: payload,
                        });
                        return;
                    }
                }
                fetch(url, { credentials: "include" })
                    .then((resp) => resp.text())
                    .then((text) => {
                        const dom = parseDocument(text);
                        const image = extractImageCover(dom);
                        const description = extractDescription(dom);
                        const payload: ReleaseTableImageFetchPayload = {
                            index: {
                                table: table.index,
                                entry: entry.index,
                            },
                            entry,
                            image,
                            description,
                        };
                        bgEvent.emit({
                            event: "home::release-table::fetch-details::response",
                            data: payload,
                        });

                        return browser.storage.local.set({
                            [url]: {
                                [cacheKey]: {
                                    image,
                                    description,
                                },
                            },
                        });
                    })
                    .catch((err) => {
                        log("error", "failed to fetch image", err);
                    });
            });
        }
    }
});

function extractImageCover(doc: Document) {
    let el = selectOne(".serieseditimg>img", doc) as Element | null;
    if (!el) {
        el = selectOne(".seriesimg>img", doc) as Element | null;
    }
    if (!el) {
        return "#";
    }
    return el.attribs.src;
}

function extractDescription(doc: Document): string[] {
    const out = [];
    const el = selectAll("#editdescription>p", doc) as unknown as Element[];
    for (const e of el) {
        const text = e.children[0] as Text;
        if (!text) {
            continue;
        }
        out.push(text.data.trim());
    }

    return out;
}

export {};
