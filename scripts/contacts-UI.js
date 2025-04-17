/**
 * Activates the provided contact element if it is not already active.
 * It removes the active status from the current active element (if any)
 * and sets the global activeContact variable.
 *
 * @param {HTMLElement} contactDiv - The contact element to be activated.
 * @returns {boolean} - True if the element was activated; otherwise, false.
 */
function activateContact(contactDiv) {
  if (!contactDiv || contactDiv.classList.contains("active-contact"))
    return false;
  const current = document.querySelector(".active-contact");
  if (current) current.classList.remove("active-contact");
  contactDiv.classList.add("active-contact");
  activeContact = contactDiv;
  return true;
}

/**
 * Extracts contact data from a given contact element.
 *
 * @param {HTMLElement} contactDiv - The element from which the data is extracted.
 * @returns {object} - An object with properties: nameVal, emailVal, phoneVal, avatarVal, and avatarColor.
 */
function extractContactData(contactDiv) {
  const nameVal = contactDiv.querySelector(".contact-name").textContent;
  const emailVal = contactDiv.querySelector(".contact-email").textContent;
  const phoneVal = contactDiv.getAttribute("data-phone") || "No phone number available";
  const contactAvatar = contactDiv.querySelector(".contact-avatar");
  const avatarVal = contactAvatar.textContent.trim();
  const avatarColor = window.getComputedStyle(contactAvatar).backgroundColor;
  return { nameVal, emailVal, phoneVal, avatarVal, avatarColor };
}

/**
 * Updates the contact detail panel UI with the provided data.
 *
 * @param {object} data - An object containing the contact data (nameVal, emailVal, phoneVal, avatarVal, avatarColor).
 */
function updateDetailPanelUI(data) {
  const ds = document.querySelector(".contact-detail");
  const detailName = document.getElementById("detail-name");
  const detailEmail = document.getElementById("detail-email");
  const detailPhone = document.getElementById("detail-phone");
  const detailAvatar = document.getElementById("detail-avatar");

  detailName.textContent = data.nameVal;
  createPhoneAndEmailLink(detailEmail, data.emailVal, `mailto:${data.emailVal}`);
  createPhoneAndEmailLink(detailPhone, data.phoneVal, `tel:${data.phoneVal}`);
  detailAvatar.textContent = data.avatarVal;
  detailAvatar.style.backgroundColor = data.avatarColor;
  ds.classList.add("visible");
}

/**
 * Updates the contact detail panel based on the given contact element.
 *
 * @param {HTMLElement} contactDiv - The contact element from which the data is extracted.
 */
function updateContactDetailPanel(contactDiv) {
  const contactData = extractContactData(contactDiv);
  updateDetailPanelUI(contactData);
}

/**
 * Creates a link element (for phone or email) and inserts it into the parent element.
 *
 * @param {HTMLElement} parentElement - The parent element to which the link is added.
 * @param {string} linkText - The display text for the link.
 * @param {string} linkHref - The URL or reference that the link opens.
 */
function createPhoneAndEmailLink(parentElement, linkText, linkHref) {
  const linkElement = document.createElement("a");
  linkElement.textContent = linkText;
  linkElement.href = linkHref;
  parentElement.innerHTML = ""; 
  parentElement.appendChild(linkElement);
}

/**
 * Shows the contact details if the contact element was successfully activated.
 *
 * @param {HTMLElement} contactDiv - The contact element whose details will be shown.
 */
function showContactDetails(contactDiv) {
  if (activateContact(contactDiv)) {
    updateContactDetailPanel(contactDiv);
  }
}

/**
 * Event handler for clicks on the contact list.
 * Determines whether a contact should be deleted or its details shown.
 *
 * @param {Event} event - The click event.
 */
function handleContactListClick(event) {
  let target = event.target;
  if (target.nodeType === 3) {
    target = target.parentElement;
  }
  let deleteBtn = target.closest('.delete-btn');
  if (deleteBtn) {
    processContactDeletion(deleteBtn);
  } else {
    let contact = target.closest('.contact');
    showContactDetails(contact);
  }
}

/**
 * Displays the edit contact popup by making the corresponding container and overlay visible.
 */
function showEditContactPopup() {
  const popupContainer = document.querySelector('.container-edit');
  const overlayElement = document.querySelector('.overlay');
  popupContainer.classList.remove('hidden');
  overlayElement.classList.remove('hidden');
  popupContainer.classList.add('active');
  overlayElement.classList.add('active');
}

/**
 * Closes the edit contact popup by removing the active status and hiding the popup after a delay.
 */
function closeEditContactPopup() {
  const popupContainer = document.querySelector('.container-edit');
  const overlayElement = document.querySelector('.overlay');
  popupContainer.classList.remove('active');
  overlayElement.classList.remove('active');
  setTimeout(() => {
    popupContainer.classList.add('hidden');
    overlayElement.classList.add('hidden');
  }, 500);
}

/**
 * Prepares the edit contact popup by filling in the form fields with the active contact's data
 * and dynamically updating the profile image (avatar) section.
 */
