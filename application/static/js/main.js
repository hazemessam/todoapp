// Global Variables ---------------------------------------------------------//
const createForm = document.querySelector('.create-form');
const todosUl = document.querySelector('.todos');
const todoListsUl = document.querySelector('.lists');


// Functions ----------------------------------------------------------------//
// Make completed todos at the end of the todos list
const orderTodos = () => {
    const todos = document.querySelectorAll('.todo');
    for (let todo of todos) {
        if (todo.classList.contains('completed')) {
            todo.remove();
            todosUl.appendChild(todo);
        }
    }
}


// Event Handlers -----------------------------------------------------------//
const createTodoHandler = async (e) => {
    e.preventDefault();
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            todolist_id: todosUl.id,
            description: createForm.querySelector('input[name="description"]').value
        })
    }
    try {
        const res = await fetch(`/todos/create`, options);
        const data = await res.json();
        console.log(data);
        const todoLi = document.createElement('li');
        todoLi.className = 'todo';
        todoLi.id = data.todo_id;
        todoLi.innerHTML = `
                <i class="checkbox icon-check-1"></i>
                <span class="description">${data.description}</span>
                <span class="todo-control">
                    <i class="edit icon-edit"></i>
                    <i class="delete icon-cancel-outline"></i>
                </span>
            `;
        todosUl.appendChild(todoLi);
        createForm.querySelector('input[name="description"]').value = '';
        orderTodos();
    } catch (err) {
        return console.log(err);
    }
}

const updateTodoStatusHandler = async (e) => {
    const todo = e.target.parentElement;
    const options = {method: 'POST'};
    try {
        const res = await fetch(`/todos/${todo.id}/update/status`, options);
        const data = await res.json();
        console.log(data);
        if (data.updated) {
            todo.classList.toggle('completed');
            const checkboxElm = todo.querySelector('.checkbox');
            if (checkboxElm.classList.contains('icon-check-1')) {
                checkboxElm.classList.remove('icon-check-1');
                checkboxElm.classList.add('icon-check-2');
            } else {
                checkboxElm.classList.remove('icon-check-2');
                checkboxElm.classList.add('icon-check-1');
            }
            orderTodos();
        } else {
            console.log(`todo wasn't updated!`);
        }
    } catch (err) {
        return console.log(err);
    }
}

const deleteTodoHandler = async (e) => {
    const todo = e.target.parentElement.parentElement;
    const options = {method: 'POST'};
    try {
        const res = await fetch(`/todos/${todo.id}/delete`, options);
        const data = await res.json();
        if (data.deleted) {
            todo.remove();
            console.log(`${data.id} was deleted!`);
        } else {
            console.log(`todo wasn't deleted`);
        }
    }
    catch (err) {
        return console.log(err);
    }

}

const updateTodoHandler = (e) => {
    if (e.target.classList.contains('checkbox'))
        updateTodoStatusHandler(e);
    else if (e.target.classList.contains('delete'))
        deleteTodoHandler(e);
}

const selectTodoListHandler = (e) => {
    location.replace(`/todolists/${e.target.id}`);
}

const todolistsHandler = (e) => {
    if (e.target.classList.contains('list'))
        selectTodoListHandler(e);
}


// Event Listeners ----------------------------------------------------------//
createForm.addEventListener('submit', createTodoHandler);
todosUl.addEventListener('click', updateTodoHandler);
todoListsUl.addEventListener('click', todolistsHandler);

// Main ---------------------------------------------------------------------//
orderTodos();