// === Helper Functions ===

/**
 * Returns today's date normalized to midnight.
 * @returns {Date} Today's date with time set to 00:00:00.
 */
function getTodayNormalized() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

/**
 * Returns a Date object based on the provided date string, normalized to midnight.
 * @param {string} dateStr - The date string (e.g., "2025-04-14").
 * @returns {Date} A Date object with time set to 00:00:00.
 */
function getNormalizedDate(dateStr) {
  const date = new Date(dateStr);
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * Displays an error message on the given input field.
 * @param {HTMLElement} inputField - The input element where the error occurred.
 * @param {HTMLElement} errorElement - The element that displays the error message.
 * @param {string} message - The error message to display.
 */
function displayError(inputField, errorElement, message) {
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.remove('d-none');
  }
  inputField.classList.add('red-border');
}

/**
 * Clears any error styling and hides the error message for the given input field.
 * @param {HTMLElement} inputField - The input element to clear error styling from.
 * @param {HTMLElement} errorElement - The element that displays the error message.
 */
function clearError(inputField, errorElement) {
  if (errorElement) {
    errorElement.classList.add('d-none');
  }
  inputField.classList.remove('red-border');
}

// === Global Variables for the Edit Popup ===

let editPopupSubtasks = [];
let editPopupActiveButton = null;
let editPopupTaskKey = null;
let editPopupCurrentSubtaskIndex = null;
let selectedEditContacts = [];

// === Functions for Editing a Task ===

/**
 * Loads the task data from Firebase and opens the edit popup.
 *
 * @param {string} key - The ID of the task to be edited.
 */
async function editTask(key) {
  editPopupTaskKey = key;
  document.getElementById('popup_container').style.display = 'none';
  document.getElementById('overlay').style.display = 'block';
  const task = await loadData(`tasks/${key}`);
  if (!task) return;
  renderEditPreview(task);
  loadEditFormData(task);
  document.getElementById('edit_popup').style.display = 'flex';
}

/**
 * Renders the task preview section in the edit popup.
 *
 * @param {Object} task - The task object.
 */
function renderEditPreview(task) {
  const container = document.getElementById('edit_preview_info');
  if (!container) return;
  const assignedHTML = getAssignedHTML(task);
  const subtasksHTML = getSubtasksHTML(task);
  const categoryBg = getCategoryBg(task);
  const priorityIcon = getPriorityIcon(task.priority);
  container.innerHTML = generateEditPreviewHTML(task, assignedHTML, subtasksHTML, categoryBg, priorityIcon);
}

/**
 * Loads the task data into the edit form.
 *
 * @param {Object} task - The task object.
 */
function loadEditFormData(task) {
  document.getElementById('edit_title').value = task.title || '';
  document.getElementById('edit_description').value = task.description || '';
  document.getElementById('edit_due_date').value = task.due_date || '';
  if (task.priority) {
    const prio = task.priority.toLowerCase();
    if (['urgent', 'medium', 'low'].includes(prio)) {
      setEditPriority(`edit_${prio}_button`);
    }
  }
  if (task.category) {
    document.getElementById('edit_selected_option').textContent = task.category;
  }
  editPopupSubtasks = Array.isArray(task.subtasks) ? [...task.subtasks] : [];
  updateEditSubtaskDisplay();
  selectedEditContacts = Array.isArray(task.assigned_to)
    ? task.assigned_to.map(c => ({
        initials: c.initials,
        randomColor: c.randomColor
      }))
    : [];
  renderEditSelectedContacts();
}

/**
 * Sets the active priority button in the edit popup.
 *
 * @param {string} buttonId - The ID of the button to activate.
 */
function setEditPriority(buttonId) {
  const button = document.getElementById(buttonId);
  if (!button) return;
  if (editPopupActiveButton) resetEditPriorityButton();
  if (editPopupActiveButton !== button) activateEditPriorityButton(button);
}

/**
 * Resets the currently active priority button.
 */
function resetEditPriorityButton() {
  editPopupActiveButton.classList.remove('active-prio', 'red-prio', 'orange-prio', 'green-prio');
  const img = document.getElementById(editPopupActiveButton.id.replace('button', 'img'));
  if (img) img.src = img.src.replace('-event', '');
  editPopupActiveButton = null;
}

/**
 * Activates the specified priority button.
 *
 * @param {HTMLElement} button - The button element to activate.
 */
function activateEditPriorityButton(button) {
  editPopupActiveButton = button;
  button.classList.add('active-prio');
  const type = button.id.split('_')[1];
  applyEditPriorityStyle(type);
}

/**
 * Applies the corresponding CSS class and icon to the active priority button.
 *
 * @param {string} type - The priority type ('urgent', 'medium', or 'low').
 */
function applyEditPriorityStyle(type) {
  const styles = {
    urgent: ['red-prio', 'high'],
    medium: ['orange-prio', 'medium'],
    low: ['green-prio', 'low']
  };
  const [className, icon] = styles[type];
  editPopupActiveButton.classList.add(className);
  const img = document.getElementById(`edit_${type}_img`);
  if (img) img.src = `assets/icons/prio-${icon}-event.svg`;
}

/**
 * Returns the currently selected priority.
 *
 * @returns {string} 'urgent', 'medium', 'low' or ''.
 */
function getEditPriority() {
  if (!editPopupActiveButton) return '';
  if (editPopupActiveButton.id.includes('urgent')) return 'urgent';
  if (editPopupActiveButton.id.includes('medium')) return 'medium';
  if (editPopupActiveButton.id.includes('low')) return 'low';
  return '';
}

