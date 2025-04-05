/**
 * Adds a new subtask to the edit form if the input is not empty.
 * Clears the input field and updates the subtask list display.
 */
function handleEditSubtaskAdd() {
  const input = document.getElementById('edit_subtask_input');
  const value = input.value.trim();
  if (value) {
    editPopupSubtasks.push(value);
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
    container.innerHTML += editSubtaskItem(subtask, index);
  });
}

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
  const currentText = editPopupSubtasks[index];
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
      editPopupSubtasks[index] = value;
    }
    renderEditSubtasks();
    editPopupCurrentSubtaskIndex = null;
  } else if (event.key === 'Escape') {
    renderEditSubtasks();
    editPopupCurrentSubtaskIndex = null;
  }
}

/**
 * Renders the selected contacts in the edit form.
 * Each contact is displayed as a colored circle with their initials.
 */
function renderSelectedEditContacts() {
  const container = document.getElementById('edit_selected_contact_circles');
  container.innerHTML = '';
  selectedEditContacts.forEach(contact => {
    const div = document.createElement('div');
    div.className = 'circle';
    div.textContent = contact.initials;
    div.style.backgroundColor = contact.randomColor;
    container.appendChild(div);
  });
}