#BackEnd/PlayMasterService/playmaster.py flask app
from flask import Flask,render_template,request
from flask_socketio import SocketIO,emit,disconnect
import sys
import logging
import json
import pymongo
import requests
logging.basicConfig(level=logging.DEBUG)

myclient=pymongo.MongoClient("mongodb://root:password@172.16.1.9:27017/")
mydb=myclient["playmasterdb"]
mycol=mydb["games"]

app=Flask(__name__)
app.config['SECRET_KEY']='secret!' #for enabling encryption
socketio=SocketIO(app,cors_allowed_origins='*')


def switchClient(previous):
    result=mycol.find_one({"$or":[{"Client1":previous},{"Client2":previous}]})
    if(result["Client1"]==previous):
        return result["Client2"]
    else:
        return result["Client1"]

def UserAlreadyHasJoined(username):
    myquery={"$or":[{"Player1":username},{"Player2":username}]}
    result=mycol.find(myquery).count()
    if(result>0):
        return True #This username already has joined playmaster 
    else:
        return False

def SendResultRemoveCouple(case,clientid1,clientid2):#clientid1 is the one who wins #result is refered to the home player
    player1=FindUsernameByClientId(clientid1).split(",")
    player2=FindUsernameByClientId(clientid2).split(",")
    #Find the home and away player(Home is the one who joined first the game),the result is refered to home player
    if(player1[1]=="home"):
        home=player1[0]
        away=player2[0]
        result="win"
    elif(player2[1]=="home"):
        home=player2[0]
        away=player1[0]
        result="loss"
    else:#The client ids didnt match in the db
        print("Didn't find two clients to send result",file=sys.stderr)
        return
    
    if(case=="tie"):
        result="tie"
    
    gametype=FindGametypeByClientId(clientid1)
    url='http://172.16.1.6:5000/endpracticematch'
    payload={'player1':home,'player2':away,'result':result,'gameType':gametype}
    pdq=json.dumps(payload)#converts payload to double quotes
    #print(pdq,file=sys.stderr)
    #convert string to json with json.loads
    req=requests.post(url,json=json.loads(pdq))
    print(req.text,file=sys.stderr)
    resp=json.loads(req.text)
    if(resp["response"]=="OK"):
        print("Delete chess game",file=sys.stderr)
        #delete the match from mongo
        myquery={"$or":[{"Client1":clientid1},{"Client2":clientid1}]}#just use a clientid to delete the match it participated
        mycol.delete_one(myquery)

def FindUsernameByClientId(clientid):
    myquery={"$or":[{"Client1":clientid},{"Client2":clientid}]}
    result=mycol.find_one(myquery)
    if(result["Client1"]==clientid):
        return result["Player1"]+",home"
    elif (result["Client2"]==clientid):
        return result["Player2"]+",away"

def FindGametypeByClientId(clientid):
    myquery={"$or":[{"Client1":clientid},{"Client2":clientid}]}
    result=mycol.find_one(myquery)
    return result["gametype"]


@socketio.on('connectionack') #Check a client connection trying
def handle_my_custom_event(jsondata):
    data=json.loads(jsondata)
    if(UserAlreadyHasJoined(data["username"])):#Check if user already exists
        emit('ConnectionReject','Connection rejected')
        print("A user tried to rejoin but already exists",file=sys.stderr)
        return
    emit('connectionresponse','Client was connected!',room=data["clientid"]) #send connection acceptance message
    #check if a player already is waiting for a game of this type
    numofwaitingusers=mycol.find({"$and":[{"Player2":{"$exists": False}},{"gametype":data["gametype"]}]}).count()
    print ("numofwaitingusers:"+str(numofwaitingusers),file=sys.stderr)
    if(numofwaitingusers>0):
        myquery={"$and":[{"Player2":{"$exists": False}},{"gametype":data["gametype"]}]}
        newvalues={"$set": {"Player2":data["username"],"Client2":data["clientid"]}}
        mycol.update_one(myquery,newvalues)
        result=mycol.find_one({"Player2":data["username"]})
        emit('gamestart',result["Player2"],room=result["Client1"])#with gamestart event send also the opponent's username
        emit('gamestart',result["Player1"],room=result["Client2"])
        emit('makemove',room=result["Client1"])
    else:#The player should wait and a new insertion must be done
        mydict={"Player1":data["username"],"Client1":data["clientid"],"gametype":data["gametype"]}
        mycol.insert_one(mydict)


@socketio.on('receivemove')
def handle_my_custom_event(jsondata):
    data=json.loads(jsondata)
    nextclient=switchClient(request.sid)
    emit('opponentsmovesent',data["data"],room=nextclient)
    emit('makemove',room=nextclient)

@socketio.on('receivemovechess')
def handle_my_custom_event(table):
    nextclient=switchClient(request.sid)
    emit('opponentsmovesent',table,room=nextclient)
    emit('makemove',room=nextclient)

@socketio.on('WinCase')
def SendResult():
    emit('EndOfGame',"You won!",room=request.sid)
    emit('EndOfGame',"You lost!",room=switchClient(request.sid))
    SendResultRemoveCouple("win",request.sid,switchClient(request.sid))
    

@socketio.on('WinCaseChess')
def SendResultChess():
    emit('EndOfGame',"You lost!",room=request.sid)
    emit('EndOfGame',"You won!",room=switchClient(request.sid))
    SendResultRemoveCouple("win",switchClient(request.sid),request.sid)

@socketio.on('DrawCase')
def SendResult():
    emit('EndOfGame',"Draw!Nobody wins!",room=request.sid)
    emit('EndOfGame',"Draw!Nobody wins!",room=switchClient(request.sid))
    SendResultRemoveCouple("tie",request.sid,switchClient(request.sid))
    #emit('EndOfGame',"Draw!Nobody wins!",broadcast=True)
    
@socketio.on('disconnect')#When client is disconnected
def handle_connectionClosing():
    print("Client with id:"+request.sid+" disconected!",file=sys.stderr)
    #emit('ConnectionClose','Connection closed')#Send message for connection closing
    #disconnect(request.sid)

if __name__=='__main__':
    socketio.run(app,host='0.0.0.0',port=5000)