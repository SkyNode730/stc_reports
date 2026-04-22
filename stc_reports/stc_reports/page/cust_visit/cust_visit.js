frappe.pages["cust-visit"].on_page_load = function (wrapper) {
    frappe.ui.make_app_page({
        parent: wrapper,
        title: __("Customer Visit"),
        single_column: true,
    });
    wrapper.page_obj = new CustVisitPage(wrapper);
};

frappe.pages["cust-visit"].on_page_show = function (wrapper) {
    if (wrapper.page_obj) wrapper.page_obj.on_show();
};

// ── Styles ────────────────────────────────────────────────────────────────────
(function injectStyles() {
    if (document.getElementById("cv-page-styles")) return;

    if (!document.getElementById("cv-urdu-font")) {
        const lnk = document.createElement("link");
        lnk.id = "cv-urdu-font"; lnk.rel = "stylesheet";
        lnk.href = "https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@500;700&display=swap";
        document.head.appendChild(lnk);
    }

    const s = document.createElement("style");
    s.id = "cv-page-styles";
    s.textContent = `

/* ── Hide page menu ── */
.page-head .menu-btn-group { display: none !important; }

/* ── Full-width overrides ── */
.page-body, .page-body > .container,
.frappe-app > .container, body > .container {
    max-width: 100% !important;
    width: 100% !important;
    padding-left: 6px !important;
    padding-right: 6px !important;
}
.cv-root {
    padding: 0 0 60px;
    width: 100%;
}

/* ── Filter bar ── */
.cv-filter-bar {
    display: flex; flex-wrap: wrap; align-items: flex-end;
    gap: 12px; padding: 14px 16px;
    background: #f0f4ff;
    border-radius: 12px; margin-bottom: 16px;
    box-shadow: 0 2px 10px rgba(60,90,180,.08);
}
.cv-f-item {
    flex: 1; min-width: 145px; max-width: 200px;
    display: flex; flex-direction: column;
}
.cv-f-item .frappe-control { margin-bottom: 0; flex: 1; }
.cv-f-item .control-label {
    font-size: 10.5px; font-weight: 700; color: #3d5afe;
    text-transform: uppercase; letter-spacing: .5px; margin-bottom: 4px;
    display: block; line-height: 1.3;
}
.cv-f-item input.input-with-feedback,
.cv-f-item select.input-with-feedback {
    font-size: 12.5px !important; height: 34px !important; padding: 4px 10px !important;
    border: 2px solid #a0b4e8 !important; border-radius: 7px !important;
    background: #fff !important; color: #1c2340 !important;
    box-shadow: inset 0 1px 3px rgba(60,90,180,.07) !important;
    transition: border-color .15s !important;
}
.cv-f-item input.input-with-feedback:focus,
.cv-f-item select.input-with-feedback:focus {
    border-color: #3d5afe !important; outline: none !important;
    box-shadow: 0 0 0 3px rgba(61,90,254,.12) !important;
}
.cv-f-btn-wrap {
    display: flex; flex-direction: row; align-items: center;
    gap: 8px; flex-shrink: 0;
    height: 34px;
    margin-bottom: 16px;
}
.cv-apply-btn {
    background: linear-gradient(135deg,#1a3a7c,#3d5afe) !important;
    color: #fff !important; border: none !important;
    height: 34px; padding: 0 20px; font-size: 12.5px; font-weight: 700;
    border-radius: 7px; cursor: pointer; white-space: nowrap;
    box-shadow: 0 2px 6px rgba(61,90,254,.25); line-height: 34px;
}
.cv-apply-btn:hover { opacity: .9; }
.cv-clear-btn {
    background: #fff !important; color: #5568a0 !important;
    border: 2px solid #a0b4e8 !important;
    height: 34px; padding: 0 16px; font-size: 12.5px; font-weight: 600;
    border-radius: 7px; cursor: pointer; white-space: nowrap; line-height: 30px;
}
.cv-clear-btn:hover { border-color: #3d5afe !important; color: #3d5afe !important; }

/* ── Page split: left 85% (stats + table) | right 15% (chart) ── */
.cv-page-split {
    display: flex; align-items: flex-start; gap: 12px;
}
.cv-left-panel { flex: 1; min-width: 0; }
.cv-right-panel {
    flex: 0 0 15%; min-width: 150px;
    position: sticky; top: 60px;
    align-self: flex-start;
}

/* ── Summary row (stat cards only) ── */
.cv-summary-row {
    display: flex; gap: 10px; flex-wrap: wrap;
    margin: 12px 0 14px;
}
.cv-stat {
    flex: 1; min-width: 110px;
    background: #fff; border: 1px solid #e4eaf7; border-radius: 10px;
    padding: 11px 14px;
    box-shadow: 0 2px 8px rgba(60,90,180,.07);
    display: flex; flex-direction: column; align-items: center; gap: 3px;
}
.cv-stat-icon  { font-size: 18px; line-height: 1; }
.cv-stat-label { font-size: 9.5px; font-weight: 600; color: #8898c8; text-transform: uppercase; letter-spacing: .5px; text-align: center; }
.cv-stat-value { font-size: 24px; font-weight: 800; color: #1a3a7c; line-height: 1; }
.cv-stat-value.ok   { color: #1a7a2e; }
.cv-stat-value.warn { color: #9a5f00; }
.cv-stat-value.info { color: #0277bd; }

/* ── Header buttons ── */
.cv-hdr-btn-pdf {
    background: linear-gradient(135deg,#e74c3c,#c0392b) !important;
    color: #fff !important; border: none !important; font-weight: 600; margin-left: 4px;
}
.cv-hdr-btn-excel {
    background: linear-gradient(135deg,#27ae60,#1e8449) !important;
    color: #fff !important; border: none !important; font-weight: 600; margin-left: 4px;
}
.cv-hdr-btn-pdf:hover, .cv-hdr-btn-excel:hover { opacity: .88; color: #fff !important; }

/* ── Info bar ── */
.cv-info-bar {
    display: flex; align-items: center; gap: 8px;
    margin-bottom: 8px; padding: 5px 10px;
    background: #f7f9ff; border: 1px solid #e0e7ff; border-radius: 7px;
    font-size: 11px; font-weight: 600; color: #5568a0;
}
.cv-info-bar .cv-rc { margin-left: auto; color: #8898c8; }

/* ── Loading ── */
.cv-loading-wrap {
    display: flex; align-items: center; justify-content: center;
    gap: 10px; padding: 60px 0; color: #8898c8; font-size: 14px; font-weight: 500;
}
.cv-spinner {
    width: 24px; height: 24px;
    border: 3px solid #e0e7ff; border-top-color: #3d5afe;
    border-radius: 50%; animation: cv-spin .7s linear infinite;
}
@keyframes cv-spin { to { transform: rotate(360deg); } }

/* ── Empty state ── */
.cv-empty-state {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 70px 0; gap: 10px;
}
.cv-empty-icon { font-size: 44px; opacity: .35; }
.cv-empty-text { font-size: 14px; color: #aab0cc; font-weight: 500; }

/* ── Table wrapper ── */
.cv-table-wrap {
    overflow-x: auto;
    border-radius: 10px; border: 1px solid #e4eaf7;
    box-shadow: 0 2px 12px rgba(60,90,180,.06);
}

/* ── Main data table ── */
.cv-table {
    width: 100%; border-collapse: collapse; min-width: 900px;
    table-layout: fixed;
}
/* Column widths — tight on fixed cols, generous on description/location */
.cv-table col.c-rn       { width: 32px; }
.cv-table col.c-date     { width: 72px; }
.cv-table col.c-time     { width: 72px; }
.cv-table col.c-customer { width: 100px; }
.cv-table col.c-ephoto   { width: 58px; }
.cv-table col.c-employee { width: 100px; }
.cv-table col.c-vtype    { width: 72px; }
.cv-table col.c-location { width: 230px; }
.cv-table col.c-desc     { width: 175px; }
.cv-table col.c-proof    { width: 64px; }
/* Truncate overflow in fixed cells */
.cv-table tbody td { overflow: hidden; text-overflow: ellipsis; }
.cv-table tbody td.td-wrap {
    white-space: normal; word-break: break-word; overflow: visible;
}
.cv-table thead tr {
    background: linear-gradient(90deg,#1a3a7c,#2c5abe);
    color: #fff; position: sticky; top: 0; z-index: 2;
}
.cv-table thead th {
    padding: 10px 7px; font-size: 10px; font-weight: 700;
    text-transform: uppercase; letter-spacing: .4px; white-space: nowrap;
    border-right: 1px solid rgba(255,255,255,.1); text-align: center;
}
.cv-table thead th:last-child { border-right: none; }
.cv-table thead th.th-left { text-align: left; padding-left: 10px; }
.cv-table tbody tr { border-bottom: 1px solid #edf0f9; }
.cv-table tbody tr:hover { background: #f4f7ff; }
.cv-table tbody tr.alt { background: #fafbff; }
.cv-table tbody tr.alt:hover { background: #eef2ff; }
.cv-table tbody td {
    padding: 5px 7px; vertical-align: middle; text-align: center;
    font-size: 12px; color: #2c3354;
}
.cv-table tbody td.td-left { text-align: left; padding-left: 10px; }

/* ── Row number ── */
.cv-rn { color: #b0b8d8; font-size: 10px; }

/* ── Date / Time ── */
.cv-date { font-weight: 700; color: #1a3a7c; font-size: 11.5px; white-space: nowrap; }
.cv-time {
    display: inline-flex; align-items: center; gap: 4px;
    background: #e6f7ee; color: #1a7a2e; border: 1px solid #90d4aa;
    border-radius: 20px; padding: 3px 10px; font-size: 11px; font-weight: 700; white-space: nowrap;
}
.cv-th-sortable { cursor: pointer; user-select: none; white-space: nowrap; }
.cv-th-sortable:hover { background: rgba(255,255,255,.15); }
.cv-sort-active { font-size: 9px; margin-left: 3px; opacity: 1; }
.cv-sort-idle   { font-size: 9px; margin-left: 3px; opacity: .35; }

/* ── Customer / Employee ID link ── */
.cv-custid, .cv-empid {
    font-weight: 700; color: #3d5afe; font-size: 11px;
    text-decoration: none; display: inline-block;
}
.cv-custid:hover, .cv-empid:hover { color: #1a3a7c; text-decoration: underline; }

/* ── Visit doc link ── */
.cv-visit-link {
    display: block; font-size: 9px; color: #7090d8; font-weight: 600;
    text-decoration: none; margin-bottom: 3px; white-space: nowrap;
}
.cv-visit-link:hover { text-decoration: underline; color: #3d5afe; }

/* ── Avatar ── */
.cv-avatar-wrap { display: flex; justify-content: center; align-items: center; }
.cv-avatar {
    width: 52px; height: 52px; border-radius: 50%; object-fit: cover;
    border: 2.5px solid #7a98dc; box-shadow: 0 2px 6px rgba(60,90,180,.15); background: #eef2ff;
    cursor: pointer; transition: transform .15s;
}
.cv-avatar:hover { transform: scale(1.08); box-shadow: 0 4px 12px rgba(60,90,180,.3); }
.cv-avatar-ph {
    width: 52px; height: 52px; border-radius: 50%;
    background: linear-gradient(135deg,#3d5afe,#1a3a7c);
    border: 2px solid #1a3a7c;
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; color: #fff; font-weight: 800; user-select: none;
    letter-spacing: 1px;
}

/* ── Name (Urdu-capable) ── */
.cv-cname, .cv-ename {
    font-weight: 700; font-size: 13px; color: #1c2340;
    font-family: 'Noto Nastaliq Urdu','Urdu Typesetting','Scheherazade New',Arial,sans-serif;
    line-height: 1.5;
}

/* ── Visit type badge ── */
.cv-vtype {
    display: inline-block; background: #eef2ff; color: #3d5afe;
    border-radius: 4px; padding: 2px 8px; font-size: 10.5px; font-weight: 600;
}

/* ── Visit proof image ── */
.cv-proof-wrap { display: flex; justify-content: center; align-items: center; }
.cv-proof {
    width: 58px; height: 58px; object-fit: cover; border-radius: 6px;
    border: 1.5px solid #d0d8f0; box-shadow: 0 1px 4px rgba(0,0,0,.1);
    cursor: pointer; transition: transform .15s;
}
.cv-proof:hover { transform: scale(1.06); }
.cv-proof-ph {
    width: 58px; height: 58px; border-radius: 6px;
    background: #f5f7ff; border: 1.5px dashed #cdd4ee;
    display: flex; align-items: center; justify-content: center;
    color: #c0c8e8; font-size: 18px;
}

/* ── Location ── */
.cv-loc-link {
    display: inline-flex; align-items: center; gap: 3px;
    color: #3d5afe; font-size: 11px; text-decoration: none; font-weight: 600;
}
.cv-loc-link:hover { text-decoration: underline; }
.cv-loc-text { font-size: 10.5px; color: #5568a0; word-break: break-word; }

/* ── Lightbox ── */
.cv-lightbox-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,.82);
    z-index: 9999; display: flex; align-items: center; justify-content: center;
    cursor: pointer;
}
.cv-lightbox-img {
    max-width: 88vw; max-height: 88vh;
    border-radius: 8px; box-shadow: 0 8px 40px rgba(0,0,0,.5);
    cursor: default;
}

/* ── Right-panel bar chart ── */
.cv-chart-section {
    background: #fff; border: 1px solid #e4eaf7; border-radius: 10px;
    padding: 12px 8px 8px;
    box-shadow: 0 2px 8px rgba(60,90,180,.06);
    display: flex; flex-direction: column;
}
.cv-chart-title {
    font-size: 11px; font-weight: 700; color: #1a3a7c;
    margin-bottom: 10px; text-align: center; flex-shrink: 0;
}
.cv-chart-scroll {
    overflow-x: auto; overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin; scrollbar-color: #a0b4e8 #f0f4ff;
}
.cv-chart-scroll::-webkit-scrollbar { height: 5px; }
.cv-chart-scroll::-webkit-scrollbar-track { background: #f0f4ff; border-radius: 3px; }
.cv-chart-scroll::-webkit-scrollbar-thumb { background: #a0b4e8; border-radius: 3px; }
.cv-chart-inner {
    display: inline-flex; flex-direction: column; min-width: max-content; padding: 0 2px;
}
/* bars row — fixed height, bars grow from bottom */
.cv-bars-row {
    display: flex; align-items: flex-end; gap: 5px;
    height: 150px; border-bottom: 2px solid #e4eaf7;
}
.cv-bar-col {
    width: 22px; display: flex; flex-direction: column;
    align-items: center; justify-content: flex-end;
}
.cv-bar-val {
    font-size: 11px; font-weight: 800; color: #3d2800; margin-bottom: 3px;
    line-height: 1;
}
.cv-bar-body {
    width: 14px; background: linear-gradient(180deg,#ffe066,#c8940a);
    border-radius: 3px 3px 0 0; min-height: 4px;
    transition: background .15s;
    box-shadow: 0 2px 6px rgba(200,148,10,.35);
}
.cv-bar-body:hover { background: linear-gradient(180deg,#ffd700,#b8860b); }
/* labels row — vertical text below baseline */
.cv-labels-row {
    display: flex; gap: 5px; height: 90px; align-items: flex-start; padding-top: 4px;
}
.cv-bar-lbl-cell {
    width: 22px; display: flex; justify-content: center; overflow: visible;
}
.cv-bar-lbl {
    font-size: 11px; font-weight: 700; color: #3d2800; white-space: nowrap;
    writing-mode: vertical-rl; transform: rotate(180deg);
    text-align: left; line-height: 1;
}
/* ── Bar-width slider control ── */
.cv-chart-ctrl {
    display: flex; align-items: center; gap: 5px; margin-bottom: 8px; flex-shrink: 0;
}
.cv-chart-ctrl-lbl {
    font-size: 8px; color: #8898c8; white-space: nowrap; flex-shrink: 0;
}
.cv-bar-slider {
    flex: 1; height: 3px; cursor: pointer; accent-color: #3d5afe;
    min-width: 0;
}
.cv-chart-ctrl-val {
    font-size: 8px; font-weight: 700; color: #1a3a7c; width: 22px;
    text-align: right; flex-shrink: 0;
}

/* ── Print ── */
@media print {
    .cv-info-bar { display: none !important; }
    .cv-page-split { display: flex !important; }
    .cv-right-panel { flex: 0 0 15%; }
    .cv-chart-section { box-shadow: none; border-color: #ccc; }
    .cv-table { font-size: 9px; }
    .cv-table thead th { font-size: 8px; }
    .cv-table tbody td { padding: 3px 4px; }
    .cv-avatar, .cv-proof { width: 38px; height: 38px; }
    .cv-table-wrap { border: none; box-shadow: none; }
    @page { size: A4 landscape; margin: 8mm; }
}
    `;
    document.head.appendChild(s);
})();

