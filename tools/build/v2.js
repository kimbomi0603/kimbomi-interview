<script id="v2js">
/* ===== v2 준비노트 (2026.10.20 개편 · 10.21 디자인·세 정당) — 기존 데이터·편집 기능은 그대로, 보여 주는 방식만 바꾼다 ===== */
(function(){
const E=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const EVENT={title:'연세대 정치외교학과 여야정책토론회',when:'2026-10-27T19:00:00+09:00',date:'10.27(화) 저녁 7시~9시',place:'연세대 연희관 401호',arrive:'18:40 도착',host:'제62대 정치외교학과 학생회 <이륙>',panel:'김성열(전 개혁신당 최고위원, 10.22 이준석 의원 대신 참석 통보) · 박태훈(진보당 청년진보당 전국대학생위원회 준비위원장) · 김보미',agenda:['청년 주거 환경, 무엇을 우선적으로 바꿔야 하는가','열심히 준비해도 취업이 어려운 사회, 청년 일자리 정책은 어디서부터']};
const EVT=[
 ['overview','개요',null],
 ['live','실전 운영판',[[ '진행 방식 확정 · 현장에서 이것만',[3285]]]],
 ['parties','정당 비교',null],
 ['keynote','기조발언',[[ '원고',[3209,3201,3203,3202,3208]]]],
 ['agenda','의제 답변',[[ '의제 1 · 주거',[3275,3204,3277,3278]],['의제 2 · 일자리',[3276,3205,3210,3279]],['이번 국정감사에서 나온 지적',[3280]],['학생회가 묻고 싶다고 한 것',[3206,3207]]]],
 ['rival','상대 대비',[[ '개혁신당 — 김성열 전 최고위원(이준석 의원 대신)',[3281,3282,3283,3284,3211,3212,3213,3214,3215,3216,3217,3219,3218]],['박태훈 위원장',[3221,3222,3223,3224,3225]],['민주당 지적 — 틀린 건 틀렸다',[3231,3232,3233,3234,3235,3236,3237,3238,3239]]]],
 ['qna','예상 질문',[[ '학생 질문',[3241,3242,3243,3244,3245,3246,3247,3248]],['정외과 질문 — 정당·정부형태·청년 정치',[3251,3252,3253,3254,3255]]]],
 ['facts','숫자·정책·사례',[[ '바로 꺼내 쓰는 것',[3261,3262,3263,3264]]]],
 ['day','당일 체크',[[ '행사·당일',[3271,3272,3273,3274]]]]
];
const byNo={};DATA.forEach(d=>byNo[d.no]=d);
let sub='overview',arg='';
const mtype=m=>/토론회/.test(m)?['토론회','r']:/현안|교차점검/.test(m)?['준비·점검','y']:/인사말|기자회견|성명/.test(m)?['연설·회견','p']:/서면|통화|조선일보|한겨레21|한겨레$|이데일리|문화일보|머니투데이|신동아|경향/.test(m)?['신문·서면','g']:['방송·영상',''];
const label=q=>{const m=String(q||'').match(/^【([^】]+)】\s*(.*)$/);return m?[m[1],m[2]||m[1]]:['',q||'']};
const gist=d=>{const s=(d.script||[]);const k=s.find(p=>p.startsWith('★'))||s[0]||((d.quotes||[])[0]||[])[1]||'';return k.replace(/^★\s*/,'')};
function citeP(c){return c?'<p class="cite">출처 · '+E(c)+'</p>':''}
function paras(d){const C=d.cite||[];return (d.script||[]).map((p,i)=>para(p)+citeP(C[i])).join('')}
function para(p){const k=p.startsWith('★');let t=k?p.slice(1).trim():p;const o=/^\(.*\)$/.test(t);return '<p class="sp'+(k?' k':'')+(o?' o':'')+'">'+(k?'<mark>'+E(t)+'</mark>':E(t))+'</p>'}
function detail(d){
  let h='';
  (d.quotes||[]).forEach(x=>h+='<div class="qt">“'+E(x[1])+'” <small>— '+E(x[0])+'</small></div>');
  (d.script||[]).forEach((p,i)=>{h+=para(p)+citeP((d.cite||[])[i])});
  if(d.warn)h+='<div class="wr">⚠️ '+E(d.warn)+'</div>';
  if(d.notes&&d.notes.length)h+='<div class="nt">📝 '+d.notes.map(E).join('<br>📝 ')+'</div>';
  if(d.src&&d.src.length)h+='<div class="sr"><b>🔗 근거·출처</b><br>'+d.src.map(x=>{const own=String(x[1]).charAt(0)==='#';return '<a'+(own?' class="past"':'')+' href="'+E(x[1])+'"'+(own?'':' target="_blank" rel="noopener"')+'>'+E(x[0])+'</a>'}).join('')+'</div>';
  if(d.tags&&d.tags.length)h+='<div class="tg">'+d.tags.map(t=>'<a href="#topic/'+encodeURIComponent(t)+'">#'+E(t)+'</a>').join('')+'</div>';
  h+='<div class="act"><button data-ed="'+d.no+'">✏️ 고치기</button><a href="#card/'+d.no+'">🔗 이 카드만 열기</a><span style="font-size:12px;color:#7a869c;align-self:center">'+E(d.media)+' · #'+d.no+'</span></div>';
  return h;
}
function row(d,open,showMedia){
  const [lb,tt]=label(d.q);
  return '<div class="row'+(open?' open':'')+'" data-no="'+d.no+'"><div class="rh"><span class="no">'+(showMedia?'<span class="badge">'+E(d.media)+'</span>':'#'+d.no)+'</span><div class="tx">'+(lb?'<span class="badge'+(/공격|지적/.test(lb)?' r':/질문/.test(lb)?' g':/기조|의제/.test(lb)?' y':'')+'">'+E(lb)+'</span>':'')+'<div class="tt">'+E(tt)+'</div><div class="gs">'+E(gist(d))+'</div></div><span class="ar">▶</span></div><div class="det">'+(open?detail(d):'')+'</div></div>';
}
function lhColor(t){return /이준석|김성열|개혁신당/.test(t)?'var(--ref)':/박태훈|진보당/.test(t)?'var(--prg)':/민주당/.test(t)?'var(--dem)':'var(--navy2)'}
function list(title,arr,opts){opts=opts||{};arr=arr.filter(Boolean);if(!arr.length)return '';return '<div class="list">'+(title?'<div class="lh"><i style="background:'+lhColor(title)+'"></i>'+E(title)+' <span style="color:#7d8798;font-weight:500;font-size:13.5px">'+arr.length+'건</span></div>':'')+arr.map(d=>row(d,opts.openNo===d.no,opts.media)).join('')+'</div>'}
function bindRows(root){
  root.querySelectorAll('.row .rh').forEach(h=>h.onclick=()=>{const r=h.parentNode;const d=byNo[+r.dataset.no];const det=r.querySelector('.det');if(!r.classList.contains('open')&&!det.innerHTML)det.innerHTML=detail(d);r.classList.toggle('open');bindEd(r)});
  bindEd(root);
}
function bindEd(root){root.querySelectorAll('[data-ed]').forEach(b=>b.onclick=e=>{e.stopPropagation();openEditor(+b.dataset.ed)})}
function dday(){const t=new Date(EVENT.when)-new Date();const d=Math.ceil(t/86400000);return t<-3*3600e3?'종료':d<=0?'D-DAY':'D-'+d}
function main(){return document.getElementById('main')}
const EGG='<svg width="22" height="26" viewBox="0 0 22 26" aria-hidden="true"><path d="M11 1C5.5 1 1 9.2 1 15.2 1 21 5.4 25 11 25s10-4 10-9.8C21 9.2 16.5 1 11 1z" fill="#fff"/><circle cx="11" cy="16" r="4.6" fill="#ffd23f"/></svg>';
function top(){
  let t=document.getElementById('v2top');
  if(!t){t=document.createElement('div');t.id='v2top';document.body.insertBefore(t,document.body.firstChild);}
  const M=[['home','홈'],['event','10.27 토론회'],['study','학습'],['issues','브리핑'],['youth','청년 발언'],['archive','아카이브'],['topics','주제별'],['msg','메시지'],['gov','정책 실시간'],['lib','자료실']];
  const cur=view==='one'||view==='media'?'archive':view==='topic'||view==='search'||view==='kw'?'topics':M.some(x=>x[0]===view)?view:'archive';
  t.innerHTML='<div class="in"><div class="brand" data-go="home" role="link" tabindex="0">'+EGG+'<span>김보미 준비노트<small>토론·인터뷰</small></span></div><nav aria-label="주 메뉴">'+M.map(x=>'<a href="'+(x[0]==='lib'?'index.html':'#'+x[0])+'" class="'+(cur===x[0]?'on':'')+'">'+x[1]+'</a>').join('')+'</nav><div class="qs"><input id="qsi" type="search" autocomplete="off" placeholder="발언 찾기  /" aria-label="발언 찾기"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg><div id="qsdrop" role="listbox"></div></div><div class="tools"><button id="v2t" class="'+(document.body.classList.contains('tts')?'on':'')+'" title="화면 읽어 주기" aria-label="화면 읽어 주기">🔊</button></div></div>';
  t.querySelector('[data-go]').onclick=()=>{location.hash='home'};
  t.querySelector('#v2t').onclick=()=>{document.body.classList.toggle('tts');top()};
  bindQuick(t.querySelector('#qsi'),t.querySelector('#qsdrop'));
}
function foot(){let f=document.getElementById('v2foot');if(!f){f=document.createElement('div');f.id='v2foot';f.className='foot';document.body.appendChild(f)}
  f.innerHTML='<span>발언 카드 '+DATA.length+'건 · 고친 내용은 이 브라우저에 저장됩니다</span><a id="v2ex">💾 편집본 내보내기</a><a id="v2rs">↺ 편집 초기화</a>'+(OLD?'<a href="#home"><b>← 새 화면으로</b></a>':'<a href="#old">옛 화면(전체 탭)</a>')+'';
  f.querySelector('#v2ex').onclick=()=>window.exportEdited();f.querySelector('#v2rs').onclick=resetEdits;}
function searchBox(v){return '<form class="sbox" id="v2f"><input id="v2q" value="'+E(v||'')+'" placeholder="낱말로 찾기 — 예: 기탁금, 폐버스, 청년취업보장제, 정청래"><button>찾기</button></form>'}
function bindSearch(){const f=document.getElementById('v2f');if(!f)return;f.onsubmit=e=>{e.preventDefault();const v=document.getElementById('v2q').value.trim();if(v)location.hash='search/'+encodeURIComponent(v)};
  const i=document.getElementById('v2q');if(i&&!document.getElementById('v2qdrop')){const d=document.createElement('div');d.id='v2qdrop';d.className='homedrop';f.style.position='relative';f.appendChild(d);bindQuick(i,d)}}

/* ---------- 즉시 검색 (상단) ---------- */
let IDX=null;
function buildIdx(){IDX=DATA.map(d=>{const must=(d.script||[]).filter(p=>p.startsWith('★')).map(p=>p.slice(1).trim());const rest=(d.script||[]).filter(p=>!p.startsWith('★'));const qu=(d.quotes||[]).map(x=>x[1]);
  return {d,q:(d.q||'').toLowerCase(),tags:(d.tags||[]).join(' ').toLowerCase(),must,mustL:must.join(' ').toLowerCase(),rest,restL:rest.join(' ').toLowerCase(),qu,quL:qu.join(' ').toLowerCase()}});return IDX}
function qsearch(s,n){const toks=s.toLowerCase().split(/\s+/).filter(Boolean);if(!toks.length)return [];const I=IDX||buildIdx();const out=[];
  for(const e of I){const all=e.q+' '+e.tags+' '+e.mustL+' '+e.restL+' '+e.quL;if(!toks.every(t=>all.includes(t)))continue;let sc=1;
    toks.forEach(t=>{if(e.quL.includes(t))sc+=50;if(e.mustL.includes(t))sc+=40;if(e.restL.includes(t))sc+=22;if(e.tags.includes(t))sc+=30;if(e.q.includes(t))sc+=8});sc+=e.d.no/4000;
    const hit=e.qu.find(x=>toks.some(t=>x.toLowerCase().includes(t)))||e.must.find(x=>toks.some(t=>x.toLowerCase().includes(t)))||e.rest.find(x=>toks.some(t=>x.toLowerCase().includes(t)))||'';
    out.push({e,sc,hit})}
  out.sort((a,b)=>b.sc-a.sc);return out.slice(0,n||10)}
function hlq(t,s){let h=E(t);s.toLowerCase().split(/\s+/).filter(Boolean).forEach(tk=>{const re=new RegExp(tk.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'gi');h=h.replace(re,m=>'<mark>'+m+'</mark>')});return h}
function bindQuick(inp,drop){if(!inp||inp.dataset.b)return;inp.dataset.b=1;let tm=null,sel=-1,cur=[];
  const draw=()=>{const s=inp.value.trim();if(s.length<1){drop.classList.remove('on');drop.innerHTML='';return}
    cur=qsearch(s,10);
    drop.innerHTML=(cur.length?cur.map((r,i)=>{const [lb,tt]=label(r.e.d.q);return '<a class="qi'+(i===sel?' sel':'')+'" href="#card/'+r.e.d.no+'"><b><i>'+E(r.e.d.media)+'</i>'+hlq(tt.slice(0,90),s)+'</b>'+(r.hit?'<span>'+hlq(r.hit.slice(0,160),s)+'</span>':'')+'</a>'}).join(''):'<div class="qe">맞는 발언이 없습니다. 더 짧은 낱말로 찾아 보세요.</div>')+
      '<a class="qall" href="#search/'+encodeURIComponent(s)+'">“'+E(s)+'” 전체 결과 보기 →</a>';drop.classList.add('on')};
  inp.addEventListener('input',()=>{sel=-1;clearTimeout(tm);tm=setTimeout(draw,90)});
  inp.addEventListener('focus',()=>{if(inp.value.trim())draw()});
  inp.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();sel=Math.min(cur.length-1,sel+1);draw()}else if(e.key==='ArrowUp'){e.preventDefault();sel=Math.max(-1,sel-1);draw()}else if(e.key==='Enter'){e.preventDefault();const s=inp.value.trim();if(!s)return;location.hash=sel>=0&&cur[sel]?'card/'+cur[sel].e.d.no:'search/'+encodeURIComponent(s);drop.classList.remove('on');inp.blur()}else if(e.key==='Escape'){drop.classList.remove('on');inp.blur()}});
  drop.addEventListener('mousedown',e=>{const a=e.target.closest('a');if(a){e.preventDefault();location.hash=a.getAttribute('href').slice(1);drop.classList.remove('on');inp.blur()}});
  document.addEventListener('click',e=>{if(!inp.parentNode.contains(e.target))drop.classList.remove('on')});
}
document.addEventListener('keydown',e=>{if(e.key==='/'&&!/input|textarea/i.test(document.activeElement.tagName)){const i=document.getElementById('qsi');if(i){e.preventDefault();i.focus()}}});

