/**
 * Adds a new subtask in the edit popup if input is not empty.
 */
function handleEditSubtaskAdd() {
  const input = document.getElementById('edit_subtask_input');
  const value = input.value.trim();
  if (!value) return;
  editPopupSubtasks.push({ title: value, completed: false });
  input.value = '';
  renderEditSubtasks();
}

/**
 * Adds subtask on Enter key press in edit popup.
 * @param {KeyboardEvent} event - The keyboard event.
 */
function handleEditSubtaskKey(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    handleEditSubtaskAdd();
  }
}

/**
 * Renders all edit subtasks by injecting generated HTML.
 */
function renderEditSubtasks() {
  const container = document.getElementById('edit_subtask_enum');
  container.innerHTML = '';
  editPopupSubtasks.forEach((subtask, index) => {
    container.innerHTML += editSubtaskItem(subtask, index);
  });
}

/**
 * Deletes a subtask in the edit popup and re-renders the list.
 * @param {number} index - Index of subtask to remove.
 */
function deleteEditSubtask(index) {
  editPopupSubtasks.splice(index, 1);
  renderEditSubtasks();
}

/**
 * Triggers inline editing of a subtask in the edit popup.
 * @param {number} index - Index of subtask to edit.
 */
function editExistingSubtask(index) {
  const container = document.getElementById('edit_subtask_enum');
  container.innerHTML = editSubtaskEditForm(editPopupSubtasks[index], index);
  document.getElementById('edit_subtask_inline_input').focus();
  editPopupCurrentSubtaskIndex = index;
}

/**
 * Submits or cancels inline subtask editing in the popup.
 * @param {KeyboardEvent|Object} event - Key press or click event.
 * @param {number} index - Subtask index being edited.
 */
function submitEditedSubtask(event, index) {
  const input = document.getElementById('edit_subtask_inline_input');
  if (!input) return;

  if (event.key === 'Enter' || event.key === 'Save' || event.key === undefined) {
    const value = input.value.trim();
    if (value) {
      editPopupSubtasks[index] = { ...editPopupSubtasks[index], title: value };
    }
    renderEditSubtasks();
  } else if (event.key === 'Escape') {
    renderEditSubtasks();
  }

  editPopupCurrentSubtaskIndex = null;
}
