from flask import Flask, jsonify, request, url_for, render_template, redirect, session, flash
import mysql.connector, random, string, jwt, datetime
from itsdangerous import (TimedJSONWebSignatureSerializer as Serializer, 
    BadSignature, SignatureExpired)
from functools import wraps 

app = Flask(__name__)  # create an app instance

app.secret_key = 'thisismysecretdonottouchit'
#app.secret_key = ''.join(random.choice(string.ascii_uppercase + string.digits)
#    for x in range(32)) #a random string of 32 characters 

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.args.get('token') 

        if not token:
            return "You have to login!"

        try: 
            data = jwt.decode(token, app.secret_key)
        except: 
            return render_template('login_again.html')
        
        return f(*args, **kwargs)

    return decorated



#db data
mydb = mysql.connector.connect(
  host="172.19.0.3",
  port="3306",
  user="dbuser",
  passwd="dbpassword",
  database="mydatabase"
)

#an unprotected route 
@app.route('/unprotected')
def unprotected():
    return jsonify({'message' : 'Anyone can view this!'})

#a protected route 
@app.route('/home')
@token_required
def home():
    if 'token' in request.args:
        token = request.args.get('token')
        return render_template('home_page.html', token=token)


@app.route('/chess')
@token_required
def chess():
    return render_template('chess.html')      
  

# registration
@app.route('/', methods=['POST', 'GET'])
def index():
    if request.method == 'POST': 
        task_content0 = request.form['content']       
        task_content1 = request.form['content1']   
        task_content2 = request.form['content2']   
        task_content3 = request.form['content3']   
        task_content4 = request.form['content4']   

        mycursor = mydb.cursor()
        sql = "INSERT INTO users (username, password, name, surname, email, role) VALUES (%s, %s, %s, %s, %s, %s)"
        val = (task_content0, task_content1, task_content2, task_content3, task_content4, "Player")
        mycursor.execute(sql, val)
        mydb.commit()
        return render_template('complete.html')
    else:
        
        return render_template('signup.html')
    

# login
@app.route('/login', methods=['POST', 'GET'])
def login():
 
    #if token_exists:

    # login
    msg = 'Incorrect username/password!'  #error msg
    if request.method == 'POST':
        
        input_username = request.form['content']       
        input_password = request.form['content1']   

        # elegxoume sth bash gia username, password
        mycursor = mydb.cursor()
        mycursor.execute('SELECT * FROM users WHERE username = %s AND password = %s', (input_username, input_password))

        # fetch one record, return result
        user_account = mycursor.fetchone()
        # an yparxei to account
        if user_account:
            token = jwt.encode({'user' : user_account[0], 'exp' : datetime.datetime.utcnow() + datetime.timedelta(minutes=2) }, app.secret_key) 

            #redirect to home page
            return redirect(url_for('home', token=token))
        else:
            # den yparxei to account / do8hkan la8os credentials 
            return msg
    else:
        return render_template('login.html')



# assign role 
@app.route('/assign', methods=['POST', 'GET'])
@token_required
def assign():
    mycursor = mydb.cursor()
    mycursor.execute('SELECT * FROM users')
    users = mycursor.fetchall()

    return render_template('all_users.html', users = users)


# update role 
@app.route('/update', methods=['POST','GET'])
def update():

    if request.method == 'POST':
        id = request.form['id']
        role = request.form['role']
        mycursor = mydb.cursor()
        mycursor.execute('UPDATE users SET role=%s WHERE id=%s', (role, id))
        flash("User Role Updated Successfully!")
        mydb.commit()
        return redirect(url_for('assign'))


     
if __name__ == "__main__": 
    app.run(debug=True)

