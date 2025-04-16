const PATH_TO_CONTACTS = 'contacts';
const PATH_TO_TASKS = 'tasks';

let currentDraggedElement = null;
let allContacts = {};
let currentTaskTargetState = 'open';

/**
 * Initializes the board view by performing necessary data loading.
 * Loads logged-in user links, fetches all contacts from Firebase, 
 * and renders all task cards to the board.
 */
async function initBoard() {
  await showLoggedInLinks();
  allContacts = await loadData(PATH_TO_CONTACTS);
  await renderCards();
}

/**
 * Opens the board task form popup and sets the default target column for the new task.
 * @param {string} state - The target state for the new task ('open', 'in-progress', etc.)
 */
function openBoardAddTaskWithState(state) {
  currentTaskTargetState = state;
  openBoardAddTaskForm();
  fetchAddTask();
}

/**
 * Pushes a new task to Firebase from the board popup using the current target state.
 * @returns {Promise<void>}
 */
async function pushBoardTaskToFirebase() {
  const taskData = createBoardTaskData();
  try {
    const response = await postData('tasks', taskData);
    if (response) {
      showPupupOverlayTaskAdded();
      await updateAssignedContactsOnBoard();
      closeBoardAddTask();
    } else {
      throw new Error('No response from Firebase');
    }
  } catch (error) {
    console.error('Error while saving board task:', error);
  }
}

/**
 * Creates a task data object for the board popup based on form inputs.
 * @returns {Object} Task data including title, description, due_date, priority, assigned_to, category, subtasks, and state.
 */
function createBoardTaskData() {
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
    state: currentTaskTargetState,
  };
}

/**
 * Opens the add task popup from the main board button and resets target state to 'open'.
 */
function openBoardAddTaskDefault() {
  currentTaskTargetState = 'open';
  openBoardAddTaskForm();
  fetchAddTask();
}

/**
 * Creates a draggable task card container and appends it to the specified column.
 *
 * @param {string} key - The unique identifier for the task.
 * @param {HTMLElement} container - The column (drag-area) where the task card will be placed.
 */
function createCardContainer(key, container) {
  const cardDiv = document.createElement('div');
  cardDiv.id = key;
  cardDiv.className = 'todo-card';
  cardDiv.draggable = true;
  cardDiv.ondragstart = startDragging;
  cardDiv.ondragend = endDragging;
  cardDiv.setAttribute('onclick', `openPopup('${key}')`);
  container.appendChild(cardDiv);
}

/**
 * Creates and appends the inner container for a task card.
 * This container holds all content inside the card (title, category, description, etc.).
 *
 * @param {string} key - The unique identifier for the task card.
 */
function createUnderContainer(key) {
  const cardDiv = document.getElementById(key);
  const underDiv = document.createElement('div');
  underDiv.id = key + '-under-container';
  underDiv.className = 'under-container';
  cardDiv.appendChild(underDiv);
}

/**
 * Creates and appends a category tag container inside the task card.
 * The container is styled differently depending on the task category.
 *
 * @param {string} key - The unique identifier for the task card.
 * @param {Object} task - The task object containing category information.
 */
function createCategoryTag(key, task) {
  const underDiv = document.getElementById(key + '-under-container');
  const tagContainer = document.createElement('div');
  tagContainer.id = key + '-tag-container';
  tagContainer.className = task.category === 'Technical Task'
    ? 'technical-cards-headline-container'
    : 'user-cards-headline-container';
  underDiv.appendChild(tagContainer);
}

/**
 * Creates and appends a span element containing the task category label
 * inside the tag container of the task card.
 *
 * @param {string} key - The unique identifier of the task card.
 * @param {Object} task - The task object containing the category text.
 */
function createTagSpan(key, task) {
  const tagContainer = document.getElementById(key + '-tag-container');
  const tagSpan = document.createElement('span');
  tagSpan.className = 'cards-headline';
  tagSpan.textContent = task.category;
  tagContainer.appendChild(tagSpan);
}

/**
 * Creates and appends a title element (h1) to the task card.
 *
 * @param {string} key - The unique identifier of the task card.
 * @param {Object} task - The task object containing the title text.
 */
function createTitle(key, task) {
  const underDiv = document.getElementById(key + '-under-container');
  const titleTag = document.createElement('h1');
  titleTag.className = 'cards-title';
  titleTag.textContent = task.title;
  underDiv.appendChild(titleTag);
}

/**
 * Creates and appends a description element to the task card.
 *
 * @param {string} key - The unique identifier of the task card.
 * @param {Object} task - The task object containing the description text.
 */
function createDescription(key, task) {
  const underDiv = document.getElementById(key + '-under-container');
  const descriptionTag = document.createElement('span');
  descriptionTag.className = 'cards-description';
  descriptionTag.textContent = task.description;
  underDiv.appendChild(descriptionTag);
}