// ── Page class ────────────────────────────────────────────────────────────────
class CustVisitPage {
    constructor(wrapper) {
        this.wrapper     = wrapper;
        this.page        = wrapper.page;
        this.data        = [];
        this._sort_field = "date";
        this._sort_dir   = "desc";
        this._cache      = null;
        this._init_mode  = false;
        this._expand_width();
        this._setup_actions();
        this._render_skeleton();
        this._setup_filters();
        this.refresh();
    }

    on_show() {
        this._expand_width();
        if (this.data.length) {
            this._render_summary();
            this._render_chart();
            this._render_table();
        }
    }

    // ── Full-width ────────────────────────────────────────────────────────────
    _expand_width() {
        $(this.wrapper).parents().each(function () {
            const el = $(this);
            if (el.is("body,html")) return false;
            const tag = this.tagName.toLowerCase();
            if (tag === "div" || tag === "section" || tag === "main") {
                el.css({ "max-width": "100%", "width": "100%",
                         "padding-left": "6px", "padding-right": "6px" });
            }
        });
        $(this.wrapper).css({ "max-width": "100%", "width": "100%" });
    }

    // ── Filters ───────────────────────────────────────────────────────────────
    _setup_filters() {
        this._init_mode = true;

        const mk = (id, df) => frappe.ui.form.make_control({
            parent: document.getElementById(id),
            df,
            render_input: true,
        });

        this.f_from = mk("cv-f-from", {
            fieldtype: "Date", fieldname: "from_date", label: __("From Date"),
            change: () => this.refresh(),
        });
        this.f_from.set_value(frappe.datetime.add_days(frappe.datetime.get_today(), -1));

        this.f_to = mk("cv-f-to", {
            fieldtype: "Date", fieldname: "to_date", label: __("To Date"),
            change: () => this.refresh(),
        });
        this.f_to.set_value(frappe.datetime.get_today());

        this.f_customer = mk("cv-f-customer", {
            fieldtype: "Link", fieldname: "customer", label: __("Customer"),
            options: "Customer", change: () => this.refresh(),
        });

        this.f_employee = mk("cv-f-employee", {
            fieldtype: "Link", fieldname: "employee", label: __("Employee"),
            options: "Employee", change: () => this.refresh(),
        });

        this.f_visit_type = mk("cv-f-vtype", {
            fieldtype: "Data", fieldname: "visit_type", label: __("Visit Type"),
            change: () => this.refresh(),
        });

        this._init_mode = false;

        document.getElementById("cv-apply-btn").addEventListener("click", () => this.refresh());
        document.getElementById("cv-clear-btn").addEventListener("click", () => this._clear_filters());
    }

