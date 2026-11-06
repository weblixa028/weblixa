document.addEventListener("DOMContentLoaded", function () {

    const imageInput = document.getElementById("imageInput");
    const uploadArea = document.getElementById("uploadArea");
    const editor = document.getElementById("editor");

    const originalPreview =
        document.getElementById("originalPreview");

    const compressedPreview =
        document.getElementById("compressedPreview");

    const originalInfo =
        document.getElementById("originalInfo");

    const compressedInfo =
        document.getElementById("compressedInfo");

    const quality =
        document.getElementById("quality");

    const qualityValue =
        document.getElementById("qualityValue");

    const format =
        document.getElementById("format");

    const compressBtn =
        document.getElementById("compressBtn");

    const resetBtn =
        document.getElementById("resetBtn");

    const downloadBtn =
        document.getElementById("downloadBtn");


    let selectedFile = null;
    let originalImage = null;

    let originalURL = null;
    let compressedURL = null;


    // =========================
    // Format File Size
    // =========================

    function formatBytes(bytes) {

        if (bytes < 1024) {
            return bytes + " Bytes";
        }

        if (bytes < 1024 * 1024) {
            return (bytes / 1024).toFixed(1) + " KB";
        }

        return (
            bytes / (1024 * 1024)
        ).toFixed(2) + " MB";
    }


    // =========================
    // Quality Slider
    // =========================

    quality.addEventListener(
        "input",
        function () {

            qualityValue.textContent =
                quality.value + "%";

        }
    );


    // =========================
    // Select Image
    // =========================

    imageInput.addEventListener(
        "change",
        function () {

            const file =
                imageInput.files[0];


            if (!file) {
                return;
            }


            if (!file.type.startsWith("image/")) {

                alert(
                    "Please select a valid image."
                );

                imageInput.value = "";

                return;
            }


            selectedFile = file;


            // Remove old URL

            if (originalURL) {

                URL.revokeObjectURL(
                    originalURL
                );

            }


            // Create preview URL

            originalURL =
                URL.createObjectURL(file);


            originalPreview.src =
                originalURL;


            // Load image

            const img =
                new Image();


            img.onload =
                function () {

                    originalImage = img;


                    originalInfo.textContent =
                        "Size: " +
                        formatBytes(file.size) +
                        " • " +
                        img.naturalWidth +
                        " × " +
                        img.naturalHeight +
                        " px";


                    // Hide upload

                    uploadArea.hidden =
                        true;


                    // Show editor

                    editor.hidden =
                        false;


                    // Clear old result

                    compressedPreview.removeAttribute(
                        "src"
                    );


                    compressedInfo.textContent =
                        "Your compressed image will appear here.";


                    downloadBtn.classList.add(
                        "disabled"
                    );


                    downloadBtn.removeAttribute(
                        "href"
                    );

                };


            img.onerror =
                function () {

                    alert(
                        "This image could not be loaded."
                    );

                };


            img.src =
                originalURL;

        }
    );


    // =========================
    // Compress Image
    // =========================

    compressBtn.addEventListener(
        "click",
        function () {

            if (!selectedFile || !originalImage) {

                alert(
                    "Please select an image first."
                );

                return;
            }


            const canvas =
                document.createElement(
                    "canvas"
                );


            canvas.width =
                originalImage.naturalWidth;


            canvas.height =
                originalImage.naturalHeight;


            const ctx =
                canvas.getContext("2d");


            if (!ctx) {

                alert(
                    "Your browser does not support image compression."
                );

                return;
            }


            const selectedFormat =
                format.value;


            /*
             * JPG does not support transparency.
             * White background prevents black/transparent
             * areas when converting PNG to JPG.
             */

            if (
                selectedFormat ===
                "image/jpeg"
            ) {

                ctx.fillStyle =
                    "#ffffff";

                ctx.fillRect(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );

            }


            ctx.drawImage(
                originalImage,
                0,
                0,
                canvas.width,
                canvas.height
            );


            const selectedQuality =
                Number(quality.value) / 100;


            const canvasQuality =
                selectedFormat ===
                "image/png"
                    ? undefined
                    : selectedQuality;


            compressBtn.disabled =
                true;


            compressBtn.textContent =
                "Compressing...";


            canvas.toBlob(
                function (blob) {

                    compressBtn.disabled =
                        false;


                    compressBtn.textContent =
                        "Compress Image";


                    if (!blob) {

                        alert(
                            "Compression failed. Please try again."
                        );

                        return;
                    }


                    // Remove previous compressed URL

                    if (compressedURL) {

                        URL.revokeObjectURL(
                            compressedURL
                        );

                    }


                    // Create new URL

                    compressedURL =
                        URL.createObjectURL(
                            blob
                        );


                    compressedPreview.src =
                        compressedURL;


                    // Calculate reduction

                    const oldSize =
                        selectedFile.size;


                    const newSize =
                        blob.size;


                    const reduction =
                        (
                            (oldSize - newSize)
                            / oldSize
                        ) * 100;


                    if (reduction > 0) {

                        compressedInfo.textContent =
                            "Size: " +
                            formatBytes(newSize) +
                            " • " +
                            reduction.toFixed(1) +
                            "% smaller";

                    } else {

                        compressedInfo.textContent =
                            "Size: " +
                            formatBytes(newSize) +
                            " • File size did not decrease";

                    }


                    // File extension

                    let extension =
                        "jpg";


                    if (
                        selectedFormat ===
                        "image/webp"
                    ) {

                        extension =
                            "webp";

                    }


                    if (
                        selectedFormat ===
                        "image/png"
                    ) {

                        extension =
                            "png";

                    }


                    // Download

                    downloadBtn.href =
                        compressedURL;


                    downloadBtn.download =
                        "weblixa-compressed." +
                        extension;


                    downloadBtn.classList.remove(
                        "disabled"
                    );

                },

                selectedFormat,

                canvasQuality
            );

        }
    );


    // =========================
    // Reset / Choose Another
    // =========================

    resetBtn.addEventListener(
        "click",
        function () {

            if (originalURL) {

                URL.revokeObjectURL(
                    originalURL
                );

            }


            if (compressedURL) {

                URL.revokeObjectURL(
                    compressedURL
                );

            }


            selectedFile = null;
            originalImage = null;

            originalURL = null;
            compressedURL = null;


            imageInput.value =
                "";


            originalPreview.removeAttribute(
                "src"
            );


            compressedPreview.removeAttribute(
                "src"
            );


            originalInfo.textContent =
                "";


            compressedInfo.textContent =
                "Your compressed image will appear here.";


            downloadBtn.href =
                "#";


            downloadBtn.removeAttribute(
                "download"
            );


            downloadBtn.classList.add(
                "disabled"
            );


            editor.hidden =
                true;


            uploadArea.hidden =
                false;


            quality.value =
                80;


            qualityValue.textContent =
                "80%";


            format.value =
                "image/jpeg";

        }
    );


    // =========================
    // Drag & Drop
    // =========================

    uploadArea.addEventListener(
        "dragover",
        function (event) {

            event.preventDefault();

            uploadArea.classList.add(
                "drag-over"
            );

        }
    );


    uploadArea.addEventListener(
        "dragleave",
        function () {

            uploadArea.classList.remove(
                "drag-over"
            );

        }
    );


    uploadArea.addEventListener(
        "drop",
        function (event) {

            event.preventDefault();


            uploadArea.classList.remove(
                "drag-over"
            );


            const file =
                event.dataTransfer.files[0];


            if (!file) {
                return;
            }


            if (!file.type.startsWith("image/")) {

                alert(
                    "Please drop a valid image file."
                );

                return;
            }


            const dataTransfer =
                new DataTransfer();


            dataTransfer.items.add(
                file
            );


            imageInput.files =
                dataTransfer.files;


            imageInput.dispatchEvent(
                new Event("change")
            );

        }
    );


    // =========================
    // Clean Memory
    // =========================

    window.addEventListener(
        "beforeunload",
        function () {

            if (originalURL) {

                URL.revokeObjectURL(
                    originalURL
                );

            }


            if (compressedURL) {

                URL.revokeObjectURL(
                    compressedURL
                );

            }

        }
    );

});