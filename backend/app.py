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
import random

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
    cursor.execute("SELECT post_id, post_name, post_link, author, date, post_reaction, post_comment, post_share, post_views, keyword_id, platform_id, crawl_at FROM posts")
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
        "post_views": row[8],
        "keyword_id": row[9],
        "platform_id": row[10],
        "crawl_at": row[11].strftime("%Y-%m-%d %H:%M:%S")
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

def parse_count(text: str) -> int:
    """
    Chuyển '32.9K' -> 32900, '1.2M' -> 1200000, '987' -> 987
    """
    text = text.strip().lower().replace(",", "")  # bỏ khoảng trắng, , (comma)
    multiplier = 1

    if text.endswith("k"):
        multiplier = 1_000
        text = text[:-1]
    elif text.endswith("m"):
        multiplier = 1_000_000
        text = text[:-1]
    elif text.endswith("b"):  # nếu có trường hợp hiếm gặp (billion)
        multiplier = 1_000_000_000
        text = text[:-1]
    elif text.endswith("n"):
        multiplier = 1_000
        text = text[:-1]
    elif text.endswith("tr"):
        multiplier = 1_000_000
        text = text[:-1]
    elif text.endswith("t"):
        multiplier = 1_000_000_000
        text = text[:-1]    
    try:
        return int(float(text) * multiplier)
    except:
        return 0

