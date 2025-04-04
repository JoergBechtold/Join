function activateContact(contactDiv) {
  if (!contactDiv || contactDiv.classList.contains("active-contact"))
    return false;
  const current = document.querySelector(".active-contact");
  if (current) current.classList.remove("active-contact");
  contactDiv.classList.add("active-contact");
  activeContact = contactDiv;
  return true;
}

function extractContactData(contactDiv) {
  const nameVal = contactDiv.querySelector(".contact-name").textContent;
  const emailVal = contactDiv.querySelector(".contact-email").textContent;
  const phoneVal = contactDiv.getAttribute("data-phone") || "Keine Nummer vorhanden";
  const contactAvatar = contactDiv.querySelector(".contact-avatar");
  const avatarVal = contactAvatar.textContent.trim();
  const avatarColor = window.getComputedStyle(contactAvatar).backgroundColor;
  return { nameVal, emailVal, phoneVal, avatarVal, avatarColor };
}

function updateDetailPanelUI(data) {
  const ds = document.querySelector(".contact-detail");
  const detailName = document.getElementById("detail-name");
  const detailEmail = document.getElementById("detail-email");
  const detailPhone = document.getElementById("detail-phone");
  const detailAvatar = document.getElementById("detail-avatar");

  detailName.textContent = data.nameVal;
  createPhoneAndEmailLink(detailEmail, data.emailVal, `mailto:${data.emailVal}`);
  createPhoneAndEmailLink(detailPhone, data.phoneVal, `tel:${data.phoneVal}`);
  detailAvatar.textContent = data.avatarVal;
  detailAvatar.style.backgroundColor = data.avatarColor;
  ds.classList.add("visible");
}

function updateContactDetailPanel(contactDiv) {
  const contactData = extractContactData(contactDiv);
  updateDetailPanelUI(contactData);
}

function createPhoneAndEmailLink(parentElement, linkText, linkHref) {
  const linkElement = document.createElement("a");
  linkElement.textContent = linkText;
  linkElement.href = linkHref;
  parentElement.innerHTML = ""; 
  parentElement.appendChild(linkElement);
}

function showContactDetails(contactDiv) {
  if (activateContact(contactDiv)) {
    updateContactDetailPanel(contactDiv);
  }
}      

function handleContactListClick(event) {
  let target = event.target;
  if (target.nodeType === 3) {
    target = target.parentElement;
  }

  let deleteBtn = target.closest('.delete-btn');

  if (deleteBtn) {
    processContactDeletion(deleteBtn);
  } else {
    let contact = target.closest('.contact');
    showContactDetails(contact);
  }
}

function showEditContactPopup() {
  const popupContainer = document.querySelector('.container-edit');
  const overlayElement = document.querySelector('.overlay');

  popupContainer.classList.remove('hidden');
  overlayElement.classList.remove('hidden');

  popupContainer.classList.add('active');
  overlayElement.classList.add('active');
}

function closeEditContactPopup() {
  const popupContainer = document.querySelector('.container-edit');
  const overlayElement = document.querySelector('.overlay');

  popupContainer.classList.remove('active');
  overlayElement.classList.remove('active');

  setTimeout(() => {
    popupContainer.classList.add('hidden');
    overlayElement.classList.add('hidden');
  }, 500);
}

function processContactEdition() {
  if (!activeContact) {
    return;
  }
  const nameInput = document.querySelector('.container-edit input[placeholder="Firstname Lastname"]');
  const emailInput = document.querySelector('.container-edit input[placeholder="Email"]');
  const phoneInput = document.querySelector('.container-edit input[placeholder="Phone"]');

  nameInput.value = activeContact.querySelector('.contact-name').textContent;
  emailInput.value = activeContact.querySelector('.contact-email').textContent;
  phoneInput.value = activeContact.getAttribute('data-phone') || "";

  showEditContactPopup();
  checkInputs();
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
  const detailAvatar = document.getElementById('detail-avatar');
  if (detailAvatar) { 
    detailAvatar.textContent = initials;
    detailAvatar.style.backgroundColor = aDiv.style.backgroundColor;
  }
}

function needsReposition(newName) {
  const currentName = activeContact.querySelector('.contact-name').textContent;
  return currentName.charAt(0).toUpperCase() !== newName.charAt(0).toUpperCase();
}

