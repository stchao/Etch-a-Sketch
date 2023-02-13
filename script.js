const defaultColor = "#000000";
const defaultEraseColor = "#ffffff";

window.addEventListener('load', onLoad);

function onLoad() {
    drawContainer(16);
    updateSketchElementsColor(defaultColor);
    setColorWheel();
    setSlider();
    setButtons();
}

function drawContainer(sideLength) {
    let container = getAndSetContainer(sideLength);
    let currentSketchElements = container.childElementCount;    
    let sketchElementsToCreate = (sideLength * sideLength) - currentSketchElements;

    for (let i = 0; i < sketchElementsToCreate; i++) {
        let tempSketchElement = createSketchElement();        
        tempSketchElement.addEventListener("mouseover", etchBackground);
        tempSketchElement.addEventListener("mousedown", etchBackground);
        container.appendChild(tempSketchElement);
    }
};

function setColorWheel() {
    let colorWheel = document.querySelector("#colorWheel");
    colorWheel.addEventListener("click", (e) => {
        Coloris.setInstance('#colorWheel', {
            theme: 'pill',
            formatToggle: true,
            closeButton: true,
            clearButton: true,
            swatches: [
                '#067bc2',
                '#84bcda',
                '#80e377',
                '#ecc30b',
                '#f37748',
                '#d56062'
            ],
            onChange: updateSketchElementsColor
        });
    });
}

function updateSketchElementsColor(color) {
    let colorWheel = document.querySelector("#colorWheel");
    colorWheel.value = color;
}

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

function createSketchElement() {
    let tempElement = document.createElement("div");
    tempElement.classList.add("sketch-element");
    return tempElement;
}

function redrawContainer(sideLength) {
    removeSketchElements(sideLength);
    resetSketchElements();
    drawContainer(sideLength);
}

function etchBackground(ev) {
    let isMouseClicked = ev.buttons === 1 || ev.type === "mousedown";
    let colorWheel = document.querySelector("#colorWheel") ;
    let color = colorWheel.value;
    let isSketchElementAlreadyThisColor = ev.target.style.backgroundColor === color;
    
    if (!isMouseClicked || isSketchElementAlreadyThisColor) {
        return;
    }    
    
    ev.target.style.backgroundColor = color;
}

function resetSketchElements() {
    let container = document.querySelector("#sketchArea");
    let sketchElements = [...container.querySelectorAll(".sketch-element")];
    sketchElements.forEach((sketchElement) => sketchElement.style.backgroundColor = defaultEraseColor);
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

function toggleErase() {
    let eraseButton = document.querySelector("#eraseButton");
    let colorWheel = document.querySelector("#colorWheel");

    if (eraseButton.innerText === "E") {
        eraseButton.innerText = "D";
        colorWheel.setAttribute("data-previousColor", colorWheel.value);
        updateSketchElementsColor(defaultEraseColor);        
        return;
    }
    
    eraseButton.innerText = "E";
    let color = colorWheel.dataset.previouscolor || defaultColor;
    updateSketchElementsColor(color);
    colorWheel.setAttribute("data-previousColor", "");
}