const BASE_URL = 'https://join-435-default-rtdb.europe-west1.firebasedatabase.app/';

// Globaler Status und Farbvariablen
var activeContact = null;
var colorVariables = [
  "--circle-bg-color-orange", "--circle-bg-color-pink",
  "--circle-bg-color-violet", "--circle-bg-color-purple",
  "--circle-bg-color-turquoise", "--circle-bg-color-mint",
  "--circle-bg-color-coral", "--circle-bg-color-peach",
  "--circle-bg-color-magenta", "--circle-bg-color-yellow",
  "--circle-bg-color-blue", "--circle-bg-color-lime",
  "--circle-bg-color-lemon", "--circle-bg-color-red",
  "--circle-bg-color-gold"
];

// Öffnet das Popup zum Hinzufügen eines Kontakts
function showAddContactPopup() {
  document.querySelector('.overlay').classList.remove('hidden');
  document.querySelector('.container-add').classList.remove('hidden');
}

// Schließt das Popup zum Hinzufügen eines Kontakts
function closeAddContactPopup() {
  document.querySelector('.overlay').classList.add('hidden');
  document.querySelector('.container-add').classList.add('hidden');
}

// Aktualisierte checkInputs-Funktion für beide Popups (Add und Edit)
function checkInputs() {
    // Ermittelt den aktiven Popup-Container (falls vorhanden)
    var container = document.querySelector('.container-edit.active') ||
                    document.querySelector('.container-add.active');
    if (!container) return; // falls keins aktiv ist, nichts tun
  
    var nameInput = container.querySelector('input[placeholder="Name"]');
    var emailInput = container.querySelector('input[placeholder="Email"]');
    var phoneInput = container.querySelector('input[placeholder="Phone"]');
    var btn = container.querySelector('.create-btn'); // Bei Add: "Create contact", bei Edit: "Save contact"
    
    // Validierung: Email muss ein vollständiges Format haben, Phone nur Ziffern
    var isPhoneValid = /^[0-9]+$/.test(phoneInput.value.trim());
    var isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim());
    
    if (nameInput.value.trim() !== "" && isEmailValid && phoneInput.value.trim() !== "" && isPhoneValid) {
      btn.disabled = false;
      btn.classList.remove("disabled");
    } else {
      btn.disabled = true;
      btn.classList.add("disabled");
    }
  }
   

  function getInputValues() {
    // Prüfe, ob das Edit-Popup aktiv ist; wenn ja, verwende dessen Felder,
    // ansonsten verwende das Add-Popup.
    var container = document.querySelector('.container-edit.active') ||
                    document.querySelector('.container-add.active');
    if (!container) {
      // Falls kein Popup aktiv ist, greife global auf die ersten Inputfelder zu
      container = document;
    }
    var nameInput = container.querySelector('input[placeholder="Name"]');
    var emailInput = container.querySelector('input[placeholder="Email"]');
    var phoneInput = container.querySelector('input[placeholder="Phone"]');
    return { 
      name: nameInput ? nameInput.value.trim() : "",
      email: emailInput ? emailInput.value.trim() : "",
      phone: phoneInput ? phoneInput.value.trim() : ""
    };
  }
  
  
// Sucht den Gruppen-Container oder erstellt ihn neu, falls nicht vorhanden
function getOrCreateGroupContainer(firstLetter) {
  var cl = document.querySelector('.contact-list'),
      lg = document.querySelector(`.letter-group[data-letter="${firstLetter}"]`),
      cc;
  if (!lg) {
    lg = document.createElement("div"); lg.classList.add("letter-group");
    lg.setAttribute("data-letter", firstLetter); lg.textContent = firstLetter;
    var nl = document.createElement("div"); nl.classList.add("line");
    cc = document.createElement("div"); cc.classList.add("contact-container");
    var groups = [].slice.call(document.querySelectorAll(".letter-group")),
        ng = groups.find(g => g.textContent > firstLetter);
    if (ng) { cl.insertBefore(lg, ng); cl.insertBefore(nl, ng); cl.insertBefore(cc, ng); }
    else { cl.appendChild(lg); cl.appendChild(nl); cl.appendChild(cc); }
  } else { cc = lg.nextElementSibling.nextElementSibling; }
  return cc;
}
  
