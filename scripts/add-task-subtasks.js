let subtasks = [];
let currentEditIndex = null;

/**
 * Handles the visual state of subtask input icons when the input field is active.
 * Updates the visibility and styles of the "add", "check", and "close" icons.
 */
function handleSubtaskInput() {
    const addIcon = document.getElementById('add_subtask_icon');
    const checkIcon = document.getElementById('check_subtask_icon');
    const closeIcon = document.getElementById('close_subtask_icon');
    addIcon.classList.add('d-none');
    checkIcon.classList.replace('input-base-icon', 'input-base-icon-active');
    closeIcon.classList.replace('input-base-icon', 'input-base-icon-active');
    checkIcon.classList.remove('d-none');
    closeIcon.classList.remove('d-none');
}

/**
 * Activates the subtask input field and focuses on it.
 * Also updates the visual state of subtask input icons by calling `handleSubtaskInput`.
 */
function handleSubtaskInputImg() {
    handleSubtaskInput();
    document.getElementById('subtask_input').focus();
}

/**
 * Resets the subtask input field and restores the default state of the icons.
 * Clears the input value and hides the "check" and "close" icons while showing the "add" icon.
 */
function handleSubtaskDelete() {
    const inputField = document.getElementById('subtask_input');
    const addIcon = document.getElementById('add_subtask_icon');
    const checkIcon = document.getElementById('check_subtask_icon');
    const closeIcon = document.getElementById('close_subtask_icon');
    inputField.value = '';
    addIcon.classList.remove('d-none');
    checkIcon.classList.replace('input-base-icon-active', 'input-base-icon');
    checkIcon.classList.add('d-none');
    closeIcon.classList.replace('input-base-icon-active', 'input-base-icon');
    closeIcon.classList.add('d-none');
}

/**
 * Saves a new subtask to the global `subtasks` array and updates the display.
 * Clears the input field after saving and resets its visual state using `handleSubtaskDelete`.
 */
function handleSubtaskSave() {
    const subtaskInput = document.getElementById('subtask_input');
    const subtaskValue = subtaskInput.value.trim();
    if (subtaskValue !== '') {
        subtasks.push({ title: subtaskValue, completed: false });
        subtaskInput.value = '';
        handleSubtaskDelete();
        updateSubtaskDisplay();
    }
}

/**
 * Updates the HTML display of all subtasks in the global `subtasks` array.
 * Generates HTML for each subtask using the `subtasksItem` function and renders it in the DOM.
 */
function updateSubtaskDisplay() {
    const subtaskEnum = document.getElementsByClassName('subtask-enum')[0];
    let subtaskHtml = '';
    for (let i = 0; i < subtasks.length; i++) {
        subtaskHtml += subtasksItem(subtasks[i], i);
    }
    subtaskEnum.innerHTML = subtaskHtml;
}

/**
 * Deletes a subtask from the global `subtasks` array by its index.
 * Updates the display after deletion using `updateSubtaskDisplay`.
 *
 * @param {number} index - The index of the subtask to delete from the array.
 */
function deleteSubtask(index) {
    subtasks.splice(index, 1);
    updateSubtaskDisplay();
}

/**
 * Clears all subtasks from the global `subtasks` array and resets the input field.
 * Updates the display to reflect an empty list using `updateSubtaskDisplay`.
 */
function clearSubtasks() {
    document.getElementById('subtask_input').value = '';
    subtasks = [];
    handleSubtaskDelete();
    updateSubtaskDisplay();
}

/**
 * Enables editing mode for a specific subtask by its index.
 * Displays an input field with the current value of the subtask, along with save and delete icons.
 *
 * @param {number} index - The index of the subtask to edit in the global array.
 */
function editSubtask(index) {
    const subtaskEnum = document.getElementsByClassName('subtask-enum')[0];
    const editInput = document.getElementById('edit_subtask_input');
    const deleteIcon = document.getElementById('edit_delete_icon');
    const saveIcon = document.getElementById('edit_save_icon');
    subtaskEnum.style.display = 'none';
    editInput.classList.remove('d-none');
    deleteIcon.classList.remove('d-none');
    saveIcon.classList.remove('d-none');
    editInput.value = subtasks[index].title;
    editInput.focus();
    currentEditIndex = index;
}

/**
 * Cancels editing mode for a subtask and restores its previous state.
 * Removes any changes made during editing and updates the display to show all subtasks.
 */
function cancelEditSubtask() {
    const subtaskEnum = document.getElementsByClassName('subtask-enum')[0];
    const editInput = document.getElementById('edit_subtask_input');
    const deleteIcon = document.getElementById('edit_delete_icon');
    const saveIcon = document.getElementById('edit_save_icon');
    if (currentEditIndex !== null) {
        subtasks.splice(currentEditIndex, 1);
        currentEditIndex = null;
        updateSubtaskDisplay();
        editInput.classList.add('d-none');
        deleteIcon.classList.add('d-none');
        saveIcon.classList.add('d-none');
        subtaskEnum.style.display = 'block';
      }
}

/**
 * Validates the edited subtask input. If the input is empty, restores the original value
 * and exits edit mode without saving changes.
 * @param {HTMLElement} editInput - The input element for editing the subtask.
 * @returns {boolean} - Returns true if the input is valid (not empty), false otherwise.
 */
function validateSubtaskInput(editInput) {
    const editedValue = editInput.value.trim();
    if (editedValue === '') {
        if (currentEditIndex !== null) {
            editInput.value = subtasks[currentEditIndex].title; 
        }
        editInput.classList.add('d-none');
        document.getElementById('edit_delete_icon').classList.add('d-none');
        document.getElementById('edit_save_icon').classList.add('d-none');
        document.getElementsByClassName('subtask-enum')[0].style.display = 'block';
        currentEditIndex = null;
        return false; 
    }
    return true; 
}

/**
 * Saves changes made to an edited subtask by updating its value in the global array.
 * Restores normal mode after saving and updates the display to reflect changes.
 */
function saveEditedSubtask() {
    const editInput = document.getElementById('edit_subtask_input');
    if (!validateSubtaskInput(editInput)) {
        return;
    }
    const editedValue = editInput.value.trim();
    if (currentEditIndex !== null) {
        subtasks[currentEditIndex].title = editedValue;
    }
    editInput.classList.add('d-none');
    document.getElementById('edit_delete_icon').classList.add('d-none');
    document.getElementById('edit_save_icon').classList.add('d-none');
    document.getElementsByClassName('subtask-enum')[0].style.display = 'block';
    updateSubtaskDisplay();
    currentEditIndex = null;
}
