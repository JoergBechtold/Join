let dropdownOpen = false; 
let selectedContacts = [];

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

function openDropdown(optionsContainer, arrowIcon, inputField, customSelect, selectedContactsContainer) {
  optionsContainer.classList.remove('d-none');
  arrowIcon.src = '/assets/icons/arrow_drop_down_up.svg';
  selectedContactsContainer.classList.add('d-none');
  loadContacts();
  inputField.placeholder = '';
  inputField.focus();
  customSelect.classList.replace('custom-select', 'custom-select-focused');
  dropdownOpen = true;
}

function closeDropdown(optionsContainer, arrowIcon, inputField, customSelect, selectedContactsContainer) {
  optionsContainer.classList.add('d-none');
  arrowIcon.src = '/assets/icons/arrow_drop_down.svg';
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

function closeDropdownOnBodyClick(event) {
  const clickedElement = event.target;
  if (
    dropdownOpen && 
    !clickedElement.closest('#custom_select') && 
    !clickedElement.closest('#contacts_options_container')
  ) {
    const optionsContainer = document.getElementById('contacts_options_container');
    const arrowIcon = document.getElementById('contacts_select_arrow');
    const inputField = document.getElementById('selected_contact');
    const customSelect = document.getElementById('custom_select');
    const selectedContactsContainer = document.querySelector('.show-selected-contacts');
    closeDropdown(optionsContainer, arrowIcon, inputField, customSelect, selectedContactsContainer);
  }
}

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

function renderContactsHtml(data) {
  if (!data || Object.keys(data).length === 0) {
    return '<div class="error-select-option">No contacts found.</div>';
  }
  return Object.values(data)
    .map((contacts) => {
      const initials = contacts.initials || 'NN'; // Fallback auf "NN" wenn initials leer oder undefined
      return `
          <div class="contacts-custom-select-option" onclick="toggleSelectedContact(this)">
            <div class="name-and-img">
              <div class="circle-and-name">
                <div class="circle" style="background-color: ${contacts.contactColor};">
                  ${initials}
                </div>
                <div >${contacts.firstname} ${contacts.lastname}</div>
              </div>
              <div>
              <img  src="/assets/icons/Square_box.svg" alt="Checkbox">
              </div>
            </div>
          </div>
        `;
    })
    .join('');
}

function toggleSelectedContact(element) {
  toggleClass(element);
  updateSelectedContacts(element);
  updateImage(element);
}

function toggleClass(element) {
  element.classList.toggle('contacts-custom-select-option-selected');
}

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

function sortContacts(contacts) {
  return contacts.sort((a, b) => {
    if (a.initials[0] !== b.initials[0]) {
      return a.initials[0].localeCompare(b.initials[0]);
    }
    return (a.initials[1] || '').localeCompare(b.initials[1] || '');
  });
}

function updateImage(element) {
  const imgElement = element.querySelector('img');
  if (imgElement) {
    if (element.classList.contains('contacts-custom-select-option-selected')) {
      imgElement.src = '/assets/icons/checked_box.svg';
    } else {
      imgElement.src = '/assets/icons/Square_box.svg';
    }
  }
}

function renderSelectedContacts() {
  const container = document.querySelector('.show-selected-contacts');
  container.innerHTML = '';
  selectedContacts.forEach((contact) => {
    const circle = document.createElement('div');
    circle.className = 'circle';
    circle.style.backgroundColor = contact.randomColor;
    circle.textContent = contact.initials;
    container.appendChild(circle);
  });
}

function clearAssignedTo() {
  selectedContacts = [];
  renderSelectedContacts();
  const selectedOptions = document.getElementsByClassName('contacts-custom-select-option-selected');
  Array.from(selectedOptions).forEach((option) => {
    option.classList.remove('contacts-custom-select-option-selected');
    option.classList.add('contacts-custom-select-option');
    const imgElement = option.querySelector('img');
    if (imgElement) {
      imgElement.src = '/assets/icons/Square_box.svg';
    }
  });
}

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