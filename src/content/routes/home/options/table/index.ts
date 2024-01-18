import { Config } from "../../../../../config";
import { ConfigChangedCallback } from "../callback";
import { createOptionGroup } from "../create_option_group";
import { createExpandTableInputOption } from "./expand_table_width";
import { createParagraphThresholdInput } from "./paragraph_threshold_option";

export function createTableOption(
    config: Config,
    signal: ConfigChangedCallback,
) {
    const [tableOptionGroup, tableOptionGrid] = createOptionGroup(
        "ex--table-options",
        "Table Options",
    );

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

    return tableOptionGroup;
}