/* ---------- 홈 ---------- */
const PCOL={'더불어민주당':'var(--dem)','개혁신당':'var(--ref)','진보당':'var(--prg)'};
function stage(full){
  const d=dday();const left=d==='종료'?'끝났습니다':d==='D-DAY'?'오늘':d.replace('D-','')+'일 남음';
  let h='<section class="stage" aria-label="다음 일정"><div><div class="when">10월 27일 화요일 저녁 7시</div><div class="what">'+E(EVENT.title)+'</div><div class="where">'+E(EVENT.place)+' · '+E(EVENT.arrive)+' · 주최 '+E(EVENT.host)+'</div></div><div class="dd"><b>'+d+'</b><span>'+left+'</span></div>'+
   '<div class="who"><a href="#event/parties/dem"><i style="background:#6f9be0"></i><span><b>김보미</b> <small>더불어민주당</small></span></a><a href="#event/parties/ref"><i style="background:var(--ref)"></i><span><b>김성열</b> <small>전 개혁신당 최고위원</small></span></a><a href="#event/parties/prg"><i style="background:#ff5a62"></i><span><b>박태훈</b> <small>진보당 청년진보당</small></span></a></div>'+
   '<div class="ag"><div><b>의제 1</b>'+E(EVENT.agenda[0])+'</div><div><b>의제 2</b>'+E(EVENT.agenda[1])+'</div></div>';
  if(full)h+='<div class="steps">'+[['live/3285','실전 운영판: 첫 1분·30초 카드'],['keynote','인사말·원고 소리 내 읽기'],['study','학습 · 의제 순서대로'],['parties','정당별 입장 익히기'],['rival','상대 공격 받아치기'],['qna','학생 질문 대비'],['day','당일 체크']].map((x,i)=>'<a href="'+(x[0]==='study'?'#study':'#event/'+x[0])+'"><em>'+(i+1)+'</em>'+x[1]+'</a>').join('')+'</div>';
  return h+'</section>';
}
function vHome(){
  const medias=[...new Set(DATA.map(d=>d.media))];
  let h='<h1 class="pt">무엇을 찾으세요?</h1><p class="lead">지금까지 한 말 '+DATA.length+'건이 모두 여기 있습니다. 낱말을 치면 바로 뜹니다. 위 검색창은 어느 화면에서나 쓸 수 있습니다(단축키 /).</p>'+searchBox('');
  h+=stage(true);
  h+='<div class="sh"><h3>둘러보기</h3></div><div class="golist">'+
   [['#archive','🗂️','발언 아카이브',medias.length+'개 매체에서 한 답변을 매체별로 봅니다.'],
    ['#topics','🏷️','주제별 발언','기탁금, 세대교체처럼 같은 주제로 어디서 무슨 말을 했는지 모아 봅니다.'],
    ['#msg','📣','메시지·공약','슬로건, 연설 핵심 문장, 공약, 프로필.'],
    ['#study','📘','학습','학생회 의제 순서대로: 할 말 → 정부 정책(줄인 것·말 바꾼 것) → 받아치기 → 정당별 장단점 → 숙제.'],
    ['#issues','📰','현안 브리핑','아침·저녁 자동 수집, 월요일 한 주 총정리. 사회 현안을 미리 익힙니다.'],
    ['#gov','📡','정책 실시간','오늘 국회 발표와 청년정책을 받아 주제별로 정리합니다.'],
    ['index.html','🔥','이슈현안 자료실','현안마다 초등학생 눈높이부터 예상 질답까지 다섯 단계.'],
    ['debate-yonsei-study.html','📚','토론 공부방','정부 청년정책 최근순, 지방·해외 사례, 정당·정부형태 비교.']].map(x=>'<a href="'+x[0]+'"><span class="ic">'+x[1]+'</span><span><b>'+x[2]+'</b><span>'+E(x[3])+'</span></span></a>').join('')+'</div>';
  h+='<div class="sh"><h3>최근 인터뷰</h3><a href="#archive">전체 '+medias.length+'곳</a></div><div class="grid g4">'+MEDIAS.slice(0,4).map(md=>{const n=DATA.filter(d=>d.media===md).length;const t=mtype(md);return '<a class="tile" href="#media/'+encodeURIComponent(md)+'"><span class="badge '+t[1]+'">'+t[0]+'</span><h4>'+E(md)+'</h4><span class="n">'+n+'건</span></a>'}).join('')+'</div>';
  main().innerHTML=h;bindSearch();
}
/* ---------- 이번 토론회 ---------- */
function vEvent(){
  if(!EVT.some(x=>x[0]===sub))sub='overview';
  let h='<div class="crumb"><a href="#home">홈</a> › 10.27 토론회</div><h1 class="pt">연세대 정치외교학과 여야정책토론회</h1><p class="lead">줄을 누르면 답변 전문과 근거가 펼쳐집니다. 노란 형광펜이 꼭 할 말, 흐린 괄호 문장은 시간이 모자라면 뺄 말입니다.</p>';
  h+='<nav class="tabs" aria-label="토론 준비">'+EVT.map(x=>{const n=x[2]?x[2].reduce((a,g)=>a+g[1].length,0):0;return '<a href="#event/'+x[0]+'" class="'+(sub===x[0]?'on':'')+'">'+x[1]+(n?'<span>'+n+'</span>':'')+'</a>'}).join('')+'</nav>';
  const T=EVT.find(x=>x[0]===sub);
  if(sub==='overview'){
    h+=stage(true);
    h+='<div class="sh"><h3>세 문장만 기억하기</h3></div><div class="msg">청년은 방을 얻을 때도, 첫 일자리를 얻을 때도 보증금을 냅니다. 경력이라는 보증금입니다.<small>기조발언의 중심 비유</small></div><div class="msg">정답은 정당에 있지 않습니다. 국민에게 있습니다. 틀린 건 우리 당이어도 틀렸다고 하겠습니다.<small>민주당 지적이 나올 때의 원칙</small></div><div class="msg">공공이 가진 방부터, 첫 일자리 보증금은 나라가, 청년 예산은 청년이 직접.<small>세 가지 제안</small></div>';
    h+='<div class="sh"><h3>숫자 여섯 개</h3><span>헷갈릴 때 여기만</span></div><div class="nstrip">'+NUM6.map(n=>'<a href="#card/'+n[2]+'"><b>'+n[0]+'</b><span>'+n[1]+'</span></a>').join('')+'</div>';
    h+='<div class="callout r"><b>진행 방식 확정(10.26 통화)</b> 사회자가 의제 설명·발제 → 의제별 약 15분 자유토론 × 2. 발언 순서·시간 배정 없음 → 한 번에 30초~1분. <a href="#event/live/3285">실전 운영판 보기 →</a><br><b>김보미가 정할 것</b> 정년 연장 입장(지금은 조건부 안).</div>';
    h+='<div class="sh"><h3>함께 보면 좋은 것</h3></div><div class="golist">'+[['debate-yonsei-study.html','📚','공부방','정부 청년·대학생 정책 최근순, 지방정부·해외 우수사례, 정당·대통령제 비교.'],['report-nec-2026.html','📑','선관위 보고서 읽기','학생회가 의제 근거로 든 1,711쪽 보고서 — 발췌 PDF, 건별 요약, 인용 숫자 대조.'],['debate-yonsei-20261027.html','🗂️','토론 준비실','현안 다섯 단계 설명, 연세대 정외과 동문 정치인, 학생회 현황.'],['#gov','📡','정책 실시간','오늘 국회·청년정책 발표 자동 정리.'],['#youth','🗣️','청년 발언 모음','그동안 방송·인터뷰에서 한 청년 관련 말을 원문 그대로. 일자리·주거·모병제·청년 정치별로.']].map(x=>'<a href="'+x[0]+'"><span class="ic">'+x[1]+'</span><span><b>'+x[2]+'</b><span>'+x[3]+'</span></span></a>').join('')+'</div>';
  }else if(sub==='parties'){
    h+=vParties();
  }else if(sub==='keynote'){
    const g=byNo[3209],k=byNo[3201];
    if(g)h+='<div class="sh"><h3>1. 인사말 · 자기소개</h3><span>학생회 임원·토론자 이름 부르기 · 약 1분</span></div><article class="read"><div class="meta">'+E((g.notes||[])[0]||'')+'</div>'+paras(g)+(g.warn?'<div class="wr">⚠️ '+E(g.warn)+'</div>':'')+'</article>';
    h+='<div class="sh"><h3>2. 기조발언 · 약 3분</h3></div><article class="read"><div class="meta">'+E((k.notes||[])[0]||'')+'</div>'+paras(k)+(k.warn?'<div class="wr">⚠️ '+E(k.warn)+'</div>':'')+'</article>';
    h+=list('압축본 · 근거표 · 그동안 한 말 · 인사말 카드',[3203,3202,3208,3209].map(n=>byNo[n]));
  }else{
    T[2].forEach(g=>{h+=list(g[0],g[1].map(n=>byNo[n]),{openNo:+arg||0})});
  }
  main().innerHTML=h;bindRows(main());
  if(sub==='parties'&&arg){const el=document.getElementById('p-'+arg);if(el)setTimeout(()=>el.scrollIntoView({behavior:'smooth',block:'start'}),60)}
  else if(+arg){const r=main().querySelector('.row[data-no="'+arg+'"]');if(r)setTimeout(()=>r.scrollIntoView({behavior:'smooth',block:'start'}),60)}
}
/* ---------- 세 정당 ---------- */
const PARTIES=__PARTIES__;
function srcA(s){return s&&s.length?'<small>'+s.map(x=>'<a href="'+E(x[1])+'" target="_blank" rel="noopener">'+E(x[0])+'</a>').join(' · ')+'</small>':''}
function vParties(){
  const P=PARTIES;const byId={};P.parties.forEach(p=>byId[p.id]=p);
  const card=p=>'<div class="pcard" id="p-'+p.id+'" style="--c:'+p.color+'"><h4>'+E(p.name)+'</h4><div class="who">'+E(p.who)+'</div><p class="line">'+E(p.line)+'</p><dl>'+p.facts.map(f=>'<dt>'+E(f[0])+'</dt><dd>'+E(f[1])+srcA(f[2])+'</dd>').join('')+'</dl></div>';
  let h='<p class="lead">'+E(P.intro)+' <span style="color:#7d8798">('+E(P.asof)+' 기준)</span></p>';
  h+='<div class="sh" style="margin-top:6px"><h3>토론에 나오는 세 정당</h3></div><div class="pty">'+P.parties.slice(0,3).map(card).join('')+'</div>';
  h+='<div class="sh"><h3>그 밖의 정당</h3><span>학생 질문에 나올 수 있음</span></div><div class="pty">'+P.parties.slice(3).map(card).join('')+'</div>';
  h+='<div class="callout">바로 가기: '+P.tables.map((t,i)=>'<a href="javascript:void 0" data-pt="'+i+'">'+E(t.title)+'</a>').join(' · ')+' · '+P.play.map(s=>'<a href="javascript:void 0" data-pp="'+s.id+'">'+E(s.title)+'</a>').join(' · ')+'</div>';
  P.tables.forEach((t,i)=>{const cols=t.cols.map(c=>byId[c]);
    h+='<div class="sh" id="pt-'+i+'"><h3>'+E(t.title)+'</h3>'+(t.note?'<span>'+E(t.note)+'</span>':'')+'</div><div style="overflow-x:auto"><table class="cmp"><thead><tr><th></th>'+cols.map(p=>'<th class="p" style="--c:'+p.color+'">'+E(p.short)+'</th>').join('')+'</tr></thead><tbody>'+t.rows.map(r=>'<tr><td class="k">'+E(r[0])+'</td>'+r.slice(1).map(c=>'<td'+(c[0]==='미확인'||/^미확인/.test(c[0])?' style="color:#9aa3b2"':'')+'>'+E(c[0])+srcA(c[1])+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';
  });
  P.play.forEach(s=>{
    h+='<div class="sh" id="p-'+s.id+'-play"><h3>'+E(s.title)+'</h3><span>'+E(s.sub)+'</span></div><div class="list">'+s.items.map(it=>'<div class="row"><div class="rh"><span class="no"><span class="badge'+(it[0]==='공략'||it[0]==='짚기'?' r':it[0]==='받기'?' y':it[0]==='연대'||it[0]==='지킬 것'?' g':'')+'">'+E(it[0])+'</span></span><div class="tx"><div class="tt">'+E(it[1])+'</div><div class="gs">'+E(it[2])+'</div></div><span class="ar">▶</span></div><div class="det"><p class="sp k"><mark>'+E(it[2])+'</mark></p>'+(it[3]?'<div class="nt">📝 '+E(it[3])+'</div>':'')+(it[4]&&it[4].length?'<div class="sr"><b>🔗 근거</b><br>'+it[4].map(x=>{const own=String(x[1]).charAt(0)==='#';return '<a'+(own?' class="past"':'')+' href="'+E(x[1])+'"'+(own?'':' target="_blank" rel="noopener"')+'>'+E(x[0])+'</a>'}).join('')+'</div>':'')+'</div></div>').join('')+'</div>';
  });
  if(P.caveat)h+='<div class="callout">'+E(P.caveat)+'</div>';
  setTimeout(()=>{main().querySelectorAll('[data-pt]').forEach(a=>a.onclick=()=>document.getElementById('pt-'+a.dataset.pt).scrollIntoView({behavior:'smooth'}));main().querySelectorAll('[data-pp]').forEach(a=>a.onclick=()=>document.getElementById('p-'+a.dataset.pp+'-play').scrollIntoView({behavior:'smooth'}))},0);
  return h;
}

function secOf(no){for(const x of EVT)if(x[2])for(const g of x[2])if(g[1].includes(no))return x[0];return 'overview'}
/* ---------- 아카이브 ---------- */
function vArchive(){
  const groups={};MEDIAS.concat([...new Set(DATA.map(d=>d.media))].filter(m=>!MEDIAS.includes(m))).forEach(m=>{const t=mtype(m)[0];(groups[t]=groups[t]||[]).push(m)});
  let h='<div class="crumb"><a href="#home">홈</a> › 발언 아카이브</div><h1 class="pt">발언 아카이브</h1><p class="lead">매체·행사별로 실제 답변과 준비 답변을 모았습니다. 위쪽이 최근입니다. 매체를 누르면 질문 목록이 나오고, 질문을 누르면 답변 전문이 펼쳐집니다.</p>'+searchBox('');
  ['토론회','방송·영상','신문·서면','연설·회견','준비·점검'].forEach(t=>{const L=groups[t]||[];if(!L.length)return;
    h+='<div class="sh"><h3>'+t+'</h3><span>'+L.length+'곳</span></div><div class="grid g4">'+L.map(md=>{const n=DATA.filter(d=>d.media===md).length;const f=DATA.find(d=>d.media===md);return '<a class="tile" href="#media/'+encodeURIComponent(md)+'"><h4>'+E(md)+'</h4><p>'+E(f?(/^★/.test(label(f.q)[1])?label(f.q)[0]:label(f.q)[1]).slice(0,46):'')+'…</p><span class="n">'+n+'건</span></a>'}).join('')+'</div>'});
  h+='<div class="sh"><h3>방송 당일 답변지 원본 화면</h3><span>방송 직전에 쓰던 순서 그대로</span></div><div class="chips2">'+NAV.filter(x=>!['yonsei','gov','kw'].includes(x[0])).map(x=>'<a href="#'+x[0]+'">'+E(x[1])+'</a>').join('')+'</div>';
  main().innerHTML=h;bindSearch();
}
function vMedia(){
  const md=arg;const L=DATA.filter(d=>d.media===md);
  let h='<div class="crumb"><a href="#home">홈</a> › <a href="#archive">발언 아카이브</a> › '+E(md)+'</div><h1 class="pt">'+E(md)+' <span class="badge '+mtype(md)[1]+'" style="vertical-align:middle">'+mtype(md)[0]+'</span></h1><p class="lead">'+L.length+'건 · 질문을 누르면 답변 전문이 펼쳐집니다.</p>';
  if(md===MEDIAS[0])h+='<div class="callout">이번 토론회 자료는 <a href="#event/overview"><b>🎤 연세대 토론회</b></a> 화면에서 순서대로 보는 게 편합니다.</div>';
  const parts={};L.forEach(d=>{const p=d.part||'';(parts[p]=parts[p]||[]).push(d)});
  Object.keys(parts).forEach(p=>h+=list(p||'',parts[p]));
  main().innerHTML=h;bindRows(main());
}
/* ---------- 주제 ---------- */
function vTopics(){
  let h='<div class="crumb"><a href="#home">홈</a> › 주제별</div><h1 class="pt">주제별 발언</h1><p class="lead">같은 주제로 어디서 어떤 말을 했는지 모아 봅니다. 낱말 옆 숫자는 그 주제가 붙은 카드 수입니다. 같은 질문엔 같은 말로 답해야 "말 바꾼다"는 공격을 받지 않습니다.</p>'+searchBox('');
  KWGROUPS.forEach(g=>{h+='<div class="sh"><h3>'+E(g[0])+'</h3></div><div class="chips2">'+g[1].filter(k=>CNT[k]).map(k=>'<a href="#topic/'+encodeURIComponent(k)+'">'+E(k)+'<i>'+CNT[k]+'</i></a>').join('')+'</div>'});
  const used=new Set(KWGROUPS.flatMap(g=>g[1]));const rest=Object.entries(CNT).filter(([k,n])=>!used.has(k)&&n>=4).sort((a,b)=>b[1]-a[1]).slice(0,80);
  h+='<div class="sh"><h3>자주 나온 다른 주제</h3><span>4건 이상</span></div><div class="chips2">'+rest.map(([k,n])=>'<a href="#topic/'+encodeURIComponent(k)+'">'+E(k)+'<i>'+n+'</i></a>').join('')+'</div>';
  main().innerHTML=h;bindSearch();
}
function vTopic(){
  const k=arg;const L=DATA.filter(d=>(d.tags||[]).includes(k)).sort((a,b)=>b.no-a.no);
  const V=VOICE.filter(v=>v.kw.includes(k));
  let h='<div class="crumb"><a href="#home">홈</a> › <a href="#topics">주제별</a> › #'+E(k)+'</div><h1 class="pt">#'+E(k)+'</h1><p class="lead">'+L.length+'건 · 최근 것부터. 매체 이름이 붙어 있습니다.</p>';
  if(V.length)h+='<div class="sh"><h3>연설에서 쓴 핵심 문장</h3></div>'+V.map(v=>'<div class="msg">'+E(v.lines[0])+'<small>'+E(v.sec)+'</small></div>').join('');
  h+=list('',L,{media:true});
  main().innerHTML=h;bindRows(main());
}
function vSearch(){
  const s=arg;const toks=s.toLowerCase().split(/\s+/).filter(Boolean);
  const L=DATA.map(d=>[d,scoreCard(d,toks)]).filter(x=>x[1]>0).sort((a,b)=>b[1]-a[1]).map(x=>x[0]);
  let h='<div class="crumb"><a href="#home">홈</a> › 검색</div><h1 class="pt">“'+E(s)+'” 찾은 결과</h1><p class="lead">'+L.length+'건 · 핵심 워딩·꼭 할 말에 들어 있는 것이 위로 옵니다.</p>'+searchBox(s)+list('',L.slice(0,150),{media:true});
  if(L.length>150)h+='<p class="lead">150건까지 보여 줍니다. 낱말을 더 붙여 좁혀 보세요.</p>';
  main().innerHTML=h;bindRows(main());bindSearch();
}
/* ---------- 메시지·공약 ---------- */
function vMsg(){
  let h='<div class="crumb"><a href="#home">홈</a> › 메시지·공약</div><h1 class="pt">메시지·공약</h1><p class="lead">어느 자리에서든 같은 말로 하기 위한 기준 문장들입니다.</p>';
  h+='<div class="sh"><h3>슬로건</h3></div>'+SLOGANS.map(s=>'<div class="msg">'+E(s[0])+'</div>').join('');
  h+='<div class="sh"><h3>연설·인터뷰 핵심 문장</h3><span>'+VOICE.length+'묶음 · 누르면 전체</span></div><div class="list">'+VOICE.map((v,i)=>'<div class="row" data-v="'+i+'"><div class="rh"><span class="no">'+(i+1)+'</span><div class="tx"><div class="tt">'+E(v.sec)+'</div><div class="gs">'+E(v.lines[0])+'</div></div><span class="ar">▶</span></div><div class="det">'+v.lines.map(l=>'<p class="sp">'+E(l)+'</p>').join('')+'<div class="tg">'+v.kw.map(t=>'<a href="#topic/'+encodeURIComponent(t)+'">#'+E(t)+'</a>').join('')+'</div></div></div>').join('')+'</div>';
  h+='<div class="sh"><h3>5대 약속</h3><a href="#pledge25">공약 한눈에 →</a></div><div class="grid">'+PLEDGES.map(p=>'<div class="tile"><h4>'+E(p[0])+'</h4><p>'+E(p[2])+'</p></div>').join('')+'</div>';
  h+='<div class="sh"><h3>대전환 11대 공약</h3><a href="#pledge11">원본 화면 →</a></div><div class="list">'+PLEDGES11.map((p,i)=>'<div class="row"><div class="rh"><span class="no">'+E(p[0])+'</span><div class="tx"><div class="tt">'+E(p[1])+'</div><div class="gs">'+E(p[3])+'</div></div><span class="ar">▶</span></div><div class="det"><p class="sp">'+E(p[3])+'</p></div></div>').join('')+'</div>';
  h+='<div class="sh"><h3>연설에서 한 약속</h3></div><div class="list">'+SPEECH_PLEDGES.map(p=>'<div class="row"><div class="rh"><span class="no">·</span><div class="tx"><div class="tt">'+E(p[0])+'</div><div class="gs">'+E(p[2])+'</div></div><span class="ar">▶</span></div><div class="det"><p class="sp">'+E(p[2])+'</p></div></div>').join('')+'</div>';
  h+='<div class="sh"><h3>프로필</h3><a href="#about">원본 화면 →</a></div><div class="read" style="padding:18px 22px"><b style="font-size:18px">'+E(PROFILE.name)+'</b> · '+E(PROFILE.age)+'<p style="margin:6px 0 10px;color:#46536b">'+E(PROFILE.tagline)+'</p>'+(PROFILE.career||[]).map(c=>'<div style="font-size:15px;padding:3px 0">· '+E(c)+'</div>').join('')+'</div>';
  h+='<div class="sh"><h3>그 밖의 원본 화면</h3></div><div class="chips2"><a href="#hongdae">홍대선언</a><a href="#greet">첫인사·마무리</a><a href="#speech">연설·성명</a><a href="#timeline">날짜별 타임라인</a><a href="#auto">오늘의 자동 발언포인트</a></div>';
  main().innerHTML=h;
  main().querySelectorAll('.row .rh').forEach(r=>r.onclick=()=>r.parentNode.classList.toggle('open'));
}
function vOne(){
  const d=byNo[+arg];
  let h='<div class="crumb"><a href="#home">홈</a> › '+(d?'<a href="#media/'+encodeURIComponent(d.media)+'">'+E(d.media)+'</a> › #'+d.no:'')+'</div>';
  if(!d){main().innerHTML=h+'<p class="lead">'+E(arg)+'번 카드를 찾지 못했습니다.</p>';return}
  const [lb,tt]=label(d.q);
  h+='<h1 class="pt">'+E(tt)+'</h1><p class="lead">'+(lb?'<span class="badge">'+E(lb)+'</span> ':'')+E(d.media)+' · <a href="javascript:history.back()">← 돌아가기</a>'+(d.no>=3201&&d.no<=3299?' · <a href="#event/'+secOf(d.no)+'/'+d.no+'">토론회 화면에서 보기</a>':'')+'</p><div class="read v2one">'+detail(d)+'</div>';
  main().innerHTML=h;bindEd(main());
}
/* ---------- 정책 실시간 + 오늘의 정리 ---------- */
const TOPIC=[['청년','청년|대학생|사회초년|신혼'],['주거','주거|주택|임대|전세|월세|부동산|기숙사|공공주택|분양'],['일자리','일자리|고용|취업|채용|노동|근로|임금|인턴|창업|일경험'],['교육·대학','대학|등록금|장학|학자금|교육|학생'],['정당·선거','정당|선거|정치자금|국고보조|공천|정치개혁'],['지방','지방|지역|균형|자치|소멸|농어촌']];
const SRCN={gov:'정부 발표',napress:'국회 보도자료',nabill:'발의 법률안',nalgsl:'입법예고',naplen:'본회의 처리'};const srcOf=x=>x.g==='gov'?'gov':x.src;
const YCAT=['일자리','주거','교육','복지문화','참여권리'];
function gvYA(){if(GV.ya||GV.yaBusy)return;GV.yaBusy=true;const B=KBAPI+'/api/live?src=youth&op=plcy';
  Promise.all([gvGet(B+'&size=1')].concat(YCAT.map(c=>gvGet(B+'&size=1&lclsfNm='+encodeURIComponent(c)))).concat([gvGet(B+'&size=100')]))
  .then(r=>{const tot=x=>{const p=(((x.data||{}).result||{}).pagging||{});return x.ok===false||p.totCount==null?null:p.totCount};GV.ya={all:tot(r[0]),cat:YCAT.map((c,i)=>[c,tot(r[i+1])]),recent:(((r[6].data||{}).result||{}).youthPolicyList)||[]}})
  .catch(e=>{GV.ya={err:String(e.message||e),all:0,cat:[],recent:[]}}).finally(()=>{GV.yaBusy=false;if(view==='gov')vGov()});}
function yc(c){const r=(GV.ya.cat||[]).find(x=>x[0]===c);return r&&r[1]!=null?r[1].toLocaleString():'받기 실패'}
function analysis(){
  if(GV.feed===null)gvLoadFeed();gvYA();
  if(GV.feed===null||!GV.ya)return '<div class="callout">국회·온통청년 자료를 받아 정리하는 중입니다… (10초 안팎)</div>';
  const F=GV.feed;const today=(GV.feedAt||new Date().toISOString());
  const kst=new Date(new Date(today).getTime()+9*3600e3).toISOString().slice(0,10);
  const m=(x,re)=>new RegExp(re).test([x.title,x.sub].join(' '));
  const cnt=TOPIC.map(([n,re])=>[n,re,Object.keys(SRCN).map(s=>F.filter(x=>srcOf(x)===s&&m(x,re)).length)]);
  const todayN=F.filter(x=>x.date===kst).length;
  const wk=Date.now()-7*86400e3;const yr=GV.ya.recent.filter(x=>x.frstRegDt&&new Date(x.frstRegDt.replace(' ','T')+'+09:00').getTime()>=wk);
  const ycat={};yr.forEach(x=>ycat[x.lclsfNm]=(ycat[x.lclsfNm]||0)+1);
  const yreg={};yr.forEach(x=>{const r=x.sprvsnInstCdNm||'';yreg[r]=(yreg[r]||0)+1});
  const c=n=>cnt.find(x=>x[0]===n)[2].reduce((a,b)=>a+b,0);
  let h='<div class="callout" style="font-size:15.5px"><b>📌 오늘의 한 줄 정리</b> ('+E(gvKst(GV.feedAt))+' 받음)<br>정부·국회에서 받은 최신 자료 '+F.length+'건(정부 '+F.filter(x=>x.g==='gov').length+' · 국회 '+F.filter(x=>x.g==='nas').length+')(오늘 날짜 '+todayN+'건) 가운데 제목 기준으로 <b>청년 '+c('청년')+'건 · 주거 '+c('주거')+'건 · 일자리 '+c('일자리')+'건 · 교육·대학 '+c('교육·대학')+'건</b>이 걸립니다. 온통청년에는 청년정책 <b>'+(GV.ya.all==null?'(받기 실패)':GV.ya.all.toLocaleString())+'건</b>이 등록돼 있고(일자리 '+yc('일자리')+' · 주거 '+yc('주거')+'), '+(yr.length&&yr.length===GV.ya.recent.length?'지난 7일 동안만 <b>'+yr.length+'건 넘게</b> 새로 올라왔습니다(가장 최근 '+yr.length+'건이 모두 이번 주 등록).':'최근 등록 100건 중 지난 7일 새로 올라온 것이 '+yr.length+'건입니다.')+'</div>';
  const gok=(GV.st||[]).filter(s=>!/^na/.test(s.id||'')&&s.state==='ok').length;
  if(!gok)h+='<div class="callout r"><b>정부 쪽 발표는 지금 들어오지 않습니다.</b> 정책브리핑·부처 보도자료·관보가 김보미.com 서버에서 "자료 없음"으로 옵니다(국회·온통청년·정부24는 정상). 정책브리핑 RSS는 2026.7.1 서비스가 끝나 공공데이터포털 API가 유일한 길이라, 김보미.com의 공공데이터포털 활용신청·인증키를 확인해야 합니다. 그때까지 정부 발표는 <a href="'+HUB+'/#/policy" target="_blank" rel="noopener">브레인허브 정책 자료실</a>에서 보세요.</div>';
  h+='<div class="sh"><h3>주제 × 출처</h3><span>제목에 든 낱말로 자동 분류 — 사람이 판단한 것이 아니니 원문을 열어 확인하세요</span></div><table class="t2"><tr><th>주제</th>'+Object.values(SRCN).map(s=>'<th style="text-align:right">'+s+'</th>').join('')+'<th style="text-align:right">합계</th></tr>'+cnt.map(r=>'<tr><td><b>'+r[0]+'</b></td>'+r[2].map(n=>'<td class="n">'+n+'</td>').join('')+'<td class="n">'+r[2].reduce((a,b)=>a+b,0)+'</td></tr>').join('')+'</table>';
  const pick=(re,srcs,n)=>F.filter(x=>srcs.includes(srcOf(x))&&m(x,re)).slice(0,n);
  const li=x=>'<div class="row"><div class="rh" style="cursor:default"><span class="no"><span class="badge '+(x.g==='gov'?'p':x.src==='nabill'?'y':x.src==='nalgsl'?'r':x.src==='naplen'?'g':'')+'">'+E(x.g==='gov'?(x.org||'정부'):(SRCN[x.src]||x.src))+'</span></span><div class="tx"><div class="tt" style="font-size:15px">'+(x.url?'<a href="'+E(x.url)+'" target="_blank" rel="noopener" style="color:inherit">'+E(x.title)+'</a>':E(x.title))+'</div><div class="gs">'+E([x.date||(x.until?x.until+' 마감':''),x.who,x.dept,x.kind].filter(Boolean).join(' · '))+'</div></div></div></div>';
  [['주거','의제 ① 청년 주거와 연결'],['일자리','의제 ② 청년 일자리와 연결'],['청년','청년 일반']].forEach(([n,t])=>{const re=TOPIC.find(x=>x[0]===n)[1];const L=pick(re,['gov','nabill','nalgsl','naplen','napress'],10);h+='<div class="sh"><h3>'+n+' — '+t+'</h3><span>최신 '+L.length+'건</span></div>'+(L.length?'<div class="list">'+L.map(li).join('')+'</div>':'<p class="lead">받은 자료 중 해당 제목이 없습니다.</p>')});
  h+='<div class="sh"><h3>온통청년 — 분야별 등록 정책 수</h3><span>전국·지자체 합계</span></div><div class="read" style="padding:16px 20px">'+GV.ya.cat.slice().sort((a,b)=>(b[1]||0)-(a[1]||0)).map(([c,n])=>'<div style="margin:6px 0"><b>'+c+'</b> <span style="float:right;font-weight:800;color:'+(n==null?'#b42318':'#1d4e8f')+'">'+(n==null?'받기 실패 — 새로 받기를 눌러 보세요':n.toLocaleString()+'건')+'</span><div class="bar2"><i style="width:'+(GV.ya.all&&n?Math.round(n/GV.ya.all*100):0)+'%"></i></div></div>').join('')+'<p style="font-size:12.5px;color:#7a869c;margin:8px 0 0">전체 '+(GV.ya.all==null?'(받기 실패)':GV.ya.all.toLocaleString())+'건. 한 정책이 한 분야로 분류되며, 분류에 없는 것도 있어 합이 전체와 다를 수 있습니다.</p></div>';
  h+='<div class="sh"><h3>이번 주 새로 올라온 청년정책</h3><span>최근 '+yr.length+'건 기준 · 분야 '+Object.entries(ycat).map(([k,v])=>k+' '+v).join(' · ')+'</span></div>'+(yr.length?'<div class="list">'+yr.slice(0,12).map(x=>'<div class="row"><div class="rh" style="cursor:default"><span class="no"><span class="badge g">'+E(x.lclsfNm||'')+'</span></span><div class="tx"><div class="tt" style="font-size:15px"><a style="color:inherit" target="_blank" rel="noopener" href="https://www.youthcenter.go.kr/youthPolicy/ythPlcyTotalSearch/ythPlcyDetail/'+encodeURIComponent(x.plcyNo||'')+'">'+E(x.plcyNm)+'</a></div><div class="gs">'+E([x.sprvsnInstCdNm,(x.frstRegDt||'').slice(0,10)+' 등록',String(x.plcyExplnCn||'').slice(0,80)].filter(Boolean).join(' · '))+'</div></div></div></div>').join('')+'</div>':'<p class="lead">지난 7일 새로 등록된 정책이 없습니다.</p>');
  const regs=Object.entries(yreg).sort((a,b)=>b[1]-a[1]).slice(0,8);
  if(regs.length)h+='<p class="lead" style="font-size:13.5px">새로 올린 기관: '+regs.map(([k,v])=>E(k)+' '+v).join(' · ')+'</p>';
  return h;
}
function vGov(){
  if(!GV.tab||GV.tab==='feed'&&!GV.v2init){GV.tab='sum';GV.v2init=1}
  const tabs=[['sum','📊 오늘의 정리'],['feed','🏛️ 국회·정부 발표'],['youth','🧑‍🎓 청년정책'],['benefit','🎁 혜택 검색'],['status','🩺 연결 상태']];
  let h='<div class="crumb"><a href="#home">홈</a> › 정책 실시간</div><h1 class="pt">📡 정책 실시간</h1><p class="lead">열 때마다 김보미.com 서버에서 국회 발표, 온통청년 청년정책, 정부24·복지로 혜택을 새로 받아 와 정리합니다. 인증키는 김보미.com 서버에만 있습니다. 직원용 재정·정책 자료는 <a href="'+HUB+'/#/policy" target="_blank" rel="noopener">브레인허브 정책 자료실</a> · <a href="'+HUB+'/#/gov27" target="_blank" rel="noopener">2027 정부 예산안</a> · <a href="'+HUB+'/#/law" target="_blank" rel="noopener">법령</a>.</p>';
  h+='<div class="tabs">'+tabs.map(t=>'<a href="javascript:void 0" data-gt="'+t[0]+'" class="'+(GV.tab===t[0]?'on':'')+'">'+t[1]+'</a>').join('')+'<a href="javascript:void 0" id="gvre" style="margin-left:auto">↻ 새로 받기</a></div>';
  if(GV.tab==='sum'){main().innerHTML=h+analysis();bindGvTabs();return}
  // 나머지 탭은 기존 화면을 그대로 쓰고 머리만 바꾼다
  viewGovOld();const m=main();const hero=m.querySelector('.hero');if(hero)hero.remove();const t=m.querySelector('.gvtab');if(t&&t.parentNode)t.parentNode.remove();
  m.insertAdjacentHTML('afterbegin',h);bindGvTabs();
}
function bindGvTabs(){main().querySelectorAll('[data-gt]').forEach(a=>a.onclick=()=>{GV.tab=a.dataset.gt;if(GV.tab==='status')GV.st=null;vGov()});
  const r=document.getElementById('gvre');if(r)r.onclick=()=>{GV.feed=null;GV.ya=null;GV.youth=null;GV.ben=null;if(GV.tab==='status')GV.st=null;gvLoadFeed(true);vGov()}}
const viewGovOld=window.viewGov;window.viewGov=vGov;

/* ---------- 청년 발언 모음: 김보미가 실제로 한 말(답변지·방송·연설)에서 청년 관련 문장을 원문 그대로 ---------- */
const YEX=new Set(['연세대 토론회(10.27)','⚠️ 교차점검']);
const YKEY=/청년|청춘|2030|20대|30대|대학생|젊은 세대|모병|징병|군대|군 복무|군복무|세대교체|첫 일자리|첫 경력|첫 직장/;
const YTH=[
 ['mil','모병제·군 복무',/모병|징병|군대|군 복무|군복무|입대|병역/,/모병|징병|군대/],
 ['job','청년 일자리',/청년취업보장제|첫 일자리|첫 경력|일자리|취업|채용|구직|고용|인턴/,/청년취업보장제|첫 일자리|첫 경력|경력/],
 ['house','청년 주거',/주거|월세|전세|집값|원룸|고시원|폐버스|버스하우스|쪽잠|임대주택|공공임대|기숙사|부동산|잠자리|낼 집/,/폐버스|쪽잠|월세|낼 집|잠자리/],
 ['pol','청년 정치·결정권',/청년최고위원|청년 최고위원|결정권|청년위원회|공급자|예산의 10|예산 10%|10%|기탁금|공영제|청년 정치|청년정치|결정하는 방|규칙을 정하는 방|청년 공천|청년 몫/,/청년최고위원|결정권|공급자|10%|기탁금/],
 ['mind','2030 민심',/2030|20대|30대|무당층|떠났|떠나|무관심/,/떠났|떠나|무당층/],
 ['gen','세대교체',/세대교체|86|686|용퇴|물러|다음 세대/,/세대교체/],
 ['local','지방 청년',/지방|지역|사다리|정착|호남|농어촌|소멸|강진/,/사다리|정착/],
 ['etc','그 밖의 청년 발언',/./,/^$/]];
function yClean(p){let t=String(p).replace(/^★\s*/,'').trim();if(/^▼/.test(t))return '';t=t.replace(/^⭐\s*/,'').replace(/^핵심 한 문장\s*[—-]\s*/,'').replace(/^【[^】]*】\s*/,'').replace(/^\[[^\]]{1,24}\]\s*/,'').replace(/^[①-⑳]\s*(\([^)]*\)\s*)?/,'').trim();return t.length<12?'':t}
let YC=null;
function yBuild(){
  const map=new Map();
  const add=(t,src,must)=>{const k=t.replace(/\s+/g,' ');let o=map.get(k);if(!o){o={t:k,src:[],must:false};map.set(k,o)}if(!o.src.some(s=>s[0]===src[0]&&s[1]===src[1]))o.src.push(src);if(must)o.must=true};
  DATA.forEach(d=>{if(YEX.has(d.media)||d.no>=3201&&d.no<=3299)return;
    (d.script||[]).forEach(p=>{const t=yClean(p);if(t&&YKEY.test(t))add(t,[d.media,d.no],p.startsWith('★'))});
    (d.quotes||[]).forEach(q=>{const t=yClean(q[1]);if(t&&YKEY.test(t))add(t,[d.media,d.no],true)});});
  (VOICE||[]).forEach(v=>(v.lines||[]).forEach(l=>{const t=yClean(l);if(t&&YKEY.test(t))add(t,['연설 핵심 문장 · '+v.sec,0],true)}));
  const L=[...map.values()];L.forEach(o=>{const t=YTH.find(x=>x[2].test(o.t))||YTH[YTH.length-1];o.th=t[0];o.core=t[3].test(o.t)?1:0});
  L.sort((a,b)=>(b.core-a.core)||(b.src.length-a.src.length)||(b.must-a.must));
  YC=L;return L;
}
let ysub='',yq='';

