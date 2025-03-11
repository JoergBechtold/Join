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
  };
}

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
  sessionStorage.getItem('linksSidebarBoolienKey');
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
    toggleIcon.src = 'assets/icons/visibility-eye-off.svg';
    toggleIcon.alt = 'Visibility eye of Icon';
  }
}

async function handleSignUp() {
  const { name, email, password, confirmPassword } = setIdRefValueTrim();

  try {
    const nameParts = name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');
    const randomColor = getRandomColor();
    const initials = firstName[0].toUpperCase() + lastName[0].toUpperCase();

    if (!checkNamePartsLength(nameParts)) {
      return;
    }

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
    }, 1700);
  } catch (error) {
    console.error('Fehler beim Erstellen des Benutzers:', error);
  }
}

function checkNamePartsLength(nameParts) {
  const { nameSignUpRef, errorMessageNameRef } = getIdRefs();

  if (nameParts.length < 2) {
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

async function createUser(firstname, lastname, email, password, randomColors, initials) {
  const newUser = { firstname, lastname, email, password, randomColors, initials };

  try {
    await postData('/user', newUser);
    await postData('/contacts', newUser);
  } catch (error) {
    console.error('Fehler beim Posten der Daten:', error);
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
  const { passwordLogInRef, emailLogInRef, emailSignUpRef, errorMessageEmailRef } = getIdRefs();
  const { email, emailLogIn, passwordLogIn } = setIdRefValueTrim();
  try {
    const users = await loadData('/user');

    if (users) {
      const userIds = Object.keys(users);

      for (let index = 0; index < userIds.length; index++) {
        const userId = userIds[index];
        const user = users[userId];

        if (parameter) {
          if (user.email === email) {
            errorMessageEmailRef.classList.add('d-flex');
            emailSignUpRef.classList.add('not-valide-error');
            return true;
          }
        }

        if (!parameter) {
          if (user.email === emailLogIn && user.password === passwordLogIn) {
            emailLogInRef.value = '';
            passwordLogInRef.value = '';
            window.showButtonLinksSidebar = true;
            sessionStorage.setItem('linksSidebarBoolienKey', window.showButtonLinksSidebar);
            goToUrl('summary.html');
            return true;
          }
        }
      }
      showLoginError();
      return false;
    }
  } catch (error) {
    console.error('Fehler beim Überprüfen des Benutzers:', error);
    return false;
  }
}

function showLoginError() {
  const { errorMessageLogInRef, passwordLogInRef, emailLogInRef } = getIdRefs();
  errorMessageLogInRef.classList.add('d-flex');
  emailLogInRef.classList.add('not-valide-error');
  passwordLogInRef.classList.add('not-valide-error');
}

function showPupupOverlaySignUp() {
  const { popupOverlaySignUpRef } = getIdRefs();
  popupOverlaySignUpRef.classList.add('d-flex');
  setTimeout(function () {
    popupOverlaySignUpRef.classList.remove('d-flex');
  }, 1000);
}
