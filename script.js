const defaultColor = "#000000";
const defaultEraseColor = "#ffffff";

window.addEventListener('load', onLoad);

function onLoad() {
    drawContainer(16);
    updateSketchElementsColor(defaultColor);
    setColorWheel();
    setSlider();
    setActionButtons();
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

function setActionButtons() {
    let clearButton = document.querySelector("#clearButton");
    let eraseButton = document.querySelector("#eraseButton");
    let printButton = document.querySelector("#printerButton");
    let randomButton = document.querySelector("#randomButton");
    let githubButton = document.querySelector("#githubButton");

    clearButton.addEventListener("click", resetSketchElements);
    eraseButton.addEventListener("click", toggleErase);
    printButton.addEventListener("click", printSketch);
    randomButton.addEventListener("click", toggleRandom);
    githubButton.addEventListener("click", navigateToGithub);
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
    let randomButton = document.querySelector("#randomButton");
    let colorWheel = document.querySelector("#colorWheel");
    let eraseButton = document.querySelector("#eraseButton");    
    let isMouseClicked = ev.buttons === 1 || ev.type === "mousedown";
    let isRandomEnabled = randomButton.classList.contains("toggle-enabled");
    let isEraseEnabled = eraseButton.classList.contains("toggle-enabled");  
    let color = !isRandomEnabled || isEraseEnabled ? colorWheel.value : getRandomColor();
    let isSketchElementAlreadyThisColor = ev.target.style.backgroundColor === color;
    
    if (!isMouseClicked || isSketchElementAlreadyThisColor) {
        return;
    }    
    
    if (isRandomEnabled) {
        colorWheel.value = color;
        colorWheel.parentElement.style.color = color;
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
    let isEraseEnabled = eraseButton.classList.contains("toggle-enabled");

    eraseButton.classList.toggle("toggle-enabled");

    if (!isEraseEnabled) {        
        colorWheel.setAttribute("data-previousColor", colorWheel.value);
        updateSketchElementsColor(defaultEraseColor);        
        return;
    }
    
    let color = colorWheel.dataset.previouscolor || defaultColor;
    colorWheel.setAttribute("data-previousColor", "");
    updateSketchElementsColor(color);    
}

function printSketch() {
    let printWindow = window.open('', 'PRINT', 'height=600,width=800');
    let sketchAreaElement = document.getElementById("sketchArea");
    let repeatCount = sketchAreaElement.style.getPropertyValue("--repeat-count");

    printWindow.document.write(`<html><head><title>${document.title}</title>`);
    printWindow.document.write(
        `<style>
            :root {
                --repeat-count: ${repeatCount};
                --track-size-height: calc(45rem / ${repeatCount});
                --track-size-width: calc(45rem / ${repeatCount});
                --font-color: #6c6c6c;
            }
            h1 {
                text-align: center;
            }
            #sketchArea {
                display: grid;
                background-color: white;
                box-shadow: 0 1px 1rem #a0a0a0;
                grid-template-columns: repeat(var(--repeat-count), var(--track-size-height));
                grid-template-rows: repeat(var(--repeat-count), var(--track-size-width));
                height: 45rem;
                width: 45rem;
                min-height: 350px;
                min-width: 350px;
            }
            .sketch-element {
                width: var(--track-size-width);
                height: var(--track-size-height);
            }           
        </style></head><body>`);
    printWindow.document.write(`<h1>${document.title}</h1>`);
    printWindow.document.write(`<div id="sketchArea">${sketchAreaElement.innerHTML}</div>`);
    printWindow.document.write('</body></html>');

    printWindow.print();
    printWindow.close();
}

function toggleRandom() {
    let randomButton = document.querySelector("#randomButton");
    randomButton.classList.toggle("toggle-enabled");
}

function getRandomColor() {
    return `#${Math.floor(Math.random()*16777215).toString(16)}`;
}

function navigateToGithub() {
    window.location.href = "https://github.com/stchao/Etch-a-Sketch";
}