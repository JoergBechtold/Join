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


function resetActiveButton() {
  if (activeButton) {
    activeButton.classList.remove('active-prio', 'red-prio', 'orange-prio', 'green-prio');
    const prevImg = document.getElementById(activeButton.id + '_img');
    if (prevImg) {
      prevImg.src = prevImg.src.replace('-event', '');
    }
  }
}

function activateButton(button) {
  activeButton = button;
  button.classList.add('active-prio');
  const buttonType = button.id.split('_')[0];
  updateButtonStyle(buttonType);
}

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

function clearButtons() {
    if (activeButton) {
      resetActiveButton();
    }
}