import { Config } from "../../../../../config";
import store from "../../../../../store";
import { ConfigChangedCallback } from "../callback";
import { createLabel } from "../create_label";

export function createParagraphThresholdInput(
    config: Config,
    signal: ConfigChangedCallback,
) {
    const label = createLabel({
        name: "Description Paragraph Threshold",
        for: "ex-paragraph-threshold",
        tooltip: `The number of description paragraphs to show before the "Show More" button appears.`,
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
