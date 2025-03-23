let subtasks = [];
let currentEditIndex = null;

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
  
function handleSubtaskInputImg() {
    handleSubtaskInput();
    document.getElementById('subtask_input').focus();
}
  
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
  
function handleSubtaskSave() {
    const subtaskInput = document.getElementById('subtask_input');
    const subtaskValue = subtaskInput.value.trim();
    if (subtaskValue !== '') {
      subtasks.push(subtaskValue);
      subtaskInput.value = '';
      handleSubtaskDelete();
      updateSubtaskDisplay();
    }
}
  
function updateSubtaskDisplay() {
    const subtaskEnum = document.getElementsByClassName('subtask-enum')[0];
    let subtaskHtml = '';
    for (let i = 0; i < subtasks.length; i++) {
      subtaskHtml += `
              <div class="subtask-item">
                  <span class="subtask-text" ondblclick="editSubtask(${i})">• ${subtasks[i]}</span>
                  <div class="subtask-icons">
                      <img src="assets/icons/edit.svg" alt="Edit" class="subtask-icon edit-icon" onclick="editSubtask(${i})">
                      <div class="vertical-line-subtask-dark"></div>
                      <img src="assets/icons/paperbasketdelet.svg" alt="Delete" class="subtask-icon delete-icon" onclick="deleteSubtask(${i})">
                  </div>
              </div>
          `;
    }
    subtaskEnum.innerHTML = subtaskHtml;
}
  
function deleteSubtask(index) {
    subtasks.splice(index, 1);
    updateSubtaskDisplay();
}

function clearSubtasks() {
    document.getElementById('subtask_input').value = '';
    subtasks = [];
    handleSubtaskDelete();
    updateSubtaskDisplay();
}
  
function editSubtask(index) {
    const subtaskEnum = document.getElementsByClassName('subtask-enum')[0];
    const editInput = document.getElementById('edit_subtask_input');
    const deleteIcon = document.getElementById('edit_delete_icon');
    const saveIcon = document.getElementById('edit_save_icon');
    subtaskEnum.style.display = 'none';
    editInput.classList.remove('d-none');
    deleteIcon.classList.remove('d-none');
    saveIcon.classList.remove('d-none');
    editInput.value = subtasks[index];
    editInput.focus();
    currentEditIndex = index;
}
  
function cancelEditSubtask() {
    const subtaskEnum = document.getElementsByClassName('subtask-enum')[0];
    const editInput = document.getElementById('edit_subtask_input');
    const deleteIcon = document.getElementById('edit_delete_icon');
    const saveIcon = document.getElementById('edit_save_icon');
    if (currentEditIndex !== null) {
      subtasks.splice(currentEditIndex, 1);
    }
    editInput.classList.add('d-none');
    deleteIcon.classList.add('d-none');
    saveIcon.classList.add('d-none');
    subtaskEnum.style.display = 'block';
    updateSubtaskDisplay();
    currentEditIndex = null;
}
  
function saveEditedSubtask() {
    const editInput = document.getElementById('edit_subtask_input');
    const editedValue = editInput.value.trim();
    if (currentEditIndex !== null) {
      subtasks[currentEditIndex] = editedValue;
    }
    editInput.classList.add('d-none');
    document.getElementById('edit_delete_icon').classList.add('d-none');
    document.getElementById('edit_save_icon').classList.add('d-none');
    document.getElementsByClassName('subtask-enum')[0].style.display = 'block';
    updateSubtaskDisplay();
    currentEditIndex = null;
}