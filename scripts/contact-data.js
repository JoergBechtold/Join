/**
 * Updates the contact information in Firebase using a PATCH request.
 *
 * @param {string} id - The ID of the contact to be updated.
 * @param {string} firstname - The first name of the contact.
 * @param {string} lastname - The last name of the contact.
 * @param {string} newEmail - The new email address.
 * @param {string} newPhone - The new phone number.
 * @param {string} initials - The initials to be saved.
 */
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
  
  /**
   * Retrieves and validates the values from the edit form.
   *
   * @returns {?object} - An object with properties name, email, and phone if all fields are filled; otherwise, null.
   */
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
  
  /**
   * Prepares the complete contact data from the edit form.
   * It splits the name into first and last names and computes the initials.
   *
   * @param {object} fullData - An object containing {name, email, phone} values.
   * @returns {object} - An object with properties newName, newEmail, newPhone, firstName, lastName, initials, and id.
   */
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
  
  /**
   * Saves the changes of a contact by reading the form values and updating
   * both the UI and the Firebase data.
   *
   * @param {Event} event - The form submit event.
   */
  function saveContact(event) {
    event.preventDefault();
    let formValues = getEditFormValues();
    if (!formValues) return;
    let data = prepareContactData(formValues);
    updateContactUI(data.newName, data.newEmail, data.newPhone, data.initials);
    updateContactFirebase(data.id, data.firstName, data.lastName, data.newEmail, data.newPhone, data.initials);
    closeEditContactPopup();
  }
  
  /**
   * Asynchronously fetches all contacts from the server (e.g., Firebase).
   *
   * @returns {Promise<object>} - A promise that resolves to an object containing the contacts.
   */
  async function fetchContacts() {
    try {
      const data = await loadData('/contacts');
      return data || {};
    } catch (error) {
      console.error("Error fetching contacts:", error);
      return {};
    }
  }
  
  /**
   * Processes a single contact, creates an element for it, and inserts it in sorted order into the group container.
   *
   * @param {string} key - The unique ID of the contact.
   * @param {object} contact - The contact object with properties such as firstname, lastname, email, phone, and contactColor.
   */
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
  
  /**
   * Loads all contacts, initializes the header, and adds the loaded contacts to the user interface.
   *
   * @returns {Promise<void>}
   */
  async function loadContacts() {
    try {
      await loadHeaderAndInitialize();
      await showLoggedInLinks();
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
  