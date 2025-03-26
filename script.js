/**
 * An array of random hexadecimal color codes.
 *
 * @type {array}
 */
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
    bodyRef: document.body,
    loadingSpinnerRef: document.getElementById('loading_spinner'),
    showMoreBtnRef: document.getElementById('show_more_btn'),
    loadingDotsRef: document.getElementById('loading_dots'),
    showAllCardsContainerRef: document.getElementById('show_all_cards_container'),
    searchAllCardsContainerREef: document.getElementById('search_all_cards_container'),
    showMoreBtnContainerRef: document.getElementById('show_more_btn_container'),
    dataCouldNotLoadedContainerRef: document.getElementById('data_could_not_loaded_container'),
    dataCouldNotBeLoadedRef: document.getElementById('data_could_not_be_loaded'),
    loadingOverlayRef: document.getElementById('loading_overlay'),
    cardOverlayFullScreenRef: document.getElementById('card_overlay_full_screen'),
    cardContainerFullScreenRef: document.getElementById('card_container_full_screen'),
    searchInputRef: document.getElementById('Search_input'),
    notValideMessageContainer: document.getElementById('not_valide_message_container'),
    lengthMessageRef: document.getElementById('length_message'),
    errorMessageRef: document.getElementById('error_message'),
    pokemonCouldNotFoundContainerRef: document.getElementById('pokemon_could_not_found_container'),
    btnLeftRef: document.getElementById('btn_left'),
    btnRightRef: document.getElementById('btn_right'),
    h1AddTaskRef: document.getElementById('h1_add_task'),
    footerddTaskRef: document.getElementById('footer_add_task'),
    verticalLineRef: document.getElementById('vertical_line'),
    addTaskContentRef: document.getElementById('add_task_content'),
    rightContainerRef: document.getElementById('right_container'),
    leftContainerRef: document.getElementById('left_container'),
    addTaskfetchTemplateRef: document.getElementById('add_task_fetch_template'),
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

/**
 * Controls the visibility of the button links sidebar.
 *
 * @type {boolean}
 * @default false
 * @example
 * window.showButtonLinksSidebar = true; // Shows the sidebar
 * window.showButtonLinksSidebar = false; // Hides the sidebar
 */
window.showButtonLinksSidebar = false;

/**
 * Navigates the current browser window to the specified URL.
 *
 * @param {string} url - The URL to navigate to.
 * @example
 * goToUrl('summary.html'); // Navigates to example.com
 */
function goToUrl(url) {
  window.location.href = url;
}

function guestLogIn() {
  window.showButtonLinksSidebar = true;
  sessionStorage.setItem('linksSidebarBoolienKey', window.showButtonLinksSidebar);

  goToUrl('summary.html');
}

function logOut() {
  window.showButtonLinksSidebar = false;
  sessionStorage.setItem('linksSidebarBoolienKey', window.showButtonLinksSidebar);
  sessionStorage.removeItem('loggedInUserId');
  sessionStorage.removeItem('activePage');
  goToUrl('login_register.html');
}

function hideLoggedInLinks() {
  const htmlLinks = document.getElementsByClassName('hide-before-log-in');

  Array.from(htmlLinks).forEach((element) => {
    element.classList.add('d-none');
  });
}

function showLoggedInLinks() {
  const htmlLinks = document.getElementsByClassName('hide-before-log-in');
  const loggedInLink = document.getElementsByClassName('hide-after-log-in');

  Array.from(htmlLinks).forEach((element) => {
    element.classList.remove('d-none');
  });

  Array.from(loggedInLink).forEach((element) => {
    element.classList.add('d-none');
  });
}

async function loadUserData() {
  const userId = sessionStorage.getItem('loggedInUserId');
  if (userId) {
    try {
      const user = await loadData(`/user/${userId}`);
      if (user) {
        return user;
      } else {
        console.error('User data not found.');
        return { initials: null };
      }
    } catch (error) {
      console.error('Error loading user data', error);
      return { initials: null };
    }
  } else {
    return { initials: null };
  }
}

function back() {
  window.history.back();
}

function showPupupOverlaySignUp() {
  const { popupOverlaySignUpRef } = getIdRefs();
  popupOverlaySignUpRef.classList.add('d-flex');
  setTimeout(function () {
    popupOverlaySignUpRef.classList.remove('d-flex');
  }, 1000);
}

async function fetchAddTask(parameter = false) {
  try {
    fetch('template_add_task.html')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((data) => {
        document.getElementById('add_task_fetch_template').innerHTML = data;

        if (parameter) {
          setAllPropertysForEditPopup();
        }
      })
      .catch((error) => {
        console.error('Error loading template', error);
      });
  } catch (error) {
    console.error('Unexpected error', error);
  }
}

function setAllPropertysForEditPopup() {
  const { h1AddTaskRef, footerddTaskRef, verticalLineRef, addTaskContentRef, rightContainerRef, leftContainerRef, addTaskfetchTemplateRef } =
    getIdRefs();

  h1AddTaskRef.classList.add('d-none');
  footerddTaskRef.classList.add('d-none');
  verticalLineRef.classList.add('d-none');
  addTaskContentRef.classList.remove('add-task-content');
  addTaskContentRef.classList.add('add-task-content-board-popup');
  rightContainerRef.style.overflowX = 'unset';
  rightContainerRef.style.overflowY = 'unset';
  leftContainerRef.style.overflowX = 'unset';
  leftContainerRef.style.overflowY = 'unset';
  leftContainerRef.style.marginBottom = '24px';
  addTaskfetchTemplateRef.classList.add('overflow-y');
}
