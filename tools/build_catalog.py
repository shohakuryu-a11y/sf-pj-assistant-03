"""テナントのメタデータから data/catalog.js（スキーマ 2）を作る。

使い方（リポジトリのルートで実行）:
    python tools/build_catalog.py                 # demo_data を読む
    python tools/build_catalog.py path/to/dir     # 別のテナントのフォルダを読む

入力フォルダのファイル:
    metadata_ja.xml, metadata_en.xml   OData $metadata（日本語・英語ラベル）。必須
    picklists.json                     PickListV2 と値（親 picklist・親の値を含む）
    event_reasons.json                 FOEventReason のレコード
    records.json                       Foundation Object / Generic Object / MDF のレコード（任意）
    users.json                         User のレコード（任意）
    overlay.json                       オブジェクト区分、event、クロスエンティティ、データ型の補正、
                                       オブジェクト・ピックリスト・項目の意味の説明と同義語（objects / picklists / fields）、
                                       $metadata にないオブジェクト（extraObjects）

データ型の決め方:
    Edm.String + sap:picklist                 → Picklist
    Edm.String + <項目名>Nav のナビゲーション → 参照先の区分により FoundationObject / GenericObject / User
    Edm.String                                → String（overlay の dataTypes で Translatable / AutoNumber に補正）
    Edm.Int32 / Edm.Int64                     → Long
    Edm.Decimal / Edm.Double                  → Decimal
    Edm.DateTime                              → Date
    Edm.DateTimeOffset                        → DateTime
    Edm.Boolean                               → Boolean
    sap:updatable="false" かつ sap:upsertable="false" → 読み取り専用
"""
import datetime
import json
import pathlib
import re
import sys
import xml.etree.ElementTree as ET

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "demo_data"
OUT = ROOT / "data" / "catalog.js"

EDM = "{http://schemas.microsoft.com/ado/2008/09/edm}"
SAP = "{http://www.successfactors.com/edm/sap}"
SCALAR = {
    "Edm.String": "String", "Edm.DateTime": "Date", "Edm.DateTimeOffset": "DateTime", "Edm.Time": "String",
    "Edm.Boolean": "Boolean", "Edm.Int16": "Long", "Edm.Int32": "Long", "Edm.Int64": "Long",
    "Edm.Decimal": "Decimal", "Edm.Double": "Decimal", "Edm.Single": "Decimal",
}


def read_metadata(path):
    root = ET.parse(path).getroot()
    assoc = {}
    for a in root.iter(EDM + "Association"):
        assoc[a.get("Name")] = {e.get("Role"): (e.get("Type").split(".")[-1], e.get("Multiplicity")) for e in a.iter(EDM + "End")}
    entities = {}
    for et in root.iter(EDM + "EntityType"):
        props = {}
        for p in et.iter(EDM + "Property"):
            props[p.get("Name")] = {
                "label": p.get(SAP + "label", p.get("Name")),
                "edm": p.get("Type"),
                "picklist": p.get(SAP + "picklist"),
                "required": p.get(SAP + "required") == "true",
                "readOnly": p.get(SAP + "updatable") == "false" and p.get(SAP + "upsertable") == "false",
                "maxLength": int(p.get("MaxLength")) if p.get("MaxLength", "").isdigit() else None,
                "scale": int(p.get("Scale")) if p.get("Scale", "").isdigit() else None,
            }
        navs = {}
        for n in et.iter(EDM + "NavigationProperty"):
            rel = n.get("Relationship").split(".")[-1]
            target, mult = assoc.get(rel, {}).get(n.get("ToRole"), (None, None))
            if target:
                navs[n.get("Name")] = {"target": target, "many": mult == "*"}
        keys = [k.get("Name") for k in et.iter(EDM + "PropertyRef")]
        entities[et.get("Name")] = {"label": et.get(SAP + "label", et.get("Name")), "props": props, "navs": navs, "keys": keys}
    return entities


