export type Origin = "[KR]" | "[CN]" | "[JP]";

export type Entry = {
    // origin is only available if the user enables the "show origin" option
    origin?: Origin;
    title: {
        name: string;
        url: string;
    };
    chapter: {
        name: string;
        url: string;
    };
    group: {
        name: string;
        url: string;
    };
};

export type ReleaseTable = {
    date: string;
    entries: Entry[];
};

export function extractReleaseTable(root: Element): ReleaseTable[] {
    const out: ReleaseTable[] = [];

    const tables = root.querySelectorAll<HTMLTableElement>("table.tablesorter");

    for (const table of tables) {
        const date = table.previousElementSibling?.textContent?.trim() ?? "";
        const rows = table.querySelectorAll<HTMLTableRowElement>("tbody > tr");
        const entries: Entry[] = [];
        for (const row of rows) {
            const [titleColumn, releaseColumn, groupColumn] = row.children;

            const origin = (titleColumn
                .querySelector("span")
                ?.textContent?.trim() ?? undefined) as Origin | undefined;

            const titleContent = titleColumn.querySelector("a")!;
            const title = {
                name: titleContent.title,
                url: titleContent.href,
            };

            const chapterContent = releaseColumn.querySelector("a")!;
            const chapter = {
                name: chapterContent.title,
                url: chapterContent.href,
            };

            const groupContent = groupColumn.querySelector("a")!;
            const group = {
                name: groupContent.title,
                url: groupContent.href,
            };
            entries.push({ origin, title, chapter, group });
        }
        out.push({ date, entries });
    }

    return out;
}
