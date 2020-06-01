from flask import Flask, jsonify, request, session, render_template 
import json
import mysql.connector, random, string
import logging
import sys
import math 
from random import randrange


     
app = Flask(__name__) # create an app instance
logging.basicConfig(level=logging.DEBUG)   


 
#gamemaster db connection
mydb = mysql.connector.connect(
  host="db2", 
  port="3306",
  user="root",
  passwd="password",
  database="gamemaster_db"
)

### API routes 

# initialize score for user 
@app.route('/initial_score', methods=['POST', 'GET'])
def register():
  
  # get JSON request with username 
  content = request.get_json()
  value = content["username"] 
  
  # insert score = 0 for this user in the Scores table  
  mycursor = mydb.cursor(buffered=True)
  sql = "INSERT INTO practice_scores (username, wins, ties, losses, plays, total_score, available) VALUES (%s, %s, %s, %s, %s, %s, %s)"
  val = (value, 0, 0, 0, 0, 0, 0)
  try: 
    mycursor.execute(sql, val)
    mydb.commit()
    return jsonify( {"response": "OK"} ) 

  except: 
    return jsonify( {"response": "error"} ) 

        

# get user's total score (so far) from Scores table 
@app.route('/getscore', methods=['GET'])
def getscore():
  
  if request.method == 'GET':

    # get JSON request with username 
    content = request.get_json()
    username = content["username"] 

    # get score from DB
    mycursor = mydb.cursor(buffered=True)
    sql = "SELECT SUM(s.total_score) AS totalscore FROM (SELECT total_score FROM practice_scores WHERE username = %s UNION ALL SELECT SUM(total_score) FROM tournament_players WHERE player = %s) s"
    val = (username, username)
    mycursor.execute(sql, val)

    # fetch one record, return result
    user_score = mycursor.fetchone()
    
    if user_score:
      score = user_score[0]
      score = int(score) 
      total_score = str(score)

      #return 
      return jsonify({"score": total_score}), 200 

    else: 

      return jsonify({"Message": "nouserfound"}) 




# just for testing 
@app.route('/', methods=['GET'])
def index():

  return "OK"
  #print('ok',file=sys.stdrr)



# create a tournament (official/admin)
@app.route('/createtournament', methods=['POST'])
def createtournament():
  
  # get JSON request with tournament's data  
  content = request.get_json()
  maxNumOfUsers = content["maxNumOfUsers"] 
  gameType = content["gameType"]
  password = content["password"]   
  creator = content["creator"] 
  tournamName = content["tournamName"] 
  
  # insert this tournament in the tournaments table  
  mycursor = mydb.cursor(buffered=True)
  sql = "INSERT INTO tournaments (gametype, maxnumofusers, joinedusers, password, creator, name, started) VALUES (%s, %s, %s, %s, %s, %s, %s)"
  val = (gameType, maxNumOfUsers, 0, password, creator, tournamName, 0) 
  try: 
    mycursor.execute(sql, val)
    mydb.commit()
    return jsonify( {"response": "OK"} ) 

  except: 
    return jsonify( {"response": "error"} ) 

 



# view all tournaments (admin)
@app.route('/viewtournaments', methods=['GET'])
def viewtournaments():

  if request.method == 'GET':

    # retrieve all tournaments  
    mycursor = mydb.cursor(buffered=True)
    sql = "SELECT * FROM tournaments"  
    mycursor.execute(sql)

    # fetch all records, return results
    tournaments = mycursor.fetchall()

    if tournaments:
      return jsonify(tournaments)
      #return render_template('all_tournaments.html', tournaments = tournaments)

    else: 
      return jsonify({"Message": "no_tournaments_found"}) 






# view all available (to join) tournaments 
@app.route('/get_available_tournaments', methods=['GET'])
def get_available_tournaments():

  if request.method == 'GET':

    # retrieve all tournaments  
    mycursor = mydb.cursor(buffered=True)
    sql = "SELECT * FROM `tournaments` WHERE joinedusers < maxnumofusers and started = 0"  
    mycursor.execute(sql)

    # fetch all records, return results
    tournaments = mycursor.fetchall()

    if tournaments:
      return jsonify(tournaments)
      #return render_template('all_tournaments.html', tournaments = tournaments)

    else: 
      return jsonify({"Message": "no_tournaments_found"}) 







