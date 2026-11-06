/* =========================================
   WEBLIXA PDF MAKER
   COMPLETE JAVASCRIPT
========================================= */


/* =========================================
   ELEMENTS
========================================= */

const documentTitle =
    document.getElementById("documentTitle");

const fontSize =
    document.getElementById("fontSize");

const titleEditor =
    document.getElementById("titleEditor");

const contentEditor =
    document.getElementById("contentEditor");

const imageContainer =
    document.getElementById("imageContainer");

const imageInput =
    document.getElementById("imageInput");

const pdfPage =
    document.getElementById("pdfPage");

const pageSize =
    document.getElementById("pageSize");

const previewButton =
    document.getElementById("previewButton");

const createPdfButton =
    document.getElementById("createPdfButton");

const addImageButton =
    document.getElementById("addImageButton");

const addPageButton =
    document.getElementById("addPageButton");

const clearButton =
    document.getElementById("clearButton");

const previousPageButton =
    document.getElementById("previousPageButton");

const nextPageButton =
    document.getElementById("nextPageButton");

const pageNumber =
    document.getElementById("pageNumber");

const pageCounter =
    document.getElementById("pageCounter");

const boldButton =
    document.getElementById("boldButton");

const italicButton =
    document.getElementById("italicButton");

const underlineButton =
    document.getElementById("underlineButton");

const alignLeft =
    document.getElementById("alignLeft");

const alignCenter =
    document.getElementById("alignCenter");

const alignRight =
    document.getElementById("alignRight");

const portraitButton =
    document.getElementById("portraitButton");

const landscapeButton =
    document.getElementById("landscapeButton");

const themeButton =
    document.getElementById("themeButton");

const documentWorkspace =
    document.querySelector(".document-workspace");


/* =========================================
   STATE
========================================= */

let pages = [];

let currentPageIndex = 0;

let currentOrientation = "portrait";

let currentFormatting = {
    bold: false,
    italic: false,
    underline: false,
    alignment: "left"
};


/* =========================================
   CREATE INITIAL PAGE
========================================= */

function createInitialPage() {

    pages = [
        {
            title: "My Document",
            content: "Write your text here...",
            fontSize: 16,
            bold: false,
            italic: false,
            underline: false,
            alignment: "left",
            images: []
        }
    ];

    currentPageIndex = 0;

    loadPage(0);
}


/* =========================================
   SAVE CURRENT PAGE
========================================= */

function saveCurrentPage() {

    if (!pages[currentPageIndex]) {
        return;
    }

    pages[currentPageIndex].title =
        titleEditor.innerText.trim() || "My Document";

    pages[currentPageIndex].content =
        contentEditor.innerText;

    pages[currentPageIndex].fontSize =
        Number(fontSize.value);

    pages[currentPageIndex].bold =
        currentFormatting.bold;

    pages[currentPageIndex].italic =
        currentFormatting.italic;

    pages[currentPageIndex].underline =
        currentFormatting.underline;

    pages[currentPageIndex].alignment =
        currentFormatting.alignment;

    pages[currentPageIndex].images =
        Array.from(
            imageContainer.querySelectorAll("img")
        ).map(function (img) {
            return img.src;
        });
}


/* =========================================
   LOAD PAGE
========================================= */

function loadPage(index) {

    if (!pages[index]) {
        return;
    }

    currentPageIndex = index;

    const page = pages[index];

    titleEditor.innerText =
        page.title || "My Document";

    contentEditor.innerText =
        page.content || "";

    fontSize.value =
        page.fontSize || 16;

    currentFormatting.bold =
        Boolean(page.bold);

    currentFormatting.italic =
        Boolean(page.italic);

    currentFormatting.underline =
        Boolean(page.underline);

    currentFormatting.alignment =
        page.alignment || "left";

    imageContainer.innerHTML = "";

    if (page.images && page.images.length) {

        page.images.forEach(function (imageData) {

            addImageToPage(
                imageData,
                false
            );

        });

    }

    applyPageFormatting();

    updatePageInformation();


    /* =========================================
       SCROLL TO TOP OF SELECTED PAGE

       جب Page 2, 3, 4 ... یا Page 8 پر جائیں
       تو screen ہمیشہ نئے page کے اوپر جائے گی۔
    ========================================= */

    setTimeout(function () {

        if (documentWorkspace) {

            documentWorkspace.scrollTop = 0;

            documentWorkspace.scrollLeft = 0;

        }


        const pageTop =
            pdfPage.getBoundingClientRect().top +
            window.scrollY;


        const headerHeight =
            document.querySelector(".site-header")
                ? document.querySelector(".site-header").offsetHeight
                : 72;


        window.scrollTo({
            top: Math.max(
                0,
                pageTop - headerHeight - 15
            ),
            behavior: "auto"
        });

    }, 0);
}