/**
 * Creates a container element for subtasks within the task card
 * and appends it to the card's content area.
 *
 * @param {string} key - The unique identifier of the task card.
 */
function createSubtaskContainer(key) {
  const underDiv = document.getElementById(key + '-under-container');
  const subtaskContainer = document.createElement('div');
  subtaskContainer.id = key + '-subtask';
  subtaskContainer.className = 'card-subtask-container';
  underDiv.appendChild(subtaskContainer);
}

/**
 * Creates and appends a counter element that shows the number of completed subtasks
 * relative to the total number of subtasks for a given task card.
 *
 * @param {string} key - The unique identifier of the task card.
 * @param {Object} task - The task object containing subtasks.
 */
function createSubtaskCounter(key, task) {
  const subtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
  const completed = subtasks.filter(st => st.completed).length;
  const subtaskContainer = document.getElementById(key + '-subtask');
  const subtasksCounter = document.createElement('span');
  subtasksCounter.id = key + '-subtask-counter';
  subtasksCounter.textContent = `${completed}/${subtasks.length} Subtasks`;
  subtaskContainer.appendChild(subtasksCounter);
}

/**
 * Creates and appends a container element for the progress bar
 * within the subtask section of a task card.
 *
 * @param {string} key - The unique identifier of the task card.
 */
function createProgressContainer(key) {
  const subtaskContainer = document.getElementById(key + '-subtask');
  const progressContainer = document.createElement('div');
  progressContainer.id = key + '-progress';
  progressContainer.className = 'progress-container';
  subtaskContainer.appendChild(progressContainer);
}

/**
 * Creates and appends a progress bar and corresponding label to a task card.
 * Delegates rendering of the visual bar and the completion label.
 *
 * @param {string} key - The unique identifier of the task card.
 * @param {Object} task - The task object containing subtasks.
 */
function createProgressBar(key, task) {
  const progressContainer = document.getElementById(key + '-progress');
  const subtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
  const completed = subtasks.filter(st => st.completed).length;
  const percent = subtasks.length > 0 ? (completed / subtasks.length) * 100 : 0;
  renderProgressVisualBar(progressContainer, percent, false);
  renderProgressLabel(progressContainer, key, completed, subtasks.length);
}

/**
 * Creates a container for assigned contacts and priority information
 * and appends it to the task card.
 *
 * @param {string} key - The unique identifier of the task card.
 */
function createContactsAndPrioContainer(key) {
  const underDiv = document.getElementById(key + '-under-container');
  const container = document.createElement('div');
  container.id = key + '-contacts-prio';
  container.className = 'contacts-prio';
  underDiv.appendChild(container);
}

/**
 * Creates and appends the container for assigned contact bubbles
 * within the task card's contact and priority section.
 *
 * @param {string} key - The unique identifier of the task card.
 */
function createAssignedContactsContainer(key) {
  const container = document.getElementById(key + '-contacts-prio');
  const assigned = document.createElement('div');
  assigned.id = key + '-assigned-contacts';
  assigned.className = 'assigned-contacts-container';
  container.appendChild(assigned);
}

/**
 * Creates and appends the assigned contact initials and extra count to the given container.
 *
 * @param {string} key - The unique identifier of the task card.
 * @param {Object} task - The task object containing assigned contacts.
 */
function createAssignedContacts(key, task) {
  const assignedContainer = document.getElementById(key + '-assigned-contacts');
  assignedContainer.innerHTML = '';
  const assignedContacts = Array.isArray(task.assigned_to) ? task.assigned_to : [];
  renderAssignedInitials(assignedContacts, assignedContainer);
  renderExtraAssignedIndicator(assignedContacts, assignedContainer);
}

/**
 * Renders up to four assigned contact initials inside the container.
 *
 * @param {Array} contacts - The array of assigned contact objects.
 * @param {HTMLElement} container - The DOM element where initials should be added.
 */
function renderAssignedInitials(contacts, container) {
  contacts.slice(0, 4).forEach((contact) => {
    const span = document.createElement('span');
    span.className = 'initials-span';
    span.textContent = contact.initials;
    span.style.backgroundColor = contact.randomColor || contact.contactColor || '#ccc';
    container.appendChild(span);
  });
}

/**
 * Appends a "+X" indicator if more than four contacts are assigned.
 *
 * @param {Array} contacts - The array of assigned contact objects.
 * @param {HTMLElement} container - The DOM element where the indicator should be added.
 */
function renderExtraAssignedIndicator(contacts, container) {
  if (contacts.length > 4) {
    const extra = document.createElement('span');
    extra.className = 'extra-contacts-span';
    extra.textContent = `+${contacts.length - 4}`;
    container.appendChild(extra);
  }
}

/**
 * Creates and appends the container element for displaying the task's priority icon.
 *
 * @param {string} key - The unique identifier of the task card.
 */
function createPrioContainer(key) {
  const container = document.getElementById(key + '-contacts-prio');
  const prioContainer = document.createElement('div');
  prioContainer.className = 'prio-container';
  container.appendChild(prioContainer);
}

