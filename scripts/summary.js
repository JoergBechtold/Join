/**
 * Updates all elements with the class "good" with an appropriate greeting text,
 * based on the current time.
 */
function updateGreeting() {
  const greetingElements = document.querySelectorAll('.good');
  
  if (!greetingElements) return;
  const hours = new Date().getHours();
  const greetingText = hours < 12 ? 'Good Morning,' : hours < 18 ? 'Good Afternoon,' : 'Good Evening,';

  greetingElements.forEach(element => {
    element.textContent = greetingText;
  });
}

/**
 * Updates all elements with the class "name" with the user's name.
 * If the user object does not provide both a first and last name, "guest" is used.
 *
 * @param {Object} user - The user object.
 * @param {string} user.firstname - The user's first name.
 * @param {string} user.lastname - The user's last name.
 */
function greetingName(user) {
  const nameElements = document.querySelectorAll('.name');

  if (nameElements && user) {
    let nameText;

    if (user.firstname && user.lastname) {
      nameText = `${user.firstname} ${user.lastname}`;
    } else {
      nameText = 'guest';
    }

    nameElements.forEach(element => {
      element.innerHTML = nameText;
    });
  }
}

/**
 * Updates the element with the class "date" with the current date.
 * The date is formatted using the local date format options (year, month, day).
 */
function updateDate() {
  const dateElement = document.querySelector('.date');
  if (dateElement) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = new Date().toLocaleDateString(undefined, options);
  }
}

/**
 * Fetches task data from the URL (via BASE_URL) and returns it as a JSON object.
 *
 * @async
 * @returns {Promise<Object>} A promise that resolves to an object containing the tasks.
 * @throws {Error} If the fetch request fails.
 */
async function fetchTaskData() {
  const response = await fetch(`${BASE_URL}/tasks.json`);
  if (!response.ok)
      throw new Error(`Error fetching data: ${response.status}`);
  return (await response.json()) || {};
}

/**
 * Initializes an object for task statistics.
 * @returns {Object} An object with default counters.
 */
function initializeStats() {
  return {
    todo: 0,
    done: 0,
    urgent: 0,
    tasksInBoard: 0,
    tasksInProgress: 0,
    awaitingFeedback: 0
  };
}

/**
 * Updates the stats object based on a single task.
 * @param {Object} task - The task object.
 * @param {Object} stats - The stats object to update.
 */
function updateStatsFromTask(task, stats) {
  stats.tasksInBoard++;

  switch (task.state) {
    case 'open':
      stats.todo++;
      break;
    case 'done':
      stats.done++;
      break;
    case 'in-progress':
      stats.tasksInProgress++;
      break;
    case 'await-feedback':
      stats.awaitingFeedback++;
      break;
  }

  if (task.priority?.toLowerCase() === 'urgent') {
    stats.urgent++;
  }
}

/**
 * Computes statistics based on the provided tasks object.
 *
 * @param {Object} tasks - The tasks object.
 * @returns {Object} Computed statistics.
 */
function computeTaskStats(tasks) {
  const stats = initializeStats();
  Object.values(tasks).forEach(task => updateStatsFromTask(task, stats));
  return stats;
}


/**
 * Updates the display of task statistics in the UI.
 *
 * @param {Object} stats - The statistics object with properties todo, done, urgent, tasksInBoard, tasksInProgress, and awaitingFeedback.
 */
function updateTaskSummaryDisplay(stats) {
  document.querySelector('.summarynmb.todo').textContent = stats.todo;
  document.querySelector('.summarynmb.done').textContent = stats.done;
  document.querySelector('.urgentnmb').textContent = stats.urgent;
  let taskNumbers = document.querySelectorAll('.tasknmb');
  if (taskNumbers[0])
      taskNumbers[0].textContent = stats.tasksInBoard;
  if (taskNumbers[1])
      taskNumbers[1].textContent = stats.tasksInProgress;
  if (taskNumbers[2])
      taskNumbers[2].textContent = stats.awaitingFeedback;
}

