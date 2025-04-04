let editPopupSubtasks = [];
let editPopupActiveButton = null;
let editPopupTaskKey = null;
let editPopupCurrentSubtaskIndex = null;

function editTask(key) {
  editPopupTaskKey = key;
  document.getElementById('popup_container').style.display = 'none';
  document.getElementById('overlay').style.display = 'block';
  loadEditForm(editPopupTaskKey);
}

function loadEditForm(key) {
  const tasks = JSON.parse(sessionStorage.getItem('tasks')) || {};
  const task = tasks[key];
  if (!task) return;

  document.getElementById('edit_title').value = task.title || '';
  document.getElementById('edit_description').value = task.description || '';
  document.getElementById('edit_due_date').value = task.due_date || '';

  if (task.priority) {
    const prio = task.priority.toLowerCase();
    if (['urgent', 'medium', 'low'].includes(prio)) {
      setEditPriority(`edit_${prio}_button`);
    }
  }

  if (task.category) {
    document.getElementById('edit_selected_option').textContent = task.category;
  }

  editPopupSubtasks = Array.isArray(task.subtasks) ? [...task.subtasks] : [];
  updateEditSubtaskDisplay();

  selectedEditContacts = Array.isArray(task.assigned_to) ? [...task.assigned_to] : [];
  renderEditSelectedContacts();

  document.getElementById('edit_popup').style.display = 'flex';
}

function setEditPriority(buttonId) {
  const button = document.getElementById(buttonId);
  if (!button) {
    console.warn(`Priority button with ID "${buttonId}" not found.`);
    return;
  }
  if (editPopupActiveButton) resetEditPriorityButton();
  if (editPopupActiveButton !== button) activateEditPriorityButton(button);
}

function resetEditPriorityButton() {
  editPopupActiveButton.classList.remove('active-prio', 'red-prio', 'orange-prio', 'green-prio');
  const img = document.getElementById(editPopupActiveButton.id.replace('button', 'img'));
  if (img) img.src = img.src.replace('-event', '');
  editPopupActiveButton = null;
}

function activateEditPriorityButton(button) {
  editPopupActiveButton = button;
  button.classList.add('active-prio');
  const type = button.id.split('_')[1];
  applyEditPriorityStyle(type);
}

function applyEditPriorityStyle(type) {
  const styles = {
    urgent: ['red-prio', 'high'],
    medium: ['orange-prio', 'medium'],
    low: ['green-prio', 'low']
  };
  if (!styles[type]) return;
  const [className, icon] = styles[type];
  editPopupActiveButton.classList.add(className);
  const img = document.getElementById(`edit_${type}_img`);
  if (img) img.src = `assets/icons/prio-${icon}-event.svg`;
}

function getEditPriority() {
  if (!editPopupActiveButton) return '';
  if (editPopupActiveButton.id.includes('urgent')) return 'urgent';
  if (editPopupActiveButton.id.includes('medium')) return 'medium';
  if (editPopupActiveButton.id.includes('low')) return 'low';
  return '';
}

async function submitEditTask() {
  if (!validateEditInputs()) return;

  const tasks = JSON.parse(sessionStorage.getItem('tasks')) || {};
  const task = tasks[editPopupTaskKey];
  if (!task) return;

  applyEditedTaskData(task);
  sessionStorage.setItem('tasks', JSON.stringify(tasks));
  await updateData(`tasks/${editPopupTaskKey}`, task);
  closeEditPopup();
  renderCards();
}

function applyEditedTaskData(task) {
  task.title = document.getElementById('edit_title').value.trim();
  task.description = document.getElementById('edit_description').value.trim();
  task.due_date = document.getElementById('edit_due_date').value.trim();
  task.category = document.getElementById('edit_selected_option').textContent.trim();
  task.priority = getEditPriority();
  task.subtasks = [...editPopupSubtasks];
  task.assigned_to = [...selectedEditContacts];
}

function validateEditInputs() {
  const title = document.getElementById('edit_title').value.trim();
  const due_date = document.getElementById('edit_due_date').value.trim();
  const category = document.getElementById('edit_selected_option').textContent.trim();

  if (!title) {
    document.getElementById('edit_error_title').classList.remove('d-none');
    return false;
  }
  if (!due_date) {
    document.getElementById('edit_error_date').classList.remove('d-none');
    return false;
  }
  if (category === 'Select task category') {
    document.getElementById('edit_error_category').classList.remove('d-none');
    return false;
  }
  return true;
}

function selectEditOption(value) {
  document.getElementById('edit_selected_option').textContent = value;
  document.getElementById('edit_options_container').classList.add('d-none');
}

function toggleEditCategoryDropdown() {
  const options = document.getElementById('edit_options_container');
  const arrow = document.getElementById('edit_select_arrow');
  if (options.classList.contains('d-none')) {
    options.classList.remove('d-none');
    arrow.src = 'assets/icons/arrow_drop_down_up.svg';
  } else {
    options.classList.add('d-none');
    arrow.src = 'assets/icons/arrow_drop_down.svg';
  }
}

function cancelEditTask() {
  closeEditPopup();
}

function closeEditPopup() {
  document.getElementById('edit_popup').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
}
