function activateContact(contactDiv) {
  if (!contactDiv || contactDiv.classList.contains("active-contact"))
    return false;
  const current = document.querySelector(".active-contact");
  if (current) current.classList.remove("active-contact");
  contactDiv.classList.add("active-contact");
  activeContact = contactDiv;
  return true;
}

function updateContactDetailPanel(contactDiv) {
  const ds = document.querySelector(".contact-detail"),
        dn = document.getElementById("detail-name"),
        de = document.getElementById("detail-email"),
        dp = document.getElementById("detail-phone"),
        da = document.getElementById("detail-avatar");
  const nameVal = contactDiv.querySelector(".contact-name").textContent,
        emailVal = contactDiv.querySelector(".contact-email").textContent,
        phoneVal = contactDiv.getAttribute("data-phone") || "Keine Nummer vorhanden";
  const ad = contactDiv.querySelector(".contact-avatar"),
        avVal = ad.textContent.trim(),
        avColor = window.getComputedStyle(ad).backgroundColor;
  dn.textContent = nameVal; de.textContent = emailVal; dp.textContent = phoneVal;
  da.textContent = avVal; da.style.backgroundColor = avColor;
  ds.classList.add("visible");
}

function showContactDetails(contactDiv) {
  if (activateContact(contactDiv)) {
    updateContactDetailPanel(contactDiv);
  }
}      

function handleContactListClick(event) {
  const target = event.target.nodeType === 3 ? event.target.parentElement : event.target,
        dBtn = target.closest(".delete-btn");
  dBtn ? processContactDeletion(dBtn) : showContactDetails(target.closest(".contact"));
}

function showEditContactPopup() {
  const p = document.querySelector('.container-edit'), o = document.querySelector('.overlay');
  p.classList.remove('hidden'); o.classList.remove('hidden');
  p.classList.add('active'); o.classList.add('active');
}

function closeEditContactPopup() {
  const p = document.querySelector('.container-edit'), o = document.querySelector('.overlay');
  p.classList.remove('active'); o.classList.remove('active');
  setTimeout(() => { p.classList.add('hidden'); o.classList.add('hidden'); }, 500);
}

function processContactEdition() {
  if (!activeContact) { alert("Bitte wähle einen Kontakt aus!"); return; }
  const n = document.querySelector('.container-edit input[placeholder="Name"]'),
        e = document.querySelector('.container-edit input[placeholder="Email"]'),
        p = document.querySelector('.container-edit input[placeholder="Phone"]');
  n.value = activeContact.querySelector('.contact-name').textContent;
  e.value = activeContact.querySelector('.contact-email').textContent;
  p.value = activeContact.getAttribute('data-phone') || "";
  showEditContactPopup(); checkInputs();
}

function updateBasicContactUI(newName, newEmail, newPhone, initials) {
  activeContact.querySelector('.contact-name').textContent = newName;
  activeContact.querySelector('.contact-email').textContent = newEmail;
  activeContact.setAttribute('data-phone', newPhone);
  const aDiv = activeContact.querySelector('.contact-avatar');
  aDiv.textContent = initials;
  document.getElementById('detail-name').textContent = newName;
  document.getElementById('detail-email').textContent = newEmail;
  document.getElementById('detail-phone').textContent = newPhone;
  const da = document.getElementById('detail-avatar');
  if (da) { 
    da.textContent = initials;
    da.style.backgroundColor = aDiv.style.backgroundColor;
  }
}

function repositionContactIfNeeded(newName) {
  const currentName = activeContact.querySelector('.contact-name').textContent;
  if (currentName.charAt(0).toUpperCase() !== newName.charAt(0).toUpperCase()) {
    const currCont = activeContact.parentElement;
    activeContact.remove();
    if (currCont.children.length === 0) {
      const l = currCont.previousElementSibling;
      const lg = l ? l.previousElementSibling : null;
      if (lg && lg.classList.contains("letter-group")) { lg.remove(); }
      if (l && l.classList.contains("line")) { l.remove(); }
      currCont.remove();
    }
    insertContactSorted(getOrCreateGroupContainer(newName.charAt(0).toUpperCase()), activeContact, newName);
  }
}

