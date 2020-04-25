from flask import Flask, request, url_for, render_template, redirect
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime 
import mysql.connector


app = Flask(__name__)  # create an app instance
db = SQLAlchemy()   

#db data
mydb = mysql.connector.connect(
  host="localhost",
  user="atzavaras",
  passwd="1234",
  database="mydatabase"
)
  
# gia to registration
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
        return render_template('index.html')
    

# gia to login
@app.route('/login', methods=['POST', 'GET'])
def login():

    msg = 'Incorrect username/password!'  #error msg

    if request.method == 'POST':
        
        input_username = request.form['content']       
        input_password = request.form['content1']   

        mycursor = mydb.cursor()
        # elegxoume sth bash gia username, password
        mycursor.execute('SELECT * FROM users WHERE username = %s AND password = %s', (input_username, input_password,))

        # fetch one record, return result
        user_account = mycursor.fetchone()
        # an yparxei to account
        if user_account:
            # Create session data...
            # edw 8a balw session metablhtes, token 
            # ....
            return 'Logged in successfully!'
        else:
            # den yparxei to account / do8hkan la8os credentials 
            return msg
    else:
        return render_template('login_page.html')
    
if __name__ == "__main__": 
    app.run(debug=True)



