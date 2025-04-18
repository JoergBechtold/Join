let categoryDropdownOpen = false;

/**
 * Clears all input fields, buttons, subtasks, selections, assigned contacts, and error messages.
 */
function clearAll() {
  clearInput();
  clearButtons();
  clearSubtasks();
  clearSelection();
  clearAssignedTo();
  clearErrorMessages();
}

/**
 * Clears the values of all input and textarea fields with the classes `input-base` and `textarea-base`.
 */
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

/**
 * Opens the category dropdown menu and updates its visual state.
 *
 * @param {HTMLElement} optionsContainer - The container element for the category options.
 * @param {HTMLElement} arrowIcon - The arrow icon indicating the dropdown state.
 * @param {HTMLElement} customSelect - The custom select container element.
 */
function openCategoryDropdown(optionsContainer, arrowIcon, customSelect) {
  optionsContainer.classList.remove('d-none');
  arrowIcon.src = 'assets/icons/arrow_drop_down_up.svg';
  customSelect.classList.replace('custom-select', 'custom-select-focused');
  categoryDropdownOpen = true;
}

/**
 * Closes the category dropdown menu and resets its visual state.
 *
 * @param {HTMLElement} optionsContainer - The container element for the category options.
 * @param {HTMLElement} arrowIcon - The arrow icon indicating the dropdown state.
 * @param {HTMLElement} customSelect - The custom select container element.
 */
function closeCategoryDropdown(optionsContainer, arrowIcon, customSelect) {
  optionsContainer.classList.add('d-none');
  arrowIcon.src = 'assets/icons/arrow_drop_down.svg';
  customSelect.classList.replace('custom-select-focused', 'custom-select');
  categoryDropdownOpen = false;
}

/**
 * Toggles the visibility of the category dropdown menu.
 * Opens the dropdown if it is currently closed, and closes it if it is open.
 * Updates the visual state accordingly.
 */
function toggleCategoryDropdown() {
  const optionsContainer = document.getElementById('options_container');
  const arrowIcon = document.getElementById('select_arrow');
  const customSelect = document.getElementById('costum_select_category');
  if (optionsContainer.classList.contains('d-none')) {
    openCategoryDropdown(optionsContainer, arrowIcon, customSelect);
  } else {
    closeCategoryDropdown(optionsContainer, arrowIcon, customSelect);
  }
}

/**
 * Closes the category dropdown menu when a click occurs outside of it.
 *
 * @param {Event} event - The click event that triggered this function.
 */
function closeCategoryDropdownOnBodyClick(event) {
  const clickedElement = event.target;
  if (
    categoryDropdownOpen &&
    !clickedElement.closest('#costum_select_category') &&
    !clickedElement.closest('#options_container')
  ) {
    const optionsContainer = document.getElementById('options_container');
    const arrowIcon = document.getElementById('select_arrow');
    const customSelect = document.getElementById('costum_select_category');
    closeCategoryDropdown(optionsContainer, arrowIcon, customSelect);
  }
}

/**
 * Selects a category option and updates the displayed selected option text and dropdown state.
 *
 * @param {string} value - The value of the selected category option.
 */
function selectOption(value) {
  const selectedOption = document.getElementById('selected_option');
  selectedOption.textContent = value.charAt(0).toUpperCase() + value.slice(1);
  document.getElementById('options_container').classList.add('d-none');
  document.getElementById('select_arrow').src = 'assets/icons/arrow_drop_down.svg';
  validateCategory();
}

/**
 * Clears the selected category by resetting the displayed text to its default value.
 */
function clearSelection() {
  const selectedOption = document.getElementById('selected_option');
  selectedOption.textContent = 'Select task category';
}

/**
 * Shows or hides the error message for an input field.
 *
 * @param {HTMLElement} inputField - The input element to style.
 * @param {HTMLElement} errorMessage - The element to display the error message.
 * @param {string} message - The error message to show. If empty, hides the message.
 */
function setInputError(inputField, errorMessage, message) {
  if (message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('d-none');
    inputField.classList.add('red-border');
  } else {
    errorMessage.classList.add('d-none');
    inputField.classList.remove('red-border');
  }
}

/**
 * Validates the title input field and displays an error message if it is empty
 * or if the title exceeds 40 characters.
 *
 * @returns {boolean} `true` if the title is valid, otherwise `false`.
 */
function validateInputTitle() {
  const inputField = document.getElementById('title');
  const errorMessage = document.getElementById('error_message_title');
  const value = inputField.value.trim();
  if (value === '') {
    setInputError(inputField, errorMessage, 'This field is required');
    return false;
  }
  if (value.length > 40) {
    setInputError(inputField, errorMessage, 'The title must not exceed 40 characters');
    return false;
  }
  setInputError(inputField, errorMessage, '');
  return true;
}

/**
 * Shows an error message for the input field.
 *
 * @param {HTMLElement} inputField - The input field element.
 * @param {HTMLElement} errorMessage - The error message element.
 * @param {string} message - The error message to display.
 */
function showInputError(inputField, errorMessage, message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove('d-none');
  inputField.classList.add('red-border');
}

/**
 * Hides the error message for the input field.
 *
 * @param {HTMLElement} inputField - The input field element.
 * @param {HTMLElement} errorMessage - The error message element.
 */
function hideInputError(inputField, errorMessage) {
  errorMessage.classList.add('d-none');
  inputField.classList.remove('red-border');
}

