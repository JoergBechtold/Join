/**
 * Renders a mobile dropdown menu with direct move options to all board states.
 * Only shown on screens below 768px width.
 * 
 * @param {string} key - The unique task ID.
 */
function createMobileDropdownButton(key) {
  if (window.innerWidth >= 768) return;
  const card = document.getElementById(key);
  const wrapper = document.createElement('div');
  wrapper.className = 'mobile-menu-wrapper';
  wrapper.innerHTML = `
    <div class="mobile-menu-icon" onclick="toggleMobileDropdown('${key}', event)">
      <img src="assets/icons/swap-horiz.svg" alt="Menu">
    </div>
    <div class="mobile-dropdown d-none" id="dropdown-${key}">
      <span class="move-to-label">Move to</span>
      <div class="dropdown-option" onclick="handleMobileMove(event, '${key}', 'open')">
        <img src="assets/icons/plus-white.svg"> To-do
      </div>
      <div class="dropdown-option" onclick="handleMobileMove(event, '${key}', 'in-progress')">
        <img src="assets/icons/plus-white.svg"> In Progress
      </div>
      <div class="dropdown-option" onclick="handleMobileMove(event, '${key}', 'await-feedback')">
        <img src="assets/icons/plus-white.svg"> Await Feedback
      </div>
      <div class="dropdown-option" onclick="handleMobileMove(event, '${key}', 'done')">
        <img src="assets/icons/plus-white.svg"> Done
      </div>
    </div>
  `;
  card.appendChild(wrapper);
}

/**
 * Handles mobile dropdown move without triggering popup open.
 * @param {Event} event - The click event.
 * @param {string} key - Task ID.
 * @param {string} newState - New task state.
 */
function handleMobileMove(event, key, newState) {
  event.stopPropagation();
  moveTaskTo(key, newState);
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
 * Ensures mobile dropdown buttons are shown only on small screens.
 * Adds or removes them depending on screen width.
 */
function updateMobileDropdowns() {
  const cards = document.querySelectorAll('.todo-card');

  cards.forEach(card => {
    const wrapper = card.querySelector('.mobile-menu-wrapper');
    const taskId = card.id;

    if (window.innerWidth < 768 && !wrapper) {
      createMobileDropdownButton(taskId);
    }

    if (window.innerWidth >= 768 && wrapper) {
      wrapper.remove();
    }
  });
}

/**
 * Closes any open mobile dropdown if user clicks outside.
 */
function closeAllDropdowns() {
  const all = document.querySelectorAll(".mobile-dropdown");
  all.forEach((d) => d.classList.add("d-none"));
}