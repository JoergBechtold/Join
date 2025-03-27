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

/**
 * Retrieves references to all HTML elements needed in script.js for the add task form.
 *
 * @returns {object} An object containing references to HTML elements.
 *
 */
function getIdRefsScript() {
  return {
    h1AddTaskRef: document.getElementById('h1_add_task'),
    footerddTaskRef: document.getElementById('footer_add_task'),
    verticalLineRef: document.getElementById('vertical_line'),
    addTaskContentRef: document.getElementById('add_task_content'),
    rightContainerRef: document.getElementById('right_container'),
    leftContainerRef: document.getElementById('left_container'),
    addTaskfetchTemplateRef: document.getElementById('add_task_fetch_template'),
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
  loginSuccessful()
  // localStorage.setItem('loggedIn', 'true');
  // window.showButtonLinksSidebar = true;
  // sessionStorage.setItem('linksSidebarBoolienKey', window.showButtonLinksSidebar);

  // goToUrl('summary.html');
}

function loginSuccessful() {
  sessionStorage.setItem('loggedIn', 'true');
  window.showButtonLinksSidebar = true;
  sessionStorage.setItem('linksSidebarBoolienKey', window.showButtonLinksSidebar);
  // sessionStorage.setItem('loggedInUserId', userId);
  goToUrl('summary.html'); // Weiterleitung zur summary.html nach erfolgreichem Login
}

function logOut() {
  window.showButtonLinksSidebar = false;
  sessionStorage.setItem('linksSidebarBoolienKey', window.showButtonLinksSidebar);
  sessionStorage.removeItem('loggedIn'); 
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
    getIdRefsScript();

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
