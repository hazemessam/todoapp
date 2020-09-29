// Global Variables
const createForm = document.querySelector('.create-form');
const todosList = document.querySelector('.todos');


// Event Handlers
const createTodoHandler = (e) => {
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
    return fetch('http://127.0.0.1:5000/todos/create', options)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            const todoLi = document.createElement('li') ;
            todoLi.className = 'todo';
            todoLi.id = data.id;
            todoLi.innerHTML = `
                <i class="checkbox icon-check-1"></i>
                <span class="description">${data.description}</span>
            `
            todosList.appendChild(todoLi);
            createForm.querySelector('input[name="description"]').value = '';
        })
        .catch(err => console.log(err));
}

const updateTodoStatusHandler = (e) => {
    const todo = e.target.parentElement;
    const options = {method: 'POST'};
    return fetch(`http://127.0.0.1:5000/todos/${todo.id}/update/status`, options)
            .then(res => res.json())
            .then(data => {
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
                } else {
                    console.log(`todo wasn't updated!`)
                }
            })
            .catch(err => console.log(err));
}

const updateTodoHandler = (e) => {
    if (e.target.classList.contains('checkbox'))
        updateTodoStatusHandler(e);
}


// Event Listeners
createForm.addEventListener('submit', createTodoHandler);
todosList.addEventListener('click', updateTodoHandler);