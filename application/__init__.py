from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from sys import platform


# Configrations
app = Flask(__name__)
localhost = '127.0.0.1' if platform == 'win32' else '172.25.160.1'
app.config['SQLALCHEMY_DATABASE_URI'] = f'postgres://root:toor@{localhost}:5432/tododb'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
migrate = Migrate(app, db)

from application import routes