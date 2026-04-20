frappe.pages["emp-checkin"].on_page_load = function (wrapper) {
    frappe.ui.make_app_page({
        parent: wrapper,
        title: __("Employee Checkin"),
        single_column: true,
    });
    wrapper.page_obj = new EmpCheckinPage(wrapper);
};

frappe.pages["emp-checkin"].on_page_show = function (wrapper) {
    if (wrapper.page_obj) wrapper.page_obj.on_show();
};

// ── Styles ───────────────────────────────────────────────────────────────────
(function injectStyles() {
    if (document.getElementById("ec-page-styles")) return;

    if (!document.getElementById("ec-urdu-font")) {
        const lnk = document.createElement("link");
        lnk.id = "ec-urdu-font"; lnk.rel = "stylesheet";
        lnk.href = "https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@500;700&display=swap";
        document.head.appendChild(lnk);
    }

    const s = document.createElement("style");
    s.id = "ec-page-styles";
    s.textContent = `

/* ── Hide page menu (3-dot) button ── */
.page-head .menu-btn-group { display: none !important; }

/* ── Full-width overrides ── */
.page-body, .page-body > .container,
.frappe-app > .container, body > .container {
    max-width: 100% !important;
    width: 100% !important;
    padding-left: 6px !important;
    padding-right: 6px !important;
}
.ec-root {
    padding: 0 0 60px;
    width: 100%;
}

/* ── Filter bar ── */
.ec-filter-bar {
    display: flex; flex-wrap: wrap; align-items: flex-end;
    gap: 12px; padding: 14px 16px;
    background: #f0f4ff;
    border-radius: 12px; margin-bottom: 16px;
    box-shadow: 0 2px 10px rgba(60,90,180,.08);
}
.ec-f-item {
    flex: 1; min-width: 145px; max-width: 200px;
    display: flex; flex-direction: column;
}
.ec-f-item .frappe-control { margin-bottom: 0; flex: 1; }
.ec-f-item .control-label {
    font-size: 10.5px; font-weight: 700; color: #3d5afe;
    text-transform: uppercase; letter-spacing: .5px; margin-bottom: 4px;
    display: block; line-height: 1.3;
}
.ec-f-item input.input-with-feedback,
.ec-f-item select.input-with-feedback {
    font-size: 12.5px !important; height: 34px !important; padding: 4px 10px !important;
    border: 2px solid #a0b4e8 !important; border-radius: 7px !important;
    background: #fff !important; color: #1c2340 !important;
    box-shadow: inset 0 1px 3px rgba(60,90,180,.07) !important;
    transition: border-color .15s !important;
}
.ec-f-item input.input-with-feedback:focus,
.ec-f-item select.input-with-feedback:focus {
    border-color: #3d5afe !important; outline: none !important;
    box-shadow: 0 0 0 3px rgba(61,90,254,.12) !important;
}
.ec-f-btn-wrap {
    display: flex; flex-direction: row; align-items: center;
    gap: 8px; flex-shrink: 0;
    height: 34px;
    margin-bottom: 16px; /* lift 16 px above input baseline */
}
.ec-apply-btn {
    background: linear-gradient(135deg,#1a3a7c,#3d5afe) !important;
    color: #fff !important; border: none !important;
    height: 34px; padding: 0 20px; font-size: 12.5px; font-weight: 700;
    border-radius: 7px; cursor: pointer; white-space: nowrap;
    box-shadow: 0 2px 6px rgba(61,90,254,.25); line-height: 34px;
}
.ec-apply-btn:hover { opacity: .9; }
.ec-clear-btn {
    background: #fff !important; color: #5568a0 !important;
    border: 2px solid #a0b4e8 !important;
    height: 34px; padding: 0 16px; font-size: 12.5px; font-weight: 600;
    border-radius: 7px; cursor: pointer; white-space: nowrap; line-height: 30px;
}
.ec-clear-btn:hover { border-color: #3d5afe !important; color: #3d5afe !important; }

/* ── Summary row ── */
.ec-summary-row {
    display: flex; gap: 10px; flex-wrap: wrap;
    margin: 12px 0 14px;
}
.ec-stat {
    flex: 1; min-width: 110px;
    background: #fff; border: 1px solid #e4eaf7; border-radius: 10px;
    padding: 11px 14px;
    box-shadow: 0 2px 8px rgba(60,90,180,.07);
    display: flex; flex-direction: column; align-items: center; gap: 3px;
}
.ec-stat-icon { font-size: 18px; line-height: 1; }
.ec-stat-label { font-size: 9.5px; font-weight: 600; color: #8898c8; text-transform: uppercase; letter-spacing: .5px; text-align: center; }
.ec-stat-value { font-size: 24px; font-weight: 800; color: #1a3a7c; line-height: 1; }
.ec-stat-value.ok   { color: #1a7a2e; }
.ec-stat-value.warn { color: #9a5f00; }
.ec-stat-value.bad  { color: #c0392b; }

/* ── Header buttons ── */
.ec-hdr-btn-pdf {
    background: linear-gradient(135deg,#e74c3c,#c0392b) !important;
    color: #fff !important; border: none !important; font-weight: 600; margin-left: 4px;
}
.ec-hdr-btn-excel {
    background: linear-gradient(135deg,#27ae60,#1e8449) !important;
    color: #fff !important; border: none !important; font-weight: 600; margin-left: 4px;
}
.ec-hdr-btn-pdf:hover, .ec-hdr-btn-excel:hover { opacity: .88; color: #fff !important; }

/* ── Info bar ── */
.ec-info-bar {
    display: flex; align-items: center; gap: 8px;
    margin-bottom: 8px; padding: 5px 10px;
    background: #f7f9ff; border: 1px solid #e0e7ff; border-radius: 7px;
    font-size: 11px; font-weight: 600; color: #5568a0;
}
.ec-info-bar .ec-rc { margin-left: auto; color: #8898c8; }

/* ── Loading ── */
.ec-loading-wrap {
    display: flex; align-items: center; justify-content: center;
    gap: 10px; padding: 60px 0; color: #8898c8; font-size: 14px; font-weight: 500;
}
.ec-spinner {
    width: 24px; height: 24px;
    border: 3px solid #e0e7ff; border-top-color: #3d5afe;
    border-radius: 50%; animation: ec-spin .7s linear infinite;
}
@keyframes ec-spin { to { transform: rotate(360deg); } }

/* ── Empty state ── */
.ec-empty-state {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 70px 0; gap: 10px;
}
.ec-empty-icon { font-size: 44px; opacity: .35; }
.ec-empty-text { font-size: 14px; color: #aab0cc; font-weight: 500; }

/* ── Table wrapper ── */
.ec-table-wrap {
    overflow-x: auto;
    border-radius: 10px; border: 1px solid #e4eaf7;
    box-shadow: 0 2px 12px rgba(60,90,180,.06);
}

/* ── Main data table ── */
.ec-table {
    width: 100%; border-collapse: collapse; min-width: 900px;
}
.ec-table thead tr {
    background: linear-gradient(90deg,#1a3a7c,#2c5abe);
    color: #fff; position: sticky; top: 0; z-index: 2;
}
.ec-table thead th {
    padding: 10px 7px; font-size: 10px; font-weight: 700;
    text-transform: uppercase; letter-spacing: .4px; white-space: nowrap;
    border-right: 1px solid rgba(255,255,255,.1); text-align: center;
}
.ec-table thead th:last-child { border-right: none; }
.ec-table thead th.th-left { text-align: left; padding-left: 10px; }
.ec-table tbody tr { border-bottom: 1px solid #edf0f9; }
.ec-table tbody tr:hover { background: #f4f7ff; }
.ec-table tbody tr.alt { background: #fafbff; }
.ec-table tbody tr.alt:hover { background: #eef2ff; }
.ec-table tbody td {
    padding: 5px 7px; vertical-align: middle; text-align: center;
    font-size: 12px; color: #2c3354;
}
.ec-table tbody td.td-left { text-align: left; padding-left: 10px; }

/* ── Row number ── */
.ec-rn { color: #b0b8d8; font-size: 10px; }

/* ── Date ── */
.ec-date { font-weight: 700; color: #1a3a7c; font-size: 11.5px; white-space: nowrap; }
.ec-th-sortable { cursor: pointer; user-select: none; white-space: nowrap; }
.ec-th-sortable:hover { background: rgba(255,255,255,.15); }
.ec-sort-active { font-size: 9px; margin-left: 3px; opacity: 1; }
.ec-sort-idle   { font-size: 9px; margin-left: 3px; opacity: .35; }

/* ── Employee ID link ── */
.ec-empid {
    font-weight: 700; color: #3d5afe; font-size: 11px;
    text-decoration: none; display: inline-block;
}
.ec-empid:hover { color: #1a3a7c; text-decoration: underline; }

/* ── Avatar ── */
.ec-avatar-wrap { display: flex; justify-content: center; align-items: center; }
.ec-avatar {
    width: 52px; height: 52px; border-radius: 50%; object-fit: cover;
    border: 2.5px solid #7a98dc; box-shadow: 0 2px 6px rgba(60,90,180,.15); background: #eef2ff;
    cursor: pointer; transition: transform .15s;
}
.ec-avatar:hover { transform: scale(1.08); box-shadow: 0 4px 12px rgba(60,90,180,.3); }
.ec-avatar-ph {
    width: 52px; height: 52px; border-radius: 50%;
    background: linear-gradient(135deg,#e8eeff,#d4dcf7);
    border: 2px dashed #b0bde8;
    display: flex; align-items: center; justify-content: center;
    font-size: 17px; color: #8fa4d8; font-weight: 700; user-select: none;
}

/* ── Employee name / designation (Urdu-capable) ── */
.ec-ename {
    font-weight: 700; font-size: 13px; color: #1c2340;
    font-family: 'Noto Nastaliq Urdu','Urdu Typesetting','Scheherazade New',Arial,sans-serif;
    line-height: 1.5;
}
.ec-desig {
    font-size: 11px; color: #8898c8; font-weight: 600;
    font-family: 'Noto Nastaliq Urdu','Urdu Typesetting','Scheherazade New',Arial,sans-serif;
}

/* ── Shift ── */
.ec-shift-name {
    display: inline-block; background: #eef2ff; color: #3d5afe;
    border-radius: 4px; padding: 2px 8px; font-size: 10.5px; font-weight: 600;
}
.ec-shift-time {
    display: inline-block; font-size: 10px; color: #5568a0; font-weight: 600;
    background: #f0f4ff; border-radius: 4px; padding: 2px 6px;
}

/* ── Time pills ── */
.ec-t-in {
    display: inline-flex; align-items: center; gap: 4px;
    background: #e6f7ee; color: #1a7a2e; border: 1px solid #90d4aa;
    border-radius: 20px; padding: 3px 10px; font-size: 11px; font-weight: 700; white-space: nowrap;
}
.ec-t-out {
    display: inline-flex; align-items: center; gap: 4px;
    background: #fff4e6; color: #9a5f00; border: 1px solid #f0c070;
    border-radius: 20px; padding: 3px 10px; font-size: 11px; font-weight: 700; white-space: nowrap;
}
.ec-t-absent {
    display: inline-flex; align-items: center; gap: 4px;
    background: #fff0f0; color: #c0392b; border: 1px solid #f0a0a0;
    border-radius: 20px; padding: 3px 10px; font-size: 10.5px; font-weight: 700;
}
.ec-t-missing {
    display: inline-flex; align-items: center; gap: 4px;
    background: #fff8ec; color: #9a5f00; border: 1px solid #f5d08a;
    border-radius: 20px; padding: 3px 10px; font-size: 10.5px; font-weight: 700;
}

/* ── Attendance images ── */
.ec-att-wrap { display: flex; justify-content: center; align-items: center; }
.ec-att {
    width: 58px; height: 58px; object-fit: cover; border-radius: 6px;
    border: 1.5px solid #d0d8f0; box-shadow: 0 1px 4px rgba(0,0,0,.1);
    cursor: pointer; transition: transform .15s;
}
.ec-att:hover { transform: scale(1.06); }
.ec-att-ph {
    width: 58px; height: 58px; border-radius: 6px;
    background: #f5f7ff; border: 1.5px dashed #cdd4ee;
    display: flex; align-items: center; justify-content: center;
    color: #c0c8e8; font-size: 18px;
}

/* ── Working hours ── */
.ec-wh-ok {
    display: inline-flex; align-items: center; gap: 4px;
    background: linear-gradient(135deg,#d4f7e3,#b2edcb); color: #1a7a2e;
    border: 1px solid #7dd6a8; border-radius: 20px; padding: 4px 11px;
    font-size: 12px; font-weight: 800; min-width: 65px; justify-content: center;
}
.ec-wh-low {
    display: inline-flex; align-items: center; gap: 4px;
    background: linear-gradient(135deg,#fff3d4,#ffe8a0); color: #8a5700;
    border: 1px solid #f5d07a; border-radius: 20px; padding: 4px 11px;
    font-size: 12px; font-weight: 800; min-width: 65px; justify-content: center;
}
.ec-wh-na {
    display: inline-block; background: #fff0f0; color: #c0392b;
    border: 1px solid #f5b0b0; border-radius: 20px; padding: 4px 11px;
    font-size: 11px; font-weight: 700; min-width: 65px; text-align: center;
}

/* ── Location ── */
.ec-loc-link {
    display: inline-flex; align-items: center; gap: 3px;
    color: #3d5afe; font-size: 11px; text-decoration: none; font-weight: 600;
}
.ec-loc-link:hover { text-decoration: underline; }
.ec-loc-text { font-size: 10.5px; color: #5568a0; word-break: break-word; }

/* ── Checkin ID link ── */
.ec-log-id-link {
    display: block; font-size: 9px; color: #7090d8; font-weight: 600;
    text-decoration: none; margin-bottom: 3px; white-space: nowrap;
}
.ec-log-id-link:hover { text-decoration: underline; color: #3d5afe; }

/* ── Lightbox ── */
.ec-lightbox-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,.82);
    z-index: 9999; display: flex; align-items: center; justify-content: center;
    cursor: pointer;
}
.ec-lightbox-img {
    max-width: 88vw; max-height: 88vh;
    border-radius: 8px; box-shadow: 0 8px 40px rgba(0,0,0,.5);
    cursor: default;
}

/* ── Absent section ── */
.ec-absent-section {
    margin-top: 30px;
}
.ec-absent-header {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 12px; padding: 10px 14px;
    background: linear-gradient(90deg,#fff0f0,#fff8f8);
    border: 1px solid #f5b0b0; border-radius: 10px;
    border-left: 4px solid #c0392b;
}
.ec-absent-header-title {
    font-size: 14px; font-weight: 800; color: #c0392b;
}
.ec-absent-header-sub {
    font-size: 11px; color: #a05050; font-weight: 500;
}
.ec-absent-count-badge {
    margin-left: auto;
    background: #c0392b; color: #fff;
    border-radius: 20px; padding: 3px 14px;
    font-size: 13px; font-weight: 800;
}

/* ── Absent table ── */
.ec-absent-table {
    width: 100%; border-collapse: collapse; min-width: 500px;
}
.ec-absent-table thead tr {
    background: linear-gradient(90deg,#8b1a1a,#c0392b);
    color: #fff;
}
.ec-absent-table thead th {
    padding: 9px 10px; font-size: 10px; font-weight: 700;
    text-transform: uppercase; letter-spacing: .4px;
    text-align: center; white-space: nowrap;
    border-right: 1px solid rgba(255,255,255,.15);
}
.ec-absent-table thead th:last-child { border-right: none; }
.ec-absent-table thead th.th-left { text-align: left; padding-left: 12px; }
.ec-absent-table tbody tr { border-bottom: 1px solid #fce8e8; }
.ec-absent-table tbody tr:hover { background: #fff5f5; }
.ec-absent-table tbody tr.alt { background: #fffafa; }
.ec-absent-table tbody td {
    padding: 7px 10px; vertical-align: middle;
    text-align: center; font-size: 12px; color: #2c2020;
}
.ec-absent-table tbody td.td-left { text-align: left; padding-left: 12px; }

/* ── Absent date chips ── */
.ec-date-chips { display: flex; flex-wrap: wrap; gap: 4px; }
.ec-date-chip {
    display: inline-block;
    background: #fff0f0; color: #c0392b;
    border: 1px solid #f5b0b0; border-radius: 4px;
    padding: 2px 7px; font-size: 10px; font-weight: 600; white-space: nowrap;
}
.ec-absent-cnt-badge {
    display: inline-block;
    background: #c0392b; color: #fff;
    border-radius: 12px; padding: 2px 10px;
    font-size: 12px; font-weight: 800;
}

/* ── Print ── */
@media print {
    .ec-info-bar { display: none !important; }
    .ec-table, .ec-absent-table { font-size: 9px; }
    .ec-table thead th, .ec-absent-table thead th { font-size: 8px; }
    .ec-table tbody td, .ec-absent-table tbody td { padding: 3px 4px; }
    .ec-avatar, .ec-att { width: 38px; height: 38px; }
    .ec-table-wrap { border: none; box-shadow: none; }
    @page { size: A4 landscape; margin: 8mm; }
}
    `;
    document.head.appendChild(s);
})();

