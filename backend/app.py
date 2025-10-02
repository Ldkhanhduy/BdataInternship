from flask import Flask, render_template, request, redirect, url_for, session, jsonify, flash
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from flask_mysqldb import MySQL
from flask_cors import CORS
import MySQLdb.cursors
import re
import threading
import time
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys

app = Flask(__name__)
CORS(app)

# Config MySQL
app.config['MYSQL_HOST'] = 'data.bdata.top'
app.config['MYSQL_USER'] = 'bdata_db'
app.config['MYSQL_PASSWORD'] = 'bData#123'
app.config['MYSQL_DB'] = 'mock_crawldata'
app.config['MYSQL_CHARSET'] = 'utf8mb4'
mysql = MySQL(app)

# ---------------------- API KEYWORDS ----------------------
@app.route('/api/keywords', methods=['GET'])
def get_keywords():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT keyword_id, keyword, created_at FROM keywords")
    data = cursor.fetchall()
    cursor.close()
    keywords = [{"id": row[0], "keyword": row[1], "created_at": row[2].strftime("%Y-%m-%d %H:%M:%S")} for row in data]
    return jsonify(keywords)

@app.route('/api/keywords', methods=['POST'])
def add_keyword():
    data = request.json
    print("Dữ liệu nhận từ frontend:", data)

    keyword = data.get('keyword') if data else None
    if not keyword:
        return jsonify({"error": "keyword is required"}), 400

    cursor = mysql.connection.cursor()
    cursor.execute("INSERT INTO keywords (keyword) VALUES (%s)", (keyword,))
    # keyword_id = cursor.lastrowid
    mysql.connection.commit()
    cursor.close()

#--------tổng hợp hàm crawl-----------
    # results = crawl_facebook(keyword)
    # posts_saved = []
    # for platform_id, crawl_func in [(2, crawl_tiktok), (3, crawl_facebook)]:
    #     for item in crawl_func(keyword):
    #         try:
    #             cursor = mysql.connection.cursor()
    #             cursor.execute("""
    #                 INSERT INTO posts (post_name, post_link, author, date, keyword_id, platform_id, crawl_at)
    #                 VALUES (%s, %s, %s, %s, %s, %s, %s)
    #                 """, (
    #                 item["post_name"],
    #                 item["post_link"],
    #                 item["author"],
    #                 item["date"],
    #                 keyword_id,
    #                 platform_id,
    #                 datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    #             ))
    #             mysql.connection.commit()
    #             cursor.close()
    #             posts_saved.append(item)
    #             print("✅ Insert thành công:", item)

    #         except Exception as e:
    #             print("❌ Lỗi lưu post:", e, "| Dữ liệu:", item)
    return jsonify({
        "message": "Keyword added and crawled successfully",
        "keyword": keyword
    }), 201

# ---------------------- API platform ----------------------
@app.route('/api/platform', methods=['GET'])
def get_platform():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT platform_id, platform_name FROM platform")
    data = cursor.fetchall()
    cursor.close()
    platform = [{"platform_id": row[0], "platform_name": row[1]} for row in data]
    return jsonify(platform)


# ---------------------- API POSTS ----------------------
@app.route('/api/posts', methods=['GET'])
def get_posts():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT post_id, post_name, post_link, author, date, post_reaction, post_comment, post_share, keyword_id, platform_id, crawl_at FROM posts")
    data = cursor.fetchall()
    cursor.close()
    posts = [{
        "post_id": row[0],
        "post_name": row[1],
        "post_link": row[2],
        "author": row[3],
        "date": row[4],
        "post_reaction": row[5],
        "post_comment": row[6],
        "post_share": row[7],
        "keyword_id": row[8],
        "platform_id": row[9],
        "crawl_at": row[10].strftime("%Y-%m-%d %H:%M:%S")
    } for row in data]
    return jsonify(posts)

# ---------------------- SELENIUM ----------------------
def get_driver():
    options = Options()
    # options.add_argument("--headless")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    return webdriver.Chrome(options=options)

def remove_emoji(text):
    emoji_pattern = re.compile("["
                               u"\U0001F600-\U0001F64F"  # emoticons
                               u"\U0001F300-\U0001F5FF"  # symbols & pictographs
                               u"\U0001F680-\U0001F6FF"  # transport & map
                               u"\U0001F1E0-\U0001F1FF"  # flags
                               "]+", flags=re.UNICODE)
    return emoji_pattern.sub(r'', text)

