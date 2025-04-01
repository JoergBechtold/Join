let editSubtasks = [];
let currentEditIndex = null;

/**
 * Fügt eine neue Subtask beim Bearbeiten hinzu
 */
function handleEditSubtaskAdd() {
  const input = document.getElementById('edit_subtask_input');
  const value = input.value.trim();
  if (value !== '') {
    editSubtasks.push(value);
    input.value = '';
    renderEditSubtasks();
  }
}

/**
 * Subtasks anzeigen (bearbeiten)
 */
function renderEditSubtasks() {
  const container = document.getElementById('edit_subtask_enum');
  let html = '';
  for (let i = 0; i < editSubtasks.length; i++) {
    html += `
      <div class="subtask-element">
        <span>${editSubtasks[i]}</span>
        <img src="assets/icons/paperbasketdelet.svg" onclick="deleteEditSubtask(${i})" class="delete-subtask-icon" />
        <img src="assets/icons/edit.svg" onclick="editSubtask(${i})" class="edit-subtask-icon" />
      </div>`;
  }
  container.innerHTML = html;
}

/**
 * Beim Tippen Enter -> Hinzufügen
 */
function handleEditSubtaskKey(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    handleEditSubtaskAdd();
  }
}

/**
 * Entfernt eine Subtask beim Bearbeiten
 */
function deleteEditSubtask(index) {
  editSubtasks.splice(index, 1);
  renderEditSubtasks();
}

/**
 * Öffnet das Edit-Feld für eine Subtask
 */
function editSubtask(index) {
  const input = document.getElementById('edit_subtask_input');
  input.value = editSubtasks[index];
  currentEditIndex = index;
  input.focus();
}

/**
 * Bearbeitete Subtask speichern
 */
function saveEditedSubtask() {
  const input = document.getElementById('edit_subtask_input');
  const value = input.value.trim();
  if (currentEditIndex !== null && value !== '') {
    editSubtasks[currentEditIndex] = value;
    currentEditIndex = null;
    input.value = '';
    renderEditSubtasks();
  }
}

/**
 * Abbrechen des Subtask-Edits
 */
function cancelEditSubtask() {
  const input = document.getElementById('edit_subtask_input');
  input.value = '';
  currentEditIndex = null;
}

/**
 * Für spätere Verwendung z. B. zum Speichern oder Vorfüllen beim Öffnen des Popups
 */
function loadEditSubtasksFromTask(task) {
  editSubtasks = task.subtasks ? [...task.subtasks] : [];
  renderEditSubtasks();
}
