import { Config } from "../../../../../config";
import store from "../../../../../store";
import { type ConfigChangedCallback } from "../callback";
import { createLabel } from "../create_label";

export function createExpandTableInputOption(
    config: Config,
    signal: ConfigChangedCallback,
) {
    const label = createLabel({
        name: "Expand Table Width",
        for: "ex-expand-table-width",
        tooltip: [
            "Whether to expand the table to the possible maximum width or not.",
            "Can use any valid 'CSS' unit value for the maximum width. e.g 1600px, 100vw, 100%. Using 'vw' value is recommended since it uses the browser's window width size as base. If you use a wide monitor, 70vw is a good starting value (which means 70% of browser window width).",
            "Default value is '100vw' which tries to take the whole browser window width.",
        ].join("<br>"),
    });

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
