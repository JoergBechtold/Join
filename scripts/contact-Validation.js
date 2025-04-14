/**
 * Validates the email address in the provided input field.
 * Only shows error message if showError is true.
 *
 * @param {HTMLInputElement} emailInput - The email input field.
 * @param {HTMLElement} container - The container where the error message should be displayed.
 * @param {boolean} [showError=false] - Whether to display the error message.
 * @returns {boolean} True if the email is valid; otherwise, false.
 */
function validateEmail(emailInput, container, showError = false) {
  const emailValue = emailInput.value.trim();
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
  let err = container.querySelector('.email-error');

  if (showError) {
    // Show error message only if the field is non-valid and either contains text or should be marked as invalid.
    if (!isValid || emailValue === '') {
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
  } else {
    // Suppress error messages if not showing, just remove any existing error
    if (err) {
      err.remove();
    }
  }

  return isValid;
}

/**
 * Checks whether the provided name string is valid.
 * A valid name should consist of exactly two parts (first and last name).
 *
 * @param {string} nameValue - The full name string.
 * @returns {boolean} True if the name is valid; otherwise, false.
 */
function isNameValidValue(nameValue) {
  const parts = nameValue.split(' ');
  if (parts.length === 2) {
    const first = parts[0].trim();
    const last = parts[1].trim();
    return first !== '' && last !== '';
  }
  return false;
}

/**
 * Updates or removes the error message for the name input field.
 *
 * @param {HTMLInputElement} nameInput - The name input field.
 * @param {HTMLElement} container - The container where the error message is displayed.
 * @param {boolean} isValid - Indicates whether the name is valid.
 */
function updateNameError(nameInput, container, isValid) {
  let err = container.querySelector('.name-error');
  const nameValue = nameInput.value;
  const trimmed = nameValue.trim();
  const hasMultipleParts = trimmed.split(/\s+/).length >= 2;

  if (!isValid || trimmed === '' || !hasMultipleParts) {
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
}

/**
 * Validates the name input field.
 * Only shows an error message if showError is true.
 *
 * @param {HTMLInputElement} nameInput - The name input field.
 * @param {HTMLElement} container - The container where the error message is displayed.
 * @param {boolean} [showError=false] - Whether to display the error message.
 * @returns {boolean} True if the name is valid; otherwise, false.
 */
function validateName(nameInput, container, showError = false) {
  const nameValue = nameInput.value.trim();
  const isValid = isNameValidValue(nameValue);
  if (showError) {
    updateNameError(nameInput, container, isValid);
  } else {
    // Remove error message if one exists but we're not showing errors right now
    let err = container.querySelector('.name-error');
    if (err) err.remove();
  }
  return isValid;
}

/**
 * Validates the phone number in the provided input field.
 * Only shows error message if showError is true.
 *
 * @param {HTMLInputElement} phoneInput - The phone input field.
 * @param {HTMLElement} container - The container where the error message should be displayed.
 * @param {boolean} [showError=false] - Whether to display the error message.
 * @returns {boolean} True if the phone number is valid; otherwise, false.
 */
function validatePhone(phoneInput, container, showError = false) {
  const phoneValue = phoneInput.value.trim();
  const isValid =
    /^\+?[0-9]+$/.test(phoneValue) &&
    phoneValue.length >= 7 &&
    phoneValue.length <= 15;
  let err = container.querySelector('.phone-error');

  if (showError) {
    if (!isValid || phoneValue === '') {
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
  } else {
    if (err) {
      err.remove();
    }
  }

  return isValid;
}

/**
 * Returns the active container element (either the "edit" or "add" contact container).
 *
 * @returns {HTMLElement|null} The active container element, or null if none is active.
 */
function getActiveContainer() {
  return (
    document.querySelector('.container-edit.active') ||
    document.querySelector('.container-add.active')
  );
}

/**
 * Retrieves the form input elements from the provided container.
 *
 * @param {HTMLElement} container - The container holding the form inputs.
 * @returns {Object} An object containing the input fields and button.
 */
function getFormInputs(container) {
  return {
    nameIn: container.querySelector('input[placeholder="Firstname Lastname"]'),
    emailIn: container.querySelector('input[placeholder="Email"]'),
    phoneIn: container.querySelector('input[placeholder="Phone"]'),
    btn: container.querySelector('.create-button')
  };
}

/**
 * Validates all the input fields (name, email, phone) within a container.
 * This function will silently check all validations to update the overall button state.
 *
 * @param {Object} inputs - The object containing the form input elements.
 * @param {HTMLElement} container - The container where any error messages are displayed.
 * @returns {boolean} True if all inputs are valid; otherwise, false.
 */
function validateInputs(inputs, container) {
  // Silent validation (no error messages displayed)
  const validName = validateName(inputs.nameIn, container, false);
  const validEmail = validateEmail(inputs.emailIn, container, false);
  const validPhone = validatePhone(inputs.phoneIn, container, false);
  return (
    inputs.nameIn.value.trim() !== '' &&
    inputs.phoneIn.value.trim() !== '' &&
    validName &&
    validEmail &&
    validPhone
  );
}

/**
 * Updates the state (enabled/disabled) of the provided button based on the validity of the form inputs.
 *
 * @param {HTMLButtonElement} btn - The button to update.
 * @param {boolean} isValid - Indicates whether the inputs are valid.
 */
function updateButtonState(btn, isValid) {
  if (isValid) {
    btn.disabled = false;
    btn.classList.remove('disabled');
  } else {
    btn.disabled = true;
    btn.classList.add('disabled');
  }
}

/**
 * Checks the inputs in the active container, validates them, and updates the state of the associated button.
 * Only displays an error message for the input that is currently active.
 */
function checkInputs() {
  const container = getActiveContainer();
  if (!container) return;
  const inputs = getFormInputs(container);

  // First run silent validations to compute overall validity.
  const validName = validateName(inputs.nameIn, container, false);
  const validEmail = validateEmail(inputs.emailIn, container, false);
  const validPhone = validatePhone(inputs.phoneIn, container, false);

  // Determine which input is currently active.
  const active = document.activeElement;
  if (active === inputs.nameIn) {
    validateName(inputs.nameIn, container, true);
  } else if (active === inputs.emailIn) {
    validateEmail(inputs.emailIn, container, true);
  } else if (active === inputs.phoneIn) {
    validatePhone(inputs.phoneIn, container, true);
  }

  // Update button state based on overall validity.
  updateButtonState(
    inputs.btn,
    inputs.nameIn.value.trim() !== '' &&
      inputs.phoneIn.value.trim() !== '' &&
      validName &&
      validEmail &&
      validPhone
  );
}

/**
 * Retrieves the current values from the input fields (name, email, phone)
 * within the active container.
 *
 * @returns {Object} An object containing the properties name, email, and phone.
 */
function getInputValues() {
  const container =
    document.querySelector('.container-edit.active, .container-add.active') ||
    document;
  const name =
    container.querySelector('input[placeholder="Firstname Lastname"]')?.value.trim() ||
    '';
  const email =
    container.querySelector('input[placeholder="Email"]')?.value.trim() || '';
  const phone =
    container.querySelector('input[placeholder="Phone"]')?.value.trim() || '';
  return { name, email, phone };
}

/**
 * Resets the form input fields (name, email, phone), checks the inputs,
 * and closes the "add contact" popup.
 */
function resetForm() {
  const name = document.querySelector('input[placeholder="Firstname Lastname"]'),
    email = document.querySelector('input[placeholder="Email"]'),
    phone = document.querySelector('input[placeholder="Phone"]');
  name.value = '';
  email.value = '';
  phone.value = '';
  checkInputs();
  closeAddContactPopup();
}