/* 청년 발언 한눈에 표: 전부 한 화면, 인쇄용 */
function vYouthAll(L){
  const byM={};L.forEach(o=>o.src.forEach(s=>{(byM[s[0]]=byM[s[0]]||[]).push(o)}));
  const order=MEDIAS.filter(m=>byM[m]).concat(Object.keys(byM).filter(m=>!MEDIAS.includes(m)));
  const thN={};YTH.forEach(x=>thN[x[0]]=x[1]);
  let h='<div class="crumb"><a href="#home">홈</a> › <a href="#youth">청년 발언</a> › 한눈에 표</div><h1 class="pt">청년 발언 한눈에 표</h1><p class="lead">그동안 방송·인터뷰·연설에서 한 청년 관련 문장 '+L.length+'개를 매체별로 한 화면에 폈습니다. 원문 그대로이고, 노란 줄은 ★ 꼭 할 말로 표시했던 문장입니다. 번호를 누르면 그 답변 전체가 열립니다. <a href="javascript:void 0" onclick="window.print()">🖨 인쇄</a></p>';
  h+='<nav class="tabs"><a href="#youth">주제별 보기 ←</a>'+YTH.map(x=>'<a href="#youth/'+x[0]+'">'+x[1]+'</a>').join('')+'</nav>';
  h+='<div class="callout">매체 바로 가기: '+order.map((m,i)=>'<a href="#ya-'+i+'">'+E(m)+'('+byM[m].length+')</a>').join(' · ')+'</div>';
  order.forEach((m,i)=>{const arr=byM[m];
    h+='<div class="sh" id="ya-'+i+'"><h3>'+E(m)+'</h3><span>'+arr.length+'문장</span></div><div style="overflow-x:auto"><table class="cmp yall"><thead><tr><th style="width:84px">주제</th><th>발언(원문)</th><th style="width:72px">카드</th></tr></thead><tbody>'+
      arr.map(o=>{const s=o.src.find(x=>x[0]===m);return '<tr><td class="k">'+E(thN[o.th]||'')+'</td><td>'+(o.must?'<mark>'+E(o.t)+'</mark>':E(o.t))+(o.src.length>1?' <span class="badge g">'+o.src.length+'곳</span>':'')+'</td><td>'+(s&&s[1]?'<a href="#card/'+s[1]+'">'+s[1]+'</a>':'<a href="#msg">연설</a>')+'</td></tr>'}).join('')+'</tbody></table></div>';
  });
  main().innerHTML=h;
}
function vYouth(){
  const L=YC||yBuild();
  const cnt={};L.forEach(o=>cnt[o.th]=(cnt[o.th]||0)+1);
  if(ysub==='all'){return vYouthAll(L)}
  const th=ysub&&YTH.some(x=>x[0]===ysub)?ysub:'';
  const vis=L.filter(o=>(!th||o.th===th)&&(!yq||o.t.includes(yq)));
  let h='<div class="crumb"><a href="#home">홈</a> › 청년 발언</div><h1 class="pt">청년 발언 모음</h1><p class="lead">김보미가 방송·인터뷰·연설에서 실제로 한 말 가운데 청년에 관한 문장만 원문 그대로 모았습니다. 고친 글자 없이 그대로입니다. 여러 번 한 말이 위에 오고, 출처를 누르면 그 답변 전체가 열립니다. 이번 토론 준비 원고는 넣지 않았습니다.</p>';
  h+='<form class="sbox" id="yf"><input id="yqi" value="'+E(yq)+'" placeholder="이 안에서 찾기 — 예: 청년취업보장제, 모병제, 폐버스"><button>찾기</button></form>';
  h+='<nav class="tabs" aria-label="청년 발언 주제"><a href="#youth" class="'+(!th?'on':'')+'">전체<span>'+L.length+'</span></a>'+YTH.map(x=>'<a href="#youth/'+x[0]+'" class="'+(th===x[0]?'on':'')+'">'+x[1]+'<span>'+(cnt[x[0]]||0)+'</span></a>').join('')+'<a href="#youth/all">📋 한눈에 표</a></nav>';
  if(th==='mil')h+='<div class="callout">모병제 현안 정리는 <a href="issue-mobyeongje.html">모병제 이슈 보고서</a>에 있습니다.</div>';
  const one=o=>'<div class="row open"><div class="det" style="display:block;padding:16px 20px 14px">'+'<p class="sp'+(o.must?' k':'')+'" style="margin:0 0 8px">'+(o.must?'<mark>'+E(o.t)+'</mark>':E(o.t))+'</p><div class="tg" style="margin:0">'+(o.src.length>1?'<span class="badge g">'+o.src.length+'곳에서 한 말</span> ':'')+o.src.map(s=>s[1]?'<a href="#card/'+s[1]+'">'+E(s[0])+'</a>':'<a href="#msg">'+E(s[0])+'</a>').join('')+'<a href="javascript:void 0" data-cp="1" style="margin-left:6px">복사</a></div></div></div>';
  const groups=th?[[th,vis]]:YTH.map(x=>[x[0],vis.filter(o=>o.th===x[0])]);
  groups.forEach(([id,arr])=>{if(!arr.length)return;const nm=YTH.find(x=>x[0]===id)[1];
    const lim=th||yq?arr.length:8;
    h+='<div class="list"><div class="lh"><i></i>'+E(nm)+' <span style="color:#7d8798;font-weight:500;font-size:13.5px">'+arr.length+'문장</span>'+(!th&&!yq&&arr.length>lim?'<a href="#youth/'+id+'" style="margin-left:auto;font-size:13.5px">전부 보기</a>':'')+'</div>'+arr.slice(0,lim).map(one).join('')+'</div>'});
  if(!vis.length)h+='<p class="lead">찾은 문장이 없습니다. 더 짧은 낱말로 찾아 보세요.</p>';
  main().innerHTML=h;
  document.getElementById('yf').onsubmit=e=>{e.preventDefault();yq=document.getElementById('yqi').value.trim();vYouth()};
  main().querySelectorAll('[data-cp]').forEach(a=>a.onclick=()=>{const t=a.closest('.det').querySelector('.sp').innerText;try{navigator.clipboard.writeText(t);a.textContent='복사됨'}catch(e){}});
}

