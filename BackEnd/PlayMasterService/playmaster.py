#BackEnd/PlayMasterService/playmaster.py flask app
from flask import Flask,render_template,request
from flask_socketio import SocketIO,emit,disconnect
import sys
import logging
import json
import pymongo
logging.basicConfig(level=logging.DEBUG)

myclient=pymongo.MongoClient("mongodb://root:password@172.16.1.9:27017/")
mydb=myclient["playmasterdb"]
mycol=mydb["games"]
mydict={"game":"1","Board":""}
mycol.insert_one(mydict)
#print (myclient.list_database_names(),file=sys.stderr)

app=Flask(__name__)
app.config['SECRET_KEY']='secret!' #for enabling encryption
socketio=SocketIO(app,cors_allowed_origins='*')

clients=[]#A playmaster can support only 2 players

def switchClient(previous):
    for i in range(len(clients)):
        if (clients[i]!=previous):
            return clients[i]

def showconnectedclients():
    print ("Connected clients:",file=sys.stderr)
    for i in range(len(clients)):
        print (clients[i] +" ",file=sys.stderr)

@socketio.on('connectionack') #Check a client connection trying
def handle_my_custom_event(jsondata):
    data=json.loads(jsondata)
    if(len(clients)<2): #If there are 1 or 0 clients
        emit('connectionresponse','Client was connected!',room=data["clientid"]) #send connection acceptance message
        clients.append(request.sid) #store clientid and accept connection in case server has only 0 or 1 client connected
        ########WHEN A SECOND PLAYER IS CONNECTED WE CAN BEGIN THE GAME#######
        if(len(clients)==2):
            emit('gamestart',broadcast=True)
            emit('makemove',room=clients[0]) #Client who connected first plays first

        showconnectedclients() #print all clients ,should print 1 or 2
    else:#if there are 2 clients
        emit('ConnectionReject','Connection rejected')#send message to close connection
        print("A third client tried to connect but already 2 exist!",file=sys.stderr)
        #disconnect(data["clientid"])
        


@socketio.on('receivemove')
def handle_my_custom_event(jsondata):
    data=json.loads(jsondata)
    nextclient=switchClient(request.sid)
    emit('opponentsmovesent',data["data"],room=nextclient)
    emit('makemove',room=nextclient)

@socketio.on('receivemovechess')
def handle_my_custom_event(table):
    nextclient=switchClient(request.sid)
    myquery={"game":"1"}
    newvalues={"$set": {"Board":table}}
    mycol.update_one(myquery,newvalues)
    emit('opponentsmovesent',table,room=nextclient)
    emit('makemove',room=nextclient)

@socketio.on('WinCase')
def SendResult():
    emit('EndOfGame',"You won!",room=request.sid)
    emit('EndOfGame',"You lost!",room=switchClient(request.sid))

@socketio.on('WinCaseChess')
def SendResultChess():
    emit('EndOfGame',"You lost!",room=request.sid)
    emit('EndOfGame',"You won!",room=switchClient(request.sid))

@socketio.on('DrawCase')
def SendResult():
    emit('EndOfGame',"Draw!Nobody wins!",room=request.sid)
    emit('EndOfGame',"Draw!Nobody wins!",room=switchClient(request.sid))
    #emit('EndOfGame',"Draw!Nobody wins!",broadcast=True)
    
@socketio.on('disconnect')#When client is disconnected
def handle_connectionClosing():
    try:
        clients.remove(request.sid)
    except:
        print("Client connection rejected or doesnt exist in the array!",file=sys.stderr)
    print("Client with id:"+request.sid+" disconected!",file=sys.stderr)
    showconnectedclients() #Should print 1 of 0 clients
    #emit('ConnectionClose','Connection closed')#Send message for connection closing
    #disconnect(request.sid)

if __name__=='__main__':
    socketio.run(app,host='0.0.0.0',port=5000)