const taskInput = document.querySelector(".task-input input"),

// inside ul tag to add li from the code of javascript
taskBox = document.querySelector(".task-box"),

filters = document.querySelectorAll(".filters span"),

clearAll = document.querySelector(".clear-btn");

let editId;
let isEditedTask = false;
// getting item from the local storage having the key-value pair --> "todo-list"
let todos = JSON.parse(localStorage.getItem("todo-list"));

filters.forEach(btn => {
   btn.addEventListener("click",() => {
      // console.log(btn);
      document.querySelector("span.active").classList.remove("active");
      btn.classList.add("active");
      showTodo(btn.id);
   })
})

function showTodo(filter) {
  let li = "";
  if (todos) {
    todos.forEach((todo, id) => {
      let isCompleted = todo.status == "completed" ? "checked" : "";
      // console.log(todo);
      if (filter == todo.status || filter == "all") {
         li += `
           <li class="task">
              <label for="${id}">
                 <input type="checkbox" onclick="updateStatus(this)" id="${id}" ${isCompleted}>
                 <p class="${isCompleted}">${todo.name}</p>
              </label>
              <div class="settings">
                 <i onclick="showMenu(this)" class="fa-solid fa-ellipsis"></i>
                 <ul class="task-menu">
                    <li onclick="editTask(${id}, '${todo.name}')"><i class="fas fa-pen"></i>Edit</li>
                    <li onclick="deleteTask(${id})"><i class="fas fa-trash"></i>Delete</li>
                 </ul>
              </div>
           </li>
        `;
      }
    });
  }
  taskBox.innerHTML = li || `<span>You dont have any task here</span>`;
}
showTodo("all");

function showMenu(selectedTask) {
   // console.log(selectedTask);
   let taskMenu = selectedTask.parentElement.lastElementChild;
   taskMenu.classList.add("show");
   document.addEventListener("click", e => {
      if (e.target.tagName != "I" || e.target != selectedTask) {
         taskMenu.classList.remove("show");
      }
   })
}

function editTask(taskId, taskName) {
   editId = taskId;
   isEditedTask = true;
   taskInput.value = taskName;
}

clearAll.addEventListener("click",() => {
   todos.splice(0, todos.length);
   localStorage.setItem("todo-list", JSON.stringify(todos));
   showTodo("all");
})

function deleteTask(deleteId) {
   // console.log(deleteId);
   todos.splice(deleteId, 1);
   localStorage.setItem("todo-list", JSON.stringify(todos));
   showTodo("all");
}

function updateStatus(selectedTask) {
   // console.log(selectedTask);
   let taskName = selectedTask.parentElement.lastElementChild;
   if (selectedTask.checked) {
      taskName.classList.add("checked");
      todos[selectedTask.id].status = "completed";
   } else {
      taskName.classList.remove("checked");
      todos[selectedTask.id].status = "pending";
   }
   localStorage.setItem("todo-list", JSON.stringify(todos));
}

taskInput.addEventListener("keyup", (e) => {
  let userTask = taskInput.value.trim();
  if (e.key == "Enter" && userTask) {
   // console.log(userTask);
   if (!isEditedTask) {
      if (!todos) {
        // if todos doesnt exit, pass the empty array to todos
        todos = [];
      }
      let taskInfo = { name: userTask, status: "pending" };
      todos.push(taskInfo);
   } else {
      isEditedTask = false;
      todos[editId].name = userTask;
   }
    taskInput.value = "";
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo("all");
  }
});
