
let activeContact = null;


function showAddContactPopup() {
  const p = document.querySelector('.container-add');
  p.classList.remove('hidden');
  p.classList.add('active');
  document.querySelector('.overlay').classList.add('active');
}

function closeAddContactPopup() {
  const p = document.querySelector('.container-add');
  p.classList.add('hidden');
  p.classList.remove('active');
  document.querySelector('.overlay').classList.remove('active');
}

function validateEmail(emailInput, container) {
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim());
  let err = container.querySelector('.email-error');
  if (!isValid && emailInput.value.trim() !== '') {
    if (!err) {
      err = document.createElement('span');
      err.className = 'email-error';
      err.style.color = 'red';
      err.textContent = 'Invalid email address';
      emailInput.parentNode.insertBefore(err, emailInput.nextSibling);
    }
  } else if (err) {
    err.remove();
  }
  return isValid;
}

function validateName(nameInput, container) {
  const nameValue = nameInput.value.trim();
  const nameParts = nameValue.split(' ');

  let isValid = false;

  if (nameParts.length === 2) {
    const firstName = nameParts[0].trim();
    const lastName = nameParts[1].trim();

    if (firstName !== '' && lastName !== '') {
      isValid = true;
    }
  }
  let err = container.querySelector('.name-error');
  if (!isValid && nameValue !== '') {
    if (!err) {
      err = document.createElement('span');
      err.className = 'name-error';
      err.style.color = 'red';
      err.textContent = 'Please enter your first and last name with spaces.';
      nameInput.parentNode.insertBefore(err, nameInput.nextSibling);
    }
  } else if (err) {
    err.remove();
  }
  return isValid;
}

function validatePhone(phoneInput, container) {
  const phoneValue = phoneInput.value.trim();
  const isValid = /^\+?[0-9]+$/.test(phoneValue) && phoneValue.length >= 7 && phoneValue.length <= 15;
  let err = container.querySelector('.phone-error');

  if (!isValid && phoneValue !== '') {
    if (!err) {
      err = document.createElement('span');
      err.className = 'phone-error';
      err.style.color = 'red';
      err.textContent = 'Invalid phone number (7-15 digits)';
      phoneInput.parentNode.insertBefore(err, phoneInput.nextSibling);
    }
  } else if (err) {
    err.remove();
  }
  return isValid;
}

function checkInputs() {
  const container = document.querySelector('.container-edit.active') || document.querySelector('.container-add.active');
  if (!container) return;
  const nameIn = container.querySelector('input[placeholder="Firstname Lastname"]'),
    emailIn = container.querySelector('input[placeholder="Email"]'),
    phoneIn = container.querySelector('input[placeholder="Phone"]'),
    btn = container.querySelector('.create-button'),
    validN = validateName(nameIn, container),
    validE = validateEmail(emailIn, container),
    validP = validatePhone(phoneIn, container);

  if (nameIn.value.trim() !== '' && validE && phoneIn.value.trim() !== '' && validP && validN) {
    btn.disabled = false;
    btn.classList.remove('disabled');
  } else {
    btn.disabled = true;
    btn.classList.add('disabled');
  }
}

function getInputValues() {
  const container = document.querySelector('.container-edit.active') || document.querySelector('.container-add.active') || document;
  const n = container.querySelector('input[placeholder="Firstname Lastname"]'),
    e = container.querySelector('input[placeholder="Email"]'),
    p = container.querySelector('input[placeholder="Phone"]');
  return {
    name: n ? n.value.trim() : '',
    email: e ? e.value.trim() : '',
    phone: p ? p.value.trim() : '',
  };
}

function createNewGroup(letter) {
  const newGroup = {};
  newGroup.lg = document.createElement('div');
  newGroup.lg.classList.add('letter-group');
  newGroup.lg.setAttribute('data-letter', letter);
  newGroup.lg.textContent = letter;
  newGroup.nl = document.createElement('div');
  newGroup.nl.classList.add('line');
  newGroup.cc = document.createElement('div');
  newGroup.cc.classList.add('contact-container');
  return newGroup;
}

