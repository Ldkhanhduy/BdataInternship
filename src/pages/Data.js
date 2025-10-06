import { useEffect, useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import "../style/Data.css";
import { ReactComponent as Post } from "../assets/pen-nib-solid-full.svg";
import { ReactComponent as Comment } from "../assets/comments-solid-full.svg";
import { ReactComponent as Like } from "../assets/thumbs-up-solid-full.svg";
import { ReactComponent as Share } from "../assets/share-from-square-solid-full.svg";
import { ReactComponent as Youtube } from "../assets/youtube-brands-solid-full.svg";
import { ReactComponent as Facebook } from "../assets/facebook-brands-solid-full.svg";
import { ReactComponent as Tiktok } from "../assets/tiktok-brands-solid-full.svg";


function Data() {
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

  useEffect(() => {
    // API giả định cho backend biết

    fetch("http://192.168.1.199:5000/api/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch(() => console.log("API chưa sẵn sàng"));

    fetch("http://192.168.1.199:5000/api/platform")
      .then((res) => res.json())
      .then((data) => setPlatform(data))
      .catch(() => console.log("API chưa sẵn sàng"));

    fetch("http://192.168.1.199:5000/api/keywords")
      .then((res) => res.json())
      .then((data) => setKeywords(data))
      .catch(() => console.log("API chưa sẵn sàng"));
  }, []);

  const platformMap = {
    1: <Youtube style={{fill: "#FF0000", width: "30px"}} />,
    2: <Tiktok style={{width: "30px"}} />,
    3: <Facebook style={{fill: "#1877F2", width: "30px"}}/>
  };
  
  const keywordMap = Object.fromEntries(
  keywords.map(kw => [kw.id, kw.keyword])
  );

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 30;

  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;



  const totalPages = Math.ceil(posts.length / postsPerPage);
  
  // Tạo Map từ tên nền tảng sang ID nền tảng (để lọc)
  const platformIdMap = {
    "Youtube": 1,
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

        // Logic lọc theo Ngày
    const today = new Date();
    const daysMap = {
      "Hôm nay": 0,
      "3 ngày gần nhất": 3,
      "7 ngày gần nhất": 7,
      "30 ngày gần nhất": 30,
    };

    let dateMatch = true; // mặc định không lọc nếu chưa chọn
    if (selectedDate && selectedDate !== "Toàn bộ thời gian") {
      const days = daysMap[selectedDate];
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() - days);

      // chỉ lấy phần yyyy-mm-dd trong crawl_at
      const postDate = new Date(post.crawl_at.split(" ")[0]);

      // so sánh trong khoảng thời gian
      dateMatch = postDate.getDate() >= targetDate.getDate();
    };

    return keywordMatch && platformMatch && dateMatch;
  });
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  const totalLikes = useMemo(() => {
      // Đảm bảo posts là mảng và không rỗng
      if (!Array.isArray(filteredPosts) || filteredPosts.length === 0) {
          return 0;
      }
      
      return filteredPosts.reduce((sum, post) => {
          const likes = post.post_reaction || 0; 
          return sum + likes;
      }, 0);
  }, [filteredPosts]);
  const totalComments = useMemo(() => {
      // Đảm bảo posts là mảng và không rỗng
      if (!Array.isArray(filteredPosts) || filteredPosts.length === 0) {
          return 0;
      }
      
      return filteredPosts.reduce((sum, post) => {
          const likes = post.post_comment || 0; 
          return sum + likes;
      }, 0);
  }, [filteredPosts]);
  const totalShares = useMemo(() => {
      // Đảm bảo posts là mảng và không rỗng
      if (!Array.isArray(filteredPosts) || filteredPosts.length === 0) {
          return 0;
      }
      
      return filteredPosts.reduce((sum, post) => {
          const likes = post.post_share || 0; 
          return sum + likes;
      }, 0);
  }, [filteredPosts]);

  const totalViewsByPlatform = filteredPosts.reduce((acc, post) => {
    const { platform_id, post_views } = post;
    acc[platform_id] = (acc[platform_id] || 0) + post_views;
    return acc;
  }, {});  

  const totalAllPlatforms = Object.values(totalViewsByPlatform).reduce(
    (sum, views) => sum + views,
    0
  );

  return (
    <div className="cover">
      <Navbar />
      <div className="dashboard">
        <h2 className="dashboard-title">Trung tâm dữ liệu</h2>

        <div className="filters">
          {/* Bộ lọc Từ khóa */}
          <div className="dropdown">
            {/* input vừa để search vừa hiển thị selected */}
            <input
              className="dropdown-input" 
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
                    setSelectedDate("Hôm nay");
                    setIsDateMenuOpen(false);
                  }}
                >
                  Hôm nay
                </div>
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
            <p className="big-number">{filteredPosts.length.toLocaleString('vi-VN') || "--"}</p>
            <p>
              <Post className="svg" />
              {filteredPosts.length.toLocaleString('vi-VN') || "--"} Bài viết
            </p>
            {/* Giả định total_mentions là một property của posts, nếu posts là array thì phải tính tổng */}
            <p>
              <Comment className="svg" />
              {totalComments.toLocaleString('vi-VN') || "--"} Thảo luận
            </p>
            <small>* Bài viết + thảo luận liên quan đến từ khóa</small>
          </div>

          <div className="card">
            <h3>Tổng tương tác</h3>
            <p className="big-number">
              {(totalComments+totalLikes+totalShares).toLocaleString('vi-VN') || "--"}
            </p>
            <p>
              <Comment className="svg" />
              {totalComments.toLocaleString('vi-VN') || "--"} Tổng thảo luận
            </p>
            <p>
              <Like className="svg" />
              {totalLikes.toLocaleString('vi-VN') || "--"} Lượt thích
            </p>
            <p>
              <Share className="svg" />
              {totalShares.toLocaleString('vi-VN') || "--"} Chia sẻ
            </p>
          </div>

          <div className="card">
            <h3>Tổng lượt xem</h3>
            <p className="big-number">{totalAllPlatforms.toLocaleString('vi-VN') || "--"}</p>
            <p>
              <Tiktok className="svg" style={{ width: "20px", fill: "black" }} />
              {totalViewsByPlatform[2] || "--"}
            </p>
            <p>
              <Youtube
                className="svg"
                style={{ width: "20px", fill: "#FF0000" }}
              />
              {totalViewsByPlatform[1] || "--"}
            </p>
            <p>
              <Facebook
                className="svg"
                style={{ width: "20px", fill: "#1877F2" }}
              />
              {totalViewsByPlatform[3] || "--"}
            </p>
          </div>

          <div className="card">
            <h3>Tổng từ khóa</h3>
            <p className="big-number">{keywords.length || "--"}</p>
            {/* Hiển thị 3 từ khóa phổ biến nhất, giả định filteredPosts.total_keywords.list là mảng các từ khóa */}
            {filteredPosts?.total_keywords?.list?.slice(0, 3).map((kw, i) => (
              <p key={i}>{kw}</p>
            ))}
          </div>

          <div className="card">
            <h3>Tổng dữ liệu</h3>
            <p className="big-number">{(filteredPosts?.length+totalLikes+totalComments+totalShares+totalAllPlatforms).toLocaleString('vi-VN') || "--"}</p>
            <p>{filteredPosts?.length.toLocaleString('vi-VN') || "--"} Mentions</p>
            <p>{(totalLikes+totalComments+totalShares).toLocaleString('vi-VN') || "--"} Tương tác</p>
            <p>{totalAllPlatforms.toLocaleString('vi-VN') || "--"} Lượt xem</p>
          </div>
        </div>

        <div className="table-container">
          <h2 className="table-title" style={{color: "#2e3d76"}}>Bài viết</h2>
          <div className="data-table">
            {currentPosts && currentPosts.length > 0 ? (
              currentPosts.map((post, index) => (
                <div key={post.id || index} className="post">
                  <div className="data-row">
                    {/* Số thứ tự toàn cục */}
                    <div className="data-cell">{startIndex + index + 1}</div>
                    <div className="data-cell">
                      {platformMap[post.platform_id] || <span>?</span>}
                    </div>
                  </div>
                  <div className="data-col">
                    <div className="data-row">
                      <div
                        className="data-cell"
                        style={{
                          flexGrow: "8",
                          maxWidth: "800px",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          padding: "0px",
                        }}
                      >
                        {post.post_name}
                      </div>
                      <div className="right-group">
                        <div className="data-cell source">
                          <a
                            href={post.post_link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {post.post_link}
                          </a>
                        </div>
                        <div className="data-cell meta">{post.author}</div>
                      </div>
                    </div>
                    <div className="data-row keywords">
                      {keywordMap[post.keyword_id] || "?"}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="data-row">
                <div className="error" style={{ width: "100%" }}>
                  Không có dữ liệu
                </div>
              </div>
            )}
          </div>
          {/* Nút điều hướng trang */}
          {filteredPosts.length > postsPerPage && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                ← Trang trước
              </button>
              <span>
                Trang {currentPage} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Trang sau →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Data;
