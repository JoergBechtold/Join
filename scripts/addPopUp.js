document.addEventListener("DOMContentLoaded", function() {
    const addContactBtn = document.querySelector(".add-contact-btn");
    const contactForm = document.querySelector(".container-add");
    const closeBtn = document.querySelector(".close-btn");
    const cancelBtn = document.querySelector(".cancel-btn");
    const overlay = document.querySelector(".overlay");

    function closeForm() {
        contactForm.classList.remove("active");
        overlay.classList.remove("active");

        setTimeout(() => {
            contactForm.classList.add("hidden");
        }, 500);
    }

    addContactBtn.addEventListener("click", function() {
        contactForm.classList.remove("hidden");
        overlay.classList.add("active");
        setTimeout(() => {
            contactForm.classList.add("active");
        }, 10);
    });

    closeBtn.addEventListener("click", closeForm);
    overlay.addEventListener("click", closeForm);    
    cancelBtn.addEventListener("click", closeForm);  

    const icon = cancelBtn.querySelector("img");

    cancelBtn.addEventListener("mouseenter", function() {
        icon.src = "./assets/icons/x-mark-blue.svg";
    });

    cancelBtn.addEventListener("mouseleave", function() {
        icon.src = "./assets/icons/cancel.svg";
    });
});
