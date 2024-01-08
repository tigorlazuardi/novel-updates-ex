import { log } from "../../log";

export type Origin = "[KR]" | "[CN]" | "[JP]" | "";

export type ReleaseChapter = {
    name: string;
    url?: string;
    nuf_link?: string;
};

export type ReleaseItem = {
    group: {
        name: string;
        url: string;
    };
    chapters: ReleaseChapter[];
};

export type Entry = {
    // origin is only available if the user enables the "show origin" option
    origin: Origin;
    index: number;
    title: {
        name: string;
        url: string;
    };
    release: ReleaseItem[];
};

export type ReleaseTable = {
    name: string;
    index: number;
    entries: Entry[];
};

export type ReleaseTableDetail = {
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

export type Rating = {
    rating: number;
    votes: number;
};

export function extractEntry(row: HTMLTableRowElement, index: number): Entry {
    const [titleColumn, releaseColumn] = row.children;

    const origin = (titleColumn.querySelector("span")?.textContent?.trim() ??
        undefined) as Origin | undefined;

    const titleContent = titleColumn.querySelector("a")!;
    const title = {
        name: titleContent.title,
        url: titleContent.href,
    };

    const releases: ReleaseItem[] = [];

    for (const rel of releaseColumn.querySelectorAll<HTMLDivElement>(
        "div.ex--release-group",
    )) {
        const groupName = rel.getAttribute("data-translator")!;
        const groupUrl = rel.getAttribute("data-translator-url")!;

        const chapters: ReleaseChapter[] = [];
        for (const div of rel.querySelectorAll<HTMLDivElement>(
            "div.ex--chapter-link",
        )) {
            const nufLink =
                div
                    .querySelector("span.nuf_link")
                    ?.getAttribute("data-nuf-link") ?? undefined;
            const chapterName = div.getAttribute("data-chapter-name")!;
            const chapterUrl = div.getAttribute("data-chapter-url")!;
            chapters.push({
                name: chapterName,
                url: chapterUrl,
                nuf_link: nufLink,
            });
        }

        releases.push({ group: { name: groupName, url: groupUrl }, chapters });
    }

    return { index, origin: origin ?? "", title, release: releases };
}

export function extractReleaseTable(root: Element): ReleaseTable[] {
    const out: ReleaseTable[] = [];

    const tables = root.querySelectorAll<HTMLTableElement>("table.tablesorter");

    let tableIndex = 0;
    for (const table of tables) {
        const name = table.previousElementSibling?.textContent?.trim() ?? "";
        const rows = table.querySelectorAll<HTMLTableRowElement>("tbody > tr");
        const entries: Entry[] = [];
        let index = 0;
        for (const row of rows) {
            const entry = extractEntry(row, index);
            entries.push(entry);
            index++;
        }
        out.push({ index: tableIndex, name, entries });
        tableIndex++;
    }

    return out;
}
