let taskKey;

function getAssignedHTML(task) {
  let html = '';
  let allContacts = JSON.parse(sessionStorage.getItem('contacts')) || {};
  if (task.assigned_to) {
    let assignedArray = Object.values(task.assigned_to);
    assignedArray.forEach((assignedItem) => {
      let allContactsArray = Object.values(allContacts);
      let foundContact = allContactsArray.find((contactObj) => {
        return contactObj.initials === assignedItem.initials;
      });
      if (foundContact) {
        html += `
          <div class="assigned-contact-container">
              <div class="assigned-contact" style="background-color:${
                foundContact.contactColor || foundContact.randomColor || assignedItem.randomColor || '#ccc'
              };">
                <span class="contact-initials">${foundContact.initials}</span>
              </div>
              <div>
                <span class="contact-fullname">${foundContact.firstname} ${foundContact.lastname}</span>
              </div>
          </div>
        `;
      }
    });
  } else {
    html = '<span>No contacts assigned</span>';
  }
  return html;
}

function getSubtasksHTML(task) {
  let html = '';
  if (task.subtasks) {
    Object.values(task.subtasks).forEach((subtask) => {
      html += `<div class="subtasks-elements-container"><img src="/assets/icons/checkbox-empty.svg"><span>${subtask}</span></div>`;
    });
  } else {
    html = '<span>No subtasks</span>';
  }
  return html;
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

function openPopup(Key) {
  taskKey = Key
  let tasks = JSON.parse(sessionStorage.getItem('tasks')),
    task = tasks ? tasks[taskKey] : null,
    popupContainer = document.getElementById('popup_container'),
    popup = document.getElementById('popup');
  if (task) {
    let assignedHTML = getAssignedHTML(task);
    let subtasksHTML = getSubtasksHTML(task);
    let categoryBackground = getCategoryBg(task);
    const priorityIconSrc = getPriorityIcon(task.priority);
    document.body.style.overflow = 'hidden';
    popup.innerHTML = getPopupContentHtml(task,taskKey, assignedHTML, subtasksHTML, categoryBackground,priorityIconSrc);
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
  return /*html*/`
     <div class="popup-header">
      <div style="${categoryBg}" class="tag-container" id="tag-container">
        <span class="tag" id="Tag">${task.category}</span>
      </div>
      <button class="close-button" type="button" onclick="closePopup()">
        <img src="assets/icons/cancel.svg" alt="Close" class="close-icon" />
      </button>
    </div>
    <div class="popup-info">
      <h1>${task.title || 'No Title'}</h1>
      <h5 class="popup-subtitle">${task.description || 'No description provided.'}</h5>
      <div class="info-item-date">
        <span class="label">Due date:</span>
        <span class="value">${task.due_date || 'No due date'}</span>
      </div>
      <div id="priority-container" class="priority-container">
        <span class="label">Priority:</span>
        <div class="priority-lable-container">
          <span id="priority-label">${task.priority || 'No Priority'}</span>
          ${checkImgAvailable(priorityIconSrc, task.priority)}
        </div>
      </div>
      <div class="info-item-assigned">
        <span class="label">Assigned To:</span>
        <div id="assignee-container" class="assignee-container">${assignedHTML}</div>
      </div>
      <div class="popup-subtasks">
        <span class="subtasks-label">Subtasks:</span>
        <div class="subtasks-list" id="subtasks-list">
          ${subtasksHTML}
        </div>
      </div>
    </div>
    <div class="popup-actions">
      <div class="action-box delete" onclick="deleteTask(${taskKey})">
        <div class="delete-icon">
          <img src="assets/icons/paperbasketdelet.svg" alt="Delete" id="delete_icon" />
        </div>
        <span class="delete-btn">Delete</span>
      </div>

      <div>
        <img src="assets/icons/vector-horizontal-3.svg" alt="horizontal dividing line" />
      </div>
      <div class="action-box edit" onclick="editPopupTask('${taskKey}')">
        <div class="edit-icon">
          <img src="assets/icons/edit.svg" alt="Edit" id="edit_icon" />
        </div>
        <span class="edit-btn">Edit</span>
      </div>
    </div>
  `;
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
  updateEditSubtaskDisplay();

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