function removeContactFromContainer(contact) {
  const container = contact.parentElement;
  contact.remove();
  if (container.children.length === 0) {
    const lineElem = container.previousElementSibling;
    const letterGroupElem = lineElem ? lineElem.previousElementSibling : null;
    if (letterGroupElem && letterGroupElem.classList.contains("letter-group")) {
      letterGroupElem.remove();
    }
    if (lineElem && lineElem.classList.contains("line")) {
      lineElem.remove();
    }
    container.remove();
  }
}

function repositionContactIfNeeded(newName) {
  if (needsReposition(newName)) {
    removeContactFromContainer(activeContact);
    const newGroupContainer = getOrCreateGroupContainer(newName.charAt(0).toUpperCase());
    insertContactSorted(newGroupContainer, activeContact, newName);
  }
}

function updateContactUI(newName, newEmail, newPhone, initials) {
  updateBasicContactUI(newName, newEmail, newPhone, initials);
  repositionContactIfNeeded(newName);
}      

function updateContactFirebase(id, firstname, lastname, newEmail, newPhone, initials) {
  if (id) {
    fetch(`${BASE_URL}/contacts/${id}.json`, {
      method: 'PATCH', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstname, 
        lastname, 
        email: newEmail, 
        phone: newPhone, 
        initials
      })
    })
    .then(r => {
      if (!r.ok) throw new Error();
      return r.json();
    })
    .catch(err => {
      console.error("Error updating contact:", err);
    });
  }
}

function getEditFormValues() {
  let container = document.querySelector('.container-edit');
  let nameInput = container.querySelector('input[placeholder="Firstname Lastname"]');
  let emailInput = container.querySelector('input[placeholder="Email"]');
  let phoneInput = container.querySelector('input[placeholder="Phone"]');
  let nameVal = nameInput.value.trim();
  let emailVal = emailInput.value.trim();
  let phoneVal = phoneInput.value.trim();
  if (!nameVal || !emailVal || !phoneVal) {
    
    return null;
  }
  return { name: nameVal, email: emailVal, phone: phoneVal };
}

function prepareContactData(fullData) {
  let newName = fullData.name;
  let newEmail = fullData.email;
  let newPhone = fullData.phone;
  let parts = newName.split(' ');
  let firstName = parts[0];
  let lastName = parts.slice(1).join(' ');
  let initials = newName.split(' ').map(w => w.charAt(0).toUpperCase()).join('');
  let id = activeContact.getAttribute('data-id');
  return { newName, newEmail, newPhone, firstName, lastName, initials, id };
}

function saveContact(event) {
  event.preventDefault();
  let formValues = getEditFormValues();
  if (!formValues) return;
  let data = prepareContactData(formValues);
  updateContactUI(data.newName, data.newEmail, data.newPhone, data.initials);
  updateContactFirebase(data.id, data.firstName, data.lastName, data.newEmail, data.newPhone, data.initials);
  closeEditContactPopup();
}

function hoverEdit(isHovered) {
  const editIcon = document.getElementById("edit-icon");
  if (editIcon) {
    editIcon.src = isHovered ? "assets/icons/editblau.svg" : "assets/icons/edit.svg";
  }
}

function hoverDelete(isHovered) {
  const deleteIcon = document.getElementById("delete-icon");
  if (deleteIcon) {
    deleteIcon.src = isHovered ? "assets/icons/delete.svg" : "assets/icons/paperbasketdelet.svg";
  }
}

async function fetchContacts() {
  try {
    const data = await loadData('/contacts');
    return data || {};
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return {};
  }
}

function processContact(key, contact) {
  if (contact && typeof contact.firstname === 'string') {
    const fullName = contact.lastname 
      ? contact.firstname + " " + contact.lastname 
      : contact.firstname;
    const firstLetter = contact.firstname.charAt(0).toUpperCase();
    const container = getOrCreateGroupContainer(firstLetter);
    const el = buildContactElement(fullName, contact.email, contact.phone, contact.contactColor);
    el.setAttribute("data-id", key);
    insertContactSorted(container, el, fullName);
  } else {
    console.warn("Invalid contact for key", key, contact);
  }
}

async function loadContacts() {
  try {
    await showLoggedInLinks() ;
    const contacts = await fetchContacts();
    for (const key in contacts) {
      if (contacts.hasOwnProperty(key)) {
        processContact(key, contacts[key]);
      }
    }
  } catch (error) {
    console.error("Error loading contacts:", error);
  }
}
