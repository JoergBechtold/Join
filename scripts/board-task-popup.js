function openPopup(taskKey) {
  let tasks = JSON.parse(sessionStorage.getItem("tasks"));
  let task = tasks ? tasks[taskKey] : null;
  let popupContainer = document.getElementById("popupContainer");
  let popup = document.getElementById("popup");

  if (task) {
    popup.innerHTML = `
        <div class="popup-header">
          <h2>${task.title || "Task Details"}</h2>
          <button class="close-button" onclick="closePopup()">X</button>
        </div>
        <div class="popup-body">
          <p>${task.description || "No description provided."}</p>
        </div>
      `;
  } else {
    popup.innerHTML = `
        <div class="popup-header">
          <h2>Task Not Found</h2>
          <button class="close-button" onclick="closePopup()">X</button>
        </div>
      `;
  }

  popupContainer.style.display = "block";
  document.getElementById("overlay").style.display = "block";
}

function closePopup() {
  document.getElementById("popupContainer").style.display = "none";
  document.getElementById("overlay").style.display = "none";
}
