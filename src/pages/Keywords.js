/**
 * Building WEBSITE 'danh-muc-tu-khoa' By REACT AND CSS
 * Cam kết: DOM structure/class/innerText & phân trang đúng phong cách gốc.
 * Backend: Flask (API_URL ở dưới). Phân trang hiển thị động theo số bản ghi.
 */

import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import "../style/Keywords.css";

const API_URL = "http://192.168.31.80:5000/api/keywords";

const PAGE_SIZE = 10;

function Keywords() {
  // ===== State =====
  const [keywords, setKeywords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const formRef = useRef(null);

  // ===== Derived =====
  const totalItems = keywords.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const offset = (currentPage - 1) * PAGE_SIZE;
  const visible = keywords.slice(offset, offset + PAGE_SIZE);

  // ===== Effects =====
  useEffect(() => {
    fetchKeywords();
  }, []);

  // Nếu dữ liệu làm currentPage > totalPages => kéo về trang cuối hợp lệ
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  // ===== API =====
  async function fetchKeywords() {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`GET ${res.status}`);
      const data = await res.json();
      setKeywords(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("GET /keywords failed:", err);
      setKeywords([]);
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    const input = form.elements?.keyword;
    const val = (input?.value || "").trim();
    if (!val) return;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: val }),
      });
      if (!res.ok) throw new Error(`POST ${res.status}`);

      await fetchKeywords();
      setCurrentPage(1);
    } catch (err) {
      console.error("POST /keywords failed:", err);
    } finally {
      if (typeof form.reset === "function") form.reset();
    }
  }

  // ===== Render helpers =====
  const renderMeasureRow = () => (
    <tr
      aria-hidden="true"
      className="ant-table-measure-row"
      style={{ height: "0px", fontSize: "0px" }}
    >
      <td style={{ padding: 0, border: 0, height: 0 }}>
        <div style={{ height: 0, overflow: "hidden" }}>&nbsp;</div>
      </td>
      <td style={{ padding: 0, border: 0, height: 0 }}>
        <div style={{ height: 0, overflow: "hidden" }}>&nbsp;</div>
      </td>
      <td style={{ padding: 0, border: 0, height: 0 }}>
        <div style={{ height: 0, overflow: "hidden" }}>&nbsp;</div>
      </td>
      <td style={{ padding: 0, border: 0, height: 0 }}>
        <div style={{ height: 0, overflow: "hidden" }}>&nbsp;</div>
      </td>
      <td style={{ padding: 0, border: 0, height: 0 }}>
        <div style={{ height: 0, overflow: "hidden" }}>&nbsp;</div>
      </td>
    </tr>
  );

  const renderRows = (rows) =>
    rows.map((k, i) => {
      const stt = offset + i + 1;
      const mention = k.mention != null ? String(k.mention) : "0";
      const created = k.created_at || k.createdAt || "";

      return (
        <tr
          key={k.id ?? `${stt}-${k.keyword}`}
          className="ant-table-row ant-table-row-level-0"
          data-row-key={String(k.id ?? stt)}
        >
          <td className="ant-table-cell">{stt}</td>
          <td className="ant-table-cell">{k.keyword}</td>
          <td className="ant-table-cell">{mention}</td>
          <td className="ant-table-cell">{created}</td>
          <td className="ant-table-cell">
            <span
              className="ant-tag ant-tag-success rs-tag css-142vneq"
              style={{ marginInlineEnd: 0 }}
            >
              <div className="ant-flex css-142vneq ant-flex-align-center" style={{ gap: "6px" }}>
                Đã duyệt
              </div>
            </span>
          </td>
        </tr>
      );
    });

  // ===== Pagination controls =====
  const onClickPage = (page) => (e) => {
    e.preventDefault();
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const onPrev = (e) => {
    e.preventDefault();
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const onNext = (e) => {
    e.preventDefault();
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const renderPrev = () => {
    const disabled = currentPage === 1;
    const cls = `ant-pagination-prev${disabled ? " ant-pagination-disabled" : ""}`;
    return (
      <li
        title="Trang trước"
        className={cls}
        aria-disabled={disabled ? "true" : "false"}
        {...(!disabled ? { tabIndex: 0, onClick: onPrev } : {})}
      >
        {disabled ? (
          <span disabled="">
            <span className="arrow">←</span> Trước
          </span>
        ) : (
          <span>
            <span className="arrow">←</span> Trước
          </span>
        )}
      </li>
    );
  };

  const renderNext = () => {
    const disabled = currentPage === totalPages;
    const cls = `ant-pagination-next${disabled ? " ant-pagination-disabled" : ""}`;
    return (
      <li
        title="Trang sau"
        className={cls}
        aria-disabled={disabled ? "true" : "false"}
        {...(!disabled ? { tabIndex: 0, onClick: onNext } : {})}
      >
        {disabled ? (
          <span disabled="">
            Sau <span className="arrow">→</span>
          </span>
        ) : (
          <span>
            Sau <span className="arrow">→</span>
          </span>
        )}
      </li>
    );
  };

  const renderPagerItem = (page) => {
    const base = `ant-pagination-item ant-pagination-item-${page}`;
    const cls = currentPage === page ? `${base} ant-pagination-item-active` : base;
    return (
      <li
        key={page}
        title={String(page)}
        className={cls}
        tabIndex={0}
        onClick={onClickPage(page)}
      >
        <a rel="nofollow">{page}</a>
      </li>
    );
  };

  
  return (
    <div className="cover">
      <Navbar />
      <div className="dashboard">
        <div className="page-title">
          <h2 className="dashboard-title">Danh mục từ khóa</h2>
        </div>

        {/* Khối thêm từ khóa + Bảng */}
        <div className="wrap-keyword-category ant-flex css-142vneq" style={{ gap: "20px" }}>
          {/* Add keyword */}
          <div className="wrap-add-keyword">
            <div className="ant-spin-nested-loading css-142vneq">
              <div className="ant-spin-container">
                <div className="wrap-keyword"></div>
              </div>
            </div>

            <form className="form-add-keyword" onSubmit={handleAdd} ref={formRef}>
              <input
                type="text"
                name="keyword"
                placeholder="Nhập từ khóa..."
                className="input-keyword"
              />
              <button type="submit" className="btn-submit-keyword">
                Thêm từ khóa chính
              </button>
            </form>
          </div>

          {/* Bảng & phân trang */}
          <div
            className="ant-flex css-142vneq ant-flex-align-stretch ant-flex-vertical"
            style={{ gap: "26px" }}
          >
            <div className="ant-table-wrapper rs-table css-142vneq">
              <div className="ant-spin-nested-loading css-142vneq">
                <div className="ant-spin-container">
                  <div className="ant-table css-142vneq ant-table-ping-right ant-table-scroll-horizontal">
                    <div className="ant-table-container">
                      <div className="ant-table-content" style={{ overflow: "auto hidden" }}>
                        <table
                          style={{
                            width: "100%",
                            minWidth: "100%",
                            tableLayout: "auto",
                          }}
                        >
                          <colgroup>
                            <col style={{ width: "80px" }} />
                            <col />
                            <col style={{ width: "20px" }} />
                            <col style={{ width: "200px" }} />
                            <col style={{ width: "100px" }} />
                          </colgroup>
                          <thead className="ant-table-thead">
                            <tr>
                              <th className="ant-table-cell" scope="col">STT</th>
                              <th className="ant-table-cell" scope="col">Từ khóa</th>
                              <th className="ant-table-cell" scope="col">Tổng lượng mention</th>
                              <th className="ant-table-cell" scope="col">Ngày tạo</th>
                              <th className="ant-table-cell" scope="col">Trạng thái</th>
                            </tr>
                          </thead>
                          <tbody className="ant-table-tbody">
                            {renderMeasureRow()}
                            {renderRows(visible)}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Phân trang */}
            <div className="pagination-container">
              <ul className="ant-pagination ant-pagination-center css-142vneq">
                {renderPrev()}
                {Array.from({ length: totalPages }, (_, i) => renderPagerItem(i + 1))}
                {renderNext()}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Keywords;