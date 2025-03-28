window.onload = function () {
  loadContacts();

  document.querySelector('.add-contact-btn').onclick = showAddContactPopup;

  var addForm = document.querySelector('.container-add form');
  if (addForm) {
    addForm.onsubmit = function (event) {
      ;
    };
  }

  var addCloseBtn = document.querySelector('.container-add .close-btn');
  var addCancelBtn = document.querySelector('.container-add .cancel-btn');
  if (addCloseBtn) addCloseBtn.onclick = closeAddContactPopup;
  if (addCancelBtn) addCancelBtn.onclick = closeAddContactPopup;

  document.querySelector('.overlay').onclick = function () {
    if (document.querySelector('.container-add.active')) {
      closeAddContactPopup();
    }
    if (document.querySelector('.container-edit.active')) {
      closeEditContactPopup();
    }
  };

  if (addCancelBtn) {
    var cancelIcon = addCancelBtn.querySelector('img');
    addCancelBtn.onmouseenter = function () {
      cancelIcon.src = 'assets/icons/x-mark-blue.svg';
    };
    addCancelBtn.onmouseleave = function () {
      cancelIcon.src = 'assets/icons/cancel.svg';
    };
  }

  var editForm = document.querySelector('.container-edit form');
  if (editForm) {
    editForm.onsubmit = function (event) {
      saveContact(event);
    };
  }

  var editCloseBtn = document.querySelector('.container-edit .close-btn');
  var editCancelBtn = document.querySelector('.container-edit .cancel-btn');
  if (editCloseBtn) editCloseBtn.onclick = closeEditContactPopup;
  if (editCancelBtn) editCancelBtn.onclick = deleteAndCloseEdit;

  var contactList = document.querySelector('.contact-list');
  if (contactList) {
    contactList.onclick = handleContactListClick;
  }

  var editBtn = document.querySelector('.edit-btn');
  if (editBtn) {
    editBtn.onclick = processContactEdition;
    editBtn.onmouseover = function () {
      hoverEdit(true);
    };
    editBtn.onmouseout = function () {
      hoverEdit(false);
    };
  }

  var inputs = document.querySelectorAll('.container-add input, .container-edit input');
  inputs.forEach(function (input) {
    input.oninput = checkInputs;
  });
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
