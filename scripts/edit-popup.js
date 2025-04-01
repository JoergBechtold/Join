let editSubtasks = [];
let selectedContacts = [];
let activeButton = null;
let taskKey = null;

function editTask(key) {
  taskKey = key;
  document.getElementById('popup_container').style.display = 'none';
  document.getElementById('overlay').style.display = 'block';
  loadEditForm(taskKey);
}

function loadEditForm(taskKey) {
  const tasks = JSON.parse(sessionStorage.getItem('tasks')) || {};
  const task = tasks[taskKey];
  if (!task) return;

  // Fill values
  document.getElementById('edit_title').value = task.title || '';
  document.getElementById('edit_description').value = task.description || '';
  document.getElementById('edit_due_date').value = task.due_date || '';

  // Priority
  if (task.priority) {
    setEditPriority(`edit_${task.priority.toLowerCase()}_button`);
  }

  // Category
  if (task.category) {
    document.getElementById('edit_selected_option').textContent = task.category;
  }

  // Subtasks
  editSubtasks = Array.isArray(task.subtasks) ? [...task.subtasks] : [];
  updateEditSubtaskDisplay();

  // Contacts
  selectedContacts = Array.isArray(task.assigned_to) ? [...task.assigned_to] : [];
  renderSelectedEditContacts();

  document.getElementById('edit_popup').style.display = 'flex';
}

function setEditPriority(buttonId) {
  if (activeButton) {
    activeButton.classList.remove('active-prio');
  }

  const button = document.getElementById(buttonId);
  button.classList.add('active-prio');
  activeButton = button;
}

function getEditPriority() {
  if (activeButton?.id === 'edit_urgent_button') return 'Urgent';
  if (activeButton?.id === 'edit_medium_button') return 'Medium';
  if (activeButton?.id === 'edit_low_button') return 'Low';
  return 'No Priority';
}

function submitEditTask() {
  const title = document.getElementById('edit_title').value.trim();
  const description = document.getElementById('edit_description').value.trim();
  const due_date = document.getElementById('edit_due_date').value.trim();
  const category = document.getElementById('edit_selected_option').textContent.trim();

  if (!title) {
    document.getElementById('edit_error_title').classList.remove('d-none');
    return;
  }

  if (!due_date) {
    document.getElementById('edit_error_date').classList.remove('d-none');
    return;
  }

  if (category === 'Select task category') {
    document.getElementById('edit_error_category').classList.remove('d-none');
    return;
  }

  const tasks = JSON.parse(sessionStorage.getItem('tasks')) || {};
  const task = tasks[taskKey];
  if (!task) return;

  task.title = title;
  task.description = description;
  task.due_date = due_date;
  task.category = category;
  task.priority = getEditPriority();
  task.subtasks = [...editSubtasks];
  task.assigned_to = [...selectedContacts];

  sessionStorage.setItem('tasks', JSON.stringify(tasks));
  closePopup();
  renderCards();
}

function handleEditSubtaskAdd() {
  const input = document.getElementById('edit_subtask_input');
  const value = input.value.trim();
  if (value) {
    editSubtasks.push(value);
    input.value = '';
    updateEditSubtaskDisplay();
  }
}

function handleEditSubtaskKey(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    handleEditSubtaskAdd();
  }
}

function updateEditSubtaskDisplay() {
  const container = document.getElementById('edit_subtask_enum');
  container.innerHTML = '';
  editSubtasks.forEach((subtask, index) => {
    const item = document.createElement('div');
    item.className = 'subtask-item';
    item.innerHTML = `<span>${subtask}</span><button onclick="deleteEditSubtask(${index})">X</button>`;
    container.appendChild(item);
  });
}

function deleteEditSubtask(index) {
  editSubtasks.splice(index, 1);
  updateEditSubtaskDisplay();
}

function toggleEditContactsDropdown() {
  const options = document.getElementById('edit_contacts_options');
  options.classList.toggle('d-none');
  loadEditContacts();
}

function loadEditContacts() {
  const container = document.getElementById('edit_contacts_options');
  container.innerHTML = '';
  const contacts = JSON.parse(sessionStorage.getItem('contacts')) || {};
  Object.values(contacts).forEach(contact => {
    const option = document.createElement('div');
    option.className = 'contacts-custom-select-option';
    option.innerHTML = `
      <div class="circle" style="background:${contact.randomColor}">${contact.initials}</div>
      <div>${contact.firstname} ${contact.lastname}</div>
    `;
    option.onclick = () => toggleEditContact(contact);
    container.appendChild(option);
  });
}

function toggleEditContact(contact) {
  const exists = selectedContacts.find(c => c.initials === contact.initials);
  if (exists) {
    selectedContacts = selectedContacts.filter(c => c.initials !== contact.initials);
  } else {
    selectedContacts.push(contact);
  }
  renderSelectedEditContacts();
}

function renderSelectedEditContacts() {
  const container = document.getElementById('edit_selected_contact_circles');
  container.innerHTML = '';
  selectedContacts.forEach(contact => {
    const div = document.createElement('div');
    div.className = 'circle';
    div.textContent = contact.initials;
    div.style.backgroundColor = contact.randomColor;
    container.appendChild(div);
  });
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
  closePopup();
}

function closePopup() {
  document.getElementById('edit_popup').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
}

  