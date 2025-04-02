function computeNameParts(fullName) {
  let parts = fullName.trim().split(' ');
  let firstName = parts[0];
  let lastName = parts.slice(1).join(' ');
  let initials = fullName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('');
  return { firstName, lastName, initials };
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

function processPhoneNumber(phone) {
  if (phone.startsWith('0')) {
    phone = phone.substring(1);
  }
  return '+49' + phone;
}

async function getContainerAndColor(name) {
  const firstLetter = name.charAt(0).toUpperCase();
  const container = getOrCreateGroupContainer(firstLetter);
  let compColor;
  try {
    compColor = await getRandomColor();
  } catch (error) {
    console.error('Error in getRandomColor:', error);
    compColor = '#808080';
  }
  return { container, compColor };
}

function buildContactData(inputs, phoneNumber, compColor) {
  const nameParts = computeNameParts(inputs.name);
  const contactEl = buildContactElement(inputs.name, inputs.email, phoneNumber, compColor);
  return { nameParts, contactEl };
}

async function prepareContact(event) {
  let inputs = extractInputs(event);
  if (!inputs) return null;
  const phoneNumber = processPhoneNumber(inputs.phone);
  const { container, compColor } = await getContainerAndColor(inputs.name);
  const { nameParts, contactEl } = buildContactData(inputs, phoneNumber, compColor);
  insertContactSorted(container, contactEl, inputs.name);
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

function extractInputs(event) {
  event.preventDefault();
  const container = document.querySelector('.container-add.active') || document.querySelector('.container-edit.active') || document;
  const nameInput = container.querySelector('input[placeholder="Firstname Lastname"]');
  const emailInput = container.querySelector('input[placeholder="Email"]');
  const phoneInput = container.querySelector('input[placeholder="Phone"]');
  return {
    name: nameInput ? nameInput.value.trim() : '',
    email: emailInput ? emailInput.value.trim() : '',
    phone: phoneInput ? phoneInput.value.trim() : '',
  };
}
  