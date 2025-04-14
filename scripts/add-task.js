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
 * Toggles the visibility of the category dropdown menu and updates the arrow icon accordingly.
 */
function toggleCategoryDropdown() {
  const optionsContainer = document.getElementById('options_container');
  const arrowIcon = document.getElementById('select_arrow');
  if (optionsContainer.classList.contains('d-none')) {
    optionsContainer.classList.remove('d-none');
    arrowIcon.src = 'assets/icons/arrow_drop_down_up.svg';
  } else {
    optionsContainer.classList.add('d-none');
    arrowIcon.src = 'assets/icons/arrow_drop_down.svg';
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
}

/**
 * Clears the selected category by resetting the displayed text to its default value.
 */
function clearSelection() {
  const selectedOption = document.getElementById('selected_option');
  selectedOption.textContent = 'Select task category';
}

/**
 * Validates the title input field and displays an error message if it is empty.
 *
 * @returns {boolean} `true` if the title is valid, otherwise `false`.
 */
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

/**
 * Returns today's date normalized to midnight.
 * @returns {Date} Today's date with the time set to 00:00:00.
 */
function getTodayNormalized() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

/**
 * Returns a Date object based on the given date string, normalized to midnight.
 * @param {string} dateStr - The date string (e.g., "2025-04-14") to convert.
 * @returns {Date} The Date object with time set to 00:00:00.
 */
function getNormalizedDate(dateStr) {
  const date = new Date(dateStr);
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * Displays an error message for the given input field by updating the provided error element's text and style.
 * Also adds a red border to the input field.
 *
 * @param {HTMLElement} inputField - The input field element where the error occurs.
 * @param {HTMLElement} errorElement - The element that displays the error message.
 * @param {string} message - The error message to display.
 */
function displayError(inputField, errorElement, message) {
  errorElement.textContent = message;
  errorElement.classList.remove('d-none');
  inputField.classList.add('red-border');
}

/**
 * Clears any error styling and hides the error message for the given input field.
 *
 * @param {HTMLElement} inputField - The input field element to remove error styling from.
 * @param {HTMLElement} errorElement - The element that displays the error message.
 */
function clearError(inputField, errorElement) {
  errorElement.classList.add('d-none');
  inputField.classList.remove('red-border');
}

/**
 * Validates the due date input field, ensuring that a date is provided and that it is not in the past.
 *
 * @returns {boolean} True if the date is provided and is not in the past; otherwise, false.
 */
function validateInputDate() {
  const inputField = document.getElementById('due_date');
  const errorMessage = document.getElementById('error_message_date');
  const inputValue = inputField.value.trim();
  const today = getTodayNormalized();
  
  if (inputValue === '') {
    displayError(inputField, errorMessage, "This field is required.");
    return false;
  }
  
  const selectedDate = getNormalizedDate(inputValue);
  if (selectedDate < today) {
    displayError(inputField, errorMessage, "Date cannot be in the past.");
    return false;
  }
  
  clearError(inputField, errorMessage);
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
      clearAll();
      setTimeout(() => {
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
 *
 * @returns {string} The priority of the task ("Urgent", "Medium", "Low", or "No Priority").
 */
function getPriority() {
  if (activeButton && activeButton.id === 'urgent_button') {
    return 'Urgent';
  } else if (activeButton && activeButton.id === 'medium_button') {
    return 'Medium';
  } else if (activeButton && activeButton.id === 'low_button') {
    return 'Low';
  } else {
    return 'No Priority';
  }
}

/**
 * Displays a popup overlay indicating that a task has been successfully added.
 * The popup is shown briefly and then automatically hidden after a timeout.
 */
function showPupupOverlayTaskAdded() {
  const taskAdded = document.getElementById('popup_overlay_task_added');
  taskAdded.classList.add('d-flex');
  setTimeout(function () {
    taskAdded.classList.remove('d-flex');
  }, 800);
}

