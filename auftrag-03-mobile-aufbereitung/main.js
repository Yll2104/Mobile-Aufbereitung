// =====================================================
// ROYAL FINISH DETAILING
// MAIN.JS
// =====================================================


// =====================================================
// GOOGLE APPS SCRIPT
// =====================================================

const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyqRB-yxJs_yrThbnhm1EQeePal_0_EcRtSQN_TMjQHZZ3AvBQoqkOf-fWjbSt3oSsV/exec";


// =====================================================
// PAKETE
// =====================================================

const PACKAGES = {

    "Fresh Start": {
        normalPrice: 29.99,
        newCustomerPrice: 20.00
    },

    "Deep Clean": {
        normalPrice: 49.99,
        newCustomerPrice: 40.00
    },

    "Premium Complete": {
        normalPrice: 79.99,
        newCustomerPrice: 70.00
    }

};


// =====================================================
// START
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setupBookingForm();

        setupPackageSelection();

        setupMobileMenu();

        setupSmoothScroll();

        setupDateInput();

        setupGallery();

        setupReviews();

        setupHeader();

        setupRevealAnimations();

        setupYear();

    }
);


// =====================================================
// BOOKING FORM
// =====================================================

function setupBookingForm() {

    const form =
        document.getElementById("bookingForm");

    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const submitButton =
                document.getElementById(
                    "submitButton"
                );


            if (submitButton) {

                submitButton.disabled = true;

                submitButton.classList.add(
                    "loading"
                );

            }


            showStatus("", "");


            const formData =
                new FormData(form);


            const packageName =
                String(
                    formData.get("package") || ""
                ).trim();


            const packageData =
                PACKAGES[packageName];


            const customerType =
                String(
                    formData.get("customerType") || ""
                ).trim();


            const isNewCustomer =
                customerType === "new";


            // =============================================
            // DATEN
            // =============================================

            const booking = {

                name:
                    String(
                        formData.get("name") || ""
                    ).trim(),

                email:
                    String(
                        formData.get("email") || ""
                    ).trim(),

                phone:
                    String(
                        formData.get("phone") || ""
                    ).trim(),

                package:
                    packageName,

                date:
                    String(
                        formData.get("date") || ""
                    ).trim(),

                time:
                    String(
                        formData.get("time") || ""
                    ).trim(),

                location:
                    String(
                        formData.get("location") || ""
                    ).trim(),

                vehicle:
                    String(
                        formData.get("vehicle") || ""
                    ).trim(),

                message:
                    String(
                        formData.get("message") || ""
                    ).trim(),

                customerType:
                    customerType,

                isNewCustomer:
                    isNewCustomer

            };


            // =============================================
            // PREIS
            // =============================================

            if (packageData) {

                if (isNewCustomer) {

                    booking.price =
                        formatPrice(
                            packageData.newCustomerPrice
                        );

                    booking.priceType =
                        "Neukundenpreis";

                } else {

                    booking.price =
                        formatPrice(
                            packageData.normalPrice
                        );

                    booking.priceType =
                        "Normalpreis";

                }

            } else {

                booking.price = "";

                booking.priceType = "";

            }


            // =============================================
            // VALIDIERUNG
            // =============================================

            if (!booking.name) {

                showStatus(
                    "Bitte gib deinen Namen ein.",
                    "error"
                );

                resetSubmitButton(
                    submitButton
                );

                return;

            }


            if (!booking.email) {

                showStatus(
                    "Bitte gib deine E-Mail-Adresse ein.",
                    "error"
                );

                resetSubmitButton(
                    submitButton
                );

                return;

            }


            if (!isValidEmail(booking.email)) {

                showStatus(
                    "Bitte gib eine gültige E-Mail-Adresse ein.",
                    "error"
                );

                resetSubmitButton(
                    submitButton
                );

                return;

            }


            if (!booking.phone) {

                showStatus(
                    "Bitte gib deine Telefonnummer ein.",
                    "error"
                );

                resetSubmitButton(
                    submitButton
                );

                return;

            }


            if (!booking.package) {

                showStatus(
                    "Bitte wähle ein Paket aus.",
                    "error"
                );

                resetSubmitButton(
                    submitButton
                );

                return;

            }


            if (!customerType) {

                showStatus(
                    "Bitte wähle aus, ob du Neukunde bist.",
                    "error"
                );

                resetSubmitButton(
                    submitButton
                );

                return;

            }


            if (!booking.date) {

                showStatus(
                    "Bitte wähle ein Wunschdatum.",
                    "error"
                );

                resetSubmitButton(
                    submitButton
                );

                return;

            }


            if (!booking.time) {

                showStatus(
                    "Bitte wähle eine Wunschzeit aus.",
                    "error"
                );

                resetSubmitButton(
                    submitButton
                );

                return;

            }


            if (!booking.location) {

                showStatus(
                    "Bitte gib den Ort bzw. die Adresse ein.",
                    "error"
                );

                resetSubmitButton(
                    submitButton
                );

                return;

            }


            // =============================================
            // GOOGLE APPS SCRIPT
            // =============================================

            try {

                const response =
                    await fetch(
                        GOOGLE_SCRIPT_URL,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "text/plain;charset=utf-8"
                            },

                            body:
                                JSON.stringify(
                                    booking
                                )
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "HTTP Fehler " +
                        response.status
                    );

                }


                const result =
                    await response.json();


                console.log(
                    "Google Apps Script:",
                    result
                );


                // =========================================
                // ERFOLG
                // =========================================

                if (result.success) {

                    showStatus(

                        "✓ Deine Terminanfrage wurde erfolgreich " +
                        "gesendet. Du erhältst eine Bestätigung " +
                        "per E-Mail.",

                        "success"

                    );


                    form.reset();


                    resetPackageSelection();


                    const status =
                        document.getElementById(
                            "formStatus"
                        );


                    if (status) {

                        status.scrollIntoView({

                            behavior: "smooth",

                            block: "center"

                        });

                    }

                }


                // =========================================
                // FEHLER
                // =========================================

                else {

                    showStatus(

                        result.message ||
                        "Die Anfrage konnte nicht verarbeitet werden.",

                        "error"

                    );

                }


            } catch (error) {

                console.error(
                    "Google Apps Script Fehler:",
                    error
                );


                showStatus(

                    "Die Anfrage konnte leider nicht gesendet " +
                    "werden. Bitte versuche es später erneut.",

                    "error"

                );

            }


            resetSubmitButton(
                submitButton
            );

        }
    );

}


