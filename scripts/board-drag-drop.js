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
 * Handles the end of a drag operation on a task card.
 * Removes the visual "tilted" effect from the dragged card.
 *
 * @param {DragEvent} event - The dragend event triggered on the card.
 */
function endDragging(event) {
  if (currentDraggedElement) {
    let draggedElement = document.getElementById(currentDraggedElement);
    if (draggedElement) {
      draggedElement.classList.remove("tilted");
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
  const dropColumn = event.target.closest(".drag-area");
  if (dropColumn) dropColumn.classList.add("highlight-border");
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