/**
 * Returns the contact element associated with a delete button.
 * If no delete button is provided, it returns the globally active contact.
 *
 * @param {HTMLElement} deleteBtn - The delete button element.
 * @returns {HTMLElement} The associated contact element.
 */
function getContactDiv(deleteBtn) {
  if (deleteBtn) {
    return deleteBtn.closest('.contact');
  } else {
    return activeContact;
  }
}

/**
 * Displays a confirmation dialog with the provided message.
 * Returns a Promise that resolves with the user's confirmation (true or false).
 *
 * @async
 * @param {string} message - The confirmation message to display.
 * @returns {Promise<boolean>} A promise that resolves to the confirmation result.
 */
async function showConfirmDialog(message) {
  return new Promise(resolve => {
    showConfirmPopup(message, confirmed => {
      resolve(confirmed);
    });
  });
}

/**
 * Updates the color associated with a contact before deletion.
 * It retrieves the contact's avatar color and adds it to an existing array in randomColorsJson.
 * If randomColorsJson is not initialized, it calls initializeRandomColors().
 *
 * @async
 * @param {HTMLElement} contactDiv - The contact element whose color will be updated.
 * @returns {Promise<void>}
 */
async function updateColorForDeletion(contactDiv) {
  const avatar = contactDiv.querySelector('.contact-avatar');
  const contactColor = avatar.getAttribute('data-color');
  if (!randomColorsJson) {
    await initializeRandomColors();
  }
  const key = Object.keys(randomColorsJson)[0];
  await addColorToExistingArray(key, contactColor);
}

/**
 * Deletes a contact from Firebase by calling the deleteData API.
 *
 * @async
 * @param {string} firebaseId - The Firebase ID of the contact to be deleted.
 * @returns {Promise<*>} A promise that resolves to the result of the deletion.
 */
async function performFirebaseDeletion(firebaseId) {
  const deleteResult = await deleteData('/contacts', firebaseId);
  return deleteResult;
}

/**
 * Processes the deletion of a contact from Firebase.
 * It retrieves the Firebase ID from the contact element, updates the color before deletion,
 * and then performs the deletion. If no Firebase ID is found, the contact is removed from the UI.
 *
 * @async
 * @param {HTMLElement} contactDiv - The contact element to be deleted.
 * @returns {Promise<boolean>} True if deletion was successful, otherwise false.
 */
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

/**
 * Asks the user for confirmation and, if confirmed, processes the deletion of the contact.
 *
 * @async
 * @param {HTMLElement} contactDiv - The contact element to be deleted.
 * @returns {Promise<boolean>} True if deletion was confirmed and processed successfully, otherwise false.
 */
async function confirmAndDeleteContact(contactDiv) {
  const confirmed = await showConfirmDialog('Do you really want to delete this contact?');
  if (!confirmed) return false;
  return await processDeletionFromFirebase(contactDiv);
}

/**
 * Processes the deletion of a contact.
 * It first retrieves the contact element using getContactDiv and then calls confirmAndDeleteContact.
 *
 * @param {HTMLElement} deleteBtn - The delete button element that initiated the deletion.
 * @returns {Promise<boolean>} A promise that resolves to true if deletion was successful, otherwise false.
 */
function processContactDeletion(deleteBtn) {
  const contactDiv = getContactDiv(deleteBtn);
  if (!contactDiv) {
    console.error('No valid contact to delete.');
    return Promise.resolve(false);
  }
  return confirmAndDeleteContact(contactDiv);
}

/**
 * Deletes a contact and closes the edit popup if the deletion is successful.
 */
function deleteAndCloseEdit() {
  processContactDeletion().then((success) => {
    if (success) {
      closeEditContactPopup();
    } else {
      console.error('Deletion failed.');
    }
  });
}

/**
 * Checks if the given contact is the currently active contact.
 * If so, clears its details and, on screens ≤ 1024px, hides the contact detail view.
 *
 * @param {HTMLElement} contactDiv - The contact element to check.
 */
function clearActiveContactIfNecessary(contactDiv) {
  if (activeContact === contactDiv) {
    clearDetails();
    if (window.innerWidth <= 1087) {
      hideContactDetail();
    }
  }
}

/**
 * Cleans up the container element if it is empty by removing the associated
 * line and letter group elements.
 *
 * @param {HTMLElement} container - The container element to clean up.
 */
function cleanupContainer(container) {
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

/**
 * Removes a contact element from the UI.
 * It checks and clears the contact's active status, removes the contact element,
 * and cleans up its parent container if it becomes empty.
 *
 * @param {HTMLElement} contactDiv - The contact element to remove.
 */
function removeContactFromUI(contactDiv) {
  const container = contactDiv.parentElement;
  clearActiveContactIfNecessary(contactDiv);
  contactDiv.remove();
  if (container.children.length === 0) {
    cleanupContainer(container);
  }
}


/**
 * Clears the contact detail view.
 * It removes the "visible" class from the contact details and clears the displayed text.
 * Also resets the active contact.
 */
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
