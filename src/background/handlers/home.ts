import { bgEvent } from "../events";

bgEvent.on("home::release-table", async (message) => {
    console.log("received release table message");
    const table = message.data.at(0);
    if (!table) {
        return;
    }

    const url = table.entries[0].title.url;

    const resp = await fetch(url, { credentials: "include" });
    const text = await resp.text();

    const parser = new DOMParser();

    const doc = parser.parseFromString(text, "text/html");
    console.log(doc);
});

export {};
