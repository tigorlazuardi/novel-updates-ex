import { Config } from "../../../config";
import store from "../../../store";
import { applyFilter } from "./filter";
import { modifyRow } from "./modify_row";

export type Origin = "[KR]" | "[CN]" | "[JP]" | "[OTHER]";

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

export type ReleaseDetail = {
    image: string;
    origin: Origin;
    description: string[];
    rating: Rating;
};

export type ReleaseTableDetail = {
    index: {
        table: number;
        entry: number;
    };
    entry: Entry;
    detail: ReleaseDetail;
};

export type Rating = {
    rating: number;
    votes: number;
};

export function extractEntry(row: HTMLTableRowElement, index: number): Entry {
    const [_, titleColumn, releaseColumn] = row.children;

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

    return { index, origin: origin ?? "[OTHER]", title, release: releases };
}

export function extractReleaseTable(root: Element): ReleaseTable[] {
    const out: ReleaseTable[] = [];

    const tables = root.querySelectorAll<HTMLTableElement>("table.tablesorter");

    let tableIndex = 0;
    for (const table of tables) {
        const name = table.getAttribute("data-table-name") ?? "";
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

export async function applyDetail(
    root: Element,
    config: Config,
    data: ReleaseTableDetail,
) {
    // const config = await store.config();
    const tables = root.querySelectorAll<HTMLTableElement>("table.tablesorter");
    const table = tables[data.index.table];
    if (!table) {
        return;
    }
    const rows = table.querySelectorAll("tbody>tr");
    const row = rows[data.index.entry] as HTMLTableRowElement;
    if (!row) {
        return;
    }
    modifyRow(row, data);
    applyFilter(config, row);
}
