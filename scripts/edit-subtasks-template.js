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
    <div class="subtask-item">
      <span class="subtask-text" id="subtask_text_${index}" ondblclick="editExistingSubtask(${index})">• ${subtask}</span>
      <div class="close-and-check">
        <img
          src="assets/icons/edit.svg"
          class="input-base-icon"
          alt="Edit"
          onclick="editExistingSubtask(${index})"
        />
        <div class="vertical-line-subtask"></div>
        <img
          src="assets/icons/paperbasketdelet.svg"
          class="input-base-icon"
          alt="Delete"
          onclick="deleteEditSubtask(${index})"
        />
      </div>
    </div>
  `;
}
