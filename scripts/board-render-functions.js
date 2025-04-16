let redirectInterval = null;

/**
 * Builds a complete task card and appends it to the given container.
 * Delegates rendering of content, subtasks, and assigned contacts.
 *
 * @param {string} key - The unique identifier of the task.
 * @param {HTMLElement} container - The DOM element where the card should be appended.
 * @param {Object} task - The task object containing all relevant data.
 */
function createCard(key, container, task) {
  renderCardBaseStructure(key, container, task);
  createMobileDropdownButton(key);
  renderCardSubtasks(key, task);
  renderCardFooter(key, task);
}

/**
 * Renders the card layout including header, title, and description.
 *
 * @param {string} key - The unique identifier of the task.
 * @param {HTMLElement} container - The column where the card will be placed.
 * @param {Object} task - The task data.
 */
function renderCardBaseStructure(key, container, task) {
  createCardContainer(key, container);
  createUnderContainer(key);
  createCategoryTag(key, task);
  createTagSpan(key, task);
  createTitle(key, task);
  createDescription(key, task);
  createSubtaskContainer(key);
}

/**
 * Renders subtask container and counter label only.
 * Progressbar is created manually when subtasks are updated.
 *
 * @param {string} key - The unique identifier of the task.
 * @param {Object} task - The task object with subtasks.
 */
function renderCardSubtasks(key, task) {
  if (Array.isArray(task.subtasks) && task.subtasks.length > 0) {
    createProgressContainer(key);
    createProgressBar(key, task);
    createSubtaskCounter(key, task);
  }
}

/**
 * Renders the assigned contacts and priority section of the card.
 *
 * @param {string} key - The unique identifier of the task.
 * @param {Object} task - The task data.
 */
function renderCardFooter(key, task) {
  createContactsAndPrioContainer(key);
  createAssignedContactsContainer(key);
  createAssignedContacts(key, task);
  createPrioContainer(key);
  createPrio(key, task);
}

/**
 * Toggles the dropdown menu for a specific task and closes others.
 * Stops event bubbling to prevent opening the task popup.
 *
 * @param {string} key - Task ID.
 * @param {MouseEvent} event - The click event.
 */
function toggleMobileDropdown(key, event) {
  event.stopPropagation();
  const thisDropdown = document.getElementById(`dropdown-${key}`);
  document.querySelectorAll('.mobile-dropdown').forEach(d => {
    if (d !== thisDropdown) d.classList.add('d-none');
  });
  if (thisDropdown) thisDropdown.classList.toggle('d-none');
}

/**
 * Renders the visual progress bar with animated width based on completion percentage.
 *
 * @param {HTMLElement} container - The container where the bar will be added.
 * @param {number} percent - The completion percentage.
 */
function renderProgressVisualBar(container, percent, shouldAnimate = false) {
  const bar = document.createElement("div");
  bar.className = "progress-bar";
  if (shouldAnimate) {
    bar.style.width = "0%";
    setTimeout(() => {
      bar.style.width = `${percent}%`;
    }, 10);
  } else {
    bar.style.width = `${percent}%`;
  }
  container.appendChild(bar);
}

/**
 * Appends a label showing completed subtasks relative to total subtasks.
 *
 * @param {HTMLElement} container - The container for the label.
 * @param {string} key - The task key to generate a unique label ID.
 * @param {number} completed - The number of completed subtasks.
 * @param {number} total - The total number of subtasks.
 */
function renderProgressLabel(container, key, completed, total) {
  const label = document.createElement("span");
  label.id = key + "-progress-label";
  label.className = "subtask-counter";
  label.textContent = `${completed}/${total} Subtasks`;
  container.appendChild(label);
}

/**
 * Closes a modal form by its ID and hides the overlay.
 * Also removes the 'modal-open' class from the body.
 *
 * @param {string} formId - The ID of the form/modal to be closed.
 */
function closeForm(formId) {
  document.getElementById(formId).classList.remove("show");
  const overlay = document.getElementById("overlay");
  overlay.style.display = "none";
  document.body.classList.remove("modal-open");
}

/**
 * Opens the 'Add Task' form on the board by cloning the template
 * and displaying the modal with the provided form.
 * Redirects to add_task.html if screen width is under 920px.
 */
function openBoardAddTaskForm() {
  if (window.innerWidth < 1151) {
    window.location.href = "add_task.html";
    return;
  }
  const boardAddTaskContainer = document.getElementById("board_add_task");
  boardAddTaskContainer.innerHTML = "";
  const template = document.getElementById("addTaskTemplate");
  const clone = template.content.cloneNode(true);
  boardAddTaskContainer.appendChild(clone);
  openForm("board_add_task");
  redirectInterval = setInterval(() => {
    if (window.innerWidth < 1151) {
      clearInterval(redirectInterval);
      window.location.href = "add_task.html";
    }
  }, 500);
}

/**
 * Closes the 'Add Task' form modal on the board.
 * Calls the generic closeForm function with the form ID.
 */
function closeBoardAddTask() {
  closeForm("board_add_task");
  if (redirectInterval) {
    clearInterval(redirectInterval);
    redirectInterval = null;
  }
}

/**
 * Filters tasks based on search input and updates the board accordingly.
 * If query is too short, it renders all cards normally.
 */
async function searchCards() {
  const searchQuery = getSearchQuery();
  if (searchQuery.length < 3) {
    renderCards();
    return;
  }
  const tasks = await loadData(PATH_TO_TASKS);
  clearAllColumns();
  let found = false;
  for (const [key, task] of Object.entries(tasks)) {
    if (task.title.toLowerCase().includes(searchQuery)) {
      const column = document.getElementById(task.state);
      if (column) {
        createCard(key, column, task);
        found = true;
      }
    }
  }
  showEmptySearchPlaceholders();
}

/**
 * Returns the search query from the input field in lowercase.
 * @returns {string} The trimmed lowercase search string.
 */
function getSearchQuery() {
  return document.getElementById('find_cards').value.trim().toLowerCase();
}

/**
 * Clears the content of all task columns on the board.
 */
function clearAllColumns() {
  const columns = document.querySelectorAll('.drag-area');
  columns.forEach((column) => (column.innerHTML = ''));
}

/**
 * Renders placeholder text in columns that have no visible tasks after search.
 */
function showEmptySearchPlaceholders() {
  const columns = document.querySelectorAll('.drag-area');
  columns.forEach((column) => {
    const hasTask = column.querySelector('.todo-card');
    if (!hasTask) {
      addEmptyColumnPlaceholder(column);
    }
  });
}