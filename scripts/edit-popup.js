let editPopupSubtasks = [];
let editPopupActiveButton = null;
let editPopupTaskKey = null;
let editPopupCurrentSubtaskIndex = null;
let editSelectedContact = [];

async function editTask(key) {
  editPopupTaskKey = key;
  document.getElementById('popup_container').style.display = 'none';
  document.getElementById('overlay').style.display = 'block';

  const task = await loadData(`tasks/${key}`);
  if (!task) return;

  renderEditPreview(task);
  loadEditFormData(task); 
  document.getElementById('edit_popup').style.display = 'flex';
}

function renderEditPreview(task) {
  const container = document.getElementById('edit_preview_info');
  if (!container) return;

  const assignedHTML = getAssignedHTML(task);
  const subtasksHTML = getSubtasksHTML(task);
  const categoryBg = getCategoryBg(task);
  const priorityIcon = getPriorityIcon(task.priority);

  container.innerHTML = `
    <div class="popup-header">
      <div style="${categoryBg}" class="tag-container">
        <span class="tag">${task.category}</span>
      </div>
    </div>
    <h2>${task.title}</h2>
    <p>${task.description}</p>
    <div class="info-item-date"><strong>Due:</strong> ${task.due_date}</div>
    <div class="priority-container">
      <strong>Priority:</strong> 
      <img src="${priorityIcon}" style="width: 20px;"> ${task.priority}
    </div>
    <div class="info-item-assigned">
      <strong>Assigned To:</strong>
      ${assignedHTML}
    </div>
    <div class="popup-subtasks">
      <strong>Subtasks:</strong>
      ${subtasksHTML}
    </div>
  `;
}

function loadEditFormData(task) {
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
}

async function loadEditForm(key) {
  const task = await loadData(`tasks/${key}`);
  if (!task) return;

  renderEditPreview(task);

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
  if (!button) return;
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

  const task = await loadData(`tasks/${editPopupTaskKey}`);
  if (!task) return;

  applyEditedTaskData(task);
  await updateData(`tasks/${editPopupTaskKey}`, task);
  closeEditPopup();

  const updatedTask = await loadData(`tasks/${editPopupTaskKey}`);
  if (updatedTask) {
    updateCardInBoard(editPopupTaskKey, updatedTask);
    updatePopup(editPopupTaskKey, updatedTask);
  }
}

function applyEditedTaskData(task) {
  task.title = document.getElementById('edit_title').value.trim();
  task.description = document.getElementById('edit_description').value.trim();
  task.due_date = document.getElementById('edit_due_date').value.trim();
  task.category = document.getElementById('edit_selected_option').textContent.trim();
  task.priority = getEditPriority();
  task.subtasks = checkSubtasks();
  task.assigned_to = checkAssignedTo();
}

function checkSubtasks() {
  const elements = document.querySelectorAll('#edit_subtask_enum .subtask-text');
  let subtasks = [];

  elements.forEach(el => {
    const text = el.textContent.replace('• ', '').trim();
    if (text) {
      subtasks.push({ title: text, completed: false });
    }
  });

  return subtasks;
}

function checkAssignedTo() {
  const container = document.getElementById('edit_selected_contact_circles');
  const circles = container.querySelectorAll('.circle');

  const contacts = Array.from(circles).map(circle => ({
    initials: circle.textContent.trim(),
    randomColor: circle.style.backgroundColor
  }));

  return contacts;
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

async function updateCardInBoard(taskKey, task) {
  const container = document.getElementById(task.state);
  const oldCard = document.getElementById(taskKey);
  if (oldCard) oldCard.remove();
  createCard(taskKey, container, task);
}

function updatePopup(taskKey, task) {
  const assignedHTML = getAssignedHTML(task);
  const subtasksHTML = getSubtasksHTML(task);
  const categoryBackground = getCategoryBg(task);
  const priorityIconSrc = getPriorityIcon(task.priority);
  const popup = document.getElementById('popup');
  popup.innerHTML = getPopupContentHtml(task, taskKey, assignedHTML, subtasksHTML, categoryBackground, priorityIconSrc);
  document.getElementById('popup_container').style.display = 'flex';
  document.getElementById('overlay').style.display = 'block';
}