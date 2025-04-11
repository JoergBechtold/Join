let taskKey;

/**
 * Generates the HTML for the assigned contacts of a task.
 * Loads all contacts from the database and matches them with the task's assigned users.
 *
 * @param {Object} task - The task object containing assigned user data.
 * @returns {Promise<string>} The generated HTML string for displaying assigned contacts.
 */
async function getAssignedHTML(task) {
  const allContacts = await loadData('contacts');
  if (!allContacts) return '<span>No contacts found</span>';
  return generateAssignedHTML(task.assigned_to, allContacts);
}

/**
 * Generates the HTML for displaying the subtasks of a given task.
 * Delegates the actual HTML generation to the helper function `generateSubtasksHTML`.
 *
 * @param {Object} task - The task object containing subtasks.
 * @returns {string} The generated HTML string for the subtasks section.
 */
function getSubtasksHTML(task) {
  return generateSubtasksHTML(task.subtasks);
}

/**
 * Toggles the checkbox state of a subtask element, updates its completion state,
 * saves the changes to Firebase, and refreshes the UI including progress and task card.
 *
 * @param {HTMLElement} element - The clicked subtask DOM element.
 */
async function toggleSubtaskCheckbox(element) {
  const checkboxImg = element.querySelector('.subtask-checkbox-img');
  const subtaskTitle = element.querySelector('span')?.textContent;
  const isChecked = checkboxImg.src.includes('checkbox-checked.svg');
  checkboxImg.src = isChecked 
    ? 'assets/icons/checkbox-empty.svg' 
    : 'assets/icons/checkbox-checked.svg';
  const task = await loadData(`tasks/${taskKey}`);
  if (!task || !Array.isArray(task.subtasks)) return;
  const subtask = task.subtasks.find(st => st.title === subtaskTitle);
  if (subtask) {
    subtask.completed = !isChecked;
    await updateData(`tasks/${taskKey}`, task);
    updateProgress(taskKey, task);
    updateCardInBoard(taskKey, task);
  }
}

/**
 * Updates the visual progress bar and label for a task's subtasks.
 * Calculates the percentage of completed subtasks and reflects it in the UI.
 *
 * @param {string} taskId - The unique ID of the task.
 * @param {Object} task - The task object containing the subtasks array.
 */
function updateProgress(taskId, task) {
  const subtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
  const total = subtasks.length;
  const completed = subtasks.filter(st => st.completed).length;
  const progressPercent = total > 0 ? (completed / total) * 100 : 0;
  const bar = document.getElementById(`${taskId}-progress-bar`);
  if (bar) {
    bar.style.width = `${progressPercent}%`;
  }
  const label = document.getElementById(`${taskId}-progress-label`);
  if (label) {
    label.textContent = `${completed}/${total} Subtasks`;
  }
}

/**
 * Toggles the completion state of a specific subtask in the UI and sessionStorage.
 *
 * @param {HTMLElement} element - The DOM element representing the subtask.
 * @param {string} taskId - The ID of the task to which the subtask belongs.
 */
function toggleSubtask(element, taskId) {
  let index = element.getAttribute('data-index');
  let tasks = JSON.parse(sessionStorage.getItem('tasks'));
  let task = tasks[taskId];
  if (!task || !task.subtasks || !task.subtasks[index]) return;
  task.subtasks[index].completed = !task.subtasks[index].completed;
  sessionStorage.setItem('tasks', JSON.stringify(tasks));
  let checkbox = element.querySelector('.subtask-checkbox');
  if (checkbox) {
    checkbox.classList.toggle('checked', task.subtasks[index].completed);
  }
}

/**
 * Returns the background color style based on the task's category.
 *
 * @param {Object} task - The task object containing the category.
 * @returns {string} - The CSS background-color string or an empty string if no match.
 */
function getCategoryBg(task) {
  if (task.category === 'User Story') return 'background-color: #0038FF;';
  if (task.category === 'Technical Task') return 'background-color: #1FD7C1;';
  return '';
}

/**
 * Opens the task details popup for a given task key.
 * Loads the task data from Firebase and renders the popup content.
 *
 * @param {string} key - The key of the task to display in the popup.
 */
async function openPopup(key) {
  taskKey = key;
  const task = await loadData(`${PATH_TO_TASKS}/${key}`);
  const popupContainer = document.getElementById('popup_container');
  const popup = document.getElementById('popup');
  if (task) {
    const assignedHTML = await getAssignedHTML(task);
    const subtasksHTML = getSubtasksHTML(task);
    const categoryBackground = getCategoryBg(task);
    const priorityIconSrc = getPriorityIcon(task.priority);
    const popupContent = getPopupContentHtml(task, key, assignedHTML, subtasksHTML, categoryBackground, priorityIconSrc);
    popup.innerHTML = popupContent;
  } else {
    popup.innerHTML = `
      <div class="popup-header">
        <h2>Task Not Found</h2>
        <button class="close-button" onclick="closePopup()">X</button>
      </div>
    `;
  }
  popupContainer.style.display = 'flex';
  document.getElementById('overlay').style.display = 'block';
}

/**
 * Returns the file path of the corresponding priority icon based on the task's priority level.
 *
 * @param {string} priority - The priority level ('low', 'medium', 'urgent').
 * @returns {string} The path to the appropriate priority icon, or an empty string if invalid.
 */
