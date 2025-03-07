let activeButton = null;

function setPriority(buttonId) {
  const button = document.getElementById(buttonId);
  if (activeButton) {
    resetActiveButton();
  }
  if (activeButton !== button) {
    activateButton(button);
  } else {
    activeButton = null; 
  }
}

function resetActiveButton() {
  activeButton.classList.remove('active-prio', 'red-prio', 'orange-prio', 'green-prio');
  const prevImg = document.getElementById(activeButton.id + '_img');
  prevImg.src = prevImg.src.replace('-event', '');
}

function activateButton(button) {
  activeButton = button;
  button.classList.add('active-prio');
  const buttonType = button.id.split('_')[0];
  updateButtonStyle(buttonType);
}
  
function updateButtonStyle(buttonType) {
  const prioStyles = {
      urgent: ['red-prio', 'high'],
      medium: ['orange-prio', 'medium'],
      low: ['green-prio', 'low']
  };
  const [className, iconType] = prioStyles[buttonType];
  activeButton.classList.add(className);
  document.getElementById(activeButton.id + '_img').src = `/assets/icons/prio-${iconType}-event.svg`;
}

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

let subtasks = [];

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
                <span class="subtask-text">• ${subtasks[i]}</span>
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

function clearAll() {
    clearInput();
    clearButtons();
    clearSubtasks();
}

function clearInput() {
    const inputBaseFields = document.getElementsByClassName('input-base');
    const textareaBaseFields = document.getElementsByClassName('textarea-base');
    for (let i = 0; i < inputBaseFields.length; i++) {
        inputBaseFields[i].value = '';
    }
    for (let i = 0; i < textareaBaseFields.length; i++) {
        textareaBaseFields[i].value = '';
    }
}

function clearButtons() {
    if (activeButton) {
        resetActiveButton();
    }
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
    subtaskEnum.style.display = 'none';
    editInput.classList.remove('d-none');
    editInput.parentNode.classList.remove('d-none');
    editInput.value = subtasks[index];
    editInput.focus();
}













