from flask import Flask, render_template, request, redirect, url_for, session
from flask_mysqldb import MySQL
import MySQLdb.cursors
import re

app = Flask(__name__)
app.secret_key = 'your_secret_key'

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'Fxdhddhjs31!'  # Enter your MySql password 
app.config['MYSQL_DB'] = 'crawl_medical'

mysql = MySQL(app)

@app.route('/')
@app.route('/danh-muc-tu-khoa', methods = ['POST','GET'])

def add_keyword():
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)

    if request.method == 'POST':
        keyword = request.form['keyword']
        if keyword and re.match(r'^[A-Za-z0-9\s]{2,255}$', keyword):
            try:
                cursor.execute(
                    "INSERT INTO keywords (keyword) VALUES (%s)", (keyword,)
                )
                mysql.connection.commit()
            except Exception as e:
                print("Error khi thêm từ khóa:", e)
        return redirect(url_for('add_keyword'))

    cursor.execute("SELECT * FROM keywords ORDER BY created_at DESC")
    keywords = cursor.fetchall()

    return render_template('/base.html', keywords=keywords)

if __name__ == '__main__':
    app.run(debug=True)