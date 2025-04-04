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

function getOrCreateGroupContainer(letter) {
  const contactList = document.querySelector('.contact-list'),
        existingGroup = document.querySelector(`.letter-group[data-letter="${letter}"]`);
  let contactContainer;
  if (!existingGroup) {
    const newGroup = createNewGroup(letter);
    contactContainer = insertNewGroup(contactList, letter, newGroup);
  } else {
    contactContainer = existingGroup.nextElementSibling.nextElementSibling;
  }
  return contactContainer;
}

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
  