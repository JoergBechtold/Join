const PATH_TO_CONTACTS = 'contacts';
const PATH_TO_TASKS = 'tasks';

let currentDraggedElement = null;
let allContacts = {};

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
 * Handles the start of a drag operation on a task card.
 * Stores the ID of the dragged element and visually tilts the card.
 *
 * @param {DragEvent} event - The dragstart event triggered on the card.
 */
function startDragging(event) {
  currentDraggedElement = event.target.id;
  event.target.classList.add('tilted');
}

/**
 * Handles the end of a drag operation on a task card.
 * Removes the visual "tilted" effect from the dragged card.
 *
 * @param {DragEvent} event - The dragend event triggered on the card.
 */
function endDragging(event) {
  if (currentDraggedElement) {
    let draggedElement = document.getElementById(currentDraggedElement);
    if (draggedElement) {
      draggedElement.classList.remove('tilted');
    }
  }
}

/**
 * Enables dropping of dragged elements in valid drop zones
 * and adds a visual highlight to the target column.
 *
 * @param {DragEvent} event - The dragover event from the dragged element.
 */
function allowDrop(event) {
  event.preventDefault();
  const dropColumn = event.target.closest('.drag-area');
  if (dropColumn) dropColumn.classList.add('highlight-border');
}

/**
 * Adds a visual highlight to the specified drag area column.
 *
 * @param {string} columnId - The ID of the column element to highlight.
 */
function highlight(columnId) {
  const column = document.getElementById(columnId);
  if (column) column.classList.add('drag-area-highlight');
}

/**
 * Removes the visual highlight from the specified drag area column.
 *
 * @param {string} columnId - The ID of the column element to remove the highlight from.
 */
function removeHighlight(columnId) {
  const column = document.getElementById(columnId);
  if (column) column.classList.remove('drag-area-highlight');
}

/**
 * Moves the currently dragged task to a new state (column) and updates Firebase and the board view.
 *
 * @param {string} state - The new state (e.g., 'open', 'in-progress', etc.) to assign to the dragged task.
 */
