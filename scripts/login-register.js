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
    passwordSignUpRef: document.getElementById('password_sign_up'),
    confirmPasswordSignUpRef: document.getElementById('confirm_sign_up'),
    checkboxRef: document.getElementById('checkbox'),
    signUpButtonRef: document.getElementById('sign_up_button'),
    customCheckmarkRef: document.getElementById('custom_checkmark'),
  };
}

function checkAndShowAnimation() {
  const { animationJoinLogoRef, animationFinishedRef, navLogInRef, loginContainerRef, footerLoginRegisterRef } = getIdRefs();

  if (sessionStorage.getItem('animationShown')) {
    animationFinishedRef.classList.add('d-flex');
    removeAnimation();
    return;
  }

  animationJoinLogoRef.classList.remove('d-none');

  setTimeout(function () {
    animationJoinLogoRef.style.animation = 'logoAnimation 0.7s ease forwards';
    addFadeInAnimation(loginContainerRef);
    addFadeInAnimation(navLogInRef);
    addFadeInAnimation(footerLoginRegisterRef);
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
  // removeOpacity();
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

function checkSignUpForm() {
  const name = document.getElementById('name_sign_up').value.trim();
  const email = document.getElementById('email_sign-up').value.trim();
  const password = document.getElementById('password_sign_up').value.trim();
  const confirmPassword = document.getElementById('confirm_sign_up').value.trim();

  document.getElementById('signupButton').disabled = !(name && email && password && confirmPassword && password === confirmPassword);
}

async function handleSignUp() {
  const { nameSignUpRef, emailSignUpRef, passwordSignUpRef, confirmPasswordSignUpRef } = getIdRefs();

  const name = document.getElementById('name_sign_up').value.trim();
  const email = document.getElementById('email_sign-up').value.trim();
  const password = document.getElementById('password_sign_up').value.trim();
  const confirmPassword = document.getElementById('confirm_sign_up').value.trim();

  if (password !== confirmPassword) {
    showCustomAlert('Passwörter stimmen nicht überein.');
    return false;
  }

  const nameParts = name.split(' ');
  if (nameParts.length < 2) {
    showCustomAlert('Bitte gib Vor- und Nachname an.');
    return false;
  }
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');

  await createUser(firstName, lastName, email, password, randomColors);

  document.getElementById('sign_up_form').reset();
  return false;
}

async function createUser(firstname, lastname, email, password, randomColors) {
  const newUser = { firstname, lastname, username: email, password, randomColors };
  await postData('user', newUser);
  await postData('contacts', newUser);
}

function toggleCheckbox() {
  const { checkboxRef, customCheckmarkRef } = getIdRefs();

  checkboxRef.checked;

  if (checkboxRef.checked) {
    customCheckmarkRef.src = 'assets/icons/checkbox-checked.svg';
    customCheckmarkRef.alt = 'Checkbox Checked';
  } else {
    customCheckmarkRef.src = 'assets/icons/checkbox-empty.svg';
    customCheckmarkRef.alt = 'Checkbox not Checked';
  }
  checkButtonStatus();
}

function checkButtonStatus() {
  const { signUpButtonRef } = getIdRefs();

  if (checkbox.checked) {
    signUpButtonRef.disabled = false;
  } else {
    signUpButtonRef.disabled = true;
  }
}