/* ---------- 📰 현안 브리핑: 하루 두 번 자동 취합(data/issues-feed.json) ---------- */
let IF=null,ifTab='latest';
function loadIF(){return fetch('data/issues-feed.json?v='+Date.now(),{cache:'no-store'}).then(r=>r.ok?r.json():{briefs:[],weekly:[]}).catch(()=>({briefs:[],weekly:[]}))}
function ifItem(it){
  return '<div class="row"><div class="rh"><span class="no"><span class="badge '+(it.kind==='핫이슈'?'r':it.kind==='의제'?'y':it.kind==='정당'?'p':'')+'">'+E(it.kind||'현안')+'</span></span><div class="tx"><div class="tt">'+E(it.title)+'</div><div class="gs">'+E(it.summary||'')+'</div></div><span class="ar">▶</span></div>'+
  '<div class="det"><p class="sp">'+E(it.summary||'')+'</p>'+(it.why?'<div class="nt">🎯 왜 중요한가: '+E(it.why)+'</div>':'')+(it.line?'<p class="sp k"><mark>'+E(it.line)+'</mark></p>':'')+(it.ask?'<div class="nt">❓ 받을 수 있는 질문: '+E(it.ask)+'</div>':'')+(it.warn?'<div class="wr">⚠️ '+E(it.warn)+'</div>':'')+(it.src&&it.src.length?'<div class="sr"><b>🔗 출처</b><br>'+it.src.map(s=>'<a href="'+E(s[1])+'" target="_blank" rel="noopener">'+E(s[0])+'</a>').join('')+'</div>':'')+'</div></div>';
}
function vIssues(){
  if(IF===null){main().innerHTML='<div class="crumb"><a href="#home">홈</a> › 현안 브리핑</div><h1 class="pt">현안 브리핑</h1><p class="lead">불러오는 중…</p>';loadIF().then(j=>{IF=j;if(view==='issues')vIssues()});return}
  const B=(IF.briefs||[]).slice().sort((a,b)=>String(b.at).localeCompare(String(a.at)));
  const W=(IF.weekly||[]).slice().sort((a,b)=>String(b.at).localeCompare(String(a.at)));
  let h='<div class="crumb"><a href="#home">홈</a> › 현안 브리핑</div><h1 class="pt">현안 브리핑</h1><p class="lead">아침 7시·저녁 6시에 자동으로 뉴스를 모아 정리합니다. 월요일 아침에는 지난 한 주 총정리가 올라옵니다. 줄을 누르면 요약·왜 중요한가·김보미가 할 말·받을 수 있는 질문·출처가 펼쳐집니다. 할 말은 초안이니 김보미 말로 고쳐 쓰십시오.</p>';
  h+='<nav class="tabs"><a href="#issues" class="'+(ifTab==='latest'?'on':'')+'">최신 브리핑<span>'+B.length+'</span></a><a href="#issues/weekly" class="'+(ifTab==='weekly'?'on':'')+'">월요일 총정리<span>'+W.length+'</span></a><a href="index.html">이슈현안 자료실(심층 보고서) →</a></nav>';
  const L=ifTab==='weekly'?W:B;
  if(!L.length)h+='<div class="callout">아직 모인 브리핑이 없습니다. 첫 수집은 다음 아침 7시입니다.</div>';
  L.slice(0,ifTab==='weekly'?8:14).forEach((b,i)=>{
    h+='<div class="sh"'+(i===0?' style="margin-top:6px"':'')+'><h3>'+E(b.title||b.at)+'</h3><span>'+E(gvKst(b.at))+(b.n?' · 기사 '+b.n+'건 확인':'')+'</span></div>';
    if(b.lead)h+='<div class="callout" style="font-size:15.5px">'+E(b.lead)+'</div>';
    const G={};(b.items||[]).forEach(it=>{(G[it.kind||'현안']=G[it.kind||'현안']||[]).push(it)});
    ['핫이슈','의제','정당','현안','지방','기타'].forEach(k=>{if(!G[k])return;h+='<div class="list"><div class="lh"><i style="background:'+(k==='핫이슈'?'var(--bad)':k==='의제'?'var(--acc,#e0a100)':k==='정당'?'#5b3aa8':'var(--navy2)')+'"></i>'+E(k)+' <span style="color:#7d8798;font-weight:500;font-size:13.5px">'+G[k].length+'건</span></div>'+G[k].map(ifItem).join('')+'</div>'});
    Object.keys(G).filter(k=>!['핫이슈','의제','정당','현안','지방','기타'].includes(k)).forEach(k=>{h+='<div class="list"><div class="lh"><i></i>'+E(k)+'</div>'+G[k].map(ifItem).join('')+'</div>'});
  });
  main().innerHTML=h;main().querySelectorAll('.row .rh').forEach(r=>r.onclick=()=>r.parentNode.classList.toggle('open'));
}

