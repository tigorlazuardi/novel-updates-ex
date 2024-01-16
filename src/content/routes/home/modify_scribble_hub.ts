import store from "../../../store";
import { closest } from "../../utils";

export async function modifyScribbleHub(root: Element) {
    const scribbleHubSpan =
        root.querySelector<HTMLSpanElement>("span.link_scrib");
    if (!scribbleHubSpan) {
        return;
    }
    scribbleHubSpan.removeAttribute("style");

    const config = await store.config();
    if (config.home.scribble_hub.hide) {
        scribbleHubSpan.style.display = "none";
    }

    const tableName = closest(scribbleHubSpan, "b");
    if (tableName) {
        const clone = tableName.cloneNode(true) as HTMLElement;

        const div = document.createElement("div");
        div.style.display = "flex";
        div.style.justifyContent = "space-between";

        div.appendChild(clone);

        const scribbleClone = scribbleHubSpan.cloneNode(
            true,
        ) as HTMLSpanElement;
        div.appendChild(scribbleClone);

        scribbleHubSpan.parentElement!.replaceChild(div, tableName);
        scribbleHubSpan.remove();
    }
}
