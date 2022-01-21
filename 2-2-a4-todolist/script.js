// 初始變數
const list = document.querySelector("#my-todo");
const addBtn = document.querySelector("#add-btn");
const input = document.querySelector("#new-todo");
const done = document.querySelector("#my-done");
const totalTodo = document.querySelector("#total-todo");

// 資料
const todos = [
  "Hit the gym",
  "Read a book",
  "Buy eggs",
  "Organize office",
  "Pay bills"
];

for (let todo of todos) {
  addItem(todo);
}

// 函式
function addItem(text) {
  let newItem = document.createElement("li");
  newItem.innerHTML = `
    <label for="todo">${text}</label>
    <i class="delete fa fa-trash"></i>
  `;
  list.appendChild(newItem);
}

// Create
const createTodoList = () => {
  const inputValue = input.value;
  if (inputValue.trim().length > 0) {
    addItem(inputValue);
  } else if (inputValue.trim().length === 0) {
    // 防止產生空白 todo
    alert("Empty Input!");
  }
};

addBtn.addEventListener("click", createTodoList);
input.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    createTodoList();
  }
});

// Delete and check
totalTodo.addEventListener("click", function (event) {
  const target = event.target;
  const parentElement = target.parentElement;
  if (target.classList.contains("delete")) {
    parentElement.remove();
  } else if (!target.classList.contains("checked")) {
    done.appendChild(parentElement);
    target.classList.toggle("checked");
  } else if (target.classList.contains("checked")) {
    console.log(parentElement);
    list.appendChild(parentElement);
    target.classList.toggle("checked");
  }
});