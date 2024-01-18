export function createOptionGroup() {
    const div = document.createElement("div");
    const grid = createGridContainer();
    div.appendChild(grid);
    return [div, grid] as const;
}

function createGridContainer() {
    const grid = document.createElement("div");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "1fr 1fr";
    grid.style.gap = "1rem";
    return grid;
}
