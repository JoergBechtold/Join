
/**
 * 
 * @description Retrieves references to various DOM elements by their IDs and returns them as an object.
 * @returns {object} An object containing references to various DOM elements. The keys of the object correspond to the reference names (e.g., `animationJoinLogoRef`), and the values are the corresponding DOM elements.
 * 
 */
function getIdRefs() {
  return {
    bodyLoginRegisterRef: document.getElementById('body_login_register'),
    animationsLogoOverlayRef: document.getElementById('animations_logo_overlay'),
    animationJoinLogoRef: document.getElementById('animation_join_logo'),
    animationFinishedRef: document.getElementById('animation_finished'),
    navLogInRef: document.getElementById('nav_log_in'),
    loginContainerRef: document.getElementById('login_container'),
    signUpContainerRef: document.getElementById('sign_up_container'),
    footerLoginRegisterRef: document.getElementById('footer_login_register'),
    imgPasswordLogInRef: document.getElementById('img_password_log_in'),
    nameSignUpRef: document.getElementById('name_sign_up'),
    emailSignUpRef: document.getElementById('email_sign-up'),
    emailLogInRef: document.getElementById('email_log_in'),
    passwordLogInRef: document.getElementById('password_log_in'),
    passwordSignUpRef: document.getElementById('password_sign_up'),
    confirmPasswordSignUpRef: document.getElementById('confirm_sign_up'),
    checkboxRef: document.getElementById('checkbox'),
    signUpButtonRef: document.getElementById('sign_up_button'),
    customCheckmarkRef: document.getElementById('custom_checkmark'),
    errorMessageNameRef: document.getElementById('error_message_name'),
    errorMessageLogInRef: document.getElementById('error_message_log_in'),
    errorMessageConfirmPasswordRef: document.getElementById('error_message_confirm_password'),
    errorMessageEmailRef: document.getElementById('error_message_email'),
    popupOverlaySignUpRef: document.getElementById('popup_overlay_sign_up'),
    logoWhiteRef: document.getElementById('logo_white'), 
    logoGrayRef: document.getElementById('logo_gray'), 
  };
}

/**
 *
 * @description Retrieves the trimmed values from specific input fields in the DOM and returns them as an object.
 * The `trim()` method is used to remove whitespace from both ends of the input values.
 * @returns {object} An object containing the trimmed values of various input fields.
 * 
 */
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

function checkAndShowAnimation() {
  const {animationsLogoOverlayRef, animationJoinLogoRef, animationFinishedRef, navLogInRef, loginContainerRef, footerLoginRegisterRef, logoWhiteRef, logoGrayRef } = getIdRefs();
  animationsLogoOverlayRef.classList.remove('d-none');

  if (sessionStorage.getItem('animationShown')) {
    animationFinishedRef.classList.add('d-flex');
    animationsLogoOverlayRef.classList.add('d-none');
    removeAnimation();
    return;
  }
    setTimeout(function () {
      addFadeInAnimation(loginContainerRef);
      addFadeInAnimation(navLogInRef);
      addFadeInAnimation(footerLoginRegisterRef);
      setTimeout(function () {
        animationsLogoOverlayRef.classList.add('d-none');
        animationFinishedRef.classList.add('d-flex');
      }, 1500); 
    }, 500);
  
    setTimeout(function () {
      addFadeInAnimation(loginContainerRef);
      addFadeInAnimation(navLogInRef);
      addFadeInAnimation(footerLoginRegisterRef);
      setTimeout(function () {
        animationsLogoOverlayRef.classList.add('d-none');
        animationFinishedRef.classList.add('d-flex');
      }, 2000);
    }, 500);
  
  sessionStorage.setItem('animationShown', 'true');
  sessionStorage.getItem('linksSidebarBoolienKey');
}

function addFadeInAnimation(element) {
  element.style.animation = 'fadeIn 0.8s ease-in-out forwards 0.6s';
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
    toggleIcon.src = 'assets/icons/visibility-eye-off.svg';
    toggleIcon.alt = 'Visibility eye of Icon';
  }
}

async function handleSignUp() {
  const { name, email, password, confirmPassword } = setIdRefValueTrim();

  try {
    const nameParts = name.split(' ');

    if (!checkNamePartsLength(nameParts)) {
      return;
    }

    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');
    const randomColor = await getRandomColor();
    const initials = firstName[0].toUpperCase() + lastName[0].toUpperCase();

    if (!checkPasswordConfirm(password, confirmPassword)) {
      return;
    }

    const isEmailPresent = await checkUserIsPresent(true);

    if (isEmailPresent) {
      return;
    }

    await createUser(firstName, lastName, email, password, randomColor, initials);

    showPupupOverlaySignUp();
    setTimeout(() => {
      goToUrl('login_register.html');
      resetProberties();
    }, 500);
  } catch (error) {
    console.error('Error creating user', error);
  }
}

