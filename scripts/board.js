const PATH_TO_CONTACTS = 'contacts';
const PATH_TO_TASKS = 'tasks';

let currentDraggedElement = null;
let allContacts = {};

async function initBoard() {
  await showLoggedInLinks();
  allContacts = await loadData(PATH_TO_CONTACTS);
  await renderCards();
}

function startDragging(event) {
  currentDraggedElement = event.target.id;
  event.target.classList.add('tilted');
}

function endDragging(event) {
  if (currentDraggedElement) {
    let draggedElement = document.getElementById(currentDraggedElement);
    if (draggedElement) {
      draggedElement.classList.remove('tilted');
    }
  }
}

function allowDrop(event) {
  event.preventDefault();
  const dropColumn = event.target.closest('.drag-area');
  if (dropColumn) dropColumn.classList.add('highlight-border');
}

function highlight(columnId) {
  const column = document.getElementById(columnId);
  if (column) column.classList.add('drag-area-highlight');
}

function removeHighlight(columnId) {
  const column = document.getElementById(columnId);
  if (column) column.classList.remove('drag-area-highlight');
}

async function moveTo(state) {
  const task = await loadData(`${PATH_TO_TASKS}/${currentDraggedElement}`);
  if (!task) return;

  task.state = state;
  await updateData(`${PATH_TO_TASKS}/${currentDraggedElement}`, task);
  await renderCards();
  updateEmptyColumns();
}

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

function createUnderContainer(key) {
  const cardDiv = document.getElementById(key);
  const underDiv = document.createElement('div');
  underDiv.id = key + '-under-container';
  underDiv.className = 'under-container';
  cardDiv.appendChild(underDiv);
}

function createCategoryTag(key, task) {
  const underDiv = document.getElementById(key + '-under-container');
  const tagContainer = document.createElement('div');
  tagContainer.id = key + '-tag-container';
  tagContainer.className = task.category === 'Technical Task'
    ? 'technical-cards-headline-container'
    : 'user-cards-headline-container';
  underDiv.appendChild(tagContainer);
}

function createTagSpan(key, task) {
  const tagContainer = document.getElementById(key + '-tag-container');
  const tagSpan = document.createElement('span');
  tagSpan.className = 'cards-headline';
  tagSpan.textContent = task.category;
  tagContainer.appendChild(tagSpan);
}

function createTitle(key, task) {
  const underDiv = document.getElementById(key + '-under-container');
  const titleTag = document.createElement('h1');
  titleTag.className = 'cards-title';
  titleTag.textContent = task.title;
  underDiv.appendChild(titleTag);
}

function createDescription(key, task) {
  const underDiv = document.getElementById(key + '-under-container');
  const descriptionTag = document.createElement('span');
  descriptionTag.className = 'cards-description';
  descriptionTag.textContent = task.description;
  underDiv.appendChild(descriptionTag);
}

function createSubtaskContainer(key) {
  const underDiv = document.getElementById(key + '-under-container');
  const subtaskContainer = document.createElement('div');
  subtaskContainer.id = key + '-subtask';
  subtaskContainer.className = 'card-subtask-container';
  underDiv.appendChild(subtaskContainer);
}

function createSubtaskCounter(key, task) {
  const subtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
  const completed = subtasks.filter(st => st.completed).length;
  const subtaskContainer = document.getElementById(key + '-subtask');

  const subtasksCounter = document.createElement('span');
  subtasksCounter.id = key + '-subtask-counter';
  subtasksCounter.textContent = `${completed}/${subtasks.length} Subtasks`;
  subtaskContainer.appendChild(subtasksCounter);
}

function createProgressContainer(key) {
  const subtaskContainer = document.getElementById(key + '-subtask');
  const progressContainer = document.createElement('div');
  progressContainer.id = key + '-progress';
  progressContainer.className = 'progress-container';
  subtaskContainer.appendChild(progressContainer);
}

function createProgressBar(key, task) {
  const progressContainer = document.getElementById(key + '-progress');
  const progressBar = document.createElement('div');
  progressBar.className = 'progress-bar';

  const subtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
  const completed = subtasks.filter(st => st.completed).length;
  const percent = subtasks.length > 0 ? (completed / subtasks.length) * 100 : 0;

  progressBar.style.width = `${percent}%`;
  progressContainer.appendChild(progressBar);

  const label = document.createElement('span');
  label.id = key + '-progress-label';
  label.className = 'subtask-counter';
  label.textContent = `${completed}/${subtasks.length} Subtasks`;
  progressContainer.appendChild(label);
}

function createContactsAndPrioContainer(key) {
  const underDiv = document.getElementById(key + '-under-container');
  const container = document.createElement('div');
  container.id = key + '-contacts-prio';
  container.className = 'contacts-prio';
  underDiv.appendChild(container);
}

function createAssignedContactsContainer(key) {
  const container = document.getElementById(key + '-contacts-prio');
  const assigned = document.createElement('div');
  assigned.id = key + '-assigned-contacts';
  assigned.className = 'assigned-contacts-container';
  container.appendChild(assigned);
}

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

function createPrioContainer(key) {
  const container = document.getElementById(key + '-contacts-prio');
  const prioContainer = document.createElement('div');
  prioContainer.className = 'prio-container';
  container.appendChild(prioContainer);
}

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

function closeForm(formId) {
  document.getElementById(formId).classList.remove('show');
  const overlay = document.getElementById('overlay');
  overlay.style.display = 'none';
  document.body.classList.remove('modal-open');
}

function openBoardAddTaskForm() {
  const boardAddTaskContainer = document.getElementById('board_add_task');
  boardAddTaskContainer.innerHTML = '';
  const template = document.getElementById('addTaskTemplate');
  const clone = template.content.cloneNode(true);
  boardAddTaskContainer.appendChild(clone);
  openForm('board_add_task');
}

function closeBoardAddTask() {
  closeForm('board_add_task');
}