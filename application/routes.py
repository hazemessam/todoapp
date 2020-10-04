from application import app, db
from application.models import Todo, TodoList, lists
from flask import render_template, request, redirect, abort, jsonify
import json



@app.route('/')
def index():
    todolist = TodoList.query.order_by(TodoList.id).first()
    return redirect(f'/todolists/{todolist.id}')


# Read all todos
@app.route('/todolists/<id>')
def get_todos(id):
    todolists = TodoList.query.order_by(TodoList.id).all()
    todos = Todo.query.filter(Todo.todolist_id == id).order_by(Todo.id).all()
    return render_template('todos.html', data={
        'todos': todos, 
        'todolists': todolists,
        'selected_id': int(id)
    })


# Create todo
@app.route('/todos/create', methods=['POST'])
def create_todo():
    body, err = None, None
    try:
        data = json.loads(request.data)
        description = data.get('description')
        todolist_id = data.get('todolist_id')
        if len(description) == 0: description = 'Empty Task'
        todo = Todo(description=description, todolist_id=todolist_id)
        db.session.add(todo)
        db.session.commit()
        body = {
            'todolist_id': todo.todolist_id,
            'todo_id': todo.id,
            'description': todo.description
        }
    except Exception as e:
        print(e)
        err = True
        db.session.rollback()
    finally:
        db.session.close()

    if err:
        return abort(500)
    else:
        return jsonify(body)


# Update todo status
@app.route('/todos/<id>/update/status', methods=['POST'])
def update_todo_status(id):
    err, body = None, None
    try:
        todo = Todo.query.get(id)
        todo.completed = not todo.completed
        db.session.commit()
        body = {
            'id': todo.id,
            'updated': True
        }
    except Exception as e:
        print(e)
        err = True
        db.session.rollback()
    finally:
        db.session.close()

    if err:
        return abort(500)
    else:
        return jsonify(body)


# Delete todo
@app.route('/todos/<id>/delete', methods=['POST'])
def delete_todo(id):
    err, body = None, None
    try:
        todo = Todo.query.get(id)
        db.session.delete(todo)
        db.session.commit()
        body = {
            'id': todo.id,
            'deleted': True
        }
    except Exception as e:
        print(e)
        err = True
        db.session.rollback()
    finally:
        db.session.close()

    if err:
        abort(500)
    else:
        return jsonify(body)
