from flask import Flask, render_template, request, redirect, url_for, session,jsonify,flash
from flask_mysqldb import MySQL
from flask_cors import CORS
import MySQLdb.cursors
import re

app = Flask(__name__)
CORS(app)

# Config MySQL
app.config['MYSQL_HOST'] = 'data.bdata.top'
app.config['MYSQL_USER'] = 'bdata_db'
app.config['MYSQL_PASSWORD'] = 'bData#123'
app.config['MYSQL_DB'] = 'mock_crawldata'

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

@app.route('/api/posts', methods=['GET'])
def get_posts():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT post_id,post_name,author,date,keyword_id,platform_id,crawl_at FROM posts")
    data = cursor.fetchall()
    cursor.close()
    posts = [{"post_id": row[0], "post_name": row[1],"author": row[2], "date": row[3],"keyword_id": row[4],"platform_id": row[5],
              "crawl_at": row[6].strftime("%Y-%m-%d %H:%M:%S")}for row in data]
    return jsonify(posts)

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
    app.run(debug=True, host = "0.0.0.0", port = 5000)