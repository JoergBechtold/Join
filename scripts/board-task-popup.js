function getAssignedHTML(task) {
  let html = "";
  if (task.assigned_to) {
    const contacts = Object.values(task.assigned_to);
    contacts.forEach(contact => {
      html += `<div class="assigned-contact" style="background-color:${contact.randomColor};">
                 ${contact._initials || contact.initials}
               </div>`;
    });
  } else {
    html = "<span>No contacts assigned</span>";
  }
  return html;
}

function getSubtasksHTML(task) {
  let html = "";
  if (task.subtasks) {
    Object.values(task.subtasks).forEach(subtask => { html += `<li>${subtask}</li>`; });
  } else {
    html = "<li>No subtasks</li>";
  }
  return html;
}

function getCategoryBg(task) {
  if (task.category === "User Story") return "background-color: #0038FF;";
  if (task.category === "Technical Task") return "background-color: #1FD7C1;";
  return "";
}

function getPopupContent(task, assignedHTML, subtasksHTML, categoryBg) {
  return `<div class="popup-header">
            <div style="${categoryBg}" class="tag-container" id="tag-container">
              <span class="tag" id="Tag">${task.category}</span>
            </div>
            <button class="close-button" type="button" onclick="closePopup()">
              <img src="./assets/icons/close.png" alt="Close" class="close-icon" />
            </button>
          </div>
          <div class="popup-info">
            <h1>${task.title || "No Title"}</h1>
            <h5 class="popup-subtitle">${task.description || "No description provided."}</h5>
            <div class="info-item-date">
              <span class="label">Due date:</span>
              <span class="value">${task.due_date || "No due date"}</span>
            </div>
            <div id="priority-container" class="priority-container">
              <span class="label">Priority:</span>
              <div class="priority-lable-container">
                <span id="priority-label">${task.priority || "No Priority"}</span>
                <img id="priority-icon" />
              </div>
            </div>
            <div class="info-item-assigned">
              <span class="label">Assigned To:</span>
              <div id="assignee-container" class="assignee-container">${assignedHTML}</div>
            </div>
            <div class="popup-subtasks">
              <span class="subtasks-label">Subtasks:</span>
              <ul class="subtasks-list" id="subtasks-list">${subtasksHTML}</ul>
            </div>
          </div>
          <div class="popup-actions">
            <button class="action-button" type="button" onclick="deleteTask()">
              <img src="./assets/icons/delete.png" alt="Delete" class="action-icon" />
              <span class="action-label">Delete</span>
            </button>
            <img src="./assets/icons/high-stroke-gray.png" alt="Separator" class="action-separator" />
            <button class="action-button" type="button" onclick="editTask()">
              <img src="./assets/icons/edit-black.png" alt="Edit" class="action-icon" />
              <span class="action-label">Edit</span>
            </button>
          </div>`;
}

function openPopup(taskKey) {
  let tasks = JSON.parse(sessionStorage.getItem("tasks")),
      task = tasks ? tasks[taskKey] : null,
      popupContainer = document.getElementById("popupContainer"),
      popup = document.getElementById("popup");
  if (task) {
    let a = getAssignedHTML(task),
        s = getSubtasksHTML(task),
        c = getCategoryBg(task);
    popup.innerHTML = getPopupContent(task, a, s, c);
  } else {
    popup.innerHTML = `<div class="popup-header">
                         <h2>Task Not Found</h2>
                         <button class="close-button" onclick="closePopup()">X</button>
                       </div>`;
  }
  popupContainer.style.display = "flex";
  document.getElementById("overlay").style.display = "block";
}

function closePopup() {
  document.getElementById("popupContainer").style.display = "none";
  document.getElementById("overlay").style.display = "none";
}