# enter a tournament (for a user)
@app.route('/entertournament', methods=['POST'])
def entertournament():
  
  # get JSON request with tournament's data  
  content = request.get_json()
  username = content["username"] 
  tournamentID = content["tournamentID"] 

  mycursor = mydb.cursor(buffered=True)

  # get playID from table
  sql = "SELECT * FROM tournaments WHERE tournamentID=%s"
  val = (tournamentID,)
  mycursor.execute(sql, val) 

  # fetch one record, return result
  result = mycursor.fetchone()

  if result:

    maxUsers = result[1] 
    joinedUsers = result[2]
    safekey = result[3]

    if (joinedUsers < maxUsers):

      # insert user in the tournaments_player table  
      sql = "INSERT INTO tournament_players (player, active, tournamentID, total_score) VALUES (%s, %s, %s, %s)"
      val = (username, 1, tournamentID, 0) 
      try:   
        mycursor.execute(sql, val)
        mydb.commit()

        # increment number of joinedUsers in this tournament
        sql1 = "UPDATE tournaments SET joinedusers = joinedusers + 1 WHERE tournamentID = %s" 
        val1 = (tournamentID,)
        mycursor.execute(sql1, val1)
        mydb.commit()
        return jsonify( {"response": "OK", "safekey": safekey} ) 

      except: 
        return jsonify( {"response": "error"} ) 

    else:
      return jsonify( {"response": "The tournament is full!"} ) 

  else: 
      return jsonify( {"response": "No_such_tournament"} ) 




