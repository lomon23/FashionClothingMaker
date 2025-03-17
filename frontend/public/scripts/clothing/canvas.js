document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("designCanvas");
    const ctx = canvas.getContext("2d");
    const imageUpload = document.getElementById("imageUpload");
    const fixButton = document.getElementById("fixButton");
    const templateList = document.getElementById("templateList");
    const templateButtons = document.querySelectorAll(".templateButton");
    const clearCanvasButton = document.getElementById("clearCanvas"); // Get the clear canvas button

    if (!canvas || !ctx) {
        console.error("❌ Canvas або контекст не знайдено!");
        return;
    }

    console.log("✅ Canvas знайдено!");

    let templateImg = new Image();
    let images = []; // Array to store uploaded images
    let imgX = 50, imgY = 50, imgWidth = 200, imgHeight = 200;
    let dragging = false, offsetX = 0, offsetY = 0;
    let isFixed = false;
    let draggingImageIndex = null;
    let templateFixed = false; // Track if the template is fixed

    // Function to redraw the canvas
    function redrawCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(templateImg, 0, 0, canvas.width, canvas.height);

        // Draw each uploaded image
        images.forEach(image => {
            ctx.drawImage(image.img, image.x, image.y, image.width * image.scale, image.height * image.scale);
        });
    }

    // Function to handle image upload
    function handleImageUpload(event) {
        const files = Array.from(event.target.files); // Convert FileList to array

        // Clear existing images before adding new ones
        images = [];

        files.forEach(file => {
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    // Add image to the array
                    images.push({
                        img: img,
                        x: imgX,
                        y: imgY,
                        width: imgWidth,
                        height: imgHeight,
                        scale: 1 // Initial scale for the image
                    });
                    redrawCanvas();
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    // Function to handle mouse down event
    function handleMouseDown(e) {
        if (!isFixed) {
            for (let i = images.length - 1; i >= 0; i--) {
                const image = images[i];
                if (e.offsetX >= image.x && e.offsetX <= image.x + image.width * image.scale &&
                    e.offsetY >= image.y && e.offsetY <= image.y + image.height * image.scale) {
                    dragging = true;
                    offsetX = e.offsetX - image.x;
                    offsetY = e.offsetY - image.y;
                    draggingImageIndex = i; // Store the index of the dragging image
                    break; // Stop searching after finding the top-most image
                }
            }
        }
    }

    // Function to handle mouse move event
    function handleMouseMove(e) {
        if (!isFixed && dragging) {
            if (draggingImageIndex !== null) {
                images[draggingImageIndex].x = e.offsetX - offsetX;
                images[draggingImageIndex].y = e.offsetY - offsetY;
                redrawCanvas();
            }
        }
    }

    // Function to handle mouse up event
    function handleMouseUp() {
        dragging = false;
        draggingImageIndex = null; // Reset the dragging image index
    }

    // Function to handle fix button click
    function handleFixButtonClick() {
        isFixed = !isFixed; // Toggle the isFixed state
        if (isFixed) {
            fixButton.textContent = "Unfix"; // Change button text
        } else {
            fixButton.textContent = "Fix";
        }
    }

    // Function to handle template selection
    function handleTemplateSelection(button) {
        const templateImgSrc = button.getAttribute("data-img");
        templateImg.src = templateImgSrc;
        templateFixed = false; // Allow template to be moved after selection
        isFixed = false; // Дозволяємо переміщення після вибору шаблону
        fixButton.style.display = "block"; // Show the fix button

        // Clear uploaded images
        images = [];
        redrawCanvas();
    }

    // Function to handle scaling on scroll
    function handleScalingOnScroll(e) {
        e.preventDefault();

        if (draggingImageIndex !== null) {
            const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
            images[draggingImageIndex].scale *= scaleFactor;
            redrawCanvas();
        }
    }

    // Function to handle clear canvas button click
    function handleClearCanvasClick() {
        // Clear uploaded images
        images = [];

        // Clear template
        templateImg.src = "";

        redrawCanvas();
    }

    // 📌 Завантаження фото
    imageUpload.addEventListener("change", handleImageUpload);

    // 📌 Переміщення фото (якщо не зафіксоване)
    canvas.addEventListener("mousedown", handleMouseDown);

    canvas.addEventListener("mousemove", handleMouseMove);

    canvas.addEventListener("mouseup", handleMouseUp);

    // 📌 Фіксація фото при натисканні кнопки
    fixButton.addEventListener("click", handleFixButtonClick);

    // 📌 Вибір шаблону
    templateButtons.forEach((button) => {
        button.addEventListener("click", () => handleTemplateSelection(button));
    });

    templateImg.onload = () => {
        redrawCanvas();
    };

    // 📌 Scaling on scroll
    canvas.addEventListener("wheel", handleScalingOnScroll);

    // 📌 Очищення канвасу
    clearCanvasButton.addEventListener("click", handleClearCanvasClick); // Add event listener to the clear canvas button
});