    _clear_filters() {
        this.f_from.set_value(frappe.datetime.add_days(frappe.datetime.get_today(), -1));
        this.f_to.set_value(frappe.datetime.get_today());
        this.f_customer.set_value("");
        this.f_employee.set_value("");
        this.f_visit_type.set_value("");
        this.refresh();
    }

    // ── Actions ───────────────────────────────────────────────────────────────
    _setup_actions() {
        this.page.set_primary_action(__("Refresh"), () => this.refresh(), "refresh");

        const pdfBtn = this.page.add_button(__("PDF"), () => this._export_pdf());
        $(pdfBtn).addClass("cv-hdr-btn-pdf").html(
            `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="margin-right:4px;vertical-align:-1px"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>PDF`
        );
        const xlsBtn = this.page.add_button(__("Excel"), () => this._export_excel());
        $(xlsBtn).addClass("cv-hdr-btn-excel").html(
            `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="margin-right:4px;vertical-align:-1px"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Excel`
        );
    }

    _render_skeleton() {
        $(this.page.main).html(`
            <div class="cv-root">
                <div class="cv-filter-bar" id="cv-filter-bar">
                    <div class="cv-f-item" id="cv-f-from"></div>
                    <div class="cv-f-item" id="cv-f-to"></div>
                    <div class="cv-f-item" id="cv-f-customer"></div>
                    <div class="cv-f-item" id="cv-f-employee"></div>
                    <div class="cv-f-item" id="cv-f-vtype"></div>
                    <div class="cv-f-btn-wrap">
                        <button class="btn cv-apply-btn" id="cv-apply-btn">&#8635; Apply</button>
                        <button class="btn cv-clear-btn" id="cv-clear-btn">&times; Clear</button>
                    </div>
                </div>
                <div class="cv-page-split">
                    <div class="cv-left-panel">
                        <div class="cv-summary-row" id="cv-summary-row" style="display:none;"></div>
                        <div id="cv-body">
                            <div class="cv-empty-state">
                                <div class="cv-empty-icon">&#128205;</div>
                                <div class="cv-empty-text">Select filters and click Apply to load data</div>
                            </div>
                        </div>
                    </div>
                    <div class="cv-right-panel" id="cv-right-panel"></div>
                </div>
            </div>
        `);
    }

