document.addEventListener("DOMContentLoaded", () => {
    const dynamicImage = document.getElementById("dynamic-image");
    const imageSelector = document.getElementById("image-selector");
    const imageUpload = document.getElementById("image-upload");

    const shapeSelector = document.getElementById("shape-selector");
    const colorPicker = document.getElementById("color-picker");
    const sizeSlider = document.getElementById("size-slider");
    const sizeValue = document.getElementById("size-value");

    const highlighterToggle = document.getElementById("highlighter-toggle");
    const highlighterColor = document.getElementById("highlighter-color");
    const highlighterSize = document.getElementById("highlighter-size");
    const eraseModeToggle = document.getElementById("erase-mode-toggle");

    const compassArea = document.getElementById("compass-area");
    const canvas = document.createElement("canvas");
    canvas.width = compassArea.offsetWidth;
    canvas.height = compassArea.offsetHeight;
    compassArea.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    let drawing = false;

    // Update displayed image based on selection
    imageSelector.addEventListener("change", (event) => {
        dynamicImage.src = event.target.value;
    });

    // Upload custom image
    imageUpload.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            dynamicImage.src = URL.createObjectURL(file);
        }
    });

    // Update displayed shape size
    sizeSlider.addEventListener("input", () => {
        sizeValue.textContent = sizeSlider.value;
    });

    // Draw symbol on canvas at click location
    canvas.addEventListener("click", (e) => {
        if (!highlighterToggle.checked && !eraseModeToggle.checked) { // Only place symbol if not in highlighter or erase mode
            const symbol = shapeSelector.value;
            const color = colorPicker.value;
            const size = parseInt(sizeSlider.value);

            ctx.fillStyle = color;
            ctx.font = `${size}px sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            let symbolText;
            switch (symbol) {
                case "check":
                    symbolText = "✔";
                    break;
                case "circle":
                    symbolText = "∘";
                    break;
                case "plus":
                    symbolText = "+";
                    break;
                case "minus":
                    symbolText = "-";
                    break;
                default:
                    symbolText = "";
            }
            ctx.fillText(symbolText, e.offsetX, e.offsetY);
        }
    });

    // Start drawing or erasing on mouse down
    canvas.addEventListener("mousedown", (e) => {
        if (highlighterToggle.checked || eraseModeToggle.checked) {
            drawing = true;
            ctx.beginPath();
            ctx.moveTo(e.offsetX, e.offsetY);
        }
    });

    // Draw or erase on mouse move
    canvas.addEventListener("mousemove", (e) => {
        if (drawing) {
            ctx.lineTo(e.offsetX, e.offsetY);
            if (eraseModeToggle.checked) {
                ctx.globalCompositeOperation = 'destination-out'; // Eraser mode
                ctx.lineWidth = 20;
            } else {
                ctx.globalCompositeOperation = 'source-over'; // Highlighter mode
                ctx.strokeStyle = highlighterColor.value;
                ctx.lineWidth = 20;
                ctx.globalAlpha = parseFloat(highlighterSize.value);
            }
            ctx.lineCap = "round";
            ctx.stroke();
        }
    });

    // Stop drawing or erasing on mouse up or leaving canvas
    canvas.addEventListener("mouseup", () => {
        drawing = false;
        ctx.closePath();
    });
    canvas.addEventListener("mouseleave", () => {
        drawing = false;
        ctx.closePath();
    });

    // Clear all highlights and shapes on "Erase All" button click
    document.getElementById("erase-all-btn").addEventListener("click", () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    // Export as Image
    document.getElementById("export-img-btn").addEventListener("click", () => {
        html2canvas(compassArea).then((canvas) => {
            const link = document.createElement("a");
            link.download = "compass_image.png";
            link.href = canvas.toDataURL();
            link.click();
        });
    });

    // Export as PDF
    document.getElementById("export-pdf-btn").addEventListener("click", () => {
        html2canvas(compassArea).then((canvas) => {
            const pdf = new jspdf.jsPDF();
            pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0);
            pdf.save("compass_layout.pdf");
        });
    });
});