/* ---------- 📘 학습: 의제별 단계 학습 + 숙제 ---------- */
const STUDY=__STUDY__;
let stId='';
const SKEY='kbm_study_v1';
function stDone(){try{return JSON.parse(localStorage.getItem(SKEY)||'{}')}catch(e){return {}}}
function stSet(id,v){try{const d=stDone();if(v)d[id]=1;else delete d[id];localStorage.setItem(SKEY,JSON.stringify(d))}catch(e){}}
function srcLinks(src){return src&&src.length?'<small class="srcl">'+src.map(x=>{const own=String(x[1]).charAt(0)==='#';return '<a'+(own?' class="past"':'')+' href="'+E(x[1])+'"'+(own?'':' target="_blank" rel="noopener"')+'>'+E(x[0])+'</a>'}).join('')+'</small>':''}

/* 근거 접기: 멘트 아래 작은 「근거 n」 → 누르면 숫자+출처 */
let _evn=0;
function evBox(ev){if(!ev||!ev.length)return '';const id='ev'+(++_evn);
  return '<a class="evt" href="javascript:void 0" data-ev="'+id+'">근거 '+ev.length+' ▾</a><div class="evb" id="'+id+'" hidden>'+ev.map(e=>'<div class="evi">'+E(e.t)+srcLinks(e.src)+'</div>').join('')+'</div>';}
