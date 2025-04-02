/**
 * Öffnet das Edit-Feld für eine Subtask
 */
function editSubtask(index) {
  const input = document.getElementById('edit_subtask_input');
  input.value = editPopupSubtasks[index];
  editPopupCurrentSubtaskIndex = index;
  input.focus();
}

/**
 * Bearbeitete Subtask speichern
 */
function saveEditedSubtask() {
  const input = document.getElementById('edit_subtask_input');
  const value = input.value.trim();
  if (editPopupCurrentSubtaskIndex !== null && value !== '') {
    editPopupSubtasks[editPopupCurrentSubtaskIndex] = value;
    editPopupCurrentSubtaskIndex = null;
    input.value = '';
    updateEditSubtaskDisplay();
  }
}

/**
 * Abbrechen des Subtask-Edits
 */
function cancelEditSubtask() {
  const input = document.getElementById('edit_subtask_input');
  input.value = '';
  editPopupCurrentSubtaskIndex = null;
}
