import numpy as np
from mongoengine import connect

db = connect('test','mongodb+srv://dbuser:Password@cluster0-zehp8.mongodb.net/test?retryWrites=true&w=majority')

matData = db.