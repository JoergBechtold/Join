function initContacts() {
  loadContacts();
  const addBtn = document.querySelector('.add-contact-btn');
  if (addBtn) {
    addBtn.onclick = showAddContactPopup;
  }
}

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

function initInputEvents() {
  const inputs = document.querySelectorAll(
    '.container-add input, .container-edit input'
  );
  inputs.forEach(function (input) {
    input.oninput = checkInputs;
  });
}

window.onload = function () {
  initContacts();
  initAddFormEvents();
  initOverlayEvent();
  initAddCancelHover();
  initEditFormEvents();
  initContactAndEditEvents();
  initInputEvents();
};

function showSuccessPopup() {
  const popup = document.getElementById('success-popup');

  popup.classList.remove('popup-hidden');
  popup.classList.add('show');

  setTimeout(() => {
    popup.classList.add('popup-hidden');
    popup.classList.remove('show');
  }, 4000);
}

function showAddContactPopup() {
  const pop = document.querySelector('.container-add');
  pop.classList.remove('hidden');
  pop.classList.add('active');
  document.querySelector('.overlay').classList.add('active');
}

function closeAddContactPopup() {
  const pop = document.querySelector('.container-add');
  pop.classList.add('hidden');
  pop.classList.remove('active');
  document.querySelector('.overlay').classList.remove('active');
}
