/**
 * Returns the HTML markup for a single editable subtask item in the edit popup.
 * Includes text display, edit icon, and delete icon for each subtask.
 *
 * @param {string} subtask - The subtask text to be displayed.
 * @param {number} index - The index of the subtask in the list.
 * @returns {string} The generated HTML string for the subtask item.
 */
function editSubtaskItem(subtask, index) {
    return `
      <div class="subtask-item">
        <span class="subtask-text" id="subtask_text_${index}" ondblclick="editExistingSubtask(${index})">• ${subtask}</span>
        <div class="subtask-icons">
          <img src="assets/icons/edit.svg" class="subtask-icon edit-icon" onclick="editExistingSubtask(${index})">
          <div class="vertical-line-subtask-dark"></div>
          <img src="assets/icons/paperbasketdelet.svg" class="subtask-icon delete-icon" onclick="deleteEditSubtask(${index})">
        </div>
      </div>
    `;
  }