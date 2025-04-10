let editPopupSubtasks = [];
let editPopupActiveButton = null;
let editPopupTaskKey = null;
let editPopupCurrentSubtaskIndex = null;
let editSelectedContact = [];

/**
 * Loads the task data from Firebase and opens the edit popup.
 * Displays a preview of the task and fills the form fields for editing.
 *
 * @param {string} key - The ID of the task to edit.
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
 * Renders the task preview section in the edit popup with details from the given task.
 * This includes category, title, description, due date, priority, assigned contacts, and subtasks.
 *
 * @param {Object} task - The task object containing all relevant data for rendering.
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
 * Loads the provided task data into the edit form fields.
 * Sets title, description, due date, priority, category, subtasks, and assigned contacts.
 *
 * @param {Object} task - The task object containing data to populate the edit form.
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
  selectedEditContacts = Array.isArray(task.assigned_to) ? [...task.assigned_to] : [];
  renderEditSelectedContacts();
}

/**
 * Loads a task from the database using its key and populates the edit form.
 * Also displays the visual preview and opens the edit popup.
 *
 * @param {string} key - The unique identifier of the task to edit.
 */
async function loadEditForm(key) {
  const task = await loadData(`tasks/${key}`);
  if (!task) return;
  renderEditPreview(task);
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
  selectedEditContacts = Array.isArray(task.assigned_to) ? [...task.assigned_to] : [];
  renderEditSelectedContacts();
  document.getElementById('edit_popup').style.display = 'flex';
}

/**
 * Sets the priority button as active in the edit popup.
 * If another priority button was already active, it resets it first.
 *
 * @param {string} buttonId - The ID of the priority button to activate.
 */
function setEditPriority(buttonId) {
  const button = document.getElementById(buttonId);
  if (!button) return;
  if (editPopupActiveButton) resetEditPriorityButton();
  if (editPopupActiveButton !== button) activateEditPriorityButton(button);
}

/**
 * Resets the currently active priority button by removing all styling classes
 * and reverting its icon to the default state.
 */
function resetEditPriorityButton() {
  editPopupActiveButton.classList.remove('active-prio', 'red-prio', 'orange-prio', 'green-prio');
  const img = document.getElementById(editPopupActiveButton.id.replace('button', 'img'));
  if (img) img.src = img.src.replace('-event', '');
  editPopupActiveButton = null;
}

/**
 * Sets the given button as the active priority button.
 * Adds the active styling and applies the corresponding visual style based on its type.
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
 * Applies the corresponding CSS class and icon to the active priority button 
 * based on the selected priority type (urgent, medium, low).
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
 * Returns the currently selected priority based on the active priority button.
 *
 * @returns {string} The selected priority ('urgent', 'medium', 'low'), or an empty string if none is selected.
 */
function getEditPriority() {
  if (!editPopupActiveButton) return '';
  if (editPopupActiveButton.id.includes('urgent')) return 'urgent';
  if (editPopupActiveButton.id.includes('medium')) return 'medium';
  if (editPopupActiveButton.id.includes('low')) return 'low';
  return '';
}

/**
 * Handles the submission of the edited task.
 * Validates input, updates the task data in the database, closes the edit popup,
 * and updates both the board card and popup with the latest task information.
 */
async function submitEditTask() {
  if (!validateEditInputs()) return;
  const task = await loadData(`tasks/${editPopupTaskKey}`);
  if (!task) return;

  applyEditedTaskData(task);
  task.subtasks = JSON.stringify(task.subtasks);
  task.assigned_to = JSON.stringify(task.assigned_to); 
  
  await updateData(`tasks/${editPopupTaskKey}`, task);
  closeEditPopup();
  const updatedTask = await loadData(`tasks/${editPopupTaskKey}`);
  if (updatedTask) {
    updateCardInBoard(editPopupTaskKey, updatedTask);
    updatePopup(editPopupTaskKey, updatedTask); 
  }
}

/**
 * Applies the edited form data to the given task object.
 * Extracts values from the edit form inputs and updates the task accordingly.
 *
 * @param {Object} task - The task object to be updated with new values.
 */
