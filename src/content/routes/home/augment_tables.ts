import { ReleaseTableImageFetchMessage } from "../../../background/handlers/home";
import { contentEvent } from "../../events";
import { log } from "../../log";

contentEvent.on("home::release-table::fetch-details::response", (message) => {
    const tables =
        document.body.querySelectorAll<HTMLTableElement>("table.tablesorter");

    const table = tables[message.data.index.table];
    if (!table) {
        log("warn", `table index ${message.data.index.table} not found`);
        return;
    }

    augmentTable(table);

    const rows = table.querySelectorAll("tbody>tr");
    const row = rows[message.data.index.entry];
    if (!row) {
        log("warn", `row index ${message.data.index.entry} not found`);
        return;
    }

    const coverCell = row.children[0] as HTMLTableCellElement;
    coverCell.style.display = "flex";
    coverCell.style.flexDirection = "column";
    coverCell.style.alignContent = "center";
    // coverCell.style.justifyContent = "center";

    const divImg = document.createElement("div");
    divImg.classList.add("ex:image-cover");
    addCoverToElement(message, divImg);
    coverCell.appendChild(divImg);

    const divRating = document.createElement("div");
    addRatingToElement(message, divRating);
    coverCell.appendChild(divRating);

    addDescriptionToRow(row, message);
});

function addCoverToElement(
    message: ReleaseTableImageFetchMessage,
    target: Element,
) {
    const img = document.createElement("img");
    img.src = message.data.image ?? "";
    img.alt = message.data.entry.title.name;
    img.width = 200;
    img.height = 200;
    img.style.paddingTop = "10px";
    img.style.display = "block";
    img.style.marginLeft = "auto";
    img.style.marginRight = "auto";
    img.style.borderRadius = "7.5%";
    target.setAttribute("data-url", message.data.image ?? "");

    const a = document.createElement("a");
    a.href = message.data.entry.title.url;
    a.appendChild(img);

    target.appendChild(a);
}

function addRatingToElement(
    message: ReleaseTableImageFetchMessage,
    target: Element,
) {
    const h6 = document.createElement("h6");
    h6.style.textAlign = "center";

    let color = "green";
    if (message.data.rating.rating < 4) {
        color = "darkblue";
    }
    if (message.data.rating.rating < 3) {
        color = "orange";
    }
    if (message.data.rating.rating < 2) {
        color = "red";
    }

    h6.innerHTML = `<b style="color: ${color};">${message.data.rating.rating}</b> / 5.0, <b>${message.data.rating.votes}</b> votes`;

    target.classList.add("ex:novel-rating");
    target.setAttribute("data-rating", message.data.rating.rating.toString());
    target.setAttribute("data-votes", message.data.rating.votes.toString());
    target.appendChild(h6);
}

function addDescriptionToRow(
    row: Element,
    message: ReleaseTableImageFetchMessage,
) {
    const titleCell = row.children[1];

    const descriptionContainer = document.createElement("div");
    descriptionContainer.style.marginTop = "8px";
    descriptionContainer.style.marginBottom = "8px";
    descriptionContainer.style.paddingRight = "8px";

    const hideThreshold = 2;
    let i = 0;
    for (const desc of message.data.description) {
        const p = document.createElement("p");
        p.textContent = desc;
        p.style.fontSize = "small";
        p.style.marginTop = "8";
        p.style.marginBottom = "8";
        p.style.paddingTop = "0";
        p.style.paddingBottom = "0";
        p.style.textAlign = "justify";
        p.style.color = "#999";

        if (i >= hideThreshold) {
            p.style.display = "none";
        }

        descriptionContainer.appendChild(p);
        i++;
    }
    titleCell.appendChild(descriptionContainer);

    if (i > hideThreshold) {
        const showMore = document.createElement("a");
        showMore.href = "#";
        showMore.textContent = "Show More";
        showMore.style.fontSize = "small";
        showMore.style.marginTop = "8px";
        showMore.style.paddingBottom = "8px";
        showMore.style.textAlign = "center";
        showMore.style.color = "blue";
        showMore.style.textDecorationLine = "underline";

        let show = false;

        showMore.addEventListener("click", (e) => {
            e.preventDefault();
            if (show) {
                let j = 0;
                for (const p of descriptionContainer.children) {
                    if (j >= hideThreshold) {
                        (p as HTMLElement).style.display = "none";
                    }
                    j++;
                }
                showMore.textContent = "Show More";
            } else {
                for (const p of descriptionContainer.children) {
                    (p as HTMLElement).style.display = "block";
                }
                showMore.textContent = "Show Less";
            }
            show = !show;
        });

        titleCell.appendChild(showMore);
    }
}

function augmentTable(table: HTMLTableElement) {
    const headerRow = table.querySelector("thead>tr")!;
    const headers = headerRow.querySelectorAll("tr>th");
    if (headers.length > 2) {
        return;
    }

    const header = document.createElement("th");
    header.textContent = "Cover";
    header.className = "header";

    headerRow.prepend(header);

    const rows = table.querySelectorAll("tbody>tr");
    for (const row of rows) {
        const titleCell = row.children[0] as HTMLTableCellElement;
        titleCell.width = "60%";
        const titleChildren = titleCell.children;
        const titleDiv = document.createElement("div");
        titleDiv.replaceChildren(...titleChildren);
        titleCell.replaceChildren(titleDiv);
        (titleDiv.children[0] as HTMLElement).style.marginRight = "4px";

        (row.children[1] as HTMLTableCellElement).width = "20%";

        const coverCell = document.createElement("td");
        row.prepend(coverCell);
    }
}
