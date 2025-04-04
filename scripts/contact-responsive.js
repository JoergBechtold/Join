function showContactDetail() {
    if (window.innerWidth <= 768) {
        document.querySelector('.main-content-responsive').style.display = 'flex';
        document.querySelector('.contact-list').style.display = 'none';
        document.querySelector('.sidebarContact').style.display = 'none';
        document.querySelector('.contact-detail').style.display = 'flex';
      }
  }

  function hideContactDetail() {
    if (window.innerWidth <= 768) {
        document.querySelector(".contacts-container").style.display = "flex";
        document.querySelector('.sidebarContact').style.display = 'flex';
        document.querySelector(".contact-list").style.display = "flex";
        document.querySelector(".main-content-responsive").style.display = "none";
        document.querySelector(".contact-detail").style.display = "none";
  }
}