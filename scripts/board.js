const PATH_TO_CONTACTS = "contacts";
const PATH_TO_TASKS = "tasks";

let currentDraggedElement;

async function initBoard() {
  await sessionStoreContacts();
  await sessionStoreTasks();
  renderCards();
}

async function sessionStoreContacts() {
  let contactsJson = await loadData(PATH_TO_CONTACTS);
  sessionStorage.setItem("contacts", JSON.stringify(contactsJson));
}

async function sessionStoreTasks() {
  let tasksJson = await loadData(PATH_TO_TASKS);
  sessionStorage.setItem("tasks", JSON.stringify(tasksJson));
}

function startDragging(event) {
  currentDraggedElement = event.target.id;
  event.target.classList.add("tilted");
}

function endDragging(event) {
  if (currentDraggedElement) {
    let draggedElement = document.getElementById(currentDraggedElement);
    if (draggedElement) {
      draggedElement.classList.remove("tilted");
    }
  }
}

function allowDrop(event) {
  event.preventDefault();
  let dropColumn = event.target.closest('.drag-area');
  if (dropColumn) {
    dropColumn.classList.add('highlight-border');
  }
}

function highlight(columnId) {
  let column = document.getElementById(columnId);
  if (column) {
    column.classList.add("drag-area-highlight");
  }
}

function removeHighlight(columnId) {
  let column = document.getElementById(columnId);
  if (column) {
    column.classList.remove("drag-area-highlight");
  }
}

function moveTo(state) {
  let event = window.event;
  if (event) {
    event.preventDefault();
  }
  let tasks = JSON.parse(sessionStorage.getItem("tasks")) || {};
  let task = tasks[currentDraggedElement];
  if (task) {
    task.state = state;
    sessionStorage.setItem("tasks", JSON.stringify(tasks));
    updateData(PATH_TO_TASKS, tasks);
  }
  renderCards();
  updateEmptyColumns();
}

function createCardContainer(key, container) {
  let cardDiv = document.createElement("div");
  cardDiv.id = key;
  cardDiv.className = "todo-card";
  cardDiv.draggable = true;
  cardDiv.ondragstart = startDragging;
  cardDiv.ondragend = endDragging;
  cardDiv.onclick = () => openPopup(key);
  container.appendChild(cardDiv);
}

function createUnderContainer(key) {
  let cardDiv = document.getElementById(key);
  let underDiv = document.createElement("div");
  underDiv.id = key + "-under-container";
  underDiv.className = "under-container";
  cardDiv.appendChild(underDiv);
}

function createCategoryTag(key, task) {
  let underDiv = document.getElementById(key + "-under-container");
  let tagContainer = document.createElement("div");
  tagContainer.id = key + "-tag-container";
  if (task.category === "Technical Task") {
    tagContainer.className = "technical-cards-headline-container";
  } else if (task.category === "User Story") {
    tagContainer.className = "user-cards-headline-container";
  }
  underDiv.appendChild(tagContainer);
}

function createTagSpan(key, task) {
  let tagContainer = document.getElementById(key + "-tag-container");
  let tagSpan = document.createElement("span");
  tagSpan.id = key + "-span";
  tagSpan.className = "cards-headline";
  tagSpan.textContent = task.category;
  tagContainer.appendChild(tagSpan);
}

function createTitle(key, task) {
  let underDiv = document.getElementById(key + "-under-container");
  let titleTag = document.createElement("h1");
  titleTag.id = key + "-title";
  titleTag.className = "cards-title";
  titleTag.textContent = task.title;
  underDiv.appendChild(titleTag);
}

function createDescription(key, task) {
  let underDiv = document.getElementById(key + "-under-container");
  let descriptionTag = document.createElement("span");
  descriptionTag.id = key + "-description";
  descriptionTag.className = "cards-description";
  descriptionTag.textContent = task.description;
  underDiv.appendChild(descriptionTag);
}

