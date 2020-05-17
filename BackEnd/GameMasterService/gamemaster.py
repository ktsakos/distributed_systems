from flask import Flask, jsonify, request, session 
import json
import mysql.connector, random, string
import logging
import sys

     
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
  mycursor = mydb.cursor()
  sql = "INSERT INTO scores (username, score) VALUES (%s, %s)"
  val = (value, 0)
  try: 
    mycursor.execute(sql, val)
    mydb.commit()
    return jsonify( {"response": "OK"} ) 

  except: 
    return jsonify( {"response": "error"} ) 

        

# get user score (so far) from Scores table 
@app.route('/getscore', methods=['GET'])
def getscore():
  
  if request.method == 'GET':

    # get JSON request with username 
    content = request.get_json()
    username = content["username"] 

    # get score from DB
    mycursor = mydb.cursor()
    sql = "SELECT * FROM scores WHERE username=%s"
    val = (username,)
    mycursor.execute(sql, val)

    # fetch one record, return result
    user_account = mycursor.fetchone()
    
    if user_account:
 
      score = user_account[1]
      total_score = str(score)

      #return 
      return jsonify({"score": total_score}), 200 

    else: 

      return jsonify({"Message": "nouserfound"}) 




# get user score (so far) from Scores table 
@app.route('/', methods=['GET'])
def index():

  return "PARTETA"
  #print('parta',file=sys.stdrr)
  #print('parta',file=sys.stdout)


     
if __name__ == '__main__':
      app.run(host='0.0.0.0', port=5000, debug=True)
