/**
 * 
 * @function getIdRefs
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
    loginFormRef: document.getElementById('login_form'),
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
 * @function setIdRefValueTrim
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
  const {animationsLogoOverlayRef, animationFinishedRef, navLogInRef, loginContainerRef, footerLoginRegisterRef, logoWhiteRef, logoGrayRef } = getIdRefs();
  animationsLogoOverlayRef.classList.remove('d-none');

  if (sessionStorage.getItem('animationShown')) {
    animationFinishedRef.classList.add('d-flex');
    animationsLogoOverlayRef.classList.add('d-none');
    removeAnimation();
    return;
  }
  startLoginAnimationsWithDelay(loginContainerRef,navLogInRef,footerLoginRegisterRef,animationsLogoOverlayRef,animationFinishedRef);
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
 * @param {HTMLElement} footerLoginRegisterRef - The HTML element representing the login/register footer.
 * @param {HTMLElement} animationsLogoOverlayRef - The HTML element representing the logo animation overlay.
 * @param {HTMLElement} animationFinishedRef - The HTML element representing the final state of the animation.
 */
function startLoginAnimationsWithDelay(loginContainerRef,navLogInRef,footerLoginRegisterRef,animationsLogoOverlayRef,animationFinishedRef){
  setTimeout(function () {
    addFadeInAnimation(loginContainerRef);
    addFadeInAnimation(navLogInRef);
    addFadeInAnimation(footerLoginRegisterRef);
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
 * @function showSignUp
 * @description Hides the login container and navigation elements and displays the sign-up container.
 * It also calls the `removeAnimation` function, presumably to clear any existing animations.
 */
function showSignUp() {
  const { navLogInRef, loginContainerRef, signUpContainerRef } = getIdRefs();
  loginContainerRef.classList.add('d-none');
  navLogInRef.classList.add('d-none');
  signUpContainerRef.classList.add('d-flex');
  removeAnimation();
}

/**
 * 
 * @function removeAnimation
 * @description Removes any applied CSS animation and resets the opacity property for the login container,
 * login navigation, and login/register footer elements. This is likely used to clear fade-in animations.
 */
function removeAnimation() {
  const { navLogInRef, loginContainerRef, footerLoginRegisterRef } = getIdRefs();
  loginContainerRef.style.removeProperty('animation');
  loginContainerRef.style.opacity = 'unset';
  navLogInRef.style.removeProperty('animation');
  navLogInRef.style.opacity = 'unset';
  footerLoginRegisterRef.style.removeProperty('animation');
  footerLoginRegisterRef.style.opacity = 'unset';
}

/**
 * 
 * @function removeOpacity
 * @description Resets the opacity property to its default value ('unset') for the login container,
 * login navigation, and login/register footer elements. This effectively makes the elements fully visible
 * if their opacity was previously modified (e.g., during an animation).
 */
function removeOpacity() {
  const { navLogInRef, loginContainerRef, footerLoginRegisterRef } = getIdRefs();
  loginContainerRef.style.opacity = 'unset';
  navLogInRef.style.opacity = 'unset';
  footerLoginRegisterRef.style.opacity = 'unset';
}

/**
 * 
 * @function showLogIn
 * @description Displays the login container and navigation elements while hiding the sign-up container.
 */
function showLogIn() {
  const { navLogInRef, loginContainerRef, signUpContainerRef } = getIdRefs();
  loginContainerRef.classList.remove('d-none');
  signUpContainerRef.classList.remove('d-flex');
  navLogInRef.classList.remove('d-none');
}

/**
 * 
 * @function togglePasswordVisibility
 * @description Toggles the visibility of a password input field and updates the corresponding visibility icon.
 * @param {string} inputId - The ID of the password input element.
 * @param {HTMLElement} iconElement - The HTML element representing the visibility toggle icon.
 */
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

/**
 * 
 * @function handleSignUp
 * @description **This function orchestrates the user sign-up process.**
 * It retrieves user input, performs validation checks (name parts length, password confirmation, email existence),
 * creates user profile data using `createUserProfileDataFromParts`, persists the new user using `createUser`,
 * and then initiates post-sign-up actions by calling `handleSignUpSuccess`.
 * It relies on `setIdRefValueTrim`, `checkNamePartsLength`, `createUserProfileDataFromParts`,
 * `checkPasswordConfirm`, `checkUserIsPresent`, `createUser`, and `handleSignUpSuccess` to perform its tasks.
 */
async function handleSignUp() {
  const { name, email, password, confirmPassword } = setIdRefValueTrim();

  try {
    const nameParts = name.split(' ');
    if (!checkNamePartsLength(nameParts)) return;

    const profileData = await createUserProfileDataFromParts(nameParts);

    if (!checkPasswordConfirm(password, confirmPassword)) return;
  
    const isEmailPresent = await checkUserIsPresent(true);

    if (isEmailPresent) return; 
  
    await createUser(
      profileData.firstName,
      profileData.lastName,
      email,
      password,
      profileData.randomColor,
      profileData.initials
    );
    handleSignUpSuccess()
  } catch (error) {
    console.error('Error creating user', error);
  }
}

/**
 * 
 * @function createUserProfileDataFromParts
 * @description **This function is called by `handleSignUp` to generate user profile data.**
 * It takes an array of name parts, extracts the first and last names, asynchronously fetches a random color,
 * and generates the user's initials. It returns an object containing these generated properties.
 * @param {string[]} nameParts - An array containing the parts of the user's name (e.g., ["John", "Doe"]).
 * @returns {Promise<object>} - A Promise that resolves to an object containing `firstName`, `lastName`, `randomColor`, and `initials`.
 */
async function createUserProfileDataFromParts(nameParts){
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');
  const randomColor = await getRandomColor();
  const initials = firstName[0].toUpperCase() + lastName[0].toUpperCase();
  return { firstName, lastName, randomColor, initials };
}

/**
 * 
 * @function delayedRedirectAndReset
 * @description **This function is called by `handleSignUpSuccess` to perform post-sign-up actions.**
 * It uses `setTimeout` to delay the redirection to the 'login_register.html' page and calls the
 * `resetProberties` function after a specified delay (500 milliseconds).
 */
function delayedRedirectAndReset(){
 setTimeout(() => {
      goToUrl('login_register.html');
      resetProberties();
    }, 500);
}

/**
 * 
 * @function handleSignUpSuccess
 * @description **This function is called by `handleSignUp` after a successful user creation.**
 * It triggers the display of a sign-up success popup using `showPupupOverlaySignUp` and then initiates
 * a delayed redirection and form reset using `delayedRedirectAndReset`.
 */
function handleSignUpSuccess(){
  showPupupOverlaySignUp();
  delayedRedirectAndReset();
}

/**
 * 
 * @function checkNamePartsLength
 * @description Checks if the provided array of name parts contains exactly two elements (first name and last name).
 * If the array does not have exactly two elements, it displays an error message and visually indicates an error
 * on the name input field.
 * @param {string[]} nameParts - An array of strings representing the parts of a user's name.
 * @returns {boolean} - Returns `true` if the `nameParts` array has exactly two elements, and `false` otherwise.
 */
function checkNamePartsLength(nameParts) {
  const { nameSignUpRef, errorMessageNameRef } = getIdRefs();

  if (nameParts.length !== 2) {
    errorMessageNameRef.classList.add('d-flex');
    nameSignUpRef.classList.add('not-valide-error');
    return false;
  }
  return true;
}

/**
 * 
 * @function checkPasswordConfirm
 * @description Checks if the provided password and confirmation password values match.
 * If the values do not match, it displays an error message and visually indicates an error
 * on both the password and confirm password input fields.
 * @param {string} password - The value of the password input field.
 * @param {string} confirmPassword - The value of the confirm password input field.
 * @returns {boolean} - Returns `true` if the `password` and `confirmPassword` values are identical, and `false` otherwise.
 */
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

/**
 * 
 * @function resetProberties
 * @description Resets the sign-up form to its initial state and unchecks the terms and conditions checkbox.
 * It uses the `reset()` method of the form element and calls the `toggleCheckbox` function with `true` to uncheck the checkbox.
 */
function resetProberties() {
  document.getElementById('sign_up_form').reset();
  toggleCheckbox(true);
}

/**
 * 
 * @function createUser
 * @description Asynchronously sends user data to the '/user' endpoint using the `postData` function.
 * It constructs a new user object with the provided details and handles potential errors during the data posting process.
 * @param {string} firstname - The first name of the user.
 * @param {string} lastname - The last name of the user.
 * @param {string} email - The email address of the user.
 * @param {string} password - The password of the user.
 * @param {string} randomColor - A randomly generated color associated with the user.
 * @param {string} initials - The initials of the user (e.g., first and last name initials).
 */
async function createUser(firstname, lastname, email, password, randomColor, initials) {
  const newUser = { firstname, lastname, email, password, randomColor, initials };
  try {
    await postData('/user', newUser);
  } catch (error) {
    console.error('Error posting data', error);
  }
}

/**
 * 
 * @function toggleCheckbox
 * @description Toggles the state of the terms and conditions checkbox and updates the visual representation
 * and the enabled state of the sign-up button accordingly.
 * @param {boolean} [element=false] - An optional boolean parameter. If `true`, it forces the checkbox to be unchecked.
 * Otherwise, it toggles based on the current state.
 */
function toggleCheckbox(element = false) {
  const { checkboxRef, customCheckmarkRef, signUpButtonRef } = getIdRefs();

  if (element) checkboxRef.checked = false;

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

/**
 * 
 * @function passwordMatch
 * @description Checks if the values of two password input fields match.
 * If the passwords do not match, it adds the 'd-flex' class to the error message associated with the confirm password field to make it visible.
 * @param {HTMLInputElement} password - The HTML input element for the primary password.
 * @param {HTMLInputElement} confirmPassword - The HTML input element for the password confirmation.
 * @returns {boolean} - Returns `false` if the password values do not match, and implicitly `undefined` (which evaluates to false in a boolean context) if they do match and the error message is not shown. Note: It does not explicitly return `true` when passwords match.
 */
function passwordMatch(password, confirmPassword) {
  const { errorMessageConfirmPasswordRef } = getIdRefs();

  if (!password.value === confirmPassword.value) {
    errorMessageConfirmPasswordRef.classList.add('d-flex');
    return false;
  }
}

/**
 * 
 * @function checkUserIsPresent
 * @description Asynchronously checks if any user data exists.
 * It attempts to load user data from the '/user' endpoint.
 * If user data is found, it extracts the user IDs and calls `checkUserIsPresentForLoob` and `showLoginError`.
 * @param {boolean} [parameter=false] - An optional boolean parameter that is passed to the `checkUserIsPresentForLoob` function.
 * @returns {Promise<boolean>} - Returns a Promise that resolves to `false` if user data is present (indicating an error condition for login in this context),
 * or `false` if an error occurs during data loading. It does not resolve to `true` in the current implementation.
 */
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
    console.error('Error verifying user', error);
    return false;
  }
}

/**
 * 
 * @function checkUserIsPresentForLoob
 * @description **This function is called by the `checkUserIsPresent` function.**
 * It iterates through the user IDs and performs actions based on the `parameter` value.
 * If `parameter` is true, it calls `ifParameterTrue` with the user data.
 * If `parameter` is false, it asynchronously calls `ifParameterFalse` with the user data and user ID.
 * @param {object} users - An object containing user data, where keys are user IDs and values are user objects.
 * @param {string[]} userIds - An array of user IDs extracted from the `users` object.
 * @param {boolean} parameter - A boolean flag that determines which function (`ifParameterTrue` or `ifParameterFalse`) is called for each user.
 */
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
 * @function ifParameterTrue
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
 * @function ifParameterFalse
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
  const { loginFormRef } = getIdRefs();

  if (!parameter) {
    if (user.email === emailLogIn && user.password === passwordLogIn) {
      sessionStorage.setItem('loggedInUserId', userId);
      loginFormRef.reset();

      await loadUserData();
      
      loginSuccessful(); 
      return true;
    }
  }
}

/**
 * 
 * @function showLoginError
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

/**
 * 
 * @function removeLoginError
 * @description Retrieves references to the login error message, email input, and password input elements using `getIdRefs()`.
 * It then removes the 'd-flex' class from the error message to hide it and the 'not-valide-error' class from both the email and password input fields to remove the error indication.
 *
 */
function removeLoginError(){
  const { errorMessageLogInRef, passwordLogInRef, emailLogInRef } = getIdRefs();
  errorMessageLogInRef.classList.remove('d-flex');
  emailLogInRef.classList.remove('not-valide-error');
  passwordLogInRef.classList.remove('not-valide-error');
}
