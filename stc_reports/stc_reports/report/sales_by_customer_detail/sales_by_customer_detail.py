# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# License: GNU General Public License v3. See license.txt


import frappe
from frappe import _, msgprint, qb
from frappe.query_builder import Criterion

from erpnext import get_company_currency


def execute(filters=None):
	if not filters:
		filters = {}

	columns = get_columns(filters)
	entries = get_entries(filters)
	item_details = get_item_details()
	data = []

	company_currency = get_company_currency(filters.get("company"))

	for d in entries:
		if d.stock_qty > 0 or filters.get("show_return_entries", 0):
			contribution_qty = (
				(d.stock_qty * d.allocated_percentage / 100)
				if d.allocated_percentage is not None
				else None
			)
			data.append(
				[
					d.name,
					d.customer,
					d.territory,
					d.warehouse,
					d.posting_date,
					d.item_code,
					item_details.get(d.item_code, {}).get("item_group"),
					item_details.get(d.item_code, {}).get("brand"),
					d.stock_qty,
					d.base_net_amount,
					d.sales_person,
					d.allocated_percentage,
					contribution_qty,
					d.contribution_amt,
					company_currency,
				]
			)

	if data:
		total_row = [""] * len(data[0])
		data.append(total_row)

	return columns, data


def get_columns(filters):
	if not filters.get("doc_type"):
		msgprint(_("Please select the document type first"), raise_exception=1)

	columns = [
		{
			"label": _(filters["doc_type"]),
			"options": filters["doc_type"],
			"fieldname": frappe.scrub(filters["doc_type"]),
			"fieldtype": "Link",
			"width": 140,
		},
		{
			"label": _("Customer"),
			"options": "Customer",
			"fieldname": "customer",
			"fieldtype": "Link",
			"width": 140,
		},
		{
			"label": _("Territory"),
			"options": "Territory",
			"fieldname": "territory",
			"fieldtype": "Link",
			"width": 140,
		},
		{
			"label": _("Warehouse"),
			"options": "Warehouse",
			"fieldname": "warehouse",
			"fieldtype": "Link",
			"width": 140,
		},
		{"label": _("Posting Date"), "fieldname": "posting_date", "fieldtype": "Date", "width": 140},
		{
			"label": _("Item Code"),
			"options": "Item",
			"fieldname": "item_code",
			"fieldtype": "Link",
			"width": 140,
		},
		{
			"label": _("Item Group"),
			"options": "Item Group",
			"fieldname": "item_group",
			"fieldtype": "Link",
			"width": 140,
		},
		{
			"label": _("Brand"),
			"options": "Brand",
			"fieldname": "brand",
			"fieldtype": "Link",
			"width": 140,
		},
		{"label": _("SO Total Qty"), "fieldname": "qty", "fieldtype": "Float", "width": 140},
		{
			"label": _("Amount"),
			"options": "currency",
			"fieldname": "amount",
			"fieldtype": "Currency",
			"width": 140,
		},
		{
			"label": _("Sales Person"),
			"options": "Sales Person",
			"fieldname": "sales_person",
			"fieldtype": "Link",
			"width": 140,
		},
		{"label": _("Contribution %"), "fieldname": "contribution", "fieldtype": "Float", "width": 140},
		{
			"label": _("Contribution Qty"),
			"fieldname": "contribution_qty",
			"fieldtype": "Float",
			"width": 140,
		},
		{
			"label": _("Contribution Amount"),
			"options": "currency",
			"fieldname": "contribution_amt",
			"fieldtype": "Currency",
			"width": 140,
		},
		{
			"label": _("Currency"),
			"options": "Currency",
			"fieldname": "currency",
			"fieldtype": "Link",
			"hidden": 1,
		},
	]

	return columns


