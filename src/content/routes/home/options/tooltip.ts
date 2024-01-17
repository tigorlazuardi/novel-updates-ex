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
