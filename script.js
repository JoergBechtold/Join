function goToUrl(url) {
  let navLinkRef = document.getElementById('nav_link');

  navLinkRef.classList.add('d-none');
  window.location.href = url;
}