/**
 * Submits the edited task and saves the changes.
 */
async function submitEditTask() {
  if (!validateEditInputs()) return;
  const task = await loadData(`tasks/${editPopupTaskKey}`);
  if (!task) return;
  applyEditedTaskData(task);
  task.subtasks = checkSubtasks();
  task.assigned_to = checkAssignedTo();
  await updateData(`tasks/${editPopupTaskKey}`, task);
  closeEditPopup();
  const updatedTask = await loadData(`tasks/${editPopupTaskKey}`);
  if (updatedTask) {
    updateCardInBoard(editPopupTaskKey, updatedTask);
  }
}

/**
 * Applies the edited form data to the task object.
 *
 * @param {Object} task - The task object to update.
 */
function applyEditedTaskData(task) {
  task.title = document.getElementById('edit_title').value.trim();
  task.description = document.getElementById('edit_description').value.trim();
  task.due_date = document.getElementById('edit_due_date').value.trim();
  task.priority = getEditPriority();
  task.subtasks = checkSubtasks();
  task.assigned_to = checkAssignedTo();
}

/**
 * Checks the subtasks entered in the edit popup and returns an array.
 *
 * @returns {Array<Object>} An array of subtask objects.
 */
function checkSubtasks() {
  const elements = document.querySelectorAll('#edit_subtask_enum .subtask-text');
  let subtasks = [];
  elements.forEach(el => {
    const text = el.textContent.replace('• ', '').trim();
    const index = el.getAttribute('data-index');
    const isCompleted = editPopupSubtasks[index]?.completed || false;
    if (text) {
      subtasks.push({
        title: text,
        completed: isCompleted
      });
    }
  });
  return subtasks;
}

/**
 * Checks the assigned contacts in the edit popup and returns an array.
 *
 * @returns {Array<Object>} An array of contact objects.
 */
function checkAssignedTo() {
  return Array.isArray(selectedEditContacts)
    ? selectedEditContacts.map(c => ({
        initials: c.initials,
        randomColor: c.randomColor || c.contactColor || '#ccc'
      }))
    : [];
}

/**
 * Validates all input fields in the edit popup (e.g., title and due date).
 *
 * @returns {boolean} True if all fields are valid; otherwise, false.
 */
function validateEditInputs() {
  const isTitleValid = validateEditInputTitle();
  const isDateValid = validateEditInputDate();
  return isTitleValid && isDateValid;
}

/**
 * Validates the title in the edit popup.
 *
 * @returns {boolean} True if the title is not empty.
 */
function validateEditInputTitle() {
  const titleInput = document.getElementById('edit_title');
  const errorMessage = document.getElementById('error_message_edit_title') || document.getElementById('error_message_title');
  if (titleInput.value.trim() === '') {
    displayError(titleInput, errorMessage, "This field is required.");
    return false;
  }
  clearError(titleInput, errorMessage);
  return true;
}

/**
 * Validates the due date in the edit popup.
 *
 * @returns {boolean} True if a date is entered and it is not in the past.
 */
function validateEditInputDate() {
  const dateInput = document.getElementById('edit_due_date');
  const errorMessage = document.getElementById('error_message_edit_date') || document.getElementById('error_message_date');
  const inputValue = dateInput.value.trim();
  const today = getTodayNormalized();
  if (inputValue === '') {
    displayError(dateInput, errorMessage, "This field is required.");
    return false;
  }
  const selectedDate = getNormalizedDate(inputValue);
  if (selectedDate < today) {
    displayError(dateInput, errorMessage, "Date cannot be in the past.");
    return false;
  }
  clearError(dateInput, errorMessage);
  return true;
}

/**
 * Selects a category in the edit popup and updates the display.
 *
 * @param {string} value - The selected category name.
 */
function selectEditOption(value) {
  document.getElementById('edit_selected_option').textContent = value;
  document.getElementById('edit_options_container').classList.add('d-none');
}

/**
 * Cancels the task editing process and closes the edit popup.
 */
function cancelEditTask() {
  closeEditPopup();
}

/**
 * Closes the edit popup and hides the overlay.
 */
function closeEditPopup() {
  document.getElementById('edit_popup').style.display = 'none';
  document.getElementById('popup_container').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
}

/**
 * Updates the task card on the board by removing the old card and creating a new one.
 *
 * @param {string} taskKey - The key of the task.
 * @param {Object} task - The task object.
 */
async function updateCardInBoard(taskKey, task) {
  const container = document.getElementById(task.state);
  const oldCard = document.getElementById(taskKey);
  if (oldCard) oldCard.remove();
  createCard(taskKey, container, task);
}

/**
 * Updates the popup content with the task details.
 *
 * @param {string} taskKey - The key of the task.
 * @param {Object} task - The task object.
 */
function updatePopup(taskKey, task) {
  const assignedHTML = getAssignedHTML(task);
  const subtasksHTML = getSubtasksHTML(task);
  const categoryBackground = getCategoryBg(task);
  const priorityIconSrc = getPriorityIcon(task.priority);
  const popup = document.getElementById('popup');
  popup.innerHTML = getPopupContentHtml(task, taskKey, assignedHTML, subtasksHTML, categoryBackground, priorityIconSrc);
  document.getElementById('popup_container').style.display = 'flex';
  document.getElementById('overlay').style.display = 'block';
}
