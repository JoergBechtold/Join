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
    let taskData = (await loadData('tasks')) || {};
    document.querySelector('.summarynmb.todo').textContent = taskData.todo || 0;
    document.querySelector('.summarynmb.done').textContent = taskData.done || 0;
    document.querySelector('.urgentnmb').textContent = taskData.urgent || 0;

    let taskNumbers = document.querySelectorAll('.tasknmb');
    if (taskNumbers[0]) taskNumbers[0].textContent = taskData.tasksInBoard || 0;
    if (taskNumbers[1]) taskNumbers[1].textContent = taskData.tasksInProgress || 0;
    if (taskNumbers[2]) taskNumbers[2].textContent = taskData.awaitingFeedback || 0;
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