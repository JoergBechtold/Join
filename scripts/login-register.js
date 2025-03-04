function showAnimationOverlay() {
  let animationJoinLogoRef = document.getElementById('animation_join_logo');
  let navLogInRef = document.getElementById('nav_log_in');
  let loadingContainerRef = document.getElementById('loading_container');
  let footerLoginRegisterRef = document.getElementById('footer_login_register');

  setTimeout(function () {
    animationJoinLogoRef.style.animation = 'logoAnimation 0.7s ease forwards';
    applyFadeInAnimation(loadingContainerRef);
    applyFadeInAnimation(navLogInRef);
    applyFadeInAnimation(footerLoginRegisterRef);
  }, 500);
}

function applyFadeInAnimation(element) {
  element.style.animation = 'fadeIn 1s ease-in-out forwards';
}
