/**
 * Returns the HTML markup for a single editable subtask item in the edit popup.
 * Styled to match the Add Task subtask design, with edit and delete icons.
 *
 * @param {string} subtask - The subtask text to be displayed.
 * @param {number} index - The index of the subtask in the list.
 * @returns {string} The generated HTML string for the subtask item.
 */
function editSubtaskItem(subtask, index) {
  return `
    <div class="subtask-item" onmouseover="this.classList.add('hover')" onmouseout="this.classList.remove('hover')">
      <span class="subtask-text" id="subtask_text_${index}" ondblclick="editExistingSubtask(${index})">
        • ${subtask}
      </span>
      <div class="subtask-icons">
        <img src="assets/icons/edit.svg" class="subtask-icon edit-icon" onclick="editExistingSubtask(${index})">
        <div class="vertical-line-subtask-dark"></div>
        <img src="assets/icons/paperbasketdelet.svg" class="subtask-icon delete-icon" onclick="deleteEditSubtask(${index})">
      </div>
    </div>
  `;
}
