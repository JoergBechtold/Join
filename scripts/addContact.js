document.addEventListener("DOMContentLoaded", function () {
    const createBtn = document.querySelector(".create-btn");
    const contactList = document.querySelector(".contact-list");

    const nameInput = document.querySelector('input[placeholder="Name"]');
    const emailInput = document.querySelector('input[placeholder="Email"]');
    const phoneInput = document.querySelector('input[placeholder="Phone"]');

    const colorVariables = [
        "--circle-bg-color-orange",
        "--circle-bg-color-pink",
        "--circle-bg-color-violet",
        "--circle-bg-color-purple",
        "--circle-bg-color-turquoise",
        "--circle-bg-color-mint",
        "--circle-bg-color-coral",
        "--circle-bg-color-peach",
        "--circle-bg-color-magenta",
        "--circle-bg-color-yellow",
        "--circle-bg-color-blue",
        "--circle-bg-color-lime",
        "--circle-bg-color-lemon",
        "--circle-bg-color-red",
        "--circle-bg-color-gold"
    ];

    function checkInputs() {
        if (
            nameInput.value.trim() !== "" &&
            emailInput.value.trim() !== "" &&
            phoneInput.value.trim() !== ""
        ) {
            createBtn.disabled = false;
            createBtn.classList.remove("disabled");
        } else {
            createBtn.disabled = true;
            createBtn.classList.add("disabled");
        }
    }

    nameInput.addEventListener("input", checkInputs);
    emailInput.addEventListener("input", checkInputs);
    phoneInput.addEventListener("input", checkInputs);

    checkInputs();

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

        const avatarDiv = document.createElement("div");
        avatarDiv.classList.add("contact-avatar");

        const randomColor = colorVariables[Math.floor(Math.random() * colorVariables.length)];
        avatarDiv.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue(randomColor).trim();
        avatarDiv.textContent = nameValue.charAt(0).toUpperCase();

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
});
