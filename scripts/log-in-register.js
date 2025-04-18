/**
 * 
 * @function getIdRefs
 * @description Retrieves references to various DOM elements by their IDs and returns them as an object.
 * @returns {object} An object containing references to various DOM elements. The keys of the object correspond to the reference names (e.g., `animationJoinLogoRef`), and the values are the corresponding DOM elements.
 * 
 */
function getIdRefs() {
  return {
    bodyLoginRegisterRef: document.getElementById('body_log_in'),
    animationsLogoOverlayRef: document.getElementById('animations_logo_overlay'),
    animationJoinLogoRef: document.getElementById('animation_join_logo'),
    animationFinishedRef: document.getElementById('animation_finished'),
    navLogInRef: document.getElementById('nav_log_in'),
    loginContainerRef: document.getElementById('login_container'),
    signUpContainerRef: document.getElementById('sign_up_container'),
    footerLogInRef: document.getElementById('footer_log_in'),
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
    errorMessageEmailNotValideSignUpRef: document.getElementById('error_message_email_not_valide_sign_up'),
    errorMessageEmailNotValideLoginRef: document.getElementById('error_message_email_not_valide_login'),
    errorMessageNameRef: document.getElementById('error_message_name'),
    errorMessageLogInRef: document.getElementById('error_message_log_in'),
    errorMessagePasswordSignInRef: document.getElementById('error_message_password_sign_up'),
    errorMessagePasswordLogInRef: document.getElementById('error_message_password_log_in'),
    errorMessageConfirmPasswordRef: document.getElementById('error_message_confirm_password'),
    errorMessageEmailRef: document.getElementById('error_message_email'),
    popupOverlaySignUpRef: document.getElementById('popup_overlay_sign_up'),
    logoWhiteRef: document.getElementById('logo_white'), 
    logoGrayRef: document.getElementById('logo_gray'), 
  };
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
 * @function setIdRefValueTrimSignUp
 * @description Retrieves the values from the name, email, password, and confirm password input fields
 * in the sign-up form, trims any leading or trailing whitespace from each, and returns them as an object.
 * @returns {object} - An object containing the trimmed values of the sign-up form fields:
 * - `name`: The trimmed value of the name input field.
 * - `email`: The trimmed value of the email input field.
 * - `password`: The trimmed value of the password input field.
 * - `confirmPassword`: The trimmed value of the confirm password input field.
 */
function setIdRefValueTrimSignUp() {
  return {
    name: document.getElementById('name_sign_up').value.trim(),
    email: document.getElementById('email_sign-up').value.trim(),
    password: document.getElementById('password_sign_up').value.trim(),
    confirmPassword: document.getElementById('confirm_sign_up').value.trim(),
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
 * @async
 * @function handleSignUp
 * @description Asynchronously handles the sign-up process. It retrieves user input values (name, email, password),
 * creates profile data, checks if the password confirmation is valid, and then attempts to create a new user.
 * Upon successful user creation, it calls the `handleSignUpSuccess` function. If any error occurs during the process,
 * it logs the error to the console.
 * @returns {void} - This function does not return a value directly but performs asynchronous operations
 * that may result in user creation or an error.
 */
async function handleSignUp() {
  const { name, email, password} = setIdRefValueTrimSignUp();

  try {
    const nameParts = name.split(' ');
    const profileData = await createUserProfileDataFromParts(nameParts);

    if (!checkPasswordConfirm()) return;

    await createUser(profileData.firstName, profileData.lastName, email, password, profileData.randomColor, profileData.initials);
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
 * It uses `setTimeout` to delay the redirection to the 'log_in.html' page and calls the
 * `resetProberties` function after a specified delay (500 milliseconds).
 */
function delayedRedirectAndReset(){
 setTimeout(() => {
      goToUrl('log_in.html');
      toggleCheckbox(true);
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
 * @description Checks if the password and confirm password input fields match.
 * It updates the visual feedback (error message and input field styling) based on the comparison.
 * @returns {boolean} - Returns true if the passwords match or if the confirm password field is empty, false otherwise.
 */
function checkPasswordConfirm() {
  const { password, confirmPassword } = setIdRefValueTrimSignUp();
  const { errorMessageConfirmPasswordRef, passwordSignUpRef, confirmPasswordSignUpRef } = getIdRefs();

  if (confirmPassword === "") {
    clearConfirmPasswordError()
    return true; 
  }

  if (password !== confirmPassword) {
    errorMessageConfirmPasswordRef.classList.add('d-flex');
    passwordSignUpRef.classList.add('not-valide-error');
    confirmPasswordSignUpRef.classList.add('not-valide-error');
    return false;
  } else {
    clearConfirmPasswordError()
    return true;
  }
}

/**
 * @function clearConfirmPasswordError
 * @description Clears the error styling and message related to the confirm password field.
 */
function clearConfirmPasswordError() {
  const { errorMessageConfirmPasswordRef, confirmPasswordSignUpRef, passwordSignUpRef } = getIdRefs();
  errorMessageConfirmPasswordRef.classList.remove('d-flex');
  confirmPasswordSignUpRef.classList.remove('not-valide-error');
  passwordSignUpRef.classList.remove('not-valide-error');
}

/**
 * 
 * @function validateName
 * @description Validates the name input field. It checks if the name is not empty and consists of exactly two parts (first and last name) after trimming whitespace.
 * It updates the visual feedback (error message and input field styling) based on the validation result.
 * @param {HTMLInputElement} nameInputField - The input element for the name.
 * @returns {boolean} - Returns true if the name is valid, false otherwise.
 */
function validateName(nameInputField) {
  const { nameSignUpRef, errorMessageNameRef } = getIdRefs();
  const name = nameInputField.value;
  const trimmedName = name.trim();
  const nameParts = trimmedName.split(/\s+/).filter(part => part !== '');

  if(trimmedName === ''){
    errorMessageNameRef.classList.remove('d-flex');
    nameSignUpRef.classList.remove('not-valide-error');
    return false;
  }

  if (name !== trimmedName || nameParts.length !== 2) {
    errorMessageNameRef.classList.add('d-flex');
    nameSignUpRef.classList.add('not-valide-error');
    return false;
  } else {
    errorMessageNameRef.classList.remove('d-flex');
    nameSignUpRef.classList.remove('not-valide-error');
    return true;
  }
}

/**
 * 
 * @function validateEmail
 * @description Validates the email input field. It checks if the email is not empty,
 * has no leading/trailing whitespace, and matches a basic email pattern.
 * It updates the visual feedback (error messages and input field styling) based on the validation result.
 * @param {HTMLInputElement} emailInputField - The input element for the email.
 * @param {boolean} boolean - A boolean indicating if the validation is for the sign-up form (true) or login form (false).
 * @returns {boolean} - Returns true if the email is valid, false otherwise.
 */
function validateEmail(emailInputField, boolean) {
  const {emailSignUpRef, emailLogInRef, errorMessageEmailRef, errorMessageEmailNotValideSignUpRef, errorMessageEmailNotValideLoginRef } = getIdRefs();
  const email = emailInputField.value;
  const trimmedEmail = email.trim();
  let isValid = true;
  let currentEmailRef;

  if (boolean) {
    currentEmailRef = emailSignUpRef;
  } else {
    currentEmailRef = emailLogInRef;
  }

  if (!ifValidateEmailTrimmed(email, trimmedEmail, errorMessageEmailNotValideSignUpRef, errorMessageEmailNotValideLoginRef, errorMessageEmailRef, currentEmailRef, boolean)) {
    isValid = false;
  }

  if(trimmedEmail === ''){
    clearEmailValidationErrors(boolean);
    return false;
  }

  if (!ifEmailPattern(trimmedEmail, errorMessageEmailNotValideSignUpRef, errorMessageEmailNotValideLoginRef, errorMessageEmailRef, currentEmailRef, boolean)) {
    isValid = false;
  }

  if (isValid) {
    clearEmailValidationErrors(boolean);
  }
  return isValid;
}

/**
 * 
 * @function clearEmailValidationErrors
 * @description Removes the display style and error class from email validation error messages and the corresponding email input field.
 * It differentiates between sign-up and login forms to target the correct error message and input field.
 * @param {boolean} - A boolean flag indicating whether the validation context is for the sign-up form (`true`) or the login form (`false`).
 */
function clearEmailValidationErrors(boolean) {
  const { errorMessageEmailNotValideSignUpRef, errorMessageEmailNotValideLoginRef, errorMessageEmailRef, emailSignUpRef, emailLogInRef } = getIdRefs();
  if (boolean) {
    emailSignUpRef.classList.remove('not-valide-error');
    errorMessageEmailNotValideSignUpRef.classList.remove('d-flex');
    errorMessageEmailRef.classList.remove('d-flex');
  } else {
    emailLogInRef.classList.remove('not-valide-error');
    errorMessageEmailNotValideLoginRef.classList.remove('d-flex');
  }
}

/**
 * 
 * @function ifValidateEmailTrimmed
 * @description Checks if the original email input value has leading or trailing whitespace.
 * If whitespace is present, it displays the appropriate error message and adds an error class to the email input field.
 * @param {string} email - The original email input value.
 * @param {string} trimmedEmail - The trimmed email input value.
 * @param {HTMLElement} errorMessageEmailNotValideSignUpRef - The error message element for invalid email format on sign-up.
 * @param {HTMLElement} errorMessageEmailNotValideLoginRef - The error message element for invalid email format on login.
 * @param {HTMLElement} errorMessageEmailRef - The general error message element for the email field.
 * @param {HTMLElement} emailRef - The HTML input element for the email.
 * @param {boolean} boolean - A boolean indicating if the validation is for the sign-up form (true) or login form (false).
 * @returns {boolean} - Returns true if there is no leading or trailing whitespace, false otherwise.
 */
function ifValidateEmailTrimmed(email, trimmedEmail, errorMessageEmailNotValideSignUpRef, errorMessageEmailNotValideLoginRef, errorMessageEmailRef, emailRef, boolean) {
  if (email !== trimmedEmail) {
    if (boolean) {
      errorMessageEmailNotValideSignUpRef.classList.add('d-flex');
    } else {
      errorMessageEmailNotValideLoginRef.classList.add('d-flex');
    }
    errorMessageEmailRef.classList.remove('d-flex');
    if (emailRef) {
      emailRef.classList.add('not-valide-error');
    }
    return false;
  }
  return true;
}

/**
 * 
 * @function ifEmailPattern
 * @description Checks if the trimmed email input value matches a basic email pattern.
 * If the pattern does not match, it displays the appropriate error message and adds an error class to the email input field.
 * @param {string} trimmedEmail - The trimmed email input value.
 * @param {HTMLElement} errorMessageEmailNotValideSignUpRef - The error message element for invalid email format on sign-up.
 * @param {HTMLElement} errorMessageEmailNotValideLoginRef - The error message element for invalid email format on login.
 * @param {HTMLElement} errorMessageEmailRef - The general error message element for the email field.
 * @param {HTMLElement} emailRef - The HTML input element for the email.
 * @param {boolean} boolean - A boolean indicating if the validation is for the sign-up form (true) or login form (false).
 * @returns {boolean} - Returns true if the email matches the pattern, false otherwise.
 */
function ifEmailPattern(trimmedEmail, errorMessageEmailNotValideSignUpRef, errorMessageEmailNotValideLoginRef, errorMessageEmailRef, emailRef, boolean) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(trimmedEmail)) {
    if (boolean) {
      errorMessageEmailNotValideSignUpRef.classList.add('d-flex');
    } else {
      errorMessageEmailNotValideLoginRef.classList.add('d-flex');
    }
    if (emailRef) {
      emailRef.classList.add('not-valide-error');
    }
    return false;
  }
  return true;
}

/**
 * 
 * @function validatePassword
 * @description Validates a password input field, checking for emptiness and minimum length.
 * It handles different error message elements based on whether the validation is for sign-up or login.
 * If the password field is empty, it calls the `handleEmptyPassword` function. Otherwise, it calls
 * `handlePasswordLengthValidation` to check the password length.
 * @param {HTMLInputElement} passwordInputField - The HTML input element for the password.
 * @param {boolean} boolean - A boolean value indicating the context of the validation:
 * - `true` if the validation is for the sign-up form.
 * - `false` if the validation is for the login form.
 * @returns {boolean} - Returns the result of either `handleEmptyPassword` (if the field is empty)
 * or `handlePasswordLengthValidation` (based on the password length validation).
 */
function validatePassword(passwordInputField, boolean) {
  const { passwordSignUpRef, passwordLogInRef, errorMessagePasswordLogInRef, errorMessagePasswordSignInRef,errorMessageLogInRef } = getIdRefs();
  const password = passwordInputField.value;
  const trimmedPassword = password.trim();
  let currentPasswordRef;
  let currentErrorMessageRef;

  if (boolean) {
    currentPasswordRef = passwordSignUpRef;
    currentErrorMessageRef = errorMessagePasswordSignInRef;
  } else {
    currentPasswordRef = passwordLogInRef;
    currentErrorMessageRef = errorMessagePasswordLogInRef; 
  }

  if (trimmedPassword === '') {
    return handleEmptyPassword(currentPasswordRef, currentErrorMessageRef,errorMessageLogInRef);
  }
  return handlePasswordLengthValidation(trimmedPassword, currentPasswordRef, currentErrorMessageRef);
}

/**
 * 
 * Handles the case when the password input field is empty.
 * Removes the error message display and the error class from the input field if they exist.
 *
 * @param {HTMLElement | null} currentPasswordRef - The reference element of the password input field.
 * @param {HTMLElement | null} currentErrorMessageRef - The reference element of the error message display for the password.
 * @returns {boolean} - Returns true, as an empty field is considered "valid" in terms of the *minimum requirement* (actual validation for existence might occur elsewhere).
 */
function handleEmptyPassword(currentPasswordRef, currentErrorMessageRef,errorMessageLogInRef) {
  if (currentErrorMessageRef) {
      currentErrorMessageRef.classList.remove('d-flex');
  }
  if (errorMessageLogInRef) {
      errorMessageLogInRef.classList.remove('d-flex');
  }    
  if (currentPasswordRef) {
    currentPasswordRef.classList.remove('not-valide-error');
  }
  return true;
}

/**
 * 
 * @function handlePasswordLengthValidation
 * @description Validates the length of a provided password. If the password's trimmed length is less than 8 characters,
 * it displays an error message and adds a visual error indicator to the associated input field.
 * If the password meets the minimum length requirement, it hides the error message and removes the error indicator.
 * @param {string} trimmedPassword - The password string after leading and trailing whitespace has been removed.
 * @param {HTMLElement | null} currentPasswordRef - A reference to the HTML input element for the password.
 * This can be null if the element is not found.
 * @param {HTMLElement | null} currentErrorMessageRef - A reference to the HTML element displaying the password length error message.
 * This can be null if the element is not found.
 * @returns {boolean} - Returns `true` if the trimmed password length is 8 characters or more, otherwise returns `false`.
 */
function handlePasswordLengthValidation(trimmedPassword, currentPasswordRef, currentErrorMessageRef) {
  if (trimmedPassword.length < 8) {
    if (currentErrorMessageRef) {
      currentErrorMessageRef.classList.add('d-flex');
    }
    if (currentPasswordRef) {
      currentPasswordRef.classList.add('not-valide-error');
    }
    return false;
  } else {
    if (currentErrorMessageRef) {
      currentErrorMessageRef.classList.remove('d-flex');
    }
    if (currentPasswordRef) {
      currentPasswordRef.classList.remove('not-valide-error');
    }
    return true;
  }
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
 * @description Toggles the state of a checkbox and updates its visual representation by changing the source and alt text of a custom checkmark image.
 * It also calls the `enableOrDisableSignUpButton` function to update the state of the sign-up button based on the checkbox's new state.
 * @param {HTMLElement | boolean} [element=false] - An optional HTML element. If provided and truthy, the checkbox will be unchecked before toggling.
 * @returns {void} - This function does not return any value directly. It modifies the state and appearance of the checkbox and potentially the sign-up button.
 */
function toggleCheckbox(element = false) {
  const { checkboxRef, customCheckmarkRef } = getIdRefs();

  if (element) checkboxRef.checked = false;

  checkboxRef.checked;

  if (checkboxRef.checked) {
    customCheckmarkRef.src = 'assets/icons/checkbox-checked.svg';
    customCheckmarkRef.alt = 'Checkbox Checked';
  } else {
    customCheckmarkRef.src = 'assets/icons/checkbox-empty.svg';
    customCheckmarkRef.alt = 'Checkbox not Checked';
  }
  enableOrDisableSignUpButton();
}

/**
 * 
 * @async
 * @function enableOrDisableSignUpButton
 * @description Asynchronously enables or disables the sign-up button based on the validation status of the sign-up input fields
 * (name, email, password, confirm password), the checked state of the terms and conditions checkbox,
 * and whether the entered email address already exists. It calls `validateSignUpInputs` to retrieve the validation statuses
 * and `checkUserIsPresent` to check for existing users.
 * @returns {void} - This function does not return a value directly but modifies the `disabled` property of the sign-up button.
 */
async function enableOrDisableSignUpButton() {
  const { signUpButtonRef } = getIdRefs();
  const { isNameValid, isEmailValid, isPasswordValid, isConfirmValid, isCheckboxChecked } = validateSignUpInputs();

  let isEmailAlreadyExists = false;

  if (isNameValid && isEmailValid && isPasswordValid && isConfirmValid && isCheckboxChecked) {
    isEmailAlreadyExists = await checkUserIsPresent(true);
  }

  if (isNameValid && isEmailValid && isPasswordValid && isConfirmValid && isCheckboxChecked && !isEmailAlreadyExists) {
    signUpButtonRef.disabled = false;
  } else {
    signUpButtonRef.disabled = true;
  }
}

/**
 * 
 * @function validateSignUpInputs
 * @description Retrieves references to the sign-up input fields and performs individual validation checks for name, email, password,
 * confirm password, and the terms and conditions checkbox. It returns an object containing the boolean results of each validation.
 * @returns {object} - An object containing the validation statuses for each input field:
 * - `isNameValid`: Boolean indicating if the name input is valid.
 * - `isEmailValid`: Boolean indicating if the email input is valid.
 * - `isPasswordValid`: Boolean indicating if the password input is valid.
 * - `isConfirmValid`: Boolean indicating if the confirm password input matches the password.
 * - `isCheckboxChecked`: Boolean indicating if the terms and conditions checkbox is checked.
 */
function validateSignUpInputs() {
  const { nameSignUpRef, emailSignUpRef, passwordSignUpRef, confirmPasswordSignUpRef, checkboxRef } = getIdRefs();
  const isNameValid = validateName(nameSignUpRef);
  const isEmailValid = validateEmail(emailSignUpRef, true);
  const isPasswordValid = validatePassword(passwordSignUpRef, true);
  const isConfirmValid = checkPasswordConfirm(confirmPasswordSignUpRef);
  const isCheckboxChecked = checkboxRef.checked;
  return {
    isNameValid,
    isEmailValid,
    isPasswordValid,
    isConfirmValid,
    isCheckboxChecked,
  };
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
     return checkUserIsPresentForLoob(users,userIds, parameter);
    }
    return false;
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
    if (parameter) {
      if (ifParameterTrue(parameter, user)) {
        return true;
      }
    } else {
      if (await ifParameterFalse(parameter, user, userId)) {
        return true;
      }
    }
  }
  return false;
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
function ifParameterTrue(parameter, user) {
  const { email } = setIdRefValueTrimSignUp();
  const { emailSignUpRef, errorMessageEmailRef } = getIdRefs();

  if (parameter) {
    if (user.email === email) {
      errorMessageEmailRef.classList.add('d-flex');
      emailSignUpRef.classList.add('not-valide-error');
      return true; 
    }
  }
  return false; 
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
async function ifParameterFalse(parameter, user, userId) {
  const { emailLogIn, passwordLogIn } = setIdRefValueTrimLogIn();
  const { loginFormRef } = getIdRefs();

  if (!parameter) {
    if (user.email === emailLogIn && user.password === passwordLogIn) {
      sessionStorage.setItem('loggedInUserId', userId);
      await loadUserData();
      loginFormRef.reset();
      loginSuccessful();
      return true; 
    } else {
      showLoginError();
    }
  }
  return false; 
}

/**
 * 
 * @function showLoginError
 * @description Displays the generic login error message if neither the specific email nor password error messages are currently visible.
 * It also adds the 'not-valide-error' class to the email and password input fields to visually indicate an error,
 * preventing duplicate application of the error class.
 * @returns {void} - This function does not return a value directly but modifies the visibility of the login error message
 * and the visual error state of the email and password input fields.
 */
function showLoginError() {
  const { errorMessageLogInRef, passwordLogInRef, emailLogInRef, errorMessageEmailNotValideLoginRef, errorMessagePasswordLogInRef } = getIdRefs();

  const isEmailErrorVisible = errorMessageEmailNotValideLoginRef && errorMessageEmailNotValideLoginRef.classList.contains('d-flex');
  const isPasswordErrorVisible = errorMessagePasswordLogInRef && errorMessagePasswordLogInRef.classList.contains('d-flex');

  if (errorMessageLogInRef) {
    if (!isEmailErrorVisible && !isPasswordErrorVisible) {
      errorMessageLogInRef.classList.add('d-flex');
    } else {
      errorMessageLogInRef.classList.remove('d-flex');
    }
  }

  if (emailLogInRef && !emailLogInRef.classList.contains('not-valide-error')) {
    emailLogInRef.classList.add('not-valide-error');
  }

  if (passwordLogInRef && !passwordLogInRef.classList.contains('not-valide-error')) {
    passwordLogInRef.classList.add('not-valide-error');
  }
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
