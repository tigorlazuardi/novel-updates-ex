import { Config } from "../../../config";
import store from "../../../store";

type RenderFn = (div: HTMLDivElement) => void;

export function renderOption(config: Config, render: RenderFn) {
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

    const tableOptions = createTableOptionContainer(config, () => {
        store.config().then((config) => {
            pre.innerText = JSON.stringify(config, null, 4);
            render(divOption);
        });
    });

    divOption.appendChild(tableOptions);

    render(divOption);
}

function createGridContainer() {
    const grid = document.createElement("div");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "1fr 1fr";
    grid.style.gap = "1rem";
    return grid;
}

function createTableOptionContainer(config: Config, signal: RenderSignal) {
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

type RenderSignal = () => void;

function createParagraphThresholdInput(config: Config, signal: RenderSignal) {
    const label = document.createElement("label");
    label.textContent = "Paragraph Threshold";
    label.setAttribute("for", "ex-paragraph-threshold");

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