// =====================================================
// PREIS FORMATIEREN
// =====================================================

function formatPrice(price) {

    return price
        .toFixed(2)
        .replace(".", ",") + " €";

}


// =====================================================
// EMAIL VALIDIERUNG
// =====================================================

function isValidEmail(email) {

    const regex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(
        email.trim()
    );

}


// =====================================================
// STATUS
// =====================================================

function showStatus(
    message,
    type
) {

    const status =
        document.getElementById(
            "formStatus"
        );


    if (!status) {
        return;
    }


    status.textContent =
        message;


    status.className =
        "form-message";


    if (type) {

        status.classList.add(
            type
        );

    }

}


// =====================================================
// SUBMIT BUTTON
// =====================================================

function resetSubmitButton(
    button
) {

    if (!button) {
        return;
    }


    button.disabled =
        false;


    button.classList.remove(
        "loading"
    );

}


// =====================================================
// PAKET AUSWÄHLEN
// =====================================================

function setupPackageSelection() {

    const buttons =
        document.querySelectorAll(
            ".select-package"
        );


    const packageInput =
        document.getElementById(
            "package"
        );


    if (!buttons.length) {
        return;
    }


    buttons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const packageName =
                        button.dataset.package ||
                        "";


                    if (packageInput) {

                        packageInput.value =
                            packageName;

                    }


                    buttons.forEach(
                        function (item) {

                            item.classList.remove(
                                "selected"
                            );

                        }
                    );


                    button.classList.add(
                        "selected"
                    );


                    const contact =
                        document.getElementById(
                            "contact"
                        );


                    if (contact) {

                        contact.scrollIntoView({
                            behavior: "smooth"
                        });

                    }

                }
            );

        }
    );

}


// =====================================================
// PAKET RESET
// =====================================================

function resetPackageSelection() {

    const packageInput =
        document.getElementById(
            "package"
        );


    if (packageInput) {

        packageInput.value =
            "";

    }


    document
        .querySelectorAll(
            ".select-package"
        )
        .forEach(
            function (button) {

                button.classList.remove(
                    "selected"
                );

            }
        );

}


// =====================================================
// MOBILE MENU
// =====================================================

function setupMobileMenu() {

    const menuButton =
        document.getElementById(
            "menuButton"
        );


    const navigation =
        document.getElementById(
            "navigation"
        );


    if (
        !menuButton ||
        !navigation
    ) {

        return;

    }


    menuButton.addEventListener(
        "click",
        function () {

            const active =
                navigation.classList.toggle(
                    "active"
                );


            menuButton.setAttribute(
                "aria-expanded",
                active
                    ? "true"
                    : "false"
            );


            menuButton.classList.toggle(
                "active",
                active
            );


            document.body.classList.toggle(
                "menu-open",
                active
            );

        }
    );


    navigation
        .querySelectorAll("a")
        .forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        navigation.classList.remove(
                            "active"
                        );


                        menuButton.classList.remove(
                            "active"
                        );


                        menuButton.setAttribute(
                            "aria-expanded",
                            "false"
                        );


                        document.body.classList.remove(
                            "menu-open"
                        );

                    }
                );

            }
        );

}


