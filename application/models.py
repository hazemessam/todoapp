from application import db

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
