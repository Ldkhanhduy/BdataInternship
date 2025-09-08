from flask import Flask, render_template, request, redirect, url_for, session,jsonify,flash
from flask_mysqldb import MySQL
from flask_cors import CORS
import MySQLdb.cursors
import re

app = Flask(__name__)
CORS(app)

# Config MySQL
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = '18112004'
app.config['MYSQL_DB'] = 'thinhdb'

mysql = MySQL(app)

# # Trang test nhập keyword
# @app.route('/')
# def index():
#     return render_template('index.html')

# API: lấy danh sách keywords
@app.route('/api/keywords', methods=['GET'])
def get_keywords():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT keyword_id, keyword, created_at FROM keywords")
    data = cursor.fetchall()
    cursor.close()
    keywords = [{"id": row[0], "keyword": row[1], "created_at": row[2].strftime("%Y-%m-%d %H:%M:%S")}for row in data]
    return jsonify(keywords)

# API: thêm keyword
@app.route('/api/keywords', methods=['POST'])
def add_keyword():
    data = request.json
    print("Dữ liệu nhận từ frontend:", data)

    keyword = data.get('keyword') if data else None
    if not keyword:
        return jsonify({"error": "keyword is required"}), 400

    cursor = mysql.connection.cursor()
    cursor.execute("INSERT INTO keywords (keyword) VALUES (%s)", (keyword,))
    mysql.connection.commit()
    cursor.close()
    return jsonify({"message": "Keyword added successfully!"}), 201


if __name__ == '__main__':
    app.run(debug=True)