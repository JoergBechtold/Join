/**
 * Initializes the contacts section by loading existing contacts and attaching
 * a click event to the add contact button to display the add contact popup.
 */
function initContacts() {
  loadContacts();
  const addBtn = document.querySelector('.add-contact-btn');
  if (addBtn) {
    addBtn.onclick = showAddContactPopup;
  }
}

/**
 * Initializes events for the add contact form.
 * It prevents form submission by default and attaches click events to the close
 * and cancel buttons to close the add contact popup.
 */
function initAddFormEvents() {
  const addForm = document.querySelector('.container-add form');
  if (addForm) {
    addForm.onsubmit = function (event) {
      event.preventDefault();
    };
  }
  const addCloseBtn = document.querySelector('.container-add .close-btn');
  const addCancelBtn = document.querySelector('.container-add .cancel-btn');
  if (addCloseBtn) addCloseBtn.onclick = closeAddContactPopup;
  if (addCancelBtn) addCancelBtn.onclick = closeAddContactPopup;
}

/**
 * Initializes the overlay click event.
 * When the overlay is clicked, if there is an active add or edit contact popup,
 * the corresponding popup is closed.
 */
function initOverlayEvent() {
  const overlay = document.querySelector('.overlay');
  if (overlay) {
    overlay.onclick = function () {
      if (document.querySelector('.container-add.active')) {
        closeAddContactPopup();
      }
      if (document.querySelector('.container-edit.active')) {
        closeEditContactPopup();
      }
    };
  }
}

/**
 * Initializes the hover effects for the cancel button in the add contact popup.
 * Changes the cancel icon's source when the mouse enters or leaves the button.
 */
function initAddCancelHover() {
  const addCancelBtn = document.querySelector('.container-add .cancel-btn');
  if (addCancelBtn) {
    const cancelIcon = addCancelBtn.querySelector('img');
    if (cancelIcon) {
      addCancelBtn.onmouseenter = function () {
        cancelIcon.src = 'assets/icons/x-mark-blue.svg';
      };
      addCancelBtn.onmouseleave = function () {
        cancelIcon.src = 'assets/icons/cancel.svg';
      };
    }
  }
}

/**
 * Initializes events for the edit contact form.
 * It attaches the submit event handler to save changes and click events to the close
 * and cancel buttons. The cancel button in edit mode deletes the contact and closes the popup.
 */
function initEditFormEvents() {
  const editForm = document.querySelector('.container-edit form');
  if (editForm) {
    editForm.onsubmit = function (event) {
      saveContact(event);
    };
  }
  const editCloseBtn = document.querySelector('.container-edit .close-btn');
  const editCancelBtn = document.querySelector('.container-edit .cancel-btn');
  if (editCloseBtn) editCloseBtn.onclick = closeEditContactPopup;
  if (editCancelBtn) editCancelBtn.onclick = deleteAndCloseEdit;
}

/**
 * Initializes events for contact selection and editing.
 * It attaches the click event handler to the contact list for handling contact clicks,
 * and sets up hover events for the edit button.
 */
function initContactAndEditEvents() {
  const contactList = document.querySelector('.contact-list');
  if (contactList) {
    contactList.onclick = handleContactListClick;
  }
  const editBtn = document.querySelector('.edit-btn');
  if (editBtn) {
    editBtn.onclick = processContactEdition;
    editBtn.onmouseover = function () {
      hoverEdit(true);
    };
    editBtn.onmouseout = function () {
      hoverEdit(false);
    };
  }
}

/**
 * Initializes input events for both add and edit contact forms.
 * Attaches an input event handler to all inputs in the add and edit contact containers
 * to perform validation checks.
 */
function initInputEvents() {
  const inputs = document.querySelectorAll(
    '.container-add input, .container-edit input'
  );
  inputs.forEach(function (input) {
    input.oninput = checkInputs;
  });
}

/**
 * Window onload event handler that initializes various parts of the contacts section.
 * It initializes contacts, form events, overlay events, hover effects, form events for editing,
 * contact selection/edit events, and input validation events.
 */
window.onload = function () {
  initContacts();
  initAddFormEvents();
  initOverlayEvent();
  initAddCancelHover();
  initEditFormEvents();
  initContactAndEditEvents();
  initInputEvents();
};

/**
 * Displays a success popup that indicates a successful operation.
 * The popup is shown for 4 seconds before being hidden again.
 */
function showSuccessPopup() {
  const popup = document.getElementById('success-popup');

  popup.classList.remove('popup-hidden');
  popup.classList.add('show');

  setTimeout(() => {
    popup.classList.add('popup-hidden');
    popup.classList.remove('show');
  }, 4000);
}

/**
 * Displays the add contact popup by making the add contact container visible
 * and activating the overlay.
 */
function showAddContactPopup() {
  const pop = document.querySelector('.container-add');
  pop.classList.remove('hidden');
  pop.classList.add('active');
  document.querySelector('.overlay').classList.add('active');
}

function closeAddContactPopup() {
  const addPopup = document.querySelector('.container-add');
  const editPopup = document.querySelector('.container-edit');

  [addPopup, editPopup].forEach((popup) => {
    if (popup) {
      popup.classList.add('close'); // Animation starten

      setTimeout(() => {
        popup.classList.add('hidden');
        popup.classList.remove('close'); // Zurücksetzen
      }, 200); // muss zur Transition-Dauer passen
    }
  });

  document.querySelector('.overlay').classList.remove('active');
}

function closeEditContactPopup() {
  const editPopup = document.querySelector('.container-edit');
  if (editPopup) {
    editPopup.classList.add('close');

    setTimeout(() => {
      editPopup.classList.add('hidden');
      editPopup.classList.remove('active', 'close');
    }, 200);
  }

  document.querySelector('.overlay').classList.remove('active');
}


