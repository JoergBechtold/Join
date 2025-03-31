function updateGreeting() {
  const greetingElement = document.querySelector('.good');
  if (!greetingElement) return;
  const hours = new Date().getHours();
  greetingElement.textContent = hours < 12 ? 'Good Morning,' : hours < 18 ? 'Good Afternoon,' : 'Good Evening,';
}

function greetingName(user) {
  const nameElement = document.querySelector('.name');

  if (nameElement && user) {
    if (user.firstname && user.lastname) {
      nameElement.innerHTML = `${user.firstname} ${user.lastname}`;
    } else {
      nameElement.innerHTML = 'guest';
    }
  }
}

function updateDate() {
  const dateElement = document.querySelector('.date');
  if (dateElement) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = new Date().toLocaleDateString(undefined, options);
  }
}

async function fetchTaskData() {
  const response = await fetch(`${BASE_URL}/tasks.json`);
  if (!response.ok)
      throw new Error(`Fehler beim Abrufen der Daten: ${response.status}`);
  return (await response.json()) || {};
}

function computeTaskStats(tasks) {
  let stats = {
      todo: 0,
      done: 0,
      urgent: 0,
      tasksInBoard: 0,
      tasksInProgress: 0,
      awaitingFeedback: 0
  };
  Object.values(tasks).forEach(task => {
      stats.tasksInBoard++;
      if (task.state === 'open')
          stats.todo++;
      else if (task.state === 'done')
          stats.done++;
      else if (task.state === 'in-progress')
          stats.tasksInProgress++;
      else if (task.state === 'await-feedback')
          stats.awaitingFeedback++;
      if (task.priority && task.priority.toLowerCase() === 'urgent')
          stats.urgent++;
  });
  return stats;
}

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

async function updateTaskData() {
  try {
      const tasks = await fetchTaskData();
      const stats = computeTaskStats(tasks);
      updateTaskSummaryDisplay(stats);
  } catch (error) {
      console.error('Error loading task data:', error);
  }
}

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

function addHoverEffect(container, imgElement, defaultSrc, hoverSrc) {
  if (!container || !imgElement) return;
  container.onmouseover = () => {
    imgElement.src = hoverSrc;
  };
  container.onmouseout = () => {
    imgElement.src = defaultSrc;
  };
}

async function initializeSummaryPage() {
  try {
    updateGreeting();
    updateDate();
    updateTaskData();
    setInterval(updateTaskData, 5000);
    addClickEvents();
    const user = await loadUserData();
    greetingName(user);

    let pencilContainer = document.querySelector('.pencil:first-child');
    let pencilImg = pencilContainer ? pencilContainer.querySelector('img') : null;
    let doneContainer = document.querySelector('.pencil:nth-child(2)');
    let doneImg = doneContainer ? doneContainer.querySelector('img') : null;

    addHoverEffect(pencilContainer, pencilImg, 'assets/icons/Pencil.svg', 'assets/icons/pencilhover.svg');
    addHoverEffect(doneContainer, doneImg, 'assets/icons/done.svg', 'assets/icons/donehover.svg');
  } catch (error) {
    console.error('Error initializing the summary page', error);
  }
}
