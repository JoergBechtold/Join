window.onload = function () {
  // Kontakte laden (z. B. aus Firebase)
  loadContacts();

  // --- Add Contact Popup ---
  // Öffnen des Add-Contact-Popups
  document.querySelector(".add-contact-btn").onclick = showAddContactPopup;
  // Formular-Submit für das Hinzufügen eines Kontakts
  var addForm = document.querySelector(".container-add form");
  if (addForm) {
    addForm.onsubmit = function (event) {
      createContact(event);
    };
  }
  // Popup schließen (Close- und Cancel-Buttons)
  var addCloseBtn = document.querySelector(".container-add .close-btn");
  var addCancelBtn = document.querySelector(".container-add .cancel-btn");
  if (addCloseBtn) addCloseBtn.onclick = closeAddContactPopup;
  if (addCancelBtn) addCancelBtn.onclick = closeAddContactPopup;
  

  // Icon-Wechsel beim Überfahren des Cancel-Buttons im Add-Popup
  if (addCancelBtn) {
    var cancelIcon = addCancelBtn.querySelector("img");
    addCancelBtn.onmouseenter = function () {
      cancelIcon.src = "./assets/icons/x-mark-blue.svg";
    };
    addCancelBtn.onmouseleave = function () {
      cancelIcon.src = "./assets/icons/cancel.svg";
    };
  }

  // --- Edit Contact Popup ---
  // Öffnen des Edit-Popups erfolgt in processContactEdition (im Code definiert)
  // Formular-Submit für das Speichern eines Kontakts
  var editForm = document.querySelector(".container-edit form");
  if (editForm) {
    editForm.onsubmit = function (event) {
      saveContact(event);
    };
  }
  // Schließen des Edit-Popups (Close- und Cancel-/Delete-Buttons)
  var editCloseBtn = document.querySelector(".container-edit .close-btn");
  var editCancelBtn = document.querySelector(".container-edit .cancel-btn");
  if (editCloseBtn) editCloseBtn.onclick = closeEditContactPopup;
  if (editCancelBtn) editCancelBtn.onclick = deleteAndCloseEdit;

  // --- Kontaktliste ---
  // Klicks in der Kontaktliste behandeln (für Details, Löschen etc.)
  var contactList = document.querySelector(".contact-list");
  if (contactList) {
    contactList.onclick = handleContactListClick;
  }

  // --- Hover-Effekte für Edit- und Delete-Buttons in der Detailansicht ---
  var editBtn = document.querySelector(".edit-btn");
  if (editBtn) {
    editBtn.onclick = processContactEdition;
    editBtn.onmouseover = function () {
      hoverEdit(true);
    };
    editBtn.onmouseout = function () {
      hoverEdit(false);
    };
  }

  // Optional: Weist Input-Felder (falls nötig) einen oninput-Handler zu
  var inputs = document.querySelectorAll(".container-add input, .container-edit input");
  inputs.forEach(function (input) {
    input.oninput = checkInputs;
  });
};

function showSuccessPopup() {
  const popup = document.getElementById("success-popup");

  popup.classList.remove("popup-hidden");
  popup.classList.add("show"); 

  setTimeout(() => {
      popup.classList.add("popup-hidden"); 
      popup.classList.remove("show");
  }, 4000);
}