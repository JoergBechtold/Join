/**
 * Splits a full name into first name, last name, and initials.
 *
 * @param {string} fullName - The full name to be processed.
 * @returns {Object} An object containing:
 *   - firstName: The first name.
 *   - lastName: The last name (could be empty if not provided).
 *   - initials: The concatenated uppercase initials of the name.
 */
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

/**
 * Saves a contact to Firebase by sending a POST request.
 *
 * @async
 * @param {Object} contactData - The contact data to save.
 * @param {Function} callback - A callback function with signature (err, data).
 * @returns {Promise<void>}
 */
async function saveContactToFirebase(contactData, callback) {
  try {
    const data = await postData('/contacts', contactData);
    callback(null, data);
  } catch (err) {
    console.error('Error saving contact:', err);
    callback(err, null);
  }
}

/**
 * Processes a phone number string by removing a leading zero (if present)
 *
 * @param {string} phone - The phone number to process.
 * @returns {string} The processed phone number without leading zero.
 */
function processPhoneNumber(phone) {
  if (phone.startsWith('0')) {
    return phone.substring(1); // entfernt die führende 0
  }
  return phone;
}

/**
 * Retrieves a container based on the first letter of the provided name,
 * and asynchronously obtains a random color.
 *
 * @async
 * @param {string} name - The name to use for determining the container.
 * @returns {Promise<Object>} A promise that resolves to an object containing:
 *   - container: The group container element.
 *   - compColor: A computed color value.
 */
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

/**
 * Builds contact data by computing name parts and creating a contact element.
 *
 * @param {Object} inputs - An object containing input values.
 * @param {string} inputs.name - The full name of the contact.
 * @param {string} inputs.email - The email address of the contact.
 * @param {string} phoneNumber - The processed phone number.
 * @param {string} compColor - The computed color for the contact.
 * @returns {Object} An object containing:
 *   - nameParts: The computed name parts.
 *   - contactEl: The contact element created by buildContactElement.
 */
function buildContactData(inputs, phoneNumber, compColor) {
  const nameParts = computeNameParts(inputs.name);
  const contactEl = buildContactElement(inputs.name, inputs.email, phoneNumber, compColor);
  return { nameParts, contactEl };
}

/**
 * Prepares the contact by extracting input values, processing the phone number,
 * determining a container and color, building contact data, and inserting
 * the contact element into the sorted list.
 *
 * @async
 * @param {Event} event - The form submit event.
 * @returns {Promise<Object|null>} An object containing:
 *   - data: The contact data object.
 *   - el: The contact element.
 * Returns null if input extraction fails.
 */
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

/**
 * Finalizes the contact creation process by saving the contact data to Firebase,
 * updating the contact element with a data attribute, showing a success popup,
 * and resetting the form.
 *
 * @param {Object} contactData - The contact data to save.
 * @param {HTMLElement} contactEl - The contact element to update.
 */
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

/**
 * Creates a contact by preparing the contact data and then finalizing
 * the contact creation process.
 *
 * @async
 * @param {Event} event - The form submit event.
 */
async function createContact(event) {
  event.preventDefault();
  let info = await prepareContact(event);
  if (info) {
    finalizeContact(info.data, info.el);
    closeAddContactPopup();
  }
}

/**
 * Extracts input values from the active add or edit contact container.
 *
 * @param {Event} event - The event that triggered input extraction.
 * @returns {Object} An object containing:
 *   - name: The value from the name input field.
 *   - email: The value from the email input field.
 *   - phone: The value from the phone input field.
 */
function extractInputs(event) {
  event.preventDefault();
  const container = document.querySelector('.container-add.active') ||
                    document.querySelector('.container-edit.active') ||
                    document;
  const nameInput = container.querySelector('input[placeholder="Firstname Lastname"]');
  const emailInput = container.querySelector('input[placeholder="Email"]');
  const phoneInput = container.querySelector('input[placeholder="Phone"]');
  return {
    name: nameInput ? nameInput.value.trim() : '',
    email: emailInput ? emailInput.value.trim() : '',
    phone: phoneInput ? phoneInput.value.trim() : '',
  };
}
