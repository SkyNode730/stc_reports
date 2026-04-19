import frappe
import json
from frappe import _
from frappe.utils import get_files_path
from datetime import timedelta, date as dt_date
import base64
import mimetypes
import os


@frappe.whitelist()
def get_checkin_data(filters):
    if isinstance(filters, str):
        filters = json.loads(filters)

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

    for row in rows:
        row["check_in_time"]  = _dt_to_time_str(row.pop("check_in_dt",  None))
        row["check_out_time"] = _dt_to_time_str(row.pop("check_out_dt", None))
        row["shift_in_time"]  = _td_to_time_str(row.get("shift_in_time"))
        row["shift_out_time"] = _td_to_time_str(row.get("shift_out_time"))

        for field in ("employee_image", "in_attendance_image", "out_attendance_image"):
            if row.get(field):
                row[field] = _file_to_data_uri(row[field])

        if row.get("date") and hasattr(row["date"], "strftime"):
            row["date"] = row["date"].strftime("%Y-%m-%d")

    return rows


@frappe.whitelist()
def get_absent_employees(filters):
    """Return active employees who have NO check-in record for at least one
    date within the selected range, respecting all applicable filters."""
    if isinstance(filters, str):
        filters = json.loads(filters)

    from_date = filters.get("from_date")
    to_date   = filters.get("to_date")
    if not from_date or not to_date:
        return []

    # ── Employee filter conditions ──────────────────────────────────────────
    emp_cond = ""
    if filters.get("employee"):
        emp_cond += " AND e.name = %(employee)s"
    if filters.get("department"):
        emp_cond += " AND e.department = %(department)s"
    if filters.get("designation"):
        emp_cond += " AND e.designation = %(designation)s"
    # Shift: match against employee's default shift (no check-in = no shift record)
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

    # ── Dates that each employee actually checked in ────────────────────────
    checked_in_rows = frappe.db.sql("""
        SELECT DISTINCT ec.employee, DATE(ec.time) AS date
        FROM `tabEmployee Checkin` ec
        WHERE DATE(ec.time) BETWEEN %(from_date)s AND %(to_date)s
    """, filters, as_dict=True)

    checked_in_set = {(r.employee, str(r.date)) for r in checked_in_rows}

    # ── All calendar dates in range ─────────────────────────────────────────
    start = dt_date.fromisoformat(str(from_date))
    end   = dt_date.fromisoformat(str(to_date))
    all_dates = []
    d = start
    while d <= end:
        all_dates.append(str(d))
        d += timedelta(days=1)

    # ── Build absent list ───────────────────────────────────────────────────
    result = []
    for emp in employees:
        absent_dates = [d for d in all_dates if (emp.employee, d) not in checked_in_set]
        if not absent_dates:
            continue
        emp_dict = dict(emp)
        emp_dict["absent_dates"] = absent_dates
        emp_dict["absent_count"] = len(absent_dates)
        emp_dict["employee_image"] = _file_to_data_uri(emp_dict.pop("image", None) or "")
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
        c += " AND DATE(ec.time) >= %(from_date)s"
    if filters.get("to_date"):
        c += " AND DATE(ec.time) <= %(to_date)s"
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
    try:
        is_private = file_path.startswith("/private/")
        if is_private:
            rel_name = file_path[len("/private/files/"):]
        elif file_path.startswith("/files/"):
            rel_name = file_path[len("/files/"):]
        else:
            rel_name = file_path.lstrip("/")

        disk_path = get_files_path(rel_name, is_private=is_private)
        if not os.path.isfile(disk_path):
            return None

        with open(disk_path, "rb") as f:
            raw = f.read()

        mime, _ = mimetypes.guess_type(disk_path)
        if not mime:
            if raw[:4] == b'\x89PNG':            mime = "image/png"
            elif raw[:3] == b'\xff\xd8\xff':     mime = "image/jpeg"
            elif raw[:6] in (b'GIF87a', b'GIF89a'): mime = "image/gif"
            elif raw[:4] == b'RIFF' and raw[8:12] == b'WEBP': mime = "image/webp"
            else:                                mime = "image/jpeg"

        return "data:{};base64,{}".format(mime, base64.b64encode(raw).decode())
    except Exception:
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
