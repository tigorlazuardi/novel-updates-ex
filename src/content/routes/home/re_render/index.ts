import { Config } from "../../../../config";
import { reRenderDescriptions } from "./description";
import { reRenderTableWidth } from "./table_width";

export function reRenderTable(config: Config) {
    reRenderDescriptions(config);
    reRenderTableWidth(config);
}
