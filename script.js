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
        console.error('Benutzerdaten nicht gefunden.');
      }
    } catch (error) {
      console.error('Fehler beim Laden der Benutzerdaten:', error);
    }
  } else {
    console.error('Benutzer-ID nicht gefunden.');
    return null;
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
