import { bgEvent } from "../events";
import { parseDocument } from "htmlparser2";
import { Document, Element, Text } from "domhandler";
import { selectOne, selectAll } from "css-select";
import { log } from "../log";
import { Message } from "../../types/message";
import { type Entry } from "../../content/routes/home/extract_tables";

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
    "home::release-table::cover-image",
    ReleaseTableImageFetchPayload
>;

bgEvent.on("home::release-table", (message) => {
    for (const table of message.data) {
        for (const entry of table.entries) {
            const url = entry.title.url;
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
                        event: "home::release-table::cover-image",
                        data: payload,
                    });
                })
                .catch((err) => {
                    log("error", "failed to fetch image", err);
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
