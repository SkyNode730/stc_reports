import frappe
import json
from frappe.utils import get_files_path
import base64
import mimetypes
import os
import hashlib
from datetime import timedelta

_IMAGE_CACHE_TTL = 3600


@frappe.whitelist()
def get_visit_data(filters):
    if isinstance(filters, str):
        filters = json.loads(filters)

    filters = dict(filters)
    conditions = _get_conditions(filters)

    query = """
        SELECT
            v.name                          AS visit_id,
            v.customer_name,
            c.customer_name                 AS customer_display_name,
            v.date,
            v.time,
            v.visit_type,
            v.custom_log_location,
            v.description,
            v.employee                                          AS employee_id,
            v.custom_employee_name,
            e.employee_name,
            COALESCE(NULLIF(e.image,''), u.user_image)          AS employee_photo,
            v.visit_proof
        FROM `tabVisit` v
        LEFT JOIN `tabCustomer`  c ON c.name = v.customer_name
        LEFT JOIN `tabEmployee`  e ON e.name = v.employee
        LEFT JOIN `tabUser`      u ON u.name = e.user_id
        WHERE 1=1 {conditions}
        ORDER BY v.date DESC, v.time DESC
    """.format(conditions=conditions)

    rows = frappe.db.sql(query, filters, as_dict=True)

    image_paths = set()
    for row in rows:
        for field in ("employee_photo", "visit_proof"):
            v = row.get(field)
            if v:
                image_paths.add(v)

    image_map = {p: _file_to_data_uri(p) for p in image_paths}

    for row in rows:
        for field in ("employee_photo", "visit_proof"):
            v = row.get(field)
            if v:
                row[field] = image_map.get(v)

        if row.get("date") and hasattr(row["date"], "strftime"):
            row["date"] = row["date"].strftime("%Y-%m-%d")

        if row.get("time") is not None:
            row["time"] = _td_to_time_str(row["time"])

    return rows


# ── private helpers ──────────────────────────────────────────────────────────

def _get_conditions(filters):
    c = ""
    if not filters:
        return c
    if filters.get("customer"):
        c += " AND v.customer_name = %(customer)s"
    if filters.get("employee"):
        c += " AND v.employee = %(employee)s"
    if filters.get("visit_type"):
        c += " AND v.visit_type = %(visit_type)s"
    if filters.get("from_date"):
        c += " AND v.date >= %(from_date)s"
    if filters.get("to_date"):
        c += " AND v.date <= %(to_date)s"
    return c


def _file_to_data_uri(file_path):
    if not file_path:
        return None
    if file_path.startswith(("http://", "https://")):
        return file_path

    cache_key = "cv_img_v1_" + hashlib.md5(file_path.encode()).hexdigest()
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
            if raw[:4] == b'\x89PNG':
                mime = "image/png"
            elif raw[:3] == b'\xff\xd8\xff':
                mime = "image/jpeg"
                
            elif raw[:6] in (b'GIF87a', b'GIF89a'):
                mime = "image/gif"
            elif raw[:4] == b'RIFF' and raw[8:12] == b'WEBP':
                mime = "image/webp"
            else:
                mime = "image/jpeg"

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


def _td_to_time_str(td):
    if td is None:
        return None
    if isinstance(td, timedelta):
        s = int(td.total_seconds())
        h, r = divmod(s, 3600)
        m, sec = divmod(r, 60)
        return "{:02d}:{:02d}:{:02d}".format(h, m, sec)
    return str(td)
