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

function isNameValidValue(nameValue) {
  const parts = nameValue.split(' ');
  if (parts.length === 2) {
    const first = parts[0].trim();
    const last = parts[1].trim();
    return first !== '' && last !== '';
  }
  return false;
}

function updateNameError(nameInput, container, isValid) {
  let err = container.querySelector('.name-error');
  const nameValue = nameInput.value.trim();
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
}

function validateName(nameInput, container) {
  const nameValue = nameInput.value.trim();
  const isValid = isNameValidValue(nameValue);
  updateNameError(nameInput, container, isValid);
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

function getActiveContainer() {
  return document.querySelector('.container-edit.active') ||
         document.querySelector('.container-add.active');
}
function getFormInputs(container) {
  return {
    nameIn: container.querySelector('input[placeholder="Firstname Lastname"]'),
    emailIn: container.querySelector('input[placeholder="Email"]'),
    phoneIn: container.querySelector('input[placeholder="Phone"]'),
    btn: container.querySelector('.create-button')
  };
}

function validateInputs(inputs, container) {
  const validName = validateName(inputs.nameIn, container);
  const validEmail = validateEmail(inputs.emailIn, container);
  const validPhone = validatePhone(inputs.phoneIn, container);
  return (inputs.nameIn.value.trim() !== '' &&
          inputs.phoneIn.value.trim() !== '' &&
          validName && validEmail && validPhone);
}

function updateButtonState(btn, isValid) {
  if (isValid) {
    btn.disabled = false;
    btn.classList.remove('disabled');
  } else {
    btn.disabled = true;
    btn.classList.add('disabled');
  }
}

function checkInputs() {
  const container = getActiveContainer();
  if (!container) return;
  const inputs = getFormInputs(container);
  const isValid = validateInputs(inputs, container);
  updateButtonState(inputs.btn, isValid);
}  

function getInputValues() {
  const container = document.querySelector('.container-edit.active, .container-add.active') || document;
  const name = container.querySelector('input[placeholder="Firstname Lastname"]')?.value.trim() || '';
  const email = container.querySelector('input[placeholder="Email"]')?.value.trim() || '';
  const phone = container.querySelector('input[placeholder="Phone"]')?.value.trim() || '';
  return { name, email, phone };
}  

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
  