# update DB data when a tournament match is complete (win/lose or tie)
@app.route('/endtournmatch', methods=['POST'])
def endtournmatch():
  
  # get JSON request with tournament's data  
  content = request.get_json()
  player1 = content["player1"] # home 
  player2 = content["player2"] # away 
  result = content["result"] # if result is win, home player wins. if it is loss, away player wins. else we have a tie.
  playID = content["playID"] # ID of the specific play between the two players 
  tournamentID = content["tournamentID"] # ID of the specific tournament between the two players 
  tourn_round = content["round"] # tournament round (e.g. round of 16 active players is called "round 16")
  tourn_round = int(tourn_round)
  if player1 and player2 and result:

    if result == "win": # player2 lost

      #set his active flag to 0 (excluded from the tournament)
      mycursor = mydb.cursor(buffered=True)
      sql = "UPDATE tournament_players SET active = %s WHERE player = %s and tournamentID = %s" 
      val = (0, player2, tournamentID)

      try: 
        mycursor.execute(sql, val)
        mydb.commit()
      except: 
        return jsonify( {"response": "error1"} ) 

      # update the row in tournaments_plays table (home player win)      
      mycursor = mydb.cursor(buffered=True)
      sql1 = "UPDATE tournament_plays SET result = %s WHERE playID = %s"
      val1 = ('home', playID)

      try: 
        mycursor.execute(sql1, val1)
        mydb.commit()
      except: 
        return jsonify( {"response": "error2"} ) 

      if(tourn_round == 8): # so next is the round of 4 (semifinals)
        # update tournament score (we do that only when player makes it to the round of 4) 
        mycursor = mydb.cursor(buffered=True)
        sql = "UPDATE tournament_players SET total_score = 2 WHERE player = %s and tournamentID = %s" 
        val = (player1, tournamentID)  
        mycursor.execute(sql, val)
        mydb.commit()

      if(tourn_round == 4): # semifinal, so next is the round of 2 (final) 
        # update tournament score (the player will get 3 points for winning the play)
        mycursor = mydb.cursor(buffered=True)
        sql = "UPDATE tournament_players SET total_score = total_score + 3 WHERE player = %s and tournamentID = %s" 
        val = (player1, tournamentID)  
        mycursor.execute(sql, val)
        mydb.commit()

      if(tourn_round == 2): # final
        # update tourn. score (the player will get 3 points for winning the match and 20 points for winning the tournament, so 23 in total)
        mycursor = mydb.cursor(buffered=True)
        sql = "UPDATE tournament_players SET total_score = total_score + 23 WHERE player = %s and tournamentID = %s" 
        val = (player1, tournamentID) 
        mycursor.execute(sql, val)
        mydb.commit() 
        return jsonify( {"response": "champion", "response2": "nothing"} ) 

      # look for an opponent who already is in the next round
      
      next_round = int(tourn_round/2)  
      sql2 = "SELECT * FROM tournament_plays WHERE (tournamentID=%s AND round=%s AND home='' AND result='') OR (tournamentID=%s AND round=%s AND away='' AND result='')"
      val2 = (tournamentID, next_round, tournamentID, next_round)
      mycursor.execute(sql2, val2) 

      next_opponent = mycursor.fetchone()
      
      if next_opponent: 

        next_opponent_home = next_opponent[1]
        next_opponent_away = next_opponent[2]
        next_playID = next_opponent[5]  

        if next_opponent_home: 

          return jsonify( {"response": next_playID, "response2": "away"} ) 

        if next_opponent_away: 

          return jsonify( {"response": next_playID, "response2": "home"} ) 

      else: 

        # insert next match in tournaments_plays table   
        sql2 = "INSERT INTO tournament_plays (tournamentID, result, home, away, round) VALUES (%s, %s, %s, %s, %s)"
        val2 = (tournamentID, '', player1, '', next_round)
        mycursor.execute(sql2, val2)
        mydb.commit()

        return jsonify( {"response": "No_available_players_yet"} ) 


    elif result == "loss": # player1 lost

      # set his active flag to 0 (excluded from the tournament) 
      mycursor = mydb.cursor(buffered=True) 
      sql = "UPDATE tournament_players SET active = %s WHERE player = %s and tournamentID = %s"
      val = (0, player1, tournamentID)

      try: 
        mycursor.execute(sql, val)
        mydb.commit()
      except: 
        return jsonify( {"response": "error3"} ) 

      # update result column in tournaments_plays table, away player wins    
      mycursor = mydb.cursor(buffered=True)
      sql1 = "UPDATE tournament_plays SET result = %s WHERE playID = %s"
      val1 = ('away', playID)

      try: 
        mycursor.execute(sql1, val1)
        mydb.commit()
      except: 
        return jsonify( {"response": "error4"} ) 

      if(tourn_round == 8): # so next is the round of 4 (semifinals)
        # update tournament score (we do that only when player makes it to the round of 4) 
        mycursor = mydb.cursor(buffered=True)
        sql = "UPDATE tournament_players SET total_score = 2 WHERE player = %s and tournamentID = %s" 
        val = (player2, tournamentID)  
        mycursor.execute(sql, val)
        mydb.commit()

      if(tourn_round == 4): # so next is the round of 2 (final) 
        # update tournament score (the player will get 3 points for winning the play)
        mycursor = mydb.cursor(buffered=True)
        sql = "UPDATE tournament_players SET total_score = total_score + 3 WHERE player = %s and tournamentID = %s" 
        val = (player2, tournamentID)  
        mycursor.execute(sql, val)
        mydb.commit()

      if(tourn_round == 2):
        # update tourn. score (the player will get 3 points for winning the match and 20 points for winning the tournament, so 23 in total)
        mycursor = mydb.cursor(buffered=True)
        sql = "UPDATE tournament_players SET total_score = total_score + 23 WHERE player = %s and tournamentID = %s" 
        val = (player2, tournamentID) 
        mycursor.execute(sql, val)
        mydb.commit() 
        return jsonify( {"response": "champion", "response2": "nothing"} ) 

      # look for an opponent who already is in the next round
      tourn_round = int(tourn_round)
      next_round = int(tourn_round/2)  
      sql2 = "SELECT * FROM tournament_plays WHERE (tournamentID=%s AND round=%s AND home='' AND result='') OR (tournamentID=%s AND round=%s AND away='' AND result='')"
      val2 = (tournamentID, next_round, tournamentID, next_round)
      mycursor.execute(sql2, val2) 

      next_opponent = mycursor.fetchone()
      
      if next_opponent: 

        next_opponent_home = next_opponent[1]
        next_opponent_away = next_opponent[2]
        next_playID = next_opponent[5]  

        if next_opponent_home: 

          return jsonify( {"response": next_playID, "response2": "away"} ) 

        if next_opponent_away: 

          return jsonify( {"response": next_playID, "response2": "home"} ) 

      else: 

        # insert next match in tournaments_plays table   
        sql2 = "INSERT INTO tournament_plays (tournamentID, result, home, away, round) VALUES (%s, %s, %s, %s, %s)"
        val2 = (tournamentID, '', player2, '', next_round)
        mycursor.execute(sql2, val2)
        mydb.commit()

        return jsonify( {"response": "No_available_players_yet", "response2": "Just_wait"} ) 



    elif result == "tie": # tie, update result column in tournaments_plays table  

      try: 
        mycursor = mydb.cursor(buffered=True)
        sql1 = "UPDATE tournament_plays SET result = %s WHERE playID = %s"
        val1 = ('tie', playID)
        mycursor.execute(sql1, val1)
        mydb.commit()

      except: 
        return jsonify( {"response": "error5"} ) 

      ## if we are in semifinals or final, update the scores of players 
      if(tourn_round == 4 or tourn_round == 2): 
        # update tournament score for player1 (we do that only when player makes it to the round of 4) 
        mycursor = mydb.cursor(buffered=True)
        sql = "UPDATE tournament_players SET total_score = total_score + 1 WHERE player = %s and tournamentID = %s" 
        val = (player1, tournamentID)  
        mycursor.execute(sql, val)
        mydb.commit()
        # update tournament score (we do that only when player makes it to the round of 4) 
        mycursor = mydb.cursor(buffered=True)
        sql1 = "UPDATE tournament_players SET total_score = total_score + 1 WHERE player = %s and tournamentID = %s" 
        val1 = (player2, tournamentID)  
        mycursor.execute(sql1, val1)
        mydb.commit()

      # insert next match in tournaments_plays table   
      sql2 = "INSERT INTO tournament_plays (tournamentID, result, home, away, round) VALUES (%s, %s, %s, %s, %s)"
      val2 = (tournamentID, '', player1, player2, tourn_round)
      mycursor.execute(sql2, val2)
      mydb.commit()

      # get the (new) generated playID (by auto-increment) of the new play from tournament_plays table
      sql3 = "SELECT playID FROM tournament_plays WHERE tournamentID=%s AND home=%s AND away=%s AND result='' AND round = %s"
      val3 = (tournamentID, player1, player2, tourn_round)
      mycursor.execute(sql3, val3) 

      # fetch one record, return result
      newPlayID = mycursor.fetchone()

      if newPlayID:

        newPlayID = str(newPlayID)
        newPlayID = newPlayID.replace("(", "")
        newPlayID = newPlayID.replace(",", "")
        newPlayID = newPlayID.replace(")", "")
        player1 = str(player1)
        player2 = str(player2)

      return jsonify( {"response": "tie", "player1": player1, "player2": player2, "round": tourn_round, "playID": newPlayID} ) 
      






