function goToUrl(url) {
  window.location.href = url;
}

window.showButtonLinksSidebar = false;

function guestLogIn() {
  window.showButtonLinksSidebar = true;
  sessionStorage.setItem('linksSidebarBoolienKey', window.showButtonLinksSidebar);

  goToUrl('summary.html');
}
