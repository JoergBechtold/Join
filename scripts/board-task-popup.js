function openPopup(taskKey) {
  let tasks = JSON.parse(sessionStorage.getItem("tasks"));
  let task = tasks ? tasks[taskKey] : null;
  let popupContainer = document.getElementById("popupContainer");
  let popup = document.getElementById("popup");

  if (task) {
    let assignedHTML = "";
    if (task.assigned_to) {
      const assignedContacts = Object.values(task.assigned_to);
      assignedContacts.forEach(contact => {
        assignedHTML += `
          <div class="assigned-contact" style="background-color:${contact.randomColor};">
            ${contact._initials}
          </div>
        `;
      });
    } else {
      assignedHTML = "<span>No contacts assigned</span>";
    }

    let subtasksHTML = "";
    if (task.subtasks) {
      const subtasksArr = Object.values(task.subtasks);
      subtasksArr.forEach(subtask => {
        subtasksHTML += `<li>${subtask}</li>`;
      });
    } else {
      subtasksHTML = "<li>No subtasks</li>";
    }

    let categoryBg = "";
    if (task.category === "User Story") {
      categoryBg = "background-color: #0038FF;";
    } else if (task.category === "Technical Task") {
      categoryBg = "background-color: #1FD7C1;";
    }

    popup.innerHTML = `
      <div class="popup-header">
        <div style="${categoryBg}" class="tag-container" id="tag-container">
          <span class="tag" id="Tag">${task.category}</span>
        </div>
        <button class="close-button" type="button" onclick="closePopup()">
          <img src="./assets/icons/close.png" alt="Close" class="close-icon" />
        </button>
      </div>
      <div class="popup-info">
        <h1>
          ${task.title || "No Title"}
        </h1>
        <h5 class="popup-subtitle">
          ${task.description || "No description provided."}
        </h5>
        <div class="info-item-date">
          <span class="label">Due date:</span>
          <span class="value">${task.due_date || "No due date"}</span>
        </div>
        <div id="priority-container">
          <span class="label">Priority:</span>
          <div class="priority-lable-container">
            <span id="priority-label">${task.priority || "No Priority"}</span>
            <img id="priority-icon" />
          </div>
        </div>
        <div class="info-item-assigned">
          <span class="label">Assigned To:</span>
          <div id="assignee-container">${assignedHTML}</div>
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
      </div>
    `;
  } else {
    popup.innerHTML = `
      <div class="popup-header">
        <h2>Task Not Found</h2>
        <button class="close-button" onclick="closePopup()">X</button>
      </div>
    `;
  }

  popupContainer.style.display = "flex";
  document.getElementById("overlay").style.display = "block";
}

function closePopup() {
  document.getElementById("popupContainer").style.display = "none";
  document.getElementById("overlay").style.display = "none";
}