# -----------------Crawl Facebook --------------------
import random
def crawl_facebook(keyword):
    driver = get_driver()
    search_url = f"https://www.google.com/search?q={keyword}+site:facebook.com&hl=vi"
    driver.get(search_url)
    # time.sleep(random.uniform(5, 8))
    time.sleep(20)

    results = []
    seen_links = set()
    links = driver.find_elements(By.CSS_SELECTOR, 'div.MjjYud > div > div > div > div > div > div > span > a')

    wait = WebDriverWait(driver, 15)
    
    for idx, link in enumerate(links):
        
        post = {}
        try:
            haha = link.get_attribute('href')
            if not haha:
                continue

            if haha in seen_links:
                print(f"⏭️ Bỏ qua vì đã crawl trong vòng lặp: {haha}")
                continue
            seen_links.add(haha)

            cursor = mysql.connection.cursor()
            cursor.execute("SELECT COUNT(*) FROM posts WHERE post_link = %s", (link,))
            exists = cursor.fetchone()[0]
            cursor.close()
            if exists > 0:
                continue

            print(f"➡️ ({idx+1}/{len(links)}) Đang mở: {haha}")
            driver.execute_script("window.open(arguments[0]);", haha)
            driver.switch_to.window(driver.window_handles[1])

            time.sleep(random.randint(8, 15))

            try:
                titles = driver.find_elements(By.CSS_SELECTOR, "div.xdj266r.x14z9mp.xat24cr.x1lziwak.x1vvkbs.x126k92a > div")
                
                for i in titles:
                    post["post_name"] = ""
                    if len(post["post_name"]) < 500:
                        post["post_name"] = post["post_name"].join(i.text.strip())
            except Exception as e:
                print("Không lấy được tiêu đề:", e)
                post["post_name"] = "no title"

            try:
                post["post_link"] = haha
                print(post["post_link"])
            except Exception as e:
                print("post_link", haha)
                print(e)
                post["post_link"] = "-"
            
            try:
                post["author"] = driver.find_element(By.CSS_SELECTOR, "span.html-span.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x1hl2dhg.x16tdsg8.x1vvkbs").text.strip()
            except Exception as e:
                print("Không lấy được tác giả:", e)
                post["author"] = "unknown"
            print("Tiêu đề:", post["post_name"])
            print("Tác giả:", post["author"])

            post["date"] = datetime.now().strftime("%Y-%m-%d")
            print("✅ Crawl được:", post)
            results.append(post)

        except Exception as e:
            print("❌ Lỗi crawl:", e, "| link:", haha)

        finally:
            if len(driver.window_handles) > 1:
                driver.close()
                driver.switch_to.window(driver.window_handles[0])

            time.sleep(random.randint(5, 10))

    driver.quit()
    return results

# ----------------------CRAWL TIKTOK------------------------------
def crawl_tiktok(keyword, max_scroll=10):
    driver = get_driver()
    search_url = f"https://www.tiktok.com/search?q={keyword}"
    driver.get(search_url)

    wait = WebDriverWait(driver, 20)
    time.sleep(10)
    results = []
    seen_links = set()
    try:
        last_count = 0
        for scroll_round in range(max_scroll):
            containers = wait.until(
                EC.presence_of_all_elements_located((By.CSS_SELECTOR, "div[id^='column-item-video-container']")))
            for container in containers:
                try:
                    link_elem = container.find_element(By.CSS_SELECTOR, "a[href*='/video/']")
                    link = link_elem.get_attribute("href")
                except:
                    continue

                if not link or link in seen_links:
                    continue
                seen_links.add(link)

                # ✅ kiểm tra video đã có trong DB chưa
                cursor = mysql.connection.cursor()
                cursor.execute("SELECT COUNT(*) FROM posts WHERE post_link = %s", (link,))
                exists = cursor.fetchone()[0] #1
                cursor.close()

                if exists > 0:
                    continue  

                try:
                    title = container.find_element(By.CSS_SELECTOR, "span[data-e2e='new-desc-span']").text.strip()
                    title = remove_emoji(title)
                except:
                    title = ""

                try:
                    author = container.find_element(
                        By.CSS_SELECTOR,
                        "p.css-gcf6yw-5e6d46e3--PUniqueId.ef0y2m46"
                    ).text.strip()
                except:
                    author = ""

                result = {
                    "post_name": title,
                    "post_link": link,
                    "author": author,
                    "date": datetime.now().strftime("%Y-%m-%d")}
                results.append(result)  
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(random.uniform(3, 6)) 

            if len(containers) == last_count:
                print("⚠️ Không load thêm video, dừng lại.")
                break
            last_count = len(containers)

    except Exception as e:
        print(f"❌ Lỗi crawl_tiktok({keyword}):", e)

    finally:
        driver.quit()
    return results



