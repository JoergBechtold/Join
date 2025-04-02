let headerContainer = document.getElementById('header_container');
if (!headerContainer) {
  headerContainer = document.createElement('div');
  headerContainer.id = 'header_container';
  document.body.insertBefore(headerContainer, document.body.firstChild);
}

fetch('header_sidebar.html')
  .then(response => {
    if (!response.ok) {
      throw new Error(`Error retrieving header ${response.status}`);
    }
    return response.text();
  })
  .then(data => {
    headerContainer.innerHTML = data;
    const buttonLinksSidebar = sessionStorage.getItem('linksSidebarBoolienKey');
    ifButtonLinkSidebar(buttonLinksSidebar);
    loadInitialsUserIcon();
    ifActivePage();
  })
  .catch(error => console.error('Error loading header', error));

function ifButtonLinkSidebar(buttonLinksSidebar) {
  if (buttonLinksSidebar === 'true') {
    showLoggedInLinks(); 
  } else {
    hideLoggedInLinks(); 
  }
}

function ifActivePage() {
  const currentPath = window.location.pathname;
  const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1); 

  document.querySelectorAll('.link-button a').forEach((a) => {
    const linkHref = a.getAttribute('href');
    if (linkHref === currentPage) {
      a.closest('li').classList.add('active');
      sessionStorage.setItem('activePage', linkHref); 
    } else {
      a.closest('li').classList.remove('active'); 
      
    }
  });
}



// function ifActivePage() {
//   const currentPath = window.location.pathname;
//   const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1); // Extrahiert den Dateinamen

//   document.querySelectorAll('.link-button a').forEach((a) => {
//     const linkHref = a.getAttribute('href');
//     const linkPath = linkHref.substring(linkHref.lastIndexOf('/') + 1); // Extrahiert den Dateinamen

//     if (linkPath === currentPage) {
//       a.closest('li').classList.add('active');
//       sessionStorage.setItem('activePage', linkHref); // Speichert die aktive Seite im sessionStorage
//     } else {
//       a.closest('li').classList.remove('active'); // Entfernt die 'active' Klasse von anderen Links
//     }
//   });
// }


// function ifActivePage() {
//   const activePage = sessionStorage.getItem('activePage');

//   if (activePage) {
//     document.querySelectorAll('.link-button a').forEach((a) => {
//       if (a.getAttribute('href') === activePage) {
//         a.closest('li').classList.add('active');
//       }
//     });
//   } else {
//     const firstLink = document.querySelector('.link-button a');
//     if (firstLink) {
//       firstLink.closest('li').classList.add('active');
//       sessionStorage.setItem('activePage', firstLink.getAttribute('href'));
//     }
//   }
// }

function toggleSubmenu() {
  let submenu = document.getElementById('user-submenu');

  if (window.matchMedia('(max-width: 768px)').matches) {
    submenu.classList.toggle('submenu-slide-in');
  } else {
    submenu.classList.remove('submenu-slide-in');
    submenu.classList.toggle('hidden');
  }
}

document.onclick = function(event) {
  let profile = document.querySelector('.user-profile');
  let submenu = document.getElementById('user-submenu');

  if (!profile.contains(event.target) && !submenu.contains(event.target)) {
    submenu.classList.add('hidden');
  }
};


async function loadInitialsUserIcon() {
  let userProfileCircleRef = document.getElementById('user_profile_circle');

  try {
    const user = await loadUserData();
    if (user && user.initials && user.randomColor) {
      userProfileCircleRef.innerHTML = user.initials;
    } else {
      userProfileCircleRef.innerHTML = 'G';
     
    }
  } catch (error) {
    console.error('Error loading user data', error);
  }
}

function toHrefFocus(url, element) {
  document.querySelectorAll('.link-button').forEach((li) => {
    li.classList.remove('active');
  });

  if (element) {
    element.closest('li').classList.add('active');
  }

  sessionStorage.setItem('activePage', url);
  window.location.href = url;
}

// function toHrefFocus(url, element) {
//   document.querySelectorAll('.link-button').forEach((li) => {
//     li.classList.remove('active');
//   });

//   element.closest('li').classList.add('active');
//   sessionStorage.setItem('activePage', url);
//   window.location.href = url;
// }
