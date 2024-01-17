import { Config } from "../../../../config";

export function reRenderTableWidth(config: Config) {
    const container = document.querySelector<HTMLDivElement>("div.l-submain-h");
    if (!container) {
        return;
    }
    if (config.home.expand_table_width.enable) {
        container.style.maxWidth = config.home.expand_table_width.value;
    } else {
        container.style.maxWidth = "";
    }
}
