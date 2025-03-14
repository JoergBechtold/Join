let activeButton = null;

function setPriority(buttonId) {
  const button = document.getElementById(buttonId);
  if (activeButton) {
    resetActiveButton();
  }
  if (activeButton !== button) {
    activateButton(button);
  } else {
    activeButton = null;
  }
}

function resetActiveButton() {
  if (activeButton) {
    activeButton.classList.remove('active-prio', 'red-prio', 'orange-prio', 'green-prio');
    const prevImg = document.getElementById(activeButton.id + '_img');
    if (prevImg) {
      prevImg.src = prevImg.src.replace('-event', '');
    }
  }
}

function activateButton(button) {
  activeButton = button;
  button.classList.add('active-prio');
  const buttonType = button.id.split('_')[0];
  updateButtonStyle(buttonType);
}

function updateButtonStyle(buttonType) {
  const prioStyles = {
    urgent: ['red-prio', 'high'],
    medium: ['orange-prio', 'medium'],
    low: ['green-prio', 'low'],
  };
  const [className, iconType] = prioStyles[buttonType];
  activeButton.classList.add(className);
  document.getElementById(activeButton.id + '_img').src = `/assets/icons/prio-${iconType}-event.svg`;
}

function handleSubtaskInput() {
  const addIcon = document.getElementById('add_subtask_icon');
  const checkIcon = document.getElementById('check_subtask_icon');
  const closeIcon = document.getElementById('close_subtask_icon');
  addIcon.classList.add('d-none');
  checkIcon.classList.replace('input-base-icon', 'input-base-icon-active');
  closeIcon.classList.replace('input-base-icon', 'input-base-icon-active');
  checkIcon.classList.remove('d-none');
  closeIcon.classList.remove('d-none');
}

function handleSubtaskInputImg() {
  handleSubtaskInput();
  document.getElementById('subtask_input').focus();
}

function handleSubtaskDelete() {
  const inputField = document.getElementById('subtask_input');
  const addIcon = document.getElementById('add_subtask_icon');
  const checkIcon = document.getElementById('check_subtask_icon');
  const closeIcon = document.getElementById('close_subtask_icon');
  inputField.value = '';
  addIcon.classList.remove('d-none');
  checkIcon.classList.replace('input-base-icon-active', 'input-base-icon');
  checkIcon.classList.add('d-none');
  closeIcon.classList.replace('input-base-icon-active', 'input-base-icon');
  closeIcon.classList.add('d-none');
}

let subtasks = [];

function handleSubtaskSave() {
  const subtaskInput = document.getElementById('subtask_input');
  const subtaskValue = subtaskInput.value.trim();
  if (subtaskValue !== '') {
    subtasks.push(subtaskValue);
    subtaskInput.value = '';
    handleSubtaskDelete();
    updateSubtaskDisplay();
  }
}

function updateSubtaskDisplay() {
  const subtaskEnum = document.getElementsByClassName('subtask-enum')[0];
  let subtaskHtml = '';
  for (let i = 0; i < subtasks.length; i++) {
    subtaskHtml += `
            <div class="subtask-item">
                <span class="subtask-text" ondblclick="editSubtask(${i})">• ${subtasks[i]}</span>
                <div class="subtask-icons">
                    <img src="assets/icons/edit.svg" alt="Edit" class="subtask-icon edit-icon" onclick="editSubtask(${i})">
                    <div class="vertical-line-subtask-dark"></div>
                    <img src="assets/icons/paperbasketdelet.svg" alt="Delete" class="subtask-icon delete-icon" onclick="deleteSubtask(${i})">
                </div>
            </div>
        `;
  }
  subtaskEnum.innerHTML = subtaskHtml;
}

function deleteSubtask(index) {
  subtasks.splice(index, 1);
  updateSubtaskDisplay();
}

function clearAll() {
  clearInput();
  clearButtons();
  clearSubtasks();
  clearSelection();
  clearAssignedTo();
  clearErrorMessages();
}

function clearInput() {
  const inputBaseFields = document.getElementsByClassName('input-base');
  const textareaBaseFields = document.getElementsByClassName('textarea-base');
  for (let i = 0; i < inputBaseFields.length; i++) {
    inputBaseFields[i].value = '';
  }
  for (let i = 0; i < textareaBaseFields.length; i++) {
    textareaBaseFields[i].value = '';
  }
}

function clearButtons() {
  if (activeButton) {
    resetActiveButton();
  }
}

function clearSubtasks() {
  document.getElementById('subtask_input').value = '';
  subtasks = [];
  handleSubtaskDelete();
  updateSubtaskDisplay();
}

let currentEditIndex = null;

function editSubtask(index) {
  const subtaskEnum = document.getElementsByClassName('subtask-enum')[0];
  const editInput = document.getElementById('edit_subtask_input');
  const deleteIcon = document.getElementById('edit_delete_icon');
  const saveIcon = document.getElementById('edit_save_icon');
  subtaskEnum.style.display = 'none';
  editInput.classList.remove('d-none');
  deleteIcon.classList.remove('d-none');
  saveIcon.classList.remove('d-none');
  editInput.value = subtasks[index];
  editInput.focus();
  currentEditIndex = index;
}

function cancelEditSubtask() {
  const subtaskEnum = document.getElementsByClassName('subtask-enum')[0];
  const editInput = document.getElementById('edit_subtask_input');
  const deleteIcon = document.getElementById('edit_delete_icon');
  const saveIcon = document.getElementById('edit_save_icon');
  if (currentEditIndex !== null) {
    subtasks.splice(currentEditIndex, 1);
  }
  editInput.classList.add('d-none');
  deleteIcon.classList.add('d-none');
  saveIcon.classList.add('d-none');
  subtaskEnum.style.display = 'block';
  updateSubtaskDisplay();
  currentEditIndex = null;
}

