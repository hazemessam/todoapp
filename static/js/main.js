// Global Variables
const createForm = document.querySelector('.create-form');
const todosList = document.querySelector('.todos');
const todoChecks = document.querySelectorAll('.todo .check');


// Event Handlers
const createTodoHandler = (e) => {
    e.preventDefault();
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            description: document.querySelector('input[name="description"]').value
        })
    }
    return fetch('http://127.0.0.1:5000/todos/create', options)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            const todoLi = document.createElement('li') ;
            todoLi.className = 'todo';
            todoLi.id = data.id;
            todoLi.innerHTML = `
                <i class="check icon-check-1"></i>
                <span class="description">${data.description}</span>
            `
            document.querySelector('.todos').appendChild(todoLi);
            document.querySelector('input[name="description"]').value = '';
        })
        .catch(err => console.log(err));
}

const updateTodoStatusHandler = (e) => {
    const todo = e.target.parentElement;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: todo.id, 
        })
    }
    return fetch('http://127.0.0.1:5000/todos/update/status', options)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.updated) {
                    todo.classList.toggle('completed');
                    const checkElm = todo.querySelector('.check');
                    if (checkElm.classList.contains('icon-check-1')) {
                        checkElm.classList.remove('icon-check-1');
                        checkElm.classList.add('icon-check-2');
                    } else {
                        checkElm.classList.remove('icon-check-2');
                        checkElm.classList.add('icon-check-1');
                    }
                } else {
                    console.log(`todo wasn't updated!`)
                }
            })
            .catch(err => console.log(err));
}

const updateTodoHandler = (e) => {
    if (e.target.classList.contains('check'))
        updateTodoStatusHandler(e);
}


// Event Listeners
createForm.addEventListener('submit', createTodoHandler);
todosList.addEventListener('click', updateTodoHandler);