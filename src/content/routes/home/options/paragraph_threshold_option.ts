import { Config } from "../../../../config";
import store from "../../../../store";
import { type RenderSignal } from "./signal";

export function createTableOptionContainer(
    config: Config,
    signal: RenderSignal,
) {
    const div = document.createElement("div");
    div.id = "ex--table-option";
    const [tableOptionGroup, tableOptionGrid] = createTableOptionGroup();
    const tableOptionHeader = document.createElement("b");
    tableOptionHeader.textContent = "Table Options";
    const tableOptionBreak = document.createElement("hr");

    div.appendChild(tableOptionHeader);
    div.appendChild(tableOptionBreak);
    div.appendChild(tableOptionGroup);

    const [paragraphThresholdLabel, paragraphThresholdInput] =
        createParagraphThresholdInput(config, signal);

    tableOptionGrid.appendChild(paragraphThresholdLabel);
    tableOptionGrid.appendChild(paragraphThresholdInput);

    return div;
}

function createTableOptionGroup() {
    const div = document.createElement("div");
    const grid = createGridContainer();
    div.appendChild(grid);
    return [div, grid] as const;
}

function createGridContainer() {
    const grid = document.createElement("div");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "1fr 1fr";
    grid.style.gap = "1rem";
    return grid;
}

function createParagraphThresholdInput(config: Config, signal: RenderSignal) {
    const label = document.createElement("label");
    label.textContent = "Description Paragraph Threshold";
    label.setAttribute("for", "ex-paragraph-threshold");

    const infoIcon = document.createElement("i");
    infoIcon.classList.add("fa", "fa-info-circle");
    infoIcon.style.marginLeft = "0.5rem";
    label.appendChild(infoIcon);

    const tooltipGroup = document.createElement("div");
    tooltipGroup.style.display = "none";

    const hr1 = document.createElement("hr");
    tooltipGroup.appendChild(hr1);

    const tip = document.createElement("span");
    tip.textContent = `The number of description paragraphs to show before the "Show More" button appears.`;
    tooltipGroup.appendChild(tip);

    const hr2 = document.createElement("hr");
    tooltipGroup.appendChild(hr2);

    label.appendChild(tooltipGroup);

    let show = false;
    label.addEventListener("click", () => {
        if (show) {
            tooltipGroup.style.display = "none";
        } else {
            tooltipGroup.style.display = "block";
        }
        show = !show;
    });

    const input = document.createElement("input");
    input.type = "number";
    input.name = "ex-paragraph-threshold";
    input.value = config.home.description.paragraph_threshold.toString();
    input.addEventListener("change", () => {
        let value = parseInt(input.value);
        if (isNaN(value)) {
            return;
        }
        if (value < 0) {
            input.value = "0";
            value = 0;
        }
        store
            .updateConfig({
                home: {
                    description: {
                        paragraph_threshold: value,
                    },
                },
            })
            .then(() => signal());
    });
    return [label, input] as const;
}
