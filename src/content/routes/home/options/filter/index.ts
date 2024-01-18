import { Config } from "../../../../../config";
import { ConfigChangedCallback } from "../callback";
import { createOptionGroup } from "../create_option_group";

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
    return filterOptionGroup;
}
