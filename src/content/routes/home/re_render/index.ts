import { Config } from "../../../../config";
import { reRenderDescriptions } from "./description";

export function reRenderTable(config: Config) {
    reRenderDescriptions(config);
}
