import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import "../style/Home.css";
import "./Keywords.css";

function Keywords() {
  const KEYWORDS_CHIPS = useMemo(
    () => [
      "bmi",
      "uric acid",
      "Foton",
      "Mitsubishi Fuso",
      "BMW",
      "Mazda",
      "Kia",
      "Peugeot",
      "THADICO",
      "Thiskyhall Café Lounge",
      "Thaco mes",
      "Besoverse Cosmic Cafe",
      "Thaco SCADA",
      "Thaco Trailers",
      "THAGRICO",
      "Cảng Chu Lai",
      "Thaco Industries",
      "Thaco auto",
      "Thiso",
      "Thaco",
      "thilogi",
    ],
    []
  );

  // PAGE1 (STT 1–10)
  const PAGE1 = useMemo(
    () => [
      { key: 156, stt: 1,  keyword: "bugatti",               mention: "205",   createdAt: "15:14:23, 25-08-2025" },
      { key: 127, stt: 2,  keyword: "bmi",                   mention: "285",   createdAt: "10:19:24, 18-08-2025" },
      { key: 126, stt: 3,  keyword: "uric acid",             mention: "1",     createdAt: "10:15:49, 18-08-2025" },
      { key: 81,  stt: 4,  keyword: "Foton",                 mention: "702",   createdAt: "17:07:40, 25-07-2025" },
      { key: 80,  stt: 5,  keyword: "Mitsubishi Fuso",       mention: "254",   createdAt: "17:07:32, 25-07-2025" },
      { key: 79,  stt: 6,  keyword: "BMW",                   mention: "943",   createdAt: "17:07:15, 25-07-2025" },
      { key: 78,  stt: 7,  keyword: "Mazda",                 mention: "2.530", createdAt: "17:07:05, 25-07-2025" },
      { key: 77,  stt: 8,  keyword: "Kia",                   mention: "3.029", createdAt: "17:06:54, 25-07-2025" },
      { key: 76,  stt: 9,  keyword: "Peugeot",               mention: "1.245", createdAt: "17:06:11, 25-07-2025" },
      { key: 42,  stt: 10, keyword: "THADICO",               mention: "157",   createdAt: "10:02:22, 29-05-2025" },
    ],
    []
  );

  // PAGE2 (STT 11–20)
  const PAGE2 = useMemo(
    () => [
      { key: 41, stt: 11, keyword: "Thiskyhall Café Lounge", mention: "129",   createdAt: "10:02:10, 29-05-2025" },
      { key: 40, stt: 12, keyword: "Thaco mes",              mention: "129",   createdAt: "10:02:03, 29-05-2025" },
      { key: 39, stt: 13, keyword: "Besoverse Cosmic Cafe",  mention: "132",   createdAt: "10:01:43, 29-05-2025" },
      { key: 38, stt: 14, keyword: "Thaco SCADA",            mention: "24",    createdAt: "10:01:16, 29-05-2025" },
      { key: 37, stt: 15, keyword: "Thaco Trailers",         mention: "277",   createdAt: "10:01:07, 29-05-2025" },
      { key: 36, stt: 16, keyword: "THAGRICO",               mention: "116",   createdAt: "10:00:48, 29-05-2025" },
      { key: 35, stt: 17, keyword: "Cảng Chu Lai",           mention: "156",   createdAt: "09:23:32, 29-05-2025" },
      { key: 34, stt: 18, keyword: "Thaco Industries",       mention: "229",   createdAt: "09:23:24, 29-05-2025" },
      { key: 33, stt: 19, keyword: "Thaco auto",             mention: "1.207", createdAt: "09:23:12, 29-05-2025" },
      { key: 32, stt: 20, keyword: "Thiso",                  mention: "1.685", createdAt: "09:23:02, 29-05-2025" },
    ],
    []
  );

  // PAGE3 (STT 21–22)
  const PAGE3 = useMemo(
    () => [
      { key: 31, stt: 21, keyword: "Thaco",   mention: "6.935", createdAt: "09:22:52, 29-05-2025" },
      { key: 30, stt: 22, keyword: "thilogi", mention: "189",   createdAt: "09:22:39, 29-05-2025" },
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
          <span
            className="ant-tag ant-tag-success rs-tag css-142vneq"
            style={{ marginInlineEnd: "0px" }}
          >
            <div
              className="ant-flex css-142vneq ant-flex-align-center"
              style={{ gap: "6px" }}
            >
              Đã duyệt
            </div>
          </span>
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
              <div className="btn-add-keyword">
                Thêm từ khoá chính{" "}
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABRSURBVHgB7ZLRCQAgCETPaKA2qtFqklZoI0voNwyK6MMHpx8eh6DAK5g5iXDKCKkizedwCQvSISnzvHHhCbO3xbwQUb62kYr90YdBfsNT8JIOsqkcZzU0ow0AAAAASUVORK5CYII="
                  loading="lazy"
                  alt=""
                />
              </div>
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
                              {renderRows(PAGES[currentPage - 1])}
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