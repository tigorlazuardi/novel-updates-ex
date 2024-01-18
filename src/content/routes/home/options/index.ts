import store from "../../../../store";
import { ConfigChangedCallback } from "./callback";
import { createTableOption } from "./table";

/**
 * renderOption renders the option container.
 *
 * the render function will be called whenever the option container values
 * have changed.
 */
export async function renderOption(cb: ConfigChangedCallback) {
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

    const tableOptions = createTableOption(config, (cfg) => {
        pre.innerText = JSON.stringify(cfg, null, 4);
        cb(cfg);
    });

    divOption.appendChild(tableOptions);
    cb(config);

    return divOption;
}