function checkNamePartsLength(nameParts) {
  const { nameSignUpRef, errorMessageNameRef } = getIdRefs();

  if (nameParts.length !== 2) {
    errorMessageNameRef.classList.add('d-flex');
    nameSignUpRef.classList.add('not-valide-error');
    return false;
  }
  return true;
}

function checkPasswordConfirm(password, confirmPassword) {
  const { errorMessageConfirmPasswordRef, passwordSignUpRef, confirmPasswordSignUpRef } = getIdRefs();
  if (password !== confirmPassword) {
    errorMessageConfirmPasswordRef.classList.add('d-flex');
    passwordSignUpRef.classList.add('not-valide-error');
    confirmPasswordSignUpRef.classList.add('not-valide-error');
    return false;
  }
  return true;
}

function resetProberties() {
  document.getElementById('sign_up_form').reset();
  toggleCheckbox(true);
}

async function createUser(firstname, lastname, email, password, randomColor, initials) {
  const newUser = { firstname, lastname, email, password, randomColor, initials };
  try {
    await postData('/user', newUser);
  } catch (error) {
    console.error('Error posting data', error);
  }
}

function toggleCheckbox(element = false) {
  const { checkboxRef, customCheckmarkRef, signUpButtonRef } = getIdRefs();
  if (element) {
    checkboxRef.checked = false;
  }

  checkboxRef.checked;

  if (checkboxRef.checked) {
    customCheckmarkRef.src = 'assets/icons/checkbox-checked.svg';
    customCheckmarkRef.alt = 'Checkbox Checked';
    signUpButtonRef.disabled = false;
  } else {
    customCheckmarkRef.src = 'assets/icons/checkbox-empty.svg';
    customCheckmarkRef.alt = 'Checkbox not Checked';
    signUpButtonRef.disabled = true;
  }
}

function passwordMatch(password, confirmPassword) {
  const { errorMessageConfirmPasswordRef } = getIdRefs();

  if (!password.value === confirmPassword.value) {
    errorMessageConfirmPasswordRef.classList.add('d-flex');
    return false;
  }
}

async function checkUserIsPresent(parameter = false) {
  try {
    const users = await loadData('/user');

    if (users) {
      const userIds = Object.keys(users);
      checkUserIsPresentForLoob(users,userIds, parameter)
      showLoginError();
      return false;
    }
  } catch (error) {
    console.error('rror verifying user', error);
    return false;
  }
}

async function checkUserIsPresentForLoob(users,userIds, parameter) {
  for (let index = 0; index < userIds.length; index++) {
    const userId = userIds[index];
    const user = users[userId];
    ifParameterTrue(parameter, user);
    await ifParameterFalse(parameter, user, userId);
  }
}

/**
 * 
 * @description Checks if a given parameter is true. If it is, it compares the provided user's email with the trimmed value from the signup email input field.
 * If the emails match, it displays an error message and visually indicates an error on the email input field.
 * @param {*} parameter - The parameter to check for truthiness.
 * @param {object} user - An object containing the user's email property.
 * @returns {boolean|void} - Returns `true` if the parameter is true and the emails match. Returns `void` otherwise.
 * 
 */
function ifParameterTrue(parameter, user){
  const { email } = setIdRefValueTrim();
  const { emailSignUpRef, errorMessageEmailRef } = getIdRefs();

  if (parameter) {
    if (user.email === email) {
      errorMessageEmailRef.classList.add('d-flex');
      emailSignUpRef.classList.add('not-valide-error');
      return true;
    }
  }
}

/**
 * 
 * @description Checks if a given parameter is false. If it is, it compares the provided user's email and password with the values in the login input fields.
 * If they match, it clears the login input fields, stores the user ID in sessionStorage, loads user data, and indicates a successful login.
 * @param {*} parameter - The parameter to check for falsiness.
 * @param {object} user - An object containing the user's email and password properties.
 * @param {string} userId - The ID of the user to store in sessionStorage upon successful login.
 * @returns {Promise<boolean|void>} - Returns `true` if the parameter is false and the login is successful. Returns `void` otherwise.
 * 
 */
async function ifParameterFalse(parameter, user, userId){
  const { emailLogIn, passwordLogIn } = setIdRefValueTrim();
  const { passwordLogInRef, emailLogInRef } = getIdRefs();

  if (!parameter) {
    if (user.email === emailLogIn && user.password === passwordLogIn) {
      emailLogInRef.value = '';
      passwordLogInRef.value = '';
      sessionStorage.setItem('loggedInUserId', userId);
      await loadUserData();
      loginSuccessful(); 
      return true;
    }
  }
}

/**
 * 
 * @description Retrieves references to the login error message, email input, and password input elements using `getIdRefs()`.
 * It then adds the 'd-flex' class to the error message to make it visible and the 'not-valide-error' class to both the email and password input fields to visually indicate an error.
 * 
 */
function showLoginError() {
  const { errorMessageLogInRef, passwordLogInRef, emailLogInRef } = getIdRefs();
  errorMessageLogInRef.classList.add('d-flex');
  emailLogInRef.classList.add('not-valide-error');
  passwordLogInRef.classList.add('not-valide-error');
}
