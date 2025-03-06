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
    document.getElementById('add_subtask_icon').classList.add('d-none');
    document.getElementById('check_subtask_icon').classList.remove('d-none');
    document.getElementById('check_subtask_icon').classList.remove('input-base-icon');
    document.getElementById('check_subtask_icon').classList.add('input-base-icon-active');
    document.getElementById('close_subtask_icon').classList.remove('d-none');
    document.getElementById('close_subtask_icon').classList.remove('input-base-icon');
    document.getElementById('close_subtask_icon').classList.add('input-base-icon-active');
}

function handleSubtaskInputImg() {
    handleSubtaskInput();
    document.getElementById('subtask_input').focus();
}

function handleSubtaskDelete() {
    document.getElementById('subtask_input').value = '';
    document.getElementById('add_subtask_icon').classList.remove('d-none');
    document.getElementById('check_subtask_icon').classList.add('d-none');
    document.getElementById('close_subtask_icon').classList.add('d-none');
    document.getElementById('check_subtask_icon').classList.add('input-base-icon');
    document.getElementById('check_subtask_icon').classList.remove('input-base-icon-active');
    document.getElementById('close_subtask_icon').classList.add('input-base-icon');
    document.getElementById('close_subtask_icon').classList.remove('input-base-icon-active');
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
                    <img src="assets/icons/edit.svg" alt="Edit" class="subtask-icon edit-icon">
                    <div class="vertical-line-subtask-dark"></div>
                    <img src="assets/icons/paperbasketdelet.svg" alt="Delete" class="subtask-icon delete-icon">
                </div>
            </div>
        `;
    }
    subtaskEnum.innerHTML = subtaskHtml;
}