function createSubtaskContainer(key) {
  let underDiv = document.getElementById(key + "-under-container");
  let subtaskContainer = document.createElement("div");
  subtaskContainer.id = key + "-subtask";
  subtaskContainer.className = "card-subtask-container";
  underDiv.appendChild(subtaskContainer);
}

function getSubtasksList(task) {
  if (!task.subtasks) return [];
  if (typeof task.subtasks === "string") {
    try {
      return JSON.parse(task.subtasks);
    } catch (e) {
      return [];
    }
  }
  return task.subtasks;
}

function reducerFunction(subtasksList) {
  let total = subtasksList.length;
  let closed = 0;
  return { closed, total };
}

function createContactsAndPrioContainer(key) {
  let underDiv = document.getElementById(key + "-under-container");
  let assignmentPrioContainer = document.createElement("div");
  assignmentPrioContainer.id = key + "-contacts-prio";
  assignmentPrioContainer.className = "contacts-prio";
  underDiv.appendChild(assignmentPrioContainer);
}

function createAssignedContactsContainer(key) {
  let assignmentPrioContainer = document.getElementById(key + "-contacts-prio");
  let assignedContactsContainer = document.createElement("div");
  assignedContactsContainer.id = key + "-assigned-contacts";
  assignedContactsContainer.className = "assigned-contacts-container";
  assignmentPrioContainer.appendChild(assignedContactsContainer);
}

function getAssignedContacts(task) {
  if (task.assigned_to && Array.isArray(task.assigned_to)) {
    return task.assigned_to;
  }
  return [];
}

function createAssignedContacts(key, task) {
  let assignedContactsContainer = document.getElementById(key + "-assigned-contacts");
  let assignedContacts = getAssignedContacts(task);
  let contactCount = assignedContacts.length;
  assignedContacts.slice(0, 4).forEach((contact) => {
    let span = document.createElement("span");
    span.id = key + "-" + contact.initials;
    span.className = "initials-span";
    span.style.backgroundColor = contact.randomColor;
    span.textContent = contact.initials;
    assignedContactsContainer.appendChild(span);
  });
  if (contactCount > 4) {
    let extraSpan = document.createElement("span");
    extraSpan.className = "extra-contacts-span";
    extraSpan.textContent = `+${contactCount - 4}`;
    assignedContactsContainer.appendChild(extraSpan);
  }
}

function createCard(key, container, task) {
  createCardContainer(key, container);
  createUnderContainer(key);
  createCategoryTag(key, task);
  createTagSpan(key, task);
  createTitle(key, task);
  createDescription(key, task);
  createSubtaskContainer(key);
  createContactsAndPrioContainer(key);
  createAssignedContactsContainer(key);
  createAssignedContacts(key, task);
}

function renderCards() {
  let tasks = JSON.parse(sessionStorage.getItem("tasks")) || {};
  let allColumns = document.querySelectorAll(".drag-area");
  allColumns.forEach(column => (column.innerHTML = ""));
  Object.keys(tasks).forEach((key) => {
    let task = tasks[key];
    let stateColumn = document.getElementById(task.state);
    if (stateColumn) {
      createCard(key, stateColumn, task);
    }
  });
  updateEmptyColumns();
}

function updateEmptyColumns() {
  const columns = document.querySelectorAll(".drag-area");

  columns.forEach(column => {
    const hasTasks = column.querySelector(".todo-card");
    let placeholder = column.querySelector(".empty-task-container");

    if (!hasTasks) {
      if (!placeholder) {
        placeholder = document.createElement("div");
        placeholder.className = "empty-task-container";

        const span = document.createElement("span");
        span.classList.add("no-task");
        span.textContent = "No Tasks to do";

        placeholder.appendChild(span);
        column.appendChild(placeholder);
      }
    } else {
      if (placeholder) {
        placeholder.remove();
      }
    }
  });
}

