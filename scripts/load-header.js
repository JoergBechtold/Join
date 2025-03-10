document.addEventListener('DOMContentLoaded', function () {
  fetch('header_sidebar.html')
    .then((response) => response.text())
    .then((data) => {
      document.getElementById('header_container').innerHTML = data;
      hideLoggedInLinks();
    })
    .catch((error) => console.error('Fehler beim Laden des Headers:', error));
});

function toggleSubmenu() {
  let submenu = document.getElementById('user-submenu');
  submenu.classList.toggle('hidden');
}

document.addEventListener('click', function (event) {
  let profile = document.querySelector('.user-profile');
  let submenu = document.getElementById('user-submenu');

  if (!profile.contains(event.target) && !submenu.contains(event.target)) {
    submenu.classList.add('hidden');
  }
});

function hideLoggedInLinks() {
  const loggedInLinks = Array.from(document.getElementsByClassName('hide-befor-log-in'));

  loggedInLinks.forEach((li) => {
    li.style.display = 'none';
  });
}

function showLoggedInLinks() {
  const loggedInLinks = Array.from(document.getElementsByClassName('hide-befor-log-in'));

  loggedInLinks.forEach((li) => {
    li.style.display = 'flex';
  });
}
