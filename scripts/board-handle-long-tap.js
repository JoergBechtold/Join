/**
 * Adds a navigation menu to mobile task cards (<768px) with "Move to" options.
 * Displays a dropdown with dynamic column shifting logic based on current state.
 * @param {HTMLElement} card - The task card element.
 * @param {string} taskId - The unique ID of the task.
 */
async function setupMobileCardNavigation(card, taskId) {
  if (window.innerWidth >= 768) return;

  const task = await loadData(`${PATH_TO_TASKS}/${taskId}`);
  if (!task) return;

  const menuIcon = document.createElement("img");
  menuIcon.src = "assets/icons/swap-horiz.svg";
  menuIcon.className = "mobile-menu-icon";
  menuIcon.alt = "Menu";

  const dropdown = document.createElement("div");
  dropdown.className = "mobile-dropdown d-none";
  
  const isLastColumn = task.state === "done";

  dropdown.innerHTML = `
    <span class="dropdown-label">Move to</span>
    <div class="dropdown-option" onclick="moveTaskTo('${taskId}', 'open')">
      <img src="assets/icons/arrow-upward.svg"> To-do
    </div>
    <div 
      class="dropdown-option ${isLastColumn ? "disabled" : ""}" 
      ${!isLastColumn ? `onclick="moveTaskToNextColumn('${taskId}')"` : ""}>
      <img src="assets/icons/arrow-downward.svg"> Review
    </div>
  `;

  const wrapper = document.createElement("div");
  wrapper.className = "mobile-menu-wrapper";
  wrapper.appendChild(menuIcon);
  wrapper.appendChild(dropdown);
  card.appendChild(wrapper);

  menuIcon.onclick = function (event) {
    event.stopPropagation();
    closeAllDropdowns();
    dropdown.classList.toggle("d-none");
  };
}

/**
 * Moves a task to a new column by updating its state and re-rendering the board.
 *
 * @param {string} key - The unique identifier of the task.
 * @param {string} newState - The new state to assign (e.g. 'open', 'await-feedback').
 */
async function moveTaskTo(key, newState) {
  const task = await loadData(`tasks/${key}`);
  if (!task) return;
  task.state = newState;
  await updateData(`tasks/${key}`, task);
  await renderCards();
}

/**
 * Moves a task to the next column based on the current state.
 * If the task is already in the last column ("done"), nothing happens.
 * @param {string} taskId - The unique ID of the task.
 */
async function moveTaskToNextColumn(taskId) {
  const task = await loadData(`${PATH_TO_TASKS}/${taskId}`);
  if (!task) return;

  const states = ["open", "in-progress", "await-feedback", "done"];
  const currentIndex = states.indexOf(task.state);
  const nextState = states[currentIndex + 1];

  if (nextState) {
    task.state = nextState;
    await updateData(`${PATH_TO_TASKS}/${taskId}`, task);
    await renderCards();
    updateEmptyColumns();
  }
}

/**
 * Moves a task to a different state using the dropdown on mobile cards.
 * @param {string} taskId - The ID of the task to move.
 * @param {string} newState - The new state to move the task to.
 */
// async function moveMobileTask(taskId, newState) {
//   const task = await loadData(`${PATH_TO_TASKS}/${taskId}`);
//   if (!task) return;
//   task.state = newState;
//   await updateData(`${PATH_TO_TASKS}/${taskId}`, task);
//   await renderCards();
//   updateEmptyColumns();
// }

/**
 * Closes any open mobile dropdown if user clicks outside.
 */
function closeAllDropdowns() {
  const all = document.querySelectorAll(".mobile-dropdown");
  all.forEach((d) => d.classList.add("d-none"));
}