function updateContactUI(newName, newEmail, newPhone, initials) {
  updateBasicContactUI(newName, newEmail, newPhone, initials);
  repositionContactIfNeeded(newName);
}      

function updateContactFirebase(id, firstname, lastname, newEmail, newPhone, initials) {
  if (id) {
    fetch(`${BASE_URL}/contacts/${id}.json`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstname, lastname, email: newEmail, phone: newPhone, initials })
    }).then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => { console.log("Contact updated:", data); })
      .catch(err => { console.error("Error updating contact:", err); });
  }
}

function getEditFormValues() {
  var container = document.querySelector('.container-edit');
  var nameInput = container.querySelector('input[placeholder="Name"]');
  var emailInput = container.querySelector('input[placeholder="Email"]');
  var phoneInput = container.querySelector('input[placeholder="Phone"]');
  var nameVal = nameInput.value.trim();
  var emailVal = emailInput.value.trim();
  var phoneVal = phoneInput.value.trim();
  if (!nameVal || !emailVal || !phoneVal) {
    alert("Please fill in all fields!");
    return null;
  }
  return { name: nameVal, email: emailVal, phone: phoneVal };
}

function prepareContactData(fullData) {
  var newName = fullData.name;
  var newEmail = fullData.email;
  var newPhone = fullData.phone;
  var parts = newName.split(' ');
  var firstName = parts[0];
  var lastName = parts.slice(1).join(' ');
  var initials = newName.split(' ').map(w => w.charAt(0).toUpperCase()).join('');
  var id = activeContact.getAttribute('data-id');
  return { newName, newEmail, newPhone, firstName, lastName, initials, id };
}

function saveContact(event) {
  event.preventDefault();
  var formValues = getEditFormValues();
  if (!formValues) return;
  var data = prepareContactData(formValues);
  updateContactUI(data.newName, data.newEmail, data.newPhone, data.initials);
  updateContactFirebase(data.id, data.firstName, data.lastName, data.newEmail, data.newPhone, data.initials);
  closeEditContactPopup();
}
      
function showConfirmPopup(msg, callback) {
  const p = document.querySelector('.confirm-popup'),
        m = p.querySelector('.confirm-message'),
        y = p.querySelector('.confirm-yes'),
        n = p.querySelector('.confirm-no');
  m.textContent = msg; p.classList.remove('hidden'); p.classList.add('active');
  y.onclick = () => { p.classList.add('hidden'); p.classList.remove('active'); callback(true); };
  n.onclick = () => { p.classList.add('hidden'); p.classList.remove('active'); callback(false); };
}

function hoverEdit(isH) { const i = document.getElementById("edit-icon"); if(i) i.src = isH ? "assets/icons/editblau.svg" : "assets/icons/edit.svg"; }
function hoverDelete(isH) { const i = document.getElementById("delete-icon"); if(i) i.src = isH ? "assets/icons/delete.svg" : "assets/icons/paperbasketdelet.svg"; }

function loadContacts() {
  fetch(`${BASE_URL}/contacts.json`).then(r => r.json()).then(data => {
    if (data) Object.keys(data).forEach(key => {
      const c = data[key];
      if (c && typeof c.firstname === 'string') {
        const fullName = c.lastname ? `${c.firstname} ${c.lastname}` : c.firstname,
              letter = c.firstname.charAt(0).toUpperCase(),
              cont = getOrCreateGroupContainer(letter),
              el = buildContactElement(fullName, c.email, c.phone, c.contactColor);
        el.setAttribute('data-id', key); insertContactSorted(cont, el, fullName);
      } else console.warn("Invalid contact for key", key, c);
    });
  }).catch(err => { console.error("Error loading contacts:", err); });
}
  