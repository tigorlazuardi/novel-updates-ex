import { Config } from "../../../../config";
import store from "../../../../store";
import { createExpandTableInputOption } from "./table/expand_table_width";
import { createParagraphThresholdInput } from "./table/paragraph_threshold_option";
import { RenderSignal } from "./signal";
import { createTableOption } from "./table";

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
