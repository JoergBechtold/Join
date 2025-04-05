let taskKey;

async function getAssignedHTML(task) {
  const allContacts = await loadData('contacts');
  if (!allContacts) return '<span>No contacts found</span>';
  return generateAssignedHTML(task.assigned_to, allContacts);
}

function getSubtasksHTML(task) {
  return generateSubtasksHTML(task.subtasks);
}

async function toggleSubtaskCheckbox(element) {
  const checkboxImg = element.querySelector('.subtask-checkbox-img');
  const subtaskTitle = element.querySelector('span')?.textContent;

  const isChecked = checkboxImg.src.includes('checkbox-checked.svg');
  checkboxImg.src = isChecked 
    ? 'assets/icons/checkbox-empty.svg' 
    : 'assets/icons/checkbox-checked.svg';

  const task = await loadData(`tasks/${taskKey}`);
  if (!task || !Array.isArray(task.subtasks)) return;

  const subtask = task.subtasks.find(st => st.title === subtaskTitle);
  if (subtask) {
    subtask.completed = !isChecked;
    await updateData(`tasks/${taskKey}`, task);
    updateProgress(taskKey, task);
    updateCardInBoard(taskKey, task);
  }
}

function updateProgress(taskId, task) {
  const subtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
  const total = subtasks.length;
  const completed = subtasks.filter(st => st.completed).length;
  const progressPercent = total > 0 ? (completed / total) * 100 : 0;
  const bar = document.getElementById(`${taskId}-progress-bar`);
  if (bar) {
    bar.style.width = `${progressPercent}%`;
  }

  const label = document.getElementById(`${taskId}-progress-label`);
  if (label) {
    label.textContent = `${completed}/${total} Subtasks`;
  }
}

function toggleSubtask(element, taskId) {
  let index = element.getAttribute('data-index');
  let tasks = JSON.parse(sessionStorage.getItem('tasks'));
  let task = tasks[taskId];
  if (!task || !task.subtasks || !task.subtasks[index]) return;
  
  task.subtasks[index].completed = !task.subtasks[index].completed;
  sessionStorage.setItem('tasks', JSON.stringify(tasks));
  
  let checkbox = element.querySelector('.subtask-checkbox');
  if (checkbox) {
    checkbox.classList.toggle('checked', task.subtasks[index].completed);
  }
}

function getCategoryBg(task) {
  if (task.category === 'User Story') return 'background-color: #0038FF;';
  if (task.category === 'Technical Task') return 'background-color: #1FD7C1;';
  return '';
}

async function openPopup(key) {
  taskKey = key;

  const task = await loadData(`tasks/${key}`);
  const popupContainer = document.getElementById('popup_container');
  const popup = document.getElementById('popup');

  if (task) {
    const assignedHTML = await getAssignedHTML(task);
    const subtasksHTML = getSubtasksHTML(task);
    const categoryBackground = getCategoryBg(task);
    const priorityIconSrc = getPriorityIcon(task.priority);

    document.body.style.overflow = 'hidden';
    popup.innerHTML = getPopupContentHtml(task, key, assignedHTML, subtasksHTML, categoryBackground, priorityIconSrc);
  } else {
    popup.innerHTML = `
      <div class="popup-header">
        <h2>Task Not Found</h2>
        <button class="close-button" onclick="closePopup()">X</button>
      </div>`;
  }

  popupContainer.style.display = 'flex';
  document.getElementById('overlay').style.display = 'block';
}

function getPriorityIcon(priority) {
  if (!priority) return '';
  priority = priority.toLowerCase();
  if (priority === 'low') {
    return 'assets/icons/prio-low.svg';
  } else if (priority === 'medium') {
    return 'assets/icons/prio-medium.svg';
  } else if (priority === 'urgent') {
    return 'assets/icons/prio-high.svg';
  }
  return '';
}

function getPopupContentHtml(task, taskKey, assignedHTML, subtasksHTML, categoryBg, priorityIconSrc) {
  return generateBoardPopupHTML(task, taskKey, assignedHTML, subtasksHTML, categoryBg, priorityIconSrc);
}

function editPopupTask(key) {
  const popupContainer = document.getElementById('popup_container');
  popupContainer.style.display = 'none';

  const editPopup = document.getElementById('edit_popup');
  editPopup.style.display = 'flex';

  const tasks = JSON.parse(sessionStorage.getItem('tasks')) || {};
  const task = tasks[key];
  if (!task) return;

  document.getElementById('edit_title').value = task.title || '';
  document.getElementById('edit_description').value = task.description || '';
  document.getElementById('edit_due_date').value = task.due_date || '';

  if (task.category) {
    document.getElementById('edit_selected_option').textContent = task.category;
  }

  if (task.priority) {
    const priorityId = `edit_${task.priority.toLowerCase()}_button`;
    setEditPriority(priorityId);
  }

  editPopupSelectedContacts = Array.isArray(task.assigned_to) ? [...task.assigned_to] : [];
  renderSelectedEditContacts();

  editPopupSubtasks = Array.isArray(task.subtasks) ? [...task.subtasks] : [];
  renderEditSubtasks();

  editPopupTaskKey = key;

  document.getElementById('overlay').style.display = 'block';
}

function checkImgAvailable(priorityIconSrc, priority){
  if (priorityIconSrc) {
    return `<img id="priority-icon" src="${priorityIconSrc}" alt="${priority || 'No Priority'}" />`;
  } else {
    return `<img id="priority-icon" src="" alt="" />`;
  }
}

function editTask() {
  const popupContainer = document.getElementById('popup_container');
  if (popupContainer) {
    popupContainer.style.display = 'none';
  }

  let editPopup = document.getElementById('edit_popup');
  if (!editPopup) {
    editPopup = document.createElement('div');
    editPopup.id = 'edit_popup';
    document.body.appendChild(editPopup);
  }
  editPopup.style.display = 'flex';
}

// async function deleteTask(taskKey) {
//   try {
//     const confirmed = await showConfirmation('Are you sure you want to delete this task?'); 

//     if (!confirmed) {
//       return; 
//     }

//     if (!taskKey) {
//       console.error('taskKey is undefined.');
//       return;
//     }

//     await deleteData('tasks', `${taskKey}`);

//     let tasksString = sessionStorage.getItem('tasks');
//     if (tasksString) {
//       let tasks = JSON.parse(tasksString);
//       delete tasks[taskKey];
//       sessionStorage.setItem('tasks', JSON.stringify(tasks));
//     } else {
//       console.error("No tasks found in sessionStorage.");
//     }

//     closePopup();
//     renderCards();
//   } catch (error) {
//     console.error('Error deleting the task:', error);
//   }
// }

async function deleteTask(taskKey) {
  if (confirm('Are you sure you want to delete this task?')) {
    try {
      if (!taskKey) {
        console.error('taskKey is undefined.');
        return;
      }

      await deleteData('tasks', `${taskKey}`);

      let tasksString = sessionStorage.getItem('tasks');
      if (tasksString) {
        let tasks = JSON.parse(tasksString);
        delete tasks[taskKey];
        sessionStorage.setItem('tasks', JSON.stringify(tasks));
      } else {
          console.log("No tasks found in sessionStorage.");
      }
      closePopup();
      renderCards();  
    } catch (error) {
      console.error('Error deleting the task:', error);
    }
  }
}

function closePopup() {
  document.getElementById('popup_container').style.display = 'none';
  document.getElementById('edit_popup').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
}