# update DB, match two players in tournaments_plays table
@app.route('/matchplayers', methods=['POST'])
def matchplayers():
  
  # get JSON request with tournament's data  
  content = request.get_json()
  player = content["player"] # home 
  playID = content["playID"] # ID of the specific play (not complete yet) between the two players 
  tournamentID = content["tournamentID"] # ID of the specific tournament between the two players 
  place = content["place"] # where to place player (home/away)

  if(place == "away"):
    mycursor = mydb.cursor(buffered=True)
    sql = "UPDATE tournament_plays SET away = %s WHERE playID = %s and tournamentID = %s"
    val = (player, playID, tournamentID)
    mycursor.execute(sql, val)
    mydb.commit()
    return jsonify( {"response": "OK"} ) 

  elif(place == "home"):
    mycursor = mydb.cursor(buffered=True)
    sql = "UPDATE tournament_plays SET home = %s WHERE playID = %s and tournamentID = %s"
    val = (player, playID, tournamentID)
    mycursor.execute(sql, val)
    mydb.commit()
    return jsonify( {"response": "OK"} ) 

  else:
    return jsonify( {"response": "error"} ) 





# give the command for a tournament to begin 
@app.route('/begintournament', methods=['POST'])
def begintournament():

  # get JSON request with tournament creator's command to begin tournament
  content = request.get_json()
  command = content["command"] 
  tournamentID = content["tournamentID"] 


  if command == "begin":

    mycursor = mydb.cursor(buffered=True) 

    # get maxNumOfUsers of this tournament 
    sql = "SELECT * FROM tournaments where tournamentID = %s"
    val = (tournamentID,)
    mycursor.execute(sql, val) 

    tournData = mycursor.fetchone()  
    maxNumOfUsers = tournData[1]
    joinedUsers = tournData[2]

    # count players in the tournament 
    sql1 = "SELECT player FROM tournament_players where tournamentID = %s"
    val1 = (tournamentID,)
    mycursor.execute(sql1, val1) 

    records = mycursor.fetchall()

    # if the number of players in the tournament is correct (a power of 2, larger than 3 and less than maxNumOfUsers) 
    if (math.log(joinedUsers, 2).is_integer() and joinedUsers > 3 and joinedUsers < (maxNumOfUsers+1)): 

      #i = 0
      list = []  
      # insert players in a list
      for x in records: 
        list.append(x) 

      # number of players in the list   
      l = len(list)
      l = int(l)
      e = int(l/2-1) 

      # match players (i with i+1)  
      for i in range(0,e+1):

        i = 2*i
        # match player(i) with player(i+1) 
        L1 = list[i]
        L2 = list[i+1]
        player1 = ''.join(map(str, L1))   
        player2 = ''.join(map(str, L2))  
        player = str(player2)

        mycursor = mydb.cursor(buffered=True)

        # update result column in tournaments_plays table   
        sql = "INSERT INTO tournament_plays (tournamentID, result, home, away, round) VALUES (%s, %s, %s, %s, %s)"
        val = (tournamentID, '', player1, player2, joinedUsers)

        mycursor.execute(sql, val) 
        mydb.commit()


      # update "started" flag, declares that the tournament just has started (so it can't accept a new player) 
      sql2 = "UPDATE tournaments SET started = 1 WHERE tournamentID = %s" 
      val2 = (tournamentID,)
      mycursor.execute(sql2, val2)
      mydb.commit()
        
      return jsonify( {"response": "OK"} ), 200   

    else: 

      return "Not correct number of players!"

  else:

    return "No command to begin"