def get_entries(filters):
	date_field = "transaction_date" if filters["doc_type"] == "Sales Order" else "posting_date"
	qty_field = "delivered_qty" if filters["doc_type"] == "Sales Order" else "qty"
	conditions, values = get_conditions(filters, date_field)

	entries = frappe.db.sql(
		"""
		SELECT
			dt.name, dt.customer, dt.territory, dt.{date_field} as posting_date, dt_item.item_code,
			st.sales_person, st.allocated_percentage, dt_item.warehouse,
			CASE
				WHEN dt.status = "Closed" THEN dt_item.{qty_field} * dt_item.conversion_factor
				ELSE dt_item.stock_qty
			END as stock_qty,
			CASE
				WHEN dt.status = "Closed" THEN (dt_item.base_net_rate * dt_item.{qty_field} * dt_item.conversion_factor)
				ELSE dt_item.base_net_amount
			END as base_net_amount,
			CASE
				WHEN dt.status = "Closed" AND st.sales_person IS NOT NULL
					THEN (dt_item.base_net_rate * dt_item.{qty_field} * dt_item.conversion_factor) * st.allocated_percentage / 100
				WHEN dt.status != "Closed" AND st.sales_person IS NOT NULL
					THEN dt_item.base_net_amount * st.allocated_percentage / 100
				ELSE NULL
			END as contribution_amt
		FROM
			`tab{doc_type}` dt
			INNER JOIN `tab{doc_type} Item` dt_item ON dt.name = dt_item.parent
			LEFT JOIN `tabSales Team` st ON st.parent = dt.name AND st.parenttype = %s
		WHERE
			dt.docstatus = 1
			{conditions}
		ORDER BY dt.name DESC, st.sales_person
		""".format(
			date_field=date_field,
			qty_field=qty_field,
			doc_type=filters["doc_type"],
			conditions=conditions,
		),
		tuple([filters["doc_type"], *values]),
		as_dict=1,
	)

	return entries


def get_conditions(filters, date_field):
	conditions = []
	values = []

	for field in ["company", "customer", "territory"]:
		if filters.get(field):
			conditions.append(f"dt.{field} = %s")
			values.append(filters[field])

	# Only filter by sales_person when the filter is explicitly applied
	if filters.get("sales_person"):
		lft, rgt = frappe.get_value("Sales Person", filters["sales_person"], ["lft", "rgt"])
		conditions.append(
			f"""EXISTS (
				SELECT name FROM `tabSales Person`
				WHERE lft >= {lft} AND rgt <= {rgt} AND name = st.sales_person
			)"""
		)

	if filters.get("from_date"):
		conditions.append(f"dt.{date_field} >= %s")
		values.append(filters["from_date"])

	if filters.get("to_date"):
		conditions.append(f"dt.{date_field} <= %s")
		values.append(filters["to_date"])

	items = get_items(filters)
	if items:
		conditions.append("dt_item.item_code IN (%s)" % ", ".join(["%s"] * len(items)))
		values += items
	else:
		conditions.append("dt_item.item_code IS NULL")

	condition_str = ("AND " + " AND ".join(conditions)) if conditions else ""
	return condition_str, values


def get_items(filters):
	item = qb.DocType("Item")

	item_query_conditions = []
	if filters.get("item_group"):
		item_group = qb.DocType("Item Group")
		lft, rgt = frappe.db.get_all(
			"Item Group", filters={"name": filters.get("item_group")}, fields=["lft", "rgt"], as_list=True
		)[0]
		item_group_query = (
			qb.from_(item_group)
			.select(item_group.name)
			.where((item_group.lft >= lft) & (item_group.rgt <= rgt))
		)
		item_query_conditions.append(item.item_group.isin(item_group_query))
	if filters.get("brand"):
		item_query_conditions.append(item.brand == filters.get("brand"))
	if filters.get("item_code"):
		item_query_conditions.append(item.name == filters.get("item_code"))

	items = qb.from_(item).select(item.name).where(Criterion.all(item_query_conditions)).run()
	return items


def get_item_details():
	item_details = {}
	for d in frappe.db.sql("""SELECT `name`, `item_group`, `brand` FROM `tabItem`""", as_dict=1):
		item_details.setdefault(d.name, d)

	return item_details