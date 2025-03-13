document.addEventListener('DOMContentLoaded', function () {
  fetch('header_sidebar.html')
    .then((response) => response.text())
    .then((data) => {
      document.getElementById('header_container').innerHTML = data;

      const buttonLinksSidebar = sessionStorage.getItem('linksSidebarBoolienKey');

      if (buttonLinksSidebar === 'true') {
        showLoggedInLinks(); //in script.js
      } else {
        hideLoggedInLinks(); //in script.js
      }
      loadInitialsColorUserIcon();
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

async function loadInitialsColorUserIcon() {
  let userProfileCircleRef = document.getElementById('user_profile_circle');
  const user = await loadUserData();
  userProfileCircleRef.innerHTML = `${user.initials}`;
}
