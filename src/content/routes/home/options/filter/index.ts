import { Config } from "../../../../../config";
import { ConfigChangedCallback } from "../callback";
import { createOptionGroup } from "../create_option_group";
import { createExcludeOriginsOption } from "./exclude_origins";

export function createFilterOption(
    config: Config,
    signal: ConfigChangedCallback,
) {
    const div = document.createElement("div");
    div.id = "ex--filter-option";
    const [filterOptionGroup, filterOptionGrid] = createOptionGroup(
        "ex--filter-options",
        "Filter Options",
    );

    const [excludeOriginsLabel, excludeOriginsInput] =
        createExcludeOriginsOption(config, signal);

    filterOptionGrid.appendChild(excludeOriginsLabel);
    filterOptionGrid.appendChild(excludeOriginsInput);

    return filterOptionGroup;
}
