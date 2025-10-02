import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../style/Home.css";
import { NavLink } from "react-router-dom";
import { ReactComponent as Post } from "../assets/pen-nib-solid-full.svg";
import { ReactComponent as Comment } from "../assets/comments-solid-full.svg";
import { ReactComponent as Like } from "../assets/thumbs-up-solid-full.svg";
import { ReactComponent as Share } from "../assets/share-from-square-solid-full.svg";
import { ReactComponent as Youtube } from "../assets/youtube-brands-solid-full.svg";
import { ReactComponent as Facebook } from "../assets/facebook-brands-solid-full.svg";
import { ReactComponent as Tiktok } from "../assets/tiktok-brands-solid-full.svg";

function Home() {
  // State chứa dữ liệu từ API
  const [platform, setPlatform] = useState([]); // Dữ liệu nền tảng (chưa dùng trong logic hiển thị, nhưng giữ lại)
  const [posts, setPosts] = useState([]); // Dữ liệu bài viết
  const [keywords, setKeywords] = useState([]); // Dữ liệu từ khóa

  // State cho các bộ lọc
  const [isKeywordMenuOpen, setIsKeywordMenuOpen] = useState(false); // Bật/tắt menu từ khóa
  const [isPlatformMenuOpen, setIsPlatformMenuOpen] = useState(false); // Bật/tắt menu nền tảng
  const [keywordSearch, setKeywordSearch] = useState(""); // Text nhập trong input tìm kiếm từ khóa
  const [selectedKeyword, setSelectedKeyword] = useState("Tất cả từ khóa"); // Giá trị từ khóa được chọn
  const [selectedPlatform, setSelectedPlatform] = useState("Tất cả nền tảng"); // Giá trị nền tảng được chọn

  // Thêm State cho bộ lọc ngày
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  // Gọi API khi component được mount
  useEffect(() => {
    // API giả định cho backend biết
    const baseUrl = "http://192.168.31.80:5000/api";
    const handleError = () => console.log("API chưa sẵn sàng");

    fetch(`${baseUrl}/keywords`)
      .then((res) => res.json())
      .then((data) => setKeywords(data))
      .catch(handleError);

    fetch(`${baseUrl}/posts`)
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch(handleError);

    fetch(`${baseUrl}/platform`)
      .then((res) => res.json())
      .then((data) => setPlatform(data))
      .catch(handleError);
  }, []);

  // Map ID nền tảng sang Icon và style tương ứng
  const platformMap = {
    1: <Youtube style={{ fill: "#FF0000", width: "25px" }} />,
    2: <Tiktok style={{ width: "25px" }} />,
    3: <Facebook style={{ fill: "#1877F2", width: "25px" }} />,
  };

  // Tạo Map từ ID từ khóa sang tên từ khóa (để tra cứu trong bảng)
  const keywordMap = Object.fromEntries(
    keywords.map((kw) => [kw.id, kw.keyword])
  );
  
  // Tạo Map từ tên nền tảng sang ID nền tảng (để lọc)
  const platformIdMap = {
    "YouTube": 1,
    "Tiktok": 2,
    "Facebook": 3,
  };

  // Danh sách tùy chọn cho dropdown nền tảng
  const platformOptions = [
    {
      value: "Youtube",
      label: (
        <>
          <Youtube fill="red" width="20px" /> YouTube
        </>
      ),
    },
    {
      value: "Facebook",
      label: (
        <>
          <Facebook fill="#1877F2" width="20px" /> Facebook
        </>
      ),
    },
    {
      value: "Tiktok",
      label: (
        <>
          <Tiktok fill="black" width="20px" /> Tiktok
        </>
      ),
    },
  ];

  // Xử lý chọn nền tảng
  const handlePlatformSelect = (option) => {
    setSelectedPlatform(option.value); // Thay đổi: Lưu trữ VALUE (string 'Youtube', 'Tiktok',...) để dễ lọc
    setIsPlatformMenuOpen(false);
  };

  // Lọc danh sách từ khóa cho dropdown (Không thay đổi)
  const filteredKeywords = keywords
    .map((kw) => kw.keyword) // Chỉ lấy giá trị keyword
    .filter((kw) =>
      kw.toLowerCase().includes(keywordSearch.toLowerCase())
    );

  // ===============================================
  // LOGIC LỌC DỮ LIỆU CHÍNH (Đã thêm)
  // ===============================================
  const filteredPosts = posts.filter(post => {
    // Lọc theo Từ khóa
    const keywordMatch = 
      selectedKeyword === "Tất cả từ khóa" || 
      keywordMap[post.keyword_id] === selectedKeyword;

    // Lọc theo Nền tảng
    const platformId = platformIdMap[selectedPlatform]; // Lấy ID tương ứng từ selectedPlatform (string)
    const platformMatch = 
      selectedPlatform === "Tất cả nền tảng" || 
      post.platform_id === platformId;

    // Lọc theo Ngày (logic đơn giản, cần API hỗ trợ lọc thực tế)
    // Hiện tại chỉ kiểm tra nếu selectedDate không rỗng, nhưng không có logic lọc ngày tháng thực
    // Chỉ là placeholder để hoàn thiện sau.
    // const dateMatch = selectedDate === "" || post.date.includes(selectedDate); // Cần logic lọc ngày thực tế

    return keywordMatch && platformMatch; // Áp dụng cả 2 bộ lọc
  });
  // ===============================================

  return (
    <div className="cover">
      <Navbar />
      <div className="dashboard">
        <h2 className="dashboard-title">Toàn bộ bài viết</h2>

        {/* Bộ lọc */}
        <div className="filters">
          {/* Bộ lọc Từ khóa */}
          <div className="dropdown">
            {/* input vừa để search vừa hiển thị selected */}
            <input
              className="dropdown-input" // Đổi tên class để tránh nhầm lẫn với div.dropdown
              type="text"
              // Hiển thị giá trị đang tìm kiếm hoặc từ khóa đã chọn
              value={keywordSearch || (selectedKeyword === "Tất cả từ khóa" ? "" : selectedKeyword)}
              placeholder="Tất cả từ khóa"
              onChange={(e) => {
                setKeywordSearch(e.target.value);
                setIsKeywordMenuOpen(true); // Nhập là mở menu
                setSelectedKeyword("Tất cả từ khóa"); // Đặt lại chọn khi bắt đầu search
              }}
              onClick={() => setIsKeywordMenuOpen(!isKeywordMenuOpen)}
            />

            {/* menu hiển thị khi open */}
            {isKeywordMenuOpen && (
              <div className="dropdown-menu">
                {/* Tùy chọn "Tất cả từ khóa" */}
                <div
                  className="dropdown-item"
                  onClick={() => {
                    setSelectedKeyword("Tất cả từ khóa");
                    setKeywordSearch("");
                    setIsKeywordMenuOpen(false);
                  }}
                >
                  Tất cả từ khóa
                </div>
                {/* Danh sách từ khóa đã lọc */}
                {filteredKeywords.map((kw, idx) => (
                  <div
                    key={idx}
                    className="dropdown-item"
                    onClick={() => {
                      setSelectedKeyword(kw);
                      setKeywordSearch("");
                      setIsKeywordMenuOpen(false);
                    }}
                  >
                    {kw}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Bộ lọc Nền tảng */}
          <div className="dropdown">
            <div
              className="dropdown-selected"
              onClick={() => setIsPlatformMenuOpen(!isPlatformMenuOpen)}
            >
              {selectedPlatform === "Tất cả nền tảng" ? (
                "Tất cả nền tảng"
              ) : (
                // Hiển thị label (có icon) nếu chọn, nếu không thì hiển thị tên
                platformOptions.find(opt => opt.value === selectedPlatform)?.label || selectedPlatform
              )}
            </div>
            {isPlatformMenuOpen && (
              <div className="dropdown-menu">
                {/* Tùy chọn "Tất cả nền tảng" */}
                <div
                  className="dropdown-item"
                  onClick={() => {
                    setSelectedPlatform("Tất cả nền tảng");
                    setIsPlatformMenuOpen(false);
                  }}
                >
                  Tất cả nền tảng
                </div>
                {/* Danh sách nền tảng */}
                {platformOptions.map((option) => (
                  <div
                    key={option.value}
                    className="dropdown-item"
                    onClick={() => handlePlatformSelect(option)}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bộ lọc ngày */}
          <div className="dropdown">
            <div
              className="dropdown-selected"
              onClick={() => setIsDateMenuOpen(!isDateMenuOpen)}
            >
              {selectedDate || "Toàn bộ thời gian"}
            </div>

            {isDateMenuOpen && (
              <div className="dropdown-menu">
                <div
                  className="dropdown-item"
                  onClick={() => {
                    setSelectedDate("3 ngày gần nhất");
                    setIsDateMenuOpen(false);
                  }}
                >
                  3 ngày gần nhất
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => {
                    setSelectedDate("7 ngày gần nhất");
                    setIsDateMenuOpen(false);
                  }}
                >
                  7 ngày gần nhất
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => {
                    setSelectedDate("30 ngày gần nhất");
                    setIsDateMenuOpen(false);
                  }}
                >
                  30 ngày gần nhất
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cards - Bảng thống kê (Không thay đổi) */}
        <div className="cards">
          <div className="card card-orange">
            <h3>Tổng bài viết</h3>
            <p className="big-number">{posts.length || "--"}</p>
            <p>
              <Post className="svg" />
              {posts?.length || "--"} Bài viết
            </p>
            {/* Giả định total_mentions là một property của posts, nếu posts là array thì phải tính tổng */}
            <p>
              <Comment className="svg" />
              {posts?.total_mentions?.discussions || "--"} Thảo luận
            </p>
            <small>* Bài viết + thảo luận liên quan đến từ khóa</small>
          </div>

          <div className="card">
            <h3>Tổng tương tác</h3>
            <p className="big-number">
              {posts?.total_interactions?.value || "--"}
            </p>
            <p>
              <Comment className="svg" />
              {posts?.total_interactions?.discussions || "--"} Tổng thảo luận
            </p>
            <p>
              <Like className="svg" />
              {posts?.total_interactions?.likes || "--"} Lượt thích
            </p>
            <p>
              <Share className="svg" />
              {posts?.total_interactions?.shares || "--"} Chia sẻ
            </p>
          </div>

          <div className="card">
            <h3>Tổng lượt xem</h3>
            <p className="big-number">{posts?.total_views?.value || "--"}</p>
            <p>
              <Tiktok className="svg" style={{ width: "20px", fill: "black" }} />
              TikTok: {posts?.total_views?.tiktok || "--"}
            </p>
            <p>
              <Youtube
                className="svg"
                style={{ width: "20px", fill: "#FF0000" }}
              />
              YouTube: {posts?.total_views?.youtube || "--"}
            </p>
            <p>
              <Facebook
                className="svg"
                style={{ width: "20px", fill: "#1877F2" }}
              />
              Facebook: {posts?.total_views?.facebook || "--"}
            </p>
          </div>

          <div className="card">
            <h3>Tổng từ khóa</h3>
            <p className="big-number">{keywords.length || "--"}</p>
            {/* Hiển thị 3 từ khóa phổ biến nhất, giả định posts.total_keywords.list là mảng các từ khóa */}
            {posts?.total_keywords?.list?.slice(0, 3).map((kw, i) => (
              <p key={i}>{kw}</p>
            ))}
          </div>

          <div className="card">
            <h3>Tổng dữ liệu</h3>
            <p className="big-number">{posts?.total_data?.value || "--"}</p>
            <p>{posts?.total_data?.mentions || "--"} Mentions</p>
            <p>{posts?.total_data?.interactions || "--"} Tương tác</p>
            <p>{posts?.total_data?.views || "--"} Lượt xem</p>
          </div>
        </div>

        {/* Bảng Bài viết mới nhất - Đã áp dụng filteredPosts */}
        <div className="table-container">
          <h2 className="table-title" style={{ color: "#2e3d76" }}>
            Bài viết mới nhất
          </h2>
          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ width: "5%" }}>STT</th>
                  <th style={{ width: "35%" }}>Bài viết</th>
                  <th style={{ width: "7%" }}>Từ khóa</th>
                  <th style={{ width: "5%" }}>Nguồn</th>
                  <th style={{ width: "15%" }}>Người đăng</th>
                  <th style={{ width: "20%" }}>Ngày đăng</th>
                </tr>
              </thead>
              <tbody>
                {/* Kiểm tra filteredPosts là mảng và có dữ liệu */}
                {Array.isArray(filteredPosts) && filteredPosts.length > 0 ? (
                  <>
                    {/* Chỉ hiển thị 10 bài viết đã được lọc */}
                    {filteredPosts.slice(0, 10).map((post, index) => (
                      <tr key={post.post_id}>
                        <td>{index + 1}</td>
                        <td>{post.post_name}</td>
                        <td>{keywordMap[post.keyword_id] || "Không rõ"}</td>
                        <td>{platformMap[post.platform_id] || "Không rõ"}</td>
                        <td>{post.author}</td>
                        <td>{post.date}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center" }}>
                        <NavLink to="/data" className="show-more-btn">
                          ▼ Xem toàn bộ bài viết
                        </NavLink>
                      </td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td colSpan="6" className="error">
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;