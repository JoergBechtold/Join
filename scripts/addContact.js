document.addEventListener("DOMContentLoaded", function () {
    const createBtn = document.querySelector(".create-btn");
    const contactList = document.querySelector(".contact-list");

    const nameInput = document.querySelector('input[placeholder="Name"]');
    const emailInput = document.querySelector('input[placeholder="Email"]');
    const phoneInput = document.querySelector('input[placeholder="Phone"]');

    const detailSection = document.querySelector(".contact-detail");
    const detailName = document.getElementById("detail-name");
    const detailEmail = document.getElementById("detail-email");
    const detailPhone = document.getElementById("detail-phone");
    const detailAvatar = document.getElementById("detail-avatar");

    let activeContact = null;

    const colorVariables = [
        "--circle-bg-color-orange", "--circle-bg-color-pink",
        "--circle-bg-color-violet", "--circle-bg-color-purple",
        "--circle-bg-color-turquoise", "--circle-bg-color-mint",
        "--circle-bg-color-coral", "--circle-bg-color-peach",
        "--circle-bg-color-magenta", "--circle-bg-color-yellow",
        "--circle-bg-color-blue", "--circle-bg-color-lime",
        "--circle-bg-color-lemon", "--circle-bg-color-red",
        "--circle-bg-color-gold"
    ];

    // ✅ Telefonnummern-Validierung (nur Zahlen)
    phoneInput.addEventListener("input", function () {
        phoneInput.value = phoneInput.value.replace(/\D/g, "");
        checkInputs();
    });

    // ✅ Überprüft, ob alle Felder korrekt ausgefüllt sind
    function checkInputs() {
        const isPhoneValid = /^[0-9]+$/.test(phoneInput.value.trim());

        if (nameInput.value.trim() !== "" &&
            emailInput.value.trim() !== "" &&
            isPhoneValid) {
            createBtn.disabled = false;
            createBtn.classList.remove("disabled");
        } else {
            createBtn.disabled = true;
            createBtn.classList.add("disabled");
        }
    }

    // Event-Listener zur Kontrolle der Eingabe
    nameInput.addEventListener("input", checkInputs);
    emailInput.addEventListener("input", checkInputs);
    phoneInput.addEventListener("input", checkInputs);

    checkInputs(); // Initiale Prüfung

    // ✅ Kontakt-Erstellung
    createBtn.addEventListener("click", function (event) {
        event.preventDefault();

        const nameValue = nameInput.value.trim();
        const emailValue = emailInput.value.trim();
        const phoneValue = phoneInput.value.trim();

        if (!nameValue || !emailValue || !phoneValue) {
            alert("Bitte fülle alle Felder aus!");
            return;
        }

        const firstLetter = nameValue.charAt(0).toUpperCase();

        let letterGroup = document.querySelector(`.letter-group[data-letter="${firstLetter}"]`);
        let contactContainer;

        if (!letterGroup) {
            letterGroup = document.createElement("div");
            letterGroup.classList.add("letter-group");
            letterGroup.setAttribute("data-letter", firstLetter);
            letterGroup.textContent = firstLetter;

            const newLine = document.createElement("div");
            newLine.classList.add("line");

            contactContainer = document.createElement("div");
            contactContainer.classList.add("contact-container");

            const allGroups = [...document.querySelectorAll(".letter-group")];
            const nextGroup = allGroups.find(group => group.textContent > firstLetter);

            if (nextGroup) {
                contactList.insertBefore(letterGroup, nextGroup);
                contactList.insertBefore(newLine, nextGroup);
                contactList.insertBefore(contactContainer, nextGroup);
            } else {
                contactList.appendChild(letterGroup);
                contactList.appendChild(newLine);
                contactList.appendChild(contactContainer);
            }
        } else {
            contactContainer = letterGroup.nextElementSibling.nextElementSibling;
        }

        const contactDiv = document.createElement("div");
        contactDiv.classList.add("contact");

        contactDiv.setAttribute("data-phone", phoneValue);

        const avatarDiv = document.createElement("div");
        avatarDiv.classList.add("contact-avatar");

        const randomColor = colorVariables[Math.floor(Math.random() * colorVariables.length)];
        avatarDiv.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue(randomColor).trim();
        avatarDiv.textContent = nameValue
            .split(" ")
            .map(word => word.charAt(0).toUpperCase())
            .join("");

        const contactInfoDiv = document.createElement("div");
        contactInfoDiv.classList.add("contact-info");

        const contactName = document.createElement("p");
        contactName.classList.add("contact-name");
        contactName.textContent = nameValue;

        const contactEmail = document.createElement("a");
        contactEmail.classList.add("contact-email");
        contactEmail.textContent = emailValue;

        contactInfoDiv.appendChild(contactName);
        contactInfoDiv.appendChild(contactEmail);

        contactDiv.appendChild(avatarDiv);
        contactDiv.appendChild(contactInfoDiv);

        const contactsInContainer = [...contactContainer.querySelectorAll(".contact")];
        const nextContact = contactsInContainer.find(contact =>
            contact.querySelector(".contact-name").textContent.trim() > nameValue
        );

        if (nextContact) {
            contactContainer.insertBefore(contactDiv, nextContact);
        } else {
            contactContainer.appendChild(contactDiv);
        }

        nameInput.value = "";
        emailInput.value = "";
        phoneInput.value = "";

        checkInputs();
    });

    // ✅ Kontakt-Details und Löschen-Funktion
    contactList.addEventListener("click", function (event) {
        const contactDiv = event.target.closest(".contact");
        const deleteBtn = event.target.closest(".delete-btn");

        if (deleteBtn) {
            const contactDiv = deleteBtn.closest(".contact");
            if (!contactDiv) return;

            const letterGroup = contactDiv.previousElementSibling;
            const nextElement = contactDiv.nextElementSibling;

            const confirmDelete = confirm("Bist du sicher, dass du diesen Kontakt löschen möchtest?");
            if (!confirmDelete) return;

            if (activeContact === contactDiv) {
                detailSection.classList.remove("visible");
                activeContact.classList.remove("active-contact");
                activeContact = null;

                detailName.textContent = "";
                detailEmail.textContent = "";
                detailPhone.textContent = "";
                detailAvatar.textContent = "";
            }

            contactDiv.remove();

            if (
                letterGroup &&
                letterGroup.classList.contains("letter-group") &&
                (!nextElement || !nextElement.classList.contains("contact"))
            ) {
                letterGroup.remove();
                if (nextElement && nextElement.classList.contains("line")) {
                    nextElement.remove();
                }
            }
            return;
        }

        if (contactDiv && !contactDiv.classList.contains("active-contact")) {
            if (activeContact) {
                activeContact.classList.remove("active-contact");
            }

            contactDiv.classList.add("active-contact");
            activeContact = contactDiv;

            const nameValue = contactDiv.querySelector(".contact-name").textContent;
            const emailValue = contactDiv.querySelector(".contact-email").textContent;
            const phoneValue = contactDiv.getAttribute("data-phone") || "Keine Nummer vorhanden";
            const avatarDiv = contactDiv.querySelector(".contact-avatar");

            const avatarValue = avatarDiv.textContent.trim();
            const avatarColor = window.getComputedStyle(avatarDiv).backgroundColor;

            detailName.textContent = nameValue;
            detailEmail.textContent = emailValue;
            detailPhone.textContent = phoneValue;
            detailAvatar.textContent = avatarValue;
            detailAvatar.style.backgroundColor = avatarColor;

            detailSection.classList.add("visible");
        }
    });
});
