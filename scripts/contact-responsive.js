/**
 * Displays the contact detail view on mobile devices.
 * If the window width is 768px or less, this function updates the display styles of various elements
 * so that the contact detail view is visible and the contact list and sidebar are hidden.
 */
function showContactDetail() {
  if (window.innerWidth <= 1024) {
    document.querySelector('.main-content').style.display = 'flex';
    document.querySelector('.contact-list').style.display = 'none';
    document.querySelector('.sidebarContact').style.display = 'none';
    document.querySelector('.contact-detail').style.display = 'flex';
    document.querySelector('.original-h1').style.display = 'none';
  }
}

/**
 * Hides the contact detail view on mobile devices.
 * If the window width is 768px or less, this function updates the display styles of various elements
 * so that the contact detail view is hidden and the contact list and sidebar are shown.
 */
function hideContactDetail() {
  if (window.innerWidth <= 1024) {
    document.querySelector(".contacts-container").style.display = "flex";
    document.querySelector('.sidebarContact').style.display = 'flex';
    document.querySelector(".contact-list").style.display = "flex";
    document.querySelector(".main-content").style.display = "none";
    document.querySelector(".contact-detail").style.display = "none";
    document.querySelector('.original-h1').style.display = 'flex';
  }
}

/**
 * Toggles the display of the responsive actions element associated with a button.
 * This function stops event propagation and toggles the display style of the '.action-responsive' element
 * located within the button's parent container.
 *
 * @param {HTMLElement} btn - The button that was clicked to toggle actions.
 * @param {Event} event - The event object from the click.
 */
function toggleActions(btn, event) {
  event.stopPropagation();

  let container = btn.parentNode;
  let actionsEl = container.querySelector('.action-responsive');

  if (actionsEl.style.display === 'flex') {
    actionsEl.style.display = 'none';
  } else {
    actionsEl.style.display = 'flex';
  }
}

/**
 * Hides all responsive actions elements.
 * This function loops through all elements with the class 'action-responsive'
 * and sets their display style to 'none'.
 */
function hideAllActions() {
  let actionsList = document.getElementsByClassName('action-responsive');
  for (let i = 0; i < actionsList.length; i++) {
    actionsList[i].style.display = 'none';
  }
}
