import { HandlerContext } from "..";
import { Entry, applyDetail, extractReleaseTable } from "./extract_tables";
import { consolidateTable } from "./consolidate_tables";
import store from "../../../store";
import { extractDetailFromHTML } from "./extract_detail";

export type FetchDetailRequest = {
    index: {
        table: number;
        entry: number;
    };
    entry: Entry;
};

export async function handle(_: HandlerContext) {
    const config = await store.config();
    if (config.home.expand_table_width.enable) {
        const content = document.querySelector(
            ".l-submain-h",
        ) as HTMLElement | null;
        if (content) {
            content.style.maxWidth = "100vw";
        }
    }

    consolidateTable(document.body);

    const releases = extractReleaseTable(document.body);

    for (const table of releases) {
        for (const entry of table.entries) {
            store
                .getNamespaced(
                    entry.title.url,
                    "home::release-table::fetch-details",
                )
                .then(async (cache) => {
                    if (cache) {
                        applyDetail(document.body, {
                            entry,
                            detail: cache,
                            index: {
                                table: table.index,
                                entry: entry.index,
                            },
                        });
                        return;
                    }
                    const response = await fetch(entry.title.url, {
                        credentials: "include",
                    });
                    const text = await response.text();
                    const detail = extractDetailFromHTML(text);
                    applyDetail(document.body, {
                        entry,
                        detail,
                        index: {
                            table: table.index,
                            entry: entry.index,
                        },
                    });
                    store.setNamespaced(
                        entry.title.url,
                        "home::release-table::fetch-details",
                        detail,
                    );
                });
        }
    }
}