# retrieve all tournament matches that a specific player has to play in the current round in all tournaments  
@app.route('/next_tourn_matches', methods=['GET'])
def next_tourn_matches():

  if request.method == 'GET':

    # get JSON request with player's username 
    content = request.get_json()
    player = content["username"] 

    # check if player is active in these tournaments and find the matches that have no result yet, search in two tables using a JOIN query
    mycursor = mydb.cursor(buffered=True)
    sql = "SELECT DISTINCT home, away, playID FROM (SELECT DISTINCT tournamentID, player FROM `tournament_players` WHERE active = 1 and player = %s) a JOIN (SELECT DISTINCT tournamentID, home, away, playID FROM `tournament_plays` WHERE result = '') b ON a.tournamentID = b.tournamentID AND a.player = b.home OR a.player = b.away"
    val = (player,)
    mycursor.execute(sql, val) 

    # fetch all records, return results
    matches = mycursor.fetchall()

    if matches:
      return jsonify(matches), 200 

    else: 
      return jsonify({"response": "no_matches_found"}), 200







# update DB data when a practice match is complete (with a win/loss/tie)
@app.route('/endpracticematch', methods=['POST'])
def endpracticematch():
  
  # get JSON request with tournament's data  
  content = request.get_json()
  player1 = content["player1"] # home 
  player2 = content["player2"] # away 
  result = content["result"] # if result is win, home player wins. if it is loss, away player wins. else we have a tie.
  #playID = content["playID"] # ID of the specific play between the two players 
  gameType = content["gameType"] # type of game played (chess/tic-tac-toe)
 
  if player1 and player2 and result:

    if result == "win": # player1 won

      # update practice_scores table for player1  
      try: 
        mycursor = mydb.cursor(buffered=True)
        sql = "UPDATE practice_scores SET wins = wins + 1, plays = plays + 1, total_score = total_score + 3 WHERE username = %s"
        val = (player1,)  
        mycursor.execute(sql, val)
        mydb.commit()
      except: 
        return jsonify( {"response": "error1"} ) 

      # update practice_scores table for player2
      try: 
        mycursor = mydb.cursor(buffered=True)
        sql1 = "UPDATE practice_scores SET losses = losses + 1, plays = plays + 1 WHERE username = %s"
        val1 = (player2,)
        mycursor.execute(sql1, val1)
        mydb.commit()
      except: 
        return jsonify( {"response": "error2"} ) 

      # insert match in practice_plays table   
      try: 
        mycursor = mydb.cursor(buffered=True)
        sql2 = "INSERT INTO practice_plays (home, away, result, gametype) VALUES (%s, %s, %s, %s)"
        val2 = (player1, player2, 'home', gameType)
        mycursor.execute(sql2, val2)
        mydb.commit()
        return jsonify( {"response": "OK"} ) 
      except: 
        return jsonify( {"response": "error3"} ) 


    elif result == "loss": # player2 won 

      # update practice_scores table for player2
      mycursor = mydb.cursor(buffered=True)
      sql = "UPDATE practice_scores SET wins = wins + 1, plays = plays + 1, total_score = total_score + 3 WHERE username = %s"
      val = (player2,)

      try: 
        mycursor.execute(sql, val)
        mydb.commit()
      except: 
        return jsonify( {"response": "error1"} ) 

      # update practice_scores table for player1
      mycursor = mydb.cursor(buffered=True)
      sql1 = "UPDATE practice_scores SET losses = losses + 1, plays = plays + 1 WHERE username = %s"
      val1 = (player1,)

      try: 
        mycursor.execute(sql1, val1)
        mydb.commit()
      except: 
        return jsonify( {"response": "error2"} ) 

      # insert match in practice_plays table   
      try: 
        mycursor = mydb.cursor(buffered=True)
        sql2 = "INSERT INTO practice_plays (home, away, result, gametype) VALUES (%s, %s, %s, %s)"
        val2 = (player1, player2, 'away', gameType)
        mycursor.execute(sql2, val2)
        mydb.commit()
        return jsonify( {"response": "OK"} ) 
      except: 
        return jsonify( {"response": "error3"} ) 


    elif result == "tie": # we had a tie

      # update practice_scores table for player1
      mycursor = mydb.cursor(buffered=True)
      sql = "UPDATE practice_scores SET ties = ties + 1, plays = plays + 1, total_score = total_score + 1 WHERE username = %s"
      val = (player1,)

      try: 
        mycursor.execute(sql, val)
        mydb.commit()
      except: 
        return jsonify( {"response": "error3"} ) 

      # update practice_scores table for player2
      mycursor = mydb.cursor(buffered=True)
      sql1 = "UPDATE practice_scores SET ties = ties + 1, plays = plays + 1, total_score = total_score + 1 WHERE username = %s"
      val1 = (player2,)

      try: 
        mycursor.execute(sql1, val1)
        mydb.commit()
      except: 
        return jsonify( {"response": "error4"} ) 

      # insert match in practice_plays table   
      try: 
        mycursor = mydb.cursor(buffered=True)
        sql2 = "INSERT INTO practice_plays (home, away, result, gametype) VALUES (%s, %s, %s, %s)"
        val2 = (player1, player2, 'tie', gameType)
        mycursor.execute(sql2, val2)
        mydb.commit()
      except: 
        return jsonify( {"response": "error5"} ) 

      player1 = str(player1)
      player2 = str(player2)

      return jsonify( {"response": "tie", "player1": player1, "player2": player2} ) 





