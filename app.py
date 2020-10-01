from flask import Flask, render_template, request, redirect, abort, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import json
from sys import platform


# Configrations
app = Flask(__name__)
localhost = '127.0.0.1' if platform == 'win32' else '172.25.160.1'
app.config['SQLALCHEMY_DATABASE_URI'] = f'postgres://root:toor@{localhost}:5432/tododb'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Models
class Todo(db.Model):
    __tablename__ = 'todos'
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String, nullable=False)
    completed = db.Column(db.Boolean, nullable=False, default=False)

    def __repr__(self):
        return f'<Todo {self.id} {self.description}>'

lists = [
    {'name': 'list 1', 'selected': True},
    {'name': 'list 2', 'selected': False},
    {'name': 'list 3', 'selected': False}
]

# Routes
@app.route('/')
def index():
    return redirect('/todos')

# Read all todos
@app.route('/todos')
def get_todos():
    todos = Todo.query.order_by(Todo.id).all()
    return render_template('todos.html', data={'todos': todos, 'lists': lists})

# Create todo
@app.route('/todos/create', methods=['POST'])
def create_todo():
    body, err = None, None
    try:
        description = json.loads(request.data).get('description')
        if len(description) == 0: description = 'Empty Task'
        todo = Todo(description=description)
        db.session.add(todo)
        db.session.commit()
        body = {
            'id': todo.id,
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


if __name__ == '__main__':
    app.run(port=5000, debug=True)