    _get_filters() {
        return {
            from_date:  this.f_from.get_value(),
            to_date:    this.f_to.get_value(),
            customer:   this.f_customer.get_value(),
            employee:   this.f_employee.get_value(),
            visit_type: this.f_visit_type.get_value(),
        };
    }

    // ── Refresh ───────────────────────────────────────────────────────────────
    refresh() {
        if (this._init_mode) return;

        this._show_loading();
        const filters  = this._get_filters();
        const cacheKey = JSON.stringify(filters);

        if (this._cache && this._cache.key === cacheKey &&
                Date.now() - this._cache.ts < 30000) {
            this.data = this._cache.data;
            this._render_summary();
            this._render_chart();
            this._render_table();
            return;
        }

        frappe.call({
            method: "stc_reports.stc_reports.page.cust_visit.cust_visit.get_visit_data",
            args: { filters },
            callback: r => {
                this.data   = r.message || [];
                this._cache = { key: cacheKey, data: this.data, ts: Date.now() };
                this._render_summary();
                this._render_chart();
                this._render_table();
            },
            error: () => {
                this.data = [];
                this._render_summary();
                this._render_chart();
                this._render_table();
            },
        });
    }

    _show_loading() {
        $("#cv-body").html(`
            <div class="cv-loading-wrap">
                <div class="cv-spinner"></div>
                <span>Loading data&hellip;</span>
            </div>`);
        $("#cv-right-panel").html("");
        $("#cv-summary-row").hide();
    }