/**
 * Creates and appends a priority icon to the task card based on its priority level.
 *
 * @param {string} key - The unique identifier of the task card.
 * @param {Object} task - The task object containing priority information.
 */
function createPrio(key, task) {
  const container = document.getElementById(key + '-contacts-prio').querySelector('.prio-container');
  const img = document.createElement('img');
  img.className = 'prio-icon';
  const prio = task.priority?.toLowerCase();
  if (prio === 'urgent') img.src = 'assets/icons/prio-high.svg';
  else if (prio === 'medium') img.src = 'assets/icons/prio-medium.svg';
  else if (prio === 'low') img.src = 'assets/icons/prio-low.svg';
  else return;
  img.alt = `${prio} priority`;
  container.appendChild(img);
}

/**
 * Updates the board by reloading all tasks and rendering them into their respective columns.
 * Clears existing task cards and repopulates each column with up-to-date task data.
 *
 * @returns {Promise<void>} A promise that resolves when the board has been fully updated.
 */
async function updateAssignedContactsOnBoard() {
  const tasks = await loadData(PATH_TO_TASKS); 
  const allColumns = document.querySelectorAll('.drag-area');
  allColumns.forEach(col => col.innerHTML = ''); 
  for (const [key, task] of Object.entries(tasks)) {
    const column = document.getElementById(task.state);
    if (column) {
      createCard(key, column, task);
    }
  }
  updateEmptyColumns();  
}

/**
 * Handles the deletion of a contact by confirming with the user and removing it from the board and database.
 * If successful, updates the board to reflect the changes.
 *
 * @param {HTMLElement} deleteBtn - The delete button that was clicked to trigger the deletion.
 * @returns {Promise<boolean>} A promise resolving to true if the deletion was successful, otherwise false.
 */
async function processContactDeletion(deleteBtn) {
  const contactDiv = getContactDiv(deleteBtn);
  if (!contactDiv) {
    console.error('No valid contact to delete.');
    return Promise.resolve(false);
  }
  const success = await confirmAndDeleteContact(contactDiv);
  if (success) {
    await updateAssignedContactsOnBoard(); 
  }
  return success;
}

/**
 * Loads tasks and renders them into columns. 
 * Updates mobile dropdowns after rendering.
 * 
 * @returns {Promise<void>}
 */
async function renderCards() {
  const tasks = await loadData(PATH_TO_TASKS);
  const allColumns = document.querySelectorAll('.drag-area');
  allColumns.forEach(col => col.innerHTML = '');

  for (const [key, task] of Object.entries(tasks)) {
    const column = document.getElementById(task.state);
    if (column) {
      createCard(key, column, task);
    }
  }

  updateEmptyColumns();
  updateMobileDropdowns();
}

/**
 * Updates all board columns by checking for empty task containers
 * and rendering or removing placeholder messages accordingly.
 */
function updateEmptyColumns() {
  const columns = document.querySelectorAll('.drag-area');
  columns.forEach((column) => {
    const hasTasks = column.querySelector('.todo-card');
    const placeholder = column.querySelector('.empty-task-container');
    if (!hasTasks && !placeholder) {
      addEmptyColumnPlaceholder(column);
    } else if (hasTasks && placeholder) {
      placeholder.remove();
    }
  });
}

/**
 * Appends a custom "no tasks" placeholder message to the given column.
 * @param {HTMLElement} column - The drag-area column element to update.
 */
function addEmptyColumnPlaceholder(column) {
  const placeholder = document.createElement('div');
  placeholder.className = 'empty-task-container';

  const span = document.createElement('span');
  span.classList.add('no-task');
  span.textContent = getEmptyMessageForColumn(column.id);

  placeholder.appendChild(span);
  column.appendChild(placeholder);
}

/**
 * Returns the appropriate empty message based on the column ID.
 * @param {string} columnId - The ID of the column (e.g., "open", "in-progress").
 * @returns {string} The corresponding empty message text.
 */
function getEmptyMessageForColumn(columnId) {
  if (columnId === 'open') return 'No Tasks In To Do';
  if (columnId === 'in-progress') return 'No Tasks In Progress';
  if (columnId === 'await-feedback') return 'No Tasks In Await Feedback';
  if (columnId === 'done') return 'No Tasks In Done';
  return 'No Tasks';
}

/**
 * Opens a modal form by its ID and activates the overlay.
 * Adds a click event to the overlay to close the form if clicked outside the modal content.
 *
 * @param {string} formId - The ID of the form/modal to be shown.
 */
function openForm(formId) {
  const modal = document.getElementById(formId);
  modal.classList.add('show');
  const overlay = document.getElementById('overlay');
  overlay.style.display = 'flex';
  document.body.classList.add('modal-open');
  overlay.onclick = function (event) {
    if (event.target === overlay) {
      closeBoardAddTask();
    }
  };
}