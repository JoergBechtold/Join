/**
 * Handles the start of a drag operation on a task card.
 * Stores the ID of the dragged element and visually tilts the card.
 *
 * @param {DragEvent} event - The dragstart event triggered on the card.
 */
function startDragging(event) {
  currentDraggedElement = event.target.id;
  event.target.classList.add("tilted");
}

/**
 * Handles the end of the drag operation.
 * Removes tilt styling and cleans up any drop placeholders from the board.
 * 
 * @param {DragEvent} event - The dragend event triggered when the user releases the task card.
 */
function endDragging(event) {
  if (currentDraggedElement) {
    const draggedElement = document.getElementById(currentDraggedElement);
    if (draggedElement) {
      draggedElement.classList.remove('tilted');
    }
  }
  removePlaceholder();
}

/**
 * Allows dropping by preventing the default behavior and inserting
 * a visual placeholder where the task card would be dropped.
 * 
 * @param {DragEvent} event - The dragover event triggered when dragging over a valid drop zone.
 */
function allowDrop(event) {
  event.preventDefault();
  const dropColumn = event.target.closest('.drag-area');
  if (dropColumn && !dropColumn.querySelector('.drop-placeholder')) {
    removePlaceholder();
    const placeholder = document.createElement('div');
    placeholder.className = 'drop-placeholder';
    dropColumn.appendChild(placeholder);
  }
}

/**
 * Removes any existing visual drop placeholder from the board.
 * Ensures only one placeholder is visible at any time.
 */
function removePlaceholder() {
  document.querySelectorAll('.drop-placeholder').forEach(p => p.remove());
}

/**
 * Adds a visual highlight to the specified drag area column.
 *
 * @param {string} columnId - The ID of the column element to highlight.
 */
function highlight(columnId) {
  const column = document.getElementById(columnId);
  if (column) column.classList.add("drag-area-highlight");
}

/**
 * Removes the visual highlight from the specified drag area column.
 *
 * @param {string} columnId - The ID of the column element to remove the highlight from.
 */
function removeHighlight(columnId) {
  const column = document.getElementById(columnId);
  if (column) column.classList.remove("drag-area-highlight");
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
 * Renders a mobile dropdown menu with direct move options to all board states.
 * Only shown on screens below 768px width.
 * Prevents duplicate buttons and disables the current state option.
 * 
 * @param {string} key - The unique task ID.
 */
async function createMobileDropdownButton(key) {
  if (window.innerWidth >= 768) return;
  const task = await loadData(`tasks/${key}`);
  if (!task) return;
  const card = document.getElementById(key);
  if (!card || card.querySelector('.mobile-menu-wrapper')) return;
  const wrapper = document.createElement('div');
  wrapper.className = 'mobile-menu-wrapper';
  wrapper.innerHTML = generateMobileDropdownHTML(key, task.state);
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
  if (event.currentTarget.classList.contains('disabled')) return;
  moveTaskTo(key, newState);
}

/**
 * Moves a task to a new column by updating its state and re-rendering the board.
 * @param {string} key - The unique task ID.
 * @param {string} newState - The new state to assign (e.g., 'done').
 */
async function moveTaskTo(key, newState) {
  const task = await loadData(`tasks/${key}`);
  if (!task) return;
  task.state = newState;
  await updateData(`tasks/${key}`, task);
  await renderCards();
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