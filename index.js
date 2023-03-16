// Variables
const form = document.getElementById('todoform');
const input = document.getElementById('newtodo');
const listElement = document.getElementById('todo-list')
const errorMessage = document.getElementById('error-message');
let todos = JSON.parse(localStorage.getItem('todolist')) || [];
let editTodoId = -1;

renderTodo();

// Form submit
form.addEventListener('submit', function(e){
    e.preventDefault();
    saveTodo();
    renderTodo();
    localStorage.setItem('todolist', JSON.stringify(todos));
});

// Defining saveTodo function
function saveTodo(){
    const todoValue = input.value;

    // check if input field is empty and if the todo is been duplicated
    const isEmpty = todoValue === "";
    if(todoValue === ""){
        displayErrorMessage("Input is empty")
    } else if (todos.some((todo) => todo.value.toUpperCase() === todoValue.toUpperCase())) {
        displayErrorMessage("Todo already exists")
    } else {
        if(editTodoId >= 0){
            todos = todos.map((todo, index) => {
                return {
                    ...todo,
                    value : index === editTodoId ? todoValue : todo.value
                }
            })
            editTodoId = -1;
            input.value = ""
        } else {
            let todo = {
                value: todoValue,
                checked: false
            };
            todos.push(todo);
            input.value = ""
        }
        
    }
}
// Defining renderTodo function
function renderTodo(){

    if(todos.length === 0) {
        listElement.innerHTML = '<center>You have nothing on your list. Type in something!</center>';
        return;
    }
    listElement.innerHTML = "";
    todos.forEach((todo, index) => {
        listElement.innerHTML += `
        <div class="todo" id=${index}>
                <p class="" data-action="check">${todo.value}</p>
                <i class="fa-solid fa-edit" data-action="edit"></i>
                <i class="fa-solid fa-trash-can" data-action="delete"></i>
        </div>
        `;
    });
}
// Defining event listener for all the buttons
listElement.addEventListener('click', (e) => {
    const target = e.target;
    const parentElement = target.parentNode;

    if(parentElement.className !== "todo") return;
    const todo = parentElement;
    const todoId = Number(todo.id);
    
    // target actions
    const action = target.dataset.action

    action === "check" && checkTodo(todoId);
    action === "edit" && editTodo(todoId);
    action === "delete" && deleteTodo(todoId);
    
})

function editTodo(todoId){
    input.value = todos[todoId].value;
    editTodoId = todoId
}

// defining deleteTodo function
function deleteTodo(todoId) {
    todos = todos.filter((todo, index) => index !== todoId);
    editTodoId = -1;

    renderTodo();
    localStorage.setItem('todolist', JSON.stringify(todos))
}
// to display error message
function displayErrorMessage(msg) {
    errorMessage.innerText = msg;

    setTimeout(() => {
        errorMessage.innerText = ""
    }, 2000)
}