import { Config } from "../../../../config";
import store from "../../../../store";
import { type RenderSignal } from "./signal";
import { createTooltip } from "./tooltip";

export function createParagraphThresholdInput(
    config: Config,
    signal: RenderSignal,
) {
    const label = document.createElement("label");
    label.textContent = "Description Paragraph Threshold";
    label.setAttribute("for", "ex-paragraph-threshold");
    label.style.display = "flex";
    label.style.alignItems = "center";
    label.style.flexFlow = "row wrap";

    const infoIcon = document.createElement("i");
    infoIcon.classList.add("fa", "fa-info-circle");
    infoIcon.style.marginLeft = "0.5rem";
    label.appendChild(infoIcon);

    const tooltip = createTooltip(
        `The number of description paragraphs to show before the "Show More" button appears.`,
    );
    tooltip.style.display = "none";
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
            .then(() => signal());
    });
    return [label, input] as const;
}
