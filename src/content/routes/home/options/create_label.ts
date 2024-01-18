export type CreateLabelOptions = {
    name: string;
    for: string;
    tooltip: string;
};

export function createLabel(options: CreateLabelOptions) {
    const label = document.createElement("label");
    label.setAttribute("for", options.for);
    label.textContent = options.name;

    label.style.display = "flex";
    label.style.alignItems = "center";
    label.style.flexFlow = "row wrap";
    label.style.gap = "0.5rem";

    const infoIcon = document.createElement("i");
    infoIcon.classList.add("fa", "fa-info-circle");

    label.appendChild(infoIcon);

    const tooltip = createTooltip(options.tooltip);
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

export function createTooltip(tooltip: string) {
    const tooltipGroup = document.createElement("div");
    tooltipGroup.classList.add("ex--tooltip");
    tooltipGroup.setAttribute("data-tooltip", tooltip);

    const hr1 = document.createElement("hr");
    tooltipGroup.appendChild(hr1);

    const tip = document.createElement("span");
    tip.innerHTML = tooltip;
    tooltipGroup.appendChild(tip);
    tip.style.fontSize = "small";

    const hr2 = document.createElement("hr");
    tooltipGroup.appendChild(hr2);

    return tooltipGroup;
}