// ── Page class ───────────────────────────────────────────────────────────────
class EmpCheckinPage {
    constructor(wrapper) {
        this.wrapper    = wrapper;
        this.page       = wrapper.page;
        this.data        = [];
        this.absent      = [];
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
        if (this.data.length || this.absent.length) {
            this._render_summary();
            this._render_table();
            this._render_absent();
        }
    }

    // ── Full-width ──────────────────────────────────────────────────────────
    _expand_width() {
        // Walk all ancestor containers and strip side padding
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

    // ── Filters (rendered inside page body) ────────────────────────────────
    _setup_filters() {
        // Suppress refresh() calls triggered by set_value during init
        this._init_mode = true;

        const mk = (id, df) => frappe.ui.form.make_control({
            parent: document.getElementById(id),
            df,
            render_input: true,
        });

        this.f_from = mk("ec-f-from", {
            fieldtype: "Date", fieldname: "from_date", label: __("From Date"),
            change: () => this.refresh(),
        });
        this.f_from.set_value(frappe.datetime.add_days(frappe.datetime.get_today(), -1));

        this.f_to = mk("ec-f-to", {
            fieldtype: "Date", fieldname: "to_date", label: __("To Date"),
            change: () => this.refresh(),
        });
        this.f_to.set_value(frappe.datetime.get_today());

        this.f_emp = mk("ec-f-emp", {
            fieldtype: "Link", fieldname: "employee", label: __("Employee"),
            options: "Employee", change: () => this.refresh(),
        });
        this.f_dept = mk("ec-f-dept", {
            fieldtype: "Link", fieldname: "department", label: __("Department"),
            options: "Department", change: () => this.refresh(),
        });
        this.f_dept.set_value("Willow Sales & Marketing  - STC");
        this.f_desig = mk("ec-f-desig", {
            fieldtype: "Link", fieldname: "designation", label: __("Designation"),
            options: "Designation", change: () => this.refresh(),
        });
        this.f_shift = mk("ec-f-shift", {
            fieldtype: "Link", fieldname: "shift", label: __("Shift Type"),
            options: "Shift Type", change: () => this.refresh(),
        });
        this.f_log_type = mk("ec-f-logtype", {
            fieldtype: "Select", fieldname: "log_type", label: __("Log Type"),
            options: ["", "In", "Out"].join("\n"),
            change: () => this.refresh(),
        });

        this._init_mode = false;

        document.getElementById("ec-apply-btn").addEventListener("click", () => this.refresh());
        document.getElementById("ec-clear-btn").addEventListener("click", () => this._clear_filters());
    }

    _clear_filters() {
        this.f_from.set_value(frappe.datetime.add_days(frappe.datetime.get_today(), -1));
        this.f_to.set_value(frappe.datetime.get_today());
        this.f_emp.set_value("");
        this.f_dept.set_value("");
        this.f_desig.set_value("");
        this.f_shift.set_value("");
        this.f_log_type.set_value("");
        this.refresh();
    }

    // ── Actions ─────────────────────────────────────────────────────────────
    _setup_actions() {
        this.page.set_primary_action(__("Refresh"), () => this.refresh(), "refresh");

        const pdfBtn = this.page.add_button(__("PDF"), () => this._export_pdf());
        $(pdfBtn).addClass("ec-hdr-btn-pdf").html(
            `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="margin-right:4px;vertical-align:-1px"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>PDF`
        );
        const xlsBtn = this.page.add_button(__("Excel"), () => this._export_excel());
        $(xlsBtn).addClass("ec-hdr-btn-excel").html(
            `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="margin-right:4px;vertical-align:-1px"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Excel`
        );
    }

    _render_skeleton() {
        $(this.page.main).html(`
            <div class="ec-root">
                <div class="ec-summary-row" id="ec-summary-row" style="display:none;"></div>
                <div class="ec-filter-bar" id="ec-filter-bar">
                    <div class="ec-f-item" id="ec-f-from"></div>
                    <div class="ec-f-item" id="ec-f-to"></div>
                    <div class="ec-f-item" id="ec-f-emp"></div>
                    <div class="ec-f-item" id="ec-f-dept"></div>
                    <div class="ec-f-item" id="ec-f-desig"></div>
                    <div class="ec-f-item" id="ec-f-shift"></div>
                    <div class="ec-f-item" id="ec-f-logtype"></div>
                    <div class="ec-f-btn-wrap">
                        <button class="btn ec-apply-btn" id="ec-apply-btn">&#8635; Apply</button>
                        <button class="btn ec-clear-btn" id="ec-clear-btn">&times; Clear</button>
                    </div>
                </div>
                <div id="ec-body">
                    <div class="ec-empty-state">
                        <div class="ec-empty-icon">&#128197;</div>
                        <div class="ec-empty-text">Select filters and click Apply to load data</div>
                    </div>
                </div>
                <div id="ec-absent-body"></div>
            </div>
        `);
    }

    _get_filters() {
        return {
            from_date:   this.f_from.get_value(),
            to_date:     this.f_to.get_value(),
            employee:    this.f_emp.get_value(),
            department:  this.f_dept.get_value(),
            designation: this.f_desig.get_value(),
            shift:       this.f_shift.get_value(),
            log_type:    this.f_log_type.get_value(),
        };
    }

    // ── Refresh — parallel calls ─────────────────────────────────────────────
    refresh() {
        if (this._init_mode) return;

        this._show_loading();
        const filters = this._get_filters();
        const cacheKey = JSON.stringify(filters);

        // Serve from short-lived client cache (30 s) to avoid duplicate calls
        if (this._cache && this._cache.key === cacheKey &&
                Date.now() - this._cache.ts < 30000) {
            this.data   = this._cache.data;
            this.absent = this._cache.absent;
            this._render_summary();
            this._render_table();
            this._render_absent();
            return;
        }

        Promise.all([
            new Promise(resolve => frappe.call({
                method: "stc_reports.stc_reports.page.emp_checkin.emp_checkin.get_checkin_data",
                args: { filters },
                callback: r => resolve(r.message || []),
                error:    ()  => resolve([]),
            })),
            new Promise(resolve => frappe.call({
                method: "stc_reports.stc_reports.page.emp_checkin.emp_checkin.get_absent_employees",
                args: { filters },
                callback: r => resolve(r.message || []),
                error:    ()  => resolve([]),
            })),
        ]).then(([checkin, absent]) => {
            this.data   = checkin;
            this.absent = absent;
            this._cache = { key: cacheKey, data: checkin, absent: absent, ts: Date.now() };
            this._render_summary();
            this._render_table();
            this._render_absent();
        });
    }

    _show_loading() {
        $("#ec-body").html(`
            <div class="ec-loading-wrap">
                <div class="ec-spinner"></div>
                <span>Loading data&hellip;</span>
            </div>`);
        $("#ec-absent-body").html("");
        $("#ec-summary-row").hide();
    }

    // ── Summary cards ────────────────────────────────────────────────────────
    _render_summary() {
        const d = this.data;
        let checkedIn = 0, checkedOut = 0, missingOut = 0, whSum = 0, whCnt = 0;
        d.forEach(r => {
            if (r.check_in_time)  checkedIn++;
            if (r.check_out_time) checkedOut++;
            if (r.check_in_time && !r.check_out_time) missingOut++;
            const wh = parseFloat(r.working_hours);
            if (!isNaN(wh) && r.working_hours != null) { whSum += wh; whCnt++; }
        });
        const avg        = whCnt > 0 ? (whSum / whCnt).toFixed(2) : "—";
        const absentEmps = this.absent.length;
        const absentDays = this.absent.reduce((s, r) => s + (r.absent_count || 0), 0);

        $("#ec-summary-row").html(`
            <div class="ec-stat">
                <span class="ec-stat-icon">&#128202;</span>
                <span class="ec-stat-label">Total Records</span>
                <span class="ec-stat-value">${d.length}</span>
            </div>
            <div class="ec-stat">
                <span class="ec-stat-icon">&#9989;</span>
                <span class="ec-stat-label">Checked In</span>
                <span class="ec-stat-value ok">${checkedIn}</span>
            </div>
            <div class="ec-stat">
                <span class="ec-stat-icon">&#128682;</span>
                <span class="ec-stat-label">Checked Out</span>
                <span class="ec-stat-value ok">${checkedOut}</span>
            </div>
            <div class="ec-stat">
                <span class="ec-stat-icon">&#9888;</span>
                <span class="ec-stat-label">Missing Checkout</span>
                <span class="ec-stat-value ${missingOut > 0 ? "warn" : "ok"}">${missingOut}</span>
            </div>
            <div class="ec-stat">
                <span class="ec-stat-icon">&#128336;</span>
                <span class="ec-stat-label">Avg Working Hrs</span>
                <span class="ec-stat-value">${avg}</span>
            </div>
            <div class="ec-stat" style="border-color:#f5b0b0;background:#fff8f8;">
                <span class="ec-stat-icon">&#128683;</span>
                <span class="ec-stat-label">Absent Employees</span>
                <span class="ec-stat-value bad">${absentEmps}</span>
            </div>
            <div class="ec-stat" style="border-color:#f5b0b0;background:#fff8f8;">
                <span class="ec-stat-icon">&#128197;</span>
                <span class="ec-stat-label">Total Absent Days</span>
                <span class="ec-stat-value bad">${absentDays}</span>
            </div>
        `).show();
    }

    // ── Checkin table ────────────────────────────────────────────────────────
    _sort_data() {
        const dir   = this._sort_dir === "asc" ? 1 : -1;
        const field = this._sort_field;
        this.data.sort((a, b) => {
            const av = (a[field] || "").toLowerCase();
            const bv = (b[field] || "").toLowerCase();
            if (av < bv) return -1 * dir;
            if (av > bv) return  1 * dir;
            return 0;
        });
    }

    _th_arrow(field) {
        if (this._sort_field !== field) return `<span class="ec-sort-idle">&#8645;</span>`;
        return this._sort_dir === "asc"
            ? `<span class="ec-sort-active">&#9650;</span>`
            : `<span class="ec-sort-active">&#9660;</span>`;
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
            $("#ec-body").html(`
                <div class="ec-empty-state">
                    <div class="ec-empty-icon">&#128269;</div>
                    <div class="ec-empty-text">No checkin records found for the selected filters</div>
                </div>`);
            return;
        }

        this._sort_data();
        const filters = this._get_filters();
        const rows    = this.data.map((r, i) => this._row_html(r, i)).join("");

        $("#ec-body").html(`
            <div class="ec-info-bar">
                <span>&#128203; Checkin Records</span>
                <span class="ec-rc">${this.data.length} record(s) &nbsp;|&nbsp; ${this._fmt_date(filters.from_date)} &rarr; ${this._fmt_date(filters.to_date)}</span>
            </div>
            <div class="ec-table-wrap">
                <table class="ec-table">
                    <thead><tr>
                        <th>#</th>
                        <th class="ec-th-sortable" id="ec-th-date">Date ${this._th_arrow("date")}</th>
                        <th class="ec-th-sortable" id="ec-th-employee">Emp ID ${this._th_arrow("employee")}</th>
                        <th>Photo</th>
                        <th class="th-left ec-th-sortable" id="ec-th-employee_name">Employee Name ${this._th_arrow("employee_name")}</th>
                        <th class="th-left">Designation</th>
                        <th>Shift</th>
                        <th>Shift In</th>
                        <th>Shift Out</th>
                        <th class="ec-th-sortable" id="ec-th-check_in_time">Check In ${this._th_arrow("check_in_time")}</th>
                        <th>IN Image</th>
                        <th>IN Location</th>
                        <th class="ec-th-sortable" id="ec-th-check_out_time">Check Out ${this._th_arrow("check_out_time")}</th>
                        <th>OUT Image</th>
                        <th>OUT Location</th>
                        <th>Working Hrs</th>
                    </tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        `);

        $("#ec-th-date").off("click.ec-sort").on("click.ec-sort",            () => this._on_th_click("date"));
        $("#ec-th-employee").off("click.ec-sort").on("click.ec-sort",        () => this._on_th_click("employee"));
        $("#ec-th-employee_name").off("click.ec-sort").on("click.ec-sort",   () => this._on_th_click("employee_name"));
        $("#ec-th-check_in_time").off("click.ec-sort").on("click.ec-sort",   () => this._on_th_click("check_in_time"));
        $("#ec-th-check_out_time").off("click.ec-sort").on("click.ec-sort",  () => this._on_th_click("check_out_time"));

        $(document).off("click.ec-lightbox").on("click.ec-lightbox", ".ec-att, .ec-avatar", function () {
            const src = $(this).attr("src");
            if (!src) return;
            const ov = $(`<div class="ec-lightbox-overlay">
                <img class="ec-lightbox-img" src="${src}" />
            </div>`);
            ov.on("click", function (e) {
                if (!$(e.target).hasClass("ec-lightbox-img")) ov.remove();
            });
            $("body").append(ov);
        });
    }

