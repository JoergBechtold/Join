function getIdRefs() {
  return {
    animationJoinLogoRef: document.getElementById('animation_join_logo'),
    navLogInRef: document.getElementById('nav_log_in'),
    loginContainerRef: document.getElementById('login_container'),
    signUpContainerRef: document.getElementById('sign_up_container'),
    footerLoginRegisterRef: document.getElementById('footer_login_register'),
  };
}

function showAnimationOverlay() {
  const { animationJoinLogoRef, navLogInRef, loginContainerRef, footerLoginRegisterRef } = getIdRefs();

  setTimeout(function () {
    animationJoinLogoRef.style.animation = 'logoAnimation 0.7s ease forwards';
    addFadeInAnimation(loginContainerRef);
    addFadeInAnimation(navLogInRef);
    addFadeInAnimation(footerLoginRegisterRef);
  }, 500);
}

function addFadeInAnimation(element) {
  element.style.animation = 'fadeIn 0.8s ease-in-out forwards';
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

function showSignUp() {
  const { navLogInRef, loginContainerRef, signUpContainerRef } = getIdRefs();

  loginContainerRef.classList.add('d-none');
  navLogInRef.classList.add('d-none');
  signUpContainerRef.classList.add('d-flex');
  removeAnimation();
}

function showLogIn() {
  const { navLogInRef, loginContainerRef, signUpContainerRef } = getIdRefs();

  loginContainerRef.classList.remove('d-none');
  signUpContainerRef.classList.remove('d-flex');
  navLogInRef.classList.remove('d-none');
}
