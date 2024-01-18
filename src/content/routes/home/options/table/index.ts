import { Config } from "../../../../../config";
import { createOptionGroup } from "../create_option_group";
import { RenderSignal } from "../signal";
import { createExpandTableInputOption } from "./expand_table_width";
import { createParagraphThresholdInput } from "./paragraph_threshold_option";

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