    // ── Summary cards ─────────────────────────────────────────────────────────
    _render_summary() {
        const d = this.data;
        const uniqueCustomers = new Set(d.map(r => r.customer_name).filter(Boolean)).size;
        const uniqueEmployees = new Set(d.map(r => r.employee_id).filter(Boolean)).size;

        const typeCounts = {};
        d.forEach(r => {
            const t = r.visit_type || "—";
            typeCounts[t] = (typeCounts[t] || 0) + 1;
        });
        const topType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0];

        $("#cv-summary-row").html(`
            <div class="cv-stat">
                <span class="cv-stat-icon">&#128205;</span>
                <span class="cv-stat-label">Total Visits</span>
                <span class="cv-stat-value">${d.length}</span>
            </div>
            <div class="cv-stat">
                <span class="cv-stat-icon">&#128100;</span>
                <span class="cv-stat-label">Unique Customers</span>
                <span class="cv-stat-value ok">${uniqueCustomers}</span>
            </div>
            <div class="cv-stat">
                <span class="cv-stat-icon">&#128198;</span>
                <span class="cv-stat-label">Unique Employees</span>
                <span class="cv-stat-value info">${uniqueEmployees}</span>
            </div>
            <div class="cv-stat">
                <span class="cv-stat-icon">&#127981;</span>
                <span class="cv-stat-label">Top Visit Type</span>
                <span class="cv-stat-value" style="font-size:14px;padding-top:3px;">${topType ? this._esc(topType[0]) + " (" + topType[1] + ")" : "—"}</span>
            </div>
        `).show();
    }

    // ── Chart ─────────────────────────────────────────────────────────────────
    _render_chart() {
        const d = this.data;
        if (!d.length) { $("#cv-right-panel").html(""); return; }

        const dateCounts = this._date_counts();
        const dates      = Object.keys(dateCounts).sort();
        const maxCount   = Math.max(...dates.map(dt => dateCounts[dt]), 1);
        const bw         = this._bar_width || 22;
        const BAR_MAX_PX = 130; // usable bar height in px within the 150px rows-row

        const barCols = dates.map(dt => {
            const cnt = dateCounts[dt];
            const h   = Math.max((cnt / maxCount) * BAR_MAX_PX, 4).toFixed(1);
            return `<div class="cv-bar-col" style="width:${bw}px;" title="${this._fmt_date(dt)}: ${cnt} visit${cnt !== 1 ? "s" : ""}">
                <span class="cv-bar-val">${cnt}</span>
                <div class="cv-bar-body" style="height:${h}px;width:${Math.max(bw - 6, 4)}px;"></div>
            </div>`;
        }).join("");

        const lblCols = dates.map(dt =>
            `<div class="cv-bar-lbl-cell" style="width:${bw}px;">
                <span class="cv-bar-lbl">${this._fmt_date(dt)}</span>
            </div>`
        ).join("");

        $("#cv-right-panel").html(`
            <div class="cv-chart-section">
                <div class="cv-chart-title">&#128200; Visits by Date</div>
                <div class="cv-chart-ctrl">
                    <span class="cv-chart-ctrl-lbl">&#9632; Width</span>
                    <input type="range" class="cv-bar-slider" id="cv-bar-slider"
                        min="12" max="52" step="2" value="${bw}">
                    <span class="cv-chart-ctrl-val" id="cv-bar-slider-val">${bw}px</span>
                </div>
                <div class="cv-chart-scroll">
                    <div class="cv-chart-inner">
                        <div class="cv-bars-row">${barCols}</div>
                        <div class="cv-labels-row">${lblCols}</div>
                    </div>
                </div>
            </div>
        `);

        // Wire slider — updates bar/label widths live without re-fetching data
        $("#cv-bar-slider").on("input", e => {
            const w  = parseInt(e.target.value);
            const bw = Math.max(w - 6, 4);
            this._bar_width = w;
            $("#cv-bar-slider-val").text(w + "px");
            $(".cv-bar-col, .cv-bar-lbl-cell").css("width", w + "px");
            $(".cv-bar-body").css("width", bw + "px");
        });
    }

    // ── Table ─────────────────────────────────────────────────────────────────
    _sort_data() {
        const dir   = this._sort_dir === "asc" ? 1 : -1;
        const field = this._sort_field;
        this.data.sort((a, b) => {
            const av = (a[field] || "").toString().toLowerCase();
            const bv = (b[field] || "").toString().toLowerCase();
            if (av < bv) return -1 * dir;
            if (av > bv) return  1 * dir;
            return 0;
        });
    }

    _th_arrow(field) {
        if (this._sort_field !== field) return `<span class="cv-sort-idle">&#8645;</span>`;
        return this._sort_dir === "asc"
            ? `<span class="cv-sort-active">&#9650;</span>`
            : `<span class="cv-sort-active">&#9660;</span>`;
    }

    _on_th_click(field) {
        if (this._sort_field === field) {
            this._sort_dir = this._sort_dir === "asc" ? "desc" : "asc";
        } else {
            this._sort_field = field;
            this._sort_dir   = "asc";
        }
        this._render_table();
    }

    _render_table() {
        if (!this.data.length) {
            $("#cv-body").html(`
                <div class="cv-empty-state">
                    <div class="cv-empty-icon">&#128269;</div>
                    <div class="cv-empty-text">No visit records found for the selected filters</div>
                </div>`);
            return;
        }

        this._sort_data();
        const filters = this._get_filters();
        const rows    = this.data.map((r, i) => this._row_html(r, i)).join("");

        $("#cv-body").html(`
            <div class="cv-info-bar">
                <span>&#128205; Customer Visit Records</span>
                <span class="cv-rc">${this.data.length} record(s) &nbsp;|&nbsp; ${this._fmt_date(filters.from_date)} &rarr; ${this._fmt_date(filters.to_date)}</span>
            </div>
            <div class="cv-table-wrap">
                <table class="cv-table">
                    <colgroup>
                        <col class="c-rn"><col class="c-date"><col class="c-time">
                        <col class="c-customer"><col class="c-ephoto"><col class="c-employee">
                        <col class="c-vtype"><col class="c-location"><col class="c-desc">
                        <col class="c-proof">
                    </colgroup>
                    <thead><tr>
                        <th>#</th>
                        <th class="cv-th-sortable" id="cv-th-date">Date ${this._th_arrow("date")}</th>
                        <th class="cv-th-sortable" id="cv-th-time">Time ${this._th_arrow("time")}</th>
                        <th class="th-left cv-th-sortable" id="cv-th-customer_name">Customer ${this._th_arrow("customer_name")}</th>
                        <th>Emp. Photo</th>
                        <th class="th-left cv-th-sortable" id="cv-th-employee_name">Employee ${this._th_arrow("employee_name")}</th>
                        <th class="cv-th-sortable" id="cv-th-visit_type">Visit Type ${this._th_arrow("visit_type")}</th>
                        <th class="th-left">Location</th>
                        <th class="th-left">Description</th>
                        <th>Visit Proof</th>
                    </tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        `);

        $("#cv-th-date").off("click.cv").on("click.cv",          () => this._on_th_click("date"));
        $("#cv-th-time").off("click.cv").on("click.cv",          () => this._on_th_click("time"));
        $("#cv-th-customer_name").off("click.cv").on("click.cv", () => this._on_th_click("customer_name"));
        $("#cv-th-employee_name").off("click.cv").on("click.cv", () => this._on_th_click("employee_name"));
        $("#cv-th-visit_type").off("click.cv").on("click.cv",    () => this._on_th_click("visit_type"));

        $(document).off("click.cv-lightbox").on("click.cv-lightbox", ".cv-proof, .cv-avatar", function () {
            const src = $(this).attr("src");
            if (!src) return;
            const ov = $(`<div class="cv-lightbox-overlay">
                <img class="cv-lightbox-img" src="${src}" />
            </div>`);
            ov.on("click", function (e) {
                if (!$(e.target).hasClass("cv-lightbox-img")) ov.remove();
            });
            $("body").append(ov);
        });
    }

    _row_html(r, i) {
        const alt = i % 2 === 1 ? " alt" : "";

        const empInitials = ((r.employee_name || "?").split(" ")
            .map(w => w[0]).slice(0, 2).join("")).toUpperCase();

        const empPhoto = this._img_or_ph(r.employee_photo, "cv-avatar", empInitials, true);
        const proof    = this._img_or_ph(r.visit_proof, "cv-proof", "&#128247;", false);

        const visitLink = r.visit_id
            ? `<a class="cv-visit-link" href="/app/visit/${this._esc(r.visit_id)}" target="_blank" rel="noopener">${this._esc(r.visit_id)}</a>`
            : "";

        const timeCell = r.time
            ? `<span class="cv-time">&#128336; ${r.time}</span>`
            : `<span style="color:#ccc">—</span>`;

        const vtypeCell = r.visit_type
            ? `<span class="cv-vtype">${this._esc(r.visit_type)}</span>`
            : `<span style="color:#ccc">—</span>`;

        const custDisplay = r.customer_display_name || r.customer_name || "—";
        const custLink    = r.customer_name
            ? `<a class="cv-custid" href="/app/customer/${this._esc(r.customer_name)}" target="_blank" rel="noopener">${this._esc(custDisplay)}</a>`
            : `<span>—</span>`;

        const empDisplay = r.employee_name || r.custom_employee_name || "—";
        const empLink    = r.employee_id
            ? `<a class="cv-empid" href="/app/employee/${this._esc(r.employee_id)}" target="_blank" rel="noopener">${this._esc(empDisplay)}</a>`
            : `<span>${this._esc(empDisplay)}</span>`;

        const descCell = r.description
            ? `<span style="font-size:11px;color:#2c3354;">${this._esc(r.description)}</span>`
            : `<span style="color:#ccc">—</span>`;

        return `<tr class="${alt}">
            <td><span class="cv-rn">${i + 1}</span></td>
            <td><span class="cv-date">${this._fmt_date(r.date)}</span>${visitLink}</td>
            <td>${timeCell}</td>
            <td class="td-left"><span class="cv-cname">${custLink}</span></td>
            <td><div class="cv-avatar-wrap">${empPhoto}</div></td>
            <td class="td-left"><span class="cv-ename">${empLink}</span></td>
            <td>${vtypeCell}</td>
            <td class="td-left td-wrap">${this._loc_html(r.custom_log_location)}</td>
            <td class="td-left td-wrap">${descCell}</td>
            <td><div class="cv-proof-wrap">${proof}</div></td>
        </tr>`;
    }

    // ── Helpers ───────────────────────────────────────────────────────────────
    _img_or_ph(src, imgClass, fallbackText, isAvatar) {
        const ph = isAvatar
            ? `<div class="cv-avatar-ph">${fallbackText}</div>`
            : `<div class="cv-proof-ph">${fallbackText}</div>`;
        if (!src) return ph;
        const title  = isAvatar ? "" : ` title="Click to enlarge"`;
        const phAttr = ph.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/"/g, "&quot;");
        return `<img class="${this._esc(imgClass)}" src="${this._esc(src)}"${title} onerror="this.outerHTML='${phAttr}'">`;
    }

    _loc_html(loc) {
        if (!loc) return `<span style="color:#ccc">—</span>`;
        if (loc.startsWith("http"))
            return `<a class="cv-loc-link" href="${this._esc(loc)}" target="_blank" rel="noopener">&#128205; Map</a>`;
        return `<span class="cv-loc-text">${this._esc(loc)}</span>`;
    }

    _esc(str) {
        if (!str) return "";
        return String(str)
            .replace(/&/g, "&amp;").replace(/</g, "&lt;")
            .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }

    _fmt_date(d) {
        if (!d) return "—";
        const p = String(d).split("-");
        return p.length === 3 ? `${p[2]}-${p[1]}-${p[0]}` : String(d);
    }

    // ── Shared: build date→count map from current data ────────────────────────
    _date_counts() {
        const map = {};
        this.data.forEach(r => {
            const dt = r.date || "unknown";
            map[dt] = (map[dt] || 0) + 1;
        });
        return map;
    }

    // ── PDF Export ────────────────────────────────────────────────────────────
    _export_pdf() {
        if (!this.data.length) {
            frappe.msgprint(__("No data to export.")); return;
        }
        const filters  = this._get_filters();
        const d        = this.data;
        const company  = (frappe.boot.sysdefaults && frappe.boot.sysdefaults.company) || "Company";
        const uniqueC  = new Set(d.map(r => r.customer_name).filter(Boolean)).size;
        const uniqueE  = new Set(d.map(r => r.employee_id).filter(Boolean)).size;

        const badges = [
            filters.from_date  ? `<span class="b">From: ${this._fmt_date(filters.from_date)}</span>` : "",
            filters.to_date    ? `<span class="b">To: ${this._fmt_date(filters.to_date)}</span>` : "",
            filters.customer   ? `<span class="b">${filters.customer}</span>` : "",
            filters.employee   ? `<span class="b">${filters.employee}</span>` : "",
            filters.visit_type ? `<span class="b">Type: ${filters.visit_type}</span>` : "",
        ].filter(Boolean).join(" ");

        // ── Build bar chart for PDF ──
        const dateCounts = this._date_counts();
        const chartDates = Object.keys(dateCounts).sort();
        const maxCnt     = Math.max(...chartDates.map(dt => dateCounts[dt]), 1);

        const pdfBars = chartDates.map(dt => {
            const cnt = dateCounts[dt];
            const h   = Math.max((cnt / maxCnt) * 80, 3).toFixed(1);
            return `<div style="display:flex;flex-direction:column;align-items:center;justify-content:flex-end;flex:1;min-width:0;">
                <span style="font-size:6.5px;font-weight:800;color:#1a3a7c;margin-bottom:1px;line-height:1;">${cnt}</span>
                <div style="width:10px;height:${h}px;background:linear-gradient(180deg,#5c7fff,#1a3a7c);border-radius:2px 2px 0 0;min-height:3px;"></div>
            </div>`;
        }).join("");

        const pdfLabels = chartDates.map(dt =>
            `<div style="flex:1;min-width:0;display:flex;justify-content:center;">
                <span style="font-size:6.5px;font-weight:700;color:#1a3a7c;white-space:nowrap;writing-mode:vertical-rl;transform:rotate(180deg);text-align:left;line-height:1;">${this._fmt_date(dt)}</span>
            </div>`
        ).join("");

        const pdfChart = chartDates.length ? `
<div style="background:#fff;border:1px solid #e4eaf7;border-radius:6px;padding:8px 8px 6px;margin-bottom:8px;-webkit-print-color-adjust:exact;print-color-adjust:exact;">
  <div style="font-size:10px;font-weight:700;color:#1a3a7c;margin-bottom:8px;text-align:center;">&#128200; Visits by Date</div>
  <div style="display:flex;align-items:flex-end;gap:3px;height:80px;border-bottom:2px solid #e4eaf7;padding:0 2px;">${pdfBars}</div>
  <div style="display:flex;gap:3px;height:52px;align-items:flex-start;padding:3px 2px 0;">${pdfLabels}</div>
</div>` : "";

        const visitRows = d.map((r, i) => {
            const alt = i % 2 === 1 ? ' class="alt"' : "";
            const empPhoto = r.employee_photo
                ? `<img style="width:40px;height:40px;border-radius:50%;object-fit:cover;border:2px solid #7a98dc;" src="${r.employee_photo}">`
                : `<div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#3d5afe,#1a3a7c);border:2px solid #1a3a7c;display:flex;align-items:center;justify-content:center;font-weight:800;color:#fff;font-size:13px;margin:auto;">${((r.employee_name||"?")[0]).toUpperCase()}</div>`;
            const proofImg = r.visit_proof
                ? `<img style="width:44px;height:44px;border-radius:4px;object-fit:cover;" src="${r.visit_proof}">` : "—";
            const loc = r.custom_log_location
                ? (r.custom_log_location.startsWith("http")
                    ? `<a href="${r.custom_log_location}" style="color:#3d5afe;font-size:8px;">Map</a>`
                    : `<span style="font-size:8px;">${r.custom_log_location}</span>`)
                : "—";
            return `<tr${alt}>
                <td style="color:#a0a8c8;font-size:9px;">${i+1}</td>
                <td style="font-weight:700;color:#1a3a7c;font-size:9.5px;white-space:nowrap;">${this._fmt_date(r.date)}</td>
                <td style="font-size:9px;color:#1a7a2e;">${r.time || "—"}</td>
                <td style="font-weight:700;font-size:10.5px;text-align:left;padding-left:5px;">${r.customer_display_name||r.customer_name||"—"}</td>
                <td style="text-align:center;">${empPhoto}</td>
                <td style="font-weight:700;font-size:10.5px;text-align:left;">${r.employee_name||r.custom_employee_name||"—"}</td>
                <td style="text-align:center;"><span style="background:#eef2ff;color:#3d5afe;border-radius:3px;padding:1px 6px;font-size:8.5px;font-weight:600;">${r.visit_type||"—"}</span></td>
                <td style="text-align:left;font-size:8px;">${loc}</td>
                <td style="text-align:left;font-size:8px;color:#2c3354;">${r.description||"—"}</td>
                <td style="text-align:center;">${proofImg}</td>
            </tr>`;
        }).join("");

        const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<title>Customer Visit — ${company}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Segoe UI',Arial,sans-serif;font-size:10px;color:#1c2340;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
@page{size:A4 landscape;margin:7mm;}
.hdr{border-bottom:3px solid #1a3a7c;padding-bottom:7px;margin-bottom:8px;overflow:hidden;}
.hl{display:inline-block;width:54%;vertical-align:middle;}
.hr2{display:inline-block;width:45%;vertical-align:middle;text-align:right;}
.co{font-size:16px;font-weight:800;color:#1a3a7c;}.cs{font-size:9px;color:#6678a8;}
.rt{font-size:13px;font-weight:700;color:#1a3a7c;margin-bottom:4px;}
.b{display:inline-block;background:#eef2ff;color:#1a3a7c;border:1px solid #c0cdf5;border-radius:10px;padding:2px 7px;font-size:7.5px;font-weight:700;margin:1px;}
.sc{width:100%;border-collapse:separate;border-spacing:5px 0;margin-bottom:7px;}
.sc td{background:#f4f7ff;border:1px solid #d2daf5;border-radius:6px;padding:5px 8px;text-align:center;}
.sc td.ok{background:#edfaf3;border-color:#a8dfc0;}
.sc td.info{background:#e8f4fd;border-color:#90c8e8;}
.sl{font-size:7.5px;color:#7890c8;text-transform:uppercase;letter-spacing:.4px;font-weight:600;display:block;}
.sv{font-size:16px;font-weight:800;color:#1a3a7c;display:block;}
.sv.ok{color:#1a7a2e;}.sv.info{color:#0277bd;}
hr{border:none;border-top:1px solid #dde3f5;margin:0 0 7px;}
table.mt{width:100%;border-collapse:collapse;}
table.mt thead tr{background:linear-gradient(90deg,#1a3a7c,#2c5abe);color:#fff;}
table.mt thead th{padding:6px 4px;font-size:8px;font-weight:700;text-transform:uppercase;text-align:center;white-space:nowrap;}
table.mt tbody tr{border-bottom:1px solid #edf0f9;}
table.mt tbody tr.alt{background:#fafbff;}
table.mt tbody td{padding:3px 4px;vertical-align:middle;text-align:center;font-size:9px;}
.ft{width:100%;border-collapse:collapse;margin-top:8px;border-top:2px solid #1a3a7c;}
.ft td{font-size:8px;color:#8898c8;padding-top:4px;}
.ft .fl{font-weight:700;color:#1a3a7c;}.ft .fc{text-align:center;}.ft .fr{text-align:right;}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}img{display:block!important;visibility:visible!important;}}
</style></head><body>
<div class="hdr">
  <div class="hl"><div class="co">${company}</div><div class="cs">Customer Visit Report</div></div>
  <div class="hr2"><div class="rt">Customer Visit Report</div><div>${badges}<span class="b">&#128438; ${this._fmt_date(frappe.datetime.get_today())}</span></div></div>
</div>
<table class="sc"><tr>
  <td><span class="sl">Total Visits</span><span class="sv">${d.length}</span></td>
  <td class="ok"><span class="sl">Unique Customers</span><span class="sv ok">${uniqueC}</span></td>
  <td class="info"><span class="sl">Unique Employees</span><span class="sv info">${uniqueE}</span></td>
</tr></table>
<hr>
${pdfChart}
<table class="mt">
  <thead><tr>
    <th>#</th><th>Date</th><th>Time</th>
    <th style="text-align:left;padding-left:5px;">Customer</th>
    <th>Emp. Photo</th><th style="text-align:left;">Employee</th>
    <th>Visit Type</th><th style="text-align:left;">Location</th>
    <th style="text-align:left;">Description</th><th>Proof</th>
  </tr></thead>
  <tbody>${visitRows}</tbody>
</table>
<table class="ft"><tr>
  <td class="fl">${company} — Confidential</td>
  <td class="fc">Visits: ${d.length} | Customers: ${uniqueC} | Employees: ${uniqueE}</td>
  <td class="fr">Generated: ${new Date().toLocaleString()}</td>
</tr></table>
<script>window.onload=function(){window.print();};<\/script>
</body></html>`;

        const win = window.open("", "_blank");
        if (!win) { frappe.msgprint(__("Pop-up blocked. Please allow pop-ups.")); return; }
        win.document.write(html);
        win.document.close();
    }

    // ── Excel Export ──────────────────────────────────────────────────────────
    _export_excel() {
        if (!this.data.length) {
            frappe.msgprint(__("No data to export.")); return;
        }
        const filters = this._get_filters();
        const esc     = v => `"${String(v == null ? "" : v).replace(/"/g, '""')}"`;

        const cols  = ["Date","Time","Customer ID","Customer Name","Employee ID","Employee Name","Visit Type","Location","Description","Visit ID"];
        const flds  = ["date","time","customer_name","customer_display_name","employee_id","employee_name","visit_type","custom_log_location","description","visit_id"];
        const lines = [
            cols.map(esc).join(","),
            ...this.data.map(r => flds.map(f => esc(f === "date" ? this._fmt_date(r[f]) : r[f])).join(",")),
        ];

        // Visits by date summary section
        const dateCounts = this._date_counts();
        const chartDates = Object.keys(dateCounts).sort();
        const chartLines = [
            "",
            esc("=== VISITS BY DATE ==="),
            [esc("Date"), esc("Visit Count")].join(","),
            ...chartDates.map(dt => [esc(this._fmt_date(dt)), esc(dateCounts[dt])].join(",")),
        ];

        const csv  = "﻿" + lines.join("\r\n") + "\r\n" + chartLines.join("\r\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement("a");
        a.href = url;
        a.download = `Customer_Visit_${filters.from_date || "all"}_to_${filters.to_date || "all"}.csv`;
        document.body.appendChild(a); a.click();
        document.body.removeChild(a); URL.revokeObjectURL(url);
        frappe.show_alert({ message: __("Excel file downloaded"), indicator: "green" });
    }
}