# retrieve all complete practice plays of a specific player 
@app.route('/getpracticeplays', methods=['GET'])
def getpracticeplays():

  # get JSON request with tournament's data  
  content = request.get_json()
  player = content["username"] 

  # retrieve all available players 
  mycursor = mydb.cursor(buffered=True)
  sql = "SELECT * FROM practice_plays  WHERE home = %s or away = %s"  
  val = (player, player)   
  mycursor.execute(sql, val)

  # fetch all records, return results
  allplays = mycursor.fetchall()

  if allplays:
      return jsonify(allplays), 200  

  else: 
    return jsonify({"response": "no_plays_found"}), 200





# retrieve all finished tournament plays (of all players)
@app.route('/get_tournament_plays', methods=['GET'])
def get_tournament_plays():

  # retrieve all finished tournament plays 
  mycursor = mydb.cursor(buffered=True)
  sql = "SELECT DISTINCT a.tournamentID, home, away, result, round, gametype, name, a.playID FROM (SELECT DISTINCT tournamentID, home, away, result, round, playID FROM `tournament_plays` WHERE result <> '') a JOIN (SELECT tournamentID, gametype, name FROM `tournaments`) b ON a.tournamentID = b.tournamentID ORDER BY a.playID"  
  mycursor.execute(sql)

  # fetch all records, return results
  allplays = mycursor.fetchall()

  if allplays:
      return jsonify(allplays), 200  

  else: 
    return jsonify({"response": "no_plays_found"}), 200




