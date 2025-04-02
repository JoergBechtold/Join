function handleEditSubtaskAdd() {
  const input = document.getElementById('edit_subtask_input');
  const value = input.value.trim();
  if (value) {
    editPopupSubtasks.push(value);
    input.value = '';
    renderEditSubtasks();
  }
}

function handleEditSubtaskKey(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    handleEditSubtaskAdd();
  }
}

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

function deleteEditSubtask(index) {
  editPopupSubtasks.splice(index, 1);
  renderEditSubtasks();
}

function editExistingSubtask(index) {
  const container = document.getElementById('edit_subtask_enum');
  const currentText = editPopupSubtasks[index];
  container.innerHTML = `
    <input id="edit_subtask_inline_input" class="input-base" value="${currentText}" onkeydown="submitEditedSubtask(event, ${index})">
  `;
  document.getElementById('edit_subtask_inline_input').focus();
  editPopupCurrentSubtaskIndex = index;
}

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