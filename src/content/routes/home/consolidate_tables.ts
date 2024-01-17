type ReleaseItem = {
    group: HTMLAnchorElement;
    chapters: {
        chapter: HTMLAnchorElement | HTMLSpanElement;
        nuf_element: HTMLSpanElement | null;
        check_box: Element[];
    }[];
};

type ReleaseGroup = {
    [title: string]: ReleaseItem;
};

export function consolidateTable(root: Element) {
    const tables = root.querySelectorAll<HTMLTableElement>("table.tablesorter");

    for (const table of tables) {
        const name = table.previousElementSibling?.textContent?.trim() ?? "";
        table.setAttribute("data-table-name", name);

        prepareHeader(table);

        const rowsToRemove: Element[] = [];
        let rows = table.querySelectorAll<HTMLTableRowElement>("tbody > tr");

        const rowReleaseGroup: ReleaseGroup[] = [];

        for (const row of rows) {
            const [titleCell, releaseCell, groupCell] = row.children;
            titleCell.setAttribute("data-column-name", "title");
            releaseCell.setAttribute("data-column-name", "release");
            const releaseTitle = titleCell.querySelector("a")!.title;
            const groupELement = groupCell
                .querySelector("a")!
                .cloneNode(true) as HTMLAnchorElement;
            let chapterElement: HTMLAnchorElement | HTMLSpanElement;
            const chapterContent = releaseCell.querySelector(
                "a.chp-release",
            ) as HTMLAnchorElement | null;
            if (chapterContent) {
                chapterElement = chapterContent.cloneNode(
                    true,
                ) as HTMLAnchorElement;
            } else {
                chapterElement = releaseCell
                    .querySelector("span")!
                    .cloneNode(true) as HTMLSpanElement;
            }

            const nufElement = releaseCell
                .querySelector("span.nuf_link")
                ?.cloneNode(true) as HTMLSpanElement | null;

            if (nufElement) {
                const a = nufElement.querySelector("a");
                if (a) {
                    nufElement.setAttribute("data-nuf-link", a.href);
                }
            }

            const checkBoxElements: Element[] = [];
            const checkBoxInput = groupCell
                .querySelector("input[type=checkbox]")
                ?.cloneNode(true) as Element | null;
            if (checkBoxInput) {
                checkBoxElements.push(checkBoxInput);
            }
            const checkBoxLabel = groupCell
                .querySelector("label.enableread")
                ?.cloneNode(true) as Element | null;
            if (checkBoxLabel) {
                checkBoxElements.push(checkBoxLabel);
            }

            const index = rowReleaseGroup.findIndex((group) =>
                group.hasOwnProperty(releaseTitle),
            );
            if (index !== -1) {
                rowsToRemove.push(row);
                rowReleaseGroup[index][releaseTitle].chapters.push({
                    chapter: chapterElement,
                    nuf_element: nufElement,
                    check_box: checkBoxElements,
                });
            } else {
                rowReleaseGroup.push({
                    [releaseTitle]: {
                        group: groupELement,
                        chapters: [
                            {
                                chapter: chapterElement,
                                nuf_element: nufElement,
                                check_box: checkBoxElements,
                            },
                        ],
                    },
                });
            }

            groupCell.remove();
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
            releaseColumn.style.minWidth = "10rem";
            releaseColumn.removeAttribute("width");
            releaseColumn.replaceChildren();

            const titleColumn = row.children[0] as HTMLTableCellElement;
            titleColumn.style.paddingRight = "1rem";
            titleColumn.style.paddingBottom = "2rem";
            titleColumn.removeAttribute("width");
            const titleLink = titleColumn.querySelector("a")!;
            titleLink.textContent = titleLink.title;

            for (const title in releaseGroup) {
                const div = document.createElement("div");
                div.style.display = "flex";
                div.style.flexDirection = "column";
                div.style.marginBottom = "8px";
                div.classList.add("ex--release-group");

                const item = releaseGroup[title];
                item.group.style.fontWeight = "bold";
                item.group.classList.add("ex--group-link");
                div.setAttribute("data-translator", item.group.title);
                div.setAttribute("data-translator-url", item.group.href);
                div.appendChild(item.group);

                for (const chapter of item.chapters) {
                    const chapterDiv = document.createElement("div");
                    chapterDiv.classList.add("ex--chapter-link");
                    chapterDiv.style.display = "flex";
                    if (chapter.nuf_element) {
                        chapterDiv.appendChild(chapter.nuf_element);
                        const nufLink =
                            chapter.nuf_element.getAttribute("data-nuf-link");
                        if (nufLink) {
                            chapterDiv.setAttribute("data-nuf-link", nufLink);
                        }
                    }
                    chapter.chapter.style.flexGrow = "1";
                    chapterDiv.appendChild(chapter.chapter);
                    chapterDiv.setAttribute(
                        "data-chapter-name",
                        chapter.chapter.textContent ?? "",
                    );
                    if (chapter.chapter instanceof HTMLAnchorElement) {
                        chapterDiv.setAttribute(
                            "data-chapter-url",
                            chapter.chapter.href,
                        );
                    }
                    if (chapter.check_box.length > 0) {
                        const boxDiv = document.createElement("div");
                        boxDiv.style.paddingRight = "1rem";
                        const [input, label] = chapter.check_box;
                        boxDiv.appendChild(input);
                        boxDiv.appendChild(label);
                        chapterDiv.appendChild(boxDiv);
                    }
                    div.appendChild(chapterDiv);
                }

                releaseColumn.appendChild(div);
            }
            const coverCell = document.createElement("td");
            row.prepend(coverCell);
        }

        const headerRow = table.querySelector(
            "thead>tr",
        )! as HTMLTableRowElement;
        headerRow.lastElementChild!.remove();
    }
}

function prepareHeader(table: HTMLTableElement) {
    const headerRow = table.querySelector("thead>tr")!;
    const headers = headerRow.querySelectorAll("tr>th");
    if (headers[0].textContent === "Cover") {
        return;
    }

    const header = document.createElement("th");
    header.textContent = "Cover";
    header.className = "header";

    headerRow.prepend(header);
}
