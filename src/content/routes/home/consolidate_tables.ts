import { log } from "../../log";

type ReleaseItem = {
    name: string;
    url: string;
    chapters: {
        name: string;
        url?: string;
    }[];
};

type ReleaseGroup = {
    [title: string]: ReleaseItem;
};

export function consolidateTable(root: Element) {
    const tables = root.querySelectorAll<HTMLTableElement>("table.tablesorter");

    for (const table of tables) {
        const rowsToRemove: Element[] = [];
        let rows = table.querySelectorAll<HTMLTableRowElement>("tbody > tr");

        const rowReleaseGroup: ReleaseGroup[] = [];

        for (const row of rows) {
            const [titleColumn, releaseColumn, groupColumn] = row.children;
            const releaseTitle = titleColumn.querySelector("a")!.title;
            const { title: titleGroup, href: hrefGroup } =
                groupColumn.querySelector("a")!;
            let chapterName = "";
            let chapterUrl: string | undefined = undefined;

            const chapterContent = releaseColumn.querySelector(
                "a.chp-release",
            ) as HTMLAnchorElement | null;
            if (chapterContent) {
                chapterName = chapterContent.title;
                chapterUrl = chapterContent.href;
            } else {
                const chapterSpan = releaseColumn.querySelector("span")!;
                chapterName = chapterSpan.textContent!.trim();
            }

            const index = rowReleaseGroup.findIndex((group) =>
                group.hasOwnProperty(releaseTitle),
            );
            if (index !== -1) {
                rowsToRemove.push(row);
                rowReleaseGroup[index][releaseTitle].chapters.push({
                    name: chapterName,
                    url: chapterUrl,
                });
            } else {
                rowReleaseGroup.push({
                    [releaseTitle]: {
                        name: titleGroup,
                        url: hrefGroup,
                        chapters: [
                            {
                                name: chapterName,
                                url: chapterUrl,
                            },
                        ],
                    },
                });
            }
        }

        for (const row of rowsToRemove) {
            row.remove();
        }

        // Refresh the query after removing rows.
        rows = table.querySelectorAll<HTMLTableRowElement>("tbody > tr");

        for (let i = 0; i < rowReleaseGroup.length; i++) {
            const row = rows[i];
            const releaseGroup = rowReleaseGroup[i];
            const releaseColumn = row.children[1] as HTMLTableCellElement;
            releaseColumn.replaceChildren();

            for (const title in releaseGroup) {
                const div = document.createElement("div");
                div.style.display = "flex";
                div.style.flexDirection = "column";
                div.style.marginBottom = "8px";

                const groupLink = document.createElement("a");
                const item = releaseGroup[title];
                groupLink.href = item.url;
                groupLink.title = item.name;
                groupLink.textContent = item.name;
                groupLink.style.fontWeight = "bold";
                div.appendChild(groupLink);

                for (const chapter of item.chapters) {
                    if (chapter.url) {
                        const chapterA = document.createElement("a");
                        chapterA.href = chapter.url;
                        chapterA.title = chapter.name;
                        chapterA.textContent = chapter.name;
                        div.appendChild(chapterA);
                    } else {
                        const chapterSpan = document.createElement("span");
                        chapterSpan.textContent = chapter.name;
                        chapterSpan.title = chapter.name;
                        div.appendChild(chapterSpan);
                    }
                }

                releaseColumn.appendChild(div);
            }
        }
    }
}
