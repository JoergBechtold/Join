let dropdownOpen = false;
let selectedContacts = [];

/**
 * Toggles the visibility of the contacts dropdown menu.
 * Opens the dropdown if it is currently closed, and closes it if it is open.
 */
function toggleContactsDropdown() {
  const optionsContainer = document.getElementById('contacts_options_container');
  const arrowIcon = document.getElementById('contacts_select_arrow');
  const inputField = document.getElementById('selected_contact');
  const customSelect = document.getElementById('custom_select');
  const selectedContactsContainer = document.querySelector('.show-selected-contacts');
  if (optionsContainer.classList.contains('d-none')) {
    openDropdown(optionsContainer, arrowIcon, inputField, customSelect, selectedContactsContainer);
  } else {
    closeDropdown(optionsContainer, arrowIcon, inputField, customSelect, selectedContactsContainer);
  }
}

/**
 * Opens the contacts dropdown menu and updates its visual state.
 * Loads the contact options and focuses on the input field.
 *
 * @param {HTMLElement} optionsContainer - The container element for the contact options.
 * @param {HTMLElement} arrowIcon - The arrow icon indicating the dropdown state.
 * @param {HTMLElement} inputField - The input field for selecting contacts.
 * @param {HTMLElement} customSelect - The custom select container element.
 * @param {HTMLElement} selectedContactsContainer - The container displaying selected contacts.
 */
function openDropdown(optionsContainer, arrowIcon, inputField, customSelect, selectedContactsContainer) {
  optionsContainer.classList.remove('d-none');
  arrowIcon.src = 'assets/icons/arrow_drop_down_up.svg';
  selectedContactsContainer.classList.add('d-none');
  loadContacts();
  inputField.placeholder = '';
  inputField.focus();
  customSelect.classList.replace('custom-select', 'custom-select-focused');
  dropdownOpen = true;
}

/**
 * Closes the contacts dropdown menu and resets its visual state.
 *
 * @param {HTMLElement} optionsContainer - The container element for the contact options.
 * @param {HTMLElement} arrowIcon - The arrow icon indicating the dropdown state.
 * @param {HTMLElement} inputField - The input field for selecting contacts.
 * @param {HTMLElement} customSelect - The custom select container element.
 * @param {HTMLElement} selectedContactsContainer - The container displaying selected contacts.
 */
function closeDropdown(optionsContainer, arrowIcon, inputField, customSelect, selectedContactsContainer) {
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
  dropdownOpen = false;
}

/**
 * Closes the contacts dropdown menu when a click occurs outside of it.
 *
 * @param {Event} event - The click event that triggered this function.
 */
function closeDropdownOnBodyClick(event) {
  const clickedElement = event.target;
  if (dropdownOpen && !clickedElement.closest('#custom_select') && !clickedElement.closest('#contacts_options_container')) {
    const optionsContainer = document.getElementById('contacts_options_container');
    const arrowIcon = document.getElementById('contacts_select_arrow');
    const inputField = document.getElementById('selected_contact');
    const customSelect = document.getElementById('custom_select');
    const selectedContactsContainer = document.querySelector('.show-selected-contacts');
    closeDropdown(optionsContainer, arrowIcon, inputField, customSelect, selectedContactsContainer);
  }
}

/**
 * Loads contact data asynchronously and renders it in the dropdown menu.
 * If data is already loaded (i.e., `optionsContainer` has child elements), no action is taken.
 *
 * @returns {Promise<void>} A promise that resolves when the contacts are loaded and rendered.
 */
async function loadContacts() {
  const optionsContainer = document.getElementById('contacts_options_container');
  if (optionsContainer.childElementCount) return;
  try {
    const data = await loadData('contacts'); 
    if (data) {
      optionsContainer.innerHTML = renderContactsHtml(data); 
    } else {
      throw new Error('Keine Daten erhalten');
    }
  } catch (e) {
    console.error('Error loading contacts:', e);
    optionsContainer.innerHTML = '<div class="error-select-option">Error loading contacts.</div>';
  }
}

/**
 * Generates HTML for a list of contacts.
 * If no data is provided or the data object is empty, an error message is returned.
 *
 * @param {Object} data - An object containing contact details.
 * @returns {string} The generated HTML string for the contacts or an error message.
 */
function renderContactsHtml(data) {
  if (!data || Object.keys(data).length === 0) {
    return '<div class="error-select-option">No contacts found.</div>';
  }
  return Object.values(data)
    .map((contacts) => contactsCustomSelectOptionHtml(contacts))
    .join('');
}