    _row_html(r, i) {
        const alt      = i % 2 === 1 ? " alt" : "";
        const initials = ((r.employee_name || "?").split(" ").map(w => w[0]).slice(0, 2).join("")).toUpperCase();
        const photo    = this._img_or_ph(r.employee_image, "ec-avatar", initials, true);
        const inImg    = this._img_or_ph(r.in_attendance_image,  "ec-att", "—", false);
        const outImg   = this._img_or_ph(r.out_attendance_image, "ec-att", "—", false);

        const inIdLink  = r.check_in_id
            ? `<a class="ec-log-id-link" href="/app/employee-checkin/${this._esc(r.check_in_id)}" target="_blank" rel="noopener">${this._esc(r.check_in_id)}</a>`
            : "";
        const outIdLink = r.check_out_id
            ? `<a class="ec-log-id-link" href="/app/employee-checkin/${this._esc(r.check_out_id)}" target="_blank" rel="noopener">${this._esc(r.check_out_id)}</a>`
            : "";
        const inTime  = r.check_in_time
            ? `${inIdLink}<span class="ec-t-in">&#10003; ${r.check_in_time}</span>`
            : `<span class="ec-t-absent">&#10007; Absent</span>`;
        const outTime = r.check_out_time
            ? `${outIdLink}<span class="ec-t-out">&#128336; ${r.check_out_time}</span>`
            : `<span class="ec-t-missing">&#9888; Missing</span>`;

        const shiftIn   = r.shift_in_time  ? `<span class="ec-shift-time">${r.shift_in_time}</span>`  : `<span style="color:#ccc">—</span>`;
        const shiftOut  = r.shift_out_time ? `<span class="ec-shift-time">${r.shift_out_time}</span>` : `<span style="color:#ccc">—</span>`;
        const shiftName = r.shift ? `<span class="ec-shift-name">${this._esc(r.shift)}</span>` : `<span style="color:#ccc">—</span>`;

        const wh = parseFloat(r.working_hours);
        const whCell = isNaN(wh) || r.working_hours == null
            ? `<span class="ec-wh-na">N/A</span>`
            : wh >= 8
                ? `<span class="ec-wh-ok">&#10003; ${wh.toFixed(2)}h</span>`
                : `<span class="ec-wh-low">&#9888; ${wh.toFixed(2)}h</span>`;

        return `<tr class="${alt}">
            <td><span class="ec-rn">${i + 1}</span></td>
            <td><span class="ec-date">${this._fmt_date(r.date)}</span></td>
            <td><a class="ec-empid" href="/app/employee/${this._esc(r.employee)}" target="_blank" rel="noopener">${this._esc(r.employee) || "—"}</a></td>
            <td><div class="ec-avatar-wrap">${photo}</div></td>
            <td class="td-left"><span class="ec-ename">${this._esc(r.employee_name) || "—"}</span></td>
            <td class="td-left"><span class="ec-desig">${this._esc(r.designation) || "—"}</span></td>
            <td>${shiftName}</td>
            <td>${shiftIn}</td>
            <td>${shiftOut}</td>
            <td>${inTime}</td>
            <td><div class="ec-att-wrap">${inImg}</div></td>
            <td class="td-left">${this._loc_html(r.in_log_location)}</td>
            <td>${outTime}</td>
            <td><div class="ec-att-wrap">${outImg}</div></td>
            <td class="td-left">${this._loc_html(r.out_log_location)}</td>
            <td>${whCell}</td>
        </tr>`;
    }