# -----------------Crawl Facebook --------------------
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

            #title
            try:
                titles = driver.find_elements(By.CSS_SELECTOR, "div.xdj266r.x14z9mp.xat24cr.x1lziwak.x1vvkbs.x126k92a > div")
                for i in titles:
                    post["post_name"] = ""
                    if len(post["post_name"]) < 500:
                        post["post_name"] = post["post_name"].join(i.text.strip())
            except Exception as e:
                print("Không lấy được tiêu đề:", e)
                post["post_name"] = "no title"

            #link
            try:
                post["post_link"] = haha
                print(post["post_link"])
            except Exception as e:
                print("post_link", haha)
                print(e)
                post["post_link"] = "-"
            
            #tacgia
            try:
                post["author"] = driver.find_element(By.CSS_SELECTOR, "span.html-span.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x1hl2dhg.x16tdsg8.x1vvkbs").text.strip()
            except Exception as e:
                print("Không lấy được tác giả:", e)
                post["author"] = "unknown"
            print("Tác giả:", post["author"])
            print("Tiêu đề:", post["post_name"])

            post["date"] = datetime.now().strftime("%Y-%m-%d")

            #reaction
            try:
                like = driver.find_element(By.CSS_SELECTOR,"div.x6s0dn4.x78zum5.x1iyjqo2.x6ikm8r.x10wlt62 > span.x1kmio9f.x6ikm8r.x10wlt62.xlyipyv.x1exxlbk > span > span.x135b78x").text.strip()
                if "K" in like:
                    post["post_reaction"] = int(float(like.replace("K","")) * 1000)
                else:
                    post["post_reaction"] = int(like)
            except Exception as e:
                print("không lấy được số like",e)
                post["post_reaction"] = "0"
            print("số lượt like", post["post_reaction"])

            #cmt 
            touch = driver.find_elements(By.CSS_SELECTOR, "span.html-span.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x1hl2dhg.x16tdsg8.x1vvkbs.xkrqix3.x1sur9pj")
            try:
                comment = touch[0].text.strip()
                post["post_comment"] = int(float(comment.replace(" bình luận","").strip()))
            except Exception as e:
                print("Không lấy được comment",e)
                post["post_comment"] = int(0)
            print("Số comment", post["post_comment"])

            #share
            try:
                share = touch[1].text.strip()
                post["post_share"] = int(float(share.replace(" lượt chia sẻ","").strip()))
            except Exception as e:
                print("Không lấy được share",e)
                post["post_share"] = int(0)
            print("Số share", post["post_share"])

            #views
            post["post_views"] = int(0)

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
def crawl_tiktok(keyword, max_scroll=5, max_videos = 5):
    driver = get_driver()
    search_url = f"https://www.tiktok.com/search/video?q={keyword}"
    driver.get(search_url)

    wait = WebDriverWait(driver, 30)
    time.sleep(10)
    results = []
    seen_links = set()
    try:
        last_count = 0
        for scroll_round in range(max_scroll):
            if len(results) >= max_videos:
                break  

            containers = wait.until(
                EC.presence_of_all_elements_located((By.CSS_SELECTOR, "div[id^='column-item-video-container']")))
            
            for container in containers:
                if len(results) >= max_videos:
                    break
                try:
                    link_elem = container.find_element(By.CSS_SELECTOR, "a[href*='/video/']")
                    link = link_elem.get_attribute("href")
                except:
                    continue

                if not link or link in seen_links:
                    continue
                seen_links.add(link)

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

                reaction, comment, share, views = 0, 0, 0, 0
                try:
                    search_handle = driver.current_window_handle
                    driver.execute_script("window.open(arguments[0], '_blank');", link)
                    driver.switch_to.window(driver.window_handles[-1])
                    time.sleep(5)

                    reaction_text = wait.until(
                        EC.presence_of_element_located((By.CSS_SELECTOR, "strong[data-e2e='like-count']"))
                    ).text.strip()
                    reaction = parse_count(reaction_text)

                    comment_text = wait.until(
                        EC.presence_of_element_located((By.CSS_SELECTOR, "strong[data-e2e='comment-count']"))
                    ).text.strip()
                    comment = parse_count(comment_text)

                    share_text = wait.until(
                        EC.presence_of_element_located((By.CSS_SELECTOR, "strong[data-e2e='share-count']"))
                    ).text.strip()
                    share = parse_count(share_text)
                    try:
                        profile_elem = wait.until(
                            EC.presence_of_element_located((By.CSS_SELECTOR, "a[href*='@'][data-e2e='browse-user-avatar']"))
                        )
                        profile_link = profile_elem.get_attribute("href")
                    except:
                        profile_elem = driver.find_element(By.CSS_SELECTOR, "a[href*='@']")
                        profile_link = profile_elem.get_attribute("href")

                    try:

                        driver.execute_script("window.open(arguments[0], '_blank');", profile_link)
                        driver.switch_to.window(driver.window_handles[-1])
                        time.sleep(3)

                        wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, "a[href*='/video/']")))

                        videos = driver.find_elements(By.CSS_SELECTOR, "a[href*='/video/']")
                        view_elems = driver.find_elements(By.CSS_SELECTOR, "strong[data-e2e='video-views']")

                        print(f"Tìm thấy {len(videos)} video trên profile {profile_link}")

                        found = False
                        for v, ve in zip(videos, view_elems):
                            try:
                                v_link = v.get_attribute("href")
                                print("🧩 Đang so sánh:", v_link)
                                time.sleep(1)

                                if v_link and v_link.split("?")[0] == link.split("?")[0]:
                                    views_text = ve.text.strip()
                                    views = parse_count(views_text)
                                    print(f"✅ Tìm thấy video, views = {views_text}")
                                    found = True
                                    break

                            except Exception as inner_e:
                                print(f"⚠️ Lỗi khi đọc 1 video: {inner_e}")
                                continue

                        if not found:
                            print(f"⚠️ Không tìm thấy video khớp với link {link}")
                            views = 0

                    except Exception as e:
                        print(f"⚠️ Không lấy được views trong profile: {e}")
                        views = 0

                    driver.close()  
                    driver.switch_to.window(driver.window_handles[-1])
                    driver.close()  
                    driver.switch_to.window(search_handle)

                except Exception as e:
                    print(f"⚠️ Không lấy được reaction/comment/share/views cho {link}: {e}")
                result = {
                    "post_name": title,
                    "post_link": link,
                    "author": author,
                    "post_reaction": reaction,
                    "post_comment": comment,
                    "post_share": share,
                    "post_views": views,
                    "date": datetime.now().strftime("%Y-%m-%d")
                }
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
        for e in elems[:15]:
            url = e.get_attribute("href")
            if url and "watch" in url:
                if url in seen_links:   
                    continue
                seen_links.add(url)     
                video_links.append(url)

        for link in video_links:

            cursor = mysql.connection.cursor()
            cursor.execute("SELECT COUNT(*) FROM posts WHERE post_link = %s", (link,))
            exists = cursor.fetchone()[0]
            cursor.close()
            if exists > 0:
                continue

            driver.get(link)
            time.sleep(2)

            try:
                post_name = driver.find_element(By.CSS_SELECTOR, "#above-the-fold > #title h1 yt-formatted-string").text
            except:
                post_name = ""

            try:
                author = ""
                selectors = [
                    "#channel-name #text a",                # selector chính
                    "ytd-channel-name a.yt-simple-endpoint", # fallback 1
                    "#text-container a"                      # fallback 2
                ]

                for selector in selectors:
                    try:
                        element = driver.find_element(By.CSS_SELECTOR, selector)
                        text_val = element.text.strip()
                        if text_val:  
                            author = text_val
                            break
                    except:
                        continue

                print("Tên kênh:", author)

            except Exception as e:
                print("Không lấy được tên kênh:", e)
                author = ""


            try:
                date = driver.find_element(By.CSS_SELECTOR, "#info-container #date-text span").text
            except:
                date = datetime.now().strftime("%Y-%m-%d")
            
            try:

                element = driver.find_element(By.CSS_SELECTOR, "like-button-view-model.ytLikeButtonViewModelHost button-view-model.ytSpecButtonViewModelHost div.yt-spec-button-shape-next__button-text-content")
                raw_text = element.text.strip()
                
                if raw_text:
                    like_count = parse_count(raw_text)
                else:

                    button = driver.find_element(By.CSS_SELECTOR, "button.yt-spec-button-shape-next")
                    aria_label = button.get_attribute("aria-label")
                    print("DEBUG aria-label:", repr(aria_label))
                    

                    number_match = re.search(r"[\d\.,]+", aria_label)
                    like_count = parse_count(number_match.group()) if number_match else 0

                print("Số like:", like_count)

            except Exception as e:
                print("Không lấy được số like:", str(e))
                like_count = 0

            try:

                driver.execute_script("window.scrollBy(0, 800);")


                element = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR,
                        "ytd-comments #count yt-formatted-string.count-text span"))
                )

                comment_text = element.text.strip()  # Ví dụ: "44", "1,2 N", "1.286"
                post_comment = parse_count(comment_text)
                print("so comment",post_comment)

            except Exception as e:
                print("Không lấy được số comment:", e)
                post_comment = 0

            try:
                view_element = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((
                        By.CSS_SELECTOR,
                        "#info span.style-scope.yt-formatted-string"
                    ))
                )
                view_text = view_element.text.strip()
                print("view text: ",view_text)
                view_text = re.sub(r"[^\d,\.kmnbtr]+", "", view_text.lower()) 
                if any(x in view_text for x in ["k", "m", "b", "n", "tr", "t"]):
                    view_count = parse_count(view_text)
                else:

                    cleaned = re.sub(r"[^\d]", "", view_text)
                    view_count = int(cleaned) if cleaned else 0

                print("Số lượt xem:", view_count, type(view_count))

                
            except Exception as e:
                print("Khong lay duoc so luot xem",str(e))
                view_count = 0


            results.append({
                "post_name": post_name,
                "post_link": link,
                "author": author,
                "date": date,
                "post_reaction": like_count,
                "post_comment": post_comment,
                "post_share":0,
                "post_views": view_count})

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
                        INSERT INTO posts (post_name, post_link, author, date, post_reaction, post_comment, post_share, post_views, keyword_id, platform_id, crawl_at)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """, (
                        tt_item["post_name"],
                        tt_item["post_link"],
                        tt_item["author"],
                        tt_item["date"],
                        tt_item["post_reaction"],
                        tt_item["post_comment"],
                        tt_item["post_share"],
                        tt_item["post_views"],
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
        fb_items = crawl_facebook(keyword)
        if fb_items:
            for fb_item in fb_items:
                try:
                    cursor.execute("""
                        INSERT INTO posts (post_name, post_link, author, date, post_reaction, post_comment, post_share, post_views, keyword_id, platform_id, crawl_at)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """, (
                        fb_item["post_name"],
                        fb_item["post_link"],
                        fb_item["author"],
                        fb_item["date"],
                        fb_item["post_reaction"],
                        fb_item["post_comment"],
                        fb_item["post_share"],
                        fb_item["post_views"],
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
                        INSERT INTO posts (post_name, post_link, author, date, post_reaction, post_comment, post_share, post_views, keyword_id, platform_id, crawl_at)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """, (
                        ytb_item["post_name"],
                        ytb_item["post_link"],
                        ytb_item["author"],
                        ytb_item["date"],
                        ytb_item["post_reaction"],
                        ytb_item["post_comment"],
                        ytb_item["post_share"],
                        ytb_item["post_views"],
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