/* =========================================
   UPDATE PAGE INFORMATION
========================================= */

function updatePageInformation() {

    pageNumber.textContent =
        currentPageIndex + 1;

    pageCounter.textContent =
        "Page " +
        (currentPageIndex + 1) +
        " of " +
        pages.length;

    previousPageButton.disabled =
        currentPageIndex === 0;

    nextPageButton.disabled =
        currentPageIndex === pages.length - 1;
}


/* =========================================
   APPLY FORMATTING
========================================= */

function applyPageFormatting() {

    titleEditor.style.fontSize =
        Math.max(
            22,
            Number(fontSize.value) + 12
        ) + "px";

    contentEditor.style.fontSize =
        fontSize.value + "px";

    contentEditor.style.fontWeight =
        currentFormatting.bold
            ? "700"
            : "400";

    contentEditor.style.fontStyle =
        currentFormatting.italic
            ? "italic"
            : "normal";

    contentEditor.style.textDecoration =
        currentFormatting.underline
            ? "underline"
            : "none";

    contentEditor.style.textAlign =
        currentFormatting.alignment;

    boldButton.classList.toggle(
        "active",
        currentFormatting.bold
    );

    italicButton.classList.toggle(
        "active",
        currentFormatting.italic
    );

    underlineButton.classList.toggle(
        "active",
        currentFormatting.underline
    );

    alignLeft.classList.toggle(
        "active",
        currentFormatting.alignment === "left"
    );

    alignCenter.classList.toggle(
        "active",
        currentFormatting.alignment === "center"
    );

    alignRight.classList.toggle(
        "active",
        currentFormatting.alignment === "right"
    );
}


/* =========================================
   DOCUMENT TITLE
========================================= */

documentTitle.addEventListener(
    "input",
    function () {

        saveCurrentPage();

    }
);


/* =========================================
   TITLE EDITOR
========================================= */

titleEditor.addEventListener(
    "input",
    function () {

        saveCurrentPage();

    }
);


/* =========================================
   CONTENT EDITOR
========================================= */

contentEditor.addEventListener(
    "input",
    function () {

        saveCurrentPage();

    }
);


/* =========================================
   FONT SIZE
========================================= */

fontSize.addEventListener(
    "change",
    function () {

        currentFormatting.bold =
            currentFormatting.bold;

        saveCurrentPage();

        applyPageFormatting();

    }
);


/* =========================================
   BOLD
========================================= */

boldButton.addEventListener(
    "click",
    function () {

        currentFormatting.bold =
            !currentFormatting.bold;

        saveCurrentPage();

        applyPageFormatting();

    }
);


/* =========================================
   ITALIC
========================================= */

italicButton.addEventListener(
    "click",
    function () {

        currentFormatting.italic =
            !currentFormatting.italic;

        saveCurrentPage();

        applyPageFormatting();

    }
);


/* =========================================
   UNDERLINE
========================================= */

underlineButton.addEventListener(
    "click",
    function () {

        currentFormatting.underline =
            !currentFormatting.underline;

        saveCurrentPage();

        applyPageFormatting();

    }
);


/* =========================================
   ALIGN LEFT
========================================= */

alignLeft.addEventListener(
    "click",
    function () {

        currentFormatting.alignment =
            "left";

        saveCurrentPage();

        applyPageFormatting();

    }
);


/* =========================================
   ALIGN CENTER
========================================= */

alignCenter.addEventListener(
    "click",
    function () {

        currentFormatting.alignment =
            "center";

        saveCurrentPage();

        applyPageFormatting();

    }
);


/* =========================================
   ALIGN RIGHT
========================================= */

alignRight.addEventListener(
    "click",
    function () {

        currentFormatting.alignment =
            "right";

        saveCurrentPage();

        applyPageFormatting();

    }
);


/* =========================================
   PORTRAIT
========================================= */

portraitButton.addEventListener(
    "click",
    function () {

        currentOrientation =
            "portrait";

        portraitButton.classList.add(
            "selected"
        );

        landscapeButton.classList.remove(
            "selected"
        );

        pdfPage.classList.remove(
            "landscape"
        );

    }
);


/* =========================================
   LANDSCAPE
========================================= */

landscapeButton.addEventListener(
    "click",
    function () {

        currentOrientation =
            "landscape";

        landscapeButton.classList.add(
            "selected"
        );

        portraitButton.classList.remove(
            "selected"
        );

        pdfPage.classList.add(
            "landscape"
        );

    }
);


