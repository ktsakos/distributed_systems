from flask import Flask, jsonify, request, redirect, session, flash, render_template, url_for, make_response
import json 
import mysql.connector, random, string, jwt, datetime
from itsdangerous import (TimedJSONWebSignatureSerializer as Serializer, 
    BadSignature, SignatureExpired)
from functools import wraps 
import dateparser as dp
import logging

     
app = Flask(__name__) # create an app instance
logging.basicConfig(level=logging.DEBUG)   
            

app.secret_key = 'thisismysecretdonottouchit'
#app.secret_key = ''.join(random.choice(string.ascii_uppercase + string.digits)
#    for x in range(32)) #a random string of 32 characters 

#authentication db connection
mydb = mysql.connector.connect(
  host="db", 
  port="3306",
  user="root",
  passwd="password",
  database="mydatabase"
)


 
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):

        content = request.get_json()

        if content: 
            token = content["token"]
        else: 
            token = request.args.get('token') 
            if 'token' in session and token is None:
                token = session['token']

        # check database for token 
        mycursor = mydb.cursor()
        sql = "SELECT * FROM users WHERE token=%s"
        val = (token,)
        mycursor.execute(sql, val)

        # fetch one record, return result
        user_account = mycursor.fetchone()

        if user_account:

            #token_from_table = user_account[9]
            time_from_table = user_account[8]

            # tropos a', me elegxo timestamp     
            now = datetime.datetime.utcnow()
            then = dp.parse(time_from_table)
            diff = now - then
            seconds_in_day = 24 * 60 * 60
            final = divmod(diff.days * seconds_in_day + diff.seconds, 60)
            final = str(final)
            a,b = final.split(',')
            c,d = a.split('(')
            time_passed = int(d)

            # tropos b', me elegxo token   
            """    
            try: 
                data = jwt.decode(token_from_table, app.secret_key)
            except: 
                return render_template('login_again.html')
            """
            
            # if time_passed < 10 minutes
            if (time_passed < 10): 
                session['flag'] = 'true' # edw mporw na valw pass
            else: 
                return jsonify({ "response": "false" }) 

        else:
            # no such account
            return jsonify({ "response": "noaccount" }) 

        return f(*args, **kwargs)

    return decorated



### API routes 

# just for testing 
@app.route('/', methods=['GET'])
def index():

    return "IT'S UP."



# authentication for other services, timestamp update  
@app.route('/checktoken', methods=['GET'])
@token_required
def checktoken():

    content = request.get_json()
    token = content["token"]
    print(token)

    # check database for token 
    mycursor = mydb.cursor()
    sql = "SELECT * FROM users WHERE token=%s"
    val = (token,)
    mycursor.execute(sql, val)

    # fetch one record, return result
    user_account = mycursor.fetchone()

    #update timestamp in DB
    timestamp = datetime.datetime.utcnow() 
    id = user_account[5]
    mycursor = mydb.cursor()
    mycursor.execute('UPDATE users SET timestamp=%s WHERE id=%s', (timestamp,id))
    mydb.commit() 

    return jsonify({ "response": "OK" }), 200    




# registration 
@app.route('/register', methods=['POST'])
def register():

    if request.method == 'POST': 
       
        content = request.get_json()
        task_content0 = content['content']  
        task_content1 = content['content1']   
        task_content2 = content['content2']   
        task_content3 = content['content3']   
        task_content4 = content['content4'] 

        mycursor = mydb.cursor()
        sql = "INSERT INTO users (username, password, name, surname, email, date_created, role, timestamp, token) VALUES (%s, %s, %s, %s, %s, now(), %s, %s, %s)"
        val = (task_content0, task_content1, task_content2, task_content3, task_content4, "Player", "", "trash")
        try:
            mycursor.execute(sql, val)
            mydb.commit()
        except:  ## if username is taken
            payload = { "username": task_content0, "response": "UsernameTaken" }
            return jsonify(payload)

        return jsonify({ "username": task_content0, "response": "OK" })