// =====================================================
// SMOOTH SCROLL
// =====================================================

function setupSmoothScroll() {

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function (event) {

                        const href =
                            this.getAttribute(
                                "href"
                            );


                        if (
                            !href ||
                            href === "#"
                        ) {

                            return;

                        }


                        const target =
                            document.querySelector(
                                href
                            );


                        if (!target) {

                            return;

                        }


                        event.preventDefault();


                        target.scrollIntoView({

                            behavior: "smooth",

                            block: "start"

                        });

                    }
                );

            }
        );

}


// =====================================================
// DATUM
// =====================================================

function setupDateInput() {

    const dateInput =
        document.getElementById(
            "date"
        );


    if (!dateInput) {
        return;
    }


    const today =
        new Date();


    today.setHours(
        0,
        0,
        0,
        0
    );


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            today.getDate()
        ).padStart(
            2,
            "0"
        );


    dateInput.min =
        `${year}-${month}-${day}`;

}


// =====================================================
// GALERIE / LIGHTBOX
// =====================================================

function setupGallery() {

    const items =
        document.querySelectorAll(
            ".gallery-item"
        );


    const lightbox =
        document.getElementById(
            "lightbox"
        );


    const lightboxImage =
        document.getElementById(
            "lightboxImage"
        );


    const closeButton =
        document.getElementById(
            "lightboxClose"
        );


    if (
        !items.length ||
        !lightbox ||
        !lightboxImage
    ) {

        return;

    }


    items.forEach(
        function (item) {

            item.addEventListener(
                "click",
                function () {

                    const image =
                        item.dataset.image;


                    if (!image) {
                        return;
                    }


                    lightboxImage.src =
                        image;


                    lightbox.classList.add(
                        "active"
                    );


                    lightbox.setAttribute(
                        "aria-hidden",
                        "false"
                    );


                    document.body.classList.add(
                        "lightbox-open"
                    );

                }
            );

        }
    );


    function closeLightbox() {

        lightbox.classList.remove(
            "active"
        );


        lightbox.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.classList.remove(
            "lightbox-open"
        );


        lightboxImage.src =
            "";

    }


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeLightbox
        );

    }


    lightbox.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                lightbox
            ) {

                closeLightbox();

            }

        }
    );


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape"
            ) {

                closeLightbox();

            }

        }
    );

}


// =====================================================
// REVIEWS
// =====================================================

function setupReviews() {

    const reviews =
        document.querySelectorAll(
            ".review"
        );


    const dots =
        document.querySelectorAll(
            ".review-dot"
        );


    if (!reviews.length) {
        return;
    }


    let current = 0;


    function showReview(index) {

        if (
            index < 0 ||
            index >= reviews.length
        ) {

            return;

        }


        reviews.forEach(
            function (review, i) {

                review.classList.toggle(
                    "active",
                    i === index
                );

            }
        );


        dots.forEach(
            function (dot, i) {

                dot.classList.toggle(
                    "active",
                    i === index
                );

            }
        );


        current =
            index;

    }


    dots.forEach(
        function (dot) {

            dot.addEventListener(
                "click",
                function () {

                    const index =
                        Number(
                            dot.dataset.review
                        );


                    showReview(
                        index
                    );

                }
            );

        }
    );


    setInterval(
        function () {

            current++;


            if (
                current >=
                reviews.length
            ) {

                current = 0;

            }


            showReview(
                current
            );

        },
        6000
    );

}


// =====================================================
// HEADER
// =====================================================

function setupHeader() {

    const header =
        document.getElementById(
            "header"
        );


    if (!header) {
        return;
    }


    function updateHeader() {

        if (
            window.scrollY > 50
        ) {

            header.classList.add(
                "scrolled"
            );

        } else {

            header.classList.remove(
                "scrolled"
            );

        }

    }


    window.addEventListener(
        "scroll",
        updateHeader,
        {
            passive: true
        }
    );


    updateHeader();

}


// =====================================================
// REVEAL ANIMATIONS
// =====================================================

function setupRevealAnimations() {

    const elements =
        document.querySelectorAll(
            ".reveal"
        );


    if (!elements.length) {
        return;
    }


    if (
        !("IntersectionObserver" in window)
    ) {

        elements.forEach(
            function (element) {

                element.classList.add(
                    "visible"
                );

            }
        );

        return;

    }


    const observer =
        new IntersectionObserver(

            function (entries) {

                entries.forEach(
                    function (entry) {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "visible"
                            );


                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },

            {
                threshold: 0.12
            }

        );


    elements.forEach(
        function (element) {

            observer.observe(
                element
            );

        }
    );

}


// =====================================================
// FOOTER YEAR
// =====================================================

function setupYear() {

    const year =
        document.getElementById(
            "currentYear"
        );


    if (year) {

        year.textContent =
            new Date().getFullYear();

    }

}