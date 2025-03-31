let activeButton = null;

/**
 * Toggles the active state of a button by its ID.
 * If another button is already active, it resets the active button
 * before activating the new one. Clicking the same button again deactivates it.
 *
 * @param {string} buttonId - The ID of the button to activate or deactivate.
 */
function setPriority(buttonId) {
  const button = document.getElementById(buttonId);
  if (activeButton) {
    resetActiveButton();
  }
  if (activeButton !== button) {
    activateButton(button);
  } else {
    activeButton = null;
  }
}

/**
 * Resets the currently active button by removing its priority-related CSS classes
 * and restoring the original image source if an associated image exists.
 *
 * This function ensures that the previously active button is visually reset
 * to its default state.
 */
function resetActiveButton() {
  if (activeButton) {
    activeButton.classList.remove('active-prio', 'red-prio', 'orange-prio', 'green-prio');
    const prevImg = document.getElementById(activeButton.id + '_img');
    if (prevImg) {
      prevImg.src = prevImg.src.replace('-event', '');
    }
  }
}

/**
 * Activates a button by setting it as the currently active button,
 * applying priority-related CSS classes, and updating its style based on its type.
 *
 * @param {HTMLElement} button - The button element to activate.
 */
function activateButton(button) {
  activeButton = button;
  button.classList.add('active-prio');
  const buttonType = button.id.split('_')[0];
  updateButtonStyle(buttonType);
}

/**
 * Updates the style of the currently active button based on its priority type.
 * Adds the corresponding CSS class to the button and updates the associated icon image.
 *
 * @param {string} buttonType - The priority type of the button (e.g., "urgent", "medium", "low").
 *                              This determines the CSS class and icon to apply.
 */
function updateButtonStyle(buttonType) {
  const prioStyles = {
    urgent: ['red-prio', 'high'],
    medium: ['orange-prio', 'medium'],
    low: ['green-prio', 'low'],
  };
  const [className, iconType] = prioStyles[buttonType];
  activeButton.classList.add(className);
  document.getElementById(activeButton.id + '_img').src = `/assets/icons/prio-${iconType}-event.svg`;
}

/**
 * Clears the active button by resetting its state.
 * If there is a currently active button, its priority-related styles and associated changes are removed.
 */
function clearButtons() {
  if (activeButton) {
      resetActiveButton();
  }
}
