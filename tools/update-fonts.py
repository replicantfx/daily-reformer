"""Re-download the self-hosted font subsets.

The app ships only the glyphs it uses. Run this after adding text with new
characters to index.html:

    python tools/update-fonts.py
"""
import os, re, string, urllib.parse, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36"
FAMILIES = [("Bricolage Grotesque", [600, 800], "bricolage"), ("Figtree", [400, 500, 700], "figtree")]

src = open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()
chars = {c for c in src if ord(c) > 126} | set(string.printable.strip()) | {" "} | set("✓…’“”—–·×°")
text = "".join(sorted(chars))

faces = []
for fam, weights, slug in FAMILIES:
    for w in weights:
        url = ("https://fonts.googleapis.com/css2?family=" + urllib.parse.quote(fam)
               + f":wght@{w}&display=swap&text=" + urllib.parse.quote(text))
        css = urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA})).read().decode()
        (font_url,) = re.findall(r"url\((https://[^)]+)\)", css)
        data = urllib.request.urlopen(urllib.request.Request(font_url, headers={"User-Agent": UA})).read()
        name = f"{slug}-{w}.woff2"
        open(os.path.join(ROOT, "fonts", name), "wb").write(data)
        faces.append(f'@font-face{{font-family:"{fam}";font-style:normal;font-weight:{w};font-display:swap;src:url("{name}") format("woff2")}}')
        print(name, len(data), "bytes")

open(os.path.join(ROOT, "fonts", "fonts.css"), "w", encoding="utf-8").write("\n".join(faces) + "\n")
print(len(text), "characters")
