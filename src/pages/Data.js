import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../style/Home.css";
import { ReactComponent as Post } from "../assets/pen-nib-solid-full.svg";
import { ReactComponent as Comment } from "../assets/comments-solid-full.svg";
import { ReactComponent as Like } from "../assets/thumbs-up-solid-full.svg";
import { ReactComponent as Share } from "../assets/share-from-square-solid-full.svg";
import { ReactComponent as Youtube } from "../assets/youtube-brands-solid-full.svg";
import { ReactComponent as Facebook } from "../assets/facebook-brands-solid-full.svg";
import { ReactComponent as Tiktok } from "../assets/tiktok-brands-solid-full.svg";


function Home() {
  const [stats, setStats] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // API giả định cho backend biết
    fetch("http://localhost:5000/api/statistics")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => console.log("API chưa sẵn sàng"));

    fetch("http://192.168.1.200:5000/api/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch(() => console.log("API chưa sẵn sàng"));
  }, []);

  const platformMap = {
    1: <Youtube style={{fill: "#FF0000"}} />,
    2: <Facebook style={{fil: "#1877F2"}}/>,
    3: <Tiktok style={{fill: "black"}} />
  };


  return (
    <div className="cover">
      <Navbar />
      <div className="dashboard">
        <h2 className="dashboard-title">Trung tâm dữ liệu</h2>

        {/* Bộ lọc */}
        <div className="filters">
          <select>
            <option>Tất cả từ khóa</option>
          </select>
          <select>
            <option>Toàn bộ nền tảng</option>
          </select>
          <select>
            <option>Tất cả chỉ số cảm xúc</option>
          </select>
          <select>
            <option>3 ngày gần nhất</option>
          </select>
          <input type="text" placeholder="Nhập nội dung cần tìm..." />
        </div>

        {/* Cards */}
        <div className="cards">
          <div className="card card-orange">
            <h3>Tổng bài viết</h3>
            <p className="big-number">{stats?.total_mentions?.value || "--"}</p>
            <p><Post className="svg"/>{stats?.total_mentions?.posts || "--"} Bài viết</p>
            <p><Comment className="svg"/>{stats?.total_mentions?.discussions || "--"} Thảo luận</p>
            <small>* Bài viết + thảo luận liên quan đến từ khóa</small>
          </div>

          <div className="card">
            <h3>Tổng tương tác</h3>
            <p className="big-number">{stats?.total_interactions?.value || "--"}</p>
            <p><Comment className="svg" />{stats?.total_interactions?.discussions || "--"} Tổng thảo luận</p>
            <p><Like className="svg" />{stats?.total_interactions?.likes || "--"} Lượt thích</p>
            <p><Share className="svg"/>{stats?.total_interactions?.shares || "--"} Chia sẻ</p>
          </div>

          <div className="card">
            <h3>Tổng lượt xem</h3>
            <p className="big-number">{stats?.total_views?.value || "--"}</p>
            <p><Tiktok className="svg" style={{fill: "black"}}/>TikTok: {stats?.total_views?.tiktok || "--"}</p>
            <p><Youtube className="svg" style={{fill: "#FF0000"}}/>YouTube: {stats?.total_views?.youtube || "--"}</p>
            <p><Facebook className="svg" style={{fil: "#1877F2"}}/>Facebook: {stats?.total_views?.facebook || "--"}</p>
          </div>

          <div className="card">
            <h3>Tổng từ khóa</h3>
            <p className="big-number">{stats?.total_keywords?.count || "--"}</p>
            {stats?.total_keywords?.list?.slice(0, 3).map((kw, i) => (
              <p key={i}>{kw}</p>
            ))}
          </div>

          <div className="card">
            <h3>Tổng dữ liệu</h3>
            <p className="big-number">{stats?.total_data?.value || "--"}</p>
            <p>{stats?.total_data?.mentions || "--"} Mentions</p>
            <p>{stats?.total_data?.interactions || "--"} Tương tác</p>
            <p>{stats?.total_data?.views || "--"} Lượt xem</p>
          </div>
        </div>

        <div className="table-container">
          <h2 className="table-title" style={{color: "#2e3d76"}}>Bài viết</h2>
          <div className="data-table">
            {posts && posts.length > 0 ? (
              posts.map((post, index) => (
                <div key={post.id || index}>
                  <div className="data-row">
                    <div className="data-cell">{index + 1}</div>
                    <div className="data-cell">
                      {platformMap[post.platform_id] || <span>?</span>}
                    </div>
                  </div>
                  <div className="data-col">
                    <div className="data-row">
                      <div className="data-cell" style={{ flexGrow: "8" }}>
                        {post.title}
                      </div>
                      <div className="data-cell" style={{ flexGrow: "2" }}>
                        {post.source}
                      </div>
                      <div className="data-cell" style={{ flexGrow: "2" }}>
                        {post.author}
                      </div>
                      <div className="data-cell" style={{ flexGrow: "2" }}>
                        {post.content}
                      </div>
                    </div>
                    <div className="data-row">{post.keyword}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="data-row">
                <div
                  className="error"
                  style={{ width: "100%"}}
                >
                  Chưa có dữ liệu...
                </div>
              </div>
            )}
          </div>


        </div>
      </div>
    </div>
  );
}

export default Home;
