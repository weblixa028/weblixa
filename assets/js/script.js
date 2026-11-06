document.addEventListener("DOMContentLoaded", function () {

    console.log("Weblixa is ready!");

    /* ==============================
       Smooth Scrolling
       ============================== */

    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId = this.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);

            if (target) {
                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }

        });

    });


    /* ==============================
       Mobile Navigation
       ============================== */

    const navLinks = document.querySelectorAll(".nav-links a");

    navLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            navLinks.forEach(function (item) {
                item.classList.remove("active");
            });

            this.classList.add("active");

        });

    });


    /* ==============================
       Tool Card Animation
       ============================== */

    const cards = document.querySelectorAll(".tool-card");

    cards.forEach(function (card) {
        card.addEventListener("mouseenter", function () {
            this.style.transform = "translateY(-8px)";
            this.style.boxShadow = "0 15px 30px rgba(0, 0, 0, 0.12)";
        });

        card.addEventListener("mouseleave", function () {
            this.style.transform = "translateY(0)";
            this.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.08)";
        });
    });

});