/* =========================================
   ADD IMAGE BUTTON
========================================= */

addImageButton.addEventListener(
    "click",
    function () {

        imageInput.click();

    }
);


/* =========================================
   IMAGE INPUT
========================================= */

imageInput.addEventListener(
    "change",
    function (event) {

        const file =
            event.target.files[0];

        if (!file) {
            return;
        }

        const reader =
            new FileReader();

        reader.onload =
            function (e) {

                addImageToPage(
                    e.target.result,
                    true
                );

            };

        reader.readAsDataURL(file);

        imageInput.value = "";

    }
);


/* =========================================
   ADD IMAGE TO PAGE
========================================= */

function addImageToPage(
    imageData,
    saveAfter
) {

    const img =
        document.createElement("img");

    img.src =
        imageData;

    img.className =
        "document-image";

    imageContainer.appendChild(img);

    if (saveAfter) {
        saveCurrentPage();
    }
}


/* =========================================
   ADD NEW PAGE
========================================= */

addPageButton.addEventListener(
    "click",
    function () {

        saveCurrentPage();

        pages.push({
            title: "My Document",
            content: "Write your text here...",
            fontSize: Number(fontSize.value),
            bold: false,
            italic: false,
            underline: false,
            alignment: "left",
            images: []
        });

        currentPageIndex =
            pages.length - 1;

        loadPage(
            currentPageIndex
        );

    }
);


/* =========================================
   PREVIOUS PAGE
========================================= */

previousPageButton.addEventListener(
    "click",
    function () {

        if (currentPageIndex <= 0) {
            return;
        }

        saveCurrentPage();

        currentPageIndex--;

        loadPage(
            currentPageIndex
        );

    }
);


/* =========================================
   NEXT PAGE
========================================= */

nextPageButton.addEventListener(
    "click",
    function () {

        if (
            currentPageIndex >=
            pages.length - 1
        ) {
            return;
        }

        saveCurrentPage();

        currentPageIndex++;

        loadPage(
            currentPageIndex
        );

    }
);


/* =========================================
   CLEAR DOCUMENT
========================================= */

clearButton.addEventListener(
    "click",
    function () {

        const confirmed =
            confirm(
                "Are you sure you want to clear this document?"
            );

        if (!confirmed) {
            return;
        }

        documentTitle.value = "";

        titleEditor.innerText =
            "My Document";

        contentEditor.innerText =
            "Write your text here...";

        imageContainer.innerHTML = "";

        currentFormatting = {
            bold: false,
            italic: false,
            underline: false,
            alignment: "left"
        };

        pages = [
            {
                title: "My Document",
                content: "Write your text here...",
                fontSize: 16,
                bold: false,
                italic: false,
                underline: false,
                alignment: "left",
                images: []
            }
        ];

        currentPageIndex = 0;

        fontSize.value = 16;

        applyPageFormatting();

        updatePageInformation();

        loadPage(0);

    }
);


/* =========================================
   PREVIEW
========================================= */

previewButton.addEventListener(
    "click",
    function () {

        saveCurrentPage();

        openPreview();

    }
);


/* =========================================
   CREATE PDF / PRINT
========================================= */

createPdfButton.addEventListener(
    "click",
    function () {

        saveCurrentPage();

        generatePDF();

    }
);


/* =========================================
   PREVIEW WINDOW
========================================= */

function openPreview() {

    const previewWindow =
        window.open(
            "",
            "_blank",
            "width=900,height=700"
        );

    if (!previewWindow) {

        alert(
            "Please allow pop-ups for Weblixa to open the preview."
        );

        return;
    }

    let pagesHTML = "";

    pages.forEach(
        function (page) {

            pagesHTML += `
                <div class="preview-page">

                    <h1>${escapeHTML(page.title)}</h1>

                    <div class="preview-content">
                        ${escapeHTML(page.content).replace(/\n/g, "<br>")}
                    </div>

                    ${
                        page.images &&
                        page.images.length
                            ? page.images
                                .map(function (image) {
                                    return `
                                        <img
                                            src="${image}"
                                            class="preview-image"
                                        >
                                    `;
                                })
                                .join("")
                            : ""
                    }

                </div>
            `;

        }
    );


    previewWindow.document.write(`
        <!DOCTYPE html>

        <html>

        <head>

            <title>
                Weblixa PDF Preview
            </title>

            <style>

                body {
                    margin: 0;
                    padding: 30px;
                    background: #eef2f7;
                    font-family: Arial, Helvetica, sans-serif;
                }

                .preview-page {
                    width: 794px;
                    min-height: 1123px;
                    margin: 0 auto 30px;
                    padding: 70px 65px;
                    box-sizing: border-box;
                    background: #ffffff;
                    box-shadow:
                        0 10px 30px rgba(0,0,0,0.12);
                    color: #111827;
                }

                .preview-page h1 {
                    margin-top: 0;
                    margin-bottom: 25px;
                    color: #102a56;
                    font-size: 28px;
                }

                .preview-content {
                    font-size: 16px;
                    line-height: 1.75;
                    white-space: normal;
                }

                .preview-image {
                    display: block;
                    max-width: 100%;
                    height: auto;
                    margin-top: 20px;
                }

                @media print {

                    body {
                        background: #ffffff;
                        padding: 0;
                    }

                    .preview-page {
                        margin: 0;
                        box-shadow: none;
                        page-break-after: always;
                    }

                }

            </style>

        </head>

        <body>

            ${pagesHTML}

        </body>

        </html>
    `);

    previewWindow.document.close();
}


