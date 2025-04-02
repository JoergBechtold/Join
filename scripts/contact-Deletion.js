function getContactDiv(deleteBtn) {
    if (deleteBtn) {
      return deleteBtn.closest('.contact');
    } else {
      return activeContact;
    }
  }  

async function showConfirmDialog(message) {
  return new Promise(resolve => {
    showConfirmPopup(message, confirmed => {
      resolve(confirmed);
    });
  });
}

async function updateColorForDeletion(contactDiv) {
  const avatar = contactDiv.querySelector('.contact-avatar');
  const contactColor = avatar.getAttribute('data-color');
  if (!randomColorsJson) {
    await initializeRandomColors();
  }
  const key = Object.keys(randomColorsJson)[0];
  await addColorToExistingArray(key, contactColor);
}

async function performFirebaseDeletion(firebaseId) {
  const deleteResult = await deleteData('/contacts', firebaseId);
  return deleteResult;
}

async function processDeletionFromFirebase(contactDiv) {
  const firebaseId = contactDiv.getAttribute('data-id');
  if (!firebaseId) {
    removeContactFromUI(contactDiv);
    return true;
  }
  try {
    await updateColorForDeletion(contactDiv);
    const deleteResult = await performFirebaseDeletion(firebaseId);
    if (deleteResult === null) {
      removeContactFromUI(contactDiv);
      return true;
    } else {
      console.error('Deletion error from deleteData:', deleteResult);
      return false;
    }
  } catch (err) {
    console.error('Deletion error:', err);
    return false;
  }
}

async function confirmAndDeleteContact(contactDiv) {
  const confirmed = await showConfirmDialog('Do you really want to delete this contact?');
  if (!confirmed) return false;
  return await processDeletionFromFirebase(contactDiv);
}

function processContactDeletion(deleteBtn) {
  const contactDiv = getContactDiv(deleteBtn);
  if (!contactDiv) {
    console.error('No valid contact to delete.');
    return Promise.resolve(false);
  }
  return confirmAndDeleteContact(contactDiv);
}

function deleteAndCloseEdit() {
  processContactDeletion().then((success) => {
    if (success) {
      closeEditContactPopup();
    } else {
      console.error('Deletion failed.');
    }
  });
}

function removeContactFromUI(contactDiv) {
  const container = contactDiv.parentElement;
  if (activeContact === contactDiv) clearDetails();
  contactDiv.remove();
  if (container.children.length === 0) {
    const line = container.previousElementSibling;
    const letterGroup = line ? line.previousElementSibling : null;
    if (letterGroup && letterGroup.classList.contains('letter-group')) {
      letterGroup.remove();
    }
    if (line && line.classList.contains('line')) {
      line.remove();
    }
    container.remove();
  }
}

function clearDetails() {
  const contactDetail = document.querySelector('.contact-detail'),
        detailName = document.getElementById('detail-name'),
        detailEmail = document.getElementById('detail-email'),
        detailPhone = document.getElementById('detail-phone'),
        detailAvatar = document.getElementById('detail-avatar');
        contactDetail.classList.remove('visible');
  if (activeContact) activeContact.classList.remove('active-contact');
  activeContact = null;
  detailName.textContent = detailEmail.textContent = detailPhone.textContent = detailAvatar.textContent = '';
}
  