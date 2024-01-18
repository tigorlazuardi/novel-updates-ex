export function createOptionGroup(id: string, name: string) {
    const div = document.createElement("div");
    div.id = id;
    div.style.marginBottom = "1rem";
    const header = document.createElement("b");
    header.textContent = name;
    const breakLine = document.createElement("hr");

    div.appendChild(header);
    div.appendChild(breakLine);

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