function bindEv(root){root.querySelectorAll('[data-ev]').forEach(a=>a.onclick=()=>{const b=document.getElementById(a.dataset.ev);b.hidden=!b.hidden;a.textContent=a.textContent.replace(b.hidden?'▴':'▾',b.hidden?'▾':'▴')})}
function pColor(n){return /민주/.test(n)?'var(--dem)':/개혁/.test(n)?'var(--ref)':/진보/.test(n)?'var(--prg)':/국민의힘/.test(n)?'#c9151e':'var(--ink)'}
function partyBlock(ps){
  return '<div class="list">'+ps.map(p=>{const x=p[3]||{};
    return '<div class="row open pty2"><div class="det" style="display:block;padding:14px 20px"><b style="font-size:15.5px;color:'+pColor(p[0])+'">'+E(p[0])+'</b><p class="sp" style="font-size:16px;margin:4px 0 6px">'+E(p[1])+'</p>'+srcLinks(p[2])+
      (x.pro||x.con||x.rebut?'<div class="pc">'+(x.pro?'<div class="pcx g"><b>👍 장점·인정할 것</b><p>'+E(x.pro)+'</p></div>':'')+(x.con?'<div class="pcx r"><b>👎 문제점·단점</b><p>'+E(x.con)+'</p></div>':'')+(x.rebut?'<div class="pcx y"><b>🗣 반론·받아치기</b><p>'+E(x.rebut)+'</p></div>':'')+(x.agree?'<div class="pcx b"><b>🤝 같이 갈 수 있는 것</b><p>'+E(x.agree)+'</p></div>':'')+'</div>':'')+'</div></div>'}).join('')+'</div>';
}
function hwBlock(hw){return '<div class="list">'+hw.map((q,k)=>'<div class="row"><div class="rh"><span class="no"><span class="badge y">문제 '+(k+1)+'</span></span><div class="tx"><div class="tt">'+E(q[0])+'</div></div><span class="ar">▶</span></div><div class="det"><div class="nt" style="font-weight:600;color:var(--mut);margin-top:0">답 보기</div><p class="sp k"><mark>'+E(q[1])+'</mark></p>'+srcLinks(q[2])+'</div></div>').join('')+'</div>'}
function vStudy(){
  const AG=STUDY.agenda||[],L=STUDY.lessons;const done=stDone();
  const ag=AG.find(x=>x.id===stId),cur=L.find(x=>x.id===stId);
  let h='<div class="crumb"><a href="#home">홈</a> › 학습'+(ag?' › '+E(ag.title):cur?' › '+E(cur.unit):'')+'</div>';
  if(!ag&&!cur){
    h+='<h1 class="pt">학습 — 학생회 발제 의제 순서대로</h1><p class="lead">'+E(STUDY.intro)+'</p>';
    h+='<div class="sh"><h3>토론 의제 — 우선순위</h3><span>학생회 발제문 기준</span></div>';
    AG.forEach(a=>{h+='<a class="agcard'+(done[a.id]?' done':'')+'" href="#study/'+a.id+'"><span class="agn">'+(done[a.id]?'✓':a.rank)+'</span><span class="sttx"><b>'+E(a.title)+'</b><span class="agq">'+E(a.q)+'</span><span>'+E(a.why)+'</span><em>할 말 '+a.topics.length+'묶음 · 받아치기 '+a.ask.length+' · 정당 '+a.parties.length+' · 숙제 '+a.hw.length+'</em></span></a>'});
    h+='<div class="sh"><h3>더 알아 둘 것</h3><span>정당·여론·지방·청년 정치</span></div>';
    L.forEach((x,i)=>{h+='<a class="stcard'+(done[x.id]?' done':'')+'" href="#study/'+x.id+'"><span class="stn">'+(done[x.id]?'✓':(i+1))+'</span><span class="sttx"><b>'+E(x.title.replace(/^\d+\.\s*/,''))+'</b><span>'+E(x.one)+'</span><em>'+E(x.time)+' · 숙제 '+x.hw.length+'</em></span></a>'});
    main().innerHTML=h;return;
  }
  const nav='<nav class="tabs" aria-label="학습 차례"><a href="#study">차례</a>'+AG.map(a=>'<a href="#study/'+a.id+'" class="'+(stId===a.id?'on':'')+'">'+(done[a.id]?'✓ ':'')+E(a.title)+'</a>').join('')+L.map((x,k)=>'<a href="#study/'+x.id+'" class="'+(x.id===stId?'on':'')+'">'+(done[x.id]?'✓ ':'')+E(x.title.replace(/^\d+\.\s*/,'').split(' — ')[0].slice(0,12))+'</a>').join('')+'</nav>';
  if(ag){
    h+='<h1 class="pt">'+E(ag.title)+'</h1><p class="lead" style="font-size:18px;color:var(--ink);font-weight:600">“'+E(ag.q)+'”</p>'+nav;
    h+='<div class="callout"><b>왜 이 순위인가.</b> '+E(ag.why)+'<br><b>학생회 발제문.</b> '+E(ag.brief)+' <a href="report-nec-2026.html">근거 보고서 읽기 →</a></div>';
    h+='<div class="stjump">'+[['s1','① 할 말'],['s2','② 정부 정책'],['s3','③ 받아치기'],['s4','④ 정당별'],['s5','⑤ 숙제']].map(x=>'<a href="javascript:void 0" data-j="'+x[0]+'">'+x[1]+'</a>').join('')+'</div>';
    h+='<section class="stsec" id="s1"><div class="sh"><h3>① 김보미가 할 말 — 우선순위순</h3><span>문장은 원고 그대로. 숫자는 「근거」를 눌러 확인</span></div>';
    ag.topics.forEach(t=>{h+='<div class="tp"><div class="tph"><span class="tpn">'+t.rank+'</span><b>'+E(t.title)+'</b><span class="badge '+(/발제/.test(t.tag)?'y':'g')+'">'+E(t.tag)+'</span></div>'+t.say.map(x=>'<div class="sayl"><p class="sp k"><mark>'+E(x.t)+'</mark></p>'+evBox(x.ev)+'</div>').join('')+'</div>'});
    h+='</section>';
    h+='<section class="stsec" id="s2"><div class="sh"><h3>② 정부 정책 — 한 것, 비판, 김보미와의 차이</h3><span>가장 중요 · 상대가 여기서 친다</span></div>'+ag.gov.map(x=>'<div class="sayl gov"><p class="sp">'+E(x.t)+'</p>'+evBox(x.ev)+'</div>').join('');
    if(ag.cuts&&ag.cuts.length){h+='<div class="sh" style="margin-top:18px"><h3>정부가 줄인 것 · 말 바꾼 것</h3><span>상대가 공격할 소재 — 먼저 알고 방어</span></div><div class="list">'+ag.cuts.map(c=>'<div class="row"><div class="rh"><span class="no"><span class="badge r">공격 소재</span></span><div class="tx"><div class="tt">'+E(c.title)+'</div><div class="gs">'+E(c.what)+'</div></div><span class="ar">▶</span></div><div class="det"><p class="sp">'+E(c.what)+'</p><div class="pc"><div class="pcx r"><b>⚔ 상대가 칠 말</b><p>'+E(c.attack)+'</p></div><div class="pcx b"><b>🛡 방어·정부 논리</b><p>'+E(c.defense)+'</p></div></div>'+srcLinks(c.src)+'</div></div>').join('')+'</div>'}
    else h+='<div class="callout">정부가 줄인 것·말 바꾼 것 목록은 조사 중입니다. 올라오면 여기 붙습니다.</div>';
    h+='</section>';
    h+='<section class="stsec" id="s3"><div class="sh"><h3>③ 상대가 칠 말 → 인정할 것 → 받아치기</h3><span>줄을 누르면 펼쳐짐</span></div><div class="list">'+ag.ask.map(q=>'<div class="row"><div class="rh"><span class="no"><span class="badge r">'+E(q.who.split('(')[0].slice(0,9))+'</span></span><div class="tx"><div class="tt">'+E(q.q)+'</div><div class="gs">'+E(q.hit)+'</div></div><span class="ar">▶</span></div><div class="det"><div class="pc"><div class="pcx g"><b>✔ 먼저 인정할 것</b><p>'+E(q.admit)+'</p></div><div class="pcx y"><b>🗣 받아치기</b><p>'+E(q.hit)+'</p></div></div>'+evBox(q.ev)+'</div></div>').join('')+'</div></section>';
    h+='<section class="stsec" id="s4"><div class="sh"><h3>④ 정당별 입장 — 장점 · 문제점 · 반론</h3><a href="#event/parties">정당 비교표 →</a></div>'+partyBlock(ag.parties)+'</section>';
    h+='<section class="stsec" id="s5"><div class="sh"><h3>⑤ 숙제</h3><span>먼저 소리 내 답하고, 답 보기</span></div>'+hwBlock(ag.hw)+'</section>';
    const i=AG.indexOf(ag),next=AG[i+1];
    h+='<div class="stnav"><label class="stdone"><input type="checkbox" id="stchk" '+(done[ag.id]?'checked':'')+'> 이 의제 마쳤음</label>'+(next?'<a class="pri" href="#study/'+next.id+'">다음 · '+E(next.title)+' →</a>':'<a class="pri" href="#study/'+L[0].id+'">더 알아 둘 것 →</a>')+'</div>';
  }else{
    const i=L.indexOf(cur);const prev=L[i-1],next=L[i+1];
    h+='<h1 class="pt">'+E(cur.title)+'</h1><p class="lead">'+E(cur.unit)+' · 약 '+E(cur.time)+'</p>'+nav;
    h+='<section class="stsec"><div class="sh"><h3>한 줄로</h3></div><div class="msg">'+E(cur.one)+'</div></section>';
    h+='<section class="stsec"><div class="sh"><h3>쉽게 말하면</h3></div><div class="read"><p class="sp">'+E(cur.easy)+'</p></div></section>';
    if(cur.gov&&cur.gov.length)h+='<section class="stsec"><div class="sh"><h3>알아 둘 것</h3></div>'+cur.gov.map(g=>'<div class="sayl gov"><b style="font-size:15.5px">'+E(g[0])+'</b><p class="sp" style="margin:6px 0 4px">'+E(g[1])+'</p>'+srcLinks(g[2])+'</div>').join('')+'</section>';
    h+='<section class="stsec"><div class="sh"><h3>숫자 — 필요할 때만</h3><span>'+cur.nums.length+'개</span></div><div class="sayl">'+evBox(cur.nums)+'</div></section>';
    if(cur.parties&&cur.parties.length)h+='<section class="stsec"><div class="sh"><h3>정당별 입장 — 장점 · 문제점 · 반론</h3><a href="#event/parties">정당 비교표 →</a></div>'+partyBlock(cur.parties)+'</section>';
    if(cur.issues&&cur.issues.length)h+='<section class="stsec"><div class="sh"><h3>쟁점과 받아치기</h3><span>상대가 꺼낼 말 → 김보미 답</span></div><div class="list">'+cur.issues.map(q=>'<div class="row"><div class="rh"><span class="no"><span class="badge r">쟁점</span></span><div class="tx"><div class="tt">'+E(q[0])+'</div><div class="gs">'+E(q[1])+'</div></div><span class="ar">▶</span></div><div class="det"><p class="sp k"><mark>'+E(q[1])+'</mark></p>'+srcLinks(q[2])+'</div></div>').join('')+'</div></section>';
    h+='<section class="stsec"><div class="sh"><h3>숙제</h3></div>'+hwBlock(cur.hw)+'</section>';
    h+='<div class="stnav"><label class="stdone"><input type="checkbox" id="stchk" '+(done[cur.id]?'checked':'')+'> 이 과 마쳤음</label>'+(prev?'<a href="#study/'+prev.id+'">← '+E(prev.title.replace(/^\d+\.\s*/,'').split(' — ')[0].slice(0,12))+'</a>':'<a href="#study/'+AG[AG.length-1].id+'">← '+E(AG[AG.length-1].title)+'</a>')+(next?'<a class="pri" href="#study/'+next.id+'">다음 · '+E(next.title.replace(/^\d+\.\s*/,'').split(' — ')[0].slice(0,14))+' →</a>':'<a class="pri" href="#study">차례로 →</a>')+'</div>';
  }
  main().innerHTML=h;
  main().querySelectorAll('.row .rh').forEach(r=>r.onclick=()=>r.parentNode.classList.toggle('open'));
  bindEv(main());
  main().querySelectorAll('[data-j]').forEach(a=>a.onclick=()=>{const el=document.getElementById(a.dataset.j);if(el)el.scrollIntoView({behavior:'smooth',block:'start'})});
  const c=document.getElementById('stchk');if(c)c.onchange=()=>stSet(stId,c.checked);
}


