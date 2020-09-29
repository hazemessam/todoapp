// Global Variables ---------------------------------------------------------//
const createForm = document.querySelector('.create-form');
const todosList = document.querySelector('.todos');


// Functions ----------------------------------------------------------------//
// Make completed todos at the end of the todos list
const orderTodos = () => {
    const todos = document.querySelectorAll('.todo');
    for (let todo of todos) {
        if (todo.classList.contains('completed')) {
            todo.remove();
            todosList.appendChild(todo);
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
            description: createForm.querySelector('input[name="description"]').value
        })
    }
    try {
        const res = await fetch('http://127.0.0.1:5000/todos/create', options);
        const data = await res.json();
        console.log(data);
        const todoLi = document.createElement('li');
        todoLi.className = 'todo';
        todoLi.id = data.id;
        todoLi.innerHTML = `
                <i class="checkbox icon-check-1"></i>
                <span class="description">${data.description}</span>
            `;
        todosList.appendChild(todoLi);
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
        const res = await fetch(`http://127.0.0.1:5000/todos/${todo.id}/update/status`, options);
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

const updateTodoHandler = (e) => {
    if (e.target.classList.contains('checkbox'))
        updateTodoStatusHandler(e);
}


// Event Listeners ----------------------------------------------------------//
createForm.addEventListener('submit', createTodoHandler);
todosList.addEventListener('click', updateTodoHandler);


// Main ---------------------------------------------------------------------//
orderTodos();