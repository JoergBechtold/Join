const randomColors = [
  '#ff7a00', // orange
  '#ff5eb3', // pink
  '#6e52ff', // violet
  '#9327ff', // purple
  '#00bee8', // turquoise
  '#1fd7c1', // mint
  '#ff745e', // coral
  '#ffa35e', // peach
  '#fc71ff', // magenta
  '#ffc701', // yellow
  '#0038ff', // blue
  '#c3ff2b', // lime
  '#ffe62b', // lemon
  '#ff4646', // red
  '#ffbb2b', // gold
];

function getIdRefs() {
  return {
    animationJoinLogoRef: document.getElementById('animation_join_logo'),
    animationFinishedRef: document.getElementById('animation_finished'),
    navLogInRef: document.getElementById('nav_log_in'),
    loginContainerRef: document.getElementById('login_container'),
    signUpContainerRef: document.getElementById('sign_up_container'),
    footerLoginRegisterRef: document.getElementById('footer_login_register'),
    imgPasswordLogInRef: document.getElementById('img_password_log_in'),
    nameSignUpRef: document.getElementById('name_sign_up'),
    emailSignUpRef: document.getElementById('email_sign-up'),
    passwordLogInRef: document.getElementById('password_log_in'),
    passwordSignUpRef: document.getElementById('password_sign_up'),
    confirmPasswordSignUpRef: document.getElementById('confirm_sign_up'),
    checkboxRef: document.getElementById('checkbox'),
    signUpButtonRef: document.getElementById('sign_up_button'),
    customCheckmarkRef: document.getElementById('custom_checkmark'),
    errorMessageLogInRef: document.getElementById('error_message_log_in'),
    errorMessageConfirmPasswordRef: document.getElementById('error_message_confirm_password'),
  };
}

function checkAndShowAnimation() {
  const { animationJoinLogoRef, animationFinishedRef, navLogInRef, loginContainerRef, footerLoginRegisterRef } = getIdRefs();
  animationJoinLogoRef.classList.remove('d-none');

  if (sessionStorage.getItem('animationShown')) {
    animationFinishedRef.classList.add('d-flex');
    animationJoinLogoRef.classList.add('d-none');
    removeAnimation();
    return;
  }

  setTimeout(function () {
    animationJoinLogoRef.style.animation = 'logoAnimation 0.7s ease forwards';
    addFadeInAnimation(loginContainerRef);
    addFadeInAnimation(navLogInRef);
    addFadeInAnimation(footerLoginRegisterRef);
    setTimeout(function () {
      animationJoinLogoRef.classList.add('d-none');
      animationFinishedRef.classList.add('d-flex');
    }, 1000);
  }, 500);

  sessionStorage.setItem('animationShown', 'true');
}

function addFadeInAnimation(element) {
  element.style.animation = 'fadeIn 0.8s ease-in-out forwards';
}

function showSignUp() {
  const { navLogInRef, loginContainerRef, signUpContainerRef } = getIdRefs();

  loginContainerRef.classList.add('d-none');
  navLogInRef.classList.add('d-none');
  signUpContainerRef.classList.add('d-flex');
  removeAnimation();
}

function removeAnimation() {
  const { navLogInRef, loginContainerRef, footerLoginRegisterRef } = getIdRefs();

  loginContainerRef.style.removeProperty('animation');
  loginContainerRef.style.opacity = 'unset';
  navLogInRef.style.removeProperty('animation');
  navLogInRef.style.opacity = 'unset';
  footerLoginRegisterRef.style.removeProperty('animation');
  footerLoginRegisterRef.style.opacity = 'unset';
}

function removeOpacity() {
  const { navLogInRef, loginContainerRef, footerLoginRegisterRef } = getIdRefs();

  loginContainerRef.style.opacity = 'unset';
  navLogInRef.style.opacity = 'unset';
  footerLoginRegisterRef.style.opacity = 'unset';
}

function showLogIn() {
  const { navLogInRef, loginContainerRef, signUpContainerRef } = getIdRefs();

  loginContainerRef.classList.remove('d-none');
  signUpContainerRef.classList.remove('d-flex');
  navLogInRef.classList.remove('d-none');
}

