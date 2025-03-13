let todos = [
  { id: 0, title: "Aufgabe 1", category: "open" },
  { id: 1, title: "Aufgabe 2", category: "in-progress" },
  { id: 2, title: "Aufgabe 3", category: "await-feedback" },
  { id: 3, title: "Aufgabe 4", category: "done" },
];

let currentDraggedElement;

function updateHTML() {
  const categories = ["open", "in-progress", "await-feedback", "done"];

  categories.forEach((category) => {
    const dragArea = document.getElementById(category);
    dragArea.innerHTML = "";

    const tasksForCategory = todos.filter((todo) => todo.category === category);

    if (tasksForCategory.length === 0) {
      dragArea.innerHTML = `<div class="no-tasks">${getPlaceholderMessage(
        category
      )}</div>`;
    } else {
      tasksForCategory.forEach((todo) => {
        dragArea.innerHTML += generateTodoHTML(todo);
      });
    }
  });
}

function getPlaceholderMessage(category) {
  switch (category) {
    case "open":
      return "No task To do";
    case "in-progress":
      return "No task Progress";
    case "await-feedback":
      return "No Task Await feedback";
    case "done":
      return "No task Done";
    default:
      return "No task";
  }
}

function startDragging(id) {
  currentDraggedElement = id;
}

function generateTodoHTML(element) {
  return `<div draggable="true" ondragstart="startDragging(${element.id})" class="todo">${element.title}</div>`;
}

function allowDrop(ev) {
  ev.preventDefault();
}

function moveTo(category) {
  todos[currentDraggedElement].category = category;
  updateHTML();
}

function highlight(id) {
  document.getElementById(id).classList.add("drag-area-highlight");
}

function removeHighlight(id) {
  document.getElementById(id).classList.remove("drag-area-highlight");
}