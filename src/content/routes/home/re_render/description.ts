import { Config } from "../../../../config";

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
        const showButton = cell.querySelector<HTMLAnchorElement>("a.ex--show");
        if (!showButton) {
            // There is no paragraph hidden.
            continue;
        }
        if (showButton.textContent === "Show Less") {
            // Paragraphs are currently expanded for this container.
            // No need to hide any paragraphs.
            continue;
        }

        const paragraphs =
            container.querySelectorAll<HTMLParagraphElement>("p");

        for (let i = 0; i < paragraphs.length; i++) {
            if (i < threshold) {
                paragraphs[i].style.display = "block";
            } else {
                paragraphs[i].style.display = "none";
            }
        }
    }
}
