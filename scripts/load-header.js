document.addEventListener('DOMContentLoaded', function () {
  fetch('header_sidebar.html')
    .then((response) => response.text())
    .then((data) => {
      document.getElementById('header_container').innerHTML = data;
      hideLoggedInLinks();
    })
    .catch((error) => console.error('Fehler beim Laden des Headers:', error));
});

function hideLoggedInLinks() {
  const loggedInLinks = Array.from(document.getElementsByClassName('hide-before-log-in'));

  loggedInLinks.forEach((li) => {
    li.classList.add('d-none');
  });
}

// function showLoggedInLinks() {
//   const loggedInLinks = Array.from(document.getElementsByClassName('hide-before-log-in'));

//   loggedInLinks.forEach((li) => {
//     li.classList.remove('d-none');
//   });
// }

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
