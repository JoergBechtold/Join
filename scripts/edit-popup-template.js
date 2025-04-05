function generateEditPreviewHTML(task, assignedHTML, subtasksHTML, categoryBg, priorityIcon) {
    return `
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
  