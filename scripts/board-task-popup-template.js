/**
 * Generates the HTML markup for the board task popup.
 * Includes task metadata such as category, title, description, due date, priority, assigned contacts, and subtasks.
 *
 * @param {Object} task - The task object containing all task-related data.
 * @param {string} taskKey - The unique key of the task used for identifying and interacting with it.
 * @param {string} assignedHTML - The rendered HTML for the assigned contacts section.
 * @param {string} subtasksHTML - The rendered HTML for the subtasks section.
 * @param {string} categoryBg - The inline CSS background-color for the task category tag.
 * @param {string} priorityIconSrc - The image source path for the task's priority icon.
 * @returns {string} The complete HTML string for the task popup.
 */
function generateBoardPopupHTML(task, taskKey, assignedHTML, subtasksHTML, categoryBg, priorityIconSrc, ) {
  return `
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
      <div class="action-box delete" onclick="deleteTaskFromBoardPopup('${taskKey}')">
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

/**
 * Generates the HTML for displaying assigned contacts in the board popup.
 * Matches initials from the task data with contact details from the contact list.
 *
 * @param {Array} assignedTo - An array of assigned contact objects containing initials and color info.
 * @param {Object} allContacts - A dictionary of all contacts with their full data.
 * @returns {string} The generated HTML string representing the assigned contacts.
 */
function generateAssignedHTML(assignedTo = [], allContacts = {}) {
    if (!Array.isArray(assignedTo) || assignedTo.length === 0) {
      return '<span>No contacts assigned</span>';
    }
    let html = '';
    const contactList = Object.values(allContacts);
    assignedTo.forEach((assignedItem) => {
      const foundContact = contactList.find(c => c.initials === assignedItem.initials);
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
    return html;
}
  
/**
 * Generates the HTML for displaying a list of subtasks with checkbox status.
 * Uses subtask data to build visual elements for each item in the list.
 *
 * @param {Array} subtasks - An array of subtask objects or strings.
 * @returns {string} The generated HTML string for the subtasks section.
 */
function generateSubtasksHTML(subtasks = []) {
    if (!Array.isArray(subtasks) || subtasks.length === 0) {
      return '<span>No subtasks</span>';
    }
    return subtasks
      .map(subtask => {
        const title = subtask.title || subtask;
        const isChecked = subtask.completed;
        const checkboxImg = isChecked
          ? 'assets/icons/checkbox-checked.svg'
          : 'assets/icons/checkbox-empty.svg';
        return `
          <div class="subtasks-elements-container" onclick="toggleSubtaskCheckbox(this)">
            <img class="subtask-checkbox-img" src="${checkboxImg}" alt="Checkbox" />
            <span>${title}</span>
          </div>`;
      })
      .join('');
}

/**
 * Renders a fallback message in the popup when a task cannot be found.
 *
 * @param {HTMLElement} popup - The popup container element.
 */
function renderTaskNotFound(popup) {
  popup.innerHTML = `
    <div class="popup-header">
      <h2>Task Not Found</h2>
      <button class="close-button" onclick="closePopup()">X</button>
    </div>
  `;
}  