function processContactEdition() {
  if (!activeContact) { return; }
  const nameInput = document.querySelector('.container-edit input[placeholder="Firstname Lastname"]');
  const emailInput = document.querySelector('.container-edit input[placeholder="Email"]');
  const phoneInput = document.querySelector('.container-edit input[placeholder="Phone"]');
  nameInput.value = activeContact.querySelector('.contact-name').textContent;
  emailInput.value = activeContact.querySelector('.contact-email').textContent;
  phoneInput.value = activeContact.getAttribute('data-phone') || "";
  
  const profileImageContainer = document.querySelector('.container-edit .profile-image');
  profileImageContainer.innerHTML = ''; 
  const activeAvatar = activeContact.querySelector('.contact-avatar');
  profileImageContainer.textContent = activeAvatar.textContent.trim();
  profileImageContainer.style.backgroundColor = activeAvatar.style.backgroundColor || '#ccc';
  profileImageContainer.classList.add('edit-mode');
  
  showEditContactPopup();
  checkInputs();
}

/**
 * Updates the basic UI of a contact (name, email, phone, avatar).
 *
 * @param {string} newName - The new name for the contact.
 * @param {string} newEmail - The new email address for the contact.
 * @param {string} newPhone - The new phone number for the contact.
 * @param {string} initials - The initials to be displayed in the avatar.
 */
function updateBasicContactUI(newName, newEmail, newPhone, initials) {
  activeContact.querySelector('.contact-name').textContent = newName;
  activeContact.querySelector('.contact-email').textContent = newEmail;
  activeContact.setAttribute('data-phone', newPhone);
  const aDiv = activeContact.querySelector('.contact-avatar');
  aDiv.textContent = initials;
  document.getElementById('detail-name').textContent = newName;
  document.getElementById('detail-email').textContent = newEmail;
  document.getElementById('detail-phone').textContent = newPhone;
  const detailAvatar = document.getElementById('detail-avatar, profile-avatar');
  if (detailAvatar) { 
    detailAvatar.textContent = initials;
    detailAvatar.style.backgroundColor = aDiv.style.backgroundColor;
  }
}

/**
 * Checks whether the contact needs to be repositioned due to a name change
 * (comparing the first letter of the current name to that of the new name).
 *
 * @param {string} newName - The new name to compare with.
 * @returns {boolean} - True if the contact needs to be repositioned; otherwise, false.
 */
function needsReposition(newName) {
  const currentName = activeContact.querySelector('.contact-name').textContent;
  return currentName.charAt(0).toUpperCase() !== newName.charAt(0).toUpperCase();
}

/**
 * Removes a contact element from its container and cleans up the container
 * if there are no more contacts present.
 *
 * @param {HTMLElement} contact - The contact element to be removed.
 */
function removeContactFromContainer(contact) {
  const container = contact.parentElement;
  contact.remove();
  if (container.children.length === 0) {
    const lineElem = container.previousElementSibling;
    const letterGroupElem = lineElem ? lineElem.previousElementSibling : null;
    if (letterGroupElem && letterGroupElem.classList.contains("letter-group")) {
      letterGroupElem.remove();
    }
    if (lineElem && lineElem.classList.contains("line")) {
      lineElem.remove();
    }
    container.remove();
  }
}

/**
 * Repositions the active contact element into a different group container,
 * if the new name requires a different grouping.
 *
 * @param {string} newName - The new name used for checking the required grouping.
 */
function repositionContactIfNeeded(newName) {
  if (needsReposition(newName)) {
    removeContactFromContainer(activeContact);
    const newGroupContainer = getOrCreateGroupContainer(newName.charAt(0).toUpperCase());
    insertContactSorted(newGroupContainer, activeContact, newName);
  }
}

/**
* Updates the contact UI and repositions the contact if required.
*
* @param {string} newName - The new name of the contact.
* @param {string} newEmail - The new email address.
* @param {string} newPhone - The new phone number.
* @param {string} initials - The initials to display in the avatar.
*/
function updateContactUI(newName, newEmail, newPhone, initials) {
// Retrieve the original grouping letter from a custom data attribute.
// If not present, default to the current displayed first letter.
const originalFirstLetter =
  activeContact.getAttribute('data-first-letter') ||
  activeContact.querySelector('.contact-name').textContent.charAt(0).toUpperCase();
updateBasicContactUI(newName, newEmail, newPhone, initials);
document.getElementById('detail-avatar').textContent = initials;
const newFirstLetter = newName.charAt(0).toUpperCase();
if (originalFirstLetter !== newFirstLetter) {
  removeContactFromContainer(activeContact);
  const newGroupContainer = getOrCreateGroupContainer(newFirstLetter);
  insertContactSorted(newGroupContainer, activeContact, newName);
}
activeContact.setAttribute('data-first-letter', newFirstLetter);
}

/**
 * Changes the icon of the edit button on mouseover.
 *
 * @param {boolean} isHovered - Indicates whether the mouse is over the element.
 */
function hoverEdit(isHovered) {
  const editIcon = document.getElementById("edit-icon");
  if (editIcon) {
    editIcon.src = isHovered ? "assets/icons/editblau.svg" : "assets/icons/edit.svg";
  }
}

/**
 * Changes the icon of the delete button on mouseover.
 *
 * @param {boolean} isHovered - Indicates whether the mouse is over the element.
 */
function hoverDelete(isHovered) {
  const deleteIcon = document.getElementById("delete-icon");
  if (deleteIcon) {
    deleteIcon.src = isHovered ? "assets/icons/delete.svg" : "assets/icons/paperbasketdelet.svg";
  }
}
