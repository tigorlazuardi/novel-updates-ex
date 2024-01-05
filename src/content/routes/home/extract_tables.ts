export type Origin = "[KR]" | "[CN]" | "[JP]";

export type Entry = {
    // origin is only available if the user enables the "show origin" option
    origin?: Origin;
    index: number;
    title: {
        name: string;
        url: string;
    };
    chapter: {
        name: string;
        url?: string;
    };
    group: {
        name: string;
        url: string;
    };
};

export type ReleaseTable = {
    date: string;
    index: number;
    entries: Entry[];
};

export function extractReleaseTable(root: Element): ReleaseTable[] {
    const out: ReleaseTable[] = [];

    const tables = root.querySelectorAll<HTMLTableElement>("table.tablesorter");

    let tableIndex = 0;
    for (const table of tables) {
        const date = table.previousElementSibling?.textContent?.trim() ?? "";
        const rows = table.querySelectorAll<HTMLTableRowElement>("tbody > tr");
        const entries: Entry[] = [];
        let index = 0;
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

            const chapter: { name: string; url?: string } = {
                name: "",
            };

            // chapterContent 'a' element can be null when user is not logged in.
            const chapterContent = releaseColumn.querySelector("a")!;
            if (chapterContent) {
                chapter.name = chapterContent.title;
                chapter.url = chapterContent.href;
            } else {
                const chapterSpan = releaseColumn.querySelector("span")!;
                chapter.name = chapterSpan.textContent!.trim();
            }

            const groupContent = groupColumn.querySelector("a")!;
            const group = {
                name: groupContent.title,
                url: groupContent.href,
            };
            entries.push({ index, origin, title, chapter, group });
            index++;
        }
        out.push({ index: tableIndex, date, entries });
        tableIndex++;
    }

    return out;
}
