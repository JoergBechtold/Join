let activeButton = null;

/**
 * Sets the selected priority button as active while deactivating others.
 *
 * @param {string} buttonId - ID of the clicked priority button (must match HTML ID)
 * @returns {void}
 */
function setPriority(buttonId) {
  const button = document.getElementById(buttonId);
  activeButton = document.getElementById('medium_button');
  console.log('Current activeButton:', activeButton); 
  if (activeButton.id  === 'medium_button') {
    resetMediumButton();
  } 
  activateButton(button);
  deactivateOtherButtons(buttonId)
  activeButton = button;
}

/**
 * Resets the medium priority button to its default inactive state.
 *
 * This function removes the active styles and classes from the medium button
 * and updates its associated image to remove the "-event" suffix if present.
 *
 * @returns {void}
 */
function resetMediumButton() {
  const mediumButton = document.getElementById('medium_button'); 
  if (mediumButton) {
    mediumButton.classList.remove('active-prio', 'orange-prio');
    const mediumImg = document.getElementById('medium_button_img');
    if (mediumImg) {
      mediumImg.src = mediumImg.src.replace('-event', ''); 
    }
  }
}

/**
 * Activates the specified priority button by adding appropriate styles and updating its associated image.
 *
 * This function visually marks the button as active by applying the `active-prio` class,
 * along with a color-specific class based on the button's ID. Additionally, it updates
 * the button's associated image to include the "-event" suffix, ensuring this change
 * is applied only once.
 *
 * @param {HTMLElement} button - The button element to activate.
 * @returns {void}
 */
function activateButton(button) {
  button.classList.add('active-prio');
  if (button.id === 'urgent_button') {
    button.classList.add('red-prio');
  } else if (button.id === 'medium_button') {
    button.classList.add('orange-prio');
  } else if (button.id === 'low_button') {
    button.classList.add('green-prio');
  }
  const img = document.getElementById(button.id + '_img');
  if (img) {
    if (!img.src.includes('-event')) {
      img.src = img.src.replace('.svg', '-event.svg'); 
    } else {
    }
  } 
}

/**
 * Deactivates all priority buttons except the currently active one.
 *
 * This function iterates through a predefined list of button IDs, checks if each button
 * is not the currently active button, and removes all active-related styles and classes
 * from those buttons. Additionally, it updates the associated images to remove the "-event"
 * suffix if present.
 *
 * @param {string} activeButtonId - The ID of the currently active button (must match HTML ID).
 * @returns {void}
 */
function deactivateOtherButtons(activeButtonId) {
  const allButtons = ['urgent_button', 'medium_button', 'low_button'];
  allButtons.forEach(buttonId => {
    if (buttonId !== activeButtonId) {
      const button = document.getElementById(buttonId);
      const img = document.getElementById(buttonId + '_img');
      button.classList.remove('active-prio', 'red-prio', 'orange-prio', 'green-prio');
      if (img && img.src.includes('-event')) {
        img.src = img.src.replace('-event', '');
      }
    }
  });
}

/**
 * Resets all priority buttons to their default inactive state and reactivates the medium button.
 *
 * This function iterates through all priority buttons, removes active-related styles and classes,
 * and resets their associated images to their default state (removing the "-event" suffix if present).
 * After clearing all buttons, it calls `activateMediumButton()` to reactivate the medium button.
 *
 * @returns {void}
 */
function clearButtons() {
  const allButtons = ['urgent_button', 'medium_button', 'low_button'];
  allButtons.forEach(buttonId => {
    const button = document.getElementById(buttonId);
    const img = document.getElementById(buttonId + '_img');
    button.classList.remove('active-prio', 'red-prio', 'orange-prio', 'green-prio');
    if (img && img.src.includes('-event')) {
      img.src = img.src.replace('-event', '');
    }
  });
  activateMediumButton();
}

/**
 * Activates the medium priority button by adding appropriate styles and updating its associated image.
 *
 * This function sets the medium button as active by applying the `active-prio` and `orange-prio` classes
 * and ensures that its associated image includes the "-event" suffix.
 *
 * @returns {void}
 */
function activateMediumButton() {
  const mediumButton = document.getElementById('medium_button');
  const mediumImg = document.getElementById('medium_button_img');
  mediumButton.classList.add('active-prio', 'orange-prio');
  if (mediumImg && !mediumImg.src.includes('-event')) {
    mediumImg.src = mediumImg.src.replace('.svg', '-event.svg');
  }
  activeButton = mediumButton;
}




