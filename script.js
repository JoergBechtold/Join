window.showButtonLinksSidebar = false;

function goToUrl(url) {
  window.location.href = url;
}

function guestLogIn() {
  window.showButtonLinksSidebar = true;
  sessionStorage.setItem('linksSidebarBoolienKey', window.showButtonLinksSidebar);
  goToUrl('summary.html');
}

function logOut() {
  window.showButtonLinksSidebar = false;
  sessionStorage.setItem('linksSidebarBoolienKey', window.showButtonLinksSidebar);
  goToUrl('login_register.html');
}

function hideLoggedInLinks() {
  const loggedInLinks = Array.from(document.getElementsByClassName('hide-before-log-in'));

  loggedInLinks.forEach((div) => {
    div.classList.add('d-none');
  });

  loggedInLinks.forEach((li) => {
    li.classList.add('d-none');
  });
}

function showLoggedInLinks() {
  const htmlLinks = document.getElementsByClassName('hide-before-log-in');
  const loggedInLink = document.getElementsByClassName('hide-after-log-in');

  Array.from(htmlLinks).forEach((element) => {
    element.classList.remove('d-none');
  });

  Array.from(loggedInLink).forEach((element) => {
    element.classList.add('d-none');
  });
}