/**
 * Checks if the given date string (YYYY-MM-DD) is in the past.
 *
 * @param {string} dateString - The date string to check.
 * @returns {boolean} `true` if the date is in the past, otherwise `false`.
 */
function isDateInPast(dateString) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const inputDate = new Date(dateString);
  return inputDate < today;
}

/**
 * Validates the due date input field and displays an error message if it is empty
 * or if the selected date is in the past.
 *
 * @returns {boolean} `true` if the date is valid, otherwise `false`.
 */
function validateInputDate() {
  const inputField = document.getElementById('due_date');
  const errorMessage = document.getElementById('error_message_date');
  const inputValue = inputField.value.trim();
  if (inputValue === '') {
    showInputError(inputField, errorMessage, 'This field is required');
    return false;
  }
  if (isDateInPast(inputValue)) {
    showInputError(inputField, errorMessage, 'Please select today or a future date');
    return false;
  }
  hideInputError(inputField, errorMessage);
  return true;
}

/**
 * Validates the selected category and displays an error message if no category is selected.
 *
 * @returns {boolean} `true` if a category is selected, otherwise `false`.
 */
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

/**
 * Clears all displayed error messages and removes red borders from invalid fields.
 */
function clearErrorMessages() {
  const titleInput = document.getElementById('title');
  const titleErrorMessage = document.getElementById('error_message_title');
  titleErrorMessage.classList.add('d-none');
  titleInput.classList.remove('red-border');
  const dateInput = document.getElementById('due_date');
  const dateErrorMessageRequired = document.getElementById('error_message_date');
  dateErrorMessageRequired.classList.add('d-none');
  dateInput.classList.remove('red-border');
  const categoryErrorMessage = document.getElementById('error_message_category');
  const customSelect = document.getElementById('costum_select_category');
  categoryErrorMessage.classList.add('d-none');
  customSelect.classList.remove('red-border');
}

/**
 * Validates all required inputs and submits the task data to Firebase if validation passes.
 */
function checkandSubmit() {
  const title = validateInputTitle();
  const date = validateInputDate();
  const category = validateCategory();
  if (title && date && category) {
    pushTaskToFirebase();
  }
}

/**
 * Sends task data to Firebase and handles success or failure responses.
 *
 * @returns {Promise<void>} A promise that resolves when the task is successfully submitted.
 */
async function pushTaskToFirebase() {
  const taskData = createTaskData();
  try {
    const response = await postData('tasks', taskData);
    if (response) {
      showPupupOverlayTaskAdded();
      setTimeout(() => {
        hidePopupOverlayTaskAdded(); 
        goToUrl('index.html');      
      }, 1700);
    } else {
      throw new Error('No response received from Firebase.');
    } 
  } catch (error) {
    console.error('Error saving task', error);
  }
}

/**
 * Creates a task data object from user inputs and selections.
 * This object contains all the necessary information to represent a task, such as title, description,
 * due date, priority, assigned contacts, category, and subtasks.
 *
 * @returns {Object} The task data object with the following properties:
 * - `title` (string): The title of the task.
 * - `description` (string): The description of the task (optional).
 * - `due_date` (string): The due date of the task.
 * - `priority` (string): The priority of the task (e.g., "Urgent", "Medium", "Low", or "No Priority").
 * - `assigned_to` (Array|'')): An array of assigned contacts or an empty string if none are assigned.
 * - `category` (string): The selected category for the task.
 * - `subtasks` (Array|'')): An array of subtasks or an empty string if none are added.
 * - `state` (string): The state of the task, defaulting to "open".
 */
function createTaskData() {
  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  const dueDate = document.getElementById('due_date').value.trim();
  const selectedCategory = document.getElementById('selected_option').textContent.trim();
  const priority = getPriority();
  const subtasksArray = Array.isArray(subtasks) && subtasks.length > 0 ? subtasks : '';
  const assignedTo = Array.isArray(selectedContacts) && selectedContacts.length > 0 ? selectedContacts : '';
  return {
    title: title,
    description: description || '',
    due_date: dueDate,
    priority: priority,
    assigned_to: assignedTo,
    category: selectedCategory,
    subtasks: subtasksArray,
    state: 'open',
  };
}

/**
 * Determines the priority of the task based on the currently active button.
 * If no button has been activated yet, defaults to "Medium".
 *
 * @returns {string} The priority of the task ("Urgent", "Medium", or "Low").
 */
function getPriority() {
  if (!activeButton || activeButton.id === 'medium_button') {
    return 'Medium';
  } else if (activeButton.id === 'urgent_button') {
    return 'Urgent';
  } else if (activeButton.id === 'low_button') {
    return 'Low';
  }
}

/**
 * Displays a popup overlay indicating that a task has been successfully added.
 * The popup remains visible until it is manually hidden.
 */
function showPupupOverlayTaskAdded() {
  const taskAdded = document.getElementById('popup_overlay_task_added');
  taskAdded.classList.add('d-flex');
}

/**
 * Hides the popup overlay for task added.
 */
function hidePopupOverlayTaskAdded() {
  const taskAdded = document.getElementById('popup_overlay_task_added');
  taskAdded.classList.remove('d-flex');
}

/**
 * Sets the minimum selectable date for the due date input field to today.
 * This ensures that users cannot select a date in the past when choosing a due date.
 * The function is intended to be called, for example, when the input field is clicked.
 */
function setMinDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const minDate = `${yyyy}-${mm}-${dd}`;
  document.getElementById('due_date').setAttribute('min', minDate);
}



