import { bgEvent } from "../events";
import { parseDocument } from "htmlparser2";
import { Document, Element, Text } from "domhandler";
import { selectOne, selectAll } from "css-select";
import { log } from "../log";
import { Message } from "../../types/message";
import {
    type Origin,
    type Entry,
} from "../../content/routes/home/extract_tables";
import store from "../../store";

type ReleaseTableDetailResponse = {
    index: {
        table: number;
        entry: number;
    };
    entry: Entry;
    image: string | null;
    origin: Origin;
    description: string[];
    rating: Rating;
};

type Rating = {
    rating: number;
    votes: number;
};

export type ReleaseTableImageFetchMessage = Message<
    "home::release-table::fetch-details::response",
    ReleaseTableDetailResponse
>;

export type ReleaseDetail = {
    image: string;
    description: string[];
    origin: Origin;
    rating: Rating;
};

bgEvent.on("home::release-table::fetch-details::request", (message) => {
    for (const table of message.data) {
        for (const entry of table.entries) {
            const url = entry.title.url;
            store
                .getNamespaced(url, "home::release-table::fetch-details")
                .then((result) => {
                    if (result) {
                        const payload: ReleaseTableDetailResponse = {
                            index: {
                                table: table.index,
                                entry: entry.index,
                            },
                            entry,
                            image: result.image,
                            description: result.description,
                            origin: result.origin,
                            rating: result.rating,
                        };
                        bgEvent.emit({
                            event: "home::release-table::fetch-details::response",
                            data: payload,
                        });
                        return;
                    }
                    return fetch(url, { credentials: "include" })
                        .then((resp) => resp.text())
                        .then((text) => {
                            const dom = parseDocument(text);
                            const image = extractImageCover(dom);
                            const description = extractDescription(dom);
                            const origin = extractOrigin(dom);
                            const rating = extractRating(dom);
                            const payload: ReleaseTableDetailResponse = {
                                index: {
                                    table: table.index,
                                    entry: entry.index,
                                },
                                entry,
                                image,
                                description,
                                origin,
                                rating,
                            };
                            bgEvent.emit({
                                event: "home::release-table::fetch-details::response",
                                data: payload,
                            });

                            return store.setNamespaced(
                                url,
                                "home::release-table::fetch-details",
                                {
                                    image,
                                    description,
                                    origin,
                                    rating,
                                },
                            );
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

function extractOrigin(doc: Document): Origin {
    const el = selectOne("div#showtype > span", doc) as Element | null;
    if (!el) {
        return "";
    }
    const text = el.children[0] as Text;
    if (!text) {
        return "";
    }
    return mapOrigin(text.data.trim());
}

const ratingRegex = /\((.*)\s\/.*,\s(\d+).*/;

function extractRating(doc: Document): Rating {
    const rating: Rating = {
        votes: 0,
        rating: 0,
    };
    const el = selectOne("span.uvotes", doc) as Element | null;
    if (!el) {
        return rating;
    }
    const text = el.children[0] as Text;
    const match = ratingRegex.exec(text.data);
    if (!match) {
        return rating;
    }
    rating.rating = parseFloat(match[1]);
    rating.votes = parseInt(match[2]);
    return rating;
}

function mapOrigin(origin: string): Origin {
    switch (origin) {
        case "(CN)":
            return "[CN]";
        case "(KR)":
            return "[KR]";
        case "(JP)":
            return "[JP]";
        default:
            return "";
    }
}

export {};