/**
 * Asynchronously fetches task data, computes statistics, and updates the display.
 *
 * @async
 */
async function updateTaskData() {
  try {
      const tasks = await fetchTaskData();
      const stats = computeTaskStats(tasks);
      updateTaskSummaryDisplay(stats);
  } catch (error) {
      console.error('Error loading task data:', error);
  }
}

/**
 * Adds click events to specific DOM elements that redirect the user to the main board page.
 */
function addClickEvents() {
  const redirectToBoard = () => {
    window.location.href = 'index.html';
  };

  const tasksElement = document.querySelector('.tasks');
  if (tasksElement) tasksElement.onclick = redirectToBoard;

  const urgentElement = document.querySelector('.urgent');
  if (urgentElement) urgentElement.onclick = redirectToBoard;

  document.querySelectorAll('.pencil').forEach((el) => {
    el.onclick = redirectToBoard;
  });
}

/**
 * Adds a hover effect to a container that changes the source image of an img element.
 *
 * @param {HTMLElement} container - The container that receives the hover effect.
 * @param {HTMLImageElement} imgElement - The image element whose src will be changed.
 * @param {string} defaultSrc - The default image source.
 * @param {string} hoverSrc - The image source when hovered.
 */
function addHoverEffect(container, imgElement, defaultSrc, hoverSrc) {
  if (!container || !imgElement) return;
  container.onmouseover = () => {
    imgElement.src = hoverSrc;
  };
  container.onmouseout = () => {
    imgElement.src = defaultSrc;
  };
}

/**
 * Initializes all asynchronous data required for the summary page.
 * Loads header, user, and initial task data.
 */
async function initializeSummaryData() {
  await loadHeaderAndInitialize();
  const user = await loadUserData();
  greetingName(user);
  updateTaskData();
}

/**
 * Sets up dynamic UI updates and recurring refresh intervals.
 * Also applies greeting, date, and animation triggers.
 */
function setupSummaryUI() {
  updateGreeting();
  updateDate();
  checkAndShowAnimationSummary();
  setInterval(updateTaskData, 5000);
  addClickEvents();
}

/**
 * Adds hover effects to the To-Do and Done icon containers.
 */
function setupHoverIcons() {
  const pencilContainer = document.querySelector('.pencil:first-child');
  const pencilImg = pencilContainer?.querySelector('img');
  const doneContainer = document.querySelector('.pencil:nth-child(2)');
  const doneImg = doneContainer?.querySelector('img');

  addHoverEffect(pencilContainer, pencilImg, 'assets/icons/Pencil.svg', 'assets/icons/pencilhover.svg');
  addHoverEffect(doneContainer, doneImg, 'assets/icons/done.svg', 'assets/icons/donehover.svg');
}

/**
 * Main initialization function for the summary page.
 * Coordinates setup and handles errors.
 */
async function initializeSummaryPage() {
  try {
    await initializeSummaryData();
    setupSummaryUI();
    setupHoverIcons();
  } catch (error) {
    console.error('Error initializing the summary page', error);
  }
}


/**
 * 
 * Checks if the animation summary has already been shown or if the current view is not a mobile view.
 * If the animation summary has not been shown and it is a mobile view,
 * the mobile greeting overlay is displayed, and an entry is set in the session storage to prevent future displays.
 * After 2 seconds, the overlay is hidden again.
 */
function checkAndShowAnimationSummary() {
  const mobileViewGreetingOverlayRef = document.getElementById('mobile_view_greetin_overlay');
  const animationShown = sessionStorage.getItem('animationShownSummary');
  const isMobileView = window.matchMedia('(max-width: 768px)').matches;

  if (animationShown || !isMobileView) {
    mobileViewGreetingOverlayRef.style.display = 'none';
    return
  }
    mobileViewGreetingOverlayRef.style.display = 'flex';
    sessionStorage.setItem('animationShownSummary', 'true');
    setTimeout(() => {
      if (mobileViewGreetingOverlayRef) {
        mobileViewGreetingOverlayRef.style.display = 'none';
      }
    }, 2500);
}



 