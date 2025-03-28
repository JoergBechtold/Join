/**
 * An array of random hexadecimal color codes.
 *
 * @type {array}
 */
// const randomColors = [
//   '#ff7a00',  // Vivid Orange
//     '#ff5eb3',  // Bright Pink
//     '#6e52ff',  // Deep Violet
//     '#9327ff',  // Rich Purple
//     '#00bee8',  // Light Turquoise
//     '#1fd7c1',  // Fresh Mint
//     '#ff745e',  // Coral Red
//     '#ffa35e',  // Soft Peach
//     '#fc71ff',  // Electric Magenta
//     '#ffc701',  // Sunny Yellow
//     '#0038ff',  // Royal Blue
//     '#c3ff2b',  // Vibrant Lime
//     '#ffe62b',  // Zesty Lemon
//     '#ff4646',  // Fiery Red
//     '#ffbb2b',  // Gleaming Gold
//     '#00a86b',  // Emerald Green
//     '#00ced1',  // Dark Turquoise
//     '#b19cd9',  // Light Lavender
//     '#8b008b',  // Dark Magenta
//     '#228b22',  // Forest Green
//     '#d2691e',  // Chocolate Brown
//     '#808000',  // Olive Green
//     '#4682b4',  // Steel Blue
//     '#a0522d',  // Sienna Brown
//     '#8fbc8f',  // Dark Sea Green
//     '#ee82ee',  // Medium Violet
//     '#a52a2a',  // Brown
//     '#008080',  // Teal
//     '#da70d6',  // Orchid
//     '#f0e68c',  // Khaki
//     '#00fa9a',  // Medium Spring Green
//     '#cd5c5c',  // Indian Red
//     '#f5f5dc',  // Beige
//     '#98fb98',  // Pale Green
//     '#d8bfd8',  // Thistle
//     '#e9967a',  // Dark Salmon
//     '#fffacd',  // Lemon Chiffon
//     '#90ee90',  // Light Green
//     '#dda0dd',  // Plum
//     '#87ceeb',  // Sky Blue
//     '#f08080',  // Light Salmon
// ];


// function getRandomColor() {
//   if (randomColors.length === 0) {
//     console.error('No more colors available');
//     return null;
//   }

//   const randomIndex = Math.floor(Math.random() * randomColors.length);
//   const selectedColor = randomColors[randomIndex];
//   randomColors.splice(randomIndex, 1);
//   return selectedColor;
// }

 async function manuellloadColorToFirebase(){
  await postData('/randomColorsJson',  [
    "#ff5eb3",
    "#6e52ff",
    "#9327ff",
    "#00bee8",
    "#1fd7c1",
    "#ff745e",
    "#ffa35e",
    "#fc71ff",
    "#ffc701",
    "#0038ff",
    "#c3ff2b",
    "#ffe62b",
    "#ff4646",
    "#ffbb2b",
    "#00a86b",
    "#00ced1",
    "#b19cd9",
    "#8b008b",
    "#228b22",
    "#d2691e",
    "#808000",
    "#4682b4",
    "#a0522d",
    "#8fbc8f",
    "#ee82ee",
    "#a52a2a",
    "#008080",
  ]);
 }

async function startProcess() {
  initBoard()
  await initializeRandomColors();
  
}

function showConfirmation(message) {
  return new Promise((resolve) => {
    showConfirmPopup(message, (confirmed) => {
      resolve(confirmed);
    });
  });
}

function showConfirmPopup(msg, callback) {
  const p = document.querySelector('.confirm-popup'),
        m = p.querySelector('.confirm-message'),
        y = p.querySelector('.confirm-yes'),
        n = p.querySelector('.confirm-no');
  m.textContent = msg; p.classList.remove('hidden'); p.classList.add('active');
  y.onclick = () => { p.classList.add('hidden'); p.classList.remove('active'); callback(true); };
  n.onclick = () => { p.classList.add('hidden'); p.classList.remove('active'); callback(false); };
}


async function getRandomColor() {
  try {
    let randomColorsJson = await loadData('randomColorsJson');

    if (randomColorsJson) {

      const key = Object.keys(randomColorsJson)[0]; 
      const singelColorFromJson = randomColorsJson[key];

    if (!singelColorFromJson || singelColorFromJson.length === 0) {
      console.error('No more colors available or invalid data from Firebase');
      return null;
    }
  
    const randomIndex = Math.floor(Math.random() * singelColorFromJson.length);
    const selectedColor = singelColorFromJson[randomIndex];

    singelColorFromJson.splice(randomIndex, 1);
    const updateResult =  await updateData(`randomColorsJson/${key}`, singelColorFromJson);

    if (!updateResult) {
      console.error('Failed to update colors in Firebase.');
      return null; 
    }

    return selectedColor;
  } }catch (error) {
    console.error('Error getting random color:', error);
    return null;
  }
}



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
}

function loginSuccessful() {
  sessionStorage.setItem('loggedIn', 'true');
  window.showButtonLinksSidebar = true;
  sessionStorage.setItem('linksSidebarBoolienKey', window.showButtonLinksSidebar);
  goToUrl('summary.html'); 
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
    fetch('assets/templates/template_add_task.html')
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