function applyEditedTaskData(task) {
  task.title = document.getElementById('edit_title').value.trim();
  task.description = document.getElementById('edit_description').value.trim();
  task.due_date = document.getElementById('edit_due_date').value.trim();
  task.category = document.getElementById('edit_selected_option').textContent.trim();
  task.priority = getEditPriority();
  task.subtasks = checkSubtasks(); // Subtasks hier richtig anwenden
  task.assigned_to = checkAssignedTo(); // Kontakte hier richtig anwenden
}

/**
 * Checks all subtasks from the edit form and returns an array of subtasks.
 * The subtasks are parsed from the `.subtask-text` elements within the edit form.
 * Each subtask is added with a `title` and a default `completed` status of `false`.
 *
 * @returns {Array} An array of subtask objects, each containing a `title` and `completed` status.
 */
function checkSubtasks() {
  const elements = document.querySelectorAll('#edit_subtask_enum .subtask-text');
  let subtasks = [];
  elements.forEach(el => {
    const text = el.textContent.replace('• ', '').trim();
    if (text) {
      subtasks.push({ title: text, completed: false });  // Subtasks als Objekte speichern
    }
  });
  return subtasks;
}

/**
 * Collects all selected contacts in the edit form and returns an array of contact objects.
 * Each contact object contains the `initials` of the contact and their `randomColor` (used for styling).
 *
 * @returns {Array} An array of contact objects, each containing the `initials` and `randomColor` of the contact.
 */
function checkAssignedTo() {
  const container = document.getElementById('edit_selected_contact_circles');
  const circles = container.querySelectorAll('.circle');
  const contacts = Array.from(circles).map(circle => ({
    initials: circle.textContent.trim(),
    randomColor: circle.style.backgroundColor
  }));
  return contacts;
}

/**
 * Validates the input fields in the edit form to ensure that the required fields are filled out.
 * Displays error messages if any field is missing or invalid.
 *
 * @returns {boolean} Returns true if all required fields are valid, false otherwise.
 */
function validateEditInputs() {
  const title = document.getElementById('edit_title').value.trim();
  const due_date = document.getElementById('edit_due_date').value.trim();
  const category = document.getElementById('edit_selected_option').textContent.trim();
  if (!title) {
    document.getElementById('edit_error_title').classList.remove('d-none');
    return false;
  }
  if (!due_date) {
    document.getElementById('edit_error_date').classList.remove('d-none');
    return false;
  }
  if (category === 'Select task category') {
    document.getElementById('edit_error_category').classList.remove('d-none');
    return false;
  }
  return true;
}

/**
 * Selects an option from the edit category dropdown and updates the displayed category.
 * Hides the dropdown options container after selection.
 *
 * @param {string} value - The selected category value to be displayed.
 */
function selectEditOption(value) {
  document.getElementById('edit_selected_option').textContent = value;
  document.getElementById('edit_options_container').classList.add('d-none');
}

/**
 * Toggles the visibility of the category dropdown in the edit popup.
 * Changes the arrow icon based on whether the dropdown is open or closed.
 */
function toggleEditCategoryDropdown() {
  const options = document.getElementById('edit_options_container');
  const arrow = document.getElementById('edit_select_arrow');
  if (options.classList.contains('d-none')) {
    options.classList.remove('d-none');
    arrow.src = 'assets/icons/arrow_drop_down_up.svg';
  } else {
    options.classList.add('d-none');
    arrow.src = 'assets/icons/arrow_drop_down.svg';
  }
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
  document.getElementById('overlay').style.display = 'none';
}

/**
 * Updates the task card in the board by removing the old card and creating a new one.
 *
 * @param {string} taskKey - The key of the task to be updated.
 * @param {Object} task - The updated task object.
 */
async function updateCardInBoard(taskKey, task) {
  const container = document.getElementById(task.state);
  const oldCard = document.getElementById(taskKey);
  if (oldCard) oldCard.remove();
  createCard(taskKey, container, task);
}

/**
 * Updates the task popup with the provided task details.
 * 
 * @param {string} taskKey - The key of the task to be updated in the popup.
 * @param {Object} task - The task object containing the updated details.
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