#-----------------CRAWL YOUTUBE------------------
def crawl_youtube(keyword):
    driver = get_driver()
    search_url = f"https://www.youtube.com/results?search_query={keyword.replace(' ', '+')}"
    driver.get(search_url)
    time.sleep(10)

    results = []
    seen_links = set()
    try:
        elems = driver.find_elements(By.XPATH, '//a[@id="video-title"]')
        video_links = []
        for e in elems[:10]:  # lấy 10 video đầu tiên
            url = e.get_attribute("href")
            if url and "watch" in url:
                if url in seen_links:   
                    continue
                seen_links.add(url)     
                video_links.append(url)

        for link in video_links:

           # ✅ kiểm tra video đã có trong DB chưa
            cursor = mysql.connection.cursor()
            cursor.execute("SELECT COUNT(*) FROM posts WHERE post_link = %s", (link,))
            exists = cursor.fetchone()[0]
            cursor.close()
            if exists > 0:
                continue

            driver.get(link)
            time.sleep(2)

            try:
                post_name = driver.find_element(By.CSS_SELECTOR, "#title h1 yt-formatted-string").text
            except:
                post_name = ""

            try:
                author = driver.find_element(By.CSS_SELECTOR, "#text-container #text a").text
            except:
                author = ""

            try:
                date = driver.find_element(By.CSS_SELECTOR, "#date-text span").text
            except:
                date = datetime.now().strftime("%Y-%m-%d")

            results.append({
                "post_name": post_name,
                "post_link": link,
                "author": author,
                "date": date,})

    except Exception as e:
        print(f"❌ Lỗi crawl_youtube({keyword}):", e)

    finally:
        driver.quit()
    return results

# ---------------------- BACKGROUND CRAWL ----------------------
def crawl_and_save():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT keyword_id, keyword FROM keywords")
    keywords = cursor.fetchall()

    for keyword_id, keyword in keywords:
        tt_items = crawl_tiktok(keyword)
        if tt_items:
            for tt_item in tt_items:
                try:
                    cursor.execute("""
                        INSERT INTO posts (post_name, post_link, author, date, post_reaction, post_comment, post_share, keyword_id, platform_id, crawl_at)
                        VALUES (%s, %s, %s, %s, %s, %s, %s)
                    """, (
                        tt_item["post_name"],
                        tt_item["post_link"],
                        tt_item["author"],
                        tt_item["date"],
                        tt_item["post_reaction"],
                        tt_item["post_comment"],
                        tt_item["post_share"],
                        keyword_id,
                        2,
                        datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    ))
                    mysql.connection.commit()
                    print(f"✅ Lưu 1 video cho keyword '{keyword}': {tt_item['post_link']}")
                except Exception as e:
                    print("❌ Lỗi lưu DB:", e)
        else:
            print(f"⚠️ Không tìm thấy video mới cho keyword '{keyword}'")
        # Facebook
        fb_items = crawl_facebook(keyword)
        if fb_items:
            for fb_item in fb_items:
                try:
                    cursor.execute("""
                        INSERT INTO posts (post_name, post_link, author, date, post_reaction, post_comment, post_share, keyword_id, platform_id, crawl_at)
                        VALUES (%s, %s, %s, %s, %s, %s, %s)
                    """, (
                        fb_item["post_name"],
                        fb_item["post_link"],
                        fb_item["author"],
                        fb_item["date"],
                        fb_item["post_reaction"],
                        fb_item["post_comment"],
                        fb_item["post_share"],
                        keyword_id,
                        3,
                        datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    ))
                    mysql.connection.commit()
                    print(f"✅ Lưu Facebook cho keyword '{keyword}': {fb_item['post_link']}")
                except Exception as e:
                    print("❌ Lỗi lưu Facebook DB:", e)
        else:
            print(f"⚠️ Không tìm thấy bài viết Facebook cho keyword '{keyword}'")
        #Youtube
        ytb_items = crawl_youtube(keyword)
        if ytb_items:
            for ytb_item in ytb_items:
                try:
                    cursor.execute("""
                        INSERT INTO posts (post_name, post_link, author, date, post_reaction, post_comment, post_share, keyword_id, platform_id, crawl_at)
                        VALUES (%s, %s, %s, %s, %s, %s, %s)
                    """, (
                        ytb_item["post_name"],
                        ytb_item["post_link"],
                        ytb_item["author"],
                        ytb_item["date"],
                        ytb_item["post_reaction"],
                        ytb_item["post_comment"],
                        ytb_item["post_share"],
                        keyword_id,
                        1,
                        datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    ))
                    mysql.connection.commit()
                    print(f" Lưu 1 video YouTube cho keyword '{keyword}': {ytb_item['post_link']}")
                except Exception as e:
                    print(" Lỗi lưu DB youtube:", e)
        else:
            print(f"không tìm thấy video mới cho keyword' {keyword}'")
    cursor.close()
    print("✅ Crawl vòng mới xong lúc:", datetime.now())


def auto_crawl():
    while True:
        try:
            with app.app_context():
                crawl_and_save()
        except Exception as e:
            print("❌ Lỗi crawl:", e)
        time.sleep(60)

# ---------------------- MAIN ----------------------
if __name__ == '__main__':
    # threading.Thread(daemon=True).start()
    threading.Thread(target=auto_crawl, daemon=True).start()
    app.run(debug=True,use_reloader = False,  host="0.0.0.0", port=5000)