function init(){
  setupFormEvents();
  setupCancelHover();
  setupCreateButton();
}

function setupFormEvents(){
  var addBtn = document.querySelector(".add-contact-btn"),
      form = document.querySelector(".container-add"),
      closeBtn = document.querySelector(".close-btn"),
      overlay = document.querySelector(".overlay"),
      cancelBtn = document.querySelector(".cancel-btn");
  addBtn.onclick = function(){
    form.classList.remove("hidden");
    overlay.classList.add("active");
    setTimeout(function(){ form.classList.add("active"); }, 10);
  };
  var closeForm = function(){
    form.classList.remove("active");
    overlay.classList.remove("active");
    setTimeout(function(){ form.classList.add("hidden"); }, 500);
  };
  closeBtn.onclick = closeForm;
  overlay.onclick = closeForm;
  cancelBtn.onclick = closeForm;
}

function setupCancelHover(){
  var cancelBtn = document.querySelector(".cancel-btn"),
      cancelIcon = cancelBtn.querySelector("img");
  cancelBtn.onmouseenter = function(){
    cancelIcon.src = "./assets/icons/x-mark-blue.svg";
  };
  cancelBtn.onmouseleave = function(){
    cancelIcon.src = "./assets/icons/cancel.svg";
  };
}

function setupCreateButton(){
  var createBtn = document.querySelector(".create-btn"),
      overlay = document.querySelector(".overlay"),
      form = document.querySelector(".container-add");
  createBtn.onclick = function(e){
    e.preventDefault();
    if(overlay.classList.contains("active")){
      overlay.classList.remove("active");
    }
    form.classList.add("hidden");
    showSuccessPopup();
  };
}

function showSuccessPopup(){
  var popup = document.getElementById("success-popup");
  popup.classList.remove("popup-hidden");
  popup.classList.add("show");
  setTimeout(function(){
    popup.classList.add("popup-hidden");
    popup.classList.remove("show");
  }, 3000);
}
  