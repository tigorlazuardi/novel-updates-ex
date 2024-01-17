import store from "../../../../store";
import { reRenderDescriptions } from "./description";

export async function reRenderTable() {
    const config = await store.config();
    reRenderDescriptions(config);
}