    // ── Absent section ───────────────────────────────────────────────────────
    _render_absent() {
        if (!this.absent.length) {
            const filters = this._get_filters();
            const hasRange = filters.from_date && filters.to_date;
            $("#ec-absent-body").html(hasRange ? `
                <div class="ec-absent-section">
                    <div class="ec-absent-header">
                        <span style="font-size:22px;">&#127881;</span>
                        <div>
                            <div class="ec-absent-header-title">No Absences Found</div>
                            <div class="ec-absent-header-sub">All active employees checked in during the selected period</div>
                        </div>
                    </div>
                </div>` : "");
            return;
        }

        const totalAbsentDays = this.absent.reduce((s, r) => s + r.absent_count, 0);
        const rows = this.absent.map((r, i) => this._absent_row_html(r, i)).join("");

        $("#ec-absent-body").html(`
            <div class="ec-absent-section">
                <div class="ec-absent-header">
                    <span style="font-size:24px;">&#128683;</span>
                    <div>
                        <div class="ec-absent-header-title">Absent Employees</div>
                        <div class="ec-absent-header-sub">Employees with no check-in record on one or more days in the selected range</div>
                    </div>
                    <span class="ec-absent-count-badge">${this.absent.length} employees &nbsp;·&nbsp; ${totalAbsentDays} days</span>
                </div>
                <div class="ec-table-wrap">
                    <table class="ec-absent-table">
                        <thead><tr>
                            <th>#</th>
                            <th>Photo</th>
                            <th class="th-left">Emp ID</th>
                            <th class="th-left">Employee Name</th>
                            <th class="th-left">Designation</th>
                            <th class="th-left">Department</th>
                            <th style="text-align:center;">Absent Days</th>
                            <th class="th-left">Absent Dates</th>
                        </tr></thead>
                        <tbody>${rows}</tbody>
                    </table>
                </div>
            </div>
        `);
    }

