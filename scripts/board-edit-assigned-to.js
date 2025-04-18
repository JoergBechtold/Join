let editDropdownOpen = false;

/**
 * Toggles the visibility of the contact dropdown in the edit task form.
 * Opens the dropdown if it's currently hidden, otherwise closes it.
 */
function toggleEditContactsDropdown() {
  const optionsContainer = document.getElementById('edit_contacts_options');
  const arrowIcon = document.getElementById('edit_contacts_arrow');
  const inputField = document.getElementById('edit_selected_contact');
  const customSelect = document.getElementById('edit_custom_select');
  const selectedContactsContainer = document.getElementById('edit_selected_contact_circles');
  if (optionsContainer.classList.contains('d-none')) {
    openEditDropdown(optionsContainer, arrowIcon, inputField, customSelect, selectedContactsContainer);
  } else {
    closeEditDropdown(optionsContainer, arrowIcon, inputField, customSelect, selectedContactsContainer);
  }
}

/**
 * Opens the contact dropdown in the edit task form and updates its UI state.
 * Loads the contact options and focuses the input field.
 *
 * @param {HTMLElement} optionsContainer - Container holding the contact options.
 * @param {HTMLElement} arrowIcon - Arrow icon indicating dropdown direction.
 * @param {HTMLInputElement} inputField - Input field for filtering/selecting contacts.
 * @param {HTMLElement} customSelect - Wrapper element for the custom dropdown.
 * @param {HTMLElement} selectedContactsContainer - Container showing already selected contacts.
 */
function openEditDropdown(optionsContainer, arrowIcon, inputField, customSelect, selectedContactsContainer) {
  optionsContainer.classList.remove('d-none');
  arrowIcon.src = 'assets/icons/arrow_drop_down_up.svg';
  selectedContactsContainer.classList.add('d-none');
  loadEditContacts();
  inputField.placeholder = '';
  inputField.focus();
  customSelect.classList.replace('custom-select', 'custom-select-focused');
  editDropdownOpen = true;
}

/**
 * Closes the contact dropdown in the edit task form and resets its UI state.
 * Clears the input field, restores the placeholder, and shows selected contacts.
 *
 * @param {HTMLElement} optionsContainer - Container holding the contact options.
 * @param {HTMLElement} arrowIcon - Arrow icon indicating dropdown direction.
 * @param {HTMLInputElement} inputField - Input field for filtering/selecting contacts.
 * @param {HTMLElement} customSelect - Wrapper element for the custom dropdown.
 * @param {HTMLElement} selectedContactsContainer - Container showing already selected contacts.
 */
function closeEditDropdown(optionsContainer, arrowIcon, inputField, customSelect, selectedContactsContainer) {
  optionsContainer.classList.add('d-none');
  arrowIcon.src = 'assets/icons/arrow_drop_down.svg';
  inputField.value = '';
  inputField.placeholder = 'Select contacts to assign';
  customSelect.classList.replace('custom-select-focused', 'custom-select');
  selectedContactsContainer.classList.remove('d-none');
  inputField.blur();
  const contactOptions = document.querySelectorAll('.contacts-custom-select-option');
  contactOptions.forEach((option) => {
    option.style.display = 'block';
  });
  editDropdownOpen = false;
}

/**
 * Filters the contact list in the edit task form based on the user's input.
 * Shows only those contact options that match the search query.
 */
function filterEditContacts() {
  const searchValue = document.getElementById('edit_selected_contact').value.toLowerCase();
  const contactOptions = document.querySelectorAll('.contacts-custom-select-option');
  contactOptions.forEach((option) => {
    const contactName = option.querySelector('.circle-and-name div:nth-child(2)').textContent.toLowerCase();
    option.style.display = contactName.includes(searchValue) ? 'block' : 'none';
  });
}

/**
 * Loads contact data from Firebase and renders the contact selection list
 * in the edit task form. Prevents reloading if already loaded.
 * Displays an error message if loading fails.
 */
async function loadEditContacts() {
  const optionsContainer = document.getElementById('edit_contacts_options');
  optionsContainer.innerHTML = '';
  try {
    const data = await loadData('contacts');
    if (data) {
      optionsContainer.innerHTML = renderEditContactsHtml(data);
      markAlreadySelectedContacts();
    } else {
      throw new Error('Keine Daten erhalten');
    }
  } catch (e) {
    console.error('Error loading contacts:', e);
    optionsContainer.innerHTML = '<div class="error-select-option">Error loading contacts.</div>';
  }
}

/**
 * Marks contacts as selected in the edit form dropdown if they are already assigned.
 *
 * Iterates through all contact options in the custom select dropdown and checks
 * if the contact's initials exist in the `selectedEditContacts` array.
 * If found, the option is visually marked as selected and a checkmark image is added.
 */
function markAlreadySelectedContacts() {
  const contactOptions = document.querySelectorAll('.contacts-custom-select-option');
  contactOptions.forEach((option) => {
    const circleElement = option.querySelector('.circle');
    const initials = circleElement.textContent.trim();
    const isSelected = selectedEditContacts.some((c) => c.initials === initials);
    if (isSelected) {
      option.classList.add('contacts-custom-select-option-selected');
      updateImage(option); // Setze das Häkchen-Bild
    }
  });
}


