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
      nameElement.innerHTML = '';
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

async function updateTaskData() {
  try {
    const response = await fetch(`${BASE_URL}/tasks.json`);
    if (!response.ok) {
      throw new Error(`Fehler beim Abrufen der Daten: ${response.status}`);
    }
    const tasks = (await response.json()) || {};

    let todo = 0;
    let done = 0;
    let urgent = 0;
    let tasksInBoard = 0;
    let tasksInProgress = 0;
    let awaitingFeedback = 0;

    Object.values(tasks).forEach(task => {
      tasksInBoard++; 
      if (task.state === 'open') {
        todo++;
      } else if (task.state === 'done') {
        done++;
      } else if (task.state === 'in-progress') {
        tasksInProgress++;
      } else if (task.state === 'await-feedback') {
        awaitingFeedback++;
      }
      if (task.priority && task.priority.toLowerCase() === 'urgent') {
        urgent++;
      }
    });

    document.querySelector('.summarynmb.todo').textContent = todo;
    document.querySelector('.summarynmb.done').textContent = done;
    document.querySelector('.urgentnmb').textContent = urgent;

    let taskNumbers = document.querySelectorAll('.tasknmb');
    if (taskNumbers[0]) taskNumbers[0].textContent = tasksInBoard;
    if (taskNumbers[1]) taskNumbers[1].textContent = tasksInProgress;
    if (taskNumbers[2]) taskNumbers[2].textContent = awaitingFeedback;

  } catch (error) {
    console.error('Error loading task data:', error);
  }
}

function addClickEvents() {
  const redirectToBoard = () => { window.location.href = 'index.html'; };

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
  container.onmouseover = () => { imgElement.src = hoverSrc; };
  container.onmouseout = () => { imgElement.src = defaultSrc; };
}

var previousOnload = window.onload;

window.onload = async function () {
  if (typeof previousOnload === 'function') {
    previousOnload();
  }
  
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
};