/* =========================================
   CREATE PDF / PRINT WINDOW
========================================= */

function generatePDF() {

    const printWindow =
        window.open(
            "",
            "_blank",
            "width=900,height=700"
        );

    if (!printWindow) {

        alert(
            "Please allow pop-ups for Weblixa to create the PDF."
        );

        return;
    }


    let pagesHTML = "";


    pages.forEach(
        function (page) {

            pagesHTML += `
                <div class="print-page">

                    <h1>
                        ${escapeHTML(page.title)}
                    </h1>

                    <div class="print-content">
                        ${escapeHTML(page.content).replace(/\n/g, "<br>")}
                    </div>

                    ${
                        page.images &&
                        page.images.length
                            ? page.images
                                .map(function (image) {

                                    return `
                                        <img
                                            src="${image}"
                                            class="print-image"
                                        >
                                    `;

                                })
                                .join("")
                            : ""
                    }

                </div>
            `;

        }
    );


    printWindow.document.write(`
        <!DOCTYPE html>

        <html>

        <head>

            <title>
                ${escapeHTML(
                    documentTitle.value ||
                    "Weblixa Document"
                )}
            </title>

            <style>

                @page {
                    size:
                        ${pageSize.value}
                        ${currentOrientation};
                    margin: 18mm;
                }

                * {
                    box-sizing: border-box;
                }

                body {
                    margin: 0;
                    font-family:
                        Arial,
                        Helvetica,
                        sans-serif;
                    color: #111827;
                }

                .print-page {
                    width: 100%;
                    min-height: 100%;
                    page-break-after: always;
                }

                .print-page:last-child {
                    page-break-after: auto;
                }

                .print-page h1 {
                    color: #102a56;
                    font-size: 24px;
                    margin: 0 0 20px;
                }

                .print-content {
                    font-size:
                        ${Number(fontSize.value)}px;
                    line-height: 1.75;
                    white-space: pre-wrap;
                    word-break: break-word;
                }

                .print-image {
                    display: block;
                    max-width: 100%;
                    height: auto;
                    margin-top: 20px;
                }

            </style>

        </head>

        <body>

            ${pagesHTML}

        </body>

        </html>
    `);

    printWindow.document.close();


    printWindow.onload =
        function () {

            setTimeout(
                function () {

                    printWindow.focus();

                    printWindow.print();

                },
                300
            );

        };
}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================
   DARK MODE
========================================= */

themeButton.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "dark-mode"
        );


        const darkMode =
            document.body.classList.contains(
                "dark-mode"
            );


        themeButton.textContent =
            darkMode
                ? "☀"
                : "☾";


        localStorage.setItem(
            "weblixa-dark-mode",
            darkMode
                ? "enabled"
                : "disabled"
        );

    }
);


/* =========================================
   LOAD DARK MODE
========================================= */

if (
    localStorage.getItem(
        "weblixa-dark-mode"
    ) === "enabled"
) {

    document.body.classList.add(
        "dark-mode"
    );

    themeButton.textContent =
        "☀";

}


/* =========================================
   KEYBOARD SHORTCUTS
========================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.ctrlKey &&
            event.key.toLowerCase() === "b"
        ) {

            event.preventDefault();

            boldButton.click();

        }


        if (
            event.ctrlKey &&
            event.key.toLowerCase() === "i"
        ) {

            event.preventDefault();

            italicButton.click();

        }


        if (
            event.ctrlKey &&
            event.key.toLowerCase() === "u"
        ) {

            event.preventDefault();

            underlineButton.click();

        }

    }
);


/* =========================================
   INITIALIZE
========================================= */

createInitialPage();