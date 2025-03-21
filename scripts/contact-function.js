var activeContact = null;
var colorVariables = [
  '--circle-bg-color-orange',
  '--circle-bg-color-pink',
  '--circle-bg-color-violet',
  '--circle-bg-color-purple',
  '--circle-bg-color-turquoise',
  '--circle-bg-color-mint',
  '--circle-bg-color-coral',
  '--circle-bg-color-peach',
  '--circle-bg-color-magenta',
  '--circle-bg-color-yellow',
  '--circle-bg-color-blue',
  '--circle-bg-color-lime',
  '--circle-bg-color-lemon',
  '--circle-bg-color-red',
  '--circle-bg-color-gold',
];

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

function validatePhone(phoneInput, container) {
  const isValid = /^[0-9]+$/.test(phoneInput.value.trim());
  let err = container.querySelector('.phone-error');
  if (!isValid && phoneInput.value.trim() !== '') {
    if (!err) {
      err = document.createElement('span');
      err.className = 'phone-error';
      err.style.color = 'red';
      err.textContent = 'Invalid phone number';
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
  const nameIn = container.querySelector('input[placeholder="Name"]'),
    emailIn = container.querySelector('input[placeholder="Email"]'),
    phoneIn = container.querySelector('input[placeholder="Phone"]'),
    btn = container.querySelector('.create-button'),
    validE = validateEmail(emailIn, container),
    validP = validatePhone(phoneIn, container);
  if (nameIn.value.trim() !== '' && validE && phoneIn.value.trim() !== '' && validP) {
    btn.disabled = false;
    btn.classList.remove('disabled');
  } else {
    btn.disabled = true;
    btn.classList.add('disabled');
  }
}

function getInputValues() {
  const container = document.querySelector('.container-edit.active') || document.querySelector('.container-add.active') || document;
  const n = container.querySelector('input[placeholder="Name"]'),
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

function createContactAvatar(name, color) {
  const avatar = document.createElement('div');
  avatar.classList.add('contact-avatar');
  if (!color) {
    const randomVar = colorVariables[Math.floor(Math.random() * colorVariables.length)];
    color = getComputedStyle(document.documentElement).getPropertyValue(randomVar).trim();
  }
  avatar.style.backgroundColor = color;
  avatar.textContent = name
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase())
    .join('');
  return avatar;
}

function createContactInfo(name, email) {
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
}

function buildContactElement(name, email, phone, color) {
  const contact = document.createElement('div');
  contact.classList.add('contact');
  contact.setAttribute('data-phone', phone);
  const avatar = createContactAvatar(name, color);
  const info = createContactInfo(name, email);
  contact.appendChild(avatar);
  contact.appendChild(info);
  return contact;
}

function insertContactSorted(container, contactEl, name) {
  const contacts = [].slice.call(container.querySelectorAll('.contact')),
    next = contacts.find((c) => c.querySelector('.contact-name').textContent.trim() > name);
  next ? container.insertBefore(contactEl, next) : container.appendChild(contactEl);
}

function resetForm() {
  const n = document.querySelector('input[placeholder="Name"]'),
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
  var inputs = getInputValues();
  if (!inputs.name || !inputs.email || !inputs.phone) {
    alert('Please fill in all fields!');
    return null;
  }
  return inputs;
}

function computeNameParts(fullName) {
  var parts = fullName.trim().split(' ');
  var firstName = parts[0];
  var lastName = parts.slice(1).join(' ');
  var initials = fullName
    .split(' ')
    .map(function (word) {
      return word.charAt(0).toUpperCase();
    })
    .join('');
  return { firstName: firstName, lastName: lastName, initials: initials };
}

function getRandomColor() {
  var rv = colorVariables[Math.floor(Math.random() * colorVariables.length)];
  var compColor = getComputedStyle(document.documentElement).getPropertyValue(rv).trim();
  return compColor;
}

function saveContactToFirebase(contactData, callback) {
  fetch(`${BASE_URL}/contacts.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contactData),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      callback(null, data);
    })
    .catch(function (err) {
      callback(err, null);
    });
}

function prepareContact(event) {
  var inputs = extractInputs(event);
  if (!inputs) return null;
  var firstLetter = inputs.name.charAt(0).toUpperCase(),
    container = getOrCreateGroupContainer(firstLetter),
    compColor = getRandomColor(),
    nameParts = computeNameParts(inputs.name),
    contactEl = buildContactElement(inputs.name, inputs.email, inputs.phone, compColor);
  insertContactSorted(container, contactEl, inputs.name);
  var contactData = {
    firstname: nameParts.firstName,
    lastname: nameParts.lastName,
    email: inputs.email,
    phone: inputs.phone,
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
    console.log('Contact saved:', data);
    contactEl.setAttribute('data-id', data.name);
    showSuccessPopup();
  });
  resetForm();
}
function createContact(event) {
  event.preventDefault();
  var info = prepareContact(event);
  if (info) {
    finalizeContact(info.data, info.el);
  }
}

function getContactDiv(deleteBtn) {
  let contactDiv = deleteBtn ? deleteBtn.closest('.contact') : activeContact;
  return contactDiv;
}

function confirmAndDeleteContact(contactDiv) {
  return new Promise((resolve) => {
    showConfirmPopup('Do you really want to delete this contact?', (confirmed) => {
      if (!confirmed) {
        resolve(false);
        return;
      }
      const firebaseId = contactDiv.getAttribute('data-id');
      if (firebaseId) {
        fetch(`${BASE_URL}/contacts/${firebaseId}.json`, { method: 'DELETE' })
          .then((r) => {
            if (!r.ok) throw new Error('Deletion error');
            removeContactFromUI(contactDiv);
            resolve(true);
          })
          .catch((err) => {
            console.error('Deletion error:', err);
            resolve(false);
          });
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
