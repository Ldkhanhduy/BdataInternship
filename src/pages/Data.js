import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../style/Home.css";

function Data() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // API giả định cho backend biết
    fetch("http://localhost:5000/api/statistics")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => console.log("API chưa sẵn sàng"));
  }, []);

  return (
    <div className="cover">
      <Navbar />
      <div className="dashboard" style={{ marginLeft: "20%", width: "100%" }}>
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
          <button className="upload-btn">⬆</button>
        </div>

        {/* Cards */}
        <div className="cards">
          <div className="card card-orange">
            <h3>Tổng bài viết</h3>
            <p className="big-number">{stats?.total_mentions?.value || "--"}</p>
            <p>{stats?.total_mentions?.posts || "--"} Bài viết</p>
            <p>{stats?.total_mentions?.discussions || "--"} Thảo luận</p>
            <small>* Bài viết + thảo luận liên quan đến từ khóa</small>
          </div>

          <div className="card">
            <h3>Tổng tương tác</h3>
            <p className="big-number">{stats?.total_interactions?.value || "--"}</p>
            <p>{stats?.total_interactions?.discussions || "--"} Tổng thảo luận</p>
            <p>{stats?.total_interactions?.likes || "--"} Lượt thích</p>
            <p>{stats?.total_interactions?.shares || "--"} Chia sẻ</p>
          </div>

          <div className="card">
            <h3>Tổng lượt xem</h3>
            <p className="big-number">{stats?.total_views?.value || "--"}</p>
            <p>TikTok: {stats?.total_views?.tiktok || "--"}</p>
            <p>YouTube: {stats?.total_views?.youtube || "--"}</p>
            <p>Facebook: {stats?.total_views?.facebook || "--"}</p>
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
      </div>
    </div>
  );
}

export default Data;