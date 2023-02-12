window.addEventListener('load', onLoad);

function onLoad() {
    drawContainer(16, "default");
}

function drawContainer(sideLength, color) {
    let container = getAndSetContainer(sideLength);    
    let totalSketchElements = sideLength * sideLength;

    for (let i = 0; i < totalSketchElements; i++) {
        let tempSketchElement = createSketchElement(color);
        container.appendChild(tempSketchElement);
    }
};

function getAndSetContainer(sideLength = 16) {
    let container = document.querySelector("#container"); 
    container.style.setProperty("--repeat-count", sideLength);
    container.style.setProperty("--track-size-height", `calc(50rem / ${sideLength})`);
    container.style.setProperty("--track-size-width", `calc(50rem / ${sideLength})`);
    container.addEventListener("mousedown", (ev) => ev.preventDefault());
    return container;
}

function createSketchElement(color = "default") {
    let tempElement = document.createElement("div");
    tempElement.classList.add("sketch-element");
    tempElement.addEventListener("mouseover", (ev) => etchBackground(ev, color));
    tempElement.addEventListener("mousedown", (ev) => etchBackground(ev, color));
    return tempElement;
}

function etchBackground(ev, color) {
    let isMouseClicked = ev.buttons === 1 || ev.type === "mousedown";    
    let isSketchElementAlreadyToggled = ev.target.classList.contains(color);
    if (!isMouseClicked || isSketchElementAlreadyToggled) {
        return;
    }
    
    ev.target.classList.add(color);
    this.removeEventListener("mousedown", (ev) => etchBackground(ev, color));
}