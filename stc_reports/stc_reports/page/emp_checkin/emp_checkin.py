import frappe
import json
from frappe import _
from frappe.utils import get_files_path
from datetime import timedelta, date as dt_date
import base64
import mimetypes
import os
import hashlib

_IMAGE_CACHE_TTL = 3600  # seconds


@frappe.whitelist()
def get_checkin_data(filters):
    if isinstance(filters, str):
        filters = json.loads(filters)

    filters = dict(filters)
    conditions = _get_conditions(filters)
    having = _get_having(filters)

    query = """
        SELECT
            ec.employee,
            e.employee_name,
            e.image                                                          AS employee_image,
            e.designation,
            e.department,
            DATE(ec.time)                                                    AS date,
            MAX(ec.shift)                                                    AS shift,
            MAX(st.start_time)                                               AS shift_in_time,
            MAX(st.end_time)                                                 AS shift_out_time,
            MIN(CASE WHEN ec.log_type = 'IN'  THEN ec.time END)             AS check_in_dt,
            MAX(CASE WHEN ec.log_type = 'OUT' THEN ec.time END)             AS check_out_dt,
            MIN(CASE WHEN ec.log_type = 'IN'  THEN ec.name END)             AS check_in_id,
            MAX(CASE WHEN ec.log_type = 'OUT' THEN ec.name END)             AS check_out_id,
            MIN(CASE WHEN ec.log_type = 'IN'  THEN ec.attendance_image END) AS in_attendance_image,
            MAX(CASE WHEN ec.log_type = 'OUT' THEN ec.attendance_image END) AS out_attendance_image,
            MIN(CASE WHEN ec.log_type = 'IN'  THEN ec.log_location END)     AS in_log_location,
            MAX(CASE WHEN ec.log_type = 'OUT' THEN ec.log_location END)     AS out_log_location,
            ROUND(
                TIMESTAMPDIFF(
                    MINUTE,
                    MIN(CASE WHEN ec.log_type = 'IN'  THEN ec.time END),
                    MAX(CASE WHEN ec.log_type = 'OUT' THEN ec.time END)
                ) / 60.0,
                2
            )                                                                AS working_hours
        FROM
            `tabEmployee Checkin` ec
        LEFT JOIN `tabEmployee`   e  ON e.name  = ec.employee
        LEFT JOIN `tabShift Type` st ON st.name = ec.shift
        WHERE
            1=1 {conditions}
        GROUP BY
            ec.employee, DATE(ec.time)
        HAVING
            1=1 {having}
        ORDER BY
            DATE(ec.time) DESC, ec.employee ASC
    """.format(conditions=conditions, having=having)

    rows = frappe.db.sql(query, filters, as_dict=True)

    # Collect unique image paths and convert each only once per request
    image_paths = set()
    for row in rows:
        for field in ("employee_image", "in_attendance_image", "out_attendance_image"):
            v = row.get(field)
            if v:
                image_paths.add(v)

    image_map = {p: _file_to_data_uri(p) for p in image_paths}

    for row in rows:
        row["check_in_time"]  = _dt_to_time_str(row.pop("check_in_dt",  None))
        row["check_out_time"] = _dt_to_time_str(row.pop("check_out_dt", None))
        row["shift_in_time"]  = _td_to_time_str(row.get("shift_in_time"))
        row["shift_out_time"] = _td_to_time_str(row.get("shift_out_time"))

        for field in ("employee_image", "in_attendance_image", "out_attendance_image"):
            v = row.get(field)
            if v:
                row[field] = image_map.get(v)

        if row.get("date") and hasattr(row["date"], "strftime"):
            row["date"] = row["date"].strftime("%Y-%m-%d")

    return rows


@frappe.whitelist()
def get_absent_employees(filters):
    if isinstance(filters, str):
        filters = json.loads(filters)

    filters = dict(filters)
    from_date = filters.get("from_date")
    to_date   = filters.get("to_date")
    if not from_date or not to_date:
        return []

    emp_cond = ""
    if filters.get("employee"):
        emp_cond += " AND e.name = %(employee)s"
    if filters.get("department"):
        emp_cond += " AND e.department = %(department)s"
    if filters.get("designation"):
        emp_cond += " AND e.designation = %(designation)s"
    if filters.get("shift"):
        emp_cond += " AND e.default_shift = %(shift)s"

    employees = frappe.db.sql("""
        SELECT e.name AS employee, e.employee_name, e.designation,
               e.department, e.image
        FROM `tabEmployee` e
        WHERE e.status = 'Active' {cond}
        ORDER BY e.employee_name ASC
    """.format(cond=emp_cond), filters, as_dict=True)

    if not employees:
        return []

    # Range condition avoids full scan; filter to only the relevant employees
    to_date_next = (dt_date.fromisoformat(str(to_date)) + timedelta(days=1)).isoformat()
    employee_names = tuple(e.employee for e in employees)

    checked_in_rows = frappe.db.sql("""
        SELECT DISTINCT ec.employee, DATE(ec.time) AS date
        FROM `tabEmployee Checkin` ec
        WHERE ec.time >= %(from_date)s AND ec.time < %(to_date_next)s
          AND ec.employee IN %(employee_names)s
    """, {
        "from_date": from_date,
        "to_date_next": to_date_next,
        "employee_names": employee_names,
    }, as_dict=True)

    checked_in_set = {(r.employee, str(r.date)) for r in checked_in_rows}

    start = dt_date.fromisoformat(str(from_date))
    end   = dt_date.fromisoformat(str(to_date))
    all_dates = []
    d = start
    while d <= end:
        all_dates.append(str(d))
        d += timedelta(days=1)

    # Deduplicate employee image conversions
    image_paths = {e.image for e in employees if e.image}
    image_map = {p: _file_to_data_uri(p) for p in image_paths}

    result = []
    for emp in employees:
        absent_dates = [d for d in all_dates if (emp.employee, d) not in checked_in_set]
        if not absent_dates:
            continue
        emp_dict = dict(emp)
        emp_dict["absent_dates"] = absent_dates
        emp_dict["absent_count"] = len(absent_dates)
        emp_dict["employee_image"] = image_map.get(emp_dict.pop("image", None) or "")
        result.append(emp_dict)

    return result


