import { Config } from "../../../../config";
import { createShowButton } from "../modify_row";

export function reRenderDescriptions(config: Config) {
    const titleCells = document.querySelectorAll<HTMLTableCellElement>(
        'td[data-column-name="title"]',
    );
    const threshold = config.home.description.paragraph_threshold;

    for (const cell of titleCells) {
        const container = cell.querySelector<HTMLDivElement>(
            "div.ex--description",
        );
        if (!container) {
            continue;
        }
        const paragraphs =
            container.querySelectorAll<HTMLParagraphElement>("p");

        let showButton = cell.querySelector<HTMLAnchorElement>("a.ex--show");
        if (!showButton && paragraphs.length > threshold) {
            showButton = createShowButton(container);
            cell.appendChild(showButton);
        } else if (showButton && paragraphs.length <= threshold) {
            showButton.remove();
        }
        if (showButton?.textContent === "Show Less") {
            // Paragraphs are currently expanded for this container.
            // No need to hide any paragraphs.
            continue;
        }

        for (let i = 0; i < paragraphs.length; i++) {
            if (i < threshold) {
                paragraphs[i].style.display = "block";
            } else {
                paragraphs[i].style.display = "none";
            }
        }
    }
}
