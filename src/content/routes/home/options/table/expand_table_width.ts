import { Config } from "../../../../../config";
import store from "../../../../../store";
import { type ConfigChangedCallback } from "../callback";
import { createTooltip } from "../tooltip";

export function createExpandTableInputOption(
    config: Config,
    signal: ConfigChangedCallback,
) {
    const label = createLabel();

    const inputGroup = document.createElement("div");
    inputGroup.style.display = "flex";
    inputGroup.style.alignItems = "center";
    inputGroup.style.gap = "0.5rem";

    const checkbox = createCheckbox(config, signal);
    inputGroup.appendChild(checkbox);

    const widthInput = createWidthInput(config, signal);
    inputGroup.appendChild(widthInput);

    return [label, inputGroup] as const;
}

function createLabel() {
    const label = document.createElement("label");
    label.setAttribute("for", "ex-expand-table-width");
    label.style.display = "flex";
    label.style.alignItems = "center";
    label.style.flexFlow = "row wrap";
    label.style.gap = "0.5rem";
    label.textContent = "Expand Table Width";

    const infoIcon = document.createElement("i");
    infoIcon.classList.add("fa", "fa-info-circle");

    label.textContent = "Expand Table Width";

    label.appendChild(infoIcon);

    const tooltip = createTooltip(
        [
            "Whether to expand the table to the possible maximum width or not.",
            "Can use any valid 'CSS' unit value for the maximum width. e.g 1600px, 100vw, 100%. Using 'vw' value is recommended since it uses the browser's window width size as base. If you use a wide monitor, 70vw is a good starting value (which means 70% of browser window width).",
            "Default value is '100vw' which tries to take the whole browser window width.",
        ].join("<br>"),
    );
    tooltip.style.display = "none";
    tooltip.style.flexBasis = "100%";

    let show = false;
    label.addEventListener("click", () => {
        if (show) {
            tooltip.style.display = "none";
        } else {
            tooltip.style.display = "block";
        }
        show = !show;
    });

    label.appendChild(tooltip);

    return label;
}

function createCheckbox(config: Config, signal: ConfigChangedCallback) {
    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = "ex-expand-table-width";
    input.checked = config.home.expand_table_width.enable;
    input.addEventListener("change", () => {
        document
            .querySelector('input[name="ex-expand-table-width-value"]')
            ?.toggleAttribute("disabled");
        store
            .updateConfig({
                home: {
                    expand_table_width: {
                        enable: input.checked,
                    },
                },
            })
            .then((cfg) => signal(cfg));
    });
    input.style.display = "block";
    input.style.position = "static";
    return input;
}

function createWidthInput(config: Config, signal: ConfigChangedCallback) {
    const input = document.createElement("input");
    input.type = "text";
    input.name = "ex-expand-table-width-value";
    input.placeholder = "Width Value";
    input.value = config.home.expand_table_width.value ?? "";
    input.disabled = !config.home.expand_table_width.enable;
    input.addEventListener("change", (event) => {
        const el = event.target as HTMLInputElement;
        const value = el.value || "100vw";
        store
            .updateConfig({
                home: {
                    expand_table_width: {
                        value,
                    },
                },
            })
            .then((cfg) => signal(cfg));
    });

    return input;
}