# delete a specific tournament (admin operation)
@app.route('/delete_tournament', methods=['POST'])
def delete_tournament():

  # get JSON request with tournament's ID   
  content = request.get_json()
  tournamentID = content["tournamentID"] 

  # delete tournament
  mycursor = mydb.cursor(buffered=True)
  sql = "DELETE FROM tournaments WHERE tournamentID = %s"  
  val = (tournamentID,)   
  mycursor.execute(sql, val)
  mydb.commit()

  return jsonify({"response": "OK"}), 200  



     

# get all active players in the platform 
@app.route('/get_all_players', methods=['GET'])
def get_all_players():
  
  if request.method == 'GET':

    # get all players from Gamemaster DB
    mycursor = mydb.cursor(buffered=True)
    sql = "SELECT DISTINCT player FROM tournament_players UNION SELECT DISTINCT username FROM practice_scores"
    mycursor.execute(sql)

    # fetch all records
    all_active_players = mycursor.fetchall()

    if all_active_players:
      return jsonify(all_active_players), 200 

    else: 
      return jsonify({"response": "no_active_players"}), 200  






# retrieve all important available data about a specific tournament using playID 
@app.route('/get_tourn_data', methods=['GET'])
def get_tourn_data():

  if request.method == 'GET':

    # get JSON request with player's username 
    content = request.get_json()
    playID = content["playID"] 

    # check if player is active in these tournaments and find the matches that have no result yet, search in two tables using a JOIN query
    mycursor = mydb.cursor(buffered=True)
    sql = "SELECT a.tournamentID, home, away, result, round, gametype, name FROM (SELECT DISTINCT tournamentID, home, away, result, round FROM tournament_plays WHERE playID = %s) a JOIN (SELECT tournamentID, gametype, name FROM tournaments) b ON a.tournamentID = b.tournamentID"
    val = (playID,)
    mycursor.execute(sql, val) 

    # fetch all records, return results
    matches = mycursor.fetchall()

    if matches:
      return jsonify(matches), 200 

    else: 
      return jsonify({"response": "no_matches_found"}), 200





# retrieve all players that have joined a specific tournament 
@app.route('/get_joined_players', methods=['GET'])
def get_joined_players():

  if request.method == 'GET':

    # get JSON request
    content = request.get_json()
    tournamentID = content["tournamentID"] 
    player = content["player"] 

    mycursor = mydb.cursor(buffered=True)
    sql = "SELECT * FROM `tournament_players` WHERE tournamentID = %s AND player = %s"
    val = (tournamentID,player)
    mycursor.execute(sql, val) 

    # fetch record, return results
    players = mycursor.fetchone()

    if players:
      return jsonify({"response": "yes"}), 200 

    else: 
      return jsonify({"response": "no"}), 200





# retrieve all finals 
@app.route('/get_all_finals', methods=['GET'])
def get_all_finals():

  if request.method == 'GET':

    # get JSON request with gametype
    content = request.get_json()
    gametype = content["gametype"] 

    # retrieve all tournament final plays 
    mycursor = mydb.cursor(buffered=True)
    sql = "SELECT DISTINCT b.home, b.away, a.tournamentID, a.gametype, b.round, b.result FROM (SELECT DISTINCT tournamentID, gametype FROM `tournaments` WHERE gametype = %s) a JOIN (SELECT DISTINCT tournamentID, home, away, round, playID, result FROM `tournament_plays` WHERE result <> '' AND result <> 'tie') b ON a.tournamentID = b.tournamentID AND round = 2"
    val = (gametype,)
    mycursor.execute(sql,val) 

    # fetch record, return results
    finals = mycursor.fetchall()

    if finals:
      return jsonify(finals), 200 

    else: 
      return jsonify({"response": "nofinals"}), 200




'''

# retrieve all available opponents for a specific player 
@app.route('/availableopponents', methods=['GET'])
def availableopponents():

  # get JSON request with tournament's data  
  content = request.get_json()
  player1 = content["username"] 

  # retrieve all available players 
  mycursor = mydb.cursor()
  sql = "SELECT * FROM practice_scores WHERE available = 1 and username <> %s"
  val = (player1,)   
  mycursor.execute(sql, val)

  # fetch all records, return results
  available = mycursor.fetchall()

  if available:
      return jsonify(available), 200  

  else: 
    return jsonify({"response": "no_players_found"}), 200

    #num_of_players = mycursor.rowcount 
    #opponent = available[0]
    #opponent = str(opponent)

'''

    
if __name__ == '__main__':
      app.run(host='0.0.0.0', port=5000, debug=True)
