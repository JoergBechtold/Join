let customConfirmResolve = null;

/**
 * Removes a contact from the tasks and updates the board accordingly.
 * @param {string} contactInitials - The initials of the contact to be deleted.
 */
async function updateTasksAfterContactDeletion(contactInitials) {
    try {
      const tasks = await loadData(PATH_TO_TASKS);
      for (const [taskKey, task] of Object.entries(tasks)) {
        task.assigned_to = task.assigned_to.filter(contact => contact.initials !== contactInitials);
        await updateData(`${PATH_TO_TASKS}/${taskKey}`, task);
      }
      renderCards();
    } catch (error) {
      console.error('Error updating tasks:', error);
    }
  }
  
  /**
   * Handles the deletion of a contact, confirms the action, and updates tasks.
   * @param {HTMLElement} deleteBtn - The delete button element for the contact.
   */
  async function processContactDeletion(deleteBtn) {
    const contactDiv = getContactDiv(deleteBtn);
    if (!contactDiv) {
      console.error('No valid contact to delete.');
      return Promise.resolve(false);
    }
    const contactInitials = contactDiv.querySelector('.contact-initials').textContent.trim();
    const success = await confirmAndDeleteContact(contactDiv);
    if (success) {
      await updateTasksAfterContactDeletion(contactInitials);
    }
    return success;
  }

  /**
 * Deletes a task from Firebase and updates the UI accordingly.
 * Prompts the user for confirmation before proceeding with deletion.
 * @param {string} taskKey - The unique key of the task to be deleted.
 */
async function deleteTaskFromBoardPopup(taskKey) {
  if (!taskKey) {
    console.error('No task key provided.');
    return false;
  }
  const confirmed = await showConfirmDialog('Do you really want to delete this task?');
  if (!confirmed) return false;
  try {
    await deleteData(`tasks/`, `${taskKey}`);
    closePopup();
    await renderCards();
    return true;
  } catch (err) {
    console.error('Task deletion failed:', err);
    return false;
  }
}

/**
 * Displays the custom confirm popup and returns a Promise.
 * @param {string} message - The question to display in the popup.
 * @returns {Promise<boolean>} Resolves to true if confirmed, else false.
 */
function showConfirmDialog(message) {
  document.getElementById('popup_container').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';
  return new Promise((resolve) => {
    customConfirmResolve = resolve;
    displayCustomConfirm(message);
  });
}

/**
 * Sets the message and displays the confirmation overlay.
 * @param {string} message - The message to show.
 */
function displayCustomConfirm(message) {
  document.getElementById('custom_confirm_message').textContent = message;
  document.getElementById('custom_confirm_overlay').classList.remove('d-none');
}

/**
 * Handles the confirm or cancel click and resolves the result.
 * @param {boolean} confirmed - Whether the user confirmed.
 */
function handleCustomConfirm(confirmed) {
  document.getElementById('custom_confirm_overlay').classList.add('d-none');
  if (typeof customConfirmResolve === 'function') {
    customConfirmResolve(confirmed);
    customConfirmResolve = null;
  }
}