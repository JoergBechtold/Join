let activeButton = null;

function setPriority(buttonId) {
  const button = document.getElementById(buttonId);
  
  if (activeButton && activeButton !== button) {
    activeButton.classList.remove('active-prio', 'red-prio', 'orange-prio', 'green-prio');
    const prevImg = document.getElementById(activeButton.id + '_img');
    prevImg.src = prevImg.src.replace('-event', '');
  }
  
  if (activeButton !== button) {
    activeButton = button;
    button.classList.add('active-prio');
    
    const img = document.getElementById(buttonId + '_img');
    
    if (buttonId === 'urgent_button') {
      button.classList.add('red-prio');
      img.src = '/assets/icons/prio-high-event.svg';
    } else if (buttonId === 'medium_button') {
      button.classList.add('orange-prio');
      img.src = '/assets/icons/prio-medium-event.svg';
    } else if (buttonId === 'low_button') {
      button.classList.add('green-prio');
      img.src = '/assets/icons/prio-low-event.svg';
    }
  } else {
    activeButton = null;
  }
}

