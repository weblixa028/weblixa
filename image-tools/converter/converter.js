
const imageInput = document.getElementById("imageInput");
const uploadArea = document.getElementById("uploadArea");
const editor = document.getElementById("editor");

const originalPreview = document.getElementById("originalPreview");
const convertedPreview = document.getElementById("convertedPreview");

const originalInfo = document.getElementById("originalInfo");
const convertedInfo = document.getElementById("convertedInfo");

const format = document.getElementById("format");

const convertBtn = document.getElementById("convertBtn");
const resetBtn = document.getElementById("resetBtn");
const downloadBtn = document.getElementById("downloadBtn");

const result = document.getElementById("result");
const emptyMessage = document.getElementById("emptyMessage");

let selectedFile = null;
let originalURL = null;
let convertedURL = null;
let image = null;

/* FORMAT FILE SIZE */
function formatBytes(bytes) {
    if (bytes === 0) {
        return "0 Bytes";
    }

    const units = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));

    return (
        parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) +
        " " +
        units[i]
    );
}

/* GET FORMAT NAME */
function getFormatName(mimeType) {
    if (mimeType === "image/jpeg") return "JPG";
    if (mimeType === "image/png") return "PNG";
    if (mimeType === "image/webp") return "WebP";
    return "Image";
}

/* IMAGE SELECT */
imageInput.addEventListener("change", function () {
    const file = this.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
        alert("Please select a JPG, PNG or WebP image.");
        imageInput.value = "";
        return;
    }

    selectedFile = file;

    if (originalURL) URL.revokeObjectURL(originalURL);
    if (convertedURL) URL.revokeObjectURL(convertedURL);

    originalURL = URL.createObjectURL(file);
    originalPreview.src = originalURL;

    originalInfo.textContent = "Size: " + formatBytes(file.size);

    const readerImage = new Image();

    readerImage.onload = function () {
        image = readerImage;

        originalInfo.textContent =
            "Size: " +
            formatBytes(file.size) +
            " • " +
            readerImage.naturalWidth +
            " × " +
            readerImage.naturalHeight +
            " px • " +
            getFormatName(file.type);

        uploadArea.style.display = "none";
        editor.hidden = false;

        convertedPreview.src = "";
        convertedInfo.textContent = "";
        emptyMessage.style.display = "block";
        result.textContent = "";

        downloadBtn.href = "#";
        downloadBtn.classList.add("disabled");
    };

    readerImage.onerror = function () {
        alert("This image could not be opened.");
    };

    readerImage.src = originalURL;
});

/* CONVERT IMAGE */
convertBtn.addEventListener("click", function () {
    if (!selectedFile || !image) {
        alert("Please select an image first.");
        return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
        alert("Your browser does not support image conversion.");
        return;
    }

    const selectedFormat = format.value;

    if (selectedFormat === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.drawImage(image, 0, 0);

    convertBtn.disabled = true;
    convertBtn.textContent = "Converting...";

    canvas.toBlob(
        function (blob) {
            convertBtn.disabled = false;
            convertBtn.textContent = "Convert Image";

            if (!blob) {
                alert("Conversion failed. Please try another image.");
                return;
            }

            if (convertedURL) {
                URL.revokeObjectURL(convertedURL);
            }

            convertedURL = URL.createObjectURL(blob);
            convertedPreview.src = convertedURL;
            emptyMessage.style.display = "none";

            const formatName = getFormatName(selectedFormat);

            convertedInfo.textContent =
                "Size: " +
                formatBytes(blob.size) +
                " • " +
                image.naturalWidth +
                " × " +
                image.naturalHeight +
                " px • " +
                formatName;

            if (selectedFormat === selectedFile.type) {
                result.textContent = "Image converted successfully.";
            } else {
                result.textContent = "Successfully converted to " + formatName + ".";
            }

            let extension = "jpg";

            if (selectedFormat === "image/png") {
                extension = "png";
            }

            if (selectedFormat === "image/webp") {
                extension = "webp";
            }

            downloadBtn.href = convertedURL;
            downloadBtn.download = "weblixa-converted." + extension;
            downloadBtn.classList.remove("disabled");
        },
        selectedFormat,
        selectedFormat === "image/png" ? undefined : 0.92
    );
});

/* RESET */
resetBtn.addEventListener("click", resetConverter);

function resetConverter() {
    selectedFile = null;
    image = null;

    if (originalURL) URL.revokeObjectURL(originalURL);
    if (convertedURL) URL.revokeObjectURL(convertedURL);

    originalURL = null;
    convertedURL = null;

    imageInput.value = "";
    originalPreview.src = "";
    convertedPreview.src = "";

    originalInfo.textContent = "";
    convertedInfo.textContent = "";
    result.textContent = "";

    emptyMessage.style.display = "block";

    downloadBtn.href = "#";
    downloadBtn.removeAttribute("download");
    downloadBtn.classList.add("disabled");

    editor.hidden = true;
    uploadArea.style.display = "block";

    format.value = "image/jpeg";
}

/* DRAG & DROP */
uploadArea.addEventListener("dragover", function (event) {
    event.preventDefault();
    uploadArea.style.borderColor = "#146ee9";
});

uploadArea.addEventListener("dragleave", function () {
    uploadArea.style.borderColor = "#bdd8f8";
});

uploadArea.addEventListener("drop", function (event) {
    event.preventDefault();
    uploadArea.style.borderColor = "#bdd8f8";

    const files = event.dataTransfer.files;

    if (!files.length) return;

    const file = files[0];

    if (!file.type.startsWith("image/")) {
        alert("Please drop a JPG, PNG or WebP image.");
        return;
    }

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    imageInput.files = dataTransfer.files;
    imageInput.dispatchEvent(new Event("change"));
});

/* CLEANUP */
window.addEventListener("beforeunload", function () {
    if (originalURL) URL.revokeObjectURL(originalURL);
    if (convertedURL) URL.revokeObjectURL(convertedURL);
});