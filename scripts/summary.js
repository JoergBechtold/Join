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
    [taskNumbers[0].textContent, taskNumbers[1].textContent, taskNumbers[2].textContent] = [
      taskData.tasksInBoard || 0,
      taskData.tasksInProgress || 0,
      taskData.awaitingFeedback || 0,
    ];
  } catch (error) {
    console.error('Error loading task data:', error);
  }
}

function addClickEvents() {
  const redirectToBoard = () => (window.location.href = 'index.html');

  document.querySelector('.tasks')?.addEventListener('click', redirectToBoard);
  document.querySelector('.urgent')?.addEventListener('click', redirectToBoard);
  document.querySelectorAll('.pencil').forEach((el) => el.addEventListener('click', redirectToBoard));
}

document.addEventListener('DOMContentLoaded', async () => {
  updateGreeting();
  updateDate();
  // updateTaskData();
  addClickEvents();
  const user = await loadUserData();
  greetingName(user);
});

document.addEventListener('DOMContentLoaded', () => {
  function addHoverEffect(container, imgElement, defaultSrc, hoverSrc) {
    if (!container || !imgElement) return;

    container.addEventListener('mouseover', () => (imgElement.src = hoverSrc));
    container.addEventListener('mouseout', () => (imgElement.src = defaultSrc));
  }

  let pencilContainer = document.querySelector('.pencil:first-child');
  let pencilImg = pencilContainer?.querySelector('img');

  let doneContainer = document.querySelector('.pencil:nth-child(2)');
  let doneImg = doneContainer?.querySelector('img');

  addHoverEffect(pencilContainer, pencilImg, 'assets/icons/Pencil.svg', 'assets/icons/pencilhover.svg');
  addHoverEffect(doneContainer, doneImg, 'assets/icons/done.svg', 'assets/icons/donehover.svg');
});
