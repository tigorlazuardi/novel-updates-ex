import { Config } from "../../../../config";
import store from "../../../../store";
import { createExpandTableInputOption } from "./expand_table_width";
import { createParagraphThresholdInput } from "./paragraph_threshold_option";
import { RenderSignal } from "./signal";

export type ReRenderFn = (config: Config, div: HTMLDivElement) => void;

/**
 * renderOption renders the option container.
 *
 * the render function will be called whenever the option container values
 * have changed.
 */
export async function renderOption(render: ReRenderFn) {
    const config = await store.config();
    const divOption = document.createElement("div");
    divOption.id = "ex--option";
    divOption.style.border = "1px solid #ccc";
    divOption.style.padding = "1rem";
    divOption.style.backgroundColor = "#f9f9f9";
    divOption.style.borderRadius = "5px";
    divOption.style.marginBottom = "1rem";

    const pre = document.createElement("pre");
    pre.classList.add("ex--option-pre");

    const configString = JSON.stringify(config, null, 4);
    pre.innerText = configString;

    divOption.appendChild(pre);

    const tableOptions = createTableOption(config, () => {
        store.config().then((config) => {
            pre.innerText = JSON.stringify(config, null, 4);
            render(config, divOption);
        });
    });

    divOption.appendChild(tableOptions);
    render(config, divOption);
}

export function createTableOption(config: Config, signal: RenderSignal) {
    const div = document.createElement("div");
    div.id = "ex--table-option";
    const [tableOptionGroup, tableOptionGrid] = createOptionGroup();
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

    const [expandTableLabel, expandTableInput] = createExpandTableInputOption(
        config,
        signal,
    );

    tableOptionGrid.appendChild(expandTableLabel);
    tableOptionGrid.appendChild(expandTableInput);

    return div;
}

function createOptionGroup() {
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
