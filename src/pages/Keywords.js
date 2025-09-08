/**
 * Building WEBSITE 'danh-muc-tu-khoa' By REACT AND CSS
 * Cam kết: DOM structure/class/innerText & phân trang giống y chang bản gốc bạn đã đưa.
 */
import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import "../style/Keywords.css";

import React, {useEffect } from "react";

function Keywords() {
  const [keywords, setKeywords] = useState([]);
  useEffect(() => {
  loadKeywords();
  }, []);

  async function loadKeywords() {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/keywords");
      const data = await res.json();
      setKeywords(data);
    } catch (err) {
      console.error("Lỗi load keywords:", err);
    }
  }

  const KEYWORDS_CHIPS = useMemo(
    () => [],
    []
  );

  // PAGE1 (STT 1–10)
  const PAGE1 = useMemo(
    () => [
      { },
      { },
    ],
    []
  );

  // PAGE2 (STT 11–20)
  const PAGE2 = useMemo(
    () => [
      { },
      { },
    ],
    []
  );

  // PAGE3 (STT 21–22)
  const PAGE3 = useMemo(
    () => [
      { },
      { },
    ],
    []
  );

  const PAGES = useMemo(() => [PAGE1, PAGE2, PAGE3], [PAGE1, PAGE2, PAGE3]);
  const [currentPage, setCurrentPage] = useState(1); // 1..3

  const renderMeasureRow = () => (
    <tr
      aria-hidden="true"
      className="ant-table-measure-row"
      style={{ height: "0px", fontSize: "0px" }}
    >
      <td style={{ padding: "0px", border: "0px", height: "0px" }}>
        <div style={{ height: "0px", overflow: "hidden" }}>&nbsp;</div>
      </td>
      <td style={{ padding: "0px", border: "0px", height: "0px" }}>
        <div style={{ height: "0px", overflow: "hidden" }}>&nbsp;</div>
      </td>
      <td style={{ padding: "0px", border: "0px", height: "0px" }}>
        <div style={{ height: "0px", overflow: "hidden" }}>&nbsp;</div>
      </td>
      <td style={{ padding: "0px", border: "0px", height: "0px" }}>
        <div style={{ height: "0px", overflow: "hidden" }}>&nbsp;</div>
      </td>
      <td style={{ padding: "0px", border: "0px", height: "0px" }}>
        <div style={{ height: "0px", overflow: "hidden" }}>&nbsp;</div>
      </td>
    </tr>
  );

  const renderRows = (rows) =>
    rows.map((r) => (
      <tr
        key={r.key}
        className="ant-table-row ant-table-row-level-0"
        data-row-key={String(r.key)}
      >
        <td className="ant-table-cell">{r.stt}</td>
        <td className="ant-table-cell">{r.keyword}</td>
        <td className="ant-table-cell">{r.mention}</td>
        <td className="ant-table-cell">{r.createdAt}</td>
        <td className="ant-table-cell">
          {/* <span
            className="ant-tag ant-tag-success rs-tag css-142vneq"
            style={{ marginInlineEnd: "0px" }}
          >
            <div
              className="ant-flex css-142vneq ant-flex-align-center"
              style={{ gap: "6px" }}
            >
              Đã duyệt
            </div>
          </span> */}
        </td>
      </tr>
    ));

  const onClickPage = (page) => (e) => {
    e.preventDefault();
    if (page >= 1 && page <= 3 && page !== currentPage) setCurrentPage(page);
  };

  const onPrev = (e) => {
    e.preventDefault();
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const onNext = (e) => {
    e.preventDefault();
    if (currentPage < 3) setCurrentPage((p) => p + 1);
  };

  const renderPrev = () => {
    const disabled = currentPage === 1;
    const className = `ant-pagination-prev${
      disabled ? " ant-pagination-disabled" : ""
    }`;
    return (
      <li
        title="Trang trước"
        className={className}
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
    const disabled = currentPage === 3;
    const className = `ant-pagination-next${
      disabled ? " ant-pagination-disabled" : ""
    }`;
    return (
      <li
        title="Trang sau"
        className={className}
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
      <div className="inner-cover">
        <div
          className="ant-flex css-142vneq ant-flex-align-stretch ant-flex-vertical"
          style={{ gap: "20px" }}
        >
          <div
            className="page-title ant-flex css-142vneq ant-flex-wrap-wrap ant-flex-align-center ant-flex-justify-space-between"
            style={{ gap: "10px" }}
          >
            <div className="ant-flex css-142vneq" style={{ gap: "12px" }}>
              <div className="title">Danh mục từ khóa</div>
            </div>
          </div>

          <div
            className="wrap-keyword-category ant-flex css-142vneq"
            style={{ gap: "20px" }}
          >
            <div className="wrap-add-keyword">
              <div className="ant-spin-nested-loading css-142vneq">
                <div className="ant-spin-container">
                  <div className="wrap-keyword">
                    {KEYWORDS_CHIPS.map((k) => (
                      <div className="keyword-item" key={k}>
                        {k}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form thêm từ khóa */}
              <form
                className="form-add-keyword"
                onSubmit={async (e) => {   // <-- thêm async
                  e.preventDefault();
                  const input = e.target.elements.keyword.value.trim();
                  if (input) {
                    try {
                      // 🚀 gọi API backend thay vì alert
                      const res = await fetch("http://127.0.0.1:5000/api/keywords", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ keyword: input })
                      });

                      if (res.ok) {
                        // Nếu thêm thành công -> load lại danh sách keywords
                        await loadKeywords();
                      } else {
                        console.error("Lỗi khi thêm từ khóa");
                      }
                    } catch (err) {
                      console.error("Lỗi kết nối API:", err);
                    }

                    e.target.reset();  // reset ô input
                  }
                }}
              >
                <input
                  type="text"
                  name="keyword"
                  placeholder="Nhập từ khóa..."
                  className="input-keyword"
                />
                <button type="submit" className="btn-submit-keyword">
                  Thêm
                </button>
              </form>
            </div>


            <div
              className="ant-flex css-142vneq ant-flex-align-stretch ant-flex-vertical"
              style={{ gap: "26px" }}
            >
              <div className="ant-table-wrapper rs-table css-142vneq">
                <div className="ant-spin-nested-loading css-142vneq">
                  <div className="ant-spin-container">
                    <div className="ant-table css-142vneq ant-table-ping-right ant-table-scroll-horizontal">
                      <div className="ant-table-container">
                        <div
                          className="ant-table-content"
                          style={{ overflow: "auto hidden" }}
                        >
                          <table
                            style={{
                              width: "1000px",
                              minWidth: "100%",
                              tableLayout: "auto",
                            }}
                          >
                            <colgroup>
                              <col style={{ width: "80px" }} />
                              <col />
                              <col style={{ width: "190px" }} />
                              <col style={{ width: "185px" }} />
                              <col style={{ width: "150px" }} />
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
                              {keywords.map((k, index) => (
                                <tr key={k.id} className="ant-table-row ant-table-row-level-0">
                                  <td className="ant-table-cell">{index + 1}</td>
                                  <td className="ant-table-cell">{k.keyword}</td>
                                  <td className="ant-table-cell">0</td> {/* tạm fix, backend chưa có mention */}
                                  <td className="ant-table-cell">{k.created_at}</td>
                                  <td className="ant-table-cell"></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pagination-container">
                <ul className="ant-pagination ant-pagination-center css-142vneq">
                  {renderPrev()}
                  {renderPagerItem(1)}
                  {renderPagerItem(2)}
                  {renderPagerItem(3)}
                  {renderNext()}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Keywords;
