const randomColors = [''];

function getIdRefs() {
  return {
    animationJoinLogoRef: document.getElementById('animation_join_logo'),
    animationFinishedRef: document.getElementById('animation_finished'),
    navLogInRef: document.getElementById('nav_log_in'),
    loginContainerRef: document.getElementById('login_container'),
    signUpContainerRef: document.getElementById('sign_up_container'),
    footerLoginRegisterRef: document.getElementById('footer_login_register'),
    imgPasswordLogInRef: document.getElementById('img_password_log_in'),
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
  loginContainerRef.style.opacity = 'unset';
  navLogInRef.style.removeProperty('animation');
  navLogInRef.style.opacity = 'unset';
  footerLoginRegisterRef.style.removeProperty('animation');
  footerLoginRegisterRef.style.opacity = 'unset';
}

function showLogIn() {
  const { navLogInRef, loginContainerRef, signUpContainerRef } = getIdRefs();

  loginContainerRef.classList.remove('d-none');
  signUpContainerRef.classList.remove('d-flex');
  navLogInRef.classList.remove('d-none');
}

function acceptCheckbox() {
  const { navLogInRef, loginContainerRef, signUpContainerRef } = getIdRefs();
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

async function handleSignUp () {
  const name = document.getElementById('name_sign_up').value.trim();
  const email = document.getElementById('email_sign-up').value.trim();
  const password = document.getElementById('password_sign_up').value.trim();
  const confirmPassword = document.getElementById('confirm_sign_up').value.trim();

  if (password !== confirmPassword) {
    return;
  }

  const [firstName, ...lastNameParts] = name.split(' ');
  const lastName = lastNameParts.join(' ');  

  if (!lastName) {
    showCustomAlert('Please enter both first and last name');
    return;
  }

  await createUser(firstName, lastName, email, password, randomColors);
} 

async function createUser (firstname, lastname, email, password, randomColors) {
  const newUser = {firstname, lastname, username: email, password, randomColors};
  await postData('user', newUser);
  await postData('contacts', newUser);
}