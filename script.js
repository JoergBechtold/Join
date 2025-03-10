function goToUrl(url) {
  window.location.href = url;
}

function hideLoggedInLinks() {
  const loggedInLinks = Array.from(document.getElementsByClassName('hide-before-log-in'));

  loggedInLinks.forEach((li) => {
    li.classList.add('d-none');
  });
}

function showLoggedInLinks() {
  const loggedInLinks = Array.from(document.getElementsByClassName('hide-before-log-in'));

  loggedInLinks.forEach((li) => {
    li.classList.remove('d-none');
  });
}