function insertNewGroup(cl, letter, groupElements) {
  const groups = [].slice.call(document.querySelectorAll('.letter-group'));
  const nextGroup = groups.find((g) => g.textContent > letter);
  if (nextGroup) {
    cl.insertBefore(groupElements.lg, nextGroup);
    cl.insertBefore(groupElements.nl, nextGroup);
    cl.insertBefore(groupElements.cc, nextGroup);
  } else {
    cl.appendChild(groupElements.lg);
    cl.appendChild(groupElements.nl);
    cl.appendChild(groupElements.cc);
  }
  return groupElements.cc;
}

function getOrCreateGroupContainer(letter) {
  const cl = document.querySelector('.contact-list'),
    existingGroup = document.querySelector(`.letter-group[data-letter="${letter}"]`);
  let cc;
  if (!existingGroup) {
    const newGroup = createNewGroup(letter);
    cc = insertNewGroup(cl, letter, newGroup);
  } else {
    cc = existingGroup.nextElementSibling.nextElementSibling;
  }
  return cc;
}


function buildContactElement(name, email, phone, color) {
  try {
    const contact = document.createElement('div');
    contact.classList.add('contact');
    contact.setAttribute('data-phone', phone);
    const avatar = createContactAvatar(name, color);
    const info = createContactInfo(name, email);

    contact.appendChild(avatar);
    contact.appendChild(info);
    return contact;
  } catch (error) {
    console.error('Error in buildContactElement:', error);
    return null; // 
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
    const contacts = [].slice.call(container.querySelectorAll('.contact')),
      next = contacts.find((c) => c.querySelector('.contact-name').textContent.trim() > name);
    next ? container.insertBefore(contactEl, next) : container.appendChild(contactEl);
  } catch (error) {
    console.error('Error in insertContactSorted:', error);
  }
}

function resetForm() {
  const n = document.querySelector('input[placeholder="Firstname Lastname"]'),
    e = document.querySelector('input[placeholder="Email"]'),
    p = document.querySelector('input[placeholder="Phone"]');
  n.value = '';
  e.value = '';
  p.value = '';
  checkInputs();
  closeAddContactPopup();
}

function showSuccessPopup() {
  const sp = document.getElementById('success-popup');
  sp.classList.remove('popup-hidden');
  setTimeout(() => {
    sp.classList.add('popup-hidden');
  }, 3000);
}

function extractInputs(event) {
  event.preventDefault();
  let inputs = getInputValues();
  if (!inputs.name || !inputs.email || !inputs.phone) {
    alert('Please fill in all fields!');
    return null;
  }
  return inputs;
}

function computeNameParts(fullName) {
  let parts = fullName.trim().split(' ');
  let firstName = parts[0];
  let lastName = parts.slice(1).join(' ');
  let initials = fullName
    .split(' ')
    .map(function (word) {
      return word.charAt(0).toUpperCase();
    })
    .join('');
  return { firstName: firstName, lastName: lastName, initials: initials };
}

async function saveContactToFirebase(contactData, callback) {
  try {
    const data = await postData('/contacts', contactData);
    callback(null, data);
  } catch (err) {
    console.error('Error saving contact:', err);
    callback(err, null);
  }
}

