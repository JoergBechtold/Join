/**
 * Generates HTML for a visible subtask in the edit popup.
 * @param {Object} subtask - Subtask object (title + completed).
 * @param {number} index - Index of the subtask.
 * @returns {string} HTML string for subtask display.
 */
function editSubtaskItem(subtask, index) {
  const text = typeof subtask === 'object' ? subtask.title : subtask;
  return `
    <div class="subtask-item">
      <span class="subtask-text" ondblclick="editExistingSubtask(${index})">• ${text}</span>
      <div class="subtask-icons">
        <img src="assets/icons/edit.svg" alt="Edit" class="subtask-icon edit-icon"
          onclick="editExistingSubtask(${index})">
        <div class="vertical-line-subtask-dark"></div>
        <img src="assets/icons/paperbasketdelet.svg" alt="Delete" class="subtask-icon delete-icon"
          onclick="deleteEditSubtask(${index})">
      </div>
    </div>
  `;
}

/**
 * Returns inline editing input markup for a subtask.
 * @param {Object} subtask - The subtask being edited.
 * @param {number} index - Index of the subtask.
 * @returns {string} HTML input for editing a subtask.
 */
function editSubtaskEditForm(subtask, index) {
  const text = typeof subtask === 'object' ? subtask.title : subtask;
  return `
    <div class="input-container">
      <input id="edit_subtask_inline_input" class="input-base-V2"
        type="text" placeholder="Edit subtask" name="edit-subtasks"
        value="${text}" onkeydown="submitEditedSubtask(event, ${index})">
      <div class="close-and-check close-check-edit-input">
        <img src="assets/icons/paperbasketdelet.svg" alt="Cancel"
          class="subtask-icon delete-icon" onclick="deleteEditSubtask(${index})">
        <div class="vertical-line-subtask-dark"></div>
        <img src="assets/icons/blackcheck.svg" alt="Save"
          class="subtask-icon edit-icon"
          onclick="submitEditedSubtask({ key: 'Enter' }, ${index})">
      </div>
    </div>
  `;
}