/**
 * Generates the HTML markup for the contact options in the edit task dropdown.
 *
 * @param {Object} data - The contact data object retrieved from the database.
 * @returns {string} The HTML string containing all contact options, or an error message if none found.
 */
function renderEditContactsHtml(data) {
  return generateEditContactsHTML(data, selectedEditContacts);
}

/**
 * Toggles the selection state of a contact element in the edit dropdown.
 * Updates visual styling, contact list, and checkbox image.
 *
 * @param {HTMLElement} element - The contact element that was clicked.
 */
function toggleEditSelectedContact(element) {
  toggleClass(element);
  updateEditSelectedContacts(element);
  updateImage(element);
}

/**
 * Updates the list of selected contacts based on the clicked contact element.
 * Adds or removes the contact from the selection depending on its current state,
 * then sorts and re-renders the selected contacts display.
 *
 * @param {HTMLElement} element - The contact element that was toggled.
 */
function updateEditSelectedContacts(element) {
  const initials = element.querySelector('.circle').textContent.trim();
  const contactColor = element.querySelector('.circle').style.backgroundColor;
  if (element.classList.contains('contacts-custom-select-option-selected')) {
    if (!selectedEditContacts.some((c) => c.initials === initials)) {
      selectedEditContacts.push({ initials, contactColor });
    }
  } else {
    selectedEditContacts = selectedEditContacts.filter((c) => c.initials !== initials);
  }
  selectedEditContacts = sortContacts(selectedEditContacts);
  renderEditSelectedContacts();
}

/**
 * Renders up to 4 selected contacts as colored circles inside the given container.
 *
 * @param {HTMLElement} container - The container to render the contact circles into.
 * @param {Array} contacts - Array of contact objects with initials and colors.
 * @param {number} maxVisible - Maximum number of visible contact circles.
 */
function renderVisibleContacts(container, contacts, maxVisible) {
  const visibleContacts = contacts.slice(0, maxVisible);
  visibleContacts.forEach((contact) => {
    const circle = document.createElement('div');
    circle.className = 'circle';
    circle.textContent = contact.initials;
    circle.style.backgroundColor = contact.contactColor || contact.randomColor || '#ccc';
    container.appendChild(circle);
  });
}

/**
 * Renders selected contacts and a "+X" indicator if more than allowed are selected.
 */
function renderEditSelectedContacts() {
  const container = document.getElementById('edit_selected_contact_circles');
  if (!container) return;

  container.innerHTML = '';
  const maxVisible = 4;

  renderVisibleContacts(container, selectedEditContacts, maxVisible);

  const extraCount = selectedEditContacts.length - maxVisible;
  if (extraCount > 0) {
    const extra = document.createElement('span');
    extra.className = 'extra-circle';
    extra.textContent = `+${extraCount}`;
    container.appendChild(extra);
  }
}

/**
 * Clears all selected contacts in the edit form.
 * Removes the visual selection and resets the checkbox icons.
 */
function clearEditAssignedTo() {
  selectedEditContacts = [];
  renderEditSelectedContacts();
  const selectedOptions = document.getElementsByClassName('contacts-custom-select-option-selected');
  Array.from(selectedOptions).forEach((option) => {
    option.classList.remove('contacts-custom-select-option-selected');
    const imgElement = option.querySelector('img');
    if (imgElement) imgElement.src = 'assets/icons/Square_box.svg';
  });
}

/**
 * Handles body clicks and determines whether to close dropdowns.
 * Keeps the edit contacts dropdown open if clicking on its options.
 * 
 * @param {MouseEvent} event - The body click event.
 */
function closeEditDropdownOnBodyClick(event) {
  const isEditDropdown = event.target.closest('#edit_custom_select');
  const isContactOption = event.target.closest('.contacts-custom-select-option');
  if (!isEditDropdown && !isContactOption) {
    tryCloseEditDropdown();
  }
  tryCloseMobileDropdown(event);
}

/**
 * Closes the edit contacts dropdown if it's currently open.
 */
function tryCloseEditDropdown() {
  const optionsContainer = document.getElementById('edit_contacts_options');
  const arrowIcon = document.getElementById('edit_contacts_arrow');
  const inputField = document.getElementById('edit_selected_contact');
  const customSelect = document.getElementById('edit_custom_select');
  const selectedContactsContainer = document.getElementById('edit_selected_contact_circles');

  if (!optionsContainer.classList.contains('d-none')) {
    closeEditDropdown(optionsContainer, arrowIcon, inputField, customSelect, selectedContactsContainer);
  }
}

/**
 * Closes all open mobile dropdowns unless the click was inside the menu or its icon.
 * 
 * @param {MouseEvent} event - The body click event.
 */
function tryCloseMobileDropdown(event) {
  const isMobileMenuIcon = event.target.closest('.mobile-menu-icon');
  const isMobileDropdown = event.target.closest('.mobile-dropdown');

  if (!isMobileMenuIcon && !isMobileDropdown) {
    document.querySelectorAll('.mobile-dropdown').forEach((dropdown) => {
      dropdown.classList.add('d-none');
    });
  }
}