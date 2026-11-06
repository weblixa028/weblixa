
const imageInput = document.getElementById("imageInput");
const uploadArea = document.getElementById("uploadArea");
const editor = document.getElementById("editor");
const imagePreview = document.getElementById("imagePreview");
const imageInfo = document.getElementById("imageInfo");

const rotateLeft = document.getElementById("rotateLeft");
const rotateRight = document.getElementById("rotateRight");
const flipHorizontal = document.getElementById("flipHorizontal");
const flipVertical = document.getElementById("flipVertical");
const resetTransform = document.getElementById("resetTransform");

const saveBtn = document.getElementById("saveBtn");
const chooseAnother = document.getElementById("chooseAnother");
const downloadBtn = document.getElementById("downloadBtn");
const result = document.getElementById("result");

let selectedFile = null;
let image = null;
let imageURL = null;
let outputURL = null;

let rotation = 0;
let flipX = 1;
let flipY = 1;


function formatBytes(bytes) {

    if (bytes === 0) {
        return "0 Bytes";
    }

    const units = [
        "Bytes",
        "KB",
        "MB",
        "GB"
    ];

    const i = Math.floor(
        Math.log(bytes) / Math.log(1024)
    );

    return (
        parseFloat(
            (
                bytes /
                Math.pow(1024, i)
            ).toFixed(2)
        ) +
        " " +
        units[i]
    );
}


function updatePreview() {

    imagePreview.style.transform =
        "rotate(" +
        rotation +
        "deg) " +
        "scaleX(" +
        flipX +
        ") " +
        "scaleY(" +
        flipY +
        ")";
}


function loadImage(file) {

    if (!file) {
        return;
    }

    if (!file.type.startsWith("image/")) {

        alert(
            "Please select an image file."
        );

        return;
    }

    selectedFile = file;

    if (imageURL) {
        URL.revokeObjectURL(imageURL);
    }

    imageURL = URL.createObjectURL(file);

    const newImage = new Image();

    newImage.onload = function () {

        image = newImage;

        imagePreview.src = imageURL;

        rotation = 0;
        flipX = 1;
        flipY = 1;

        updatePreview();

        imageInfo.textContent =
            "Original size: " +
            formatBytes(file.size) +
            " • " +
            newImage.naturalWidth +
            " × " +
            newImage.naturalHeight +
            " px";

        uploadArea.style.display = "none";
        editor.style.display = "block";

        if (outputURL) {
            URL.revokeObjectURL(outputURL);
        }

        outputURL = null;

        downloadBtn.href = "#";
        downloadBtn.classList.add("disabled");

        result.textContent = "";
    };


    newImage.onerror = function () {

        alert(
            "This image could not be opened."
        );
    };


    newImage.src = imageURL;
}


imageInput.addEventListener(
    "change",
    function () {

        loadImage(
            this.files[0]
        );

    }
);


uploadArea.addEventListener(
    "dragover",
    function (event) {

        event.preventDefault();

        uploadArea.style.borderColor =
            "#146ee9";

        uploadArea.style.background =
            "#fbfdff";
    }
);


uploadArea.addEventListener(
    "dragleave",
    function () {

        uploadArea.style.borderColor =
            "#bdd8f8";

        uploadArea.style.background =
            "#ffffff";
    }
);


uploadArea.addEventListener(
    "drop",
    function (event) {

        event.preventDefault();

        uploadArea.style.borderColor =
            "#bdd8f8";

        uploadArea.style.background =
            "#ffffff";

        const file =
            event.dataTransfer.files[0];

        loadImage(file);
    }
);


rotateLeft.addEventListener(
    "click",
    function () {

        rotation -= 90;

        if (rotation < 0) {
            rotation += 360;
        }

        updatePreview();

        result.textContent =
            "Image rotated left.";
    }
);


rotateRight.addEventListener(
    "click",
    function () {

        rotation += 90;

        if (rotation >= 360) {
            rotation -= 360;
        }

        updatePreview();

        result.textContent =
            "Image rotated right.";
    }
);


flipHorizontal.addEventListener(
    "click",
    function () {

        flipX *= -1;

        updatePreview();

        result.textContent =
            "Horizontal flip applied.";
    }
);


flipVertical.addEventListener(
    "click",
    function () {

        flipY *= -1;

        updatePreview();

        result.textContent =
            "Vertical flip applied.";
    }
);


resetTransform.addEventListener(
    "click",
    function () {

        rotation = 0;
        flipX = 1;
        flipY = 1;

        updatePreview();

        result.textContent =
            "Changes reset.";
    }
);


saveBtn.addEventListener(
    "click",
    function () {

        if (!image) {

            alert(
                "Please select an image first."
            );

            return;
        }

        const angle =
            ((rotation % 360) + 360) % 360;

        const swapSize =
            angle === 90 ||
            angle === 270;

        const canvas =
            document.createElement("canvas");

        canvas.width =
            swapSize
                ? image.naturalHeight
                : image.naturalWidth;

        canvas.height =
            swapSize
                ? image.naturalWidth
                : image.naturalHeight;

        const ctx =
            canvas.getContext("2d");

        ctx.save();

        ctx.translate(
            canvas.width / 2,
            canvas.height / 2
        );

        ctx.rotate(
            angle * Math.PI / 180
        );

        ctx.scale(
            flipX,
            flipY
        );

        ctx.drawImage(
            image,
            -image.naturalWidth / 2,
            -image.naturalHeight / 2
        );

        ctx.restore();


        canvas.toBlob(
            function (blob) {

                if (!blob) {

                    alert(
                        "Could not create the edited image."
                    );

                    return;
                }

                if (outputURL) {
                    URL.revokeObjectURL(outputURL);
                }

                outputURL =
                    URL.createObjectURL(blob);

                imagePreview.src =
                    outputURL;

                imagePreview.style.transform =
                    "none";

                downloadBtn.href =
                    outputURL;

                downloadBtn.download =
                    "weblixa-rotated-flipped.png";

                downloadBtn.classList.remove(
                    "disabled"
                );

                result.textContent =
                    "Changes applied successfully.";

            },
            "image/png"
        );
    }
);


chooseAnother.addEventListener(
    "click",
    function () {

        imageInput.value = "";

        image = null;
        selectedFile = null;

        rotation = 0;
        flipX = 1;
        flipY = 1;


        if (imageURL) {

            URL.revokeObjectURL(
                imageURL
            );

            imageURL = null;
        }


        if (outputURL) {

            URL.revokeObjectURL(
                outputURL
            );

            outputURL = null;
        }


        imagePreview.src = "";

        imagePreview.style.transform =
            "none";

        imageInfo.textContent = "";


        downloadBtn.href = "#";

        downloadBtn.classList.add(
            "disabled"
        );


        result.textContent = "";


        editor.style.display =
            "none";

        uploadArea.style.display =
            "block";
    }
);