function saveEditedSubtask() {
  const editInput = document.getElementById('edit_subtask_input');
  const editedValue = editInput.value.trim();
  if (currentEditIndex !== null) {
    subtasks[currentEditIndex] = editedValue;
  }
  editInput.classList.add('d-none');
  document.getElementById('edit_delete_icon').classList.add('d-none');
  document.getElementById('edit_save_icon').classList.add('d-none');
  document.getElementsByClassName('subtask-enum')[0].style.display = 'block';
  updateSubtaskDisplay();
  currentEditIndex = null;
}

function toggleCategoryDropdown() {
  const optionsContainer = document.getElementById('options_container');
  const arrowIcon = document.getElementById('select_arrow');
  if (optionsContainer.classList.contains('d-none')) {
    optionsContainer.classList.remove('d-none');
    arrowIcon.src = '/assets/icons/arrow_drop_down_up.svg';
  } else {
    optionsContainer.classList.add('d-none');
    arrowIcon.src = '/assets/icons/arrow_drop_down.svg';
  }
}

function selectOption(value) {
  const selectedOption = document.getElementById('selected_option');
  selectedOption.textContent = value.charAt(0).toUpperCase() + value.slice(1);
  document.getElementById('options_container').classList.add('d-none');
  document.getElementById('select_arrow').src = '/assets/icons/arrow_drop_down.svg';
}

function clearSelection() {
  const selectedOption = document.getElementById('selected_option');
  selectedOption.textContent = 'Select task category';
}

// const BASE_URL = 'https://join-435-default-rtdb.europe-west1.firebasedatabase.app/';

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
}

async function loadContacts() {
  const optionsContainer = document.getElementById('contacts_options_container');
  if (optionsContainer.childElementCount) return;
  try {
    const res = await fetch(`${BASE_URL}/user.json`); /* Ändern */
    const data = await res.json();
    optionsContainer.innerHTML = renderContactsHtml(data);
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
    .map((user) => {
      const initials = user.initials || 'NN'; // Fallback auf "NN" wenn initials leer oder undefined
      return `
          <div class="contacts-custom-select-option" onclick="toggleSelectedContact(this)">
            <div class="name-and-img">
              <div class="circle-and-name">
                <div class="circle" style="background-color: ${user.randomColors};">
                  ${initials}
                </div>
                <div >${user.firstname} ${user.lastname}</div>
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

let selectedContacts = [];

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

function validateInputTitle() {
  const inputField = document.getElementById('title');
  const errorMessage = document.getElementById('error_message_title');
  if (inputField.value.trim() === '') {
    errorMessage.classList.remove('d-none');
    inputField.classList.add('red-border');
    return false;
  } else {
    errorMessage.classList.add('d-none');
    inputField.classList.remove('red-border');
    return true;
  }
}

function validateInputDate() {
  const inputField = document.getElementById('due_date');
  const errorMessageRequired = document.getElementById('error_message_date');
  const errorMessageFormat = document.getElementById('error_message_format');
  if (isDateFieldEmpty(inputField, errorMessageRequired)) {
    return false;
  }
  if (!isValidDateFormat(inputField, errorMessageFormat)) {
    return false;
  }
  return true;
}

function isDateFieldEmpty(inputField, errorMessage) {
  if (inputField.value.trim() === '') {
    errorMessage.classList.remove('d-none');
    inputField.classList.add('red-border');
    return true;
  } else {
    errorMessage.classList.add('d-none');
    inputField.classList.remove('red-border');
    return false;
  }
}

function isValidDateFormat(inputField, errorMessage) {
  const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
  if (!dateRegex.test(inputField.value.trim())) {
    errorMessage.classList.remove('d-none');
    inputField.classList.add('red-border');
    return false;
  } else {
    errorMessage.classList.add('d-none');
    inputField.classList.remove('red-border');
    return true;
  }
}

function validateCategory() {
  const selectedOption = document.getElementById('selected_option');
  const errorMessage = document.getElementById('error_message_category');
  const customSelect = document.getElementById('costum_select_category');
  if (selectedOption.textContent === 'Select task category') {
    errorMessage.classList.remove('d-none');
    customSelect.classList.add('red-border');
    return false;
  } else {
    errorMessage.classList.add('d-none');
    customSelect.classList.remove('red-border');
    return true;
  }
}

function clearErrorMessages() {
  const titleInput = document.getElementById('title');
  const titleErrorMessage = document.getElementById('error_message_title');
  titleErrorMessage.classList.add('d-none');
  titleInput.classList.remove('red-border');
  const dateInput = document.getElementById('due_date');
  const dateErrorMessageRequired = document.getElementById('error_message_date');
  const dateErrorMessageFormat = document.getElementById('error_message_format');
  dateErrorMessageRequired.classList.add('d-none');
  dateErrorMessageFormat.classList.add('d-none');
  dateInput.classList.remove('red-border');
  const categoryErrorMessage = document.getElementById('error_message_category');
  const customSelect = document.getElementById('costum_select_category');
  categoryErrorMessage.classList.add('d-none');
  customSelect.classList.remove('red-border');
}

function checkandSubmit() {
  validateInputTitle();
  validateInputDate();
  validateCategory();
  pushTasktoFirebase();
}