    _absent_row_html(r, i) {
        const alt      = i % 2 === 1 ? " alt" : "";
        const initials = ((r.employee_name || "?").split(" ").map(w => w[0]).slice(0, 2).join("")).toUpperCase();
        const photo    = this._img_or_ph(r.employee_image, "ec-avatar", initials, true);
        const chips    = (r.absent_dates || [])
            .map(d => `<span class="ec-date-chip">${this._fmt_date(d)}</span>`).join("");

        return `<tr class="${alt}">
            <td><span class="ec-rn">${i + 1}</span></td>
            <td><div class="ec-avatar-wrap">${photo}</div></td>
            <td class="td-left"><a class="ec-empid" href="/app/employee/${this._esc(r.employee)}" target="_blank" rel="noopener">${this._esc(r.employee)}</a></td>
            <td class="td-left"><span class="ec-ename">${this._esc(r.employee_name) || "—"}</span></td>
            <td class="td-left"><span class="ec-desig">${this._esc(r.designation) || "—"}</span></td>
            <td class="td-left"><span style="font-size:11px;color:#5568a0;">${this._esc(r.department) || "—"}</span></td>
            <td><span class="ec-absent-cnt-badge">${r.absent_count}</span></td>
            <td class="td-left"><div class="ec-date-chips">${chips}</div></td>
        </tr>`;
    }

