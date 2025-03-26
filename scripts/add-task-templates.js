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

function subtasksItem(subtask, index) {
  return `
      <div class="subtask-item">
        <span class="subtask-text" ondblclick="editSubtask(${index})">• ${subtask}</span>
        <div class="subtask-icons">
          <img src="assets/icons/edit.svg" alt="Edit" class="subtask-icon edit-icon" onclick="editSubtask(${index})">
          <div class="vertical-line-subtask-dark"></div>
          <img src="assets/icons/paperbasketdelet.svg" alt="Delete" class="subtask-icon delete-icon" onclick="deleteSubtask(${index})">
        </div>
      </div>
    `;
}
