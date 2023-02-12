window.addEventListener('load', onLoad);

function onLoad() {
    drawContainer(16, "default");
    setSlider();
    setButtons();
}

function drawContainer(sideLength, color) {
    let container = getAndSetContainer(sideLength);
    let currentSketchElements = container.childElementCount;    
    let sketchElementsToCreate = (sideLength * sideLength) - currentSketchElements;

    for (let i = 0; i < sketchElementsToCreate; i++) {
        let tempSketchElement = createSketchElement(color);        
        tempSketchElement.addEventListener("mouseover", etchBackground);
        tempSketchElement.addEventListener("mousedown", etchBackground);
        container.appendChild(tempSketchElement);
    }
};

function setSlider() {
    let slider = document.querySelector("#slider");
    let sliderNumber = document.querySelector("#sliderNumber");

    slider.addEventListener("input", () => sliderNumber.value = slider.value);
    slider.addEventListener("mouseup", () => redrawContainer(slider.value));
    sliderNumber.addEventListener("input", () => slider.value = sliderNumber.value)
    sliderNumber.addEventListener("change", () => redrawContainer(sliderNumber.value))
}

function setButtons() {
    let clearButton = document.querySelector("#clearButton");
    let eraseButton = document.querySelector("#eraseButton");

    clearButton.addEventListener("click", resetSketchElements);
    eraseButton.addEventListener("click", toggleErase);
}

function getAndSetContainer(sideLength = 16) {
    let container = document.querySelector("#sketchArea"); 
    container.style.setProperty("--repeat-count", sideLength);
    container.style.setProperty("--track-size-height", `calc(50rem / ${sideLength})`);
    container.style.setProperty("--track-size-width", `calc(50rem / ${sideLength})`);
    container.addEventListener("mousedown", (ev) => ev.preventDefault());
    return container;
}

function createSketchElement(color = "default") {
    let tempElement = document.createElement("div");
    tempElement.classList.add("sketch-element");
    tempElement.setAttribute("data-color", color);
    return tempElement;
}

function redrawContainer(sideLength) {
    removeSketchElements(sideLength);
    resetSketchElements();
    drawContainer(sideLength);
}

function etchBackground(ev) {
    let isMouseClicked = ev.buttons === 1 || ev.type === "mousedown";
    let color = ev.target.dataset.color;
    let isSketchElementAlreadyToggled = ev.target.classList.contains(color);
    if (!isMouseClicked || isSketchElementAlreadyToggled) {
        return;
    }
    
    ev.target.className = `sketch-element ${color}`;
}

function resetSketchElements() {
    let container = document.querySelector("#sketchArea");
    let sketchElements = [...container.querySelectorAll(".sketch-element")];
    sketchElements.forEach((sketchElement) => sketchElement.className = "sketch-element");
}

function removeSketchElements(sideLength) {
    let container = document.querySelector("#sketchArea");
    let sketchElements = [...container.querySelectorAll(".sketch-element")];
    let numberOfSketchElementsToKeep = sideLength * sideLength;
    
    if (numberOfSketchElementsToKeep > sketchElements.length) {
        return;
    }

    for (let i = sketchElements.length - 1; i > numberOfSketchElementsToKeep - 1; i--) {
        container.removeChild(sketchElements[i]);
    }
}

function updateSketchElementsColor(color) {
    let container = document.querySelector("#sketchArea");
    let sketchElements = [...container.querySelectorAll(".sketch-element")];
    sketchElements.forEach((sketchElement) => {
        sketchElement.setAttribute("data-color", color);
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