function togglePasswordVisibility(inputId, iconElement) {
  const passwordInput = document.getElementById(inputId);
  const toggleIcon = iconElement;

  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    toggleIcon.src = 'assets/icons/visibility-eye.svg';
    toggleIcon.alt = 'Visibility Eye Icon';
  } else {
    passwordInput.type = 'password';
    toggleIcon.src = 'assets/icons/lock.svg';
    toggleIcon.alt = 'Lock Icon';
  }
}

// new function for checkSignUpForm and handleSignUp
function setIdRefValueTrim() {
  return {
    name: document.getElementById('name_sign_up').value.trim(),
    email: document.getElementById('email_sign-up').value.trim(),
    password: document.getElementById('password_sign_up').value.trim(),
    confirmPassword: document.getElementById('confirm_sign_up').value.trim(),
    emailLogIn: document.getElementById('email_log_in').value.trim(),
    passwordLogIn: document.getElementById('password_log_in').value.trim(),
  };
}

async function handleSignUp() {
  const { name, email, password, confirmPassword } = setIdRefValueTrim();
  try {
    // if (password !== confirmPassword) {
    //   showCustomAlert('Passwörter stimmen nicht überein.');

    //   return false;
    // }

    const nameParts = name.split(' ');
    // if (nameParts.length < 2) {
    //   showCustomAlert('Bitte gib Vor- und Nachname an.');
    //   return false;
    // }
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    const randomColor = getRandomColor();

    console.log('Benutzerdaten:', { firstName, lastName, email, password, randomColor });

    await createUser(firstName, lastName, email, password, randomColor);

    goToUrl('login_register.html');
    resetProberties();
  } catch (error) {
    console.error('Fehler beim Erstellen des Benutzers:', error);
  }
  return false;
}

function resetProberties() {
  document.getElementById('sign_up_form').reset();
  toggleCheckbox(true);
}

function getRandomColor() {
  if (randomColors.length === 0) {
    console.error('Keine Farben mehr verfügbar');
    return null;
  }

  const randomIndex = Math.floor(Math.random() * randomColors.length);
  const selectedColor = randomColors[randomIndex];
  randomColors.splice(randomIndex, 1);
  return selectedColor;
}

async function createUser(firstname, lastname, email, password, randomColors) {
  const newUser = { firstname, lastname, username: email, password, randomColors };

  try {
    await postData('/user', newUser);
    await postData('/contacts', newUser);
  } catch (error) {
    console.error('Fehler beim Posten der Daten:', error);
  }
}

function toggleCheckbox(element = false) {
  const { checkboxRef, customCheckmarkRef } = getIdRefs();
  if (element) {
    checkboxRef.checked = false;
  }

  checkboxRef.checked;

  if (checkboxRef.checked) {
    customCheckmarkRef.src = 'assets/icons/checkbox-checked.svg';
    customCheckmarkRef.alt = 'Checkbox Checked';
  } else {
    customCheckmarkRef.src = 'assets/icons/checkbox-empty.svg';
    customCheckmarkRef.alt = 'Checkbox not Checked';
  }

  updateSignUpButton();
}

function updateSignUpButton() {
  const { emailSignUpRef, passwordSignUpRef, checkboxRef, signUpButtonRef, confirmPasswordSignUpRef } = getIdRefs();

  const isEmailValid = emailSignUpRef.checkValidity();
  const isPasswordValid = passwordSignUpRef.checkValidity();
  const passwordsAreValid = passwordsMatch(passwordSignUpRef.value, confirmPasswordSignUpRef.value);

  if (isEmailValid && isPasswordValid && checkboxRef.checked && passwordsAreValid) {
    signUpButtonRef.disabled = false;
  } else {
    signUpButtonRef.disabled = true;
  }
}

function passwordsMatch(password, confirmPassword) {
  return password === confirmPassword;
}

function checkUserIsPresent() {
  const { passwordLogInRef, errorMessageLogInRef, errorMessageConfirmPasswordRef } = getIdRefs();
  const { emailLogIn, passwordLogIn } = setIdRefValueTrim();

  loadData('/user');
  // console.log(emailLogIn + passwordLogIn);

  // if (!passwordLogInRef.validity.valid) {
  //   errorMessageLogInRef.classList.add('d-flex');
  //   return false;
  // } else {
  //   errorMessageLogInRef.classList.remove('d-flex');
  //   return true;
  // }
}
