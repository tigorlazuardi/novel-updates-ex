import { HandlerContext } from "..";
import { Message } from "../../../types/message";
import { contentEvent } from "../../events";
import { Entry, applyDetail, extractReleaseTable } from "./extract_tables";
import { consolidateTable } from "./consolidate_tables";
import store from "../../../store";
import { extractDetailFromHTML } from "./extract_detail";
import { log } from "../../log";

export type FetchDetailRequest = {
    index: {
        table: number;
        entry: number;
    };
    entry: Entry;
};

export type ReleaseTableMessage = Message<
    "home::release-table::fetch-details::request",
    FetchDetailRequest
>;

contentEvent.on("home::release-table::fetch-details::response", (message) => {
    if (message.data.response.status !== 200) {
        log("error", "fetch failed", message);
        return;
    }
    const detail = extractDetailFromHTML(message.data.response.body);
    applyDetail(document.body, {
        index: message.data.index,
        entry: message.data.entry,
        detail,
    });

    store.setNamespaced(
        message.data.entry.title.url,
        "home::release-table::fetch-details",
        detail,
    );
});

export function handle(_: HandlerContext) {
    const content = document.querySelector(
        ".l-submain-h",
    ) as HTMLElement | null;
    if (content) {
        content.style.maxWidth = "100vw";
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
                .then((cache) => {
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
                    contentEvent.emit({
                        event: "home::release-table::fetch-details::request",
                        data: {
                            index: {
                                table: table.index,
                                entry: entry.index,
                            },
                            entry,
                        },
                    });
                });
        }
    }
}
