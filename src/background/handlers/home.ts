import { bgEvent } from "../events";
import { Message } from "../../types/message";
import { type Entry } from "../../content/routes/home/extract_tables";

export type ReleaseTableDetailResponse = Message<
    "home::release-table::fetch-details::response",
    FetchResponse
>;

export type FetchResponse = {
    entry: Entry;
    index: {
        table: number;
        entry: number;
    };
    response: {
        status: number;
        body: string;
    };
};

bgEvent.on("home::release-table::fetch-details::request", (message) => {
    const url = message.data.entry.title.url;
    fetch(url, { credentials: "include" })
        .then(async (resp) => {
            const text = await resp.text();
            return {
                status: resp.status,
                headers: { ...resp.headers },
                body: text,
            };
        })
        .then((resp) => {
            bgEvent.emit({
                event: "home::release-table::fetch-details::response",
                data: {
                    index: message.data.index,
                    entry: message.data.entry,
                    response: resp,
                },
            });
        });
});

export {};
