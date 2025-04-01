let editDropdownOpen = false;
let selectedEditContacts = [];

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

function filterEditContacts() {
  const searchValue = document.getElementById('edit_selected_contact').value.toLowerCase();
  const contactOptions = document.querySelectorAll('.contacts-custom-select-option');
  contactOptions.forEach((option) => {
    const contactName = option.querySelector('.circle-and-name div:nth-child(2)').textContent.toLowerCase();
    option.style.display = contactName.includes(searchValue) ? 'block' : 'none';
  });
}

async function loadEditContacts() {
  const optionsContainer = document.getElementById('edit_contacts_options');
  if (optionsContainer.childElementCount) return;

  try {
    const data = await loadData('contacts');
    if (data) {
      optionsContainer.innerHTML = renderEditContactsHtml(data);
    } else {
      throw new Error('Keine Daten erhalten');
    }
  } catch (e) {
    console.error('Error loading contacts:', e);
    optionsContainer.innerHTML = '<div class="error-select-option">Error loading contacts.</div>';
  }
}

function renderEditContactsHtml(data) {
  if (!data || Object.keys(data).length === 0) {
    return '<div class="error-select-option">No contacts found.</div>';
  }
  return Object.values(data)
    .map((contact) => contactsCustomSelectOptionHtml(contact))
    .join('');
}

function toggleEditSelectedContact(element) {
  toggleClass(element);
  updateEditSelectedContacts(element);
  updateImage(element);
}

function updateEditSelectedContacts(element) {
  const initials = element.querySelector('.circle').textContent.trim();
  const randomColor = element.querySelector('.circle').style.backgroundColor;

  if (element.classList.contains('contacts-custom-select-option-selected')) {
    if (!selectedEditContacts.some((c) => c.initials === initials)) {
      selectedEditContacts.push({ initials, randomColor });
    }
  } else {
    selectedEditContacts = selectedEditContacts.filter((c) => c.initials !== initials);
  }

  selectedEditContacts = sortContacts(selectedEditContacts);
  renderEditSelectedContacts();
}

function renderEditSelectedContacts() {
  const container = document.getElementById('edit_selected_contact_circles');
  container.innerHTML = '';
  selectedEditContacts.forEach((contact) => {
    const circle = document.createElement('div');
    circle.className = 'circle';
    circle.style.backgroundColor = contact.randomColor;
    circle.textContent = contact.initials;
    container.appendChild(circle);
  });
}

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