async function prepareContact(event) {
  let inputs = extractInputs(event);
  if (!inputs) return null;

  let phoneNumber = inputs.phone;
  if (phoneNumber.startsWith('0')) {
    phoneNumber = phoneNumber.substring(1);
  }
  phoneNumber = '+49' + phoneNumber;

  let firstLetter = inputs.name.charAt(0).toUpperCase();
  let container = getOrCreateGroupContainer(firstLetter);

  let compColor;
  try {
    compColor = await getRandomColor();
  } catch (error) {
    console.error('Error in getRandomColor:', error);
    compColor = '#808080';
  }

  let nameParts = computeNameParts(inputs.name);
  let contactEl = buildContactElement(inputs.name, inputs.email, phoneNumber, compColor);
  insertContactSorted(container, contactEl, inputs.name);

  if (!compColor) {
    console.error('No color available. Contact will be created without color.');
    compColor = '#808080';
  }

  let contactData = {
    firstname: nameParts.firstName,
    lastname: nameParts.lastName,
    email: inputs.email,
    phone: phoneNumber,
    contactColor: compColor,
    initials: nameParts.initials,
    createdAt: new Date().toISOString(),
  };
  
  return { data: contactData, el: contactEl };
}

function finalizeContact(contactData, contactEl) {
  saveContactToFirebase(contactData, function (err, data) {
    if (err) {
      console.error('Error saving contact:', err);
      return;
    }
    
    if (contactEl) {
      contactEl.setAttribute('data-id', data.name);
      showSuccessPopup();
    } else {
      console.error('contactEl is undefined.');
    }
  });
  resetForm();
}

async function createContact(event) {
  event.preventDefault();
  let info = await prepareContact(event); 
  if (info) {
    finalizeContact(info.data, info.el);
  }
}

function getContactDiv(deleteBtn) {
  let contactDiv = deleteBtn ? deleteBtn.closest('.contact') : activeContact;
  return contactDiv;
}

async function confirmAndDeleteContact(contactDiv) {
  return new Promise(async (resolve) => {
    showConfirmPopup('Do you really want to delete this contact?', async (confirmed) => {
      if (!confirmed) {
        resolve(false);
        return;
      }
      const firebaseId = contactDiv.getAttribute('data-id');
      if (firebaseId) {

        try {
         
          const avatar = contactDiv.querySelector('.contact-avatar');
          const contactColor = avatar.getAttribute('data-color');

          if (!randomColorsJson) {
            await initializeRandomColors();
        }

          const key = Object.keys(randomColorsJson)[0]; 
          
          await addColorToExistingArray(key, contactColor);


          const deleteContacts = await deleteData('/contacts', firebaseId);
          if (deleteContacts === null) {
            removeContactFromUI(contactDiv);
            resolve(true);
          } else {
            console.error('Deletion error from deleteData:', deleteContacts, deleteUser);
            resolve(false);
          }
        } catch (err) {
          console.error('Deletion error:', err);
          resolve(false);
        }
      } else {
        removeContactFromUI(contactDiv);
        resolve(true);
      }
    });
  });
}

function processContactDeletion(deleteBtn) {
  let contactDiv = getContactDiv(deleteBtn);
  if (!contactDiv) {
    console.error('No valid contact to delete.');
    return Promise.resolve(false);
  }
  return confirmAndDeleteContact(contactDiv);
}

function deleteAndCloseEdit() {
  processContactDeletion().then((success) => {
    success ? closeEditContactPopup() : console.error('Deletion failed.');
  });
}

function removeContactFromUI(contactDiv) {
  const container = contactDiv.parentElement;
  if (activeContact === contactDiv) clearDetails();
  contactDiv.remove();
  if (container.children.length === 0) {
    const line = container.previousElementSibling,
      lg = line ? line.previousElementSibling : null;
    if (lg && lg.classList.contains('letter-group')) lg.remove();
    if (line && line.classList.contains('line')) line.remove();
    container.remove();
  }
}

function clearDetails() {
  const ds = document.querySelector('.contact-detail'),
    dn = document.getElementById('detail-name'),
    de = document.getElementById('detail-email'),
    dp = document.getElementById('detail-phone'),
    da = document.getElementById('detail-avatar');
  ds.classList.remove('visible');
  if (activeContact) activeContact.classList.remove('active-contact');
  activeContact = null;
  dn.textContent = de.textContent = dp.textContent = da.textContent = '';
}
