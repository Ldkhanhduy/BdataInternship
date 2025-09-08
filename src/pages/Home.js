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
  const [keywords, setKeywords] = useState([]);

  useEffect(() => {
    // API giả định cho backend biết
    fetch("http://192.168.1.188:5000/api/keywords")
      .then((res) => res.json())
      .then((data) => setKeywords(data))
      .catch(() => console.log("API chưa sẵn sàng"));

    fetch("http://192.168.1.188:5000/api/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch(() => console.log("API chưa sẵn sàng"));
  }, []);

  const keywordMap = {};
  keywords.forEach((k) => {
    keywordMap[k.id] = k.keyword_name;
  });

  return (
    <div className="cover">
      <Navbar />
      <div className="dashboard" style={{ marginLeft: "20%", width: "100%" }}>
        <h2 className="dashboard-title">Toàn bộ bài viết</h2>

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
          <button className="upload-btn">⬆</button>
        </div>

        {/* Cards */}
        <div className="cards">
          <div className="card card-orange">
            <h3>Tổng bài viết</h3>
            <p className="big-number">{posts.length || "--"}</p>
            <p><Post className="svg"/>{posts?.length || "--"} Bài viết</p>
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
          <h2 className="table-title" style={{color: "#2e3d76"}}>Bài viết mới nhất</h2>
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{width: "5%"}}>STT</th>
                <th style={{width: "40%"}}>Bài viết</th>
                <th style={{width: "15%"}}>Từ khóa</th>
                <th style={{width: "10%"}}>Nguồn</th>
                <th style={{width: "15%"}}>Người đăng</th>
                <th style={{width: "15%"}}>Ngày đăng</th>
              </tr>
            </thead>
            <tbody>
              {posts && posts.length > 0 ? (
                posts.map((post, index) => (
                  <tr key={post.post_id}>
                    <td>{index + 1}</td>
                    <td>{post.post_name}</td>
                    <td>{post.keyword_id}</td>
                    <td>{keywordMap[post.keyword_id] || "Không rõ"}</td>
                    <td>{post.author}</td>
                    <td>{post.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="error">Chưa có dữ liệu...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Home;
