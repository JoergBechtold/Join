/**
 * Creates a new group object based on a given letter.
 * This object includes elements for the letter group header, a line divider, and a container for contacts.
 *
 * @param {string} letter - The letter to use as the group header.
 * @returns {Object} An object with the following properties:
 *   - letterGroup: The div element representing the header for the letter.
 *   - newLine: The div element representing a line divider.
 *   - contactContainer: The div element that will contain the contact elements.
 */
function createNewGroup(letter) {
  const newGroup = {};
  newGroup.letterGroup = document.createElement('div');
  newGroup.letterGroup.classList.add('letter-group');
  newGroup.letterGroup.setAttribute('data-letter', letter);
  newGroup.letterGroup.textContent = letter;
  newGroup.newLine = document.createElement('div');
  newGroup.newLine.classList.add('line');
  newGroup.contactContainer = document.createElement('div');
  newGroup.contactContainer.classList.add('contact-container');
  return newGroup;
}

/**
 * Inserts a new group into the contact list in sorted order.
 * It finds the next existing group whose header letter is greater than the provided letter,
 * and inserts the new group's elements before it. If no such group exists, the new group is appended.
 *
 * @param {HTMLElement} contactList - The container element for the contact list.
 * @param {string} letter - The letter representing the new group's header.
 * @param {Object} groupElements - An object containing the new group elements produced by createNewGroup.
 * @returns {HTMLElement} The contact container element of the inserted group.
 */
function insertNewGroup(contactList, letter, groupElements) {
  const groups = [].slice.call(document.querySelectorAll('.letter-group'));
  const nextGroup = groups.find((g) => g.textContent > letter);
  if (nextGroup) {
    contactList.insertBefore(groupElements.letterGroup, nextGroup);
    contactList.insertBefore(groupElements.newLine, nextGroup);
    contactList.insertBefore(groupElements.contactContainer, nextGroup);
  } else {
    contactList.appendChild(groupElements.letterGroup);
    contactList.appendChild(groupElements.newLine);
    contactList.appendChild(groupElements.contactContainer);
  }
  return groupElements.contactContainer;
}

/**
 * Retrieves an existing group container based on the provided letter or creates one if it doesn't exist.
 *
 * @param {string} letter - The letter to group the contacts by.
 * @returns {HTMLElement} The contact container element for the group.
 */
function getOrCreateGroupContainer(letter) {
  const contactList = document.querySelector('.contact-list'),
        existingGroup = document.querySelector(`.letter-group[data-letter="${letter}"]`);
  let contactContainer;
  if (!existingGroup) {
    const newGroup = createNewGroup(letter);
    contactContainer = insertNewGroup(contactList, letter, newGroup);
  } else {
    // The contact container is assumed to be two siblings after the letter header.
    contactContainer = existingGroup.nextElementSibling.nextElementSibling;
  }
  return contactContainer;
}

/**
 * Builds a contact element with the provided name, email, phone, and color.
 * It creates the contact element, avatar, and information sub-elements, then appends them.
 *
 * @param {string} name - The contact's full name.
 * @param {string} email - The contact's email address.
 * @param {string} phone - The contact's phone number.
 * @param {string} color - The background color for the contact's avatar.
 * @returns {HTMLElement|null} The constructed contact element or null if an error occurs.
 */
function buildContactElement(name, email, phone, color) {
  try {
    const contact = document.createElement('div');
    contact.classList.add('contact');
    contact.setAttribute('data-phone', phone);
    contact.setAttribute('onclick', 'showContactDetail()');
    const avatar = createContactAvatar(name, color);
    const info = createContactInfo(name, email);
    contact.appendChild(avatar);
    contact.appendChild(info);
    return contact;
  } catch (error) {
    console.error('Error in buildContactElement:', error);
    return null;
  }
}

/**
 * Creates a contact avatar element using the contact's name and a specified background color.
 * If the color is not provided, logs an error and defaults to gray.
 *
 * @param {string} name - The contact's full name.
 * @param {string} color - The background color for the avatar.
 * @returns {HTMLElement} The contact avatar element.
 */
function createContactAvatar(name, color) {
  try {
    const avatar = document.createElement('div');
    avatar.classList.add('contact-avatar');
    if (!color) {
      console.error('No color available. Contact will be created without color.');
      color = '#808080';
    }
    avatar.style.backgroundColor = color;
    avatar.setAttribute('data-color', color);
    avatar.textContent = name
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase())
      .join('');
    return avatar;
  } catch (error) {
    console.error('Error in createContactAvatar:', error);
    return document.createElement('div');
  }
}

/**
 * Creates a contact info element containing the contact's name and email.
 *
 * @param {string} name - The contact's full name.
 * @param {string} email - The contact's email address.
 * @returns {HTMLElement} The contact info element.
 */
function createContactInfo(name, email) {
  try {
    const info = document.createElement('div');
    info.classList.add('contact-info');
    const namePara = document.createElement('p');
    namePara.classList.add('contact-name');
    namePara.textContent = name;
    const emailLink = document.createElement('a');
    emailLink.classList.add('contact-email');
    emailLink.textContent = email;
    info.appendChild(namePara);
    info.appendChild(emailLink);
    return info;
  } catch (error) {
    console.error('Error in createContactInfo:', error);
    return document.createElement('div');
  }
}

/**
 * Inserts a contact element into the container in sorted order based on the contact's name.
 *
 * @param {HTMLElement} container - The container element that holds contact elements.
 * @param {HTMLElement} contactEl - The contact element to insert.
 * @param {string} name - The contact's full name used for sorting.
 */
function insertContactSorted(container, contactEl, name) {
  try {
    const contacts = [].slice.call(container.querySelectorAll('.contact'));
    const next = contacts.find((c) => c.querySelector('.contact-name').textContent.trim() > name);
    if (next) {
      container.insertBefore(contactEl, next);
    } else {
      container.appendChild(contactEl);
    }
  } catch (error) {
    console.error('Error in insertContactSorted:', error);
  }
}