/**
 * Toggles the selection state of a contact and updates the UI accordingly.
 *
 * @param {HTMLElement} element - The contact element that was clicked.
 */
function toggleSelectedContact(element) {
  toggleClass(element);
  updateSelectedContacts(element);
  updateImage(element);
}

/**
 * Toggles the CSS class for a contact element to mark it as selected or unselected.
 *
 * @param {HTMLElement} element - The contact element to toggle.
 */
function toggleClass(element) {
  element.classList.toggle('contacts-custom-select-option-selected');
}

/**
 * Updates the global `selectedContacts` array based on the selection state of a contact.
 * Ensures that selected contacts are sorted alphabetically by their initials.
 *
 * @param {HTMLElement} element - The contact element that was clicked.
 */
function updateSelectedContacts(element) {
  const initials = element.querySelector('.circle').textContent.trim();
  const randomColor = element.querySelector('.circle').style.backgroundColor;
  if (element.classList.contains('contacts-custom-select-option-selected')) {
    if (!selectedContacts.some((contact) => contact.initials === initials)) {
      selectedContacts.push({ initials, randomColor });
    }
  } else {
    selectedContacts = selectedContacts.filter((contact) => contact.initials !== initials);
  }
  selectedContacts = sortContacts(selectedContacts);
  renderSelectedContacts();
}

/**
 * Sorts an array of contacts alphabetically by their initials.
 *
 * @param {Array} contacts - An array of contact objects with `initials` and `randomColor`.
 * @returns {Array} A sorted array of contacts.
 */
function sortContacts(contacts) {
  return contacts.sort((a, b) => {
    if (a.initials[0] !== b.initials[0]) {
      return a.initials[0].localeCompare(b.initials[0]);
    }
    return (a.initials[1] || '').localeCompare(b.initials[1] || '');
  });
}

/**
 * Updates the checkbox image of a contact element based on its selection state.
 *
 * @param {HTMLElement} element - The contact element to update.
 */
function updateImage(element) {
  const imgElement = element.querySelector('img');
  if (imgElement) {
    if (element.classList.contains('contacts-custom-select-option-selected')) {
      imgElement.src = 'assets/icons/checked_box.svg';
    } else {
      imgElement.src = 'assets/icons/Square_box.svg';
    }
  }
}

/**
 * Creates a circle element with the specified background color and text content.
 * @param {string} backgroundColor - The background color of the circle.
 * @param {string} textContent - The text content inside the circle.
 * @returns {HTMLElement} - The created circle element.
 */
function createCircle(backgroundColor, textContent) {
  const circle = document.createElement('div');
  circle.className = 'circle';
  circle.style.backgroundColor = backgroundColor;
  circle.textContent = textContent;
  return circle;
}

/**
 * Renders the currently selected contacts in the UI by displaying their initials in colored circles.
 * Displays a maximum of 4 contacts and adds a "+" circle if there are more.
 */
function renderSelectedContacts() {
  const container = document.querySelector('.show-selected-contacts');
  container.innerHTML = '';
  const maxVisibleContacts = 4; 
  const visibleContacts = selectedContacts.slice(0, maxVisibleContacts);
  visibleContacts.forEach((contact) => {
    const circle = createCircle(contact.randomColor, contact.initials);
    container.appendChild(circle);
  });
  if (selectedContacts.length > maxVisibleContacts) {
    const plusCircle = createCircle('#ccc', `+${selectedContacts.length - maxVisibleContacts}`);
    container.appendChild(plusCircle);
  }
}

/**
 * Clears all selected contacts and resets their visual state in the UI.
 */
function clearAssignedTo() {
  selectedContacts = [];
  renderSelectedContacts();
  const selectedOptions = document.getElementsByClassName('contacts-custom-select-option-selected');
  Array.from(selectedOptions).forEach((option) => {
    option.classList.remove('contacts-custom-select-option-selected');
    option.classList.add('contacts-custom-select-option');
    const imgElement = option.querySelector('img');
    if (imgElement) {
      imgElement.src = 'assets/icons/Square_box.svg';
    }
  });
}

/**
 * Filters the displayed contacts in the dropdown menu based on the search input value.
 */
function filterContacts() {
  const searchValue = document.getElementById('selected_contact').value.toLowerCase();
  const contactOptions = document.querySelectorAll('.contacts-custom-select-option');
  contactOptions.forEach((option) => {
    const contactName = option.querySelector('.circle-and-name div:nth-child(2)').textContent.toLowerCase();
    if (contactName.includes(searchValue)) {
      option.style.display = 'block';
    } else {
      option.style.display = 'none';
    }
  });
}

