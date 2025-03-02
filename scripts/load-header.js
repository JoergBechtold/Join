document.addEventListener("DOMContentLoaded", function () {
    fetch("header_sidebar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("header-container").innerHTML = data;
        })
        .catch(error => console.error("Fehler beim Laden des Headers:", error));
});
