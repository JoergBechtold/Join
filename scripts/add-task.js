function clearAll() {
  clearInput();
  clearButtons();
  clearSubtasks();
  clearSelection();
  clearAssignedTo();
  clearErrorMessages();
}

function clearInput() {
  const inputBaseFields = document.getElementsByClassName('input-base');
  const textareaBaseFields = document.getElementsByClassName('textarea-base');
  for (let i = 0; i < inputBaseFields.length; i++) {
    inputBaseFields[i].value = '';
  }
  for (let i = 0; i < textareaBaseFields.length; i++) {
    textareaBaseFields[i].value = '';
  }
}

function toggleCategoryDropdown() {
  const optionsContainer = document.getElementById('options_container');
  const arrowIcon = document.getElementById('select_arrow');
  if (optionsContainer.classList.contains('d-none')) {
    optionsContainer.classList.remove('d-none');
    arrowIcon.src = 'assets/icons/arrow_drop_down_up.svg';
  } else {
    optionsContainer.classList.add('d-none');
    arrowIcon.src = 'assets/icons/arrow_drop_down.svg';
  }
}

function selectOption(value) {
  const selectedOption = document.getElementById('selected_option');
  selectedOption.textContent = value.charAt(0).toUpperCase() + value.slice(1);
  document.getElementById('options_container').classList.add('d-none');
  document.getElementById('select_arrow').src = 'assets/icons/arrow_drop_down.svg';
}

function clearSelection() {
  const selectedOption = document.getElementById('selected_option');
  selectedOption.textContent = 'Select task category';
}

function validateInputTitle() {
  const inputField = document.getElementById('title');
  const errorMessage = document.getElementById('error_message_title');
  if (inputField.value.trim() === '') {
    errorMessage.classList.remove('d-none');
    inputField.classList.add('red-border');
    return false;
  } else {
    errorMessage.classList.add('d-none');
    inputField.classList.remove('red-border');
    return true;
  }
}

function validateInputDate() {
  const inputField = document.getElementById('due_date');
  const errorMessage = document.getElementById('error_message_date');

  if (inputField.value.trim() === '') {
    errorMessage.classList.remove('d-none');
    inputField.classList.add('red-border');
    return false;
  } else {
    errorMessage.classList.add('d-none');
    inputField.classList.remove('red-border');
    return true;
  }
}

function validateCategory() {
  const selectedOption = document.getElementById('selected_option');
  const errorMessage = document.getElementById('error_message_category');
  const customSelect = document.getElementById('costum_select_category');
  if (selectedOption.textContent === 'Select task category') {
    errorMessage.classList.remove('d-none');
    customSelect.classList.add('red-border');
    return false;
  } else {
    errorMessage.classList.add('d-none');
    customSelect.classList.remove('red-border');
    return true;
  }
}

function clearErrorMessages() {
  const titleInput = document.getElementById('title');
  const titleErrorMessage = document.getElementById('error_message_title');
  titleErrorMessage.classList.add('d-none');
  titleInput.classList.remove('red-border');
  const dateInput = document.getElementById('due_date');
  const dateErrorMessageRequired = document.getElementById('error_message_date');
  dateErrorMessageRequired.classList.add('d-none');
  dateInput.classList.remove('red-border');
  const categoryErrorMessage = document.getElementById('error_message_category');
  const customSelect = document.getElementById('costum_select_category');
  categoryErrorMessage.classList.add('d-none');
  customSelect.classList.remove('red-border');
}

function checkandSubmit() {
  const title = validateInputTitle();
  const date = validateInputDate();
  const category = validateCategory();
  if (title && date && category) {
    pushTaskToFirebase();
  }
}

async function pushTaskToFirebase() {
  const taskData = createTaskData();
  try {
    const response = await postData('tasks', taskData);
    if (response) {
      showPupupOverlayTaskAdded();
      clearAll();
      setTimeout(() => {
        goToUrl('index.html');
      }, 1700);
    } else {
      throw new Error('No response received from Firebase.');
    }
  } catch (error) {
    console.error('Error saving task', error);
  }
}

function createTaskData() {
  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  const dueDate = document.getElementById('due_date').value.trim();
  const selectedCategory = document.getElementById('selected_option').textContent.trim();
  const priority = getPriority();
  const subtasksArray = Array.isArray(subtasks) && subtasks.length > 0 ? subtasks : '';
  const assignedTo = Array.isArray(selectedContacts) && selectedContacts.length > 0 ? selectedContacts : '';
  return {
    title: title,
    description: description || '',
    due_date: dueDate,
    priority: priority,
    assigned_to: assignedTo,
    category: selectedCategory,
    subtasks: subtasksArray,
    state: 'open',
  };
}

function getPriority() {
  if (activeButton && activeButton.id === 'urgent_button') {
    return 'Urgent';
  } else if (activeButton && activeButton.id === 'medium_button') {
    return 'Medium';
  } else if (activeButton && activeButton.id === 'low_button') {
    return 'Low';
  } else {
    return 'No Priority';
  }
}

function showPupupOverlayTaskAdded() {
  const taskAdded = document.getElementById('popup_overlay_task_added');
  taskAdded.classList.add('d-flex');
  setTimeout(function () {
    taskAdded.classList.remove('d-flex');
  }, 800);
}
