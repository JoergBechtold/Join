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
      html += `<li>${subtask}</li>`;
    });
  } else {
    html = '<li>No subtasks</li>';
  }
  return html;
}

function getCategoryBg(task) {
  if (task.category === 'User Story') return 'background-color: #0038FF;';
  if (task.category === 'Technical Task') return 'background-color: #1FD7C1;';
  return '';
}

function openPopup(taskKey) {
  let tasks = JSON.parse(sessionStorage.getItem('tasks')),
    task = tasks ? tasks[taskKey] : null,
    popupContainer = document.getElementById('popupContainer'),
    popup = document.getElementById('popup');
  if (task) {
    let assignedHTML = getAssignedHTML(task),
      subtasksHTML = getSubtasksHTML(task),
      categoryBackground = getCategoryBg(task);
    popup.innerHTML = getPopupContent(task, assignedHTML, subtasksHTML, categoryBackground);
  } else {
    popup.innerHTML = `<div class="popup-header">
                         <h2>Task Not Found</h2>
                         <button class="close-button" onclick="closePopup()">X</button>
                       </div>`;
  }
  popupContainer.style.display = 'flex';
  document.getElementById('overlay').style.display = 'block';
}

function getPriorityIcon(priority) {
  if (priority === 'low') {
    return './assets/icons/prio-low.svg';
  } else if (priority === 'medium') {
    return './assets/icons/prio-medium.svg';
  } else if (priority === 'urgent') {
    return './assets/icons/prio-high.svg';
  }
}

function getPopupContent(task, assignedHTML, subtasksHTML, categoryBg) {
  const priorityIconSrc = getPriorityIcon(task.priority);

  return ` <div class="popup-header">
      <div style="${categoryBg}" class="tag-container" id="tag-container">
        <span class="tag" id="Tag">${task.category}</span>
      </div>
      <button class="close-button" type="button" onclick="closePopup()">
        <img src="./assets/icons/close.png" alt="Close" class="close-icon" />
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
          <img id="priority-icon" src="${priorityIconSrc}" alt="${task.priority || 'No Priority'}" />
        </div>
      </div>
      <div class="info-item-assigned">
        <span class="label">Assigned To:</span>
        <div id="assignee-container" class="assignee-container">${assignedHTML}</div>
      </div>
      <div class="popup-subtasks">
        <span class="subtasks-label">Subtasks:</span>
        <ul class="subtasks-list" id="subtasks-list">
          ${subtasksHTML}
        </ul>
      </div>
    </div>
    <div class="popup-actions">
      <div class="action-box delete" onclick="deleteTask()">
        <div class="delete-icon">
          <img src="assets/icons/paperbasketdelet.svg" alt="Delete" id="delete_icon" />
        </div>
        <span class="delete-btn">Delete</span>
      </div>
      <div class="action-box edit" onclick="editTask()">
        <div class="edit-icon">
          <img src="assets/icons/edit-black.png" alt="Edit" id="edit_icon" />
        </div>
        <span class="edit-btn">Edit </span>
      </div>
    </div> `;
}

function closePopup() {
  document.getElementById('popupContainer').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
}
