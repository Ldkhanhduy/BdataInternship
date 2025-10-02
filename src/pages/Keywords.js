import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import "../style/Keywords.css";

const API_URL = "http://192.168.1.221:5000/api/keywords";
const POSTS_URL = "http://192.168.1.221:5000/api/posts";
const PAGE_SIZE = 10;

function Keywords() {
  const [keywords, setKeywords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const formRef = useRef(null);

  // === BỔ SUNG: map đếm số mention theo keyword_id ===
  const [mentionMap, setMentionMap] = useState({});
  const nf = new Intl.NumberFormat("vi-VN");

  const totalItems = keywords.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const offset = (currentPage - 1) * PAGE_SIZE;
  const visible = keywords.slice(offset, offset + PAGE_SIZE);

  useEffect(() => { fetchKeywords(); }, []);
  useEffect(() => { if (currentPage > totalPages) setCurrentPage(totalPages); }, [totalPages, currentPage]);

  /* ===== Nav toggle wiring (no HTML change) ===== */
  useEffect(() => {
    const nav = document.querySelector(".nav");
    const toggle = document.querySelector(".menu-toggle");
    if (!nav || !toggle) return;

    const mq = window.matchMedia("(max-width: 600px)");
    const syncInitial = () => { if (mq.matches) nav.classList.remove("open"); };
    syncInitial();

    const onToggle = (e) => { e.stopPropagation(); nav.classList.toggle("open"); };
    const onEsc = (e) => { if (e.key === "Escape") nav.classList.remove("open"); };
    const onOutside = (e) => {
      if (!mq.matches) return;
      if (nav.classList.contains("open") && !nav.contains(e.target) && e.target !== toggle) {
        nav.classList.remove("open");
      }
    };

    toggle.addEventListener("click", onToggle);
    document.addEventListener("keydown", onEsc);
    document.addEventListener("click", onOutside);
    mq.addEventListener?.("change", syncInitial);

    return () => {
      toggle.removeEventListener("click", onToggle);
      document.removeEventListener("keydown", onEsc);
      document.removeEventListener("click", onOutside);
      mq.removeEventListener?.("change", syncInitial);
    };
  }, []);

  // === BỔ SUNG: tải /api/posts và đếm mentions theo keyword_id ===
  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        const res = await fetch(POSTS_URL, { signal: ctrl.signal });
        if (!res.ok) throw new Error(`GET posts ${res.status}`);
        const data = await res.json();
        if (!Array.isArray(data)) return;

        const map = {};
        for (const p of data) {
          const kid = p.keyword_id ?? p.keywordId ?? p.keyword;
          if (kid == null) continue;
          const inc = typeof p.mentions === "number" ? p.mentions : 1;
          map[kid] = (map[kid] || 0) + inc;
        }
        setMentionMap(map);
      } catch (e) {
        // im lặng: nếu API chưa sẵn sàng vẫn fallback về k.mention sẵn có
        // console.warn("posts/mentions not ready", e);
      }
    })();
    return () => ctrl.abort();
  }, []);

  async function fetchKeywords() {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`GET ${res.status}`);
      const data = await res.json();
      setKeywords(Array.isArray(data) ? data : []);
    } catch {
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
    } catch {
      /* noop */
    } finally {
      if (typeof form.reset === "function") form.reset();
    }
  }

  const renderMeasureRow = () => (
    <tr aria-hidden="true" className="ant-table-measure-row" style={{ height: "0px", fontSize: "0px" }}>
      <td style={{ padding: 0, border: 0, height: 0 }}><div style={{ height: 0, overflow: "hidden" }}>&nbsp;</div></td>
      <td style={{ padding: 0, border: 0, height: 0 }}><div style={{ height: 0, overflow: "hidden" }}>&nbsp;</div></td>
      <td style={{ padding: 0, border: 0, height: 0 }}><div style={{ height: 0, overflow: "hidden" }}>&nbsp;</div></td>
      <td style={{ padding: 0, border: 0, height: 0 }}><div style={{ height: 0, overflow: "hidden" }}>&nbsp;</div></td>
      <td style={{ padding: 0, border: 0, height: 0 }}><div style={{ height: 0, overflow: "hidden" }}>&nbsp;</div></td>
    </tr>
  );

  const renderRows = (rows) =>
    rows.map((k, i) => {
      const stt = offset + i + 1;

      // === BỔ SUNG: lấy tổng mention từ map; fallback về k.mention; rồi format theo vi-VN ===
      const rawMention =
        mentionMap[k.id] ??
        mentionMap[k.keyword_id] ??
        k.mention ??
        0;
      const mention = nf.format(Number(rawMention) || 0);

      const created = k.created_at || k.createdAt || "";
      return (
        <tr key={k.id ?? `${stt}-${k.keyword}`} className="ant-table-row ant-table-row-level-0" data-row-key={String(k.id ?? stt)}>
          <td className="ant-table-cell">{stt}</td>
          <td className="ant-table-cell">{k.keyword}</td>
          <td className="ant-table-cell">{mention}</td>
          <td className="ant-table-cell">{created}</td>
          <td className="ant-table-cell">
            <span className="ant-tag ant-tag-success rs-tag css-142vneq" style={{ marginInlineEnd: 0 }}>
              <div className="ant-flex css-142vneq ant-flex-align-center" style={{ gap: "6px" }}>Đã duyệt</div>
            </span>
          </td>
        </tr>
      );
    });

  const onClickPage = (page) => (e) => { e.preventDefault(); if (page >= 1 && page <= totalPages && page !== currentPage) setCurrentPage(page); };
  const onPrev = (e) => { e.preventDefault(); if (currentPage > 1) setCurrentPage((p) => p - 1); };
  const onNext = (e) => { e.preventDefault(); if (currentPage < totalPages) setCurrentPage((p) => p + 1); };

  const renderPrev = () => {
    const disabled = currentPage === 1;
    const cls = `ant-pagination-prev${disabled ? " ant-pagination-disabled" : ""}`;
    return (
      <li title="Trang trước" className={cls} aria-disabled={disabled ? "true" : "false"} {...(!disabled ? { tabIndex: 0, onClick: onPrev } : {})}>
        {disabled ? (<span disabled=""><span className="arrow">←</span> Trước</span>) : (<span><span className="arrow">←</span> Trước</span>)}
      </li>
    );
  };

  const renderNext = () => {
    const disabled = currentPage === totalPages;
    const cls = `ant-pagination-next${disabled ? " ant-pagination-disabled" : ""}`;
    return (
      <li title="Trang sau" className={cls} aria-disabled={disabled ? "true" : "false"} {...(!disabled ? { tabIndex: 0, onClick: onNext } : {})}>
        {disabled ? (<span disabled="">Sau <span className="arrow">→</span></span>) : (<span>Sau <span className="arrow">→</span></span>)}
      </li>
    );
  };

  const renderPagerItem = (page) => {
    const base = `ant-pagination-item ant-pagination-item-${page}`;
    const cls = currentPage === page ? `${base} ant-pagination-item-active` : base;
    return (
      <li key={page} title={String(page)} className={cls} tabIndex={0} onClick={onClickPage(page)}>
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

        <div className="wrap-keyword-category ant-flex css-142vneq" style={{ gap: "20px" }}>
          <div className="wrap-add-keyword">
            <div className="ant-spin-nested-loading css-142vneq">
              <div className="ant-spin-container">
                <div className="wrap-keyword"></div>
              </div>
            </div>

            <form className="form-add-keyword" onSubmit={handleAdd} ref={formRef}>
              <input type="text" name="keyword" placeholder="Nhập từ khóa..." className="input-keyword" />
              <button type="submit" className="btn-submit-keyword">Thêm từ khóa chính</button>
            </form>
          </div>

          <div className="ant-flex css-142vneq ant-flex-align-stretch ant-flex-vertical" style={{ gap: "26px" }}>
            <div className="ant-table-wrapper rs-table css-142vneq">
              <div className="ant-spin-nested-loading css-142vneq">
                <div className="ant-spin-container">
                  <div className="ant-table css-142vneq ant-table-ping-right ant-table-scroll-horizontal">
                    <div className="ant-table-container">
                      <div className="ant-table-content" style={{ overflow: "auto hidden" }}>
                        <table style={{ width: "100%", minWidth: "100%", tableLayout: "auto" }}>
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
