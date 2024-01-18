import { Config } from "../../../../../config";
import store from "../../../../../store";
import { createTooltip } from "../tooltip";
import { ConfigChangedCallback } from "../callback";

export function createParagraphThresholdInput(
    config: Config,
    signal: ConfigChangedCallback,
) {
    const label = document.createElement("label");
    label.setAttribute("for", "ex-paragraph-threshold");
    label.style.display = "flex";
    label.style.alignItems = "center";
    label.style.justifyContent = "start";
    label.style.flexWrap = "wrap";
    label.style.gap = "0.5rem";
    label.textContent = "Description Paragraph Threshold";

    const infoIcon = document.createElement("i");
    infoIcon.classList.add("fa", "fa-info-circle");
    label.appendChild(infoIcon);

    const tooltip = createTooltip(
        `The number of description paragraphs to show before the "Show More" button appears.`,
    );
    tooltip.style.display = "none";
    tooltip.style.flexBasis = "100%";
    label.appendChild(tooltip);

    let show = false;
    label.addEventListener("click", () => {
        if (show) {
            tooltip.style.display = "none";
        } else {
            tooltip.style.display = "block";
        }
        show = !show;
    });

    const input = document.createElement("input");
    input.type = "number";
    input.name = "ex-paragraph-threshold";
    input.value = config.home.description.paragraph_threshold.toString();
    input.addEventListener("change", () => {
        let value = parseInt(input.value);
        if (isNaN(value)) {
            return;
        }
        if (value < 0) {
            input.value = "0";
            value = 0;
        }
        store
            .updateConfig({
                home: {
                    description: {
                        paragraph_threshold: value,
                    },
                },
            })
            .then((cfg) => signal(cfg));
    });
    return [label, input] as const;
}