const NUM6=[['5.3억','창천동 8평 원룸 실거래 1건(6월)',3202],['67.8만','연세대 앞 원룸 월세, 1년 +10.4%',3202],['16.8%','서울 대학 기숙사 수용률, 전국 꼴찌',3204],['47개월','청년 취업자 연속 감소',3205],['34.5%','계약직 출발 → 지금도 계약직',3205],['18.4개월','첫 직장 평균 근속(취업 소요 아님)',3273]];
/* ---------- 라우팅 ---------- */
const NEW={study:vStudy,issues:vIssues,youth:vYouth,home:vHome,event:vEvent,archive:vArchive,media:vMedia,topics:vTopics,topic:vTopic,search:vSearch,msg:vMsg,one:vOne,gov:vGov};
const oldRender=window.render;let OLD=false;
const oldExport=window.exportEdited;window.exportEdited=function(){const t=document.getElementById('v2top'),f=document.getElementById('v2foot');const had=document.body.classList.contains('v2');if(t)t.remove();if(f)f.remove();document.body.classList.remove('v2','tts');try{oldExport()}finally{if(had)document.body.classList.add('v2');top();foot()}};
window.applyHash=function(){
  let h=location.hash.slice(1);try{h=decodeURIComponent(h)}catch(e){}
  if(h==='old'){OLD=true;view='sep';return true}
  if(!h){OLD=false;view='home';return true}
  if(NEW[h.split('/')[0]]||/^(yonsei|card)/.test(h))OLD=false;
  let m;
  if((m=h.match(/^card\/(\d+)$/))){view='one';arg=m[1];return true}
  if((m=h.match(/^yonsei(?:\/(\d+))?$/))){view='event';sub=m[1]?secOf(+m[1]):'overview';arg=m[1]||'';return true}
  if((m=h.match(/^event(?:\/([a-z]+))?(?:\/([a-z0-9]+))?$/))){view='event';sub=m[1]||'overview';arg=m[2]||'';return true}
  if((m=h.match(/^(media|topic|search)\/(.+)$/))){view=m[1];arg=m[2];return true}
  if((m=h.match(/^youth(?:\/([a-z]+))?$/))){view='youth';ysub=m[1]||'';return true}
  if((m=h.match(/^issues(?:\/(weekly))?$/))){view='issues';ifTab=m[1]?'weekly':'latest';return true}
  if((m=h.match(/^study(?:\/([a-z0-9-]+))?$/))){view='study';stId=m[1]||'';return true}
  if(NEW[h]){view=h;arg='';return true}
  if(NAV.some(x=>x[0]===h)||['hongdae','kbs0812','five5','pledge25','pledge11','speech','about','timeline','greet'].includes(h)){view=h;return true}
  view='home';return true;
};
window.render=function(){
  if(OLD){document.body.classList.remove('v2');foot();oldRender();return}
  document.body.classList.add('v2');top();foot();
  if(NEW[view])NEW[view]();else{ if(view==='yonsei'){view='event';sub='overview';vEvent()} else oldRender(); }
  const want=view==='study'?'study'+(stId?'/'+stId:''):view==='issues'?'issues'+(ifTab==='weekly'?'/weekly':''):view==='youth'?'youth'+(ysub?'/'+ysub:''):view==='event'?'event/'+sub+(arg?'/'+arg:''):view==='one'?'card/'+arg:/^(media|topic|search)$/.test(view)?view+'/'+arg:view;
  try{if(location.hash.slice(1)!==encodeURI(want)&&decodeURIComponent(location.hash.slice(1))!==want)history.replaceState(null,'','#'+want)}catch(e){}
  try{const h1=document.querySelector('#main h1');document.title=(h1?h1.textContent.replace(/\s+/g,' ').trim().slice(0,30)+' · ':'')+'김보미 준비노트'}catch(e){}
  if(!/^(event)$/.test(view)||!arg)window.scrollTo(0,0);
};
window.addEventListener('hashchange',()=>{applyHash();render()});
// 검색창(옛 오른쪽 패널) 대신 새 검색을 쓴다
const ks=document.getElementById('kwsearch');if(ks)ks.replaceWith(ks.cloneNode(true));
try{history.replaceState(null,'',location.pathname+location.search+(window.__h0||''))}catch(e){}
applyHash();render();
})();
</script>
