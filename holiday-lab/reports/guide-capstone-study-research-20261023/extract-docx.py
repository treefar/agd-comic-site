import zipfile,xml.etree.ElementTree as E,json,pathlib
base=pathlib.Path(r"C:/agywork/agd-holiday-prototypes/holiday-lab/reports/guide-capstone-study-research-20261023")
ns={"w":"http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
for name in ["capstone-rule","capstone-group","capstone-change"]:
 with zipfile.ZipFile(base/"raw"/(name+".docx")) as z:
  root=E.fromstring(z.read("word/document.xml")); body=root.find("w:body",ns)
  rows=[]
  for el in body:
   if el.tag.endswith("}p"):
    t="".join(el.itertext()) if False else "".join(n.text or "" for n in el.findall(".//w:t",ns))
    if t.strip(): rows.append({"type":"paragraph","text":t})
   elif el.tag.endswith("}tbl"):
    rows.append({"type":"table","rows":[["".join(n.text or "" for n in c.findall(".//w:t",ns)) for c in r.findall("w:tc",ns)] for r in el.findall("w:tr",ns)]})
  (base/"raw"/(name+"-xml.json")).write_text(json.dumps(rows,ensure_ascii=False,indent=2),encoding="utf-8")
 print(name,len(rows))
