#BackEnd/PlayMasterService/playmaster.py flask app
from flask import Flask,render_template,request
from flask_socketio import SocketIO,emit,disconnect
import sys
import logging
import json
import pymongo
import requests
from kazoo.client import KazooClient
logging.basicConfig(level=logging.DEBUG)

myclient=pymongo.MongoClient("mongodb://root:password@172.16.1.9:27017/")
mydb=myclient["playmasterdb"]
mycol=mydb["games"]

app=Flask(__name__)
zk=KazooClient(hosts='172.16.1.11:2181')
zk.start() 

# Ensure a path, create if necessary
zk.ensure_path("/boardgames")

# Create a node with data
zk.create("/boardgames/playmaster", b"Something2")

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

def SendResultRemoveCouple(case,clientid1,clientid2):#clientid1 is the one who wins #result is refered to him
    winner=FindUsernameByClientId(clientid1)
    looser=FindUsernameByClientId(clientid2)
    if(case=="tie"):
        result="tie"
    else:
        result="win"
    
    gametype=FindGametypeByClientId(clientid1)
    gameinfo=mycol.find_one({"$and":[{"$or":[{"Client1":clientid1},{"Client2":clientid1}]},{"playid":{"$exists":True}}]})
    numofres=mycol.find({"$and":[{"$or":[{"Client1":clientid1},{"Client2":clientid1}]},{"playid":{"$exists":True}}]}).count()
    #For the practise match the result is refered to the username who joined the game first
    #For the tournament match the result is refered to the username who Gamemaster has inserted as home player
    if(numofres>0):#Send win for tournament match
        url='http://172.16.1.6:5000/endtournmatch'
        if(gameinfo["home"]==winner and case!="tie"):
            result="win"
        elif(gameinfo["home"]==looser and case !="tie"):
            result="loss"
        payload={'player1':gameinfo["home"],'player2':gameinfo["away"],'result':result,'playID':gameinfo["playid"],"tournamentID":gameinfo["tournid"],"round":gameinfo["round"]}
        pdq=json.dumps(payload)#converts payload to double quotes
        print(pdq,file=sys.stderr)
        #convert string to json with json.loads
        req=requests.post(url,json=json.loads(pdq))
        print(req.text,file=sys.stderr)
        resp=json.loads(req.text)
        if(result!="tie" and resp["response"]!="No_available_players_yet" and resp["response"]!="champion"):#Send request to match the winner to the next 
            url='http://172.16.1.6:5000/matchplayers'
            #Send the winner with the playID of the next match and the away/home place which was sent after the end of match request
            payload={'player':winner,'playID':resp["response"],"tournamentID":gameinfo["tournid"],"place":resp["response2"]}
            pdq=json.dumps(payload)#converts payload to double quotes
            print(pdq,file=sys.stderr)
            #convert string to json with json.loads
            req=requests.post(url,json=json.loads(pdq))
            print(req.text,file=sys.stderr)
    else:#For Practice match
        url='http://172.16.1.6:5000/endpracticematch'
        payload={'player1':winner,'player2':looser,'result':result,'gameType':gametype}
        pdq=json.dumps(payload)#converts payload to double quotes
        print(pdq,file=sys.stderr)
        #convert string to json with json.loads
        req=requests.post(url,json=json.loads(pdq))
        print(req.text,file=sys.stderr)
        resp=json.loads(req.text)
        if(resp["response"]=="OK"):
            #delete the match from mongo
            myquery={"$or":[{"Client1":clientid1},{"Client2":clientid1}]}#just use a clientid to delete the match it participated
            mycol.delete_one(myquery)

def FindUsernameByClientId(clientid):
    myquery={"$or":[{"Client1":clientid},{"Client2":clientid}]}
    result=mycol.find_one(myquery)
    if(result["Client1"]==clientid):
        return result["Player1"]
    elif (result["Client2"]==clientid):
        return result["Player2"]

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
    if "playid" in data:#We have a tournament game
        searchforopponent=mycol.find({"$and":[{"Player2":{"$exists": False}},{"gametype":data["gametype"]},{"playid":data["playid"]}]}).count()
        if(searchforopponent>0):
            myquery={"playid":data["playid"]}
            newvalues={"$set": {"Player2":data["username"],"Client2":data["clientid"]}}
            mycol.update_one(myquery,newvalues)
            result=mycol.find_one({"Player2":data["username"]})
            emit('gamestart',result["Player2"],room=result["Client1"])#with gamestart event send also the opponent's username
            emit('gamestart',result["Player1"],room=result["Client2"])
            emit('makemove',room=result["Client1"])
        else:
            mydict={"Player1":data["username"],"Client1":data["clientid"],"gametype":data["gametype"],"playid":data["playid"],"tournid":data["tournid"],"round":data["round"],"home":data["home"],"away":data["away"]}
            mycol.insert_one(mydict)
    else: #if json doesnt contain a play id we have a practise game ..just match the user with another user of the same gametype connection
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
    #emit('ConnectionClose','Connection closed')#Send message for connection closing
    #disconnect(request.sid)
    try:#When a client is disconnected after a match has started
        emit('EndOfGame',"Opponent left the game!Nobody won!",room=switchClient(request.sid))
        #SendResultRemoveCouple("win",switchClient(request.sid),request.sid)#We give a win to the other 
        #print("Client with id:"+request.sid+" disconected!",file=sys.stderr)
    except:#in case a player is disconnected before a client join the game
        pass
    myquery={"$or":[{"Client1":request.sid},{"Client2":request.sid}]}
    mycol.delete_one(myquery)

if __name__=='__main__':
    socketio.run(app,host='0.0.0.0',port=5000)