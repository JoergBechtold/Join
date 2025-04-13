/**
 * Generates the HTML for a custom select option representing a contact.
 * The option includes the contact's initials, name, and a checkbox icon.
 *
 * @param {Object} contacts - An object containing the contact's details.
 * @param {string} contacts.initials - The initials of the contact (default: 'NN' if not provided).
 * @param {string} contacts.contactColor - The background color for the initials circle.
 * @param {string} contacts.firstname - The first name of the contact.
 * @param {string} contacts.lastname - The last name of the contact.
 * @returns {string} The generated HTML string for the custom select option.
 */
function contactsCustomSelectOptionHtml(contacts) {
  const initials = contacts.initials || 'NN';
  return `
      <div class="contacts-custom-select-option" onclick="toggleSelectedContact(this)">
        <div class="name-and-img">
          <div class="circle-and-name">
            <div class="circle" style="background-color: ${contacts.contactColor};">
              ${initials}
            </div>
            <div>${contacts.firstname} ${contacts.lastname}</div>
          </div>
          <div>
            <img src="assets/icons/Square_box.svg" alt="Checkbox">
          </div>
        </div>
      </div>
    `;
}

/**
 * Generates the HTML for a subtask item, including its text and action icons
 * for editing and deleting the subtask.
 *
 * @param {string} subtask - The text of the subtask to display.
 * @param {number} index - The index of the subtask in the list (used for event handling).
 * @returns {string} The generated HTML string for the subtask item.
 */
function subtasksItem(subtask, index) {
  return `
      <div class="subtask-item">
        <span class="subtask-text" ondblclick="editSubtask(${index})">• ${subtask.title}</span>
        <div class="subtask-icons">
          <img src="assets/icons/edit.svg" alt="Edit" class="subtask-icon edit-icon" onclick="editSubtask(${index})">
          <div class="vertical-line-subtask-dark"></div>
          <img src="assets/icons/paperbasketdelet.svg" alt="Delete" class="subtask-icon delete-icon" onclick="deleteSubtask(${index})">
        </div>
      </div>
    `;
}

