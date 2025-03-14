// document.addEventListener('DOMContentLoaded', function () {
//   fetch('header_sidebar.html')
//     .then((response) => response.text())
//     .then((data) => {
//       document.getElementById('header_container').innerHTML = data;

//       const buttonLinksSidebar = sessionStorage.getItem('linksSidebarBoolienKey');

//       if (buttonLinksSidebar === 'true') {
//         showLoggedInLinks(); //in script.js
//       } else {
//         hideLoggedInLinks(); //in script.js
//       }
//       loadInitialsUserIcon();
//     })

//     .catch((error) => console.error('Fehler beim Laden des Headers:', error));
// });

document.addEventListener('DOMContentLoaded', function () {
  fetch('header_sidebar.html')
    .then((response) => response.text())
    .then((data) => {
      document.getElementById('header_container').innerHTML = data;
      const buttonLinksSidebar = sessionStorage.getItem('linksSidebarBoolienKey');

      ifButtonLinkSidebar(buttonLinksSidebar);
      // if (buttonLinksSidebar === 'true') {
      //   showLoggedInLinks(); // in script.js
      // } else {
      //   hideLoggedInLinks(); // in script.js
      // }
      loadInitialsUserIcon();

      ifActivePage();
      // const activePage = sessionStorage.getItem('activePage');
      // if (activePage) {
      //   document.querySelectorAll('.link-button a').forEach((a) => {
      //     if (a.getAttribute('href') === activePage) {
      //       a.closest('li').classList.add('active');
      //     }
      //   });
      // } else {
      //   const firstLink = document.querySelector('.link-button a');
      //   if (firstLink) {
      //     firstLink.closest('li').classList.add('active');
      //     sessionStorage.setItem('activePage', firstLink.getAttribute('href'));
      //   }
      // }
    })
    .catch((error) => console.error('Fehler beim Laden des Headers:', error));
});

function ifButtonLinkSidebar(buttonLinksSidebar) {
  if (buttonLinksSidebar === 'true') {
    showLoggedInLinks(); // in script.js
  } else {
    hideLoggedInLinks(); // in script.js
  }
}

function ifActivePage() {
  const activePage = sessionStorage.getItem('activePage');

  if (activePage) {
    document.querySelectorAll('.link-button a').forEach((a) => {
      if (a.getAttribute('href') === activePage) {
        a.closest('li').classList.add('active');
      }
    });
  } else {
    const firstLink = document.querySelector('.link-button a');
    if (firstLink) {
      firstLink.closest('li').classList.add('active');
      sessionStorage.setItem('activePage', firstLink.getAttribute('href'));
    }
  }
}

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

async function loadInitialsUserIcon() {
  let userProfileCircleRef = document.getElementById('user_profile_circle');
  const user = await loadUserData();
  userProfileCircleRef.innerHTML = `${user.initials}`;
}

async function toHrefFocus(url, element) {
  document.querySelectorAll('.link-button').forEach((li) => {
    li.classList.remove('active');
  });

  element.closest('li').classList.add('active');
  sessionStorage.setItem('activePage', url);
  window.location.href = url;
}
