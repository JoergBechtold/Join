/**
 * Validates the email input and optionally displays an error message.
 * 
 * @param {HTMLInputElement} emailInput - The input field for email.
 * @param {HTMLElement} container - The container where the error should appear.
 * @param {boolean} [showError=false] - Whether to show the error message.
 * @returns {boolean} True if email is valid, false otherwise.
 */
function validateEmail(emailInput, container, showError = false) {
  const emailValue = emailInput.value.trim();
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
  const err = container.querySelector('.email-error');

  handleEmailError(emailInput, container, isValid, showError, err);
  return isValid;
}

/**
 * Adds or removes the error message for the email field based on validity and user interaction.
 * 
 * @param {HTMLInputElement} input - The email input field.
 * @param {HTMLElement} container - Container where error message appears.
 * @param {boolean} isValid - Whether the email input is valid.
 * @param {boolean} show - Whether to display the error message.
 * @param {HTMLElement|null} errElem - Existing error element (if any).
 */
function handleEmailError(input, container, isValid, show, errElem) {
  if (show) {
    if (!isValid || input.value.trim() === '') {
      if (!errElem) {
        const span = document.createElement('span');
        span.className = 'email-error';
        span.style.color = 'red';
        span.textContent = 'Invalid email address';
        input.parentNode.insertBefore(span, input.nextSibling);
      }
    } else if (errElem) {
      errElem.remove();
    }
  } else if (errElem) {
    errElem.remove();
  }
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
      err.textContent = 'First and Last name with spaces';
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
    let err = container.querySelector('.name-error');
    if (err) err.remove();
  }
  return isValid;
}

/**
 * Validates the phone number in the provided input field.
 * Delegates error display to helper function.
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

  const err = container.querySelector('.phone-error');
  handlePhoneError(phoneInput, phoneValue, isValid, showError, err);
  return isValid;
}

/**
 * Displays or removes the error message for the phone input.
 *
 * @param {HTMLInputElement} input - The phone input field.
 * @param {string} value - The trimmed input value.
 * @param {boolean} isValid - Whether the phone number is valid.
 * @param {boolean} show - Whether the error should be shown.
 * @param {HTMLElement|null} errElem - Existing error element, if present.
 */
function handlePhoneError(input, value, isValid, show, errElem) {
  if (show) {
    if (!isValid || value === '') {
      if (!errElem) {
        const span = document.createElement('span');
        span.className = 'phone-error';
        span.style.color = 'red';
        span.textContent = 'Invalid phone number (7-15 digits)';
        input.parentNode.insertBefore(span, input.nextSibling);
      }
    } else if (errElem) {
      errElem.remove();
    }
  } else if (errElem) {
    errElem.remove();
  }
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
 * Main input validation handler.
 * Retrieves the currently active form container and its input elements,
 * then runs validation and sets up blur listeners for delayed error display.
 */
function checkInputs() {
  const container = getActiveContainer();
  if (!container) return;
  const inputs = getFormInputs(container);

  validateAllInputs(inputs, container);
  setupBlurListeners(inputs, container);
}


/**
 * Adds a blur event listener to each input field (name, email, phone) if not already added.
 * On blur, marks the input as touched and triggers validation.
 *
 * @param {Object} inputs - An object containing the input elements (nameIn, emailIn, phoneIn).
 * @param {HTMLElement} container - The container element where error messages are displayed.
 */
function setupBlurListeners(inputs, container) {
  ['nameIn', 'emailIn', 'phoneIn'].forEach(key => {
    const input = inputs[key];
    if (!input.dataset.listenerAdded) {
      input.addEventListener('blur', function () {
        this.dataset.touched = 'true';
        validateAllInputs(inputs, container);
      });
      input.dataset.listenerAdded = 'true';
    }
  });
}


/**
 * Validates all input fields and updates the submit button's state.
 * 
 * @param {Object} inputs - An object containing the input elements.
 * @param {HTMLElement} container - The container for showing validation messages.
 */
function validateAllInputs(inputs, container) {
  const validName = validateNameField(inputs, container);
  const validEmail = validateEmailField(inputs, container);
  const validPhone = validatePhoneField(inputs, container);

  const formValid = isFormValid(inputs, validName, validEmail, validPhone);
  updateButtonState(inputs.btn, formValid);
}

/**
 * Validates the name input field.
 * 
 * @param {Object} inputs - An object containing the input elements.
 * @param {HTMLElement} container - The container for showing validation messages.
 * @returns {boolean} - Whether the name is valid.
 */
function validateNameField(inputs, container) {
  return validateName(
    inputs.nameIn,
    container,
    isInputTouched(inputs.nameIn)
  );
}

/**
 * Validates the email input field.
 * 
 * @param {Object} inputs - An object containing the input elements.
 * @param {HTMLElement} container - The container for showing validation messages.
 * @returns {boolean} - Whether the email is valid.
 */
function validateEmailField(inputs, container) {
  return validateEmail(
    inputs.emailIn,
    container,
    isInputTouched(inputs.emailIn)
  );
}

/**
 * Validates the phone input field.
 * 
 * @param {Object} inputs - An object containing the input elements.
 * @param {HTMLElement} container - The container for showing validation messages.
 * @returns {boolean} - Whether the phone number is valid.
 */
function validatePhoneField(inputs, container) {
  return validatePhone(
    inputs.phoneIn,
    container,
    isInputTouched(inputs.phoneIn)
  );
}

/**
 * Determines whether an input field has been touched.
 * 
 * @param {HTMLInputElement} input - The input element to check.
 * @returns {boolean} - True if the input has been touched.
 */
function isInputTouched(input) {
  return input.dataset.touched === 'true';
}

/**
 * Determines if the form is valid based on all validation checks.
 * 
 * @param {Object} inputs - An object containing the input elements.
 * @param {boolean} validName - Whether the name is valid.
 * @param {boolean} validEmail - Whether the email is valid.
 * @param {boolean} validPhone - Whether the phone is valid.
 * @returns {boolean} - True if the form is valid and can be submitted.
 */
function isFormValid(inputs, validName, validEmail, validPhone) {
  return (
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
 * Resets input fields and validation states inside the given container.
 * Clears input values, removes error messages, and resets touched state.
 *
 * @param {HTMLElement} container - The form container (e.g. .container-add or .container-edit)
 * @param {boolean} clearValues - Optional: If true, input values will be cleared (default: false)
 */
function resetForm(container, clearValues = false) {
  if (!container) return;

  const inputs = container.querySelectorAll('input');
  const errors = container.querySelectorAll('.name-error, .email-error, .phone-error');

  inputs.forEach(input => {
    input.dataset.touched = 'false';
    if (clearValues) input.value = '';
  });

  errors.forEach(error => error.remove());
}
