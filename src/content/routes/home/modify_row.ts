import store from "../../../store";
import { ReleaseTableDetail } from "./extract_tables";

export function modifyRowError(row: HTMLTableRowElement, error: string) {
    const coverCell = row.children[0] as HTMLTableCellElement;
    coverCell.style.display = "flex";
    coverCell.style.flexDirection = "column";
    coverCell.style.alignContent = "center";

    const p = document.createElement("p");
    p.textContent = error;
    p.style.textAlign = "center";
    p.style.color = "red";

    coverCell.appendChild(p);

    row.prepend(coverCell);
}

export function modifyRow(row: HTMLTableRowElement, data: ReleaseTableDetail) {
    const coverCell = row.children[0] as HTMLTableCellElement;
    coverCell.style.display = "flex";
    coverCell.style.flexDirection = "column";
    coverCell.style.alignContent = "center";

    const divImg = document.createElement("div");
    divImg.classList.add("ex--image-cover");
    addCoverToElement(data, divImg);
    addCoverURLAttributeToElement(data, row);
    coverCell.appendChild(divImg);

    addRatingAttributeToElement(data, row);
    const divOriginRating = document.createElement("div");
    divOriginRating.style.display = "flex";
    divOriginRating.style.placeContent = "center";
    divOriginRating.style.flexWrap = "wrap";
    divOriginRating.style.gap = "0.75rem";
    addOriginToElement(data, divOriginRating);
    addOriginAttributeToElement(data, row);

    addRatingToElement(data, divOriginRating);

    coverCell.appendChild(divOriginRating);
    row.prepend(coverCell);

    const titleCell = row.children[1] as HTMLTableCellElement;
    addDescriptionToElement(data, titleCell);
}

function addCoverToElement(data: ReleaseTableDetail, target: Element) {
    const img = document.createElement("img");
    img.classList.add("ex--cover-image");
    img.src = data.detail.image ?? "";
    img.alt = data.entry.title.name;
    img.style.padding = "0.5rem";
    img.style.display = "block";
    img.style.marginLeft = "auto";
    img.style.marginRight = "auto";
    img.style.borderRadius = "7.5%";
    img.style.maxWidth = "20rem";
    img.style.width = "15vw";

    const a = document.createElement("a");
    a.href = data.entry.title.url;
    a.appendChild(img);

    target.appendChild(a);
}

function addCoverURLAttributeToElement(
    data: ReleaseTableDetail,
    target: Element,
) {
    target.setAttribute("data-image-url", data.detail.image ?? "");
}

function addRatingToElement(data: ReleaseTableDetail, target: Element) {
    const p = document.createElement("p");
    p.style.textAlign = "center";
    p.style.fontSize = "1.10rem";

    let color = "green";
    const rating = data.detail.rating.rating;
    if (rating < 4) {
        color = "darkblue";
    }
    if (rating < 3) {
        color = "orange";
    }
    if (rating < 2) {
        color = "red";
    }

    p.innerHTML = `<b style="color: ${color};">${rating}</b> / 5.0, <b>${data.detail.rating.votes}</b> votes`;

    target.classList.add("ex--novel-rating");
    target.appendChild(p);
}

function addRatingAttributeToElement(
    data: ReleaseTableDetail,
    target: Element,
) {
    target.setAttribute("data-rating", data.detail.rating.rating.toString());
    target.setAttribute("data-votes", data.detail.rating.votes.toString());
}

function addOriginToElement(data: ReleaseTableDetail, target: Element) {
    const span = document.createElement("span");
    switch (data.detail.origin) {
        case "[JP]":
            span.classList.add("orgjp");
            break;
        case "[KR]":
            span.classList.add("orgkr");
            break;
        case "[CN]":
            span.classList.add("orgcn");
            break;
    }
    span.textContent = data.detail.origin;
    span.style.textAlign = "center";
    span.style.fontWeight = "bold";
    target.appendChild(span);
}

function addOriginAttributeToElement(
    data: ReleaseTableDetail,
    target: Element,
) {
    target.setAttribute("data-origin", data.detail.origin);
}

function addDescriptionToElement(data: ReleaseTableDetail, target: Element) {
    store.config().then((config) => {
        const descriptionContainer = document.createElement("div");
        descriptionContainer.classList.add("ex--description");
        descriptionContainer.style.marginTop = "1rem";
        descriptionContainer.style.marginBottom = "1rem";

        const hideThreshold = config.home.description.paragraph_threshold;
        let i = 0;
        for (const desc of data.detail.description) {
            const p = document.createElement("p");
            p.textContent = desc;
            p.style.fontSize = "small";
            p.style.marginTop = "1rem";
            p.style.marginBottom = "1rem";
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

        target.appendChild(descriptionContainer);

        if (i > hideThreshold) {
            const showButton = createShowButton(descriptionContainer);
            target.appendChild(showButton);
        }
    });
}

export function createShowButton(descriptionContainer: Element) {
    const showButton = document.createElement("a");
    showButton.classList.add("ex--show");
    showButton.href = "#";
    showButton.textContent = "Show More";
    showButton.style.fontSize = "small";
    showButton.style.marginTop = "1rem";
    showButton.style.paddingBottom = "2rem";
    showButton.style.textDecorationLine = "underline";

    let show = false;

    showButton.addEventListener("click", (e) => {
        e.preventDefault();
        store.config().then((config) => {
            const threshold = config.home.description.paragraph_threshold;
            if (show) {
                let j = 0;
                for (const p of descriptionContainer.children) {
                    if (j >= threshold) {
                        (p as HTMLElement).style.display = "none";
                    }
                    j++;
                }
                showButton.textContent = "Show More";
            } else {
                for (const p of descriptionContainer.children) {
                    (p as HTMLElement).style.display = "block";
                }
                showButton.textContent = "Show Less";
            }
            show = !show;
        });
    });

    return showButton;
}
