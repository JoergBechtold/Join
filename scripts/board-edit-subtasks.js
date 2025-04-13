/**
 * Adds a new subtask to the edit form if the input is not empty.
 * Ensures the subtask is stored as an object with title and completed status.
 * Clears the input field and updates the subtask list display.
 */
function handleEditSubtaskAdd() {
  const input = document.getElementById('edit_subtask_input');
  const value = input.value.trim();
  if (value) {
    editPopupSubtasks.push({ title: value, completed: false });
    input.value = '';
    renderEditSubtasks();
  }
}

/**
 * Handles the Enter key event when typing a subtask in the edit form.
 * Prevents the default action and triggers subtask addition.
 *
 * @param {KeyboardEvent} event - The keyboard event triggered in the input field.
 */
function handleEditSubtaskKey(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    handleEditSubtaskAdd();
  }
}

/**
 * Renders the list of subtasks in the edit popup.
 * Clears the container and appends each subtask using the template function.
 */
function renderEditSubtasks() {
  const container = document.getElementById('edit_subtask_enum');
  container.innerHTML = '';
  editPopupSubtasks.forEach((subtask, index) => {
    const text = typeof subtask === 'object' ? subtask.title : subtask;
    container.innerHTML += editSubtaskItem(text, index);
  });
}

/**
 * Deletes a subtask from the edit popup by its index.
 * Updates the UI after removal by re-rendering the subtask list.
 *
 * @param {number} index - The index of the subtask to delete.
 */
function deleteEditSubtask(index) {
  editPopupSubtasks.splice(index, 1);
  renderEditSubtasks();
}

/**
 * Initiates inline editing for a specific subtask in the edit popup.
 * Replaces the subtask item with an input field and sets focus to it.
 *
 * @param {number} index - The index of the subtask to be edited.
 */
function editExistingSubtask(index) {
  const container = document.getElementById('edit_subtask_enum');
  const subtask = editPopupSubtasks[index];
  const currentText = typeof subtask === 'object' ? subtask.title : subtask;
  container.innerHTML = `
    <input id="edit_subtask_inline_input" class="input-base" value="${currentText}" onkeydown="submitEditedSubtask(event, ${index})">
  `;
  document.getElementById('edit_subtask_inline_input').focus();
  editPopupCurrentSubtaskIndex = index;
}

/**
 * Handles submission or cancellation of subtask inline editing.
 * On Enter: updates the subtask with new value and re-renders the list.
 * On Escape: cancels editing and re-renders the original subtasks.
 *
 * @param {KeyboardEvent} event - The keyboard event triggered during input.
 * @param {number} index - The index of the subtask being edited.
 */
function submitEditedSubtask(event, index) {
  const input = document.getElementById('edit_subtask_inline_input');
  if (event.key === 'Enter') {
    event.preventDefault();
    const value = input.value.trim();
    if (value) {
      editPopupSubtasks[index] = { title: value, completed: false };
    }
    renderEditSubtasks();
    editPopupCurrentSubtaskIndex = null;
  } else if (event.key === 'Escape') {
    renderEditSubtasks();
    editPopupCurrentSubtaskIndex = null;
  }
}