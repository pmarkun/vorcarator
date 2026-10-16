"""Gera o fallback da extensão, o ZIP de distribuição e o site do Pages."""
from pathlib import Path
import json, shutil, subprocess, zipfile
root = Path(__file__).resolve().parent.parent
ext = root / 'vocarator'
data = json.loads((ext / 'base-inicial.json').read_text())
(ext / 'data.js').write_text('globalThis.VORCARO_DATA = ' + json.dumps(data, ensure_ascii=False, indent=2) + ';\n')
subprocess.run(['node', '--test', *map(str, sorted((root/'tests').glob('*.test.cjs')))], check=True)
site = root / '_site'
if site.exists(): shutil.rmtree(site)
site.mkdir()
for f in ext.iterdir():
    if f.suffix in {'.html', '.css', '.js', '.json'}: shutil.copy2(f, site/f.name)
shutil.copy2(ext/'sobre.html', site/'index.html')
(site/'.nojekyll').touch()
(root/'dist').mkdir(exist_ok=True)
with zipfile.ZipFile(root/'dist/vocarator.zip', 'w', zipfile.ZIP_DEFLATED) as z:
    for f in sorted(ext.iterdir()):
        if f.is_file(): z.write(f, 'vocarator/'+f.name)
print('Pronto: dist/vocarator.zip e _site/index.html')
