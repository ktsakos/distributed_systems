#BackEnd/PlayMasterService/playmaster.py flask app
from flask import Flask,render_template
from flask_socketio import SocketIO,emit
import sys
import logging
import json
logging.basicConfig(level=logging.DEBUG)

app=Flask(__name__)
app.config['SECRET_KEY']='secret!' #for enabling encryption
socketio=SocketIO(app,cors_allowed_origins='*')

@socketio.on('message')
def handle_my_custom_event(json):
    emit('my response','I received: '+str(json))

@socketio.on('receivemove')
def handle_my_custom_event(jsondata):
    data=json.loads(jsondata)
    emit('my response',"Player made the move in: "+data["data"])

if __name__=='__main__':
    socketio.run(app)