import { Config } from "../../../config";
import { log } from "../../log";

export function renderOption(config: Config) {
    const br = document.querySelector("div.release>br");
    if (!br) {
        log("error", `renderOption: 'div.release>br' query selector not found`);
        return;
    }

    const divOption = document.createElement("div");
    divOption.id = "ex--option";
    divOption.style.border = "1px solid #ccc";
    divOption.style.padding = "1rem";

    const pre = document.createElement("pre");
    pre.classList.add("ex--option-pre");

    const configString = JSON.stringify(config, null, 4);
    pre.innerText = configString;

    divOption.appendChild(pre);
    br.after(divOption);
}
