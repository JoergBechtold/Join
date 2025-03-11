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

function checkInputs() {
    var nameInput = document.querySelector('input[placeholder="Name"]');
    var emailInput = document.querySelector('input[placeholder="Email"]');
    var phoneInput = document.querySelector('input[placeholder="Phone"]');
    var createBtn = document.querySelector('.create-btn');
    var isPhoneValid = /^[0-9]+$/.test(phoneInput.value.trim());
    // Neuer Regex: Erfordert mindestens ein Zeichen vor und nach dem @, einen Punkt und etwas danach
    var isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim());
    
    if (nameInput.value.trim() !== "" && isEmailValid && phoneInput.value.trim() !== "" && isPhoneValid) {
      createBtn.disabled = false;
      createBtn.classList.remove("disabled");
    } else {
      createBtn.disabled = true;
      createBtn.classList.add("disabled");
    }
  }  

// Liest die Werte der Inputfelder und gibt sie zurück
function getInputValues() {
  var nameInput = document.querySelector('input[placeholder="Name"]'),
      emailInput = document.querySelector('input[placeholder="Email"]'),
      phoneInput = document.querySelector('input[placeholder="Phone"]');
  return { 
    name: nameInput.value.trim(), 
    email: emailInput.value.trim(), 
    phone: phoneInput.value.trim() 
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
  
// Hauptfunktion zum Erstellen eines neuen Kontakts
function createContact(event) {
  event.preventDefault();
  var inputs = getInputValues();
  if (!inputs.name || !inputs.email || !inputs.phone) { alert("Bitte fülle alle Felder aus!"); return; }
  var firstLetter = inputs.name.charAt(0).toUpperCase(),
      container = getOrCreateGroupContainer(firstLetter),
      contactEl = buildContactElement(inputs.name, inputs.email, inputs.phone);
  insertContactSorted(container, contactEl, inputs.name);
  resetForm();
}
  
// Löscht einen Kontakt und räumt die Detailanzeige auf
function processContactDeletion(deleteBtn) {
    // Nutze den deleteBtn oder, falls keiner übergeben wurde, den aktuell aktiven Kontakt
    var contactDiv = deleteBtn ? deleteBtn.closest(".contact") : activeContact;
    if (!contactDiv) return false;
    
    // Bestätigungsabfrage
    if (!confirm("Are you sure you want to delete this contact?")) return false;
    
    // Finde den übergeordneten Container, der alle Kontakte dieser Gruppe enthält
    var container = contactDiv.parentElement; // .contact-container
    if (activeContact === contactDiv) clearDetails();
    
    // Entferne den Kontakt
    contactDiv.remove();
    
    // Falls der Container nun keine Kontakte mehr enthält, entferne auch Gruppe und Trennlinie
    if (container.children.length === 0) {
      // Struktur: letter-group, line, contact-container
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
    
    return true;
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