function getPriorityIcon(priority) {
  if (!priority) return '';
  priority = priority.toLowerCase();
  if (priority === 'low') {
    return 'assets/icons/prio-low.svg';
  } else if (priority === 'medium') {
    return 'assets/icons/prio-medium.svg';
  } else if (priority === 'urgent') {
    return 'assets/icons/prio-high.svg';
  }
  return '';
}

/**
 * Generates the full HTML content for the board task popup by delegating to a template generator function.
 *
 * @param {Object} task - The task object containing all task details.
 * @param {string} taskKey - The unique key identifying the task.
 * @param {string} assignedHTML - The HTML representing the assigned contacts.
 * @param {string} subtasksHTML - The HTML representing the task's subtasks.
 * @param {string} categoryBg - The CSS background style for the task category.
 * @param {string} priorityIconSrc - The path to the priority icon image.
 * @returns {string} The complete HTML markup for the task popup.
 */
function getPopupContentHtml(task, taskKey, assignedHTML, subtasksHTML, categoryBg, priorityIconSrc) {
  return generateBoardPopupHTML(task, taskKey, assignedHTML, subtasksHTML, categoryBg, priorityIconSrc);
}

/**
 * Opens the edit popup and fills the form with data from the selected task.
 *
 * @param {string} key - The unique identifier of the task to be edited.
 */
async function editPopupTask(key) {
  const popupContainer = document.getElementById('popup_container');
  popupContainer.style.display = 'none';
  const editPopup = document.getElementById('edit_popup');
  editPopup.style.display = 'flex';
  const task = await loadData(`tasks/${key}`);
  if (!task) return;
  document.getElementById('edit_title').value = task.title || '';
  document.getElementById('edit_description').value = task.description || '';
  document.getElementById('edit_due_date').value = task.due_date || '';
  if (task.priority) {
    const priorityId = `edit_${task.priority.toLowerCase()}_button`;
    setEditPriority(priorityId);
  }
  editPopupSelectedContacts = Array.isArray(task.assigned_to) ? [...task.assigned_to] : [];
  renderSelectedEditContacts();
  editPopupSubtasks = Array.isArray(task.subtasks) ? [...task.subtasks] : [];
  renderEditSubtasks();
  editPopupTaskKey = key;
  document.getElementById('overlay').style.display = 'block';
}

/**
 * Returns an HTML <img> element as a string for the given priority icon.
 * If no icon source is provided, returns an empty image element.
 *
 * @param {string} priorityIconSrc - The source URL of the priority icon.
 * @param {string} priority - The priority level (e.g., "low", "medium", "urgent").
 * @returns {string} - The HTML string for the priority icon image element.
 */
function checkImgAvailable(priorityIconSrc, priority) {
  if (priorityIconSrc) {
    return `<img id="priority-icon" src="${priorityIconSrc}" alt="${priority || 'No Priority'}" />`;
  } else {
    return `<img id="priority-icon" src="" alt="" />`;
  }
}

/**
 * Opens the edit popup for a task.
 * Hides the task detail popup if open and shows the edit popup.
 * If the edit popup does not exist yet in the DOM, it is created dynamically.
 */
function editTask() {
  const popupContainer = document.getElementById('popup_container');
  if (popupContainer) {
    popupContainer.style.display = 'none';
  }
  let editPopup = document.getElementById('edit_popup');
  if (!editPopup) {
    editPopup = document.createElement('div');
    editPopup.id = 'edit_popup';
    document.body.appendChild(editPopup);
  }
  editPopup.style.display = 'flex';
}

/**
 * Deletes a task from Firebase and updates the UI accordingly.
 * Prompts the user for confirmation before proceeding with deletion.
 *
 * @param {string} taskKey - The unique key of the task to be deleted.
 */
async function deleteTaskFromBoardPopup(taskKey) {
  if (!taskKey) {
    console.error('No task key provided.');
    return false;
  }
  const confirmed = await showConfirmDialog('Do you really want to delete this task?');
  if (!confirmed) return false;
  try {
    await deleteData(`tasks/`, `${taskKey}`);
    closePopup();
    await renderCards();
    return true;
  } catch (err) {
    console.error('Task deletion failed:', err);
    return false;
  }
}

/**
 * Displays a confirmation dialog with a custom message and returns the user's response.
 *
 * @param {string} message - The message to display in the confirmation dialog.
 * @returns {Promise<boolean>} A promise that resolves to true if the user confirms, false otherwise.
 */
async function showConfirmDialog(message) {
  return new Promise(resolve => {
    const confirmed = confirm(message);
    resolve(confirmed);
  });
}

/**
 * Closes all popup elements on the board view.
 * Hides the task detail popup, edit popup, and the overlay.
 */
function closePopup(action = null) {
  const popupContainer = document.getElementById('popup_container');
  const editPopup = document.getElementById('edit_popup');
  const overlay = document.getElementById('overlay');

  if (action === 'cancelPopup') {
    if (popupContainer) popupContainer.style.display = 'none';
    if (editPopup) editPopup.style.display = 'none';
  } else {
    if (popupContainer?.style.display === 'flex') popupContainer.style.display = 'none';
    if (editPopup?.style.display === 'flex') editPopup.style.display = 'none';
  }
  if (overlay) overlay.style.display = 'none';
}