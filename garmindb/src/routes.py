from flask import Blueprint, render_template
from data_fetcher import fetch_and_store_activities
from models import Session, Activities

routes = Blueprint('routes', __name__)

data_fetched = False

@routes.before_request
def update_data():
    global data_fetched
    if not data_fetched:
        fetch_and_store_activities()
        data_fetched = True

@routes.route('/')
def index():
    session = Session()
    activities = session.query(Activities).all()
    session.close()
    
    return render_template('index.html', activities=activities)