// Baut den neuen Kontakt als Element auf
function buildContactElement(name, email, phone) {
  var c = document.createElement("div"); c.classList.add("contact"); 
  c.setAttribute("data-phone", phone);
  var a = document.createElement("div"); a.classList.add("contact-avatar");
  var r = colorVariables[Math.floor(Math.random() * colorVariables.length)];
  a.style.backgroundColor = getComputedStyle(document.documentElement)
                           .getPropertyValue(r).trim();
  a.textContent = name.split(" ").map(function(w){ return w.charAt(0).toUpperCase(); }).join("");
  var i = document.createElement("div"); i.classList.add("contact-info");
  var np = document.createElement("p"); np.classList.add("contact-name"); np.textContent = name;
  var ea = document.createElement("a"); ea.classList.add("contact-email"); ea.textContent = email;
  i.appendChild(np); i.appendChild(ea); c.appendChild(a); c.appendChild(i);
  return c;
}
  
// Fügt den Kontakt sortiert in den Container ein
function insertContactSorted(container, contactEl, name) {
  var contacts = [].slice.call(container.querySelectorAll(".contact")),
      next = contacts.find(function(c){ return c.querySelector(".contact-name").textContent.trim() > name; });
  if (next) container.insertBefore(contactEl, next);
  else container.appendChild(contactEl);
}
  
// Setzt das Formular zurück und aktualisiert den Button-Zustand
function resetForm() {
  var n = document.querySelector('input[placeholder="Name"]'),
      e = document.querySelector('input[placeholder="Email"]'),
      p = document.querySelector('input[placeholder="Phone"]');
  n.value = ""; e.value = ""; p.value = "";
  checkInputs(); closeAddContactPopup();
}
  