async function moveTo(state) {
  const task = await loadData(`${PATH_TO_TASKS}/${currentDraggedElement}`);
  if (!task) return;

  task.state = state;
  await updateData(`${PATH_TO_TASKS}/${currentDraggedElement}`, task);
  await renderCards();
  updateEmptyColumns();
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
 * Creates and appends a progress bar and label showing the completion status
 * of subtasks within a task card.
 *
 * @param {string} key - The unique identifier of the task card.
 * @param {Object} task - The task object containing subtasks.
 */
function createProgressBar(key, task) {
  const progressContainer = document.getElementById(key + '-progress');
  const progressBar = document.createElement('div');
  progressBar.className = 'progress-bar';
  progressBar.style.width = '0%'; 

  const subtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
  const completed = subtasks.filter(st => st.completed).length;
  const percent = subtasks.length > 0 ? (completed / subtasks.length) * 100 : 0;

  setTimeout(() => {
    progressBar.style.width = `${percent}%`;
  }, 10); 
  progressContainer.appendChild(progressBar);

  const label = document.createElement('span');
  label.id = key + '-progress-label';
  label.className = 'subtask-counter';
  label.textContent = `${completed}/${subtasks.length} Subtasks`;
  progressContainer.appendChild(label);
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
 * Renders up to four assigned contact initials inside the task card.
 * If more than four contacts are assigned, displays a "+X" badge.
 *
 * @param {string} key - The unique identifier of the task card.
 * @param {Object} task - The task object containing assigned contacts.
 */
function createAssignedContacts(key, task) {
  const assignedContainer = document.getElementById(key + '-assigned-contacts');
  assignedContainer.innerHTML = '';

  const assignedContacts = Array.isArray(task.assigned_to) ? task.assigned_to : [];
  assignedContacts.slice(0, 4).forEach((contact) => {
    const span = document.createElement('span');
    span.className = 'initials-span';
    span.textContent = contact.initials;
    span.style.backgroundColor = contact.randomColor;
    assignedContainer.appendChild(span);
  });

  if (assignedContacts.length > 4) {
    const extra = document.createElement('span');
    extra.className = 'extra-contacts-span';
    extra.textContent = `+${assignedContacts.length - 4}`;
    assignedContainer.appendChild(extra);
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
 * Builds a complete task card and appends it to the given container.
 * It includes category, title, description, subtasks (with progress), assigned contacts, and priority.
 *
 * @param {string} key - The unique identifier of the task.
 * @param {HTMLElement} container - The DOM element where the card should be appended.
 * @param {Object} task - The task object containing all relevant data.
 */
function createCard(key, container, task) {
  createCardContainer(key, container);
  createUnderContainer(key);
  createCategoryTag(key, task);
  createTagSpan(key, task);
  createTitle(key, task);
  createDescription(key, task);
  createSubtaskContainer(key);

  if (Array.isArray(task.subtasks) && task.subtasks.length > 0) {
    createProgressContainer(key);
    createProgressBar(key, task);
    createSubtaskCounter(key, task);
  }

  createContactsAndPrioContainer(key);
  createAssignedContactsContainer(key);
  createAssignedContacts(key, task);
  createPrioContainer(key);
  createPrio(key, task);
}

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
 * Fetches all tasks from the database and renders them into their respective columns on the board.
 * Clears previous cards before re-rendering. Also updates the empty column placeholders.
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
}

async function renderCards() {
  const tasks = await loadData(PATH_TO_TASKS);
  const allColumns = document.querySelectorAll('.drag-area');
  
  allColumns.forEach(col => col.innerHTML = ''); // Alle vorherigen Karten löschen

  for (const [key, task] of Object.entries(tasks)) {
    const column = document.getElementById(task.state);
    if (column) {
      createCard(key, column, task);  // Neue Karten erstellen
    }
  }

  updateEmptyColumns();  // Sicherstellen, dass die Platzhalter für leere Spalten aktualisiert werden
}


/**
 * Checks each column on the board and updates its state based on whether tasks exist.
 * If a column is empty, it appends a placeholder message.
 * If a task is present, it ensures the placeholder is removed.
 */
function updateEmptyColumns() {
  const columns = document.querySelectorAll('.drag-area');
  columns.forEach((column) => {
    const hasTasks = column.querySelector('.todo-card');
    let placeholder = column.querySelector('.empty-task-container');

    if (!hasTasks && !placeholder) {
      placeholder = document.createElement('div');
      placeholder.className = 'empty-task-container';
      const span = document.createElement('span');
      span.classList.add('no-task');
      span.textContent = 'No Tasks to do';
      placeholder.appendChild(span);
      column.appendChild(placeholder);
    } else if (hasTasks && placeholder) {
      placeholder.remove();
    }
  });
}

/**
 * Searches and filters tasks by the entered keyword (min. 3 characters).
 * If less than 3 characters are entered, all tasks are rendered.
 * Otherwise, only matching tasks are displayed in their respective columns.
 */
async function searchCards() {
  const searchQuery = document.getElementById('find_cards').value.toLowerCase();
  if (searchQuery.length < 3) {
    renderCards();
    return;
  }

  const tasks = await loadData(PATH_TO_TASKS);
  const allColumns = document.querySelectorAll('.drag-area');
  allColumns.forEach((column) => (column.innerHTML = ''));

  Object.entries(tasks).forEach(([key, task]) => {
    if (task.title.toLowerCase().includes(searchQuery)) {
      const column = document.getElementById(task.state);
      if (column) createCard(key, column, task);
    }
  });
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

/**
 * Closes a modal form by its ID and hides the overlay.
 * Also removes the 'modal-open' class from the body.
 *
 * @param {string} formId - The ID of the form/modal to be closed.
 */
function closeForm(formId) {
  document.getElementById(formId).classList.remove('show');
  const overlay = document.getElementById('overlay');
  overlay.style.display = 'none';
  document.body.classList.remove('modal-open');
}

/**
 * Opens the 'Add Task' form on the board by cloning the template
 * and displaying the modal with the provided form.
 */
function openBoardAddTaskForm() {
  const boardAddTaskContainer = document.getElementById('board_add_task');
  boardAddTaskContainer.innerHTML = '';

  const template = document.getElementById('addTaskTemplate');
  const clone = template.content.cloneNode(true);
  boardAddTaskContainer.appendChild(clone);

  openForm('board_add_task');
}

/**
 * Closes the 'Add Task' form modal on the board.
 * Calls the generic closeForm function with the form ID.
 */
function closeBoardAddTask() {
  closeForm('board_add_task');
}