    // ── Helpers ──────────────────────────────────────────────────────────────
    _img_or_ph(src, imgClass, fallbackText, isAvatar) {
        const ph = isAvatar
            ? `<div class="ec-avatar-ph">${fallbackText}</div>`
            : `<div class="ec-att-ph">${fallbackText}</div>`;
        if (!src) return ph;
        const img = document.createElement("img");
        img.className = imgClass;
        img.src = src;
        if (!isAvatar) img.title = "Click to enlarge";
        img.addEventListener("error", function () {
            if (this.parentNode) {
                this.parentNode.replaceChild(
                    document.createRange().createContextualFragment(ph), this
                );
            }
        });
        const wrap = document.createElement("div");
        wrap.appendChild(img);
        return wrap.innerHTML;
    }

    _loc_html(loc) {
        if (!loc) return `<span style="color:#ccc">—</span>`;
        if (loc.startsWith("http"))
            return `<a class="ec-loc-link" href="${this._esc(loc)}" target="_blank" rel="noopener">&#128205; Map</a>`;
        return `<span class="ec-loc-text">${this._esc(loc)}</span>`;
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

    // ── PDF Export ────────────────────────────────────────────────────────────
    _export_pdf() {
        if (!this.data.length && !this.absent.length) {
            frappe.msgprint(__("No data to export.")); return;
        }
        const filters = this._get_filters();
        const d = this.data;
        const company = (frappe.boot.sysdefaults && frappe.boot.sysdefaults.company) || "Company";

        let checkedIn = 0, checkedOut = 0, missingOut = 0, whSum = 0, whCnt = 0;
        d.forEach(r => {
            if (r.check_in_time)  checkedIn++;
            if (r.check_out_time) checkedOut++;
            if (r.check_in_time && !r.check_out_time) missingOut++;
            const wh = parseFloat(r.working_hours);
            if (!isNaN(wh) && r.working_hours != null) { whSum += wh; whCnt++; }
        });
        const avg = whCnt > 0 ? (whSum / whCnt).toFixed(2) : "—";
        const absentEmps = this.absent.length;
        const absentDays = this.absent.reduce((s, r) => s + r.absent_count, 0);

        const badges = [
            filters.from_date   ? `<span class="b">From: ${this._fmt_date(filters.from_date)}</span>` : "",
            filters.to_date     ? `<span class="b">To: ${this._fmt_date(filters.to_date)}</span>` : "",
            filters.employee    ? `<span class="b">${filters.employee}</span>` : "",
            filters.department  ? `<span class="b">${filters.department}</span>` : "",
            filters.designation ? `<span class="b">${filters.designation}</span>` : "",
            filters.shift       ? `<span class="b">Shift: ${filters.shift}</span>` : "",
            filters.log_type    ? `<span class="b">Log: ${filters.log_type}</span>` : "",
        ].filter(Boolean).join(" ");

        const checkinRows = d.map((r, i) => {
            const wh  = parseFloat(r.working_hours);
            const alt = i % 2 === 1 ? ' class="alt"' : "";
            const whCell = isNaN(wh) || r.working_hours == null
                ? `<span class="wh-na">N/A</span>`
                : wh >= 8 ? `<span class="wh-ok">${wh.toFixed(2)}h</span>`
                           : `<span class="wh-low">${wh.toFixed(2)}h</span>`;
            const inTime  = r.check_in_time  ? `<span class="t-in">${r.check_in_time}</span>`   : `<span class="t-abs">Absent</span>`;
            const outTime = r.check_out_time ? `<span class="t-out">${r.check_out_time}</span>` : `<span class="t-miss">Missing</span>`;
            const photo = r.employee_image
                ? `<img style="width:44px;height:44px;border-radius:50%;object-fit:cover;border:2px solid #7a98dc;" src="${r.employee_image}">`
                : `<div style="width:44px;height:44px;border-radius:50%;background:#eef2ff;border:1px dashed #b0bde8;display:flex;align-items:center;justify-content:center;font-weight:700;color:#8fa4d8;margin:auto;">${(r.employee_name||"?")[0]}</div>`;
            const inImg = r.in_attendance_image
                ? `<img style="width:44px;height:44px;border-radius:4px;object-fit:cover;" src="${r.in_attendance_image}">` : "—";
            const outImg = r.out_attendance_image
                ? `<img style="width:44px;height:44px;border-radius:4px;object-fit:cover;" src="${r.out_attendance_image}">` : "—";
            const inLoc  = r.in_log_location  ? (r.in_log_location.startsWith("http")  ? `<a href="${r.in_log_location}"  style="color:#3d5afe;font-size:8px;">Map</a>` : `<span style="font-size:8px;">${r.in_log_location}</span>`)  : "—";
            const outLoc = r.out_log_location ? (r.out_log_location.startsWith("http") ? `<a href="${r.out_log_location}" style="color:#3d5afe;font-size:8px;">Map</a>` : `<span style="font-size:8px;">${r.out_log_location}</span>`) : "—";
            const sin  = r.shift_in_time  ? `<span style="background:#eef2ff;color:#3d5afe;border-radius:3px;padding:1px 5px;font-size:8px;font-weight:600;">${r.shift_in_time}</span>`  : "—";
            const sout = r.shift_out_time ? `<span style="background:#eef2ff;color:#3d5afe;border-radius:3px;padding:1px 5px;font-size:8px;font-weight:600;">${r.shift_out_time}</span>` : "—";
            return `<tr${alt}>
                <td style="color:#a0a8c8;font-size:9px;">${i+1}</td>
                <td style="font-weight:700;color:#1a3a7c;font-size:9.5px;white-space:nowrap;">${this._fmt_date(r.date)}</td>
                <td style="font-weight:700;color:#3d5afe;font-size:9.5px;">${r.employee||"—"}</td>
                <td style="text-align:center;">${photo}</td>
                <td style="font-weight:700;font-size:10.5px;text-align:left;padding-left:5px;">${r.employee_name||"—"}</td>
                <td style="font-size:9px;color:#6678a8;text-align:left;">${r.designation||"—"}</td>
                <td style="font-size:9px;color:#3d5afe;font-weight:600;">${r.shift||"—"}</td>
                <td>${sin}</td><td>${sout}</td>
                <td>${inTime}</td>
                <td style="text-align:center;">${inImg}</td>
                <td style="text-align:left;font-size:8px;">${inLoc}</td>
                <td>${outTime}</td>
                <td style="text-align:center;">${outImg}</td>
                <td style="text-align:left;font-size:8px;">${outLoc}</td>
                <td>${whCell}</td>
            </tr>`;
        }).join("");

        const absentRows = this.absent.map((r, i) => {
            const alt   = i % 2 === 1 ? ' class="aalt"' : "";
            const chips = (r.absent_dates || []).map(d => `<span class="dchip">${this._fmt_date(d)}</span>`).join(" ");
            const photo = r.employee_image
                ? `<img style="width:40px;height:40px;border-radius:50%;object-fit:cover;border:2px solid #e08080;" src="${r.employee_image}">`
                : `<div style="width:40px;height:40px;border-radius:50%;background:#fff0f0;border:1px dashed #e08080;display:flex;align-items:center;justify-content:center;font-weight:700;color:#c0392b;margin:auto;">${(r.employee_name||"?")[0]}</div>`;
            return `<tr${alt}>
                <td style="color:#a0a8c8;font-size:9px;">${i+1}</td>
                <td style="text-align:center;">${photo}</td>
                <td style="font-weight:700;color:#3d5afe;font-size:9.5px;text-align:left;">${r.employee||"—"}</td>
                <td style="font-weight:700;font-size:10.5px;text-align:left;">${r.employee_name||"—"}</td>
                <td style="font-size:9px;color:#6678a8;text-align:left;">${r.designation||"—"}</td>
                <td style="font-size:9px;color:#6678a8;text-align:left;">${r.department||"—"}</td>
                <td style="text-align:center;"><span style="background:#c0392b;color:#fff;border-radius:10px;padding:2px 10px;font-weight:800;font-size:11px;">${r.absent_count}</span></td>
                <td style="text-align:left;">${chips}</td>
            </tr>`;
        }).join("");

        const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<title>Employee Checkin — ${company}</title>
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
.sc td{background:#f4f7ff;border:1px solid #d2daf5;border-radius:6px;padding:5px 8px;text-align:center;width:14%;}
.sc td.ok{background:#edfaf3;border-color:#a8dfc0;}
.sc td.bad{background:#fff0f0;border-color:#f0a8a8;}
.sl{font-size:7.5px;color:#7890c8;text-transform:uppercase;letter-spacing:.4px;font-weight:600;display:block;}
.sv{font-size:16px;font-weight:800;color:#1a3a7c;display:block;}
.sv.ok{color:#1a7a2e;}.sv.bad{color:#c0392b;}
hr{border:none;border-top:1px solid #dde3f5;margin:0 0 7px;}
table.mt{width:100%;border-collapse:collapse;}
table.mt thead tr{background:linear-gradient(90deg,#1a3a7c,#2c5abe);color:#fff;}
table.mt thead th{padding:6px 4px;font-size:8px;font-weight:700;text-transform:uppercase;text-align:center;white-space:nowrap;}
table.mt tbody tr{border-bottom:1px solid #edf0f9;}
table.mt tbody tr.alt{background:#fafbff;}
table.mt tbody td{padding:3px 4px;vertical-align:middle;text-align:center;font-size:9px;}
.t-in{display:inline-block;background:#e6f7ee;color:#1a7a2e;border:1px solid #90d4aa;border-radius:8px;padding:1px 6px;font-size:8px;font-weight:700;}
.t-out{display:inline-block;background:#fff4e6;color:#9a5f00;border:1px solid #f0c070;border-radius:8px;padding:1px 6px;font-size:8px;font-weight:700;}
.t-abs{display:inline-block;background:#fff0f0;color:#c0392b;border:1px solid #f0a0a0;border-radius:8px;padding:1px 6px;font-size:7.5px;font-weight:700;}
.t-miss{display:inline-block;background:#fff8ec;color:#9a5f00;border:1px solid #f5d08a;border-radius:8px;padding:1px 6px;font-size:7.5px;font-weight:700;}
.wh-ok{display:inline-block;background:#e2f7ec;color:#1a7a2e;border:1px solid #80d4a0;border-radius:8px;padding:1px 7px;font-size:8px;font-weight:800;}
.wh-low{display:inline-block;background:#fff8e0;color:#8a5700;border:1px solid #f0d080;border-radius:8px;padding:1px 7px;font-size:8px;font-weight:800;}
.wh-na{display:inline-block;background:#fff0f0;color:#c0392b;border:1px solid #f0a0a0;border-radius:8px;padding:1px 7px;font-size:8px;font-weight:700;}
.absent-hdr{background:linear-gradient(90deg,#8b1a1a,#c0392b);color:#fff;border-radius:6px;padding:8px 12px;margin:18px 0 8px;overflow:hidden;}
.absent-hdr-t{font-size:13px;font-weight:800;}
.absent-hdr-s{font-size:9px;opacity:.85;}
.absent-hdr-c{float:right;background:rgba(255,255,255,.25);border-radius:10px;padding:2px 12px;font-size:11px;font-weight:800;}
table.at{width:100%;border-collapse:collapse;}
table.at thead tr{background:linear-gradient(90deg,#8b1a1a,#c0392b);color:#fff;}
table.at thead th{padding:6px 5px;font-size:8px;font-weight:700;text-transform:uppercase;text-align:center;white-space:nowrap;}
table.at tbody tr{border-bottom:1px solid #fce8e8;}
table.at tbody tr.aalt{background:#fffafa;}
table.at tbody td{padding:4px 5px;vertical-align:middle;text-align:center;font-size:9px;}
.dchip{display:inline-block;background:#fff0f0;color:#c0392b;border:1px solid #f5b0b0;border-radius:3px;padding:1px 5px;font-size:7.5px;font-weight:600;margin:1px;}
.ft{width:100%;border-collapse:collapse;margin-top:8px;border-top:2px solid #1a3a7c;}
.ft td{font-size:8px;color:#8898c8;padding-top:4px;}
.ft .fl{font-weight:700;color:#1a3a7c;}.ft .fc{text-align:center;}.ft .fr{text-align:right;}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}img{display:block!important;visibility:visible!important;}}
</style></head><body>
<div class="hdr">
  <div class="hl"><div class="co">${company}</div><div class="cs">Employee Attendance &amp; Checkin Report</div></div>
  <div class="hr2"><div class="rt">Employee Checkin Report</div><div>${badges}<span class="b">&#128438; ${this._fmt_date(frappe.datetime.get_today())}</span></div></div>
</div>
<table class="sc"><tr>
  <td><span class="sl">Total Records</span><span class="sv">${d.length}</span></td>
  <td class="ok"><span class="sl">Checked In</span><span class="sv ok">${checkedIn}</span></td>
  <td class="ok"><span class="sl">Checked Out</span><span class="sv ok">${checkedOut}</span></td>
  <td><span class="sl">Missing Checkout</span><span class="sv ${missingOut>0?"bad":""}">${missingOut}</span></td>
  <td><span class="sl">Avg Working Hrs</span><span class="sv">${avg}</span></td>
  <td class="bad"><span class="sl">Absent Employees</span><span class="sv bad">${absentEmps}</span></td>
  <td class="bad"><span class="sl">Total Absent Days</span><span class="sv bad">${absentDays}</span></td>
</tr></table>
<hr>
<table class="mt">
  <thead><tr>
    <th>#</th><th>Date</th><th>Emp ID</th><th>Photo</th>
    <th style="text-align:left;padding-left:5px;">Name</th>
    <th style="text-align:left;">Designation</th>
    <th>Shift</th><th>S.In</th><th>S.Out</th>
    <th>Check In</th><th>IN Img</th><th>IN Loc</th>
    <th>Check Out</th><th>OUT Img</th><th>OUT Loc</th>
    <th>Hrs</th>
  </tr></thead>
  <tbody>${checkinRows}</tbody>
</table>
${this.absent.length ? `
<div class="absent-hdr">
  <span class="absent-hdr-c">${absentEmps} employees · ${absentDays} days</span>
  <div class="absent-hdr-t">&#128683; Absent Employees</div>
  <div class="absent-hdr-s">No check-in record during the selected date range</div>
</div>
<table class="at">
  <thead><tr>
    <th>#</th><th>Photo</th>
    <th style="text-align:left;">Emp ID</th>
    <th style="text-align:left;">Name</th>
    <th style="text-align:left;">Designation</th>
    <th style="text-align:left;">Department</th>
    <th>Days</th>
    <th style="text-align:left;">Absent Dates</th>
  </tr></thead>
  <tbody>${absentRows}</tbody>
</table>` : ""}
<table class="ft"><tr>
  <td class="fl">${company} — Confidential</td>
  <td class="fc">Checkin: ${d.length} | Absent Emp: ${absentEmps} | Absent Days: ${absentDays}</td>
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
        if (!this.data.length && !this.absent.length) {
            frappe.msgprint(__("No data to export.")); return;
        }
        const filters = this._get_filters();
        const esc = v => `"${String(v == null ? "" : v).replace(/"/g, '""')}"`;

        // Sheet 1 — checkin data
        const cols1 = ["Date","Employee ID","Employee Name","Designation","Department","Shift","Shift Start","Shift End","Check In","IN Location","Check Out","OUT Location","Working Hours"];
        const flds1 = ["date","employee","employee_name","designation","department","shift","shift_in_time","shift_out_time","check_in_time","in_log_location","check_out_time","out_log_location","working_hours"];
        const lines1 = [cols1.map(esc).join(","), ...this.data.map(r => flds1.map(f => esc(f === "date" ? this._fmt_date(r[f]) : r[f])).join(","))];

        // Sheet 2 — absent employees
        const cols2 = ["Employee ID","Employee Name","Designation","Department","Absent Days","Absent Dates"];
        const lines2 = [cols2.map(esc).join(","), ...this.absent.map(r => [
            esc(r.employee), esc(r.employee_name), esc(r.designation),
            esc(r.department), esc(r.absent_count),
            esc((r.absent_dates || []).map(d => this._fmt_date(d)).join(", ")),
        ].join(","))];

        const csv = "\ufeff" +
            "=== CHECKIN RECORDS ===\r\n" + lines1.join("\r\n") +
            "\r\n\r\n=== ABSENT EMPLOYEES ===\r\n" + lines2.join("\r\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement("a");
        a.href = url;
        a.download = `Employee_Checkin_${filters.from_date || "all"}_to_${filters.to_date || "all"}.csv`;
        document.body.appendChild(a); a.click();
        document.body.removeChild(a); URL.revokeObjectURL(url);
        frappe.show_alert({ message: __("Excel file downloaded"), indicator: "green" });
    }
}