def odate(v):
    """OData の /Date(ms)/ を YYYY-MM-DD にする"""
    if not v:
        return None
    m = re.match(r"/Date\((-?\d+)", str(v))
    if not m:
        return str(v)[:10]
    return datetime.datetime.fromtimestamp(int(m.group(1)) / 1000, datetime.timezone.utc).strftime("%Y-%m-%d")


def load(name, default=None):
    p = SRC / name
    return json.loads(p.read_text(encoding="utf-8")) if p.exists() else default


def main():
    ja = read_metadata(SRC / "metadata_ja.xml")
    en = read_metadata(SRC / "metadata_en.xml")
    ov = load("overlay.json", {})
    kinds = ov.get("kinds", {})
    by_kind = ov.get("eventsByKind", {})
    dtypes = ov.get("dataTypes", {})
    parents = ov.get("parentField", {})
    atypes = ov.get("assocTypes", {})
    extra = ov.get("fields", {})

    objects = {}
    for name, ent in ja.items():
        kind = kinds.get(name, "MDF" if name.startswith("cust_") else "EC")
        fields = {}
        for fname, p in ent["props"].items():
            ref = f"{name}.{fname}"
            nav = ent["navs"].get(fname + "Nav")
            f = {"label": p["label"], "en": en.get(name, {}).get("props", {}).get(fname, {}).get("label", p["label"])}
            if p["picklist"]:
                f["dataType"], f["source"] = "Picklist", p["picklist"]
            elif nav:
                tk = kinds.get(nav["target"], "MDF" if nav["target"].startswith("cust_") else "EC")
                f["dataType"] = {"Foundation": "FoundationObject", "User": "User"}.get(tk, "GenericObject")
                f["source"] = nav["target"]
            else:
                f["dataType"] = SCALAR.get(p["edm"], "String")
            if ref in dtypes:
                f["dataType"] = dtypes[ref]
            if f["dataType"] in ("String", "Translatable") and p["maxLength"]:
                f["maxLength"] = p["maxLength"]
            if f["dataType"] == "Decimal" and p["scale"] is not None:
                f["decimals"] = p["scale"]
            if p["required"]:
                f["required"] = True
            if p["readOnly"] or f["dataType"] == "AutoNumber":
                f["readOnly"] = True
            if ref in parents:
                f["parentField"] = parents[ref]
            x = extra.get(ref, {})
            if x.get("desc"):
                f["desc"] = x["desc"]
            if x.get("syn"):
                f["syn"] = x["syn"]
            fields[fname] = f
        assocs = []
        for nname, nav in ent["navs"].items():
            base = nname[:-3] if nname.endswith("Nav") else None
            if base and base in ent["props"]:
                continue  # 項目の参照先（項目の dataType / source で表す）
            assocs.append({"id": nname, "target": nav["target"], "multiplicity": "1:n" if nav["many"] else "1:1",
                           "type": atypes.get(f"{name}.{nname}", "association")})
        meta = ov.get("objects", {}).get(name, {})
        o = {
            "label": ent["label"],
            "en": en.get(name, {}).get("label", ent["label"]),
        }
        if meta.get("desc"):
            o["desc"] = meta["desc"]
        if meta.get("syn"):
            o["syn"] = meta["syn"]
        eff = any(k in ("startDate", "effectiveStartDate") for k in ent["keys"])
        events = list(meta.get("events", by_kind.get(kind, ["onInit", "onChange", "onSave"])))
        # MDF・Generic Object の Insert イベントは、有効日付のあるオブジェクトにだけある
        if "events" not in meta and kind in ("MDF", "GO") and eff and "onInsert" not in events:
            events.append("onInsert")
        o.update({
            "kind": kind,
            "status": "active",
            "effectiveDated": eff,
            "keys": ent["keys"],
            "baseObject": meta.get("baseObject", kind != "User"),
            "events": events,
        })
        if assocs:
            o["associations"] = assocs
        if meta.get("crossWrite"):
            o["crossWrite"] = meta["crossWrite"]
        o["fields"] = fields
        objects[name] = o

    # $metadata にないオブジェクト（入社・再入社の Employee Information など）を overlay から追加する
    for name, x in ov.get("extraObjects", {}).items():
        if not name.startswith("_") and name not in objects:
            objects[name] = x

    picklists = {}
    for pl in load("picklists.json", {"d": {"results": []}})["d"]["results"]:
        vals = {}
        for i, v in enumerate(pl["values"]["results"]):
            x = {"ja": v.get("label_ja_JP", v["externalCode"]), "en": v.get("label_en_US", v["externalCode"]),
                 "status": "A" if v.get("status") == "ACTIVE" else "I"}
            if v.get("parentValue"):
                x["parent"] = v["parentValue"]["externalCode"]
            vals[v["externalCode"]] = x
        item = {"label": pl.get("label_ja_JP", pl["id"]), "en": pl.get("label_en_US", pl["id"]),
                "status": "A" if pl.get("status", "ACTIVE") == "ACTIVE" else "I"}
        note = ov.get("picklists", {}).get(pl["id"], {})
        if note.get("desc"):
            item["desc"] = note["desc"]
        if note.get("syn"):
            item["syn"] = note["syn"]
        if pl.get("parentPickList"):
            item["parent"] = pl["parentPickList"]["id"]
        item["values"] = vals
        picklists[pl["id"]] = item

    records = {}

    def add_records(obj, rows, code_key="externalCode"):
        fields = objects.get(obj, {}).get("fields", {})
        std = {code_key, "startDate", "endDate", "status", "effectiveStartDate"}
        out = {}
        for r in rows:
            rec = {"name": r.get("name_ja_JP", r.get(code_key)), "en": r.get("name_en_US", r.get(code_key)),
                   "status": "I" if r.get("status") in ("I", "inactive", "INACTIVE") else "A"}
            if r.get("startDate"):
                rec["start"] = odate(r["startDate"])
            if r.get("endDate"):
                rec["end"] = odate(r["endDate"])
            attrs = {k: v for k, v in r.items() if k in fields and k not in std}
            if attrs:
                rec["attrs"] = attrs
            out[r[code_key]] = rec
        records[obj] = out

    for obj, data in load("records.json", {}).items():
        add_records(obj, data["d"]["results"])
    ers = load("event_reasons.json")
    if ers:
        add_records("FOEventReason", ers["d"]["results"])
    users = load("users.json")
    if users:
        rows = [{"externalCode": u["userId"], "name_ja_JP": f'{u.get("lastName", "")} {u.get("firstName", "")}'.strip(),
                 "name_en_US": f'{u.get("firstName_en", u.get("firstName", ""))} {u.get("lastName_en", u.get("lastName", ""))}'.strip(),
                 "status": "I" if u.get("status") == "inactive" else "A",
                 **{k: v for k, v in u.items() if k in ("username", "email")}} for u in users["d"]["results"]]
        add_records("User", rows)

    catalog = {
        "schema": 2,
        "tenant": ov.get("tenant", "Tenant"),
        "version": datetime.date.today().isoformat(),
        "settings": ov.get("settings", {"navDepth": 3}),
        "objects": objects,
        "picklists": picklists,
        "records": records,
    }
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(
        "// データモデル（同期レイヤー、スキーマ 2）。tools/build_catalog.py で生成。直接編集してもよい。\n"
        "window.BR_CATALOG = " + json.dumps(catalog, ensure_ascii=False, indent=1) + ";\n",
        encoding="utf-8",
    )
    n = sum(len(o["fields"]) for o in objects.values())
    nr = sum(len(r) for r in records.values())
    print(f"{OUT.relative_to(ROOT)}: {len(objects)} objects, {n} fields, {len(picklists)} picklists, {nr} records")


if __name__ == "__main__":
    main()
