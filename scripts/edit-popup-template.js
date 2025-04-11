/**
 * Generates the HTML markup for the task preview section inside the edit popup.
 * Displays category, title, description, due date, priority, assigned contacts, and subtasks.
 *
 * @param {Object} task - The task object containing all relevant task data.
 * @param {string} assignedHTML - The HTML string representing assigned contacts.
 * @param {string} subtasksHTML - The HTML string representing subtasks.
 * @param {string} categoryBg - The inline background-color style for the category tag.
 * @param {string} priorityIcon - The URL path to the priority icon image.
 * @returns {string} The complete HTML string for the edit popup preview section.
 */
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
  