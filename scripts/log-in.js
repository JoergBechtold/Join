/**
 * 
 * @function checkAndShowAnimation
 * @description Checks if the initial login animation has already been shown in the current session.
 * If the animation has been shown (indicated by the 'animationShown' item in sessionStorage),
 * it directly shows the finished animation state and removes the overlay.
 * Otherwise, it calls the `startLoginAnimationsWithDelay` function to initiate the delayed fade-in animations
 * for the login container, navigation, and footer, and then hides the overlay.
 * Finally, it sets the 'animationShown' item in sessionStorage to 'true' to prevent the animation from
 * showing again in the current session and retrieves the 'linksSidebarBoolienKey' from sessionStorage.
 */
function checkAndShowAnimation() {
    const {animationsLogoOverlayRef, animationFinishedRef, navLogInRef, loginContainerRef, footerLogInRef } = getIdRefs();
    animationsLogoOverlayRef.classList.remove('d-none');
    if (sessionStorage.getItem('animationShown')) {
      animationFinishedRef.classList.add('d-flex');
      animationsLogoOverlayRef.classList.add('d-none');
      removeAnimation();
      return;
    }
    startLoginAnimationsWithDelay(loginContainerRef,navLogInRef,footerLogInRef,animationsLogoOverlayRef,animationFinishedRef);
    sessionStorage.setItem('animationShown', 'true');
    sessionStorage.getItem('linksSidebarBoolienKey');
  }

  /**
 * 
 * @function startLoginAnimationsWithDelay
 * @description **This function is called by the `checkAndShowAnimation` function.**
 * It initiates a sequence of delayed fade-in animations for the login container, navigation, and footer elements.
 * After the initial delay, the specified elements are faded in.
 * Subsequently, after a further delay, the logo overlay is hidden, and the final animation state is displayed.
 * @param {HTMLElement} loginContainerRef - The HTML element representing the login container.
 * @param {HTMLElement} navLogInRef - The HTML element representing the login navigation.
 * @param {HTMLElement} footerLogInRef - The HTML element representing the login/register footer.
 * @param {HTMLElement} animationsLogoOverlayRef - The HTML element representing the logo animation overlay.
 * @param {HTMLElement} animationFinishedRef - The HTML element representing the final state of the animation.
 */
function startLoginAnimationsWithDelay(loginContainerRef,navLogInRef,footerLogInRef,animationsLogoOverlayRef,animationFinishedRef){
    setTimeout(function () {
      addFadeInAnimation(loginContainerRef);
      addFadeInAnimation(navLogInRef);
      addFadeInAnimation(footerLogInRef);
      setTimeout(function () {
        animationsLogoOverlayRef.classList.add('d-none');
        animationFinishedRef.classList.add('d-flex');
      }, 2000);
    }, 500);
  }

  /**
 *
 * @function addFadeInAnimation
 * @description Adds a fade-in animation to the specified HTML element.
 * The animation is named 'fadeIn', lasts for 0.8 seconds, uses an ease-in-out timing function,
 * applies the final state of the animation (forwards), and has a delay of 0.6 seconds before starting.
 * @param {HTMLElement} element - The HTML element to which the fade-in animation will be applied.
 */
function addFadeInAnimation(element) {
    element.style.animation = 'fadeIn 0.8s ease-in-out forwards 0.6s';
  }
  
  /**
   * 
   * @function removeAnimation
   * @description Removes any applied CSS animation and resets the opacity property for the login container,
   * login navigation, and login/register footer elements. This is likely used to clear fade-in animations.
   */
  function removeAnimation() {
    const { navLogInRef, loginContainerRef, footerLogInRef } = getIdRefs();
    loginContainerRef.style.removeProperty('animation');
    loginContainerRef.style.opacity = 'unset';
    navLogInRef.style.removeProperty('animation');
    navLogInRef.style.opacity = 'unset';
    footerLogInRef.style.removeProperty('animation');
    footerLogInRef.style.opacity = 'unset';
  }
  
  /**
   * 
   * @function removeOpacity
   * @description Resets the opacity property to its default value ('unset') for the login container,
   * login navigation, and login/register footer elements. This effectively makes the elements fully visible
   * if their opacity was previously modified (e.g., during an animation).
   */
  function removeOpacity() {
    const { navLogInRef, loginContainerRef, footerLogInRef } = getIdRefs();
    loginContainerRef.style.opacity = 'unset';
    navLogInRef.style.opacity = 'unset';
    footerLogInRef.style.opacity = 'unset';
  }

/**
 * 
 * @function setIdRefValueTrimLogIn
 * @description Retrieves the values from the email and password input fields in the login form,
 * trims any leading or trailing whitespace, and returns them as an object.
 * @returns {object} - An object containing the trimmed values of the login form fields:
 * - `emailLogIn`: The trimmed value of the email input field.
 * - `passwordLogIn`: The trimmed value of the password input field.
 */
function setIdRefValueTrimLogIn() {
    return {
      emailLogIn: document.getElementById('email_log_in').value.trim(),
      passwordLogIn: document.getElementById('password_log_in').value.trim(),
    };
  }

  /**
 *
 * @function showLoginError
 * @description Displays the generic login error message if neither the specific email nor password error messages are currently visible.
 * It also adds the 'not-valide-error' class to the email and password input fields to visually indicate an error,
 * preventing duplicate application of the error class. It utilizes the `handleGenericLoginErrorDisplay` function
 * to manage the visibility of the main error message.
 */
function showLoginError() {
    const { errorMessageLogInRef, passwordLogInRef, emailLogInRef, errorMessageEmailNotValideLoginRef, errorMessagePasswordLogInRef } = getIdRefs();
    const isEmailErrorVisible = errorMessageEmailNotValideLoginRef && errorMessageEmailNotValideLoginRef.classList.contains('d-flex');
    const isPasswordErrorVisible = errorMessagePasswordLogInRef && errorMessagePasswordLogInRef.classList.contains('d-flex');
  
    handleGenericLoginErrorDisplay(errorMessageLogInRef, isEmailErrorVisible, isPasswordErrorVisible);
  
    if (emailLogInRef && !emailLogInRef.classList.contains('not-valide-error')) {
      emailLogInRef.classList.add('not-valide-error');
    }
    if (passwordLogInRef && !passwordLogInRef.classList.contains('not-valide-error')) {
      passwordLogInRef.classList.add('not-valide-error');
    }
  }
  
  /**
   *
   * @function handleGenericLoginErrorDisplay
   * @description Controls the visibility of the generic login error message based on the visibility states
   * of the specific email and password error messages. It displays the generic error message only if neither
   * the email nor the password error messages are currently visible.
   * @param {HTMLElement | null} errorMessageLogInRef - The HTML element representing the generic login error message.
   * @param {boolean} isEmailErrorVisible - A boolean indicating if the email error message is currently visible (has the 'd-flex' class).
   * @param {boolean} isPasswordErrorVisible - A boolean indicating if the password error message is currently visible (has the 'd-flex' class).
   */
  function handleGenericLoginErrorDisplay(errorMessageLogInRef, isEmailErrorVisible, isPasswordErrorVisible) {
    if (errorMessageLogInRef) {
      if (!isEmailErrorVisible && !isPasswordErrorVisible) {
        errorMessageLogInRef.classList.add('d-flex');
      } else {
        errorMessageLogInRef.classList.remove('d-flex');
      }
    }
  }