function createContact(event) {
  event.preventDefault();
  var inputs = getInputValues();
  if (!inputs.name || !inputs.email || !inputs.phone) { 
    alert("Bitte fülle alle Felder aus!"); 
    return; 
  }
  
  var firstLetter = inputs.name.charAt(0).toUpperCase(),
      container = getOrCreateGroupContainer(firstLetter),
      contactEl = buildContactElement(inputs.name, inputs.email, inputs.phone);
  insertContactSorted(container, contactEl, inputs.name);
  
  // Speichere den neuen Kontakt in Firebase
  fetch(`${BASE_URL}/contacts.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: inputs.name,
      email: inputs.email,
      phone: inputs.phone,
      createdAt: new Date().toISOString()
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log("Kontakt erfolgreich in Firebase gespeichert:", data);
    // Optional: Hier kannst du die Rückgabe (z. B. die generierte ID) weiterverwenden.
  })
  .catch(error => {
    console.error("Fehler beim Speichern des Kontakts in Firebase:", error);
  });
  
  resetForm();
}

  
function processContactDeletion(deleteBtn) {
  // Nutze den deleteBtn oder, falls keiner übergeben wurde, den aktuell aktiven Kontakt
  var contactDiv = deleteBtn ? deleteBtn.closest(".contact") : activeContact;
  if (!contactDiv) return false;
  
  // Bestätigungsabfrage
  if (!confirm("Are you sure you want to delete this contact?")) return false;
  
  // Hole die Firebase-ID, falls vorhanden
  var firebaseId = contactDiv.getAttribute('data-id');
  
  // Wenn eine Firebase-ID vorhanden ist, lösche den Kontakt in Firebase
  if (firebaseId) {
    fetch(`${BASE_URL}/contacts/${firebaseId}.json`, {
      method: 'DELETE'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Fehler beim Löschen des Kontakts in Firebase');
      }
      // Entferne den Kontakt aus der UI, nachdem Firebase die Löschung bestätigt hat
      removeContactFromUI(contactDiv);
    })
    .catch(error => {
      console.error("Fehler beim Löschen des Kontakts in Firebase:", error);
    });
  } else {
    // Falls keine Firebase-ID vorhanden ist, entferne den Kontakt nur aus der UI
    removeContactFromUI(contactDiv);
  }
  
  return true;
}

function removeContactFromUI(contactDiv) {
  var container = contactDiv.parentElement; // .contact-container
  if (activeContact === contactDiv) clearDetails();
  contactDiv.remove();
  
  // Wenn der Container leer ist, entferne auch Gruppe und Trennlinie
  if (container.children.length === 0) {
    var line = container.previousElementSibling;  // sollte die .line sein
    var letterGroup = line ? line.previousElementSibling : null; // sollte die .letter-group sein
    if (letterGroup && letterGroup.classList.contains("letter-group")) {
      letterGroup.remove();
    }
    if (line && line.classList.contains("line")) {
      line.remove();
    }
    container.remove();
  }
}

  
  
  
// Räumt die Detailanzeige auf, wenn der aktive Kontakt gelöscht wird
function clearDetails() {
  var ds = document.querySelector(".contact-detail"),
      dn = document.getElementById("detail-name"),
      de = document.getElementById("detail-email"),
      dp = document.getElementById("detail-phone"),
      da = document.getElementById("detail-avatar");
  ds.classList.remove("visible");
  if (activeContact) activeContact.classList.remove("active-contact");
  activeContact = null;
  dn.textContent = de.textContent = dp.textContent = da.textContent = "";
}
  
// Zeigt die Details eines Kontakts an
function showContactDetails(contactDiv) {
  if (!contactDiv || contactDiv.classList.contains("active-contact")) return;
  var curr = document.querySelector(".active-contact");
  if (curr) curr.classList.remove("active-contact");
  contactDiv.classList.add("active-contact"); activeContact = contactDiv;
  var ds = document.querySelector(".contact-detail"),
      dn = document.getElementById("detail-name"),
      de = document.getElementById("detail-email"),
      dp = document.getElementById("detail-phone"),
      da = document.getElementById("detail-avatar"),
      nameValue = contactDiv.querySelector(".contact-name").textContent,
      emailValue = contactDiv.querySelector(".contact-email").textContent,
      phoneValue = contactDiv.getAttribute("data-phone") || "Keine Nummer vorhanden",
      ad = contactDiv.querySelector(".contact-avatar"),
      avatarValue = ad.textContent.trim(),
      avatarColor = window.getComputedStyle(ad).backgroundColor;
  dn.textContent = nameValue, de.textContent = emailValue, dp.textContent = phoneValue,
  da.textContent = avatarValue, da.style.backgroundColor = avatarColor, ds.classList.add("visible");
}
  
// Hauptfunktion: Behandelt Klicks in der Kontaktliste
function handleContactListClick(event) {
  var deleteBtn = event.target.closest(".delete-btn");
  if (deleteBtn) { processContactDeletion(deleteBtn); return; }
  var contactDiv = event.target.closest(".contact");
  showContactDetails(contactDiv);
}

// Öffnet das Edit-Popup: Entfernt "hidden" und fügt "active" hinzu, damit es von rechts hereingleitet
function showEditContactPopup() {
    var editPopup = document.querySelector('.container-edit');
    var overlay = document.querySelector('.overlay');
    editPopup.classList.remove('hidden');
    overlay.classList.remove('hidden');
    editPopup.classList.add('active');
    overlay.classList.add('active');
  }
  
  // Schließt das Edit-Popup: Entfernt "active" und fügt nach der Animation "hidden" hinzu
  function closeEditContactPopup() {
    var editPopup = document.querySelector('.container-edit');
    var overlay = document.querySelector('.overlay');
    editPopup.classList.remove('active');
    overlay.classList.remove('active');
    setTimeout(function() {
      editPopup.classList.add('hidden');
      overlay.classList.add('hidden');
    }, 500); // 500ms entspricht der Transition-Dauer
  }
  
  // Füllt das Edit-Popup mit den Daten des aktuell ausgewählten Kontakts und zeigt es an
  function processContactEdition() {
    if (!activeContact) {
      alert("Bitte wähle einen Kontakt aus!");
      return;
    }
    var nameInput = document.querySelector('.container-edit input[placeholder="Name"]');
    var emailInput = document.querySelector('.container-edit input[placeholder="Email"]');
    var phoneInput = document.querySelector('.container-edit input[placeholder="Phone"]');
    
    // Vorbelegen der Felder mit den Werten des aktiven Kontakts
    nameInput.value = activeContact.querySelector('.contact-name').textContent;
    emailInput.value = activeContact.querySelector('.contact-email').textContent;
    phoneInput.value = activeContact.getAttribute('data-phone') || "";
    
    // Zeige das Edit-Popup an
    showEditContactPopup();
    
    // Optional: Aktualisiere den Zustand der Save-Schaltfläche
    checkInputs();
  }
  
  function saveContact(event) {
    event.preventDefault();
    
    var container = document.querySelector('.container-edit');
    var nameInput = container.querySelector('input[placeholder="Name"]');
    var emailInput = container.querySelector('input[placeholder="Email"]');
    var phoneInput = container.querySelector('input[placeholder="Phone"]');
    
    if (!nameInput.value.trim() || !emailInput.value.trim() || !phoneInput.value.trim()) {
      alert("Bitte fülle alle Felder aus!");
      return;
    }
    
    var newName = nameInput.value.trim();
    var newEmail = emailInput.value.trim();
    var newPhone = phoneInput.value.trim();
    
    // Ermittle alte Werte und Gruppenzugehörigkeit
    var oldName = activeContact.querySelector('.contact-name').textContent;
    var oldFirstLetter = oldName.charAt(0).toUpperCase();
    var newFirstLetter = newName.charAt(0).toUpperCase();
    
    // Aktualisiere die UI des Kontakts
    activeContact.querySelector('.contact-name').textContent = newName;
    activeContact.querySelector('.contact-email').textContent = newEmail;
    activeContact.setAttribute('data-phone', newPhone);
    
    // Aktualisiere den Avatar (Initialen)
    var avatarDiv = activeContact.querySelector('.contact-avatar');
    avatarDiv.textContent = newName.split(" ").map(function(w) {
      return w.charAt(0).toUpperCase();
    }).join("");
    
    // Aktualisiere die Detailanzeige
    var detailName = document.getElementById('detail-name');
    var detailEmail = document.getElementById('detail-email');
    var detailPhone = document.getElementById('detail-phone');
    var detailAvatar = document.getElementById('detail-avatar');
    if (detailName) detailName.textContent = newName;
    if (detailEmail) detailEmail.textContent = newEmail;
    if (detailPhone) detailPhone.textContent = newPhone;
    if (detailAvatar) {
      detailAvatar.textContent = newName.split(" ").map(function(w) {
        return w.charAt(0).toUpperCase();
      }).join("");
      // Übernimm die Hintergrundfarbe vom Listenelement
      detailAvatar.style.backgroundColor = avatarDiv.style.backgroundColor;
    }
    
    // Falls sich der erste Buchstabe geändert hat, verschiebe den Kontakt in die richtige Gruppe
    if (oldFirstLetter !== newFirstLetter) {
      var currentContainer = activeContact.parentElement; // .contact-container
      activeContact.remove();
      if (currentContainer.children.length === 0) {
        var line = currentContainer.previousElementSibling;
        var letterGroup = line ? line.previousElementSibling : null;
        if (letterGroup && letterGroup.classList.contains("letter-group")) {
          letterGroup.remove();
        }
        if (line && line.classList.contains("line")) {
          line.remove();
        }
        currentContainer.remove();
      }
      var newContainer = getOrCreateGroupContainer(newFirstLetter);
      insertContactSorted(newContainer, activeContact, newName);
    }
    
    // Aktualisiere den Kontakt in Firebase per PATCH-Request
    var firebaseId = activeContact.getAttribute('data-id');
    if (firebaseId) {
      fetch(`${BASE_URL}/contacts/${firebaseId}.json`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          phone: newPhone
        })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error("Fehler beim Aktualisieren des Kontakts in Firebase");
        }
        return response.json();
      })
      .then(data => {
        console.log("Kontakt erfolgreich in Firebase aktualisiert:", data);
      })
      .catch(error => {
        console.error("Fehler beim Aktualisieren des Kontakts in Firebase:", error);
      });
    }
    
    closeEditContactPopup();
  }
  

function deleteAndCloseEdit() {
    processContactDeletion();
    closeEditContactPopup();
  }
  
function hoverEdit(isHover) {
  var img = document.getElementById("edit-icon");
  if (img) {
    img.src = isHover ? "assets/icons/editblau.svg" : "assets/icons/edit.svg";
  }
}

function hoverDelete(isHover) {
  var img = document.getElementById("delete-icon");
  if (img) {
    img.src = isHover ? "assets/icons/delete.svg" : "assets/icons/paperbasketdelet.svg";
  }
}
  
function loadContacts() {
  fetch(`${BASE_URL}/contacts.json`)
    .then(response => response.json())
    .then(data => {
      if (data) {
        Object.keys(data).forEach(key => {
          const contact = data[key];
          // Nur fortfahren, wenn contact existiert und eine name-Eigenschaft hat
          if (contact && typeof contact.name === 'string') {
            const firstLetter = contact.name.charAt(0).toUpperCase();
            const container = getOrCreateGroupContainer(firstLetter);
            const contactEl = buildContactElement(contact.name, contact.email, contact.phone);
            contactEl.setAttribute('data-id', key);
            insertContactSorted(container, contactEl, contact.name);
          } else {
            console.warn("Ungültiger Kontakt für Schlüssel", key, contact);
          }
        });
      }
    })
    .catch(error => {
      console.error("Fehler beim Laden der Kontakte aus Firebase:", error);
    });
}

// Aufruf beim Laden der Seite
window.addEventListener('DOMContentLoaded', loadContacts);

  