# ── private helpers ──────────────────────────────────────────────────────────

def _get_conditions(filters):
    c = ""
    if not filters:
        return c
    if filters.get("employee"):
        c += " AND ec.employee = %(employee)s"
    if filters.get("department"):
        c += " AND e.department = %(department)s"
    if filters.get("designation"):
        c += " AND e.designation = %(designation)s"
    if filters.get("shift"):
        c += " AND ec.shift = %(shift)s"
    if filters.get("from_date"):
        # Range condition allows MySQL to use an index on `time`
        c += " AND ec.time >= %(from_date)s"
    if filters.get("to_date"):
        to_date_next = (dt_date.fromisoformat(str(filters["to_date"])) + timedelta(days=1)).isoformat()
        filters["_to_date_next"] = to_date_next
        c += " AND ec.time < %(_to_date_next)s"
    return c


def _get_having(filters):
    h = ""
    if not filters:
        return h
    log_type = filters.get("log_type")
    if log_type == "In":
        h += " AND MIN(CASE WHEN ec.log_type = 'IN' THEN ec.time END) IS NOT NULL"
    elif log_type == "Out":
        h += " AND MAX(CASE WHEN ec.log_type = 'OUT' THEN ec.time END) IS NOT NULL"
    return h


def _file_to_data_uri(file_path):
    if not file_path:
        return None
    if file_path.startswith(("http://", "https://")):
        return file_path

    cache_key = "ec_img_v1_" + hashlib.md5(file_path.encode()).hexdigest()
    cached = frappe.cache().get_value(cache_key)
    if cached:
        return cached

    try:
        disk_path = _find_file_on_disk(file_path)
        if not disk_path:
            # File not readable from disk — return URL directly.
            # The browser is already authenticated and Frappe will serve
            # both /files/ and /private/files/ URLs with proper auth checks.
            return file_path

        with open(disk_path, "rb") as f:
            raw = f.read()

        mime, _ = mimetypes.guess_type(disk_path)
        if not mime:
            if raw[:4] == b'\x89PNG':                        mime = "image/png"
            elif raw[:3] == b'\xff\xd8\xff':                 mime = "image/jpeg"
            elif raw[:6] in (b'GIF87a', b'GIF89a'):          mime = "image/gif"
            elif raw[:4] == b'RIFF' and raw[8:12] == b'WEBP': mime = "image/webp"
            else:                                             mime = "image/jpeg"

        result = "data:{};base64,{}".format(mime, base64.b64encode(raw).decode())
        frappe.cache().set_value(cache_key, result, expires_in_sec=_IMAGE_CACHE_TTL)
        return result
    except Exception:
        return file_path  # fallback: let browser fetch with session cookies


def _find_file_on_disk(file_path):
    fp = (file_path or "").strip()

    # Explicit private path  e.g. /private/files/photo.jpg
    if fp.startswith("/private/files/"):
        p = get_files_path(fp[len("/private/files/"):], is_private=True)
        if os.path.isfile(p):
            return p

    # Explicit public path  e.g. /files/photo.jpg
    if fp.startswith("/files/"):
        p = get_files_path(fp[len("/files/"):], is_private=False)
        if os.path.isfile(p):
            return p

    # Unknown / bare path — strip any leading path fragments then try both
    rel = fp.lstrip("/")
    for prefix in ("private/files/", "files/"):
        if rel.startswith(prefix):
            rel = rel[len(prefix):]
            break

    # Try private first (profile pictures are usually private), then public
    for is_priv in (True, False):
        p = get_files_path(rel, is_private=is_priv)
        if os.path.isfile(p):
            return p

    return None


def _dt_to_time_str(dt):
    if not dt:
        return None
    try:
        return dt.strftime("%H:%M:%S")
    except AttributeError:
        return str(dt)


def _td_to_time_str(td):
    if td is None:
        return None
    if isinstance(td, timedelta):
        s = int(td.total_seconds())
        h, r = divmod(s, 3600)
        m, sec = divmod(r, 60)
        return "{:02d}:{:02d}:{:02d}".format(h, m, sec)
    return str(td)
