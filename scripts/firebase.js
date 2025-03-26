const BASE_URL = 'https://join-435-default-rtdb.europe-west1.firebasedatabase.app/';

async function loadData(path = '') {
  try {
    const response = await fetch(BASE_URL + path + '.json');

    if (!response.ok) {
      throw new Error(`HTTP Fehler! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fehler beim Laden der Daten:', error);
    return null;
  }
}

async function postData(path = '', data = {}) {
  try {
    const response = await fetch(BASE_URL + path + '.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    let responseToJson = await response.json();
    return responseToJson;
  } catch (error) {
    console.error('Fehler in postData:', error);
    return null;
  }
}

async function updateData(path = '', data = {}) {
  try {
    const response = await fetch(BASE_URL + path + '.json', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseToJson = await response.json();
    return responseToJson;
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Daten:', error);
    return null;
  }
}

async function deleteData(path = '') {
  try {
    const response = await fetch(BASE_URL + path + '.json', {
      method: 'DELETE',
    });

    if (response.headers.get('content-length') !== '0') {
      const responseToJson = await response.json();
      console.log('Firebase-Antwort:', responseToJson);
      return responseToJson;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Fehler beim Löschen der Daten:', error);
  }
}

async function deleteData(path) {
  const response = await fetch(`${BASE_URL}/${path}.json`, {
    method: 'DELETE'
  });
  return response.json();
}