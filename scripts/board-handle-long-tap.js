/**
 * Adds a navigation menu icon to mobile task cards (<768px) that opens a dropdown
 * allowing the user to move the task to another state ("To-do" or "Review").
 * The menu closes automatically when clicking outside.
 */
function setupMobileCardNavigation(card, taskId) {
  if (window.innerWidth >= 768) return;

  const menuIcon = document.createElement('img');
  menuIcon.src = 'assets/icons/swap-horiz.svg';
  menuIcon.className = 'mobile-menu-icon';
  card.appendChild(menuIcon);

  const dropdown = document.createElement('div');
  dropdown.className = 'mobile-dropdown d-none';
  dropdown.innerHTML = `
    <span class="dropdown-label">Move to</span>
    <div class="dropdown-option" onclick="moveMobileTask('${taskId}', 'open')">
      <img src="assets/icons/arrow-upward.svg"> To-do
    </div>
    <div class="dropdown-option" onclick="moveMobileTask('${taskId}', 'review')">
      <img src="assets/icons/arrow-downward.svg"> Review
    </div>
  `;
  card.appendChild(dropdown);

  menuIcon.onclick = function () {
    closeAllMobileMenus();
    dropdown.classList.toggle('d-none');
  };

  document.body.onclick = function (e) {
    if (!card.contains(e.target)) {
      dropdown.classList.add('d-none');
    }
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
 * Moves a task to a different state using the dropdown on mobile cards.
 * @param {string} taskId - The ID of the task to move.
 * @param {string} newState - The new state to move the task to.
 */
async function moveMobileTask(taskId, newState) {
  const task = await loadData(`${PATH_TO_TASKS}/${taskId}`);
  if (!task) return;
  task.state = newState;
  await updateData(`${PATH_TO_TASKS}/${taskId}`, task);
  await renderCards();
  updateEmptyColumns();
}

/**
 * Closes any open mobile dropdown if user clicks outside.
 */
function closeAllDropdowns() {
  const all = document.querySelectorAll('.mobile-dropdown');
  all.forEach(d => d.classList.add('d-none'));
}