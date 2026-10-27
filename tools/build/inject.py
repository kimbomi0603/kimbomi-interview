import re,json,sys
import os; SP=os.path.dirname(os.path.abspath(__file__))+'/'
p='/home/claude/kimbomi0603/kimbomi-interview/dashboard.html'
s=open(p,encoding='utf-8').read()
css=open(SP+'v2.css',encoding='utf-8').read(); js=open(SP+'v2.js',encoding='utf-8').read()
P=json.load(open(SP+'parties.json',encoding='utf-8'))
js=js.replace('__PARTIES__',json.dumps(P,ensure_ascii=False).replace('</','<\\/'))
ST=json.load(open(SP+'study.json',encoding='utf-8'))
js=js.replace('__STUDY__',json.dumps(ST,ensure_ascii=False).replace('</','<\\/'))
# remove old css block (+ any previously injected font links)
s=re.sub(r'(<link rel="stylesheet" href="https://cdn\.jsdelivr\.net/gh/orioncactus[^>]*>\n?)?(<link rel="preconnect"[^>]*>)*\n?(<link rel="stylesheet" href="https://fonts\.googleapis[^>]*>\n?)?<style id="v2css">.*?</style>\n?',lambda m:'@@CSS@@',s,count=1,flags=re.S)
s=re.sub(r'<script id="v2js">.*?</script>\n?',lambda m:'@@JS@@',s,count=1,flags=re.S)
assert s.count('@@CSS@@')==1 and s.count('@@JS@@')==1
s=s.replace('@@CSS@@',css).replace('@@JS@@',js)
# 첫 그림부터 새 화면: 머리 안에서 v2 표시 + 옛 화면 숨김, 본문에는 정적 상단바·뼈대
EARLY='<script>if(location.hash!=="#old")document.documentElement.classList.add("v2");</script><style>html.v2 body>header,html.v2 .kwpanel,html.v2 .botnav,html.v2 .ttsp{display:none!important}html.v2 body{background:#f2f4f8}html.v2 .layout{display:block;max-width:1040px;margin:0 auto;padding:28px 20px 56px}</style>'
if 'html.v2 body>header' not in s:
    s=s.replace('</head>',EARLY+'</head>',1)
SHELL='<div id="v2top"><div class="in"><div class="brand"><span>김보미 준비노트</span></div></div></div>'
import re as _re
s=_re.sub(r'<body>\s*(<div id="v2top">.*?</div></div></div>)?',lambda m:'<body>'+SHELL,s,count=1,flags=_re.S)
s=s.replace('document.body.classList.add(\'v2\');top();foot();','document.body.classList.add(\'v2\');document.documentElement.classList.add(\'v2\');top();foot();',1)
s=s.replace("if(OLD){document.body.classList.remove('v2');foot();oldRender();return}","if(OLD){document.body.classList.remove('v2');document.documentElement.classList.remove('v2');const _t=document.getElementById('v2top');if(_t)_t.remove();foot();oldRender();return}",1)
# JSON 페이로드 공백 제거
m2=_re.search(r'(<script id="__payload" type="application/json">)(.*?)(</script>)',s,_re.S)
_P=json.loads(m2.group(2)); raw=json.dumps(_P,ensure_ascii=False,separators=(',',':')).replace('</','<\\/')
s=s[:m2.start(2)]+raw+s[m2.end(2):]
s=s.replace('<title>김보미 발언·준비 대시보드</title>','<title>김보미 준비노트</title>')
open(p,'w',encoding='utf-8').write(s)
allj='\n'.join(m.group(2) for m in re.finditer(r'<script([^>]*)>(.*?)</script>',s,re.S) if 'json' not in m.group(1) and 'src=' not in m.group(1))
open(SP+'chk.js','w').write(allj)
print('ok',len(s))
