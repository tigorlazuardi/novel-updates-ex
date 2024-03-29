import { HandlerContext } from "..";
import store from "../../../store";
import { consolidateTable } from "./consolidate_tables";
import { extractDetailFromHTML } from "./extract_detail";
import { Entry, applyDetail, extractReleaseTable } from "./extract_tables";
import { modifyScribbleHub } from "./modify_scribble_hub";
import { reRenderTable } from "./re_render";
import { renderOption } from "./options";
import { ConfigChangedCallback } from "./options/callback";

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
            content.style.maxWidth = config.home.expand_table_width.value;
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
                    const config = await store.config();
                    if (cache) {
                        await applyDetail(document.body, config, {
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
                    await applyDetail(document.body, config, {
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

    await modifyScribbleHub(document.body);

    const renderFn: ConfigChangedCallback = (config) => {
        reRenderTable(config);
    };

    const optionsElement = await renderOption(renderFn);

    const optionRenderTarget = document.querySelector("div.release>br");
    if (optionRenderTarget) {
        optionRenderTarget.after(optionsElement);
    }
}