# login authentication 
@app.route('/login_auth', methods=['GET'])
def login_auth():

    json = request.get_json()

    input_username = json["username"]    
    input_password = json["password"]   

    # check database for username, password
    mycursor = mydb.cursor()
    mycursor.execute('SELECT * FROM users WHERE username = %s AND password = %s', (input_username, input_password))

    # fetch one record, return result
    user_account = mycursor.fetchone()
    # if there is such account
    if user_account:
        timestamp = datetime.datetime.utcnow() 
        token = jwt.encode({'user' : user_account[0], 'exp' : timestamp}, app.secret_key)
        id = user_account[5]
        mycursor = mydb.cursor()
        mycursor.execute('UPDATE users SET timestamp=now(), token=%s WHERE id=%s', (token,id))
        mydb.commit() 
        
        # variables for JSON response 
        username = str(user_account[0])
        token = str(token)
        role = str(user_account[7])
        resp = 'OK'

        #resp = { "username": username, "token": token, "role": role, "response" : resp } 

        return jsonify({"username": username, "token": token, "role": role, "response" : resp}), 200  

    else:
        return jsonify({ "response": "wrong_credentials" }), 200   





# assign role 
@app.route('/assign', methods=['GET'])
@token_required
def assign():

    token = request.args.get('token') 

    if 'token' in session and token is None:
       token = session['token']

    #keep token is session 
    session['token'] = token

    # check database for token 
    mycursor = mydb.cursor()
    sql = "SELECT * FROM users WHERE token=%s"
    val = (token,)
    mycursor.execute(sql, val)

    # fetch one record, return result
    user_account = mycursor.fetchone()

    #update token timer 
    timestamp = datetime.datetime.utcnow() 
    id = user_account[5]
    mycursor = mydb.cursor()
    mycursor.execute('UPDATE users SET timestamp=%s WHERE id=%s', (timestamp,id))
    mydb.commit() 
    role = user_account[7]

    # check if the user is Admin, else deny entrance 
    if role=='Admin':
        mycursor = mydb.cursor()
        mycursor.execute('SELECT * FROM users')
        users = mycursor.fetchall()
        return render_template('all_users.html', users = users)
    else:
        return "You are not an Admin, you don't have the right to enter!"




# update role 
@app.route('/update', methods=['POST'])
@token_required
def update():

    if request.method == 'POST':

        if 'token' in session:
            token = session['token']
        
        # check database for token 
        mycursor = mydb.cursor()
        sql = "SELECT * FROM users WHERE token=%s"
        val = (token,)
        mycursor.execute(sql, val)

        # fetch one record, return result
        user_account = mycursor.fetchone()

        #update token timer 
        timestamp = datetime.datetime.utcnow() 
        id = user_account[5]
        mycursor = mydb.cursor()
        mycursor.execute('UPDATE users SET timestamp=%s WHERE id=%s', (timestamp,id))
        mydb.commit() 

        id = request.form['id']
        role = request.form['role']
        mycursor = mydb.cursor()
        mycursor.execute('UPDATE users SET role=%s WHERE id=%s', (role, id))
        flash("User Role Updated Successfully!")
        mydb.commit()
        return redirect(url_for('assign'))




# when user logs out, we delete token from users DB 
@token_required
@app.route('/logout', methods=['POST'])
def logout():

	if request.method == 'POST': 

		content = request.get_json()
		username = content["username"]

		#update token in DB with some trash string 
		trash = 'sometrashstring'
		try: 
		    mycursor = mydb.cursor()
		    mycursor.execute('UPDATE users SET token=%s WHERE username=%s', (trash, username))
		    mydb.commit()
		    return jsonify({"response": "logged_out"}), 200 
		except:   
		    return jsonify({"response": "error"})



if __name__ == "__main__": 
    app.run(host='0.0.0.0', port=5000, debug=True)

 
