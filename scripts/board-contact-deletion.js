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
  
  