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

  /**
 * Generates the HTML for the contact selection list in the edit task popup.
 *
 * @param {Object} data - The contact data object loaded from the database.
 * @param {Array} selectedEditContacts - The currently selected contacts.
 * @returns {string} The generated HTML string for the contact dropdown.
 */
  function generateEditContactsHTML(data, selectedEditContacts) {
    if (!data || Object.keys(data).length === 0) {
      return '<div class="error-select-option">No contacts found.</div>';
    }
  
    return Object.values(data)
      .map((contact) => {
        const initials = contact.initials || '';
        const contactColor = contact.contactColor || contact.randomColor || '#ccc';
  
        const isSelected = selectedEditContacts.some(
          (c) => c.initials === initials && c.contactColor === contactColor
        );      
  
        const checkboxSrc = isSelected
          ? 'assets/icons/checked_box.svg'
          : 'assets/icons/Square_box.svg';
  
        const selectedClass = isSelected
          ? 'contacts-custom-select-option-selected'
          : 'contacts-custom-select-option';
  
        return `
          <div class="${selectedClass}" onclick="toggleEditSelectedContact(this)">
            <div class="name-and-img">
              <div class="circle-and-name">
                <div class="circle" style="background-color: ${contactColor};">
                  ${initials}
                </div>
                <div>${contact.firstname} ${contact.lastname}</div>
              </div>
              <div>
                <img src="${checkboxSrc}" alt="Checkbox">
              </div>
            </div>
          </div>
        `;
      })
      .join('');
  }  