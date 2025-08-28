import React, { useEffect, useState } from "react";

const Werehouse = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/keywords")
      .then((res) => res.json())
      .then((data) => {
        console.log("Dữ liệu từ Flask:", data);
        setStats(data);
      })
      .catch((err) => console.error("Lỗi API:", err));
  }, []);

  return (
    <div>
      <h2>Werehouse Stats</h2>
      {stats.length > 0 ? (
        <ul>
          {stats.map((item, index) => (
            <li key={index}>{JSON.stringify(item)}</li>
          ))}
        </ul>
      ) : (
        <p>Đang tải dữ liệu...</p>
      )}
    </div>
  );
};

export default Werehouse;
