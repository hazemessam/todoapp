from application import db


class Todo(db.Model):
    __tablename__ = 'todos'
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String, nullable=False)
    completed = db.Column(db.Boolean, nullable=False, default=False)
    todolist_id = db.Column(db.Integer, db.ForeignKey('todolists.id'), nullable=False)

    def __repr__(self):
        return f'<Todo {self.id} {self.description}>'


class TodoList(db.Model):
    __tablename__ = 'todolists'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    todos = db.relationship('Todo', backref='todolist', lazy=True)

    def __repr__(self):
        return f'<TodoList {self.id} {self.name}>'


lists = [
    {'name': 'list 1', 'selected': True},
    {'name': 'list 2', 'selected': False},
    {'name': 'list 3', 'selected': False}
]
