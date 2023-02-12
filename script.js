window.addEventListener('load', onLoad);

function onLoad() {
    drawContainer(16, "default");
    setSlider();
    setButtons();
}

function drawContainer(sideLength, color) {
    let container = getAndSetContainer(sideLength);    
    let totalSketchElements = sideLength * sideLength;

    for (let i = 0; i < totalSketchElements; i++) {
        let tempSketchElement = createSketchElement(color);
        container.appendChild(tempSketchElement);
    }
};

function setSlider() {
    let slider = document.querySelector("#slider");
    let sliderNumber = document.querySelector("#sliderNumber");

    slider.addEventListener("input", () => sliderNumber.value = slider.value);
    slider.addEventListener("mouseup", () => redrawContainer(slider.value));
    sliderNumber.addEventListener("input", () => slider.value = sliderNumber.value)
}

function setButtons() {
    let clearButton = document.querySelector("#clearButton");
    let eraseButton = document.querySelector("#eraseButton");

    clearButton.addEventListener("click", resetSketchElements);
    eraseButton.addEventListener("click", toggleErase);
}

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

function redrawContainer(sideLength) {    
    //removeSketchElements();
    //drawContainer(sideLength);
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

function resetSketchElements() {
    let container = document.querySelector("#container");
    let sketchElements = [...container.querySelectorAll(".sketch-element")];
    sketchElements.forEach((sketchElement) => sketchElement.className = "sketch-element");
}

function removeSketchElements() {
    let container = document.querySelector("#container");
    let sketchElements = [...container.querySelectorAll(".sketch-element")];
    sketchElements.forEach((sketchElement) => container.removeChild(sketchElement));
}

function updateSketchElementsColor(color) {
    let container = document.querySelector("#container");
    let sketchElements = [...container.querySelectorAll(".sketch-element")];
    sketchElements.forEach((sketchElement) => {
        sketchElement.removeEventListener("mouseover", (ev) => etchBackground(ev, color));
        sketchElement.addEventListener("mouseover", (ev) => etchBackground(ev, color));
        sketchElement.removeEventListener("mousedown", (ev) => etchBackground(ev, color));
        sketchElement.addEventListener("mousedown", (ev) => etchBackground(ev, color));
    });
}

function toggleErase() {
    let eraseButton = document.querySelector("#eraseButton");

    if (eraseButton.innerText === "Erase") {
        eraseButton.innerText = "Draw";
        updateSketchElementsColor("default-erase");        
        return;
    }

    eraseButton.innerText = "Erase";
    updateSketchElementsColor("default");   
}