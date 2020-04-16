import mysql.connector

mydb = mysql.connector.connect(
  host="localhost",
  user="atzavaras",
  passwd="1234",
  database="mydatabase"
)

# apla gia test, na vlepw tous users...

mycursor = mydb.cursor()

mycursor.execute("SELECT * FROM users")

myresult = mycursor.fetchall()

from flask import Flask 

app = Flask(__name__)             # create an app instance

@app.route('/')
def index():
  for x in myresult:
    print(x)   


if __name__ == "__main__": 
    app.run(debug=True)

