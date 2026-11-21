"""index.html と data/*.js を 1 つの HTML ファイルにまとめる。

使い方（リポジトリのルートで実行）:
    python3 tools/build_standalone.py
出力: dist/br-assistant.html（メールで送ったり、そのまま開いて確認したりするため）
"""
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
html = (ROOT / "index.html").read_text(encoding="utf-8")
for name in ("catalog", "knowledge"):
    tag = f'<script src="data/{name}.js"></script>'
    js = (ROOT / "data" / f"{name}.js").read_text(encoding="utf-8")
    assert tag in html, f"{tag} が index.html にありません"
    html = html.replace(tag, "<script>\n" + js.replace("</script", "<\\/script") + "\n</script>")
out = ROOT / "dist" / "br-assistant.html"
out.parent.mkdir(exist_ok=True)
out.write_text(html, encoding="utf-8")
print(f"{out.relative_to(ROOT)} ({len(html.encode('utf-8')) // 1024} KB)")
