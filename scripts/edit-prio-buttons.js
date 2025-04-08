let activeEditButton = null;

/**
 * Sets the active priority button for the edit task view.
 * @param {string} buttonId - The ID of the button to activate.
 */
function setEditPriority(buttonId) {
  const button = document.getElementById(buttonId);
  if (!button) {
    console.warn(`Priority button with ID "${buttonId}" not found.`);
    return;
  }
  if (activeEditButton) {
    resetActiveEditButton();
  }
  if (activeEditButton !== button) {
    activateEditButton(button);
  } else {
    activeEditButton = null;
  }
}

/**
 * Resets the currently active edit priority button.
 */
function resetActiveEditButton() {
  if (activeEditButton) {
    activeEditButton.classList.remove('active-prio', 'red-prio', 'orange-prio', 'green-prio');
    const prevImg = document.getElementById(activeEditButton.id.replace('button', 'img'));
    if (prevImg) {
      prevImg.src = prevImg.src.replace('-event', '');
    }
  }
}

/**
 * Activates an edit priority button and updates styles.
 * @param {HTMLElement} button - The button element to activate.
 */
function activateEditButton(button) {
  activeEditButton = button;
  button.classList.add('active-prio');
  const buttonType = button.id.split('_')[1];
  updateEditButtonStyle(buttonType);
}

/**
 * Updates the style for the currently active edit priority button.
 * @param {string} buttonType - The type of the priority (urgent, medium, low).
 */
function updateEditButtonStyle(buttonType) {
  const prioStyles = {
    urgent: ['red-prio', 'high'],
    medium: ['orange-prio', 'medium'],
    low: ['green-prio', 'low'],
  };
  const [className, iconType] = prioStyles[buttonType];
  activeEditButton.classList.add(className);
  const icon = document.getElementById(`edit_${buttonType}_img`);
  if (icon) {
    icon.src = `assets/icons/prio-${iconType}-event.svg`;
  }
}

/**
 * Clears the active edit priority button.
 */
function clearEditButtons() {
  if (activeEditButton) {
    resetActiveEditButton();
  }
}
