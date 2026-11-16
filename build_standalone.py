"""Rebuild standalone.html after editing the individual HTML/CSS/JS files.
Run: python3 build_standalone.py
Requires Python 3. No packages are required.
"""
from pathlib import Path
import json,re
root=Path(__file__).resolve().parent
wrapper=(root/'standalone.html').read_text(encoding='utf-8')
router=r'''<script>
document.addEventListener('click',function(e){var a=e.target.closest('a[href]');if(!a)return;var href=a.getAttribute('href');if(!href||/^(https?:|mailto:|tel:)/i.test(href))return;if(href[0]==='#'){e.preventDefault();var target=document.getElementById(decodeURIComponent(href.slice(1)));if(target)target.scrollIntoView({block:'start'});return}var match=href.match(/^([a-z0-9-]+)\.html(?:\?[^#]*)?(?:#(.*))?$/i);if(match){e.preventDefault();parent.postMessage({type:'ciscm-route',page:match[1],anchor:match[2]||''},'*')}});
window.addEventListener('message',function(e){if(e.source!==parent||e.data.type!=='ciscm-anchor')return;var el=document.getElementById(e.data.anchor);if(el)el.scrollIntoView({block:'start'})});
</script>'''
pages={}
for path in sorted(root.glob('*.html')):
 if path.name=='standalone.html':continue
 html=path.read_text(encoding='utf-8')
 def stylesheet(match):return '<style>'+ (root/match.group(1)).read_text(encoding='utf-8')+'</style>'
 def script(match):return '<script>'+ (root/match.group(1)).read_text(encoding='utf-8')+'</script>'
 html=re.sub(r'<link rel="stylesheet" href="(assets/[^"]+)">',stylesheet,html)
 html=re.sub(r'<script src="(assets/[^"]+)"></script>',script,html)
 html=html.replace('</body>',router+'</body>')
 pages[path.stem]=html
payload=json.dumps(pages,ensure_ascii=False).replace('<','\\u003c')
start=wrapper.index('<script id="site-pages" type="application/json">')+len('<script id="site-pages" type="application/json">')
end=wrapper.index('</script>',start)
result=wrapper[:start]+payload+wrapper[end:]
(root/'standalone.html').write_text(result,encoding='utf-8')
(root/'standalone-source.txt').write_text(result,encoding='utf-8')
print('Rebuilt standalone.html and standalone-source.txt with',len(pages),'pages.')
