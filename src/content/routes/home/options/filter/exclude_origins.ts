import { Config } from "../../../../../config";
import store from "../../../../../store";
import { Origin } from "../../extract_tables";
import { ConfigChangedCallback } from "../callback";
import { createLabel } from "../create_label";

export function createExcludeOriginsOption(
    config: Config,
    signal: ConfigChangedCallback,
) {
    const label = createLabel({
        name: "Exclude Origins",
        for: "ex-exclude-origins",
        tooltip: `Hide selected origins from showing in the release table`,
    });

    const group = createCheckboxGroup(config, signal);

    return [label, group] as const;
}

function createCheckboxGroup(config: Config, signal: ConfigChangedCallback) {
    const div = document.createElement("div");
    div.id = "ex--exclude-origins-checkbox-group";

    div.style.display = "flex";
    div.style.justifyContent = "space-between";

    const checkboxKR = createCheckbox(config, "[KR]", signal);
    div.appendChild(checkboxKR);

    const checkboxJP = createCheckbox(config, "[JP]", signal);
    div.appendChild(checkboxJP);

    const checkboxCN = createCheckbox(config, "[CN]", signal);
    div.appendChild(checkboxCN);

    const checkboxOther = createCheckbox(config, "[OTHER]", signal);
    div.appendChild(checkboxOther);
    return div;
}

function createCheckbox(
    config: Config,
    label: Origin,
    signal: ConfigChangedCallback,
) {
    const div = document.createElement("div");
    div.style.display = "flex";
    div.style.placeContent = "center";

    const inputName = "ex-exclude-origin-" + label.toLowerCase();
    const inputLabel = document.createElement("label");
    inputLabel.setAttribute("for", inputName);
    inputLabel.textContent = label;
    inputLabel.style.margin = "0";
    inputLabel.style.position = "static";
    inputLabel.style.display = "inline-block";
    inputLabel.style.padding = "0px 0px 0.25rem 0.5rem";
    inputLabel.style.fontWeight = "bold";

    switch (label) {
        case "[KR]":
            inputLabel.classList.add("orgkr");
            break;
        case "[JP]":
            inputLabel.classList.add("orgjp");
            break;
        case "[CN]":
            inputLabel.classList.add("orgcn");
            break;
    }

    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = inputName;
    input.checked = config.home.filter.exclude_origins.includes(label);
    input.addEventListener("change", (event) => {
        store
            .config()
            .then((cfg) => {
                const el = event.target as HTMLInputElement;
                const old = cfg.home.filter.exclude_origins;
                if (el.checked && !old.includes(label)) {
                    old.push(label);
                } else {
                    old.splice(old.indexOf(label), 1);
                }
                return store.updateConfig({
                    home: {
                        filter: {
                            exclude_origins: old,
                        },
                    },
                });
            })
            .then((cfg) => {
                config = cfg;
                signal(cfg);
            });
    });
    input.style.display = "block";
    input.style.position = "static";

    inputLabel.addEventListener("click", () => input.click());

    div.appendChild(input);
    div.appendChild(inputLabel);

    return div;
}
