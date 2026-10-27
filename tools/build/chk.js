if(location.hash!=="#old")document.documentElement.classList.add("v2");
window.__h0=location.hash;

const P=JSON.parse(document.getElementById('__payload').textContent);
const {DATA,ARTICLES,REFS,ISSUES,MEDIAS,VOICE,SLOGANS,PLEDGES,PLEDGES11,SPEECH_PLEDGES,PROFILE,KWGROUPS,TIMELINE,CNT}=P;
let view='yonsei', activeKw=null, q='', showAllKw=false;
// ---- 편집 저장/복원 (localStorage) ----
const LSKEY='kbm_edits_v6';
(function(){try{const s=localStorage.getItem(LSKEY);if(s){const ed=JSON.parse(s);ed.forEach(sd=>{const i=DATA.findIndex(d=>d.no===sd.no);if(i>-1)DATA[i]=sd});}}catch(e){}})();
function persistEdits(){try{localStorage.setItem(LSKEY,JSON.stringify(DATA))}catch(e){}}
const esc=s=>(s||'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const hl=(s)=>{s=esc(s);if(!q)return s;try{const toks=q.split(/\s+/).filter(Boolean);let out=s;toks.forEach(tk=>{out=out.replace(new RegExp('('+tk.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','gi'),'<mark>$1</mark>')});return out}catch(e){return s}};

const QLBL={
2351:'Q1 TV토론 총평·수박겉핥기',2352:'Q2 득표율 비공개',2353:'Q3 가장 높은 벽(5일·1천만)',2354:'Q4 운동장 입장불가',
2355:'Q5 86세대 반응·호통',2356:'Q6 기대·후회',2357:'Q7 민주당에 남는 이유',2358:'Q8 청년 성장·지방 기반',
2359:'Q9 청년을 떠난 민주당',2360:'Q10 2030 무관심 결과',2361:'Q11 다음 행보·전국의 김보미',2362:'추1 개헌·연임(조정식)',
2363:'추2 지지 후보',2364:'추3 불법당원·한병도 응답',2365:'추4 충북 투표중단',2366:'추5 6개월 규정 예외',
2367:'추6 청년최고위원제 무산',2368:'추7 탈당·신당설',2371:'추8 전당대회 전망(5무)',2372:'추9 미래대응기금',2380:'인사·감사',2381:'Q1 출마 계기',2382:'Q2 득표 비공개·이장선거',2383:'Q3 세대교체·뱃지 리그',2384:'Q3-1 정청래 직격·야유',2385:'Q4 망조·금고부터',2386:'Q5 청년최고위원제',2387:'Q6 지방소멸·지역 의제',2388:'Q7 보완수사권',2389:'Q8 진영 갈등',2390:'Q9 비전·계란',2391:'마무리',2410:'Q1 소회·감사',2411:'Q2 출마 이유',2412:'Q3 인상 깊었던 장면',2413:'Q4 청년 환경·개선책',2414:'Q5 앞으로의 계획',
2300:'Q1 전당대회 전망·충북',2301:'Q2 예비경선 소회',2302:'Q3 세 개의 벽(돈·정보·족보)',2303:'Q4 민주주의 부재',
2304:'Q5 신천지·당원명부',2305:'Q6 파격 발언 반응',2306:'Q7 민주당 정체성',2307:'Q8 2030 본선 전무',
2308:'Q9 2030 이탈 해법',2309:'Q10 앞으로의 계획',2310:'부록 5무 재현 대조표'};
const qlabel=d=>QLBL[d.no]||d.q.slice(0,15);
// ---------- NAV ----------
const NAV=[['yonsei','🎤 10.27 연세대 토론회'],['gov','📡 정책 실시간 (김보미.com API)'],['sep','🆕 9월 현안 답변지'],['signal','📺 지난 — 시그널픽(8.27)'],['auto','🤖 오늘의 자동 발언포인트'],['today','📚 지난 — 한겨레21 + 기자회견'],['hani','🎙️ 한겨레뷰리핑(7.27)'],['kbc','🎥 KBC광주방송(7.24)'],['sbs','📺 SBS뉴스브리핑(7.23)'],['ytn','🎙️ YTN뉴스명당(7.23 아침)'],['newsba','🔥 뉴스바사삭(7.22)'],['live','🔴 무등의아침(7.22)'],['written','📰 JTBC·서면 인터뷰'],['kw','🔑 키워드별 발언'],['greet','👋 첫인사·마무리'],['pledge11','📜 공약 총정리'],['timeline','📅 날짜별 타임라인'],['speech','🎤 연설·성명'],['about','📋 프로필']];
function renderNav(){const n=document.getElementById('nav');n.innerHTML='';NAV.forEach(([k,l])=>{const b=document.createElement('button');b.textContent=l;b.className=view===k?'on':'';b.onclick=()=>{view=k;if(k!=='kw')activeKw=null;render()};n.appendChild(b)})}

// ---------- KEYWORD PANEL ----------
function kwCount(t){return CNT[t]||0}
function renderKwPanel(){
  const box=document.getElementById('kwgroups');box.innerHTML='';
  // 🆕 9월 현안 최상단 고정
  const sp=document.createElement('div');sp.className='hd-pin'+(view==='sep'?' on':'');
  sp.style.background='linear-gradient(135deg,#1f4e79,#0f2c47)';
  sp.innerHTML='<div class="hd-t">🆕 9월 현안 답변지</div><div class="hd-s">2030 민심 · 용혜인 사퇴 · 위성정당 · 정당 보조금 · 인사청문 — 클릭하면 바로 보기</div>';
  sp.onclick=()=>{view='sep';activeKw=null;render()};
  box.appendChild(sp);
  // 🎤 10.27 연세대 토론회 최상단 고정
  const yd=document.createElement('div');yd.className='hd-pin'+(view==='yonsei'?' on':'');
  yd.style.background='linear-gradient(135deg,#1f4fa3,#14326b)';
  yd.innerHTML='<div class="hd-t">🎤 10.27 연세대 여야정책토론회</div><div class="hd-s">기조발언 원고·문장별 근거 · 의제 답변 · 이준석·박태훈·민주당 지적 대응 · 학생 질문 · 정책·사례 — 클릭하면 바로 보기</div>';
  yd.onclick=()=>{view='yonsei';activeKw=null;render()};
  box.insertBefore(yd,sp);
  const yq=document.createElement('div');yq.className='qjbox';
  let yh='<div class="gt" style="color:#1f4fa3">🎤 연세대 토론회 바로가기</div>';
  DATA.filter(d=>d.no>=3201&&d.no<=3299).forEach(d=>{yh+='<div class="qj" data-yno="'+d.no+'">'+esc(d.q.length>34?d.q.slice(0,34)+'…':d.q)+'</div>'});
  yq.innerHTML=yh;
  yq.addEventListener('click',e=>{const el=e.target.closest('[data-yno]');if(!el)return;const no=+el.getAttribute('data-yno');if(view!=='yonsei'){view='yonsei';activeKw=null;render();}setTimeout(()=>jumpTo(no),80);});
  box.insertBefore(yq,sp);
  // 📡 정책 실시간 고정
  const gv=document.createElement('div');gv.className='hd-pin'+(view==='gov'?' on':'');
  gv.style.background='linear-gradient(135deg,#0b7a3d,#07502a)';
  gv.innerHTML='<div class="hd-t">📡 정책 실시간 (김보미.com API)</div><div class="hd-s">정부·국회 발표 · 온통청년 청년정책 · 정부24·복지로 혜택 검색 · 브레인허브 바로가기 — 열 때마다 새로 받음</div>';
  gv.onclick=()=>{view='gov';activeKw=null;render()};
  box.insertBefore(gv,yq);
  // 🔴 정치시그널 최상단 고정
  const sg=document.createElement('div');
  sg.className='hd-pin'+(view==='signal'?' on':'');
  sg.style.background='linear-gradient(135deg,#c62828,#7f1414)';
  sg.innerHTML='<div class="hd-t">📺 지난 — 채널A 「정치시그널」 시그널픽</div><div class="hd-s">8/27(목) 방송 · 본편 14문항 + 돌발 12 — 클릭하면 답변지</div>';
  sg.onclick=()=>{view='signal';activeKw=null;render()};
  box.appendChild(sg);
  const sq=document.createElement('div');sq.className='qjbox';
  let sh='<div class="gt" style="color:#c62828">🔴 정치시그널 문항 바로가기 (Q1~Q14)</div>';
  DATA.filter(d=>d.no>=3001&&d.no<=3014).forEach(d=>{sh+='<div class="qj" data-sgno="'+d.no+'">📄 '+esc(d.q.length>32?d.q.slice(0,32)+'…':d.q)+'</div>'});
  sh+='<div class="gt" style="margin-top:8px;color:#b02020">🚨 돌발 대비 바로가기</div>';
  DATA.filter(d=>d.no>=3015&&d.no<=3026).forEach(d=>{sh+='<div class="qj" data-sgno="'+d.no+'">⚡ '+esc(d.q.length>32?d.q.slice(0,32)+'…':d.q)+'</div>'});
  sq.innerHTML=sh;
  sq.addEventListener('click',e=>{const el=e.target.closest('[data-sgno]');if(!el)return;const no=+el.getAttribute('data-sgno');if(view!=='signal'){view='signal';activeKw=null;render();}setTimeout(()=>jumpTo(no),80);});
  box.appendChild(sq);
  const KJT=[["KBS","Q1 · 출마 소회"],["KBS","Q1-1 · 연설 기회 부족"],["KBS","Q1-2 · 청년 원외의 어려움(후원회)"],["KBS","Q2 · 전대 룰 · 준비 부족"],["KBS","Q3 · 지명직 청년 배정 공약"],["KBS","Q4 · 2030 청년 타운홀 미팅"],["KBS","Q5 · 버스하우스 논란"],["KBS","Q6 · 귀를 사로잡은 것(공천혁신)"],["KBS","Q7 · 어떤 지도부가 필요한가"],["KBS","Q8 · 판세 (수치 방송직전 재확인!)"],["KBS","Q9 · 호남 바닥 민심"],["KBS","Q10 · 최고위원 선거"],["KBS","Q11 · 서울경기 민심 · 2030"],["KBS","Q12 · 갈등 봉합 · 불법당원"],["KBS","Q13 · 오늘 TV토론 쟁점"],["KBS","Q13-1 · 남은 변수"],["KBS","Q13-2 · 5·18 국정과제 1호"],["KBS","★ 기회되면 할 말 · 재정주권"],["돌발","돌발① · \"그래서 누구를 지지하십니까?\""],["돌발","돌발② · 공천특위에 제안할 3가지"],["돌발","돌발③ · 예비경선 공약이 뭐였나"],["돌발","돌발④ · 신천지 의혹 (조건부만!)"],["돌발","돌발⑤ · 송영길 재판 관련"],["돌발","돌발⑥ · 향후 계획 · 총선 출마?"],["돌발","돌발⑦ · 이재명 정부 평가"],["돌발","돌발⑧ · 군인권 쪽 질문이 오면"],["한겨레","당대표 경선 과정, 어떤 마음으로 뛰었고"],["한겨레","당대표 선출 결과를 청년 정치인으로서 어"],["한겨레","경선 과정에서 몸으로 느낀 민주당의 문제"],["한겨레","민주당 지지자였던 2030은 왜 민주당을"],["한겨레","민주당의 세대교체는 왜 필요한가. '가치"],["한겨레","민주당이 변해야 할 길은 무엇인가."],["한겨레","민주당에서 청년정치란 무엇인가. 앞으로 "],["한겨레","[추가] 재정주권 시민행동 공동대표로서,"]];
const kb=document.createElement('div');kb.className='qjbox';
let kh='';let lastg='';
KJT.forEach(function(x,i){if(x[0]!==lastg){lastg=x[0];kh+='<div class="gt" style="margin-top:8px;color:'+(x[0]==='돌발'?'#b02020':(x[0]==='한겨레'?'#0b7a3d':'#0b3d6b'))+'">'+(x[0]==='돌발'?'🚨 돌발질문 대비 카드':(x[0]==='한겨레'?'📰 지난 — 한겨레21 답변지':'📚 지난 방송 — 8.12 KBS 전격시사'))+'</div>';}
kh+='<div class="qj" data-k812="'+i+'">'+(x[0]==='돌발'?'⚡ ':'📄 ')+x[1]+'</div>';});
kb.innerHTML=kh;
kb.addEventListener('click',function(e){const d=e.target.closest('[data-k812]');if(!d)return;if(view!=='kbs0812'){view='kbs0812';activeKw=null;render();}
const el=document.getElementById('k812-'+d.getAttribute('data-k812'));if(el){el.scrollIntoView({block:'start'});}});
box.appendChild(kb);
// 📌 홍대선언 고정 버튼 (키워드 최상단)
  const hd=document.createElement('div');
  hd.className='hd-pin'+(view==='hongdae'?' on':'');
  hd.innerHTML='<div class="hd-t">📢 민주당 갈아엎기 대전환 선언 (홍대선언 7.22)</div><div class="hd-s">결과와 상관없는 약속 · 디지털 정당 12대 약속 — 클릭하면 요약·전문 바로 보기</div>';
  hd.onclick=()=>{view='hongdae';activeKw=null;render()};
  box.appendChild(hd);
const mkpin=(v,bg,tt,ss)=>{const d=document.createElement('div');d.className='hd-pin'+(view===v?' on':'');d.style.background=bg;d.innerHTML='<div class="hd-t">'+tt+'</div><div class="hd-s">'+ss+'</div>';d.onclick=()=>{view=v;activeKw=null;render()};box.appendChild(d);};
mkpin('five5','linear-gradient(135deg,#7a2fa0,#4a1d63)','📣 기자회견 — 호남 공천혁신 5대 요구','공천특위에 요구하는 5가지 — 클릭하면 한눈에 보기');
mkpin('pledge25','linear-gradient(135deg,#0b7a3d,#0a5229)','📜 공약 — 5대 분야 25개 약속 · 3단계 로드맵','홍대선언 12대 약속 연결 — 클릭하면 한눈에 보기');

  // ⭐ 오늘 질문 바로가기 (대전환 선언 아래 고정)
  const qshort=t=>{t=t.replace(/^\[?(예상 추가|Q)\s?/,'').replace(/^\d+[.\]·\s]*/,'');return t.length>26?t.slice(0,26)+'…':t};
  const qj=document.createElement('div');qj.className='qjbox';
  let qjh='<div class="gt" style="color:#7a2fa0">📢 지난 — 8.10 기자회견 질의응답</div>';
  DATA.filter(d=>d.media==='광주기자회견').forEach(d=>{qjh+='<div class="qj" data-qno="'+d.no+'">📄 '+esc(qlabel(d))+'</div>'});
  qjh+='<div class="gt" style="margin-top:10px;color:#555">📰 머니투데이 청년 특집 바로가기</div>';
  DATA.filter(d=>d.media==='머니투데이').forEach(d=>{qjh+='<div class="qj" data-qno="'+d.no+'">📄 '+esc(qlabel(d))+'</div>'});
  qjh+='<div class="gt" style="margin-top:10px;color:#555">📺 TV조선(7.31) 바로가기</div>';
  DATA.filter(d=>d.media==='TV조선'&&d.no<=2391).forEach(d=>{qjh+='<div class="qj" data-qno="'+d.no+'">📄 '+esc(qlabel(d))+'</div>'});
  qjh+='<div class="gt" style="margin-top:10px;color:#b02020">🚨 돌발 대비 — 방송 질문에 없는 주제</div>';
  [2363,2355,2365,2366,2368,2372,2351,2304,2303,2310].forEach(no=>{const d=DATA.find(x=>x.no===no);if(d)qjh+='<div class="qj" data-qno="'+no+'">⚡ '+esc(qlabel(d))+'</div>';});
  qjh+='<div class="gt" style="margin-top:10px">🔴 취재편의점(7.30) 바로가기</div>';
  DATA.filter(d=>d.media==='취재편의점'&&(d.no<=2368||d.no===2371)).forEach(d=>{qjh+='<div class="qj" data-qno="'+d.no+'">📄 '+esc(qlabel(d))+'</div>'});
  qjh+='<div class="gt" style="margin-top:10px">📰 이데일리(7.30) 바로가기</div>';
  DATA.filter(d=>d.media==='이데일리'&&d.no<=2310).forEach(d=>{qjh+='<div class="qj" data-qno="'+d.no+'">📄 '+esc(qlabel(d))+'</div>'});
  qj.innerHTML=qjh;box.appendChild(qj);
  qj.querySelectorAll('.qj').forEach(el=>el.onclick=()=>jumpToday(+el.dataset.qno));
  const all=document.createElement('div');all.className='chips';all.style.marginBottom='10px';
  const ac=document.createElement('span');ac.className='chip all'+(activeKw===null&&view==='kw'?' on':'');ac.textContent='전체 보기';
  ac.onclick=()=>{activeKw=null;view='kw';render()};all.appendChild(ac);box.appendChild(all);
  const filter=document.getElementById('kwsearch').value.trim();
  KWGROUPS.forEach(([gt,ks])=>{
    const shown=ks.filter(k=>kwCount(k)>0 && (!filter||k.includes(filter)));
    if(!shown.length)return;
    const g=document.createElement('div');g.className='kwgroup';
    g.innerHTML='<div class="gt">'+esc(gt)+'</div>';
    const c=document.createElement('div');c.className='chips';
    const hot=gt.indexOf('🆕')>-1||gt.indexOf('🔴')>-1;
    shown.forEach(k=>c.appendChild(chip(k,hot)));
    g.appendChild(c);box.appendChild(g);
  });
  // 전체 키워드(빈도순)
  const grouped=new Set(KWGROUPS.flatMap(g=>g[1]));
  let rest=Object.keys(CNT).filter(k=>!grouped.has(k)&&(!filter||k.includes(filter))).sort((a,b)=>CNT[b]-CNT[a]);
  if(rest.length){
    const g=document.createElement('div');g.className='kwgroup';
    g.innerHTML='<div class="gt">🗂️ 기타 키워드(빈도순)</div>';
    const c=document.createElement('div');c.className='chips';
    (showAllKw?rest:rest.slice(0,24)).forEach(k=>c.appendChild(chip(k)));
    g.appendChild(c);
    if(rest.length>24){const m=document.createElement('span');m.className='morekw';m.textContent=showAllKw?'▲ 접기':('▼ 나머지 '+(rest.length-24)+'개 더 보기');m.onclick=()=>{showAllKw=!showAllKw;renderKwPanel()};g.appendChild(m)}
    box.appendChild(g);
  }
}
function chip(k,hot){const el=document.createElement('span');el.className='chip'+(hot?' hot':'')+(activeKw===k?' on':'');el.innerHTML=esc(k)+'<span class="n">'+kwCount(k)+'</span>';el.onclick=()=>{activeKw=k;view='kw';render()};return el}

// ---------- MATCHERS ----------
function voiceMatch(k){return VOICE.filter(v=>v.kw.includes(k))}
function dataMatch(k){return DATA.filter(d=>(d.tags||[]).includes(k))}
function issueMatch(k){return ISSUES.filter(i=>i[3].includes(k))}
function refMatch(k){return REFS.filter(r=>r[3].includes(k))}
function artMatch(k){return ARTICLES.filter(a=>(a[1]+' '+a[3]).includes(k))}
function textHit(d){if(!q)return true;const hay=(d.q+' '+(d.script||[]).join(' ')+' '+(d.quotes||[]).map(x=>x[1]).join(' ')+' '+(d.tags||[]).join(' ')+' '+(d.notes||[]).join(' ')).toLowerCase();return hay.includes(q.toLowerCase())}
function qToks(){return q.toLowerCase().split(/\s+/).filter(Boolean)}
function hasAll(hay,toks){hay=hay.toLowerCase();return toks.every(tk=>hay.includes(tk))}
function scoreCard(d,toks){
  const qt=(d.q||'').toLowerCase();
  const tags=(d.tags||[]).join(' ').toLowerCase();
  const quotes=(d.quotes||[]).map(x=>x[1]).join(' ').toLowerCase();
  const must=(d.script||[]).filter(p=>p.startsWith('★')).join(' ').toLowerCase();
  const rest=(d.script||[]).filter(p=>!p.startsWith('★')).join(' ').toLowerCase();
  const notes=(d.notes||[]).join(' ').toLowerCase();
  if(!hasAll(qt+' '+tags+' '+quotes+' '+must+' '+rest+' '+notes,toks))return 0;
  let sc=1;
  toks.forEach(tk=>{
    if(quotes.includes(tk))sc+=50;
    if(must.includes(tk))sc+=40;
    if(rest.includes(tk))sc+=22;
    if(tags.includes(tk))sc+=30;
    if(qt.includes(tk))sc+=8;
    if(notes.includes(tk))sc+=3;
  });
  sc+=(d.no||0)/2000; // 최신 카드 소폭 가산
  return sc;
}
function matchedLines(d,toks){
  const out={quotes:[],must:[],rest:[]};
  (d.quotes||[]).forEach(x=>{if(hasAllAny(x[1],toks))out.quotes.push(x)});
  (d.script||[]).forEach(p=>{
    const m=p.startsWith('★');const body=m?p.slice(1).trim():p;
    if(hasAllAny(body,toks)){(m?out.must:out.rest).push(body)}
  });
  return out;
}
function hasAllAny(s,toks){s=(s||'').toLowerCase();return toks.some(tk=>s.includes(tk))}
function hitCardHTML(d,toks){
  const ml=matchedLines(d,toks);
  let quotes=ml.quotes.map(([s2,tx])=>'<div class="quote">&ldquo;'+hl(tx)+'&rdquo;<b>— '+esc(s2)+'</b></div>').join('');
  let lines=ml.must.map(p=>'<p class="must">'+hl(p)+'</p>').join('')+ml.rest.slice(0,3).map(p=>'<p>'+hl(p)+'</p>').join('');
  if(!quotes&&!lines){lines=(d.script||[]).slice(0,2).map(p=>'<p>'+hl(p.replace(/^★\s*/,''))+'</p>').join('')}
  let tags=(d.tags||[]).map(x=>'<span class="t" data-k="'+esc(x)+'">#'+esc(x)+'</span>').join('');
  return '<div class="card open" data-no="'+d.no+'"><div class="qhead"><span class="mtag">'+esc(d.media)+'</span><span class="qtxt">'+hl(d.q)+'</span><span class="editbtn" data-no="'+d.no+'">✏️</span></div>'+
    '<div class="body">'+quotes+'<div class="script">'+lines+'</div>'+
    '<div style="margin-top:6px"><span class="t showfull" data-no="'+d.no+'" style="cursor:pointer">📖 이 카드 전체 보기</span></div>'+
    (tags?'<div class="tagrow">'+tags+'</div>':'')+'</div></div>';
}

// ---------- CARD RENDER ----------
function cardHTML(d,open){
  const live=d.media==='광주KBS무등의아침';
  let quotes=(d.quotes||[]).map(([s,t])=>'<div class="quote">&ldquo;'+hl(t)+'&rdquo;<b>— '+esc(s)+'</b></div>').join('');
  let script=(d.script||[]).map(p=>{const m=p.startsWith('★');return '<p'+(m?' class="must"':'')+'>'+hl(m?p.slice(1).trim():p)+'</p>'}).join('');
  let tags=(d.tags||[]).map(t=>'<span class="t" data-k="'+esc(t)+'">#'+esc(t)+'</span>').join('');
  return '<div class="card'+(open?' open':'')+'" data-no="'+d.no+'">'+
    '<div class="qhead"><span class="mtag'+(live?' live':'')+'">'+esc(d.media)+'</span>'+
    '<span class="qtxt">'+hl(d.q)+'</span>'+
    '<span class="editbtn" data-no="'+d.no+'" title="이 질문·답변 편집">✏️</span>'+
    '<span class="arrow">▶</span></div>'+
    '<div class="body">'+
    (quotes?'<div class="lbl b">🗣️ 김보미 핵심 워딩</div>'+quotes:'')+
    (script?'<div class="lbl g">💬 답변 스크립트</div><div class="script">'+script+'</div>':'')+
    (d.warn?'<div class="warn">⚠️ '+hl(d.warn)+'</div>':'')+
    (d.notes&&d.notes.length?'<div class="note">📝 '+d.notes.map(hl).join(' / ')+'</div>':'')+
    (d.src&&d.src.length?'<div class="note srcbox">🔗 근거·출처: '+d.src.map(x=>'<a href="'+esc(x[1])+'"'+(String(x[1]).charAt(0)==='#'?'':' target="_blank" rel="noopener"')+'>'+esc(x[0])+'</a>').join(' · ')+'</div>':'')+
    (tags?'<div class="tagrow">'+tags+'</div>':'')+
    '</div></div>';
}
function issueHTML(i){
  const [title,ctx,resp,tags,url]=i;
  return '<div class="card open"><div class="qhead"><span class="mtag" style="background:#8a3d00">이슈</span><span class="qtxt">'+hl(title)+'</span></div>'+
    '<div class="body"><div class="note">'+hl(ctx)+'</div>'+
    '<div class="lbl b">🗣️ 김보미 대응 멘트</div><div class="quote">&ldquo;'+hl(resp)+'&rdquo;</div>'+
    (url?'<div style="margin-top:7px"><a href="'+url+'" target="_blank">🔗 근거 보기</a></div>':'')+
    '<div class="tagrow">'+tags.map(t=>'<span class="t" data-k="'+esc(t)+'">#'+esc(t)+'</span>').join('')+'</div></div></div>';
}
function refHTML(r){const[cat,title,url,kw,summ]=r;return '<a class="artlink" href="'+url+'" target="_blank"><span class="m">'+esc(cat)+'</span><div class="tt">'+hl(title)+'</div><div class="ss">'+hl(summ)+'</div></a>'}
function artHTML(a){const[m,title,url,summ]=a;return '<a class="artlink" href="'+url+'" target="_blank"><span class="m">'+esc(m)+'</span><div class="tt">'+hl(title)+'</div><div class="ss">'+hl(summ)+'</div></a>'}
function voiceHTML(v){return '<div class="card open"><div class="qhead"><span class="mtag" style="background:var(--green)">정견연설</span><span class="qtxt">'+esc(v.sec)+'</span></div><div class="body"><div class="script">'+v.lines.map(l=>'<p>'+hl(l)+'</p>').join('')+'</div><div class="tagrow">'+v.kw.map(t=>'<span class="t" data-k="'+esc(t)+'">#'+esc(t)+'</span>').join('')+'</div></div></div>'}

// ---------- VIEWS ----------
function viewKw(){
  const m=document.getElementById('main');
  if(!activeKw&&!q){
    let html=heroHTML();
    html+='<div class="sec-h">🗂️ 지금까지 준비한 전체 질문지 총취합 <span class="count">'+DATA.length+'건 — 삭제 없이 전부 보존</span></div>';
    MEDIAS.forEach(md=>{
      const cards=DATA.filter(d=>d.media===md);
      if(!cards.length)return;
      html+='<div class="sec-h" style="font-size:13.5px;border-bottom-style:dashed">📁 '+esc(md)+' <span class="count">'+cards.length+'문항</span></div>';
      html+=cards.map(d=>cardHTML(d,false)).join('');
    });
    m.innerHTML=html;bindCards();bindTags();return;
  }
  let html='';
  if(activeKw){html+='<div class="hero"><h2>#'+esc(activeKw)+'</h2><p>이 키워드와 관련된 김보미 발언·답변·이슈·글·기사를 모았습니다. 아래 카드를 눌러 펼쳐보세요.</p></div>'}
  else{html+='<div class="hint">🔎 "'+esc(q)+'" 검색 결과입니다.</div>'}
  if(q&&!activeKw){
    const toks=qToks();
    const ranked=DATA.map(d=>[scoreCard(d,toks),d]).filter(x=>x[0]>0).sort((a,b)=>b[0]-a[0]);
    // 바로 쓸 발언: 상위 카드의 매칭 quotes·★ 라인, 중복 제거
    const seen=new Set();const speak=[];
    ranked.forEach(([sc,d])=>{
      const ml=matchedLines(d,toks);
      ml.quotes.forEach(([s2,tx])=>{const k=tx.replace(/\s+/g,'');if(!seen.has(k)&&speak.length<8){seen.add(k);speak.push({tx,src:d})}});
      ml.must.forEach(tx=>{const k=tx.replace(/\s+/g,'');if(!seen.has(k)&&speak.length<8){seen.add(k);speak.push({tx,src:d})}});
    });
    const vs=VOICE.filter(v=>hasAll(v.lines.join(' '),toks));
    const iss=ISSUES.filter(i=>hasAll(i.join(' '),toks));
    const rf=REFS.filter(r=>hasAll(r.join(' '),toks));
    const ar=ARTICLES.filter(a=>hasAll(a.join(' '),toks));
    const au=(AUTO||[]).filter(x=>hasAll([x.topic,x.one_liner,...(x.points||[]),...(x.questions||[]),...(x.ideas||[])].join(' '),toks));
    const total=ranked.length+vs.length+iss.length+rf.length+ar.length+au.length;
    if(!total){m.innerHTML=html+'<div class="empty">해당 키워드로 찾은 내용이 없습니다. 두 단어로 검색하면 두 단어가 모두 들어간 카드만 나옵니다.</div>';return}
    if(speak.length){html+='<div class="sec-h">🎯 바로 쓸 수 있는 발언 <span class="count">연관도순 · 중복 제거</span></div>';
      html+=speak.map(s=>'<div class="quote" style="margin:8px 0">&ldquo;'+hl(s.tx)+'&rdquo;<b>— '+esc(s.src.media)+' · '+esc((s.src.q||'').slice(0,30))+'&hellip;</b></div>').join('');}
    const top=ranked.slice(0,25);
    if(top.length){html+='<div class="sec-h">💡 연관 답변 카드 <span class="count">'+ranked.length+'건 중 상위 '+top.length+'건 · 매칭 문장만 발췌</span></div>'+top.map(([sc,d])=>hitCardHTML(d,toks)).join('');}
    if(au.length){html+='<div class="sec-h">🤖 자동 발언포인트 <span class="count">'+au.length+'건 · 매일 아침 심층보고서</span></div>'+au.map(x=>autoCardHTML(x,toks)).join('')}
    if(iss.length){html+='<div class="sec-h">⚡ 이슈 대응 카드 <span class="count">'+iss.length+'건</span></div>'+iss.map(issueHTML).join('')}
    if(vs.length){html+='<div class="sec-h">🎤 정견연설 속 목소리</div>'+vs.map(voiceHTML).join('')}
    if(rf.length){html+='<div class="sec-h">📌 관련 글·성명·공약 <span class="count">'+rf.length+'건</span></div>'+rf.map(refHTML).join('')}
    if(ar.length){html+='<div class="sec-h">📰 관련 기사 <span class="count">'+ar.length+'건</span></div>'+ar.map(artHTML).join('')}
    m.innerHTML=html;bindCards();bindTags();
    m.querySelectorAll('.showfull').forEach(el=>el.onclick=(e)=>{e.stopPropagation();const no=+el.dataset.no;const d=DATA.find(x=>x.no===no);if(!d)return;const card=m.querySelector('.card[data-no="'+no+'"]');if(card){card.outerHTML=cardHTML(d,true);bindCards();bindTags();}});
    return;
  }
  const vs=activeKw?voiceMatch(activeKw).filter(textHit):VOICE.filter(v=>v.lines.join(' ').toLowerCase().includes(q.toLowerCase()));
  const ds=(activeKw?dataMatch(activeKw):DATA).filter(textHit);
  const iss=(activeKw?issueMatch(activeKw):ISSUES).filter(i=>!q||(i.join(' ').toLowerCase().includes(q.toLowerCase())));
  const rf=(activeKw?refMatch(activeKw):REFS).filter(r=>!q||(r.join(' ').toLowerCase().includes(q.toLowerCase())));
  const ar=(activeKw?artMatch(activeKw):ARTICLES).filter(a=>!q||(a.join(' ').toLowerCase().includes(q.toLowerCase())));
  const total=vs.length+ds.length+iss.length+rf.length+ar.length;
  if(!total){m.innerHTML=html+'<div class="empty">해당 키워드로 찾은 내용이 없습니다.</div>';return}
  if(vs.length){html+='<div class="sec-h">🎤 정견연설 속 목소리</div>'+vs.map(voiceHTML).join('')}
  if(ds.length){html+='<div class="sec-h">💡 예상 질문 & 답변 스크립트 <span class="count">'+ds.length+'건 — 전부 펼침</span></div>'+ds.map(d=>cardHTML(d,true)).join('')}
  if(iss.length){html+='<div class="sec-h">⚡ 이슈 대응 카드 <span class="count">'+iss.length+'건</span></div>'+iss.map(issueHTML).join('')}
  if(rf.length){html+='<div class="sec-h">📌 관련 글·성명·공약 <span class="count">'+rf.length+'건</span></div>'+rf.map(refHTML).join('')}
  if(ar.length){html+='<div class="sec-h">📰 관련 기사 <span class="count">'+ar.length+'건</span></div>'+ar.map(artHTML).join('')}
  m.innerHTML=html;bindCards();bindTags();
}
function heroHTML(){
  return '<div class="hero"><h2>🗣️ 김보미의 목소리, 한눈에</h2>'+
   '<p>오른쪽 <b>키워드</b>를 누르면 그 주제로 김보미가 지금까지 한 <b>모든 발언·답변·이슈 대응·글·기사</b>가 즉시 정리됩니다. 위 검색창에 문장을 넣어도 됩니다.</p>'+
   SLOGANS.map(s=>'<div class="sl">“'+esc(s[0])+'”</div>').join('')+
   '<p style="margin-top:12px"><b>지금 자주 쓰는 핵심 키워드:</b><br>'+
   ['세대교체','공정','1인1표','기탁금','정청래','호남','계란과바위','청년','반도체800조','송영길김용'].map(k=>'<span class="pill" data-k="'+k+'">#'+k+' '+kwCount(k)+'</span>').join('')+'</p>'+
   '</div>'+
   '<div class="hint">🔥 <b>오늘(7.22) 13:00 MBC 뉴스바사삭</b> 최종 답변 11문항은 <b>🔥 뉴스바사삭(오늘)</b> 탭, <b>08:35 무등의아침</b> 14문항은 <b>🔴 무등의아침</b> 탭에 있습니다.</div>';
}
function viewTimeline(){
  const m=document.getElementById('main');
  let items=TIMELINE.filter(t=>!q||(t.title+t.summ+t.cat).toLowerCase().includes(q.toLowerCase()));
  let html='<div class="hero"><h2>📅 날짜별 발언·활동 타임라인</h2><p>김보미가 날짜별로 발표한 글·성명·정견·인터뷰입니다. 항목을 누르면 원문(김보미.com·기사)으로 이동합니다.</p></div><div class="tl">';
  items.forEach(t=>{
    const hot=t.date==='7.22'||t.cat.includes('생방송');
    html+='<div class="tlitem'+(hot?' hot':'')+'" data-url="'+esc(t.url)+'">'+
      '<span class="tldate">'+esc(t.date)+'</span><span class="tlcat">'+esc(t.cat)+'</span>'+
      '<div class="tltitle">'+hl(t.title)+'</div><div class="tlsumm">'+hl(t.summ)+'</div>'+
      '<div class="tagrow">'+t.kw.slice(0,6).map(k=>'<span class="t" data-k="'+esc(k)+'">#'+esc(k)+'</span>').join('')+'</div></div>';
  });
  html+='</div>';m.innerHTML=html;
  m.querySelectorAll('.tlitem').forEach(el=>el.onclick=(e)=>{if(e.target.classList.contains('t'))return;const u=el.dataset.url;if(u)window.open(u,'_blank')});
  bindTags();
}
function viewLive(){
  const m=document.getElementById('main');
  const cards=DATA.filter(d=>d.media==='광주KBS무등의아침').filter(textHit);
  let html='<div class="hero"><h2>🔴 광주KBS \'출발 무등의 아침\' 대비</h2>'+
    '<p><b>7월 22일(화) 08:35~08:48 · 전화 생방송 · 14문항</b>. 각 카드를 눌러 질문과 답변 스크립트를 확인하세요. 방송 중엔 오른쪽 키워드 목차에서 즉석 대응도 가능합니다.</p></div>';
  html+=cards.map(d=>cardHTML(d,false)).join('');
  m.innerHTML=html;bindCards();bindTags();
}
const OUTLINE=[
 [701,'1. 발표 이후와 달라진 점'],[702,'1-1. 이재명 대통령 X 팔로우'],[703,'2. 젊은데 출마 이유'],
 [704,'3. 세대교체 주장, 멋진 이별'],[705,'4. 청년최고위원 좌초'],[706,'5. 청년 외면 이유, 2030 표심 공략'],
 [707,'6. 1인1표, 알메달렌'],[708,'7. 박지현 소환, 비정상의 극치'],[709,'8. 기탁금 문제'],
 [710,'9. 노년층 지지도 받아야 하는데'],[711,'10. 여론조사 받아보고 기분이'],[712,'11. 뉴스공장 출연 후기'],
 [713,'11-1. 친명·친청 공격 심경'],[714,'12. 당대표 된다면, 386과 어떻게 (홍대선언)'],
 [715,'13. 2030 소통 잘할 것 같은 정치인?'],[716,'14. 롤모델'],[717,'15. 앞으로의 행보']
];
const OUTLINE2=[
 [901,'심1. 가장 많이 받은 질문'],[902,'심2. 정청래 비판 후폭풍'],[912,'심3. 지지 철회·진영논리'],
 [903,'심4. 진정한 세대교체'],[904,'심5. 검증된 대안인가'],[905,'심6. 지역 유지 프레임'],
 [906,'심7. 이진련 사진·계파'],[907,'심8. 송영길·박지현 절차'],[908,'심9. 룰이 공정의 기준인가'],
 [909,'심10. 지방의회 성과·리더십'],[910,'심11. 미래형 민주당 3키워드'],[911,'심12. 분열 걱정'],
 [913,'심13. 홍대선언 예고'],[914,'심14. 클로징 — 계란은 생명']
];
function jumpToday(no){view='today';activeKw=null;render();setTimeout(()=>jumpTo(no),60);}
function jumpTo(no){
  const c=document.querySelector('.card[data-no="'+no+'"]');
  if(c){const oi=c.closest('#oldints');if(oi&&oi.style.display==='none'){oi.style.display='';const b=document.getElementById('oldints-btn');if(b)b.textContent='📚 이전 인터뷰 아카이브 접기';}
    c.classList.add('open');c.scrollIntoView({behavior:'smooth',block:'start'});}
}
function outlineBox(title,items){
  return '<div class="outline"><div class="ot">'+title+'</div><div class="olist">'+
    items.map(([no,t])=>'<span class="oitem" data-jump="'+no+'">📄 '+esc(t)+'</span>').join('')+'</div></div>';
}
function viewNewsba(){
  const m=document.getElementById('main');
  const fin=DATA.filter(d=>d.media==='뉴스바사삭').filter(textHit);
  const prep=DATA.filter(d=>d.media==='바삭한인터뷰').filter(textHit);
  let html='<div class="hero"><h2>🔥 MBC 뉴스바사삭 — 오늘의 핵심 인터뷰</h2>'+
    '<p><b>7.22(화) 13:00</b> — ① <b>방송 질문지 확정 답변</b>(1번~11번: 바사삭 홍보 부탁·X팔로우·홍대선언·계란은 생명)을 먼저 보고, ② 이어지는 <b>심층·돌발 대비</b>(진영논리·지지철회·검증·룰·홍대선언 예고·클로징)까지 확인하세요.</p></div>';
  html+=outlineBox('📑 개요 보기 — 클릭하면 해당 답변으로 바로 이동',OUTLINE);
  html+=outlineBox('🔥 심층·돌발 대비 바로가기',OUTLINE2);
  // ⭐ 꼭 해야 할 말 총정리 (모든 ★ 필수 멘트 수집)
  const titleOf=no=>{const f=OUTLINE.concat(OUTLINE2).find(x=>x[0]===no);return f?f[1]:('#'+no)};
  let mustHtml='';
  prep.concat(fin).forEach(d=>{
    const ms=(d.script||[]).filter(p=>p.startsWith('★'));
    if(!ms.length)return;
    mustHtml+='<div class="mgroup" data-jump="'+d.no+'"><div class="mq">'+esc(titleOf(d.no))+'</div>'+
      ms.map(p=>'<div class="mline">⭐ '+esc(p.slice(1).trim())+'</div>').join('')+'</div>';
  });
  html+='<div class="mustbox"><div class="ot">⭐ 꼭 해야 할 말 총정리 — 방송 직전 최종 점검용 (클릭 시 해당 답변으로 이동)</div>'+mustHtml+'</div>';
  html+='<div class="sec-h">✅ ① 방송 질문지 확정 답변 (1번~15번)</div>'+prep.map(d=>cardHTML(d,false)).join('');
  html+='<div class="sec-h">🔥 ② 심층·돌발 대비 (최신 원워딩)</div>'+fin.map(d=>cardHTML(d,false)).join('');
  m.innerHTML=html;bindCards();bindTags();
  const obtn=document.getElementById('oldints-btn');
  if(obtn)obtn.onclick=()=>{const oi=document.getElementById('oldints');const show=oi.style.display==='none';oi.style.display=show?'':'none';obtn.textContent=show?'📚 이전 인터뷰 아카이브 접기':'📚 이전 인터뷰 아카이브 열기 (머니투데이, TV조선, 취재편의점, 이데일리)';};
  m.querySelectorAll('.oitem').forEach(el=>el.onclick=()=>jumpTo(el.dataset.jump));
  m.querySelectorAll('.mgroup').forEach(el=>el.onclick=()=>jumpTo(el.dataset.jump));
}
const YTN_OUTLINE=[
 [1014,'🔥 [통합] 송영길 호통 + 사방의 비난 — 하나로 답하기'],
 [1001,'1. 짱돌과 화염병 — 기대했던 반응?'],[1002,'2. 송영길 호통 — 어떤 상황?'],
 [1003,'3. 대통령 팔로우 — 직접 연락은?'],[1004,'4. 전당대회 논란 총정리 — 정상인가'],
 [1005,'4-1. 신천지 개입 의혹 — 보고 들은 것?'],[1006,'5. 유시민 ABC론·재건축론·필패론'],
 [1007,'6. 청년 의제 — 구체적 변화는'],[1008,'6-1. 후보들 다 바꾼다는데 믿어지나'],
 [1009,'7. 본경선 이후 계획'],[1010,'7-1. 후환이 두렵지 않나'],
 [1011,'8. 전당대회 이후 민주당 전망'],[1012,'9. 오늘 결과 발표 — 왜 김보미인가 (클로징)'],
 [1013,'[돌발] 대안이 뭐냐 — 공약집 낸 사람은 저뿐']
];
function viewYtn(){
  const m=document.getElementById('main');
  const cards=DATA.filter(d=>d.media==='YTN뉴스명당').filter(textHit);
  let html='<div class="hero"><h2>🎙️ YTN라디오 장성철의 뉴스명당 — 내일 아침 인터뷰</h2>'+
    '<p><b>7.23(목) 오전 7:30 출연 · YTN뉴스퀘어(마포구 상암산로 76) · 담당 임은규 작가 010-8318-0315</b><br>예비경선 결과 발표 당일 아침 방송입니다. 9문항+돌발 3문항 대비 — ⭐ 필수 멘트를 놓치지 마세요.</p></div>';
  const top14=DATA.find(d=>d.no===1014);
  if(top14){html+='<div class="sec-h">🔥 통합 답변 — 송영길 호통 + 사방의 비난, 하나로 답하기 (최신)</div>'+cardHTML(top14,true);}
  html+=outlineBox('📑 개요 보기 — 클릭하면 해당 답변으로 바로 이동',YTN_OUTLINE);
  const titleOf=no=>{const f=YTN_OUTLINE.find(x=>x[0]===no);return f?f[1]:('#'+no)};
  let mustHtml='';
  cards.forEach(d=>{
    const ms=(d.script||[]).filter(p=>p.startsWith('★'));
    if(!ms.length)return;
    mustHtml+='<div class="mgroup" data-jump="'+d.no+'"><div class="mq">'+esc(titleOf(d.no))+'</div>'+
      ms.map(p=>'<div class="mline">⭐ '+esc(p.slice(1).trim())+'</div>').join('')+'</div>';
  });
  html+='<div class="mustbox"><div class="ot">⭐ 꼭 해야 할 말 총정리 — 방송 직전 최종 점검용 (클릭 시 해당 답변으로 이동)</div>'+mustHtml+'</div>';
  const ops=DATA.filter(d=>d.media==='인사말'&&[809,812].includes(d.no));
  html+='<div class="sec-h">🎬 오프닝 멘트 — 방송 시작할 때 (확정본)</div>'+ops.map(d=>cardHTML(d,true)).join('');
  html+='<div class="sec-h">✅ 질문지 전체 답변 (9문항 + 돌발)</div>'+cards.map(d=>cardHTML(d,false)).join('');
  const clos=DATA.filter(d=>d.media==='인사말'&&[810,811].includes(d.no));
  html+='<div class="sec-h">🏁 마무리 멘트 — 방송 끝날 때 (확정본 + 진영논리 경고)</div>'+clos.map(d=>cardHTML(d,true)).join('');
  m.innerHTML=html;bindCards();bindTags();
  const obtn=document.getElementById('oldints-btn');
  if(obtn)obtn.onclick=()=>{const oi=document.getElementById('oldints');const show=oi.style.display==='none';oi.style.display=show?'':'none';obtn.textContent=show?'📚 이전 인터뷰 아카이브 접기':'📚 이전 인터뷰 아카이브 열기 (머니투데이, TV조선, 취재편의점, 이데일리)';};
  m.querySelectorAll('.oitem').forEach(el=>el.onclick=()=>jumpTo(el.dataset.jump));
  m.querySelectorAll('.mgroup').forEach(el=>el.onclick=()=>jumpTo(el.dataset.jump));
}
const SBS_OUTLINE=[
 [1401,'1. 30대·원외·무계파 — 출마 계기'],[1402,'1-1. 당원 반응 — 누구 떨어뜨리려고?'],
 [1403,'2. 왜 골든타임인가'],[1404,'2-1. 청년이 민주당을 외면하는 이유'],
 [1405,'3. 86세대 정치의 문제'],[1406,'4. 직접 항의 들은 적? (송영길 호통)'],
 [1407,'4-1. 송영길 "3김 청산" 반박에는'],[1408,'5. 세대교체 구체 계획'],
 [1409,'6. 신천지 개입설 어떻게 보나'],[1410,'7. 왜 가짜 1인 1표인가'],
 [1411,'7-1. 진짜 1인 1표, 뭐부터?'],[1412,'8. 유시민 어물전 썩은내'],
 [1413,'9. 보완수사권 완전 폐지 입장'],[1414,'10. 마무리 — 민주당은 이렇게 바뀐다'],
 [1415,'🔥 [핵심] 끝나면 뭐 할 거냐 — 앞으로의 행보'],[1416,'[돌발] 누구 지지·연대할 거냐'],
 [1417,'[돌발] 무슨 능력·자격 있냐 — AI·경청·무계파'],
 [1418,'🔥 [꼭 할 말] 3인 캠프의 현실 — 사무실 없이 카페 전전'],
 [1419,'🔥 [핵심 서사] 김보미365 → 정당 깜깜이 재정 → 카르텔 격파'],
 [1420,'📚 [근거] 선배들도 젊을 때 똑같이 외쳤다 + 386 실책 리스트']
];
function viewHongdae(){
  const m=document.getElementById('main');
  const H=P.HONGDAE;
  let html='<div class="hero"><h2>📢 '+esc(H.title)+'</h2><p><b>'+esc(H.date)+'</b><br>'+esc(H.oneline)+'</p></div>';
  // ⭐ 꼭 말할 멘트
  html+='<div class="mustbox"><div class="ot">⭐ 홍대선언 — 방송·인터뷰에서 꼭 말할 멘트</div>'+
    H.must.map(t=>'<div class="mline">⭐ '+esc(t)+'</div>').join('')+'</div>';
  // 4대 진단 요약
  html+='<div class="sec-h">🔎 무엇을 선언했나 — 4대 진단 (간략 요약)</div>';
  H.diagnosis.forEach(([t,s])=>{
    html+='<div class="card open"><div class="qhead"><span class="qtxt">'+esc(t)+'</span></div><div class="body" style="display:block"><div class="script"><p>'+esc(s)+'</p></div></div></div>';
  });
  // 12대 약속 한눈 요약
  html+='<div class="sec-h">✅ 디지털 정당 대전환 12대 약속 (한 줄 요약)</div>';
  H.pledges12.forEach(([n,t,s])=>{
    html+='<div class="card open"><div class="qhead"><span class="mtag" style="background:#0b7a3d">약속 '+n+'</span><span class="qtxt">'+esc(t)+'</span></div><div class="body" style="display:block"><div class="script"><p>'+esc(s)+'</p></div></div></div>';
  });
  // 전문
  html+='<div class="sec-h">📄 선언 전문 (7.22 홍대 · 원문 그대로)</div><div class="card open"><div class="body" style="display:block"><div class="script">'+
    H.full.map(p=>'<p>'+esc(p)+'</p>').join('')+'</div></div></div>';
  m.innerHTML=html;
}
const KBC_OUTLINE=[
 [1601,'Q1. 도전을 마친 소회'],[1602,'Q2. 왜 최고위원 아닌 당대표였나'],
 [1603,'Q3. 가장 크게 얻은 것'],[1604,'Q4. 바뀌어야 한다고 느낀 것'],
 [1605,'Q4-1. 가장 기억에 남는 순간'],[1606,'Q5. 기탁금 논란의 시사점'],
 [1607,'Q6. 세대가 아니라 능력의 문제라는 반론'],[1608,'Q7. 왜 계속 목소리를 냈나'],
 [1609,'Q8. 공천·당운영·신인육성 중 무엇부터'],[1610,'Q9. 호남 정치, 가장 시급한 변화'],
 [1611,'Q10. 반도체 클러스터 — 먼저 준비할 것'],[1612,'Q11. 통합특별시가 갈 방향'],
 [1613,'Q12. 앞으로의 길, 다음 목표']
];
const HANI_OUTLINE=[
 [2198,'🎬 감사 오프닝 인사'],[2200,'📋 개요·전략'],[2201,'Q1. 왜 나왔냐 — 지금 시점의 답'],[2202,'Q2. 가장 힘들었던 점'],
 [2203,'Q3. 5무 정당 — 체감한 현실의 벽'],[2204,'Q4. 제도 개혁 1순위'],
 [2205,'Q5. 득표 비공개 — 밀실정당·서명운동'],[2206,'Q6. 연대 못했다·각개격파'],
 [2207,'Q7. 이낙연계? — 흥신소 정치'],[2208,'Q8. 686 꼰대 정당의 기원'],
 [2209,'Q9. 송영길 고성 — 오해 풀기'],[2210,'Q10. 최대의 성취'],
 [2211,'Q11. 구도 + 누굴 지지'],[2212,'Q12. [압박] 셋 중 하나 고른다면'],
 [2213,'Q13. 당대표는 어떤 사람이어야'],[2214,'Q14. 앞으로의 계획'],
 [2221,'[패널] 충청 첫 순회경선 구도'],[2222,'[패널] 선호투표·정청래 과반론'],
 [2223,'[패널] 친청 최고위원 조직력'],[2224,'[패널·지명] 신천지 수사 + 호남'],
 [2225,'[패널] 신천지 공방 정리 + 구독취소'],[2226,'[패널] 적통·반명 족보 공방'],
 [2227,'[패널] 박지원 쪽박 발언'],[2231,'[검찰] 전건송치 보완책 부족'],
 [2232,'[검찰] 중수청 전방위 수사대 우려'],[2233,'[검찰] 정성호 사의 — 책임론'],
 [2234,'[검찰] 최영중 사건 프레이밍'],[2241,'[조국당] 신장식 합당 거부'],
 [2242,'[조국당] 정청래 유리?'],[2243,'[조국당·지명] 이중당적·대구'],
 [2245,'[예비] 국힘 권영진 멱살'],[2199,'🏁 마무리 인사']
];
function viewHani(){
  const m=document.getElementById('main');
  const cards=DATA.filter(d=>d.media==='한겨레뷰리핑(7.27)').filter(textHit);
  let html='<div class="hero"><h2>🎙️ 한겨레TV 뉴스뷰리핑 — 내일(7.27 월) 09:30 녹화</h2>'+
    '<p><b>진행 하어영 기자 · 패널 강수영 변호사, 김원철 · 1부: 김보미 인터뷰 14문항 → 전당대회 패널 → 검찰개혁 → 조국혁신당 · 2부 국제는 타 패널 중심</b></p>'+
    '<p>🎯 포지션: 탈락 후보가 아니라 본선의 감시자. 개인 공격 없이 시스템 의제로. 판세 질문엔 "득표 비공개라 누구도 모른다" 프레임.</p></div>';
  const titleOf=no=>{const f=HANI_OUTLINE.find(x=>x[0]===no);return f?f[1]:('#'+no)};
  const hop=cards.find(d=>d.no===2198), hcl=cards.find(d=>d.no===2199);
  if(hop){html+='<div class="sec-h">🎬 감사 오프닝 인사 — 시작하자마자</div>'+cardHTML(hop,true);}
  let mustHtml='';
  cards.forEach(d=>{
    const ms=(d.script||[]).filter(p=>p.startsWith('\u2605'));
    if(!ms.length)return;
    mustHtml+='<div class="mgroup" data-jump="'+d.no+'"><div class="mq">'+esc(titleOf(d.no))+'</div>'+
      ms.map(p=>'<div class="mline">\u2b50 '+esc(p.slice(1).trim())+'</div>').join('')+'</div>';
  });
  html+='<div class="mustbox"><div class="ot">\u2b50 꼭 해야 할 말 총정리 — 녹화 직전 최종 점검용 (클릭 시 해당 답변으로 이동)</div>'+mustHtml+'</div>';
  html+=outlineBox('📑 개요 보기 — 클릭하면 해당 답변으로 바로 이동',HANI_OUTLINE);
  html+='<div class="openbar"><button class="ob" id="obOpen">▼ 전체 열기</button><button class="ob" id="obClose">▲ 전체 닫기</button><span class="obh">녹화 중 클릭 소리 없이 스크롤만으로 보세요</span></div>';
  html+='<div class="sec-h">✅ 질문지 전체 답변 (인터뷰 14 + 패널 전 코너) — 전부 열려 있음</div>'+cards.filter(d=>d.no!==2198&&d.no!==2199).map(d=>cardHTML(d,true)).join('');
  if(hcl){html+='<div class="sec-h">🏁 마무리 인사 — 방송 끝날 때</div>'+cardHTML(hcl,true);}
  m.innerHTML=html;bindCards();bindTags();
  const obtn=document.getElementById('oldints-btn');
  if(obtn)obtn.onclick=()=>{const oi=document.getElementById('oldints');const show=oi.style.display==='none';oi.style.display=show?'':'none';obtn.textContent=show?'📚 이전 인터뷰 아카이브 접기':'📚 이전 인터뷰 아카이브 열기 (머니투데이, TV조선, 취재편의점, 이데일리)';};
  m.querySelectorAll('.oitem').forEach(el=>el.onclick=()=>jumpTo(el.dataset.jump));
  m.querySelectorAll('.mgroup').forEach(el=>el.onclick=()=>jumpTo(el.dataset.jump));
  const ob=document.getElementById('obOpen'), oc=document.getElementById('obClose');
  if(ob)ob.onclick=()=>m.querySelectorAll('.card').forEach(c=>c.classList.add('open'));
  if(oc)oc.onclick=()=>m.querySelectorAll('.card').forEach(c=>c.classList.remove('open'));
}
function viewKbc(){
  const m=document.getElementById('main');
  const cards=DATA.filter(d=>d.media==='KBC광주방송').filter(textHit);
  let html='<div class="hero"><h2>🎥 KBC 광주방송 — 오늘(7.24 금) 10:20 녹화</h2>'+
    '<p><b>도착 10:00 (지하1층 주차 → 3층 분장 → 3층 뉴스 스튜디오) · 방송 18:55 · 진행 신민지 기자 · 19분 · KBC 광주방송(광주 서구 무진대로 919)</b></p>'+
    '<p>🎯 예비경선 종료 후 회고 인터뷰 — 톤: 담담하고 품위 있게. 원망이 아니라 감사와 의미, 구조 비판은 회고형으로. "결과는 졌지만 도전은 지지 않았다."</p></div>';
  const titleOf=no=>{const f=KBC_OUTLINE.find(x=>x[0]===no);return f?f[1]:('#'+no)};
  const kop=cards.find(d=>d.no===1614), kcl=cards.find(d=>d.no===1615);
  if(kop){html+='<div class="sec-h">🎬 첫인사 — 전남광주특별시민 여러분께 (녹화 시작 멘트)</div>'+cardHTML(kop,true);}
  let mustHtml='';
  cards.forEach(d=>{
    const ms=(d.script||[]).filter(p=>p.startsWith('★'));
    if(!ms.length)return;
    mustHtml+='<div class="mgroup" data-jump="'+d.no+'"><div class="mq">'+esc(titleOf(d.no))+'</div>'+
      ms.map(p=>'<div class="mline">⭐ '+esc(p.slice(1).trim())+'</div>').join('')+'</div>';
  });
  html+='<div class="mustbox"><div class="ot">⭐ 꼭 해야 할 말 총정리 — 녹화 직전 최종 점검용 (클릭 시 해당 답변으로 이동)</div>'+mustHtml+'</div>';
  html+=outlineBox('📑 개요 보기 — 클릭하면 해당 답변으로 바로 이동',KBC_OUTLINE);
  html+='<div class="openbar"><button class="ob" id="obOpen">▼ 전체 열기</button><button class="ob" id="obClose">▲ 전체 닫기</button><span class="obh">녹화 중 클릭 소리 없이 스크롤만으로 보세요</span></div>';
  html+='<div class="sec-h">✅ 질문지 전체 답변 (12문항 + 꼬리) — 전부 열려 있음</div>'+cards.filter(d=>d.no<1614).map(d=>cardHTML(d,true)).join('');
  if(kcl){html+='<div class="sec-h">🏁 마무리 인사 — 호남이 호남의 정치인을 키워 주십시오</div>'+cardHTML(kcl,true);}
  const sg=DATA.filter(d=>d.media==='세계일보(서면)');
  if(sg.length){html+='<div class="sec-h">📝 추가 대비질문 — 세계일보 질문지 10문항 (겹치는 주제, 같은 워딩으로 답하면 됨)</div>'+sg.map(d=>cardHTML(d,true)).join('');}
  m.innerHTML=html;bindCards();bindTags();
  const obtn=document.getElementById('oldints-btn');
  if(obtn)obtn.onclick=()=>{const oi=document.getElementById('oldints');const show=oi.style.display==='none';oi.style.display=show?'':'none';obtn.textContent=show?'📚 이전 인터뷰 아카이브 접기':'📚 이전 인터뷰 아카이브 열기 (머니투데이, TV조선, 취재편의점, 이데일리)';};
  m.querySelectorAll('.oitem').forEach(el=>el.onclick=()=>jumpTo(el.dataset.jump));
  m.querySelectorAll('.mgroup').forEach(el=>el.onclick=()=>jumpTo(el.dataset.jump));
  const ob=document.getElementById('obOpen'), oc=document.getElementById('obClose');
  if(ob)ob.onclick=()=>m.querySelectorAll('.card').forEach(c=>c.classList.add('open'));
  if(oc)oc.onclick=()=>m.querySelectorAll('.card').forEach(c=>c.classList.remove('open'));
}
function viewSbs(){
  const m=document.getElementById('main');
  const cards=DATA.filter(d=>d.media==='SBS뉴스브리핑').filter(textHit);
  let html='<div class="hero"><h2>📺 SBS 주영진의 뉴스브리핑 — 오늘 14:00 생방송</h2>'+
    '<p><b>7.23(목) 14:00 · 예비경선 결과 발표 당일 · 출연 15~20분.</b> 당일 현안·즉석 질문 가능.</p>'+
    '<p>🙏 <b>후원 안내</b>: 농협 301-0389-4337-61 (예금주: 더불어민주당당대표경선후보자 김보미) · 📞 문의 010-9946-3650</p>'+
    '<p>🎯 <b>전략 메모(7.23 아침 확정)</b>: ① 포멀하지만 쟁점을 다루는 유튜브 성격 — <b>세게 말해도 됩니다</b>. ② 오늘 <b>당직자 카르텔을 터트리는 날</b> — 민주당 문제점 질문에서 정면으로. ③ <b>"많이 준비했다"는 말 금지</b> — 그 시간에 내용을 말할 것. ④ 지지 후보 질문엔 "방향에 동의하는 당대표를 지지" 프레임.</p></div>';
  const fscript=DATA.filter(d=>d.media==='SBS확정대본');
  if(fscript.length){html+='<div class="sec-h">📄 후보 확정 대본 — 질문지 준비.docx 그대로 (7.23 최종)</div>'+fscript.map(d=>cardHTML(d,true)).join('');
  html+='<div class="sec-h" style="margin-top:22px">📚 이하: 상세 대비 자료 (참고용)</div>';}
  html+=outlineBox('📑 개요 보기 — 클릭하면 해당 답변으로 바로 이동',SBS_OUTLINE);
  const titleOf=no=>{const f=SBS_OUTLINE.find(x=>x[0]===no);return f?f[1]:('#'+no)};
  let mustHtml='';
  cards.forEach(d=>{
    const ms=(d.script||[]).filter(p=>p.startsWith('★'));
    if(!ms.length)return;
    mustHtml+='<div class="mgroup" data-jump="'+d.no+'"><div class="mq">'+esc(titleOf(d.no))+'</div>'+
      ms.map(p=>'<div class="mline">⭐ '+esc(p.slice(1).trim())+'</div>').join('')+'</div>';
  });
  html+='<div class="mustbox"><div class="ot">⭐ 꼭 해야 할 말 총정리 — 방송 직전 최종 점검용 (클릭 시 해당 답변으로 이동)</div>'+mustHtml+'</div>';
  const sops=DATA.filter(d=>d.media==='인사말'&&[809,812].includes(d.no));
  html+='<div class="sec-h">🎬 오프닝 멘트 — 방송 시작할 때 (확정본)</div>'+sops.map(d=>cardHTML(d,true)).join('');
  const cartel=DATA.find(d=>d.no===808);
  if(cartel){html+='<div class="sec-h">💣 오늘의 핵심 — 당직자 카르텔 (터트리기로 확정)</div>'+cardHTML(cartel,true);}
  html+='<div class="sec-h">✅ 질문지 전체 답변 (10문항 + 꼬리질문 + 핵심 대비 3)</div>'+cards.map(d=>cardHTML(d,false)).join('');
  const sclos=DATA.filter(d=>d.media==='인사말'&&[810,811].includes(d.no));
  html+='<div class="sec-h">🏁 마무리 멘트 — 방송 끝날 때 (확정본 + 진영논리 경고)</div>'+sclos.map(d=>cardHTML(d,true)).join('');
  m.innerHTML=html;bindCards();bindTags();
  const obtn=document.getElementById('oldints-btn');
  if(obtn)obtn.onclick=()=>{const oi=document.getElementById('oldints');const show=oi.style.display==='none';oi.style.display=show?'':'none';obtn.textContent=show?'📚 이전 인터뷰 아카이브 접기':'📚 이전 인터뷰 아카이브 열기 (머니투데이, TV조선, 취재편의점, 이데일리)';};
  m.querySelectorAll('.oitem').forEach(el=>el.onclick=()=>jumpTo(el.dataset.jump));
  m.querySelectorAll('.mgroup').forEach(el=>el.onclick=()=>jumpTo(el.dataset.jump));
}
function viewWritten(){
  const m=document.getElementById('main');
  const groups=[['이데일리','📰 이데일리 인터뷰 (9문항 · 7.30 목 10:00 하지나 차장)'],
                ['기자회견문·성명','📄 기자회견문·성명 원문 (7.14 국회 소통관 기자회견문 / 7.17 박지현·송영길 / 7.21 고함 사건)'],
                ['한겨레TV','🎙️ 한겨레TV 출연 대비 (내일 7.25 · 기출질문+최근주장+본선쟁점+할말)'],
                ['경향신문(통화)','📞 경향신문 김민아 논설위원 통화 대비 (10분 · 칼럼 인용용)'],
                ['JTBC','📺 JTBC 인터뷰 (9문항 · 청년정치 구조 심층, 7.24)'],
                ['세계일보(서면)','📰 세계일보 서면 인터뷰 (10문항 · 청년정치 제도 심층, 7.24)'],
                ['프레시안(서면)','📰 프레시안 인터뷰 (3문항 · 7.24)'],
                ['뉴스핌(서면)','📰 뉴스핌 서면 인터뷰 (8문항 · 후보 수정 확정본)'],
                ['무등일보(서면)','📰 무등일보 인터뷰 최종안 (32문항)'],
                ['뉴스1(서면)','📰 뉴스1 서면 인터뷰 (9문항)']];
  let html='<div class="hero"><h2>📰 JTBC·서면 인터뷰 — 발송본 아카이브</h2>'+
    '<p>언론사에 보낸 서면 답변 전문입니다. 같은 질문이 방송에서 다시 나오면 이 워딩 그대로 답하면 됩니다. #키워드를 누르면 관련 발언으로 이동합니다.</p></div>';
  groups.forEach(([md,label])=>{
    const cards=DATA.filter(d=>d.media===md).filter(textHit);
    if(!cards.length)return;
    html+='<div class="sec-h">'+label+'</div>'+cards.map(d=>cardHTML(d,false)).join('');
  });
  m.innerHTML=html;bindCards();bindTags();
}
function viewGreet(){
  const m=document.getElementById('main');
  const cards=DATA.filter(d=>d.media==='인사말').filter(textHit);
  let html='<div class="hero"><h2>👋 첫인사·마무리 호소 멘트</h2>'+
    '<p>상황별로 골라 쓰는 <b>첫인사 3종</b>(표준·풀뿌리·도전형)과 <b>마무리 호소 3종</b>(표준·아름다운 퇴장·건설하는 정치). ✏️로 수정해 나만의 버전을 만들 수 있습니다.</p></div>';
  html+=cards.map(d=>cardHTML(d,true)).join('');
  m.innerHTML=html;bindCards();bindTags();
}
function viewSpeech(){
  const m=document.getElementById('main');
  let html='<div class="hero"><h2>🎤 연설·성명 — 김보미의 목소리</h2><p>「아름다운 퇴장이 민주주의를 완성합니다」(7.21 성명)와 서울시의회 정견연설(7.21). 방송에서 그대로 인용 가능한 원문입니다.</p></div>';
  html+=VOICE.filter(v=>!q||v.lines.join(' ').toLowerCase().includes(q.toLowerCase())).map(voiceHTML).join('');
  m.innerHTML=html;bindTags();
}
function viewPledge11(){
  const m=document.getElementById('main');
  let html='<div class="hero"><h2>📜 공약 총정리 — 11대 대전환 공약 + 연설 발표 공약</h2>'+
    '<p>계파의 민주당·686 운동권 민주당을 끝내고 <b>당원과 국민의 민주당을 대전환</b>하는 11대 공약(7.21)과 <b>합동연설회·정견발표에서 발표한 공약</b>(모병제·군복무 보상·청년취업보장제 등)을 모두 모았습니다. #키워드를 누르면 관련 발언으로 이동합니다.</p></div>';
  const list=PLEDGES11.filter(p=>!q||(p[1]+' '+p[3]).toLowerCase().includes(q.toLowerCase()));
  html+='<div class="sec-h">📜 대전환 11대 공약 (7.21)</div>';
  html+=list.map(p=>'<div class="card open"><div class="qhead"><span class="mtag" style="background:#8a3d00">공약 '+esc(p[0])+'</span><span class="qtxt">'+hl(p[1])+'</span></div>'+
    '<div class="body"><p class="script">'+hl(p[3])+'</p><div class="tagrow">'+p[2].map(t=>'<span class="t" data-k="'+esc(t)+'">#'+esc(t)+'</span>').join('')+'</div></div></div>').join('');
  const sp=(SPEECH_PLEDGES||[]).filter(p=>!q||(p[0]+' '+p[2]).toLowerCase().includes(q.toLowerCase()));
  if(sp.length){
    html+='<div class="sec-h">🎖️ 합동연설회·정견발표 공약</div>';
    html+=sp.map(p=>'<div class="card open"><div class="qhead"><span class="mtag" style="background:var(--green)">연설 공약</span><span class="qtxt">'+hl(p[0])+'</span></div>'+
      '<div class="body"><p class="script">'+hl(p[2])+'</p><div class="tagrow">'+p[1].map(t=>'<span class="t" data-k="'+esc(t)+'">#'+esc(t)+'</span>').join('')+'</div></div></div>').join('');
  }
  m.innerHTML=html;bindTags();
}
function viewAbout(){
  const m=document.getElementById('main');
  let html='<div class="hero"><h2>📋 '+esc(PROFILE.name)+' <span style="font-size:13px;color:#555">'+esc(PROFILE.age)+'</span></h2><p>'+esc(PROFILE.tagline)+'</p>'+
    '<div class="lbl b" style="margin-top:6px">주요 경력</div>'+PROFILE.career.map(c=>'<div style="font-size:13px;margin:2px 0">• '+esc(c)+'</div>').join('')+'</div>';
  html+='<div class="sec-h">📢 슬로건·핵심 메시지</div><div class="hero">'+SLOGANS.map(s=>'<div class="sl">“'+esc(s[0])+'”</div>').join('')+'</div>';
  html+='<div class="sec-h">✅ 5대 분야 25개 약속</div>';
  PLEDGES.forEach(pl=>{html+='<div class="card open"><div class="qhead"><span class="qtxt">'+esc(pl[0])+'</span></div><div class="body"><p class="script">'+hl(pl[2])+'</p><div class="tagrow">'+pl[1].map(t=>'<span class="t" data-k="'+esc(t)+'">#'+esc(t)+'</span>').join('')+'</div></div></div>'});
  html+='<div class="sec-h">🗓️ 정치 경력 타임라인</div><div class="hero">'+PROFILE.timeline.map(t=>'<p><span class="pill">'+esc(t[0])+'</span> '+esc(t[1])+'</p>').join('')+'</div>';
  html+='<div class="sec-h">🏅 의정 주요 성과(실력 증명)</div><div class="hero">'+PROFILE.achievements.map(a=>'<p>• '+esc(a)+'</p>').join('')+'</div>';
  html+='<div class="sec-h">📞 채널</div><div class="hero">'+Object.entries(PROFILE.contact).map(([k,v])=>'<p><b>'+esc(k)+':</b> '+esc(v)+'</p>').join('')+'<p style="margin-top:8px;font-size:12px;color:#555">'+esc(PROFILE.fund)+'</p></div>';
  m.innerHTML=html;bindTags();
}
function bindCards(){document.querySelectorAll('.card').forEach(c=>{const h=c.querySelector('.qhead');if(h&&c.querySelector('.arrow'))h.onclick=()=>c.classList.toggle('open');const eb=c.querySelector('.editbtn');if(eb)eb.onclick=(e)=>{e.stopPropagation();openEditor(+eb.dataset.no)};})}

// ---------- 편집기 ----------
function openEditor(no){
  const d=DATA.find(x=>x.no===no); if(!d) return; closeEditor();
  const ov=document.createElement('div'); ov.className='editov'; ov.id='editov';
  const quStr=(d.quotes||[]).map(x=>x[0]+' :: '+x[1]).join('\n');
  ov.innerHTML='<div class="editbox">'+
    '<h3>✏️ 질문·답변 편집 <span>'+esc(d.media)+'</span></h3>'+
    '<label>질문</label><textarea id="e_q" rows="2">'+esc(d.q)+'</textarea>'+
    '<label>답변 스크립트 (한 줄 = 한 문단)</label><textarea id="e_s" rows="8">'+esc((d.script||[]).join('\n'))+'</textarea>'+
    '<label>핵심 워딩 (한 줄 = "화자 :: 인용")</label><textarea id="e_qu" rows="4">'+esc(quStr)+'</textarea>'+
    '<label>주의사항(선택)</label><textarea id="e_w" rows="2">'+esc(d.warn||'')+'</textarea>'+
    '<div class="ebtns"><button class="save" id="e_save">💾 저장</button><button class="cancel" id="e_cancel">취소</button>'+
    '<span class="ehint">저장은 이 브라우저에 보관됩니다. 라이브 사이트 반영은 상단 「편집본 내보내기」로 파일을 받아 교체하세요.</span></div>'+
    '</div>';
  document.body.appendChild(ov);
  ov.onclick=(e)=>{if(e.target===ov)closeEditor()};
  document.getElementById('e_cancel').onclick=closeEditor;
  document.getElementById('e_save').onclick=()=>saveEditor(no);
}
function closeEditor(){const o=document.getElementById('editov');if(o)o.remove()}
function saveEditor(no){
  const d=DATA.find(x=>x.no===no); if(!d) return;
  d.q=document.getElementById('e_q').value.trim();
  d.script=document.getElementById('e_s').value.split('\n').map(s=>s.trim()).filter(Boolean);
  d.quotes=document.getElementById('e_qu').value.split('\n').map(s=>s.trim()).filter(Boolean).map(l=>{const i=l.indexOf('::');return i>-1?[l.slice(0,i).trim(),l.slice(i+2).trim()]:['김보미',l]});
  const w=document.getElementById('e_w').value.trim(); d.warn=w||null;
  persistEdits(); closeEditor();
  const n=document.getElementById('editnotice'); if(n)n.style.display='inline-flex';
  render();
}
function exportEdited(){
  document.getElementById('__payload').textContent=JSON.stringify(P).replace(/<\//g,'<\\/');
  const html='<!DOCTYPE html>\n'+document.documentElement.outerHTML;
  const b=new Blob([html],{type:'text/html;charset=utf-8'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download='dashboard.html'; a.click();
}
function resetEdits(){if(confirm('이 브라우저에 저장한 편집 내용을 모두 초기화할까요?')){localStorage.removeItem(LSKEY);location.reload();}}
function bindTags(){document.querySelectorAll('.t[data-k],.pill[data-k]').forEach(el=>el.onclick=(e)=>{e.stopPropagation();activeKw=el.dataset.k;view='kw';q='';document.getElementById('kwsearch').value='';render()})}

function viewToday(){
  const m=document.getElementById('main');
  const chwi=DATA.filter(d=>d.media==='취재편의점').filter(textHit);
  const chwiMain=chwi.filter(d=>d.no<=2368||d.no===2371||d.no===2372);
  const chwiInt=chwi.filter(d=>d.no===2369||d.no===2370);
  const eda=DATA.filter(d=>d.media==='이데일리').filter(textHit);
  const tvc=DATA.filter(d=>d.media==='TV조선').filter(textHit);
  const mtc=DATA.filter(d=>d.media==='머니투데이').filter(textHit);
  const gjc=DATA.filter(d=>d.media==='광주기자회견').filter(textHit);
  const h21=DATA.filter(d=>d.media==='한겨레21').filter(textHit);
  const gjQA=gjc.filter(d=>d.no<=2516), gjPark=gjc.filter(d=>d.no===2517);
  const tvcMain=tvc.filter(d=>d.no<=2391), tvcInt=tvc.filter(d=>d.no===2392);
  const edaMain=eda.filter(d=>d.no<=2310), edaInt=eda.filter(d=>d.no===2311);
  const short=t=>{t=t.replace(/^\[?(예상 추가|Q)\s?/,'').replace(/^\d+[.\]·\s]*/,'');return t.length>34?t.slice(0,34)+'…':t};
  const sda=DATA.filter(d=>d.media==='신동아').filter(textHit);
  const ckd=DATA.filter(d=>d.media==='⚠️ 교차점검').filter(textHit);
  const imam=DATA.filter(d=>d.media==='이맘때(광주KBS)').filter(textHit);
  const h21x=DATA.filter(d=>d.media==='한겨레21 추가(8.18)').filter(textHit);
  let html='';
  if(imam.length){html+='<div class="outline" style="border-color:#c62828"><div class="ot" style="color:#c62828">🔴 광주KBS 1TV 「이맘때」 261회 단독 20분 — 최종 대본 문항 바로가기 (17문항)</div><div class="olist">'+imam.map(d=>'<span class="oitem" data-jump="'+d.no+'">🎬 '+esc(qlabel(d))+'</span>').join('')+'</div></div>';}
  html+=imam.length?'<div class="sec-h" style="color:#c62828">🔴 광주KBS 「이맘때」 자막용 확정 대본 (단독 20분)</div>'+imam.map(d=>cardHTML(d,true)).join(''):'';
  if(h21x.length){html+='<div class="outline" style="border-color:#c2185b"><div class="ot" style="color:#c2185b">🆕 한겨레21 서면 추가질문 (8.18) — 문항 바로가기</div><div class="olist">'+h21x.map(d=>'<span class="oitem" data-jump="'+d.no+'">📝 '+esc(qlabel(d))+'</span>').join('')+'</div></div>';}
  html+=h21x.length?'<div class="sec-h" style="color:#c2185b">🆕 한겨레21 서면 추가질문 — 전당대회 결과 3문항</div>'+h21x.map(d=>cardHTML(d,true)).join(''):'';
  if(sda.length){html+='<div class="outline"><div class="ot" style="color:#7a2fa0">🆕 신동아 서면 인터뷰 — 문항 바로가기</div><div class="olist">'+sda.map(d=>'<span class="oitem" data-jump="'+d.no+'">📄 '+esc(qlabel(d))+'</span>').join('')+'</div></div>';}
  html+=sda.length?'<div class="sec-h" style="color:#7a2fa0">🆕 신동아 서면 인터뷰 — 최신 확정 답변지 (7문항)</div>'+sda.map(d=>cardHTML(d,true)).join(''):'';
  html+=ckd.length?'<div class="sec-h" style="color:#c0504d">⚠️ 교차점검 — 말하기 전 확인할 것 (발언용 아님)</div>'+ckd.map(d=>cardHTML(d,false)).join(''):'';
  html+='<div class="issuebar"><div class="ot">🔥 이슈 키워드 <button class="mtoggle" id="mtoggle" style="float:right;padding:2px 10px;font-size:12px">⭐ 핵심만</button></div>'+
    ['TV토론','수박겉핥기','정청래','개헌','연임','지지후보','충북투표중단','신천지','당원명부','한병도','미래대응기금','보완수사권','청년최고위원제','6개월규정','결과비공개','기탁금1천만원','탈당','전국의김보미'].map(k=>{const kk=k.split(' ')[0];return '<span class="pill" data-k="'+kk+'">#'+kk+' '+kwCount(kk)+'</span>'}).join('')+'</div>';
  html+='<div class="todaycols">'+
    '<div class="outline"><div class="ot" style="color:#c2185b">📰 ① 오늘 14:00 — 한겨레21 심층 인터뷰 23문항 바로가기</div><div class="olist">'+
      h21.map(d=>'<span class="oitem" data-jump="'+d.no+'">📄 '+esc(qlabel(d))+'</span>').join('')+'</div></div>'+
    '<div class="outline"><div class="ot">📢 ② 8.10 기자회견 질의응답 바로가기</div><div class="olist">'+
      gjQA.map(d=>'<span class="oitem" data-jump="'+d.no+'">📄 '+esc(qlabel(d))+'</span>').join('')+
      '<span class="oitem" data-jump="2517" style="color:#0b6e4f;font-weight:800">🤝 박선원 최고위원 후보 지지 멘트 (클릭)</span>'+'</div></div>'+
    '<div class="outline"><div class="ot" style="color:#b02020">🚨 돌발 대비 — 방송 질문에 없는 주제</div><div class="olist">'+
      [2363,2355,2365,2366,2368,2372,2351,2304,2303,2310].map(no=>{const d=DATA.find(x=>x.no===no);return d?'<span class="oitem" data-jump="'+d.no+'">⚡ '+esc(qlabel(d))+'</span>':''}).join('')+'</div></div></div>';
  html+='<div class="sec-h" style="color:#c2185b">📰 ① 오늘 14:00 한겨레21 심층 인터뷰 — 23문항 확정 답변지 (관련 공약·발언 자료 포함)</div>'+h21.map(d=>cardHTML(d,true)).join('');
  html+='<div class="sec-h">📢 ② 8.10 광주 기자회견 질의응답 대비 — 공천혁신특위 환영·호남 공천혁명 촉구(13문항 + 지역현안·공통대응 3문항)</div>'+gjQA.map(d=>cardHTML(d,true)).join('');
  html+='<div class="sec-h" style="color:#0b6e4f">🤝 박선원 최고위원 후보 지지 멘트 — 클릭해서 열기</div>'+gjPark.map(d=>cardHTML(d,false)).join('');
  html+='<div style="text-align:center;margin:18px 0"><button id="oldints-btn" class="mtoggle" style="padding:9px 20px;font-size:13.5px">📚 이전 인터뷰 아카이브 열기 (머니투데이, TV조선, 취재편의점, 이데일리)</button></div>';
  html+='<div id="oldints" style="display:none">';
  html+='<div class="sec-h">📰 ② 머니투데이 서면 인터뷰 최종본 — 전당대회가 청년들에게 남긴 것</div>'+mtc.map(d=>cardHTML(d,true)).join('');
  html+='<div class="sec-h">📺 ③ TV조선 뉴스퍼레이드(7.31) 확정본</div>'+tvcMain.map(d=>cardHTML(d,true)).join('');
  if(tvcInt.length)html+='<div class="sec-h">🔒 TV조선 내부 메모</div>'+tvcInt.map(d=>cardHTML(d,false)).join('');
  html+='<div class="sec-h">🔴 ④ 취재편의점(7.30) 참고질문지</div>'+chwiMain.map(d=>cardHTML(d,false)).join('');
  if(chwiInt.length)html+='<div class="sec-h">🔒 취재편의점 내부 참고 (문서 미수록)</div>'+chwiInt.map(d=>cardHTML(d,false)).join('');
  html+='<div class="sec-h">📰 ⑤ 이데일리(7.30) 답변지</div>'+edaMain.map(d=>cardHTML(d,false)).join('');
  if(edaInt.length)html+='<div class="sec-h">🔒 이데일리 내부 팩트시트</div>'+edaInt.map(d=>cardHTML(d,false)).join('');
  html+='</div>';
  m.innerHTML=html;bindCards();bindTags();
  const obtn=document.getElementById('oldints-btn');
  if(obtn)obtn.onclick=()=>{const oi=document.getElementById('oldints');const show=oi.style.display==='none';oi.style.display=show?'':'none';obtn.textContent=show?'📚 이전 인터뷰 아카이브 접기':'📚 이전 인터뷰 아카이브 열기 (머니투데이, TV조선, 취재편의점, 이데일리)';};
  m.querySelectorAll('.oitem').forEach(el=>el.onclick=()=>jumpTo(el.dataset.jump));
  m.querySelectorAll('.mgroup').forEach(el=>el.onclick=()=>jumpTo(el.dataset.jump));
  const tg=document.getElementById('mtoggle');
  if(tg)tg.onclick=()=>{m.classList.toggle('mustonly');tg.classList.toggle('on');
    if(m.classList.contains('mustonly')){m.querySelectorAll('.card').forEach(c=>{if(c.querySelector('.must'))c.classList.add('open');});tg.textContent='📖 전체 답변 보기';}
    else tg.textContent='⭐ 핵심 멘트만 보기';};
}

const KBS0812_HTML="<div class=\"hero\"><h2>📻 8.12(수) 생방 최종 — KBS 전격시사 + 한겨레21</h2><p><b>KBS1 &lt;전격시사&gt; 08:30~08:55 생방송</b> · 진행 소현정 기자 · 담당 전효재 작가(010-5748-6460) · 공동출연 김형남 전 군인권센터 사무국장<br><b>한겨레21</b> 14:00 · 한겨레신문사 4층 · 김규남 기자 (선출 결과 문항은 8.17 이후 전화 보완)<br>⚠ 판세 수치(김민석 46.01% · 정청래 44.53% · 송영길 9.47%)는 방송 직전 최신 결과로 재확인</p></div><div class=\"sec-h\">📻 KBS 전격시사 — 확정 답변지 (질문 원문 그대로)</div><div class=\"card open\" id=\"k812-0\"><div class=\"qhead\"><span class=\"mtag\">KBS 생방</span><span class=\"qtxt\">【Q1 · 출마 소회】 1/ 후보 등록 기간 기탁금 문제부터 해서, 청년최고위원 제도 도입에 대한 논란도 있었습니다. 결과적으로 아쉽게도 청년 후보들이 예비경선에서 컷오프 되는 바람에 전당대회 과정에서 청년의 목소리가 더 듣기 어려워진 것 같은데요. 아픈 이야기지만 다른 이야기하기 전에, 이번 전당대회에 출마한 소회도 한 말씀 듣고 싶습니다.</span></div><div class=\"body\" style=\"display:block\"><div class=\"lbl g\">💬 답변 스크립트</div><div class=\"script\"><p><b>정말 많은 관심과 큰 사랑을 받았습니다. 감사한 마음으로 용기를 내고 있습니다. 정치하기 참 잘했다는 생각이 듭니다.</b></p><p>당락의 유불리를 떠나 가치와 미래를 보고 한 표를 던져 주신 분들, 본인의 젊은 날을 떠올리며 청년의 도전에 손을 내밀어 주신 진짜 어른들, 훌륭한 선배님 후배님들. 그 한 분 한 분이 정말 감사했습니다.</p><p>이런 분들을 만나고 배우고 소통할 수 있다는 것, 그게 정치의 가장 큰 베네핏 아니겠습니까. 물론 평생 들을 욕도 다 들었습니다. 사람에게 상처도 받지만, 결국 더 훌륭한 많은 분들에게 힘을 얻습니다.</p><p><b style=\"color:#8a2a2a\">계란은 깨졌지만, 바위에 낸 금은 남았습니다.</b></p></div></div></div><div class=\"card open\" id=\"k812-1\"><div class=\"qhead\"><span class=\"mtag\">KBS 생방</span><span class=\"qtxt\">【Q1-1 · 연설 기회 부족】 - 공식적으로 후보 연설을 들을 기회도 굉장히 적었어요?</span></div><div class=\"body\" style=\"display:block\"><div class=\"lbl g\">💬 답변 스크립트</div><div class=\"script\"><p><b>집권여당의 전당대회 예비경선이라고 하기에도 부끄러운, 한마디로 불공정과 반민주의 표본이었습니다.</b></p><p>검증 토론회 한 번 없이, 청중 없는 스튜디오에서 7분짜리 동영상 한 번 찍은 게 전부였습니다. 연설회가 아니라 '동영상 촬영회'였지요.</p><p><b style=\"color:#8a2a2a\">이 짧은 예비경선 기간에 민주당이 현주소를 다 보여줬다고 생각합니다.</b></p></div></div></div><div class=\"card open\" id=\"k812-2\"><div class=\"qhead\"><span class=\"mtag\">KBS 생방</span><span class=\"qtxt\">【Q1-2 · 청년 원외의 어려움(후원회)】 - 청년 원외 정치인이 현실적으로 겪는 어려움은 어떤 게 있습니까?</span></div><div class=\"body\" style=\"display:block\"><div class=\"lbl g\">💬 답변 스크립트</div><div class=\"script\"><p><b>다들 보좌관에 비서진이 있으시지만, 여기 김형남 국장님이나 저나 본인이 다 해야 합니다. 특히 후원회 문제를 빼놓을 수 없습니다.</b></p><p>저는 지난 지방선거 때 후원회를 만들고 싶어도 컷오프되고 나서야 승인이 나는 바람에, 후원금 한 번 못 받아 보고 고생은 고생대로 하고, 서류 작성에 해산 신고까지 하느라 속이 많이 상했습니다.</p><p>그 경험이 있어서 이번엔 다 제쳐 두고 목숨 걸다시피 매달렸고, 운 좋게 겨우 개설해서 하루 이틀이나마 모금을 하고 컷오프됐습니다. 그런데 다른 후보님들은 컷오프된 뒤에야 절차가 진행돼 모금 자체를 못 했습니다.</p><p>개인의 문제가 아니라 당 시스템의 문제입니다. 실제 선거운동이 하루 이틀뿐인데, 이게 어떻게 전당대회가 되겠습니까.</p><p><b style=\"color:#8a2a2a\">기울어진 운동장이 아니라, 기탁금을 내고도 운동장에 사실상 입장조차 못 하는 현실입니다.</b></p></div></div></div><div class=\"card open\" id=\"k812-3\"><div class=\"qhead\"><span class=\"mtag\">KBS 생방</span><span class=\"qtxt\">【Q2 · 전대 룰 · 준비 부족】 2/ 1인1표제와 선호투표제가 처음으로 적용되는 전당대회인데, 투표를 하고 연설을 듣는다는 등 전당대회 룰에 대한 지적이 있지 않습니까. 준비가 부족했다는 점에 대해서는 어떻게 생각하시는지요?</span></div><div class=\"body\" style=\"display:block\"><div class=\"lbl g\">💬 답변 스크립트</div><div class=\"script\"><p><b>이력서도 안 읽고 합격 도장부터 찍는 회사는 없죠? 저는 준비 부족이 아니라 설계라고 봅니다. 돈 드는 일도 아닙니다. 의지의 문제입니다.</b></p><p>많은 분들이 개선해야 한다고 말하면 좀 들어야 하지 않겠습니까. '개가 짖어도 기차는 간다'는 식의 불통이 진짜 문제입니다.</p><p><b style=\"color:#8a2a2a\">당원주권, 1인1표를 구호로만 외칠 게 아니라 당원이 체감하게 해야 합니다. 듣는 척도 하지 않지만, 저는 계속 목소리를 내겠습니다.</b></p></div></div></div><div class=\"card open\" id=\"k812-4\"><div class=\"qhead\"><span class=\"mtag\">KBS 생방</span><span class=\"qtxt\">【Q3 · 지명직 청년 배정 공약】 3/ 김민석 후보는 지명직 최고위원 중 하나는 청년 선출직 최고위원으로, 다른 하나는 노동계 최고위원으로 하겠다는 입장을 밝혔고, 송영길 후보는 지명직 두 자리를 모두 청년에게 배정하겠다고 밝혔습니다. 정청래 후보도 청년 평당원 가운데 1명을 지명직으로 임명하겠다는 입장이고요. 이건 어떻게 보시는지요?</span></div><div class=\"body\" style=\"display:block\"><div class=\"lbl g\">💬 답변 스크립트</div><div class=\"script\"><p><b>김대중 대통령께서 젊은피 수혈로 30대 청년 김민석, 송영길을 발탁하셨고, 그분들이 30년간 정치를 해 오시지 않았습니까.</b></p><p>그런데 지금 민주당의 현실을 보십시오. 2030이 어디 있습니까. 5060 정당입니다.</p><p>지난 30년 정치인으로 뭐 하시다가, 당대표가 되면 갑자기 하시겠다니 믿음이 안 가는 게 당연하지 않습니까. 심지어 두 분은 당대표까지 지내신 분들입니다.</p><p><b style=\"color:#8a2a2a\">선거 때 공약을 막 던질 게 아니라 정말 신중해야 합니다. 정치인에게 가장 중요한 건 책임감입니다.</b></p></div></div></div><div class=\"card open\" id=\"k812-5\"><div class=\"qhead\"><span class=\"mtag\">KBS 생방</span><span class=\"qtxt\">【Q4 · 2030 청년 타운홀 미팅】 4/ 전당대회와 동시에 '2030 청년 타운홀 미팅'도 진행이 되고 있습니다. 좀 구체적인 이야기가 되고 있나요? 당이 청년 목소리를 더 반영하기 위해서는 구조적으로 어떤 변화가 필요하다고 보십니까?</span></div><div class=\"body\" style=\"display:block\"><div class=\"lbl g\">💬 답변 스크립트</div><div class=\"script\"><p><b>제가 페이스북에 쓴 그대로입니다. 말만 최종면접이지, 결국 전당대회 마지막 대미를 장식하는 데 청년을 병풍으로, 들러리로 사진 찍으러 오라는 것 아닌가. 너무 아쉽습니다.</b></p><p>투표가 사실상 다 끝난 뒤에 보는 면접이 무슨 면접입니까. 채용 끝내 놓고 면접관 부르는 회사는 없습니다.</p><p><b style=\"color:#8a2a2a\">청년에게 사실상 마이크도 안 주는 정당이 무슨 권한을 주겠나 싶지만, 그래도 저는 계속 외칩니다. 당사자에게 정책 권한을 달라, 예산 권한을 달라.</b></p></div></div></div><div class=\"card open\" id=\"k812-6\"><div class=\"qhead\"><span class=\"mtag\">KBS 생방</span><span class=\"qtxt\">【Q5 · 버스하우스 논란】 5/ 황희 의원이 '버스하우스' 논란에 대해 사과를 했습니다만, 청년 민심과 부동산 민심을 제대로 읽지 못하고 있다는 지적이 거셉니다. 이 문제는 어떻게 보셨는지요?</span></div><div class=\"body\" style=\"display:block\"><div class=\"lbl g\">💬 답변 스크립트</div><div class=\"script\"><p><b>중요한 건 청년의 분노를 못 읽었다는 겁니다. 저는 정책 아이디어 자체는 다양하게 펼쳐져야 한다고 생각합니다. 문제는 절차와 과정입니다.</b></p><p>본인들은 쾌적한 집에 살면서 청년에게는 폐버스를 던져 주니 와닿지 않는 겁니다. 저도 이번 경선 때 서울에 잘 곳이 없어 렌터카에서 쪽잠을 잤습니다. 땡볕에 걸어보지 않은 사람은 그늘길 앱 같은 정책을 못 만듭니다.</p><p>홍콩의 튜브하우스, 스웨덴의 대학가 마이크로주택처럼 진지한 대안은 많습니다. 청년과 함께 설계하면 됩니다.</p><p><b style=\"color:#8a2a2a\">던져 놓고 지우는 정치도, 조롱만 하는 정치도 청년의 잠자리는 못 지킵니다.</b></p><p><b style=\"color:#b02a2a\">▼ [Q5-1 예상] 부동산 공급대책, 세제개편안 의견을 물으면 (간결판)</b></p><p><b style=\"color:#8a2a2a\">⭐ 핵심 한 문장 — 청년은 낼 세금이 없어서 힘든 게 아니라, 낼 집이 없어서 힘듭니다.</b></p><p><b>[정부 대책 평가]</b> 방향은 옳습니다. 거주 중심으로 가는 것, 찬성합니다. 다만 이번 개편은 종부세를 조이고 양도세 퇴로를 열어 다주택자 매물을 끌어내는 구조입니다. 집이 매물로 나오면 그 집에 세 들어 살던 청년부터 나가야 합니다. 집값 잡는 대책은 있는데, 세입자 지키는 대책이 없습니다.</p><p><b>내일 나올 공급대책에는 딱 두 가지만 담아 주십시오. 5만 호 중 청년 몫이 몇 호인지, 그리고 언제 입주하는지. 총량만 발표하면 청년 몫은 늘 마지막에 사라집니다.</b></p><p><b>[청년 주거난의 본질]</b> 부모 자산이 없으면 서울에서 못 버팁니다. 2026년 최저임금이 월 215만 원, 세금 떼면 200만 원이 안 됩니다. 그런데 원룸 월세에 관리비까지 더하면 소득의 3분의 1이 그냥 나갑니다. 대출 규제는 투기꾼 잡겠다고 만들었는데 청년 실수요자가 같이 맞고 있습니다. 청년과 신혼부부는 예외로 하겠다고 7월부터 검토만 하고 있습니다.</p><p><b>[당장 할 일 3가지]</b> 첫째, 청년월세지원이 월 20만 원입니다. 서울 월세의 3분의 1도 안 됩니다. 현실에 맞게 올려야 합니다. 둘째, 월 30만 원대에 살 수 있는 청년임대주택을 눈에 보이게 늘려야 합니다. 기숙사와 청년주택은 주민 반대로 번번이 무산되는데, 정부가 직접 중재해야 지어집니다. 셋째, 이번 대책은 서울과 수도권에 집중돼 있습니다. 한쪽은 집이 없어 난리인데 저희 강진은 빈집이 늘어 갑니다. 수도권에 5만 호 짓는 정성의 절반만 지방 빈집을 청년 주거로 바꾸는 데 써 주십시오.</p><p><b style=\"color:#8a2a2a\">부동산 정책의 성적표는 세율표에 있지 않습니다. 청년이 오늘 밤 어디서 자느냐에 있습니다.</b></p><p style=\"font-size:12.5px;color:#555\">📌 검증 수치 — 세제개편안 8.3 발표(다주택 양도세 중과 2027~2028 한시 완화: 2주택 20%p→5%p, 3주택 이상 30%p→10%p / 종부세 강화). 공급대책 8.13 발표 예정, 최대 5만 호 규모(서울 준공업지역, 수도권 유휴부지 중심). 2026 최저임금 시급 10,320원, 월 환산 215만 6,880원. 청년월세지원 월 최대 20만 원, 최대 24개월, 2026년부터 상시 신청. 청년과 신혼부부 대출 총량규제 예외는 금융당국 7월부터 검토 중.</p></div></div></div><div class=\"card open\" id=\"k812-7\"><div class=\"qhead\"><span class=\"mtag\">KBS 생방</span><span class=\"qtxt\">【Q6 · 귀를 사로잡은 것(공천혁신)】 6/ 전당대회 이야기 조금 더 해보면, 청년 정치인의 입장에서 봤을 때, 지금까지 진행 과정에서 청년의 귀를 사로잡는 이야기가 있습니까?</span></div><div class=\"body\" style=\"display:block\"><div class=\"lbl g\">💬 답변 스크립트</div><div class=\"script\"><p><b>솔직히 공약을 지킬지 의구심부터 드는데, 무슨 솔깃한 이야기가 있겠습니까. 청년들은 지금 투표도 하기 싫어합니다. 그 마음, 너무나 잘 압니다. 뽑고 싶은 후보가 없는 겁니다.</b></p><p>민주당에서 13년째 정치하고 있는 저 김보미에게 유일하게 솔깃했던 건 공천 혁신입니다. 모든 후보 가운데 유일하게 호남 공천 문제의 심각성과 임계점에 다다른 호남의 분노를 파악하고, 당대표가 되는 즉시 공천혁신특위를 구성해 연말까지 새 공천 시스템을 만들겠다는 김민석 후보의 발언에, 저는 환영하고 공천혁신 완수를 촉구하는 기자회견까지 했습니다.</p><p><b style=\"color:#8a2a2a\">누가 대표가 되든 바뀌지 않는 공천 시스템이 서야, 기울어지지 않은 운동장이 됩니다. 공정한 링만 세워지면, 능력 있는 분들로 싹쓸이 세대교체가 될 거라고 확신합니다.</b></p><p><b style=\"color:#b02a2a\">※ 특위에 제안할 3가지가 이어서 나오면 → 돌발카드 ② 참고</b></p></div></div></div><div class=\"card open\" id=\"k812-8\"><div class=\"qhead\"><span class=\"mtag\">KBS 생방</span><span class=\"qtxt\">【Q7 · 어떤 지도부가 필요한가】 7/ 두 분은 이번 전당대회에서 가장 중요한 게 뭐라고 생각하십니까? 어떤 지도부가 선출되어야 한다고 생각하시는지요?</span></div><div class=\"body\" style=\"display:block\"><div class=\"lbl g\">💬 답변 스크립트</div><div class=\"script\"><p><b>누가 되느냐보다, 누가 되어도 바뀌지 않는 시스템을 남기느냐입니다. 낡은 운영체제 위에 새 얼굴만 얹는 건 혁신이 아니라 도색입니다.</b></p><p>경선과 공천 데이터를 공개할 지도부, 청년에게 자리가 아니라 예산과 결정권을 줄 지도부, 과거에 복수하는 대신 AI 대전환과 지방소멸, 청년의 삶이라는 미래의 언어로 일할 지도부입니다.</p><p><b style=\"color:#8a2a2a\">재집권에 실패하면 다시 계엄입니다. 이기려면 2030이 돌아와야 하고, 그 시작은 공정입니다.</b></p></div></div></div><div class=\"card open\" id=\"k812-9\"><div class=\"qhead\"><span class=\"mtag\">KBS 생방</span><span class=\"qtxt\">【Q8 · 판세 (수치 방송직전 재확인!)】 8/ 전당대회 마지막 승부처인 호남과 서울경기 순회경선이 오늘부터 본격적으로 시작됩니다. 지금까지는 투표 결과, 김민석 후보가 46.01%(9만 5821표), 정청래 후보가 44.53%(9만 2735표), 송영길 후보가 9.47%(1만 9715표)로 초박빙 승부를 보이고 있는데요. 두 분은 판세 어떻게 보고 계시는지요?</span></div><div class=\"body\" style=\"display:block\"><div class=\"lbl g\">💬 답변 스크립트</div><div class=\"script\"><p><b>정말 안타까운 건, 모두가 대통령팔이만 하고 있다는 겁니다. 뒷받침하겠다면서, 정작 대통령께서 밤낮으로 뛰고 계신 미래 의제를 구체적으로 어떻게 뒷받침하겠다는 말은 들리지도 않습니다.</b></p><p>아직도 적통이냐 적자냐 족보 캐기, 과거 복수혈전뿐입니다. 국민은 공감도 관심도 없습니다. 그러니 뽑고 싶은 후보가 없다는 말이 나오고, 당이 대통령 발목을 잡아 지지율까지 끌어내리고 있으니 한탄스럽기 짝이 없습니다.</p><p>언제부터 민주당이 일부 강성 지지층 목소리에 흔들리는 정당이었습니까. 침묵하는 다수가 더 많습니다. 그분들의 목소리를 듣는 정당이 되자고, 제가 홍대에서 선언했습니다.</p><p><b style=\"color:#8a2a2a\">경선 규칙 6개월 전 확정, 유령당원 정리와 결과 100% 공개, 기탁금 폐지와 공영제, 청년 결정권, 당 재정 공개, 그리고 시민의 삶과 링크된 디지털 정당. 민주당이 가야 할 길은 이미 나와 있습니다.</b></p><p><b style=\"color:#b02a2a\">※ 판세 수치(46.01% · 44.53% · 9.47%)는 방송 직전 최신 결과로 재확인</b></p></div></div></div><div class=\"card open\" id=\"k812-10\"><div class=\"qhead\"><span class=\"mtag\">KBS 생방</span><span class=\"qtxt\">【Q9 · 호남 바닥 민심】 9/ 김보미 의장님은 호남에서 활동하고 계시니 바닥 민심이 어떤지 의견 듣고 싶은데요. 최근 여론조사에서는 김민석 후보가 정청래 후보를 크게 앞서는 걸로 나왔습니다? 어떻게 체감하십니까?</span></div><div class=\"body\" style=\"display:block\"><div class=\"lbl g\">💬 답변 스크립트</div><div class=\"script\"><p><b>그야말로 부글부글 끓고 있습니다. 정청래 후보는 당대표 시절 호남표를 얻기 위해 '4무 공천' 사기극을 벌였습니다. 저는 강진에서 그 현장을 몸으로 겪었습니다.</b></p><p>그런데 아무 책임도 지지 않고 연임에 도전하는 것 자체가 호남을 무시하는 일이라고 생각합니다. 제가 이렇게 발언하는 이유는 분명합니다. 지방선거 참패의 책임을 져야 할 당 지도부였기 때문입니다. 민주 정치는 책임 정치입니다.</p><p>전당대회 때만 되면 호남팔이 해대는 것도 지겹습니다. 정청래 후보께서 토론회에서 강진 사위라고 홍보하시던데요. 이번 지방선거 공천장 수여식을 강진군에서 할 때, '사위 자식 개자식', '전과 5범 공천한 정 서방, 인자 처갓집 오지 마소' 같은 공천 폭거 규탄 현수막에 상여까지 등장해 난리가 났고, 정문으로 들어가지도 못하셨습니다.</p><p><b style=\"color:#8a2a2a\">호남팔이 그만하십시오. 제발 정치인들이 책임과 양심을 가졌으면 좋겠습니다.</b></p></div></div></div><div class=\"card open\" id=\"k812-11\"><div class=\"qhead\"><span class=\"mtag\">KBS 생방</span><span class=\"qtxt\">【Q10 · 최고위원 선거】 10/ 최고위원 선거도 굉장히 치열합니다. 지금까지는 최민희 후보가 1등을 유지하고 있고, 이른바 친명 후보가 3명, 친청 후보가 2명입니다. 호남에서 변동이 있을까요? 어떻게 예상하십니까?</span></div><div class=\"body\" style=\"display:block\"><div class=\"lbl g\">💬 답변 스크립트</div><div class=\"script\"><p><b>순위보다 걱정되는 건 선거의 언어입니다. '박쥐'에 '일베'까지 나왔습니다.</b></p><p><b style=\"color:#8a2a2a\">민주주의, 공정, 청년, 미래, 세대교체가 없는 5무 정당에 품격까지 사라지면 6무입니다. 전당대회가 콜로세움이 되어서는 안 됩니다.</b></p></div></div></div><div class=\"card open\" id=\"k812-12\"><div class=\"qhead\"><span class=\"mtag\">KBS 생방</span><span class=\"qtxt\">【Q11 · 서울경기 민심 · 2030】 11/ 호남과 서울경기 투표가 하루 차이인데, 서울경기 민심은 어떻게 전망하시는지요? 호남과 비슷하게 갈까요? - 그런데, 지역의 2030 민심과 수도권 2030 민심은 좀 차이가 있다고 보십니까?</span></div><div class=\"body\" style=\"display:block\"><div class=\"lbl g\">💬 답변 스크립트</div><div class=\"script\"><p><b>참 신기한 게, 당대표까지 지내신 분이 피해자 코스프레를 하십니다. 하기야 목을 자르겠다느니 무섭게 발언하시는 분도 당대표 하신 분이니 그럴 법도 합니다만, 참 안타깝습니다.</b></p><p>제가 이번 경선에서 뼈저리게 느낀 게 있습니다. 평생 먹을 욕도 먹고 관심도 많이 받았습니다만, 다들 족보 캐고 사진 파묘만 하고 있더라는 겁니다. 제발 사진 파묘 말고 정책 파묘를 했으면 좋겠습니다.</p><p>싸우더라도 정책 가지고 싸워야지, 노사모네 아니네부터 돌아가신 분들 이름만 불러대고 있으니, 청년들 눈에는 정치인들이 제정신인가 싶은 겁니다.</p><p><b style=\"color:#8a2a2a\">정책을 파고들어 정책으로 싸우는 전당대회라면, 서울이든 경기든 호남이든 청년들이 다시 투표장으로 돌아올 겁니다.</b></p></div></div></div><div class=\"card open\" id=\"k812-13\"><div class=\"qhead\"><span class=\"mtag\">KBS 생방</span><span class=\"qtxt\">【Q12 · 갈등 봉합 · 불법당원】 12/ 계속 이야기해왔습니다만, 계파간 경쟁이 심해지면서 전당대회 이후 갈등 봉합에 대한 우려도 있습니다. 신천지 논란, 조국혁신당과 합당 논란 등 불씨가 금방 꺼질 것 같지 않거든요?</span></div><div class=\"body\" style=\"display:block\"><div class=\"lbl g\">💬 답변 스크립트</div><div class=\"script\"><p><b>이런 논란으로 시끌시끌한 것 자체가 말이 안 됩니다. 그 동네 살지도 않는 불법당원, 자기가 당원인지도 모르는 유령당원, 이 당 저 당 모두 가입한 이중당원까지 — 불법당원은 불법입니다. 불법은 정리해야지요. 왜 정리하지 않고 묵인하고 덮고 갑니까.</b></p><p>이번 기회에 당원명부를 행안부 자료와 대조해서 불법당원 전수조사를 확실히 해야 합니다. 총선이 금방인데 지금 뭐 하고 있는 겁니까.</p><p><b style=\"color:#8a2a2a\">쇄신할 부분은 확실하게 쇄신하고 가야 합니다. 그렇지 않으면 민주당에 미래도 없고 답도 없습니다. 망합니다.</b></p><p><b style=\"color:#b02a2a\">※ 신천지 의혹 자체를 물으면 → 돌발카드 ④ (조건부 답변만)</b></p></div></div></div><div class=\"card open\" id=\"k812-14\"><div class=\"qhead\"><span class=\"mtag\">KBS 생방</span><span class=\"qtxt\">【Q13 · 오늘 TV토론 쟁점】 13/ 오늘 오후 2시 마지막 당대표 TV토론이 예정돼 있습니다. 오늘 토론회 쟁점은 뭐가 될 거라고 보십니까?</span></div><div class=\"body\" style=\"display:block\"><div class=\"lbl g\">💬 답변 스크립트</div><div class=\"script\"><p><b>토론이 갈수록 감정적으로 격화되는 게 보입니다. 바닥 민심을 아직도 모른다는 생각이 듭니다.</b></p><p><b style=\"color:#8a2a2a\">국민과 당원들이 보고 싶은 건 감정싸움이 아니라 정책 검증입니다. 침묵하는 다수의 목소리를 듣는 토론이 되기를 바랍니다.</b></p></div></div></div><div class=\"card open\" id=\"k812-15\"><div class=\"qhead\"><span class=\"mtag\">KBS 생방</span><span class=\"qtxt\">【Q13-1 · 남은 변수】 - 호남과 서울경기, 사실 약 70% 권리당원이 남아있기 때문에 큰 변동이 일어날 수도 있는 상황인데, 남은 기간 변수가 있다면 어떤 게 있을까요?</span></div><div class=\"body\" style=\"display:block\"><div class=\"lbl g\">💬 답변 스크립트</div><div class=\"script\"><p><b>솔직히 얼마나 네거티브가 난무할지 벌써부터 눈살이 찌푸려집니다. 밥그릇 싸움하시는 데 별 기대는 없고요.</b></p><p>승자도 패자도 함께 빛나는 민주당, 민주주의와 공정과 청년이 살아 있는 민주당, 세대교체로 미래를 여는 민주당. 그 민주당을 만드는 데 전국의 계란들이 꿈틀꿈틀 움직이고 있습니다.</p><p><b style=\"color:#8a2a2a\">끝까지 계란으로 바위 치기, 도전의 역사는 계속될 것입니다.</b></p></div></div></div><div class=\"card open\" id=\"k812-16\"><div class=\"qhead\"><span class=\"mtag\">KBS 생방</span><span class=\"qtxt\">【Q13-2 · 5·18 국정과제 1호】 - 전날 열린 KBC TV토론회에서 송영길 후보가 정청래 후보에게 '국정과제 1호'를 묻자 정 후보는 내란청산이라고 말하면서 공식 국정과제 1호인 5·18헌법전문수록을 답하지 못했습니다. 이에 대해 어떻게 보시는지요?</span></div><div class=\"body\" style=\"display:block\"><div class=\"lbl g\">💬 답변 스크립트</div><div class=\"script\"><p><b>말실수가 아니라 우선순위의 문제라고 봅니다. 5·18 정신의 헌법 전문 수록은 이재명 정부가 국민께 약속한 국정과제 1호이자, 호남에게는 정체성 그 자체입니다.</b></p><p>여당 대표가 되겠다는 분이라면 정부의 1호 약속은 몸에 새기고 있어야지요. 여당 대표의 일은 자기 어젠다를 앞세우는 게 아니라, 정부의 약속을 뒷받침해 완수하는 것입니다.</p><p><b style=\"color:#8a2a2a\">뭣이 중헌지 아는 정치가 필요합니다. 호남 투표 직전에 호남이 이 장면을 어떻게 받아들일지, 지켜볼 일입니다.</b></p></div></div></div><div class=\"card open\" id=\"k812-17\"><div class=\"qhead\"><span class=\"mtag\">KBS 생방</span><span class=\"qtxt\">【★ 기회되면 할 말 · 재정주권】 [기회되면 할 말] 재정주권 시민행동 공동대표로서 — 앞으로의 계획 (진행자 질문과 무관하게 기회가 올 때)</span></div><div class=\"body\" style=\"display:block\"><div class=\"lbl g\">💬 답변 스크립트</div><div class=\"script\"><p><b>재정주권 시민행동 공동대표로서 '예산 바로보기' 운동을 하고 있습니다. 저희가 만든 '나라살림 돋보기'는 동네 이름만 치면 전국 243개 지자체와 중앙정부 예산이 3초 만에 나옵니다. 내가 낸 세금이 어디로 가는지 직접 들여다보는 것만큼 확실한 정치 참여는 없습니다.</b></p><p>그런데 정작 정당은 어떻습니까. 울릉군도 재정을 공개하고 정부도 예산서를 다 공개하는데, 국고보조금에 선거보조금까지 받는 정당은 그 돈을 어디에 썼는지 공개하지 않습니다. 밀실이 부패를 만듭니다.</p><p><b style=\"color:#8a2a2a\">정당의 깜깜이 회계가 투명해지는 그날까지, 청년들과 함께 이 운동을 전국으로 넓혀 가겠습니다.</b></p></div></div></div><div class=\"sec-h\">🚨 KBS 돌발질문 대비 카드 — 질문지에 없는 질문이 오면</div><div class=\"card open\" id=\"k812-18\"><div class=\"qhead\"><span class=\"mtag\" style=\"background:#b02020\">돌발대비</span><span class=\"qtxt\">【돌발① · \"그래서 누구를 지지하십니까?\"】 (돌발) 결국 누가 당대표가 되길 바라십니까? 특정 후보를 지지하시는 겁니까?</span></div><div class=\"body\" style=\"display:block\"><div class=\"lbl g\">💬 답변 스크립트</div><div class=\"script\"><p><b>저는 특정 후보가 아니라 시스템을 지지합니다. 제 기준은 딱 하나 — 공천혁신을 누가 실제로 해내느냐입니다.</b></p><p>김민석 후보의 공천혁신특위 공약을 환영하는 기자회견을 한 것도, 사람이 아니라 약속을 보고 한 일입니다.</p><p><b style=\"color:#8a2a2a\">누가 되든, 그 약속이 지켜지는지 끝까지 지켜보고 목소리를 내겠습니다.</b></p></div></div></div><div class=\"card open\" id=\"k812-19\"><div class=\"qhead\"><span class=\"mtag\" style=\"background:#b02020\">돌발대비</span><span class=\"qtxt\">【돌발② · 공천특위에 제안할 3가지】 (돌발) 공천혁신특위가 실제로 만들어지면, 어떤 제안을 하시겠습니까?</span></div><div class=\"body\" style=\"display:block\"><div class=\"lbl g\">💬 답변 스크립트</div><div class=\"script\"><p><b>세 가지입니다. 첫째, 공천 규칙은 선거 6개월 전에 확정하고, '달리 정할 수 있다'는 예외조항을 삭제해야 합니다.</b></p><p>둘째, 유령당원·불법당원·이중당원을 깨끗이 정리하고, 투표율과 후보별 득표수까지 경선 결과를 100% 공개해야 합니다. 그리고 토론과 연설로 실력을 겨루도록 보장해야 합니다.</p><p>셋째, 특위 구성이 핵심입니다. 현 시스템의 수혜자, 낡은 운영체계 덕분에 기득권을 쌓아온 정치인은 배제해야 합니다.</p><p><b style=\"color:#8a2a2a\">특위 위원의 과반수를 낙천자와 청년 당원으로 채워야, 공천혁명이 가능합니다.</b></p></div></div></div><div class=\"card open\" id=\"k812-20\"><div class=\"qhead\"><span class=\"mtag\" style=\"background:#b02020\">돌발대비</span><span class=\"qtxt\">【돌발③ · 예비경선 공약이 뭐였나】 (돌발) 예비경선 때 내세운 공약은 무엇이었습니까?</span></div><div class=\"body\" style=\"display:block\"><div class=\"lbl g\">💬 답변 스크립트</div><div class=\"script\"><p><b>홍대에서 선언했습니다. 5대 분야, 25개 약속, 3단계 로드맵입니다.</b></p><p>핵심만 말씀드리면 — 경선 규칙 6개월 전 확정과 결과 100% 공개의 '유리상자 경선', 기탁금 폐지와 선거 공영제, 청년에게 자리가 아니라 예산과 결정권, 정당 재정 공개, 그리고 시민의 삶과 링크된 디지털 정당입니다.</p><p><b style=\"color:#8a2a2a\">전문은 김보미닷컴에 다 공개되어 있습니다.</b></p></div></div></div><div class=\"card open\" id=\"k812-21\"><div class=\"qhead\"><span class=\"mtag\" style=\"background:#b02020\">돌발대비</span><span class=\"qtxt\">【돌발④ · 신천지 의혹 (조건부만!)】 (돌발) 신천지 당원 가입 의혹, 어떻게 보십니까?</span></div><div class=\"body\" style=\"display:block\"><div class=\"lbl g\">💬 답변 스크립트</div><div class=\"script\"><p><b>의혹이 사실이라면 있을 수 없는 일이고, 반드시 진상을 규명해서 책임을 물어야 합니다.</b></p><p>다만 지금은 의혹 단계입니다. 답은 하나입니다. 당원명부 전수조사로 당이 스스로 투명하게 밝히면 됩니다.</p><p><b style=\"color:#8a2a2a\">덮으면 의혹은 커지고, 공개하면 끝납니다.</b></p><p><b style=\"color:#b02a2a\">※ 가드레일: 단정 금지 — 반드시 '사실이라면' 조건부 유지</b></p></div></div></div><div class=\"card open\" id=\"k812-22\"><div class=\"qhead\"><span class=\"mtag\" style=\"background:#b02020\">돌발대비</span><span class=\"qtxt\">【돌발⑤ · 송영길 재판 관련】 (돌발) 송영길 후보의 재판(돈봉투 사건) 문제는 어떻게 보십니까?</span></div><div class=\"body\" style=\"display:block\"><div class=\"lbl g\">💬 답변 스크립트</div><div class=\"script\"><p><b>재판이 진행 중인 사안이라 유무죄를 예단하지 않겠습니다.</b></p><p><b style=\"color:#8a2a2a\">다만 정당이 사법 리스크에 대해 국민 눈높이에 맞는 기준과 절차를 세워야 한다는 것, 그게 핵심이라고 봅니다.</b></p><p><b style=\"color:#b02a2a\">※ 가드레일: 절차 프레임만 — 개인 공격·유무죄 판단 금지</b></p></div></div></div><div class=\"card open\" id=\"k812-23\"><div class=\"qhead\"><span class=\"mtag\" style=\"background:#b02020\">돌발대비</span><span class=\"qtxt\">【돌발⑥ · 향후 계획 · 총선 출마?】 (돌발) 전당대회가 끝나면 무엇을 하실 겁니까? 총선에 출마하십니까?</span></div><div class=\"body\" style=\"display:block\"><div class=\"lbl g\">💬 답변 스크립트</div><div class=\"script\"><p><b>우선 재정주권 시민행동 공동대표로 '예산 바로보기' 운동을 전국으로 넓히겠습니다. 그리고 청년들과 함께, 공천혁신이 실제로 완수되는지 끝까지 감시하겠습니다.</b></p><p><b style=\"color:#8a2a2a\">총선은 지금 말할 단계가 아닙니다. 지금은 당을 바꾸는 일이 먼저입니다.</b></p></div></div></div><div class=\"card open\" id=\"k812-24\"><div class=\"qhead\"><span class=\"mtag\" style=\"background:#b02020\">돌발대비</span><span class=\"qtxt\">【돌발⑦ · 이재명 정부 평가】 (돌발) 이재명 대통령의 국정운영은 어떻게 평가하십니까?</span></div><div class=\"body\" style=\"display:block\"><div class=\"lbl g\">💬 답변 스크립트</div><div class=\"script\"><p><b>대통령께서는 밤낮없이 미래 의제를 뛰고 계십니다. 문제는 당입니다. 과거 싸움으로 대통령 발목을 잡아 지지율을 끌어내리고 있지 않습니까.</b></p><p><b style=\"color:#8a2a2a\">여당이 할 일은 대통령팔이가 아니라, 정부의 약속을 정책으로 뒷받침해 완수하는 것입니다.</b></p></div></div></div><div class=\"card open\" id=\"k812-25\"><div class=\"qhead\"><span class=\"mtag\" style=\"background:#b02020\">돌발대비</span><span class=\"qtxt\">【돌발⑧ · 군인권 쪽 질문이 오면】 (돌발) 군인권 관련 질문이 김보미에게 넘어올 때 — 짧게 받고 넘기기</span></div><div class=\"body\" style=\"display:block\"><div class=\"lbl g\">💬 답변 스크립트</div><div class=\"script\"><p><b>군인권 문제는 옆에 계신 김형남 국장님께서 훨씬 정확하게 말씀해 주실 겁니다.</b></p><p><b style=\"color:#8a2a2a\">저는 한 가지만 보태겠습니다. 군 문제든 청년 문제든, 당사자의 목소리가 정책이 되는 구조 — 그게 바뀌어야 한다는 것입니다.</b></p></div></div></div><div class=\"sec-h\">📰 한겨레21 심층 인터뷰 답변지</div><div class=\"card open\" id=\"k812-26\"><div class=\"qhead\"><span class=\"mtag\" style=\"background:#0b7a3d\">한겨레21</span><span class=\"qtxt\">1. 당대표 경선 과정, 어떤 마음으로 뛰었고 무엇이 남았나. 소회를 듣고 싶다.</span></div><div class=\"body\" style=\"display:block\"><div class=\"lbl g\">💬 답변 스크립트</div><div class=\"script\"><p><b>화가 나서 나왔습니다. 민주당은 지방선거에서 참패했는데 반성도 사과도 없었습니다. 높으신 분들은 죽었다 깨어나도 모르는 바닥 민심을 전하러, 국민 대신 회초리를 들고 나왔습니다. 출마선언에서 저는 민주당에 다섯 가지가 없다고 했습니다. 민주주의, 공정, 청년, 미래, 세대교체. 5무(無) 정당이라고요. 그런데 이번 경선이 그 다섯 가지 없음을 따로 설명할 필요도 없이 총망라해서 보여줬습니다. 등록을 마친 뒤에야 받아 본 경선 규칙, 기탁금을 내고도 토론회 한 번 없이 청중 없는 스튜디오에서 7분 동영상 한 번 찍은 것이 전부였던 '동영상 촬영회', 그리고 지금까지도 알 수 없는 제 득표수. 민주당의 민낯을 어떤 말보다 정확하게 보여준 것이 이번 경선이었습니다.</b></p><p>그런데 남은 것은 절망이 아니라 사람입니다. 조직도 계파도 없는 세 명짜리 캠프가 카페와 식당을 전전하며 노트북 하나로 회의했는데, 나흘 동안 107명의 국민이 1,909만 원을 후원해 주셨습니다. 실제로 짱돌을 들었던 민주화운동 세대 선배님이 전화를 주셔서 '네 말이 맞다, 우리 세대가 미안하다'고 하셨습니다. 저는 이번 경선에서 확인했습니다. 당락의 유불리가 아니라 가치를 보고 표를 던지는 당원들이 계시다는 것, 침묵하는 다수가 살아 계시다는 것을요. 계란은 깨졌지만, 바위에 낸 금은 남아 있습니다. 그 금을 보고 다음 계란이, 그다음 계란이 던져질 것입니다.</p></div></div></div><div class=\"card open\" id=\"k812-27\"><div class=\"qhead\"><span class=\"mtag\" style=\"background:#0b7a3d\">한겨레21</span><span class=\"qtxt\">2. 당대표 선출 결과를 청년 정치인으로서 어떻게 평가하나. 새 지도부를 어떻게 전망하나. (8.17 결과 확정 후 전화 보완)</span></div><div class=\"body\" style=\"display:block\"><div class=\"lbl g\">💬 답변 스크립트</div><div class=\"script\"><p><b>누가 당선됐느냐로 저의 평가가 달라지지는 않습니다. 저는 경선 기간 내내 특정 후보가 아니라 제도를 지지한다고 말해 왔고, 그 기준은 지금도 같습니다. 새 지도부를 평가할 시험지는 이미 나와 있습니다. 첫째, 경선과 공천의 데이터를 유리상자처럼 100% 공개하는가. 둘째, 청년에게 자리가 아니라 예산과 결정권을 주는가 — 전당대회준비위가 만장일치로 의결하고도 최고위에서 부결된 선출직 청년최고위원제를 당헌에 새기는가. 셋째, 약속한 공천혁신을 연말까지 당헌·당규로 만드는가. 지금까지 민주당 지도부의 공천개혁 약속은 번번이 공수표로 끝났습니다. 이번에도 공수표라면 가장 먼저, 가장 크게 비판하는 사람이 저일 것입니다. 지원하되, 끝까지 감시하겠습니다.</b></p><p>(※ 8.17 이후 보완 포인트 — 당선자 확정 시: 득표율·2순위 반영 여부와 함께, 당선 수락 연설에서 청년·공천혁신·데이터 공개가 언급됐는지를 기준으로 코멘트. 초박빙 승부였던 만큼 '이긴 쪽의 정통성과 진 쪽의 승복 모두 데이터 공개에서 나온다'는 워딩 유지.)</p></div></div></div><div class=\"card open\" id=\"k812-28\"><div class=\"qhead\"><span class=\"mtag\" style=\"background:#0b7a3d\">한겨레21</span><span class=\"qtxt\">3. 경선 과정에서 몸으로 느낀 민주당의 문제는 무엇이었나.</span></div><div class=\"body\" style=\"display:block\"><div class=\"lbl g\">💬 답변 스크립트</div><div class=\"script\"><p><b>한마디로, 규칙을 만든 사람들의 정당이 됐다는 것입니다. 민주주의에는 잔인한 역설이 있습니다. 권력이 없을 때는 모두가 민주주의자인데, 권력을 오래 쥐면 자신도 모르게 권력을 지키는 사람이 됩니다. 그리고 권력을 지키는 가장 손쉬운 방법이 규칙을 쥐는 것입니다. 이럴 땐 헌법처럼 지키고, 저럴 땐 예외를 만들고, 필요하면 하루 전에 바꿉니다. 저는 후보 등록을 마치고 나서야 경선 규칙을 받았습니다. 당헌에는 '달리 정할 수 있다'는 단서조항이 곳곳에 숨어 있어서, 사람에 따라 지역에 따라 규칙이 달라집니다. 저는 이걸 고무줄 규칙이라고 부릅니다. 다르게 적용되는 규칙은 규칙이 아니라 민주주의를 죽이는 흉기입니다.</b></p><p>청년에게 그 구조는 세 개의 벽으로 나타납니다. 돈의 벽, 정보의 벽, 족보의 벽. 기탁금 구하느라 반나절을 쓰고 서울에 잘 곳이 없어 렌터카에서 쪽잠을 자는 것이 돈의 벽이고, 규칙과 일정을 기득권만 먼저 아는 것이 정보의 벽이고, 계파가 없으면 유령 취급을 받다가 사진 한 장 찍히면 '누구 파냐'는 파묘부터 당하는 것이 족보의 벽입니다. 저는 그 마지막 것을 흥신소 정치라고 부릅니다. 저는 추미애 대표 때 공천받고, 이낙연 대표 때 억울하게 제명당했고, 이재명 대표 때 복당한 사람입니다. 회사로 치면 사장이 세 번 바뀐 건데, 도대체 저는 무슨 계파입니까. 그런데도 족보에 끼워주지도 않으면서 족보 검증은 제일 먼저 받는 것, 그것이 청년이 마주하는 민주당입니다.</p></div></div></div><div class=\"card open\" id=\"k812-29\"><div class=\"qhead\"><span class=\"mtag\" style=\"background:#0b7a3d\">한겨레21</span><span class=\"qtxt\">4. 민주당 지지자였던 2030은 왜 민주당을 떠났나.</span></div><div class=\"body\" style=\"display:block\"><div class=\"lbl g\">💬 답변 스크립트</div><div class=\"script\"><p><b>청년이 민주당을 떠난 게 아닙니다. 민주당이 먼저 청년을 떠났습니다. 이 순서를 바로잡는 데서 모든 답이 시작됩니다. 원인은 정책 부족이 아니라 공정의 상실입니다. 공정에 가장 민감한 세대에게 민주당은 가장 불공정한 모습을 보여 왔습니다. 영입할 때는 미래라고 부르고, 규칙을 정하는 방에서는 지웁니다. 기자회견 때는 병풍처럼 세워 놓고 사진을 찍고 돌려보냅니다. 청년 정치를 확대하겠다면서 청년최고위원제를 부결시키고, 청년에게 기회를 준다면서 기탁금을 네 배로 올렸습니다. 말과 행동의 거리 — SNS 세대는 그 간격을 실시간으로 확인합니다. 청년들은 몰라서 떠나는 게 아니라 너무 잘 알아서 떠나는 겁니다.</b></p><p>지금 18~29살의 절반 가까이가 무당층입니다. 저는 이걸 보수화라고 부르는 것에도 동의하지 않습니다. 청년들은 보수화된 게 아니라 탈민주당화된 것입니다. 제 또래 친구들은 민주당 이야기가 나오면 화를 내지 않습니다. 관심을 꺼 버립니다. 분노보다 무서운 것이 무관심입니다. 지금 청년 세대에서 회귀물 콘텐츠가 유행하는 이유를 정치가 무겁게 읽어야 합니다. 다시 태어나야만 인생을 바꿀 수 있다고 느끼는 세대라는 뜻입니다. 이번 생은 망했다고 말하는 세대에게, 정치는 한 번도 '네 잘못이 아니다'라고 말해 준 적이 없습니다. 저는 그 말을 하러 나왔습니다.</p></div></div></div><div class=\"card open\" id=\"k812-30\"><div class=\"qhead\"><span class=\"mtag\" style=\"background:#0b7a3d\">한겨레21</span><span class=\"qtxt\">5. 민주당의 세대교체는 왜 필요한가. '가치와 노선 없는 세대교체는 위험하다'는 반론에는 뭐라고 답하나.</span></div><div class=\"body\" style=\"display:block\"><div class=\"lbl g\">💬 답변 스크립트</div><div class=\"script\"><p><b>그 반론에 절반은 동의합니다. 저도 얼굴만 바꾸는 세대교체에는 반대합니다. 낡은 운영체제 위에 새 얼굴만 얹는 것은 혁신이 아니라 도색입니다. 제가 말하는 세대교체는 사람 교체가 아니라 운영체제 교체이고, 의제 교체입니다. 86세대의 시대정신은 민주화였고 그분들은 그 소임을 훌륭히 해냈습니다. 저는 선배님들을 진심으로 존경합니다. 제가 이렇게 비판할 자유도 그분들이 만들어 주신 민주주의 덕분입니다. 그러나 민주화운동이 대한민국 정치를 40~50년 독점할 권리가 될 수는 없습니다. 지금 국민의 삶을 짓누르는 과제는 AI 전환, 지방소멸, 양극화, 청년의 일자리와 주거입니다. 과제가 바뀌면, 그 과제를 온몸으로 살아 낸 세대가 테이블에 앉아야 합니다.</b></p><p>'청년이 준비가 안 됐다'는 말에는 이렇게 되묻고 싶습니다. 30여 년 전 김대중 대통령이 서른두 살 김민석을 발탁했을 때, 준비가 완료된 사람을 뽑았습니까? 가치와 노선은 검증의 링 위에서 길러지는 것이지, 링에 들여보내지도 않고 요구할 수 있는 것이 아닙니다. 검증은 걸러내기 전에 해야 검증이고, 걸러낸 뒤에 하면 홍보입니다. 그리고 세대교체는 양심에 맡길 일이 아니라 제도로 해야 합니다. 솔직히, 제가 나가시란다고 나가시겠습니까. 동일 지역구 3선 초과 공천 금지를 당헌에 새기고 공정한 검증의 링만 만들면, 세대교체는 강요하지 않아도 저절로 이루어집니다. 퇴출이 아니라 영입입니다. 3선이 넘은 지역구가 열려야 새 인재가 들어올 자리가 생깁니다. 도전하던 사람들이 도전받는 자리에 서더니 도전 자체를 막고 있는 이 도돌이표를 끊자는 것입니다. 민주주의는 권력을 얻는 것으로 끝나지 않습니다. 다음 세대에게 넘겨줄 때 완성됩니다.</p></div></div></div><div class=\"card open\" id=\"k812-31\"><div class=\"qhead\"><span class=\"mtag\" style=\"background:#0b7a3d\">한겨레21</span><span class=\"qtxt\">6. 민주당이 변해야 할 길은 무엇인가.</span></div><div class=\"body\" style=\"display:block\"><div class=\"lbl g\">💬 답변 스크립트</div><div class=\"script\"><p><b>부분 수리로는 안 됩니다. 재창당 수준의 대전환이어야 합니다. 저는 예비경선 결과 발표 전날, 여의도가 아니라 청년의 거리 홍대에서 '민주당 대전환 선언'을 발표했습니다. 떨어질 수 있다는 걸 알면서도 결과와 상관없는 약속을 드린 것은, 그 선언이 저의 선거운동이 아니라 길을 잃은 민주당이 가야 할 방향이라고 믿었기 때문입니다. 핵심은 네 가지입니다. 첫째, 규칙을 만든 사람들의 정당을 끝내는 것 — 경선 규칙 6개월 전 확정, '달리 정할 수 있다' 단서조항 전부 삭제, 경선 결과 100% 공개. 둘째, 가짜 당원주권의 폐기 — 당원명부를 행정안전부 주민등록과 대조해 그 동네 살지도 않는 불법당원, 자기가 당원인지도 모르는 유령당원을 정리하는 것. 휴대전화가 당원일 수는 없습니다. 셋째, 돈의 장벽 철거 — 기탁금 폐지와 당직선거 공영제. 정치는 돈이 아니라 비전과 실력으로 경쟁해야 합니다. 넷째, 검찰 저격수를 넘어 국민 삶의 설계자로 — 과거에 복수하는 '복수혈전 민주당'이 아니라 미래의 언어로 일하는 '미래선도 민주당'입니다.</b></p><p>그리고 이 모든 것을 관통하는 것이 디지털 정당입니다. 오해하지 마십시오. 온라인 투표하는 정당, 앱 만드는 정당이 아닙니다. 자본은 이미 시민을 데이터로 정밀하게 읽는데, 정치는 아직도 시민을 동원 수단으로 읽습니다. '목소리를 내지 않는 사람에게는 권리가 없다'는 낡은 문법 속에서 고함치는 소수가 이기고 조용히 살아가는 다수가 졌습니다. 광장에 나올 시간이 없는 사람, 하루 10분밖에 낼 수 없는 사람의 요구가 데이터로 모여 정책이 되는 정당. 중앙 서버에 로그인하는 정당이 아니라 시민의 삶과 링크된 정당. 그것이 결집한 소수가 침묵하는 다수를 삼키는 팬덤정치의 유일한 해독제라고 저는 믿습니다.</p></div></div></div><div class=\"card open\" id=\"k812-32\"><div class=\"qhead\"><span class=\"mtag\" style=\"background:#0b7a3d\">한겨레21</span><span class=\"qtxt\">7. 민주당에서 청년정치란 무엇인가. 앞으로 어떤 정치를 하려 하나.</span></div><div class=\"body\" style=\"display:block\"><div class=\"lbl g\">💬 답변 스크립트</div><div class=\"script\"><p><b>지금까지 민주당에서 청년은 주주가 아니라 병풍이었습니다. 선거철마다 동원되고 이용되지만 실질적 권한은 하나도 없었습니다. 누군가를 공격할 때 꺼내 쓰는 도구, 성명서 발표할 때 뒤에 일렬횡대로 세우는 배경. 저는 그 병풍을 주주로 바꾸는 것이 청년정치라고 생각합니다. 마이크가 아니라 예산을, 자리가 아니라 결정권을 주는 것입니다. 시혜는 회수되지만 당헌에 새긴 결정권은 회수되지 않습니다. 그래서 저는 새 지도부에 당헌에 근거를 둔 '민주당 청년당'을 제안합니다. 청년 당원이 자동 가입하고 지도부를 직접 뽑고 독자 재정권과 공천 추천권까지 갖는 준자치 기구 — 독일 사민당의 유소스, 영국 노동당의 영 레이버처럼요. 청년이 청년의 정책을 스스로 결정하고, 계파가 아니라 숫자로 자기 존재를 증명할 수 있게 되는 순간, 청년은 더 이상 줄을 서지 않아도 됩니다.</b></p><p>저의 다음 걸음을 자리로 말씀드리지는 않겠습니다. 링이 열리면 언제든 다시 오르겠습니다. 당장은 세 가지입니다. 공천특위 5대 요구가 연말까지 당헌·당규가 되는지 감시하는 일, 재정주권 시민행동 공동대표로서 우리 동네 예산부터 중앙당의 깜깜이 회계까지 돈의 흐름을 투명하게 만드는 예산 바로보기 운동, 그리고 전국 각지에서 이름 없이 지역 기반을 다지는 청년 정치인들 — 전국의 김보미들을 찾아 공동전선을 만드는 일입니다. 이번에 각개약진하다 각개격파당한 교훈을 배웠으니, 다음에는 함께 갑니다. 민주당의 역사는 김대중, 노무현의 계란으로 바위 치기의 역사입니다. 서슬 퍼런 군사독재에 도전한 김대중도, 지지율 2%로 시작한 노무현도 모두 계란이었습니다. 지금 전당대회에서는 누가 적통이니 적자니 족보 캐기가 한창입니다만, 민주당의 진짜 적통은 혈통도 인맥도 아니고 그 도전정신입니다. 저는 그 적통을 잇겠습니다. 바위는 40년 비를 맞아 허물어지기 직전이고, 계란은 생명을 품고 있습니다. 훗날 어느 청년 정치인이 '김보미가 먼저 부딪혀 준 덕에 내 길이 조금 덜 아팠다'고 말해 준다면, 그것으로 충분합니다.</p></div></div></div><div class=\"card open\" id=\"k812-33\"><div class=\"qhead\"><span class=\"mtag\" style=\"background:#0b7a3d\">한겨레21</span><span class=\"qtxt\">8. [추가] 재정주권 시민행동 공동대표로서, 앞으로의 계획은. 정당도 예산을 공개해야 한다는 문제의식은.</span></div><div class=\"body\" style=\"display:block\"><div class=\"lbl g\">💬 답변 스크립트</div><div class=\"script\"><p><b>재정주권 시민행동 공동대표로서 '예산 바로보기' 운동을 하고 있습니다. 저희가 만든 '나라살림 돋보기'는 동네 이름만 치면 전국 243개 지자체와 중앙정부 예산이 3초 만에 나옵니다. 내가 낸 세금이 어디로 가는지 직접 들여다보는 것만큼 확실한 정치 참여이자 정치 교육은 없습니다. 저는 강진군의원 시절 업무추진비를 전면 공개하고 '김보미365'로 의정활동을 낱낱이 기록했습니다. 돈의 흐름이 보이는 순간 정치는 남의 일이 아니게 됩니다.</b></p><p>그런데 정작 정당은 어떻습니까. 울릉군도 재정을 공개하고 정부도 예산서를 다 공개하는데, 국고보조금에 선거보조금까지 받는 정당은 그 돈을 어디에 썼는지, 어떤 업체와 계약했는지 공개하지 않습니다. 대한민국에서 가장 낙후된 조직입니다. 밀실이 부패를 만듭니다. 당 재정부터 10원짜리 하나까지 공개하라는 것이 제 홍대선언 12번째 약속이었습니다. 정당의 깜깜이 회계가 투명해지는 그날까지, 청년들과 함께 이 운동을 전국으로 넓혀 가겠습니다. 재정이 투명한 정당이 국민의 신뢰를 얻습니다.</p></div></div></div>";
const FIVE5=[["요구 ①","공천·경선 규칙, 선거 6개월 전 확정","공천·경선 규칙은 선거 6개월 전에 확정하고, \"달리 정할 수 있다\"는 예외조항을 전부 삭제해야 합니다. 고무줄 규칙 완전 폐지입니다."],["요구 ②","유령·불법·이중당원 전수 정리","그 동네 살지도 않는 불법당원, 자기가 당원인지도 모르는 유령당원, 이 당 저 당 가입한 이중당원까지 — 당원명부를 행안부 자료와 대조해 깨끗이 정리해야 합니다."],["요구 ③","경선 결과 100% 공개","선거인 수·투표율·후보별 득표수까지 전부 공개하는 유리상자 경선. 공개하지 못할 경선이라면 공정한 경선이라 말할 수 없습니다."],["요구 ④","토론과 연설, 검증의 링 보장","검증 토론회와 연설 기회를 충분히 보장해 실력과 정책으로 겨루게 해야 합니다. 동영상 촬영회가 아니라 진짜 검증의 링이 필요합니다."],["요구 ⑤","특위 과반은 낙천자와 청년으로","공천혁명 특위는 현 시스템의 수혜자·기득권 정치인을 배제하고, 위원 과반수를 낙천자와 청년 당원으로 구성해야 합니다. 도둑에게 자물쇠를 맡길 수 없습니다."]];
const ROAD3=[["1단계 — 취임 즉시","당대표 권한·당규 개정 추진으로 즉시 착수","결과 공개 · 룰 동결 · 가산·감산 소명 · 토론 의무제 · 옴부즈맨 · 당비 대시보드 · 한국형 알메달렌 · 청년 선택권 · 정책 오디션 · 재도전 안전망 · 미래전략원 · 선관위 특위 · 디지털 전환 · 명예 퇴장 예우제 · 공천 유리상자 · 당 인사 개방"],["2단계 — 6개월~1년","당헌 개정·전당대회 의결 등 당내 절차","실명·거주 인증 · 당원국회 · 1만인 발의 · 청년 공천 목표제 · 청년 예산 10% · 성장 사다리·청소년 당원 · 공정 경쟁 공천"],["3단계 — 임기 내","입법·당정 협의·국민투표 등 외부 절차 병행","미래 일자리 · AI 대전환 · 검·경 견제 입법(1년 내) · 개헌안 총선 동시 국민투표 · 16세 선거권 · 정부 인사 개방"]];
function viewKbs0812(){document.getElementById('main').innerHTML=KBS0812_HTML;}
function viewFive5(){var m=document.getElementById('main');
var h='<div class="hero"><h2>📣 호남 공천혁신 5대 요구 (8.10 광주 기자회견)</h2><p><b>공천혁신특위에 드리는 요구 — 연말까지 당헌·당규 반영이 기준입니다.</b><br>지지 선언이 아니라 화답 — 사람이 아니라 공천혁명이라는 제도를 지지합니다. 지원하되, 끝까지 감시하겠습니다.</p></div>';
FIVE5.forEach(function(r){h+='<div class="card open"><div class="qhead"><span class="mtag" style="background:#7a2fa0">'+r[0]+'</span><span class="qtxt">'+r[1]+'</span></div><div class="body" style="display:block"><div class="script"><p>'+r[2]+'</p></div></div></div>';});
h+='<div class="mustbox"><div class="ot">⭐ 함께 말할 프레임</div><div class="mline">⭐ 지지 선언이 아니라 화답입니다 — 사람이 아니라 제도를 지지합니다.</div><div class="mline">⭐ 믿음은 검증의 대상입니다. 검증되는 것은 규칙과 숫자뿐입니다.</div><div class="mline">⭐ 공수표로 끝난다면, 가장 먼저 가장 크게 비판하는 사람이 저일 것입니다.</div></div>';
m.innerHTML=h;}
function viewPledge25(){var m=document.getElementById('main');
var h='<div class="hero"><h2>📜 공약 한눈에 — 5대 분야 · 25개 약속 · 3단계 로드맵</h2><p>예비경선 공약 체계. 25개 약속 전문과 로드맵은 <a href="https://www.xn--4k0b53xuva.com/gongyak.html" target="_blank" style="color:#ffd24d;font-weight:700">김보미닷컴 공약집</a>에서. 홍대선언 12대 약속은 사이드바 빨간 버튼에서.</p></div>';
h+='<div class="sec-h">✅ 5대 분야 (분야별 5개 = 25개 약속)</div>';
(PLEDGES||[]).forEach(function(pl){h+='<div class="card open"><div class="qhead"><span class="qtxt">'+esc(pl[0])+'</span></div><div class="body" style="display:block"><div class="script"><p>'+esc(pl[2])+'</p></div></div></div>';});
h+='<div class="sec-h">🗺️ 실행 3단계 로드맵 — 말이 아니라 시간표로</div>';
ROAD3.forEach(function(r){h+='<div class="card open"><div class="qhead"><span class="mtag" style="background:#0b7a3d">'+r[0]+'</span><span class="qtxt">'+r[1]+'</span></div><div class="body" style="display:block"><div class="script"><p>'+r[2]+'</p></div></div></div>';});
m.innerHTML=h;}

function viewYonsei(){
  const m=document.getElementById('main');
  const L=DATA.filter(d=>d.no>=3201&&d.no<=3299).filter(textHit);
  const g=(a,b)=>L.filter(d=>d.no>=a&&d.no<=b).map(d=>cardHTML(d,true)).join('');
  let html='<div class="hero"><h2>🎤 10.27(화) 19:00 연세대 정치외교학과 여야정책토론회</h2>'+
    '<p>연희관 401호 · <b>18:40 도착</b> · 토론자 박태훈(진보당)·이준석(개혁신당)·김보미 · ★ = 꼭 할 말 · ( ) = 시간 짧으면 생략 · 모든 카드 아래 🔗 근거 링크</p>'+
    '<p style="font-size:13px">원칙: <b>정답은 정당이 아니라 국민에게.</b> 틀린 건 우리 당이어도 틀렸다고 한다. · 더 깊이: <a href="debate-yonsei-study.html">📚 공부방(정부 정책 최근순·지방·해외·정치제도)</a> · <a href="debate-yonsei-20261027.html">토론 준비실(표·현안 Lv.1~5)</a> · <a href="#gov">📡 정책 실시간</a> · 이 화면 바로가기 주소: <b>dashboard.html#yonsei</b></p></div>';
  const sec=(t,c)=>c?'<div class="sec-h">'+t+'</div>'+c:'';
  html+=sec('① 기조발언 원고 · 문장별 근거표',g(3201,3203));
  html+=sec('② 의제 답변 · 학생회 질문 · 📼 그동안 한 말',g(3204,3210));
  html+=sec('③ 이준석 의원 예상 공격과 대응',g(3211,3220));
  html+=sec('④ 박태훈 위원장 예상 공격과 대응',g(3221,3230));
  html+=sec('⑤ 민주당 지적 대비 — 틀린 건 틀렸다',g(3231,3240));
  html+=sec('⑥ 학생 예상 질문',g(3241,3250));
  html+=sec('⑦ 정외과 질문 — 정당·대통령제·청년 정치 국제 비교',g(3251,3260));
  html+=sec('⑧ 숫자 카드 · 정부 정책 최근순 · 지방·해외 사례',g(3261,3270));
  html+=sec('⑨ 행사·학생회 · 당일 체크 · 발제 숫자 정정',g(3271,3299));
  if(!L.length)html+='<p>검색 결과가 없습니다.</p>';
  m.innerHTML=html;bindCards();bindTags();
}
function viewSep(){
  const m=document.getElementById('main');
  const list=DATA.filter(d=>d.no>=3101&&d.no<=3199).filter(textHit);
  let html='<div class="hero"><h2>🆕 9월 현안 답변지 (2026.9.17 기준)</h2>'+
    '<p>2030 민심·지지율, 용혜인 사퇴 이후, 위성정당·선거제도, 정당 국고보조금, 인사청문 — ★ = 꼭 할 말 · 결론 먼저</p>'+
    '<p style="font-size:13px">심층 자료: <a href="issue-20260917-approval-2030-hearings.html">지지율·2030 민심 보고서</a> · <a href="issue-yonghyein.html">용혜인 논란</a> · <a href="issue-politicalfund.html">정치자금법 총망라</a> · <a href="issue-20260917-lee-hyungil-confirmation-vote.html">이형일 청문</a></p></div>';
  html+=list.map(d=>cardHTML(d,true)).join('')||'<p>검색 결과가 없습니다.</p>';
  m.innerHTML=html;bindCards();bindTags();
}
function viewSignal(){
  const m=document.getElementById('main');
  const main=DATA.filter(d=>d.no>=3001&&d.no<=3014);
  const app=DATA.filter(d=>d.no>=3015&&d.no<=3026);
  let html='<div class="hero"><h2>🔴 채널A 「라디오쇼 정치시그널」 시그널픽 — 8/27(목) 08:35 생방송</h2>'+
    '<p><b>본편 14문항(방송사 질문지 순서) + 돌발 대비 12문항</b> · ★ 표시 = 꼭 해야 할 말 · 전 문항 결론 먼저</p></div>';
  html+='<div class="sec-h" style="color:#c62828">📌 본편 Q1~Q14 (방송사 질문지 순서 · 최종)</div>'+main.map(d=>cardHTML(d,true)).join('');
  html+='<div class="sec-h">⚡ [부록] 돌발 질문 대비 12문항</div>'+app.map(d=>cardHTML(d,true)).join('');
  m.innerHTML=html;bindCards();bindTags();
}

// ---------- 🤖 자동 발언포인트 (bomi-ops 매일 아침 심층보고서 → data/auto-points.json) ----------
let AUTO=null;
function autoCardHTML(x,toks){
  const pts=(x.points||[]).map(p=>'<div class="quote" style="margin:6px 0">&ldquo;'+(toks?hl(p):esc_(p))+'&rdquo;</div>').join('');
  return '<div class="card open" style="border-left:5px solid #7b3fe4"><div class="qhead"><span class="mtag" style="background:#7b3fe4">'+esc_(x.date||'')+'</span><span class="qtxt">'+esc_(x.topic||'')+'</span>'+(x.page?'<a href="'+esc_(x.page)+'" style="margin-left:auto;font-size:12px;font-weight:700">보고서 전문 →</a>':'')+'</div><div class="body">'+(x.one_liner?'<div style="color:#2b3444;margin-bottom:6px">'+(toks?hl(x.one_liner):esc_(x.one_liner))+'</div>':'')+pts+'</div></div>';
}
// 시작 시 미리 읽어 두면 키워드 검색(🔑 탭)에도 자동 발언포인트가 함께 잡힌다
fetch('data/auto-points.json?v='+Date.now(),{cache:'no-store'}).then(r=>r.ok?r.json():[]).then(j=>{AUTO=Array.isArray(j)?j:[];if(view==='auto'||q)render();}).catch(()=>{AUTO=[];});
function esc_(t){return String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function viewAuto(){
  const m=document.getElementById('main');
  if(AUTO===null){
    m.innerHTML='<div class="sec-h">🤖 오늘의 자동 발언포인트</div><div class="empty">불러오는 중…</div>';
    fetch('data/auto-points.json?v='+Date.now(),{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error(r.status);return r.json()})
      .then(j=>{AUTO=Array.isArray(j)?j:[];if(view==='auto')viewAuto();})
      .catch(e=>{AUTO=[];if(view==='auto')viewAuto();});
    return;
  }
  const hit=x=>!q||(x.topic+' '+x.one_liner+' '+(x.points||[]).join(' ')+' '+(x.questions||[]).join(' ')+' '+(x.ideas||[]).join(' ')).includes(q);
  const list=AUTO.filter(hit);
  let html='<div class="sec-h">🤖 오늘의 자동 발언포인트 <span style="font-size:12px;font-weight:600;color:var(--gray)">매일 아침 심층보고서에서 자동 추출 · Gemini 작성 · Groq 교차검토 · '+AUTO.length+'건</span></div>';
  if(!list.length){m.innerHTML=html+'<div class="empty">아직 자동 발언포인트가 없습니다. 내일 아침 7:30 첫 보고서부터 쌓입니다.</div>';return;}
  html+=list.map(x=>{
    const pts=(x.points||[]).map(p=>'<li>★ '+esc_(p)+'</li>').join('');
    const qs=(x.questions||[]).map(p=>'<li>'+esc_(p)+'</li>').join('');
    const ids=(x.ideas||[]).map(p=>'<li>'+esc_(p)+'</li>').join('');
    return '<div class="card" style="background:#fff;border:1px solid var(--line);border-left:5px solid #7b3fe4;border-radius:12px;padding:14px 16px;margin:0 0 12px;box-shadow:0 2px 8px rgba(31,78,121,.08)">'
      +'<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:6px"><span style="background:#7b3fe4;color:#fff;border-radius:6px;padding:2px 8px;font-size:12px;font-weight:700">'+esc_(x.date||'')+'</span><b style="font-size:16px">'+esc_(x.topic||'')+'</b>'
      +(x.page?'<a href="'+esc_(x.page)+'" style="margin-left:auto;font-size:13px;font-weight:700">보고서 전문 →</a>':'')+'</div>'
      +(x.one_liner?'<div style="color:#2b3444;margin-bottom:8px">'+esc_(x.one_liner)+'</div>':'')
      +(pts?'<div style="font-weight:800;color:#7b3fe4;margin-top:6px">🗣️ 발언 포인트</div><ul style="margin:4px 0 8px 18px;padding:0">'+pts+'</ul>':'')
      +(qs?'<details style="margin:4px 0"><summary style="cursor:pointer;font-weight:700;color:var(--blue)">❓ 예상 질문 '+(x.questions||[]).length+'개</summary><ul style="margin:4px 0 4px 18px;padding:0">'+qs+'</ul></details>':'')
      +(ids?'<details style="margin:4px 0"><summary style="cursor:pointer;font-weight:700;color:var(--green)">💡 실행 아이디어 '+(x.ideas||[]).length+'개</summary><ul style="margin:4px 0 4px 18px;padding:0">'+ids+'</ul></details>':'')
      +'</div>';
  }).join('');
  m.innerHTML=html;
}

// ---------- 📡 정책 실시간 (김보미.com /api/live · /api/policy, 브레인허브 링크) ----------
const KBAPI='https://www.xn--4k0b53xuva.com';
const HUB='https://brainpark-hub.vercel.app';
const GV={tab:'feed',g:'',chip:'',q:'',n:60,feed:null,feedAt:null,feedErr:'',busy:false,youth:null,ypage:1,yerr:'',ben:null,berr:'',st:null};
const GV_CHIPS=[['','전체'],['청년','청년'],['대학|등록금|장학|기숙사|학자금','대학·등록금'],['주거|주택|월세|전세|임대|기숙사|부동산','주거'],['일자리|고용|취업|채용|노동|근로|인턴','일자리'],['지방|지역|균형|소멸|농어촌','지방'],['예산|재정|세법|세제','예산·재정']];
const GV_YCAT={'':'','청년':'','대학|등록금|장학|기숙사|학자금':'교육','주거|주택|월세|전세|임대|기숙사|부동산':'주거','일자리|고용|취업|채용|노동|근로|인턴':'일자리','지방|지역|균형|소멸|농어촌':'','예산|재정|세법|세제':''};
const GV_ST={ok:'정상',empty:'오늘 자료 없음',error:'실패',no_key:'키 없음'};
function gvGet(url){return fetch(url,{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.json()})}
function gvLoadFeed(force){if(GV.busy)return;if(GV.feed&&!force)return;GV.busy=true;GV.feedErr='';
  gvGet(KBAPI+'/api/live').then(j=>{GV.feed=j.items||[];GV.st=j.status||null;GV.feedAt=j.at||new Date().toISOString()})
  .catch(e=>{GV.feedErr=String(e.message||e);GV.feed=GV.feed||[]}).finally(()=>{GV.busy=false;if(view==='gov')viewGov()});}
function gvLoadYouth(){GV.youth=null;GV.yerr='';
  const cat=GV_YCAT[GV.chip]||'';let u=KBAPI+'/api/live?src=youth&op=plcy&size=30&page='+GV.ypage;
  if(GV.q)u+='&plcyNm='+encodeURIComponent(GV.q);if(cat)u+='&lclsfNm='+encodeURIComponent(cat);
  gvGet(u).then(j=>{const r=(j.data&&j.data.result)||{};GV.youth={total:(r.pagging||{}).totCount||0,list:r.youthPolicyList||[]};if(!j.ok)GV.yerr=j.state||'실패'})
  .catch(e=>{GV.yerr=String(e.message||e);GV.youth={total:0,list:[]}}).finally(()=>{if(view==='gov')viewGov()});}
function gvLoadBen(){GV.ben=null;GV.berr='';const qq=GV.q||'청년';
  gvGet(KBAPI+'/api/policy?q='+encodeURIComponent(qq)).then(j=>{GV.ben=j.items||[]}).catch(e=>{GV.berr=String(e.message||e);GV.ben=[]}).finally(()=>{if(view==='gov')viewGov()});}
function gvKst(iso){try{return new Date(iso).toLocaleString('ko-KR',{timeZone:'Asia/Seoul',month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'})}catch(e){return iso||''}}
function gvHit(t){const tx=String(t||'');if(GV.chip&&!new RegExp(GV.chip).test(tx))return false;if(GV.q&&!tx.includes(GV.q))return false;return true}
function viewGov(){
  const m=document.getElementById('main');
  let h='<div class="hero" style="background:linear-gradient(135deg,#0b7a3d,#07502a);color:#fff"><h2 style="color:#fff">📡 정책 실시간 — 김보미.com API 연결</h2>'+
   '<p style="color:#eaf7ef">이 화면을 열 때마다 <b>김보미.com 서버(/api/live · /api/policy)</b>에서 새로 받아 옵니다. 인증키는 김보미.com 서버에만 있고 이 화면에는 없습니다. 같은 질문은 김보미.com이 30분~1시간 보관합니다.</p>'+
   '<p style="font-size:13px;color:#eaf7ef">🧠 브레인허브(직원용 재정·정책 자료) 바로가기: '+
   [['#/policy','정책 자료실(정부·국회 실시간·원본 PDF)'],['#/gov27','2027 정부 예산안'],['#/govexe','정부 예산 집행'],['#/law','법령'],['#/search','통합 검색']].map(x=>'<a href="'+HUB+'/'+x[0]+'" target="_blank" rel="noopener" style="color:#ffd24d;font-weight:700">'+x[1]+'</a>').join(' · ')+
   ' · 김보미.com: <a href="'+KBAPI+'/live.html" target="_blank" rel="noopener" style="color:#ffd24d;font-weight:700">정책 실시간</a></p></div>';
  const tabs=[['feed','🏛️ 정부·국회 발표'],['youth','🧑‍🎓 온통청년 청년정책'],['benefit','🎁 혜택 검색(정부24·복지로)'],['status','🩺 출처 상태']];
  h+='<div style="display:flex;gap:6px;flex-wrap:wrap;margin:0 0 10px">'+tabs.map(t=>'<button class="gvtab" data-t="'+t[0]+'" style="border:1.5px solid #0b7a3d;border-radius:8px;padding:6px 12px;font-weight:700;cursor:pointer;background:'+(GV.tab===t[0]?'#0b7a3d;color:#fff':'#fff;color:#0b7a3d')+'">'+t[1]+'</button>').join('')+'</div>';
  if(GV.tab!=='status'){
    h+='<div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin:0 0 12px">'+GV_CHIPS.map(c=>'<span class="gvchip" data-c="'+esc_(c[0])+'" style="cursor:pointer;border-radius:14px;padding:4px 11px;font-size:13px;font-weight:700;border:1px solid #9cc7ad;background:'+(GV.chip===c[0]?'#0b7a3d;color:#fff':'#eef7f1;color:#0b5a2d')+'">'+c[1]+'</span>').join('')+
      '<input id="gvq" value="'+esc_(GV.q)+'" placeholder="낱말로 찾기 (예: 기숙사, 월세, 인턴)" style="flex:1;min-width:180px;border:1px solid #c9d8ea;border-radius:8px;padding:6px 10px;font-size:14px">'+
      '<button id="gvgo" style="border:0;border-radius:8px;padding:7px 12px;background:#0b7a3d;color:#fff;font-weight:700;cursor:pointer">찾기·새로 받기</button></div>';
  }
  if(GV.tab==='feed'){
    if(GV.feed===null){gvLoadFeed();h+='<div class="empty">정부·국회 발표를 받아 오는 중… (10초 안팎)</div>';}
    else{
      const L=GV.feed.filter(x=>(!GV.g||x.g===GV.g)&&gvHit([x.title,x.org,x.dept,x.kind,x.who,x.sub].join(' ')));
      const ng=GV.feed.filter(x=>x.g==='gov').length,nn=GV.feed.filter(x=>x.g==='nas').length;
      h+='<div style="font-size:13px;color:#4a5568;margin:0 0 8px">받은 시각 '+esc_(gvKst(GV.feedAt))+' · 정부 '+ng+'건 · 국회 '+nn+'건 · 조건에 맞는 것 <b>'+L.length+'건</b> · '+
        [['','전체'],['gov','정부'],['nas','국회']].map(x=>'<a href="javascript:void 0" class="gvg" data-g="'+x[0]+'" style="font-weight:'+(GV.g===x[0]?'800':'500')+'">'+x[1]+'</a>').join(' | ')+'</div>';
      if(GV.feedErr)h+='<div class="note" style="color:#c62828">받기 실패: '+esc_(GV.feedErr)+' — 잠시 뒤 다시 누르세요.</div>';
      if(GV.st&&GV.st.filter(s=>s.g!=='nas'&&s.state!=='ok').length&&!ng)h+='<div class="note">⚠️ 지금 정부 쪽 출처(정책브리핑·부처 보도자료·관보)가 모두 "자료 없음/실패"로 들어옵니다. 국회 자료는 정상입니다. 정부 발표는 위쪽 브레인허브 정책 자료실 링크나 「🎁 혜택 검색」·「🧑‍🎓 온통청년」 탭으로 보세요. 상세는 🩺 출처 상태.</div>';
      h+=L.slice(0,GV.n).map(x=>'<div class="card open" style="border-left:5px solid '+(x.g==='nas'?'#7b3fe4':'#0b7a3d')+'"><div class="qhead"><span class="mtag" style="background:'+(x.g==='nas'?'#7b3fe4':'#0b7a3d')+'">'+esc_(x.date||(x.until?'~'+x.until:''))+'</span><span class="qtxt">'+(x.url?'<a href="'+esc_(x.url)+'" target="_blank" rel="noopener">'+esc_(x.title)+'</a>':esc_(x.title))+'</span></div><div class="body" style="display:block;font-size:13px;color:#4a5568">'+esc_([x.org,x.kind,x.dept,x.who].filter(Boolean).join(' · '))+(x.sub?'<div style="margin-top:4px">'+esc_(x.sub)+'</div>':'')+'</div></div>').join('')||'<div class="empty">조건에 맞는 발표가 없습니다.</div>';
      if(L.length>GV.n)h+='<div style="text-align:center"><button id="gvmore" style="border:1px solid #0b7a3d;background:#fff;color:#0b7a3d;border-radius:8px;padding:6px 14px;font-weight:700;cursor:pointer">더 보기 ('+(L.length-GV.n)+'건 남음)</button></div>';
    }
  }else if(GV.tab==='youth'){
    if(GV.youth===null){gvLoadYouth();h+='<div class="empty">온통청년에서 청년정책을 받아 오는 중…</div>';}
    else{
      h+='<div style="font-size:13px;color:#4a5568;margin:0 0 8px">온통청년(youthcenter.go.kr) 등록 정책 · 조건에 맞는 것 전체 <b>'+GV.youth.total.toLocaleString()+'건</b> 중 '+GV.ypage+'쪽 · 최근 등록순 · 정책 이름으로 찾습니다'+(GV.yerr?' · <span style="color:#c62828">'+esc_(GV.yerr)+'</span>':'')+'</div>';
      h+=GV.youth.list.map(x=>{const age=(x.sprtTrgtMinAge&&+x.sprtTrgtMinAge)?x.sprtTrgtMinAge+'~'+x.sprtTrgtMaxAge+'세':'';const det='https://www.youthcenter.go.kr/youthPolicy/ythPlcyTotalSearch/ythPlcyDetail/'+encodeURIComponent(x.plcyNo||'');
        return '<div class="card open" style="border-left:5px solid #1f4fa3"><div class="qhead"><span class="mtag" style="background:#1f4fa3">'+esc_([x.lclsfNm,x.mclsfNm].filter(Boolean).join('·'))+'</span><span class="qtxt"><a href="'+det+'" target="_blank" rel="noopener">'+esc_(x.plcyNm||'')+'</a></span></div><div class="body" style="display:block;font-size:13px;color:#2b3444">'+
        '<div style="color:#4a5568">'+esc_([x.sprvsnInstCdNm,age,x.plcyKywdNm,(x.frstRegDt||'').slice(0,10)+' 등록'].filter(Boolean).join(' · '))+'</div>'+
        (x.plcyExplnCn?'<div style="margin-top:4px">'+esc_(String(x.plcyExplnCn).slice(0,220))+'</div>':'')+
        '<div style="margin-top:4px">'+(x.aplyUrlAddr&&/^https?:/.test(x.aplyUrlAddr)?'<a href="'+esc_(x.aplyUrlAddr)+'" target="_blank" rel="noopener">신청 →</a> ':'')+'<a href="'+det+'" target="_blank" rel="noopener">온통청년 상세 →</a></div></div></div>'}).join('')||'<div class="empty">조건에 맞는 청년정책이 없습니다.</div>';
      h+='<div style="text-align:center;margin:8px 0">'+(GV.ypage>1?'<button class="gvpg" data-d="-1" style="margin:0 4px">← 앞쪽</button>':'')+(GV.youth.total>GV.ypage*30?'<button class="gvpg" data-d="1" style="margin:0 4px">다음 쪽 →</button>':'')+'</div>';
    }
  }else if(GV.tab==='benefit'){
    if(GV.ben===null){gvLoadBen();h+='<div class="empty">정부24·복지로에서 찾는 중…</div>';}
    else{
      h+='<div style="font-size:13px;color:#4a5568;margin:0 0 8px">찾은 말: <b>'+esc_(GV.q||'청년')+'</b> · 정부24 보조금·복지로 지자체 복지·온통청년 · '+GV.ben.length+'건'+(GV.berr?' · <span style="color:#c62828">'+esc_(GV.berr)+'</span>':'')+' · 낱말은 짧게(예: 월세, 청년, 기숙사)</div>';
      h+=GV.ben.map(x=>'<div class="card open" style="border-left:5px solid #c77700"><div class="qhead"><span class="mtag" style="background:#c77700">'+esc_(x.source||'')+'</span><span class="qtxt">'+(x.url?'<a href="'+esc_(x.url)+'" target="_blank" rel="noopener">'+esc_(x.title)+'</a>':esc_(x.title))+'</span></div><div class="body" style="display:block;font-size:13px;color:#2b3444"><div style="color:#4a5568">'+esc_([x.agency,x.dept,x.target].filter(Boolean).join(' · ').slice(0,200))+'</div>'+(x.summary?'<div style="margin-top:4px">'+esc_(String(x.summary).slice(0,220))+'</div>':'')+'</div></div>').join('')||'<div class="empty">찾은 혜택이 없습니다. 더 짧은 낱말로 찾아 보세요.</div>';
    }
  }else{
    if(GV.st===null&&!GV.stLoading){GV.stLoading=true;gvGet(KBAPI+'/api/live?selfcheck=1').then(j=>{GV.st=j.feeds||[];GV.yst=j.youth||{};GV.stAt=j.at}).catch(e=>{GV.st=[];GV.stErr=String(e.message||e)}).finally(()=>{GV.stLoading=false;if(view==='gov')viewGov()});}
    if(!GV.st){h+='<div class="empty">출처 상태를 확인하는 중…</div>';}
    else{
      h+='<div class="sec-h">🩺 김보미.com API 출처별 상태'+(GV.stAt?' <span style="font-size:12px;color:#4a5568">'+esc_(gvKst(GV.stAt))+'</span>':'')+'</div>';
      h+='<table style="width:100%;border-collapse:collapse;font-size:13px;background:#fff">'+'<tr style="background:#eef7f1"><th style="text-align:left;padding:6px">출처</th><th>상태</th><th>건수</th><th>응답</th></tr>'+
        GV.st.map(s=>'<tr style="border-top:1px solid #e2e8f0"><td style="padding:6px">'+esc_(s.org)+'</td><td style="text-align:center;color:'+(s.state==='ok'?'#0b7a3d':'#c62828')+';font-weight:700">'+esc_(GV_ST[s.state]||s.state)+'</td><td style="text-align:center">'+(s.n||0)+'</td><td style="text-align:center">'+(s.ms||0)+'ms</td></tr>').join('')+
        (GV.yst?Object.entries(GV.yst).map(([k,v])=>'<tr style="border-top:1px solid #e2e8f0"><td style="padding:6px">온통청년 '+esc_({plcy:'청년정책',space:'청년공간',content:'콘텐츠',way:'정책방향',fcs:'중점과제',asmt:'세부과제'}[k]||k)+'</td><td style="text-align:center;color:'+(v==='ok'?'#0b7a3d':'#c62828')+';font-weight:700">'+esc_(GV_ST[v]||v)+'</td><td></td><td></td></tr>').join(''):'')+'</table>';
      h+='<div class="note">정부 쪽 "오늘 자료 없음"이 계속되면 김보미.com의 공공데이터포털(data.go.kr) 인증키나 활용신청을 확인해야 합니다. 정책브리핑 RSS는 2026.7.1부로 중단돼 API가 유일한 길입니다.</div>';
    }
  }
  m.innerHTML=h;
  m.querySelectorAll('.gvtab').forEach(b=>b.onclick=()=>{GV.tab=b.getAttribute('data-t');if(GV.tab==='status')GV.st=GV.tab==='status'?null:GV.st;viewGov()});
  m.querySelectorAll('.gvchip').forEach(b=>b.onclick=()=>{GV.chip=b.getAttribute('data-c');GV.n=60;GV.ypage=1;if(GV.tab==='youth')GV.youth=null;viewGov()});
  m.querySelectorAll('.gvg').forEach(b=>b.onclick=()=>{GV.g=b.getAttribute('data-g');viewGov()});
  m.querySelectorAll('.gvpg').forEach(b=>b.onclick=()=>{GV.ypage+=+b.getAttribute('data-d');GV.youth=null;viewGov();window.scrollTo(0,0)});
  const more=document.getElementById('gvmore');if(more)more.onclick=()=>{GV.n+=60;viewGov()};
  const go=()=>{const i=document.getElementById('gvq');GV.q=i?i.value.trim():'';GV.n=60;GV.ypage=1;if(GV.tab==='feed')gvLoadFeed(true);else if(GV.tab==='youth')GV.youth=null;else GV.ben=null;viewGov()};
  const gb=document.getElementById('gvgo');if(gb)gb.onclick=go;
  const gi=document.getElementById('gvq');if(gi)gi.onkeydown=e=>{if(e.key==='Enter')go()};
}
// ---------- 📼 카드 한 장 보기 (#card/번호 링크) ----------
let oneNo=null;
function viewOne(){
  const m=document.getElementById('main');const d=DATA.find(x=>x.no===oneNo);
  let h='<div style="display:flex;gap:8px;margin:0 0 10px"><button id="oneback" style="border:1px solid #1f4fa3;background:#fff;color:#1f4fa3;border-radius:8px;padding:6px 12px;font-weight:700;cursor:pointer">← 돌아가기</button><button id="oneyon" style="border:0;background:#1f4fa3;color:#fff;border-radius:8px;padding:6px 12px;font-weight:700;cursor:pointer">🎤 연세대 토론회로</button></div>';
  h+=d?'<div class="sec-h">📼 '+esc(d.media)+' — 원래 답변 (#'+d.no+')</div>'+cardHTML(d,true):'<div class="empty">'+oneNo+'번 카드를 찾지 못했습니다.</div>';
  m.innerHTML=h;bindCards();bindTags();
  document.getElementById('oneback').onclick=()=>{if(history.length>1)history.back();else{view='yonsei';render()}};
  document.getElementById('oneyon').onclick=()=>{view='yonsei';render()};
}
// ---------- 주소(#)로 바로 열기: #yonsei · #gov · #card/3201 ----------
const VIEW_KEYS=['one','hongdae','kbs0812','five5','pledge25','pledge11','speech','about','timeline','greet'];
function applyHash(){const h=decodeURIComponent(location.hash.slice(1));if(!h)return false;
  const mm=h.match(/^card\/(\d+)$/);if(mm){oneNo=+mm[1];view='one';return true}
  const my=h.match(/^yonsei\/(\d+)$/);if(my){view='yonsei';setTimeout(()=>jumpTo(+my[1]),120);return true}
  if(NAV.some(x=>x[0]===h)||VIEW_KEYS.includes(h)){view=h;return true}return false}
window.addEventListener('hashchange',()=>{if(applyHash()){activeKw=null;render()}});
function render(){
  renderNav();renderKwPanel();
  if(view==='yonsei')viewYonsei();
  else if(view==='gov')viewGov();
  else if(view==='one')viewOne();
  else if(view==='sep')viewSep();
  else if(view==='signal')viewSignal();
  else if(view==='auto')viewAuto();
  else if(view==='today')viewToday();
  else if(view==='kw')viewKw();
  else if(view==='timeline')viewTimeline();
  else if(view==='live')viewLive();
  else if(view==='ytn')viewYtn();
  else if(view==='sbs')viewSbs();
  else if(view==='kbc')viewKbc();
  else if(view==='hani')viewHani();
  else if(view==='hongdae')viewHongdae();
else if(view==='kbs0812')viewKbs0812();
else if(view==='five5')viewFive5();
else if(view==='pledge25')viewPledge25();
  else if(view==='written')viewWritten();
  else if(view==='newsba')viewNewsba();
  else if(view==='greet')viewGreet();
  else if(view==='pledge11')viewPledge11();
  else if(view==='speech')viewSpeech();
  else if(view==='about')viewAbout();
  try{const want=view==='one'?'card/'+oneNo:view;if(decodeURIComponent(location.hash.slice(1)).split('/')[0]!==want.split('/')[0]||view==='one')history.replaceState(null,'','#'+want)}catch(e){}
  window.scrollTo(0,0);
}
document.getElementById('kwsearch').addEventListener('input',e=>{q=e.target.value.trim(); activeKw=null; if(view!=='timeline')view='kw'; render()});
document.getElementById('btn-export').onclick=exportEdited;
document.getElementById('btn-reset').onclick=resetEdits;
if(localStorage.getItem(LSKEY)){const n=document.getElementById('editnotice');if(n)n.style.display='inline-flex';}
applyHash();
render();


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
const PARTIES={"asof": "2026.10.21", "intro": "토론장에 나오는 세 정당은 앞에, 나머지 정당은 뒤에 두었습니다. 칸마다 근거 기사가 달려 있습니다. \"미확인\"은 찾지 못했다는 뜻이니 그 부분은 말하지 마십시오.", "parties": [{"id": "dem", "name": "더불어민주당", "short": "민주당", "color": "var(--dem)", "who": "토론자 김보미 · 여당", "line": "국민주권 민주주의, 혁신성장과 균형발전. 이재명 정부 국정을 뒷받침하는 집권 여당.", "facts": [["지도부", "김민석 대표(8.17 전당대회, 54.08%). 청년 몫 지명직 최고위원 전용기", [["뉴스토마토 2026.8.17 민주당 전당대회", "https://newstomato.com/ReadNews.aspx?no=1310490"]]], ["의석", "161석(6·3 재보선 후)", [["연합/다음 2026.6.4 재보선 후 의석", "https://v.daum.net/v/20260604050957548"]]], ["지지율", "갤럽 10월 3주 36%(국민의힘 27%). 미디어토마토 10월 초 37.0%(국민의힘 37.6%) — 조사마다 크게 다름", [["주간경향 2026.10.16 갤럽 정당지지도", "https://weekly.khan.co.kr/article/202610161744001"], ["뉴스토마토 2026.10.8 미디어토마토", "https://newstomato.com/ReadNews.aspx?no=1315995"]]], ["청년", "갤럽 18~29세 민주 18%·국민의힘 27%·무당층 47%", [["톱스타뉴스 2026.10.16 갤럽 10월 3주", "https://www.topstarnews.net/news/articleView.html?idxno=16248734"]]]]}, {"id": "ref", "name": "개혁신당", "short": "개혁신당", "color": "var(--ref)", "who": "토론자 김성열 전 최고위원 (10.22 이준석 의원 대신 참석 통보)", "line": "권력 분산과 법치를 내건 개혁 보수·중도. 규제 완화, 대출 정상화, 민간 공급.", "facts": [["토론자", "김성열: 1982년생, 연세대 경영학과. 민주당 쪽 보좌진 출신, 개혁신당 수석대변인·수석최고위원 역임. 재정 건전성을 강조(추경 \"불난 집에 기름\")", [["김성열 최고위원 모두발언 — 추경 비판(개혁신당 2026.4.9)", "https://reformparty.kr/news/press/665-press-764"], ["김성열 하남갑 출마(시사뉴스 2026.5.12)", "https://sisa-news.com/mobile/article.html?no=269880"]]], ["지도부", "이기인 비상대책위원장(9.14 출범, 2027.7까지). 이준석은 지선 책임지고 사퇴", [["더팩트 2026.9.15 이기인 비대위", "https://news.tf.co.kr/read/ptoday/2365799.htm"], ["주간경향 2026.8.26 이준석 사퇴", "https://weekly.khan.co.kr/article/202608260909001"]]], ["의석", "3석", [["경북매일 2026.8.31 개혁신당 3석", "https://kbmaeil.com/article/20260830500658"]]], ["지지율", "갤럽 10월 2%, 비호감도 73%로 전 정당 중 가장 높음(7월)", [["톱스타뉴스 2026.10.16 갤럽 10월 3주", "https://www.topstarnews.net/news/articleView.html?idxno=16248734"], ["여성신문 2026.7.10 갤럽 비호감도", "https://www.womennews.co.kr/news/articleView.html?idxno=279787"]]], ["지선", "6·3 지방선거 기초의원 1석. 목표는 \"세 자릿수 당선\"이었음", [["주간경향 2026.8.26 이준석 사퇴", "https://weekly.khan.co.kr/article/202608260909001"], ["헤럴드경제 2026.4.14 이준석 인터뷰", "https://www.heraldk.com/article/2026041423510949260"]]]]}, {"id": "prg", "name": "진보당", "short": "진보당", "color": "var(--prg)", "who": "토론자 박태훈 · 청년진보당 대학생위 준비위원장", "line": "불평등 해소와 노동 중심 재분배를 내건 진보정당. 이재명 정부엔 비판적 지지.", "facts": [["지도부", "김종훈 대표(7.24 선출), 청년진보당 대표 이해지", [["서울신문 2026.7.27 김종훈 대표 선출", "https://www.seoul.co.kr/news/politics/2026/07/27/20260727500064"], ["미래경제뉴스 2026.8.15 진보당 4기 지도부", "https://www.m-economynews.com/mobile/article.html?no=69793"]]], ["의석", "4석(윤종오·정혜경·전종덕·손솔). 손솔은 22대 최연소, 청년진보당 출신", [["미래경제뉴스 2026.8.15 진보당 4기 지도부", "https://www.m-economynews.com/mobile/article.html?no=69793"]]], ["지지율", "리얼미터 10월 1.1%", [["파이낸셜뉴스 2026.10.19 리얼미터", "https://www.fnnews.com/news/202610190810386048"]]], ["민주당과", "2024 더불어민주연합 참여, 2025 대선 김재연 후보 사퇴·5당 공동선언, 지선 일부 단일화", [["서울신문 2025.5.9 5당 공동선언", "https://m.seoul.co.kr/news/2025/05/09/20250509500171"]]]]}, {"id": "ppp", "name": "국민의힘", "short": "국민의힘", "color": "#c9151e", "who": "제1야당 · 이번 토론엔 안 나옴", "line": "자유민주주의·법치·시장경제. \"민생정당 2.0\", 민간 공급과 규제 철폐.", "facts": [["지도부", "장동혁 대표, 정점식 원내대표(6.10)", [["MTN 2026.8.26 장동혁 1주년", "https://news.mtn.co.kr/news-detail/2026082613574011611"], ["뉴시스 2026.6.10 정점식 원내대표", "https://www.newsis.com/view/NISX20260610_0003663905"]]], ["의석", "110석", [["연합/다음 2026.6.4 재보선 후 의석", "https://v.daum.net/v/20260604050957548"]]], ["지지율", "갤럽 10월 27%. ARS 조사(여론조사공정)는 45.3%로 1위 — 방식에 따라 정반대", [["톱스타뉴스 2026.10.16 갤럽 10월 3주", "https://www.topstarnews.net/news/articleView.html?idxno=16248734"], ["위키트리 2026.10.6 여론조사공정(ARS)", "https://www.wikitree.co.kr/articles/1164344"]]], ["광역단체장", "서울(오세훈)·대구·경북·경남 4곳", [["연합/다음 2026.6.4 재보선 후 의석", "https://v.daum.net/v/20260604050957548"]]]]}, {"id": "cho", "name": "조국혁신당", "short": "조국혁신당", "color": "#2a6fb3", "who": "원내 3당", "line": "검찰개혁 완수가 1순위. 민주당엔 \"개혁이 느리다\", 합당은 거부.", "facts": [["지도부", "신장식 대표(7.25)", [["경향신문 2026.7.25 신장식 대표", "https://www.khan.co.kr/article/202607251647001/amp"]]], ["의석", "12석", [["연합/다음 2026.6.4 재보선 후 의석", "https://v.daum.net/v/20260604050957548"]]]]}, {"id": "etc", "name": "정의당·기본소득당·사회민주당", "short": "그 밖의 진보정당", "color": "#6b7280", "who": "소수정당", "line": "정의당은 원외(양경규 대표), 기본소득당 1석(오준호 대표), 사회민주당 1석(한창민 대표).", "facts": [["정의당", "세입자 보호 공약이 지선 주거공약 평가에서 5개 정당 중 가장 높게 평가됨", [["위키트리 2026.8.29 정의당 양경규", "https://www.wikitree.co.kr/articles/1155862"], ["참여연대·주거권네트워크 2026.5.18 지선 주거공약 평가", "https://peoplepower21.org/stablelife/2023030"]]], ["기본소득당", "용혜인 의원이 성평등가족부 장관 후보자", [["주간경향 2026.9.7 기본소득당 오준호", "https://weekly.khan.co.kr/article/202609071125011"]]]]}], "tables": [{"title": "전체 정당 한눈에", "note": "토론 세 정당 + 국민의힘·조국혁신당 · 확인된 것만", "cols": ["dem", "ref", "prg", "ppp", "cho"], "rows": [["주거 해법", ["공적주택 119만 호(2030, 수도권 92만), 보편형 공공임대 19만 호, 미혼 청년 24.3만 호", [["뉴스토마토 2026.9.21 주거안정플랜", "https://newstomato.com/ReadNews.aspx?no=1314458"]]], ["규제 완화·대출 정상화·민간 공급, 실거주의무 폐지", [["머니투데이 2026.7.20 이준석 대출규제 비판", "https://www.mt.co.kr/politics/2026/07/20/2026072009394764215"], ["헤럴드경제 2026.6.14 실거주의무 4.9만호", "https://www.heraldk.com/article/2026061423472675526"]]], ["장기공공임대 20% 의무화, 토지임대부·기본주택", [["참여연대·주거권네트워크 2026.5.18 지선 주거공약 평가", "https://peoplepower21.org/stablelife/2023030"], ["한국사회복지저널 2026.9.28 정태흥 9.21 비판", "https://www.ksw-news.com/news/articleView.html?idxno=3040183"]]], ["재건축초과이익환수 폐지, 반값 전세, 신규 공공임대 30% 청년·신혼", [["머니투데이 2026.5.12 국민의힘 지선 1호 공약", "https://www.mt.co.kr/politics/2026/05/12/2026051115314050355"], ["SBS Biz 2026.5.11 국민의힘 청년 공약", "https://biz.sbs.co.kr/amp/article/20000309555"]]], ["99년 국민안심아파트(영구 공공임대), 매년 1%씩 확대", [["뉴시스 2026.5.13 조국혁신당 99년 아파트", "https://www.newsis.com/view/NISX20260513_0003627476"], ["뉴시스 2026.8.6 조국혁신당 세입자 우선", "https://www.newsis.com/view/NISX20260806_0003738630"]]]], ["대출 규제", ["10·15 대책(2025) 유지, 청년미래보금자리론 신설", [["헤럴드경제 2026.8.12 청년미래보금자리론", "https://www.heraldk.com/article/2026081220003465184"]]], ["\"대출 규제가 청년만 골라 잡았다\", 정상화", [["머니투데이 2026.7.20 이준석 대출규제 비판", "https://www.mt.co.kr/politics/2026/07/20/2026072009394764215"]]], ["보유세 강화, 종부세 완화 철회 요구", [["한국사회복지저널 2026.9.28 정태흥 9.21 비판", "https://www.ksw-news.com/news/articleView.html?idxno=3040183"]]], ["10·15 대책 철회, 실수요·지방 청년 LTV 상향", [["이투데이 2025.10.22 부동산 정상화 특위", "https://www.etoday.co.kr/news/view/2517113"]]], ["미확인", []]], ["최저임금", ["2027년 1만 700원(+3.7%) 결정", [["세계일보 2026.7.15 2027 최저임금", "https://www.segye.com/newsView/20260715519984"]]], ["지자체가 ±30% 범위에서 결정(2025 대선 공약)", [["노컷뉴스 2025.5.28 최저임금 차등 팩트체크", "https://www.nocutnews.co.kr/news/6346286"]]], ["\"실질임금 삭감\", 생계비 기준 결정, 플랫폼까지 적용", [["미래경제뉴스 2026.7.15 진보당 최저임금 논평", "https://www.m-economynews.com/mobile/article.html?no=68774"]]], ["2027년분 공식 논평 미확인", []], ["생활가능 노동임금 보장제", [["뉴시스 2026.5.13 조국혁신당 99년 아파트", "https://www.newsis.com/view/NISX20260513_0003627476"]]]], ["정년 연장", ["2037년 65세 단계안, 처리 세 차례 지연", [["주간경향 2026.8.29 정년연장 지연", "https://weekly.khan.co.kr/article/202608291624001"]]], ["\"정년 연장하면 청년 일자리가 어떻게 느나\" 반대", [["파이낸셜뉴스 2025.5.19 이준석 정년연장", "https://www.fnnews.com/news/202505191418234808"]]], ["환영, 다만 불이익 변경 반대. 청년 충돌엔 답 없음", [["다음 2026.6.10 윤종오 정년연장", "https://v.daum.net/v/20260610160122366"]]], ["원칙 동의, 임금체계 연동·재고용 선택", [["SBS Biz 2026.10.13 정년연장 국감", "https://biz.sbs.co.kr/amp/article/20000339666"]]], ["미확인", []]], ["노동법", ["노란봉투법 3.10 시행, 주4.5일 시범", [["세계일보 2026.6.22 노란봉투법 시행 후", "https://www.segye.com/newsView/20260622507507"]]], ["노동규제 완화, 기준국가제", [["더팩트 2025.5.25 든든출발자금", "https://news.tf.co.kr/read/ptoday/2208718.htm"]]], ["5인 미만 근로기준법 전면 적용, 메가특구 노동특례 반대", [["시대일보 2026.10.20 5인 미만 근기법", "https://www.sidae.com/article/2026101513065895682"], ["한국사회복지저널 2026.10.12 메가특구 특례 반대", "https://www.ksw-news.com/news/articleView.html?idxno=3045431"]]], ["노란봉투법 재개정·폐지 검토, 주52시간 예외 확대", [["뉴시스 2026.4.15 노란봉투법 재개정 추진", "https://www.newsis.com/view/NISX20260415_0003592170"], ["MTN 2026.7.31 주52시간 예외 확대 법안", "https://news.mtn.co.kr/news-detail/2026073116400448666"]]], ["AI 고용영향평가, 정의로운 전환 기금", [["뉴시스 2026.5.13 조국혁신당 99년 아파트", "https://www.newsis.com/view/NISX20260513_0003627476"]]]], ["청년 대표 정책", ["K-유스개런티(첫 취업), 청년미래적금, 월세지원 확대", [["뉴스서울 2026.9.4 고용부 2027 예산", "https://newsseoul.co.kr/news/view/1065583215213139"], ["노컷뉴스 2026.8.28 2027 청년예산", "https://nocutnews.co.kr/news/6571021"]]], ["든든출발자금(최대 5천만 원, 연 1.7%)", [["더팩트 2025.5.25 든든출발자금", "https://news.tf.co.kr/read/ptoday/2208718.htm"]]], ["청년일자리 국가책임제, 졸업실업급여, 공공일자리 38만", [["인천일보 2026.10.8 진보당 경기도당 청년 논평", "https://www.incheonilbo.com/news/articleView.html?idxno=1333767"]]], ["월세 세액공제 확대, 중기 취업 청년 소득세 감면 영구화", [["SBS Biz 2026.5.11 국민의힘 청년 공약", "https://biz.sbs.co.kr/amp/article/20000309555"]]], ["AI 일자리 안심보장제", [["뉴시스 2026.5.13 조국혁신당 99년 아파트", "https://www.newsis.com/view/NISX20260513_0003627476"]]]]]}, {"title": "의제 1 · 청년 주거 — 토론 세 정당 자세히", "cols": ["dem", "ref", "prg"], "rows": [["첫 처방", ["공공이 짓는 집. 공적주택 119만 호, 수도권 77%. 미혼 청년 24.3만 호, 2027년 청년 공공임대 10.6만 호", [["국토부 주거안정플랜 발표(정책브리핑 2026.9.21)", "https://www.korea.kr/news/policyNewsView.do?newsId=148972316"], ["노컷뉴스 2026.8.28 2027 청년예산", "https://nocutnews.co.kr/news/6571021"]]], ["대출을 풀고 민간이 짓게. \"세금 인상이 아니라 대출 정상화\"", [["아시아경제 2026.7.20 \"대출 정상화\"", "https://view.asiae.co.kr/article/2026072011165338225"]]], ["공공임대를 지역마다 20%까지. 대학가 임대주택의 청년주택화", [["참여연대·주거권네트워크 2026.5.18 지선 주거공약 평가", "https://peoplepower21.org/stablelife/2023030"], ["다음 2026.8.10 김종훈 옥탑방 간담회", "https://v.daum.net/v/20260810171355325"]]]], ["숫자", ["2027 청년 공적주택 10.6만 호(+3.5만), 청년 주거예산 약 18조(두 배)", [["헤럴드경제 2026.8.31 국토부 2027 예산", "https://www.heraldk.com/article/2026083120041480854"], ["노컷뉴스 2026.8.28 2027 청년예산", "https://nocutnews.co.kr/news/6571021"]]], ["\"실거주의무 풀면 전세 4.9만 호\", \"전세 61주 연속 상승\"", [["헤럴드경제 2026.6.14 실거주의무 4.9만호", "https://www.heraldk.com/article/2026061423472675526"], ["인사이트 2026.4.23 \"민생 내란\"", "https://www.insight.co.kr/news/551358"]]], ["청년 기본주택 월세 10만 원(33㎡), 공공임대 100만 호 요구", [["한국사회복지저널 2026.9.28 정태흥 9.21 비판", "https://www.ksw-news.com/news/articleView.html?idxno=3040183"], ["월요신문 2026.9.3 진보당 미래대응기금 요구", "https://www.wolyo.co.kr/news/articleView.html?idxno=317332"]]]], ["월세·세입자", ["월세지원 상시화(2026.3), 2027년 중위소득 100%까지, 차상위 48개월. 금액은 월 20만 원 그대로", [["비즈워치 청년월세 상시화·확대", "https://news.bizwatch.co.kr/article/real_estate/2026/09/15/0035"]]], ["세입자 대책 거의 없음(참여연대 평가)", [["참여연대 2025.5.13 대선 주거공약 평가", "https://peoplepower21.org/stablelife/1991954"], ["참여연대·주거권네트워크 2026.5.18 지선 주거공약 평가", "https://peoplepower21.org/stablelife/2023030"]]], ["임대료 상한, 계약갱신 무제한, 관리비 규제. 월세지원은 \"한시·추첨이라 한계\"", [["다음 2026.8.10 김종훈 옥탑방 간담회", "https://v.daum.net/v/20260810171355325"], ["한국사회복지저널 2026.10.5 이해지 주거의 날", "https://www.ksw-news.com/news/articleView.html?idxno=3043419"]]]], ["세제", ["월세 세액공제: 정부 한도 1,200만 원 / 복기왕안 공제율 30%", [["SBS Biz 2026.9.4 월세 세액공제 법안 4건", "https://biz.sbs.co.kr/amp/article/20000332792"], ["헤럴드경제 2026.7.15 복기왕 월세공제법", "https://www.heraldk.com/article/2026071519235416273"]]], ["첫 주택 취득세 50% 감면(2025 대선)", [["뉴시스 2025.5.1 이준석 대선 주거공약", "https://www.newsis.com/view/NISX20250501_0003161533"]]], ["종부세 완화 철회, 보유세 강화", [["한국사회복지저널 2026.9.28 정태흥 9.21 비판", "https://www.ksw-news.com/news/articleView.html?idxno=3040183"]]]], ["9.21 플랜 평가", ["자기 정책. 보편형(중산층)에 예산 쏠림 비판은 참여연대가 제기", [["참여연대 2026.9.22 주거안정플랜 논평", "https://peoplepower21.org/stablelife/2029728"], ["참여연대 2026.9.30 2027 주거예산 분석", "https://peoplepower21.org/?p=2030086"]]], ["공식 논평 미확인. \"문재인 정부 2.0\" 프레임 예상", [["한국경제 2025.10.16 10·15 대책 비판", "https://www.hankyung.com/article/2025101621097"]]], ["\"119만 호 중 23만 호는 전세임대, 대기자 2.5만 명인데 보편형\"", [["한국사회복지저널 2026.9.28 정태흥 9.21 비판", "https://www.ksw-news.com/news/articleView.html?idxno=3040183"]]]], ["기숙사·대학가", ["LH 기숙사형 전세임대 500호 공모, 서울대와 200호", [["파이낸셜뉴스 2026.10.6 기숙사형 전세임대", "https://www.fnnews.com/news/202610061826523928"]]], ["미확인", []], ["LH 전세임대 1,618호가 최저주거기준 미달, 그중 청년 66%", [["오마이뉴스 2026.10.20 LH 최저주거기준 미달", "https://ohmynews.com/NWS_Web/View/at_pg.aspx?CNTN_CD=A0003276941"]]]], ["외부 평가", ["\"목표·인력·예산 계획 빠짐\", \"3기 신도시 8배 물량, 현실성 의문\"", [["참여연대 2026.10.1 좌담회", "https://peoplepower21.org/?p=2029896"], ["MTN 2026.9.22 전문가 평가", "https://news.mtn.co.kr/news-detail/2026092215285210316"]]], ["\"임대인 인센티브 치중, 세입자 보호 부적절\"", [["참여연대·주거권네트워크 2026.5.18 지선 주거공약 평가", "https://peoplepower21.org/stablelife/2023030"]]], ["\"방향은 긍정, 이행방안 부족\", 임대료 통제 부작용 지적", [["참여연대·주거권네트워크 2026.5.18 지선 주거공약 평가", "https://peoplepower21.org/stablelife/2023030"], ["파이낸셜뉴스 2024.12.8 임대료 통제 반론", "https://www.fnnews.com/news/202412081803427519"]]]]]}, {"title": "의제 2 · 청년 일자리 — 토론 세 정당 자세히", "cols": ["dem", "ref", "prg"], "rows": [["첫 처방", ["첫 경력을 나라가 지원. 고용부 청년 일자리 예산 3.3조(+7천억)", [["고용노동부 2027 예산 보도자료(KDI)", "https://eiec.kdi.re.kr/policy/materialView.do?num=287616"]]], ["규제를 풀어 기업이 뽑게", [["더팩트 2025.5.25 든든출발자금", "https://news.tf.co.kr/read/ptoday/2208718.htm"]]], ["청년일자리 국가책임제·보장제. 공공부문 양질 일자리 38만 개", [["인천일보 2026.10.8 진보당 경기도당 청년 논평", "https://www.incheonilbo.com/news/articleView.html?idxno=1333767"], ["월요신문 2026.9.3 진보당 미래대응기금 요구", "https://www.wolyo.co.kr/news/articleView.html?idxno=317332"]]]], ["대표 사업", ["K-유스개런티 3,793억·16만 명, 일경험 6.5만, 구직촉진수당 65만 원", [["뉴스서울 2026.9.4 고용부 2027 예산", "https://newsseoul.co.kr/news/view/1065583215213139"], ["SBS Biz 2026.9.1 청년 일자리 예산", "https://biz.sbs.co.kr/amp/article/20000331977"]]], ["든든출발자금 최대 5천만 원 대출", [["더팩트 2025.5.25 든든출발자금", "https://news.tf.co.kr/read/ptoday/2208718.htm"]]], ["졸업실업급여(미취업 청년 24만 명), 구직촉진수당 기간 연장 요구", [["인천일보 2026.10.8 진보당 경기도당 청년 논평", "https://www.incheonilbo.com/news/articleView.html?idxno=1333767"], ["한국사회복지저널 2026.10.20 이해지 구직 사다리", "https://www.ksw-news.com/news/articleView.html?idxno=3049333"]]]], ["최저임금", ["1만 700원(+3.7%)", [["세계일보 2026.7.15 2027 최저임금", "https://www.segye.com/newsView/20260715519984"]]], ["지역별 ±30% 차등 → 팩트체크 \"근거 사실 아니거나 미확인\"", [["노컷뉴스 2025.5.28 최저임금 차등 팩트체크", "https://www.nocutnews.co.kr/news/6346286"]]], ["\"실질임금 삭감\", 생계비 먼저 산정", [["미래경제뉴스 2026.7.15 진보당 최저임금 논평", "https://www.m-economynews.com/mobile/article.html?no=68774"]]]], ["정년 연장", ["2037년 65세 단계안, 지연 중. KDI: 고령 1명당 청년 0.2명 감소", [["주간경향 2026.8.29 정년연장 지연", "https://weekly.khan.co.kr/article/202608291624001"], ["헤럴드경제 2026.6.21 KDI 정년연장 분석", "https://www.heraldk.com/article/2026062118153278308"]]], ["반대. 한국은행 \"청년 0.4~1.5명 감소\" 추정이 근거로 쓰일 것", [["파이낸셜뉴스 2025.5.19 이준석 정년연장", "https://www.fnnews.com/news/202505191418234808"], ["머니투데이 2025.11.23 한은·KDI 정년 효과", "https://www.mt.co.kr/economy/2025/11/23/2025112113575318203"]]], ["환영. 청년 일자리 충돌엔 답 없음", [["다음 2026.6.10 윤종오 정년연장", "https://v.daum.net/v/20260610160122366"]]]], ["노동 조건", ["노란봉투법 시행, 하청노조 교섭 요구 1,161곳", [["세계일보 2026.6.22 노란봉투법 시행 후", "https://www.segye.com/newsView/20260622507507"]]], ["미확인(2026)", []], ["5인 미만 근기법 전면 적용, 장시간 노동 반대. 청년 고용 사업장 101곳 중 34곳 초과수당 미지급", [["시대일보 2026.10.20 5인 미만 근기법", "https://www.sidae.com/article/2026101513065895682"], ["한국사회복지저널 2026.10.12 메가특구 특례 반대", "https://www.ksw-news.com/news/articleView.html?idxno=3045431"]]]], ["약점", ["도약장려금 726억 미집행에도 단가 2.5배. 현금성 나열, 임금격차 구조는 손 안 댐", [["경기신문 2026.7.27 예산정책처 도약장려금 결산", "https://kgnews.co.kr/mobile/article.html?no=905336"], ["아이뉴스24 2026.8.28 청년 일자리 대책 분석", "https://www.inews24.com/view/1999625"]]], ["든든출발자금 대상 출처마다 다름, \"체감 공약 부족\"", [["더팩트 2025.5.25 든든출발자금", "https://news.tf.co.kr/read/ptoday/2208718.htm"]]], ["재원표 없음, 공약이 2022년과 비슷하다는 평가", [["더스쿠프 2026.6.2 진보당 지선 공약", "https://www.thescoop.co.kr/news/articleView.html?idxno=310405"]]]]]}], "play": [{"id": "ref", "title": "개혁신당(김성열 전 최고위원)과 마주할 때", "sub": "당 노선 공략 / 받아칠 것 — 이준석 전 대표가 써 온 논리를 그대로 가져올 가능성이 큼", "color": "var(--ref)", "items": [["공략", "세입자가 빠진 주거 정책", "대출 풀고 세금 깎아 주면 집 살 수 있는 청년은 좋습니다. 그런데 여기 계신 학생들 대부분은 집을 사는 게 아니라 방을 빌립니다. 시민단체 평가에서도 세입자 대책이 거의 없다고 나왔습니다.", "참여연대 2025 대선·2026 지선 평가 두 번 연속", [["참여연대 2025.5.13 대선 주거공약 평가", "https://peoplepower21.org/stablelife/1991954"], ["참여연대·주거권네트워크 2026.5.18 지선 주거공약 평가", "https://peoplepower21.org/stablelife/2023030"]]], ["공략", "최저임금 지역 차등", "최저임금을 지역마다 30% 낮출 수 있게 하면, 강진 청년은 같은 일 하고 7천 원대를 받습니다. 그럼 청년은 지방을 더 빨리 떠납니다.", "2025년 기준 하한 7,020원. 근거로 든 텍사스·캐나다 사례는 팩트체크에서 사실과 다르다고 나옴", [["노컷뉴스 2025.5.28 최저임금 차등 팩트체크", "https://www.nocutnews.co.kr/news/6346286"]]], ["공략", "대출만 풀면 집값", "대출을 풀면 집값이 먼저 오릅니다. 갭투자가 고(高)레버리지라는 건 이준석 전 대표도 인정했습니다.", "", [["한국경제 2025.10.16 10·15 대책 비판", "https://www.hankyung.com/article/2025101621097"], ["참여연대 2025.5.13 대선 주거공약 평가", "https://peoplepower21.org/stablelife/1991954"]]], ["받기", "\"대출 규제가 청년만 골라 잡았다\"", "그건 맞습니다. 청년 실수요자까지 같이 맞았습니다. 틀린 건 틀렸다고 하겠습니다. 다만 그 해법이 대출을 다시 다 푸는 건 아닙니다. 청년·신혼 예외를 정확히 두자는 겁니다.", "이준석 근거: 6억 한도, 생애최초 LTV 80→70%, \"일주일 만에 계약 255건 파기\"", [["머니투데이 2026.7.20 이준석 대출규제 비판", "https://www.mt.co.kr/politics/2026/07/20/2026072009394764215"], ["📼 관련 답변 카드 #3234", "#card/3234"]]], ["받기", "\"민주당은 청년한테 버스를 준다\"", "그 제안은 틀렸습니다. 저도 그때 방송에서 바로 그렇게 말했습니다. 그런데 조롱으로는 청년 잠자리가 안 생깁니다. 오늘은 몇 호를 언제 지을지 이야기하시죠.", "이준석 발언(뉴데일리 8.9 보도): \"지역구엔 고급 주거단지…청년에겐 버스\", \"차량 거주는 노숙 통계에 잡힌다\"", [["뉴데일리 2026.8.9 이준석 폐버스 비판", "https://www.newdaily.co.kr/site/data/html/2026/08/09/2026080900052.html"], ["일요시사 2026.8.10 \"차량 거주는 노숙\"", "https://www.ilyosisa.co.kr/mobile/article.html?no=257313"], ["📼 관련 답변 카드 #3219", "#card/3219"]]], ["받기", "\"정년 연장하면 청년 일자리 준다\"", "걱정은 맞습니다. 한국은행 분석도 있습니다. 그래서 정년 연장은 청년 신규채용을 얼마나 보장하는지부터 정하자는 겁니다.", "한국은행 0.4~1.5명, KDI 0.2명. 정면 부정하지 말 것", [["머니투데이 2025.11.23 한은·KDI 정년 효과", "https://www.mt.co.kr/economy/2025/11/23/2025112113575318203"], ["헤럴드경제 2026.6.21 KDI 정년연장 분석", "https://www.heraldk.com/article/2026062118153278308"], ["📼 관련 답변 카드 #3217", "#card/3217"]]], ["받기", "\"청년 예산 43조, 빚으로 미래를 당겨 쓴다\"", "빚 걱정, 맞습니다. 그래서 돈 쓰는 내역부터 10원까지 공개하자는 겁니다. 강진에서 봤습니다. 군민들이 예산 내역을 보기 시작하니 낭비예산 108억이 깎였습니다.", "김성열 4.9 최고위원회의: 추경은 \"불난 집에 기름을 붓는 격\"", [["김성열 최고위원 모두발언 — 추경 비판(개혁신당 2026.4.9)", "https://reformparty.kr/news/press/665-press-764"], ["📼 관련 답변 카드 #3282", "#card/3282"]]], ["받기", "\"민주당은 청년을 병풍으로 쓴다\"", "그 말 맞습니다. 저도 똑같이 말했습니다. 영입할 때는 미래라고 부르고, 규칙을 정하는 방에서는 지웁니다.", "김성열은 민주당 보좌진 출신이라 민주당 내부 비판이 날카로울 것", [["📼 관련 답변 카드 #3284", "#card/3284"], ["📼 관련 답변 카드 #2909", "#card/2909"]]], ["주의", "호칭·인신공격", "\"김성열 전 최고위원님\"으로 부르십시오. 1월 참고인 조사·탈당 복당·하남 득표, 개혁신당 지선 성적은 먼저 꺼내지 않습니다. 연세대 경영학과 출신이라 모교입니다.", "10.22 학생회 통보로 이준석 의원 대신 참석", [["김성열 하남갑 출마(시사뉴스 2026.5.12)", "https://sisa-news.com/mobile/article.html?no=269880"], ["김성열 뉴스핌 정국진단(2026.10.19)", "https://www.newspim.com/news/view/20261019001009"], ["📼 관련 답변 카드 #3281", "#card/3281"], ["📼 관련 답변 카드 #3218", "#card/3218"]]]]}, {"id": "prg", "title": "박태훈 위원장과 마주할 때", "sub": "같이 갈 것 / 짚을 것 / 받아칠 것", "color": "var(--prg)", "items": [["연대", "공공임대를 늘리자", "공공임대를 늘려야 한다는 데는 박 위원장님과 같은 편입니다. 우리 당 주거복지특위도 임대시장의 20%를 이야기합니다. 다만 숫자의 기준이 서로 다르니, 대학가 기숙사부터 연도별로 몇 호인지 같이 정하시죠.", "진보당 \"지역별 20%\" / 정부 \"전체 주택 10%\" / 민주당 오기형 \"임대시장 20%\" — 분모가 다름", [["뉴시스 2026.9.17 민주당 주거복지특위", "https://www.newsis.com/view/NISX20260917_0003793435"], ["한국사회복지저널 2026.9.28 정태흥 9.21 비판", "https://www.ksw-news.com/news/articleView.html?idxno=3040183"], ["📼 관련 답변 카드 #3223", "#card/3223"]]], ["연대", "5인 미만 근로기준법", "작은 가게에서 일하는 청년도 같은 권리를 받아야 합니다. 방향은 같고 속도의 문제입니다.", "정부는 2027년까지 단계 적용, 첫 단계 시행령도 아직", [["시대일보 2026.10.20 5인 미만 근기법", "https://www.sidae.com/article/2026101513065895682"]]], ["연대", "개혁신당에 맞설 때", "박 위원장님이 쓰신 말처럼 청년이 일을 그만두는 건 일이 안 맞아서가 아니라 조건이 견딜 만하지 않아서입니다. 그 조건을 바꾸는 쪽이 같이 가야 합니다.", "박태훈 오마이뉴스 연재 3화: 첫 직장 퇴사 이유 근로여건 44.4%", [["오마이뉴스 2026.8.28 박태훈의 청년 오늘 3화", "https://www.ohmynews.com/NWS_Web/View/at_pg.aspx?CNTN_CD=A0003262261"]]], ["짚기", "재원과 실현 가능성", "공공일자리 38만 개, 공공임대 100만 호, 좋습니다. 그런데 정부 119만 호도 현실성 논란이 있습니다. 해마다 얼마를 어디서 마련하는지가 같이 나와야 청년이 믿습니다.", "주거권네트워크도 진보당 공약에 \"이행방안 부족\"", [["참여연대·주거권네트워크 2026.5.18 지선 주거공약 평가", "https://peoplepower21.org/stablelife/2023030"], ["MTN 2026.9.22 전문가 평가", "https://news.mtn.co.kr/news-detail/2026092215285210316"]]], ["짚기", "정년 연장과 청년", "정년 연장을 환영하셨는데, 그때 청년 일자리와 부딪히는 문제는 어떻게 푸실지 듣고 싶습니다.", "윤종오 원내대표 6.10 발언", [["다음 2026.6.10 윤종오 정년연장", "https://v.daum.net/v/20260610160122366"]]], ["받기", "\"중도·실용으로는 불평등 못 바꾼다\"", "그 비판 맞습니다. 그래서 당 안에 다른 목소리가 있어야 하고, 저는 당대표 선거에서 그 말을 했습니다.", "김종훈 대표 7.27", [["서울신문 2026.7.27 김종훈 대표 선출", "https://www.seoul.co.kr/news/politics/2026/07/27/20260727500064"], ["📼 관련 답변 카드 #3221", "#card/3221"]]], ["받기", "\"보편형 공공임대가 저소득층 대기자를 밀어낸다\"", "순서를 지켜야 한다는 말씀이 맞습니다. 고시원·반지하 청년이 먼저입니다. 보편형을 하더라도 저소득층 몫은 줄이면 안 됩니다.", "정태흥 최고위원: 대기자 2.5만 명 / 참여연대: 통합공공임대 출자 +5%에 그침", [["한국사회복지저널 2026.9.28 정태흥 9.21 비판", "https://www.ksw-news.com/news/articleView.html?idxno=3040183"], ["참여연대 2026.9.30 2027 주거예산 분석", "https://peoplepower21.org/?p=2030086"], ["📼 관련 답변 카드 #3237", "#card/3237"]]], ["참고", "박태훈과 이재명 대통령", "대통령이 박 위원장 글에 \"틀린 말씀이 단 하나도 없다\"고 답했습니다(9.13). 민주당을 공격하더라도 적으로 대하지 마십시오.", "", [["폴리뉴스 2026.9.14 이재명 대통령, 박태훈 글에 답", "https://www.polinews.co.kr/news/articleView.html?idxno=743042"], ["📼 관련 답변 카드 #3225", "#card/3225"]]]]}, {"id": "ppp", "title": "국민의힘이 화제에 오를 때", "sub": "토론자는 없지만 학생 질문으로 나올 수 있음", "color": "#c9151e", "items": [["짚기", "집주인 공약", "재건축초과이익환수 폐지, 등록임대 혜택 부활. 집 가진 사람 공약입니다. 시민단체도 투기를 부를 수 있다고 평가했습니다.", "", [["머니투데이 2026.5.12 국민의힘 지선 1호 공약", "https://www.mt.co.kr/politics/2026/05/12/2026051115314050355"], ["참여연대·주거권네트워크 2026.5.18 지선 주거공약 평가", "https://peoplepower21.org/stablelife/2023030"]]], ["짚기", "청년안심주택", "서울시 청년안심주택에서 296가구가 보증금을 못 돌려받았습니다. 민간에 맡긴 청년주택이 어떻게 되는지 보여 줍니다.", "2026.8 잠실 단지 단전 위기까지", [["경향신문 2025.10.2 청년안심주택 보증금 미반환", "https://www.khan.co.kr/article/202510021354001/"], ["MTN 2026.8.11 청년안심주택 단전 위기", "https://news.mtn.co.kr/news-detail/2026081118242340193"]]], ["인정", "국민의힘 공약에도 쓸 것", "월세 세액공제를 넓히자는 건 여야가 같습니다. 법안이 4건 나와 있으니 빨리 합치면 됩니다.", "국민의힘 조지연 25~30%, 민주당 복기왕 30%·문진석 소득요건 폐지", [["SBS Biz 2026.9.4 월세 세액공제 법안 4건", "https://biz.sbs.co.kr/amp/article/20000332792"]]], ["참고", "청년은 양당을 다 떠났다", "갤럽에서 18~29세 무당층이 47%입니다. 청년이 국민의힘으로 간 게 아니라 양당을 다 떠난 겁니다.", "ARS 조사는 국민의힘 우위라 숫자를 쓸 땐 조사기관을 꼭 말할 것", [["톱스타뉴스 2026.10.16 갤럽 10월 3주", "https://www.topstarnews.net/news/articleView.html?idxno=16248734"], ["위키트리 2026.10.6 여론조사공정(ARS)", "https://www.wikitree.co.kr/articles/1164344"]]]]}, {"id": "dem", "title": "민주당 정책 — 먼저 인정하고 지킬 것", "sub": "틀린 건 틀렸다, 그리고 지킬 숫자", "color": "var(--dem)", "items": [["인정", "청년 고용", "청년 취업자가 47개월째 줄었습니다. 정부·여당이 결과로 책임질 일입니다.", "9월 15~29세 고용률 44.0%, 29개월 연속 하락", [["국가데이터처 9월 고용동향(KDI)", "https://eiec.kdi.re.kr/policy/materialView.do?num=288191"], ["📼 관련 답변 카드 #3238", "#card/3238"]]], ["인정", "주거 예산의 순서", "늘어난 주거 예산이 중산층 보편형에 쏠렸다는 지적은 새겨들어야 합니다. 저소득층 공공임대 출자는 5% 느는 데 그쳤습니다.", "", [["참여연대 2026.9.30 2027 주거예산 분석", "https://peoplepower21.org/?p=2030086"]]], ["인정", "장려금", "청년일자리도약장려금은 작년에 726억 원을 못 썼는데 단가를 2.5배 올렸습니다. 돈을 더 주기 전에 왜 못 썼는지부터 봐야 합니다.", "", [["경기신문 2026.7.27 예산정책처 도약장려금 결산", "https://kgnews.co.kr/mobile/article.html?no=905336"]]], ["인정", "청년최고위원·기탁금", "청년최고위원은 최고위에서 부결됐고 기탁금은 올랐다가 대통령 말 한마디에 내렸습니다. 저는 그 당사자입니다.", "", [["뉴시스 2026.7.15 청년최고위원 부결", "https://www.newsis.com/view/NISX20260715_0003710124"], ["데일리안 2026.7.22 기탁금 조정", "https://www.dailian.co.kr/news/view2/1669360"], ["📼 관련 답변 카드 #3232", "#card/3232"]]], ["지킬 것", "청년 주거", "청년 공적주택 10.6만 호, 청년 주거예산 약 18조로 두 배, 월세지원 중위소득 100%까지 확대.", "숫자는 \"약 18조, 두 배\"로 말할 것(매체마다 18.1~18.5조)", [["헤럴드경제 2026.8.31 국토부 2027 예산", "https://www.heraldk.com/article/2026083120041480854"], ["노컷뉴스 2026.8.28 2027 청년예산", "https://nocutnews.co.kr/news/6571021"], ["비즈워치 청년월세 상시화·확대", "https://news.bizwatch.co.kr/article/real_estate/2026/09/15/0035"]]], ["지킬 것", "교육", "2027년부터 지방국립대 신입생 등록금 전액 지원, 2030년 전 학년.", "", [["세계일보 2026.8.28 지방국립대 등록금", "https://www.segye.com/newsView/20260828512116"], ["📼 관련 답변 카드 #3242", "#card/3242"]]]]}], "caveat": "여론조사는 방식에 따라 정반대로 나옵니다(갤럽 전화면접은 민주 우위, ARS는 국민의힘 우위). 숫자를 말할 땐 반드시 조사기관을 붙이십시오. 개혁신당·진보당의 9.21 플랜 공식 논평 여부, 국민의힘 대학 등록금 공약 등은 찾지 못했습니다."};
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
const STUDY={"asof": "2026.10.26", "intro": "학생회 발제 의제 순서대로. 의제마다 ① 김보미가 할 말(우선순위순) → ② 정부 정책: 한 것·줄인 것·말 바꾼 것 → ③ 상대가 칠 말과 받아치기 → ④ 정당별 입장: 장점·문제점·반론 → ⑤ 숙제. 숫자와 출처는 문장 아래 「근거」를 눌러야 보입니다.", "agenda": [{"id": "a1", "rank": 1, "title": "의제 1 · 청년 주거", "q": "청년 주거 환경, 무엇을 우선적으로 바꿔야 하는가?", "why": "학생회가 1순위로 둔 이유: 선관위 보고서 설문에서 서울 20대가 주거/도시를 69.4%로 가장 많이 꼽았다(62명 응답). 서울 전체(328명)도 주거 64.3%가 1위.", "brief": "학생회 발제문이 든 것: 희망하우징 같은 공공 대안, \"늦은 시간 안심하고 다닐 수 있는 주거환경\"(안전), 통학, 월세 부담. 질문이 \"무엇을 우선적으로\"이니 답은 순서다. 아래 순서가 김보미의 답이다.", "topics": [{"id": "rent", "rank": 1, "title": "월세 그 자체 — 세 문제의 뿌리", "tag": "학생회 발제 · 월세", "say": [{"t": "월세 그 자체입니다. 안전도 통학도 중요합니다. 그런데 돈이 없으니까 어두운 골목, 먼 동네로 밀려나는 겁니다. 세 문제의 뿌리는 하나입니다.", "ev": [{"t": "서울 10개 대학가 원룸 평균 월세 62.2만, 관리비 포함 70.4만 원. 연세대 인근 68.3만+관리비 7.9만(2026.2)", "src": [["서울 10개 대학가 월세 62.2만, 연세대 68.3만(세계일보 2026.2.24)", "https://v.daum.net/v/20260224190250832"]]}, {"t": "다방 7월 조사: 연세대 앞 61.4만→67.8만 원(+10.4%), 관리비 +14.3%. 기조발언은 이 숫자를 쓴다", "src": [["서울 주요 대학가 원룸 월세, 연세대 인근 67.8만(SBS Biz·다방 2026.8.11)", "https://biz.sbs.co.kr/amp/article/20000327969"]]}]}, {"t": "여러분 학교 앞 8평 원룸이 올해 6월 5억 3천만 원에 팔렸습니다. 제 고향 강진 34평 아파트가 1억 7천5백입니다. 세 배, 평당 열세 배입니다.", "ev": [{"t": "창천동 프릭스빌 8평 2026.6.23 실거래 5.3억 / 강진중흥파크S-클래스빌 34평 2026.6.20 1.75억 → 3.03배, 평당 6,625만 vs 515만 = 12.9배", "src": [["창천동 원룸 매매 실거래(집품)", "https://zippoom.com/browse/%EC%84%9C%EC%9A%B8-%EC%84%9C%EB%8C%80%EB%AC%B8%EA%B5%AC-%EC%B0%BD%EC%B2%9C%EB%8F%99/%EB%B9%8C%EB%9D%BC-%EB%A7%A4%EB%A7%A4"], ["강진군 30평대 아파트 시세·실거래(리치고)", "https://m.richgo.ai/realty/apt-hub/%EC%A0%84%EB%82%A8%EA%B4%91%EC%A3%BC/%EA%B0%95%EC%A7%84%EA%B5%B0/30%ED%8F%89%EB%8C%80"]]}]}, {"t": "청년은 낼 세금이 없어서 힘든 게 아니라, 들어갈 집이 없어서 힘듭니다. 세입자 대책이 곧 청년 대책입니다.", "ev": [{"t": "민간 세입자 61%. 전세의 월세화로 서울 아파트 월세 거래가 전월세의 절반 초과. 서울 아파트 평균 월세 166만 원 = 임금의 43~44%", "src": [["참여연대 2026.9.22 주거안정플랜 논평", "https://peoplepower21.org/stablelife/2029728"], ["서울 아파트 평균 월세 166만, 임금의 43~44%(뉴스핌 2026.10.23 국토위)", "https://www.newspim.com/news/view/20261023000834"]]}, {"t": "같은 말을 한 곳: 전격시사 8.12(2707), 정치시그널 Q10(3010)", "src": [["📼 관련 카드 #2707", "#card/2707"], ["📼 관련 카드 #3010", "#card/3010"]]}]}, {"t": "부동산 정책의 성적표는 세율표에 있지 않습니다. 청년이 오늘 밤 어디서 자느냐에 있습니다.", "ev": [{"t": "청년 가구 최저주거기준 미달 8.2%(일반 3.8%의 2배). 반지하 32.7만(2020)→39.8만 가구(2024)", "src": [["청년가구 최저주거기준 미달 8.2%·반지하 39.8만(참여연대 2026.5.13)", "https://peoplepower21.org/youth/2022703"]]}, {"t": "저소득 청년 86.6%가 공공임대도 주거급여도 못 받는 사각지대(국토연구원 2026.8)", "src": [["저소득 청년 86.6% 공공임대·주거급여 사각지대(파이낸셜뉴스, 국토연구원 2026.8)", "https://www.fnnews.com/news/202608110630517454"]]}]}]}, {"id": "public", "rank": 2, "title": "공공이 가진 방부터 — 기숙사·희망하우징", "tag": "학생회 발제 · 희망하우징", "say": [{"t": "학생회가 든 희망하우징을 보겠습니다. 시세의 30%, 월세 9만~15만 원. 좋은 제도입니다. 그런데 올해 1차 모집이 18호였습니다. 제도가 있다는 것과 들어갈 방이 있다는 건 다른 이야기입니다.", "ev": [{"t": "희망하우징: 시세 30%, 보증금 100만~109만 원, 최장 4년. 2026년 1차 모집 18호(정릉·연남·내발산). 최근 공고 5건은 모두 공공기숙사 잔여세대", "src": [["희망하우징 2026년 1차 모집 18호(고방 2026.5.13)", "https://gobang.kr/contents/7859"], ["희망하우징 임대조건(내 손안에 서울 2018.5.9)", "https://mediahub.seoul.go.kr/archives/1155750"]]}, {"t": "2013·2017년에는 3인 공유 구조 탓에 공실 37~50%가 문제였다", "src": [["희망하우징 다가구 공실 37%(서울신문 2017.2.6)", "https://m.go.seoul.co.kr/news/2017/02/06/20170206500149"]]}]}, {"t": "첫째, 공공이 가진 방입니다. 서울 대학 기숙사 수용률 16.8%, 전국 꼴찌입니다. 수도권 대학은 5년 동안 재학생이 2만 7천 명 늘었는데 기숙사 자리는 2천 개 늘었습니다. 대학 부지와 국공유지에 기숙사를 짓고, 연도별 숫자로 약속하게 해야 합니다.", "ev": [{"t": "서울 대학 기숙사 수용률 16.8%, 17개 시도 최저. 수도권 73개 대학 5년간 학생 +27,107명, 기숙사 +2,042명(18.1%→17.7%)", "src": [["수도권 대학 기숙사 수용률, 서울 16.8%(이투데이 2026.10.15)", "https://etoday.co.kr/news/view/2635271"]]}, {"t": "LH 기숙사형 전세임대 500호 공모(10.7~), 서울대와 2030년까지 200호", "src": [["파이낸셜뉴스 2026.10.6 기숙사형 전세임대", "https://www.fnnews.com/news/202610061826523928"]]}, {"t": "서울시 새싹원룸 1만 실(SH가 원룸을 반전세로 빌려 신입생에 재임대), 청년주택 7.4만(2030)", "src": [["오세훈 청년주택 7.4만·새싹원룸 1만(머니투데이 2026.3.10)", "https://www.mt.co.kr/estate/2026/03/10/2026031015380279900"]]}]}]}, {"id": "safe", "rank": 3, "title": "안전과 통학 — 안전은 월세로 사는 게 아니다", "tag": "학생회 발제 · 안전·통학", "say": [{"t": "학생회 자료에도 \"늦은 시간 안심하고 다닐 수 있는 주거환경\"이 적혀 있습니다. 그런데 서울시 안심귀가스카우트 예산은 2022년 37억 원에서 올해 12억, 내년 안은 6억 원입니다. 여학생들은 안전을 월세로 삽니다. 안전은 공공이 책임질 일입니다.", "ev": [{"t": "안심귀가스카우트 예산 37억(2022)→12억(2025)→6억(2026안), 인력 334명→60명", "src": [["안심귀가스카우트 예산 37억→6억(서울신문 2025.11.17)", "https://m.go.seoul.co.kr/news/2025/11/17/20251117500262"]]}, {"t": "마포·서대문 여성전용 원룸이 일반 원룸보다 월 5만~20만 원 비쌈", "src": [["여성전용 원룸 월세 5만~20만 원 더(서울신문 2024.2.12)", "https://m.seoul.co.kr/news/2024/02/12/20240212500098"]]}]}, {"t": "통학도 돈입니다. 서울과 붙은 경기 11개 시 주민 57%가 편도 1시간 넘게 걸립니다. 청년 기후동행카드는 좋은 정책이지만 경기에서 오는 학생에겐 반쪽입니다. 경기·인천과 같이 쓰는 정기권이 답입니다.", "ev": [{"t": "경기 11개 시 주민 57.3%가 통근·통학 편도 1시간 이상", "src": [["경기 11개 시 57% 편도 1시간 이상(SBS Biz 2026.10.6)", "https://biz.sbs.co.kr/amp/article/20000338571"]]}, {"t": "청년 기후동행카드 월 5만 5천 원(서울시)", "src": [["기후동행카드 청년 5만 5천 원(서울시 2025.9.24)", "https://news.seoul.go.kr/traffic/archives/514914"]]}]}]}, {"id": "support", "rank": 4, "title": "월세 지원은 현실에 맞게 — 30만 원", "tag": "김보미 제안", "say": [{"t": "월세 지원을 현실에 맞게 올리는 겁니다. 지금 20만 원은 학교 앞 월세의 3분의 1이 안 됩니다. 저는 월 30만 원으로 올려야 한다고 봅니다.", "ev": [{"t": "청년월세지원: 월 20만 원·최대 24개월, 19~34세 무주택, 소득 중위 60% 이하. 2026.3 상시화. 2027년부터 소득 기준 중위 100%, 차상위 이하 48개월. 금액 20만 원은 2022년 그대로", "src": [["비즈워치 청년월세 상시화·확대", "https://news.bizwatch.co.kr/article/real_estate/2026/09/15/0035"], ["청년 월세 지원 상시화 20만×24개월(뉴시스 2026.3.18)", "https://mobile.newsis.com/view/NISX20260318_0003552925"]]}, {"t": "\"30만 원으로\"는 교차점검(2853)에서 정한 표현. 서울시 청년월세지원 1.2만 명 추첨, 탈락자 관리비 8만 원", "src": [["📼 관련 카드 #2853", "#card/2853"], ["서울 청년월세지원 2026 1.2만 명·관리비 8만(고방 2026.3.10)", "https://gobang.kr/contents/7691"]]}]}, {"t": "관리비도 월세입니다. 관리비는 지원 대상에서 빠져 있는데 1년에 14%가 올랐습니다.", "ev": [{"t": "연세대 앞 관리비 +14.3%(다방 7월), 대학가 월세+관리비 평균 70.9만(파이낸셜뉴스 10.9)", "src": [["서울 주요 대학가 원룸 월세, 연세대 인근 67.8만(SBS Biz·다방 2026.8.11)", "https://biz.sbs.co.kr/amp/article/20000327969"], ["대학가 월세+관리비 평균 70.9만(파이낸셜뉴스 2026.10.9)", "https://www.fnnews.com/news/202610090343485982"]]}]}]}, {"id": "local", "rank": 5, "title": "서울과 지방을 같이 — 빈집과 원룸", "tag": "김보미만 할 수 있는 말", "say": [{"t": "서울은 방이 없어 난리인데 제 고향 강진은 빈집이 늘어 갑니다. 서울 청년의 주거 절망과 지방 청년의 일자리 절망은 같은 문제의 양면입니다. 수도권에 짓는 정성의 절반만 지방 빈집을 청년 집으로 바꾸는 데 써 주십시오. 지방이 살아야 여러분 학교 앞 월세도 내려갑니다.", "ev": [{"t": "같은 말: 전격시사 8.12(2707), 불교방송(119)", "src": [["📼 관련 카드 #2707", "#card/2707"], ["📼 관련 카드 #119", "#card/119"]]}, {"t": "화순 만원주택 567명 전입, 전남형 청년마을 4,191명 중 68명 정착", "src": [["화순 만원주택, 567명 전입(위키트리)", "https://www.wikitree.co.kr/articles/1143545"], ["전남형 청년마을 4,191명 중 68명 정착(헤럴드경제 2026.6.3)", "https://www.heraldk.com/article/2026060317462970644"]]}]}, {"t": "저는 강진에서 34평 임대아파트에 삽니다. 그런데 지금 일하는 곳 근처에서는 방 한 칸을 못 구했습니다. 그래서 요즘 화성 언니 집에서 출퇴근합니다. 전 군의회 의장도 수도권에서 방 한 칸 못 구합니다.", "ev": [{"t": "승원팰리체 리버시티 전용 84㎡(34평형) 226세대, 10년 민간임대. 강진 30평대 평당 808만 원", "src": [["승원팰리체 리버시티 전용84㎡ 34평형 226세대(장강뉴스)", "https://www.jgynews.com/news/articleView.html?idxno=33434"], ["강진군 30평대 아파트 시세·실거래(리치고)", "https://m.richgo.ai/realty/apt-hub/%EC%A0%84%EB%82%A8%EA%B4%91%EC%A3%BC/%EA%B0%95%EC%A7%84%EA%B5%B0/30%ED%8F%89%EB%8C%80"]]}]}]}], "gov": [{"t": "정부의 틀: 9.21 주거안정플랜 — 2030년까지 공적주택 119만 호(수도권 92만, 77%), 그중 보편형 공공임대 19만 호. 미혼 청년 몫 24.3만 호, 신혼·육아 32.8만 호. 2027년 청년 주거 예산은 9.6조→18.5조로 두 배, 청년 공공임대 10.6만 호(+3.5만).", "ev": [{"t": "정책브리핑(국토부 2026.9.21): 공적주택 119만 호(연 24만), 수도권 92만 호 77%. 공공임대 건설 35만·매입 31만·전세 23만, 공공분양 24만. 보편형 19만(건설 17.5만+매입 1.8만). 미혼 청년 24.3만, 신혼·육아 32.8만, 고령 5.4만", "src": [["국토부 주거안정플랜 발표(정책브리핑 2026.9.21)", "https://www.korea.kr/news/policyNewsView.do?newsId=148972316"]]}, {"t": "노컷뉴스 8.28: 청년 주거 예산 9조6천억→18조5천억, 청년 대상 공공임대 10만6천호(+3만5천). 헤럴드 8.31은 18.1조(집계 범위 다름) → \"약 18조, 두 배\"로", "src": [["노컷뉴스 2026.8.28 2027 청년예산", "https://nocutnews.co.kr/news/6571021"], ["헤럴드경제 2026.8.31 국토부 2027 예산", "https://www.heraldk.com/article/2026083120041480854"]]}, {"t": "118.8만이라고 쓴 매체(뉴스토마토·참여연대)도 있으나 정부 발표는 119만. 토론에서는 \"119만\"", "src": [["뉴스토마토 2026.9.21 주거안정플랜", "https://newstomato.com/ReadNews.aspx?no=1314458"], ["참여연대 2026.9.22 주거안정플랜 논평", "https://peoplepower21.org/stablelife/2029728"]]}]}, {"t": "월세지원 상시화(2026.3), 2027년 소득 기준 중위 100%·차상위 48개월. 청년드림청약 소득 한도 5천→7천만. 청년미래보금자리론(2027.1): 39세 이하 생애최초, 4억 이하 비아파트, LTV 80%.", "ev": [{"t": "청년월세 상시화·조건 확대", "src": [["비즈워치 청년월세 상시화·확대", "https://news.bizwatch.co.kr/article/real_estate/2026/09/15/0035"]]}, {"t": "청년미래보금자리론 조건. 서울 빌라 64%가 4억 초과로 제외 → \"청년은 빌라만 사라는 거냐\" 비판, 금융위는 아파트 포함 가능성 열어 둠", "src": [["헤럴드경제 2026.8.12 청년미래보금자리론", "https://www.heraldk.com/article/2026081220003465184"], ["청년미래보금자리론, 서울 빌라 64% 제외(헤럴드경제 2026.8.21)", "https://biz.heraldcorp.com/article/10847568"]]}]}, {"t": "10·15 대책(2025.10.15): 규제지역 무주택 LTV 70→40%, 주담대 한도 6억. 2030 주담대 매수 42.5% 감소 — 청년 실수요자가 같이 맞았다.", "ev": [{"t": "10·15 대책, 2030 주담대 42.5% 감소", "src": [["10·15 대책, 2030 주담대 42.5% 감소(헤럴드경제)", "https://www.heraldk.com/article/2025101517300227331"]]}]}, {"t": "비판(참여연대·전문가): 전세임대 23만을 빼면 장기 공공임대는 66.3만(연 13.3만). 보편형(중산층) 6.2조인데 저소득층용 통합공공임대 출자는 +5%. 119만은 3기 신도시 5곳의 8배라 실현성 의문. 국토부 반론: 취약계층 지원 약 4조는 줄지 않는다.", "ev": [{"t": "참여연대 9.22·9.30, MTN 9.22 전문가, 참여연대 10.1 좌담회", "src": [["참여연대 2026.9.22 주거안정플랜 논평", "https://peoplepower21.org/stablelife/2029728"], ["참여연대 2026.9.30 2027 주거예산 분석", "https://peoplepower21.org/?p=2030086"], ["MTN 2026.9.22 전문가 평가", "https://news.mtn.co.kr/news-detail/2026092215285210316"], ["참여연대 2026.10.1 좌담회", "https://peoplepower21.org/?p=2029896"]]}]}], "ask": [{"q": "\"대출 규제가 청년만 골라 잡았다. 사다리를 걷어찼다.\"", "who": "개혁신당 김성열", "admit": "맞다. 2030 주담대 매수가 42.5% 줄었다. 청년 실수요자가 같이 맞았다.", "hit": "\"맞습니다. 그래서 청년·신혼 예외를 검토만 할 게 아니라 해야 합니다. 그런데 대출을 다 풀자는 건 답이 아닙니다. 2021년에 봤습니다. 빚으로 올린 집값은 다음 청년이 냅니다. 그리고 개혁신당 공약엔 세입자 대책이 한 줄도 없다는 참여연대 평가에는 뭐라고 답하시겠습니까?\"", "ev": [{"t": "10·15 대책 2030 매수 42.5% 감소", "src": [["10·15 대책, 2030 주담대 42.5% 감소(헤럴드경제)", "https://www.heraldk.com/article/2025101517300227331"]]}, {"t": "참여연대: 개혁신당 2025 대선·2026 지선 \"세입자 대책 거의 없음\"", "src": [["참여연대 2025.5.13 대선 주거공약 평가", "https://peoplepower21.org/stablelife/1991954"], ["참여연대·주거권네트워크 2026.5.18 지선 주거공약 평가", "https://peoplepower21.org/stablelife/2023030"]]}, {"t": "받아치기 카드", "src": [["📼 관련 카드 #3234", "#card/3234"], ["📼 관련 카드 #3211", "#card/3211"]]}]}, {"q": "\"보편형 공공임대는 중산층용이다. 저소득층 대기자 2만 5천이 먼저다.\"", "who": "진보당 박태훈", "admit": "맞다. 통합공공임대 출자는 +5%뿐이고 영구·국민임대 대기자가 2만 5천 명이다.", "hit": "\"순서를 지켜야 한다는 데 동의합니다. 고시원·반지하 청년이 먼저입니다. 그래서 저는 보편형보다 공공이 이미 가진 방부터 채우자고 합니다. 민주당이라도 틀린 건 틀렸다고 하겠습니다.\"", "ev": [{"t": "정태흥(진보당) 9.21 플랜 비판, 참여연대 9.30", "src": [["한국사회복지저널 2026.9.28 정태흥 9.21 비판", "https://www.ksw-news.com/news/articleView.html?idxno=3040183"], ["참여연대 2026.9.30 2027 주거예산 분석", "https://peoplepower21.org/?p=2030086"]]}, {"t": "카드", "src": [["📼 관련 카드 #3237", "#card/3237"]]}]}, {"q": "\"규제·세금만 있고 공급은 없다. 재건축을 풀어야 한다.\"", "who": "국민의힘 논리(학생 질문 가능)", "admit": "공급이 부족하다는 진단은 맞다.", "hit": "\"그런데 재건축 풀어서 나오는 집은 10억짜리입니다. 연세대 앞 8평 원룸이 5억입니다. 학생이 살 집은 재건축에서 안 나옵니다. 민간에 맡긴 청년안심주택은 보증금을 떼였습니다. 공공이 가진 방부터 채우는 게 빠릅니다.\"", "ev": [{"t": "청년안심주택 4개 단지 296가구 보증금 미반환, 잠실 238억, 보증보험 미가입 1,231채", "src": [["청년안심주택 296가구 보증금 선지급(서울시 2025.10.2)", "https://mediahub.seoul.go.kr/archives/2015796"], ["잠실 238억·보증보험 미가입 1,231채(동아일보 2025.8.23)", "https://v.daum.net/v/20250823014527905"]]}, {"t": "카드", "src": [["📼 관련 카드 #3213", "#card/3213"]]}]}, {"q": "\"희망하우징이 있지 않나. 제도는 이미 있다.\"", "who": "학생회 발제", "admit": "좋은 제도다. 시세 30%, 월세 9만~15만 원.", "hit": "\"올해 1차 모집이 18호였습니다. 제도가 있는 것과 들어갈 방이 있는 건 다릅니다. 몇 실을 언제까지 늘릴지 숫자로 약속하고 지었는지 공개하게 해야 합니다.\"", "ev": [{"t": "희망하우징 18호·조건·과거 공실", "src": [["희망하우징 2026년 1차 모집 18호(고방 2026.5.13)", "https://gobang.kr/contents/7859"], ["희망하우징 임대조건(내 손안에 서울 2018.5.9)", "https://mediahub.seoul.go.kr/archives/1155750"], ["희망하우징 다가구 공실 37%(서울신문 2017.2.6)", "https://m.go.seoul.co.kr/news/2017/02/06/20170206500149"]]}]}, {"q": "\"기숙사 많이 지으면 끝 아닌가.\"", "who": "학생", "admit": "맞다. 그게 1순위다.", "hit": "\"그런데 기숙사는 주민 반대로 번번이 무산됩니다. 그래서 연도별 숫자로 약속하고 실제로 지었는지 공개하게 하자는 겁니다. 수도권 대학 5년간 학생 2만 7천 늘 때 기숙사 2천 늘었습니다.\"", "ev": [{"t": "기숙사 수용률 16.8%, 5년 +2,042명", "src": [["수도권 대학 기숙사 수용률, 서울 16.8%(이투데이 2026.10.15)", "https://etoday.co.kr/news/view/2635271"]]}]}, {"q": "\"월세 지원을 올리면 월세가 따라 오른다.\"", "who": "경제학 논리(개혁신당·학생)", "admit": "지원금만 올리면 집주인이 올릴 수 있다는 반론은 있다.", "hit": "\"그래서 공공이 가진 방이 같이 늘어야 합니다. 지원금은 당장 숨 쉬게 하는 것이고, 공공 원룸·기숙사가 시장 월세를 끌어내립니다. 둘을 같이 가야지 하나만 하면 말씀대로 됩니다.\"", "ev": [{"t": "청년월세지원 조건", "src": [["비즈워치 청년월세 상시화·확대", "https://news.bizwatch.co.kr/article/real_estate/2026/09/15/0035"]]}]}, {"q": "\"민주당 정부 119만 호, 지어진 집이 있나. 숫자만 크다.\"", "who": "개혁신당·국민의힘", "admit": "실현성 의문은 전문가도 제기한다(3기 신도시 8배).", "hit": "\"그래서 저는 숫자보다 공개를 말합니다. 연도별로 몇 호 지었는지 매년 공개하게 하면 됩니다. 강진에서 예산 내역을 공개하니 행정이 바뀌었습니다. 2027년 당장 들어갈 수 있는 물량은 전국 15만, 수도권 10만입니다.\"", "ev": [{"t": "입주 가능 물량 2026.4Q~2027: 전국 15만, 수도권 10만(정책브리핑)", "src": [["국토부 주거안정플랜 발표(정책브리핑 2026.9.21)", "https://www.korea.kr/news/policyNewsView.do?newsId=148972316"]]}, {"t": "MTN 전문가 평가", "src": [["MTN 2026.9.22 전문가 평가", "https://news.mtn.co.kr/news-detail/2026092215285210316"]]}]}, {"q": "\"공공임대 더 지어 봐야 비어 있다. LH 빈집이 몇 만 호다.\"", "who": "개혁신당·국민의힘", "admit": "맞다. 행복주택 열 채 중 한 채가 6개월 넘게 비어 있고, 1년 넘게 빈 공공임대가 2만 2천 가구, 임대료 손실 5년간 1,670억이다.", "hit": "\"그래서 숫자 경쟁을 그만하자는 겁니다. 청년은 학교·회사 앞 도심에 살고 싶은데 외곽에, 좁게 지었습니다. 공공임대 성적표를 몇 호 지었느냐가 아니라 몇 명을 고시원·반지하에서 꺼냈느냐로 바꿔야 합니다. 그리고 도심은 낡은 공공청사 위에 청년주택을 올리면 됩니다. 그 특별법이 내년 3월 시행입니다.\"", "ev": [{"t": "행복주택 공가율 10.1%, 1년 이상 빈집 22,464가구, 손실 1,670억(SBS Biz 2026.10.6)", "src": [["LH 공공임대 1년 이상 빈집 손실 1670억·행복주택 공가율 10.1%(SBS Biz 2026.10.6)", "https://biz.sbs.co.kr/amp/article/20000338322"]]}, {"t": "노후 공공청사 복합개발 특별법 8.20 통과(노컷 8.21)", "src": [["노후 청사도 주택으로…9·7 후속법안 국회 통과(노컷뉴스 2026.8.21)", "https://nocutnews.co.kr/news/6565911"]]}, {"t": "카드", "src": [["📼 관련 카드 #3277", "#card/3277"]]}]}, {"q": "\"LH 사장도 국감에서 생애최초 대출 더 조이겠다는 생각이 아직 있다고 했다. 민주당 정부는 청년 사다리를 걷어차고 있다.\"", "who": "국민의힘(김은혜 질의 인용)·개혁신당", "admit": "그 발언은 부적절했다. 민주당 복기왕 의원도 국감장에서 그렇게 지적했고 LH 사장도 사과했다.", "hit": "\"저도 같은 생각입니다. 우리 당 의원도 그 자리에서 바로 지적했습니다. 청년·신혼 첫 집은 예외로 둬야 합니다. 다만 대출을 다 풀면 집값이 먼저 오릅니다. 청년한테 필요한 건 빚을 더 낼 권리가 아니라, 빚 안 내고 들어갈 공공의 방입니다.\"", "ev": [{"t": "LH 국감: 이성훈 사장 발언, 김은혜 질의, 복기왕 지적(뉴스핌 2026.10.12)", "src": [["LH 국감: LH 사장 LTV 발언·착공 25.7%(뉴스핌 2026.10.12)", "https://www.newspim.com/news/view/20261012001477"]]}, {"t": "카드", "src": [["📼 관련 카드 #3280", "#card/3280"]]}]}], "parties": [["민주당·정부", "공공이 짓는 집. 119만 호, 보편형 19만, 청년 주거예산 두 배. 약점은 보편형 쏠림과 세입자 대책", [["국토부 주거안정플랜 발표(정책브리핑 2026.9.21)", "https://www.korea.kr/news/policyNewsView.do?newsId=148972316"], ["참여연대 2026.9.30 2027 주거예산 분석", "https://peoplepower21.org/?p=2030086"]], {"pro": "방향이 맞다. 집을 민간에만 맡기지 않고 공공이 직접 짓고, 청년 주거 예산을 9.5조에서 약 18조로 두 배 늘렸다. 2030년까지 미혼 청년 24.3만 호, 2027년 청년 공적주택 10.6만 호를 숫자로 약속했다. 월세지원 소득 기준도 중위 100%로 넓혔다.", "con": "① 119만 호는 3기 신도시 5곳의 8배 물량이라 재원·실현성 의문. ② 보편형(중산층용) 19만에 6.2조가 가는데 저소득층용 통합공공임대 출자는 +5%뿐 — 반지하·고시원 청년이 뒤로 밀릴 수 있다. ③ 전세임대 23만을 빼면 진짜 장기 공공임대는 66.3만. ④ 세입자 61%를 지키는 대책이 약하다. ⑤ 10·15 대출 규제로 2030 실수요 매수가 42.5% 줄었다.", "rebut": "상대(개혁신당): \"숫자만 크고 지어진 집이 없다.\" 상대(진보당): \"보편형은 중산층용, 대기자 2만 5천이 먼저다.\" 김보미 답: 둘 다 맞는 지적이다. 그래서 저는 \"공공이 가진 방부터\" — 기숙사·희망하우징·공실 임대주택처럼 이미 있는 방을 먼저 채우고, 보편형보다 고시원·반지하 청년 순서를 앞세우자고 한다. 민주당이라도 틀린 건 틀렸다고 한다.", "agree": "공공 공급 확대라는 큰 틀은 지킨다. 민간 임대인 인센티브로 가자는 쪽(국민의힘·개혁신당)과는 선을 긋는다."}], ["국민의힘", "재건축초과이익환수 폐지, 반값 전세, 신규 공공임대 30% 청년·신혼, 10·15 철회. \"규제·세금만 있고 공급은 없다\"", [["머니투데이 2026.5.12 국민의힘 지선 1호 공약", "https://www.mt.co.kr/politics/2026/05/12/2026051115314050355"], ["이투데이 2025.10.22 부동산 정상화 특위", "https://www.etoday.co.kr/news/view/2517113"]], {"pro": "공급 부족이라는 진단은 틀리지 않았다. 재건축·재개발을 풀면 서울 도심 공급이 늘 수 있고, 반값 전세·청년 30% 배정은 청년에게 직접 닿는 공약이다. \"규제만 있고 공급은 없다\"는 비판은 10·15 이후 2030 체감과 맞는다.", "con": "① 재초환 폐지·세금 완화는 집 가진 사람과 재건축 조합원에게 먼저 이익이 간다 — 참여연대·주거권네트워크가 \"집주인 공약\"이라고 평가. ② 등록임대 부활은 2018년 다주택자 혜택 논란을 되풀이한다. ③ 서울시 청년안심주택(민간임대 모델)은 4개 단지 296가구 보증금 미반환, 잠실 한 곳 238억 — 민간에 맡긴 청년 주택의 실패 사례. ④ 반값 전세의 재원·방식이 없다.", "rebut": "상대가 \"공급이 없다\"고 치면: \"맞습니다. 그런데 재건축 풀어서 나오는 집은 10억짜리입니다. 연세대 앞 8평 원룸이 5억입니다. 학생이 살 집은 재건축에서 안 나옵니다. 청년안심주택처럼 민간에 맡겼더니 보증금을 못 받았습니다. 공공이 가진 방부터 채우는 게 빠릅니다.\"", "agree": "청년·신혼 30% 배정 같은 청년 몫 명시는 같이 갈 수 있다."}], ["개혁신당", "대출 정상화·민간 공급·실거주의무 폐지(\"전세 4.9만 호\"). 세입자 대책은 거의 없음(참여연대)", [["머니투데이 2026.7.20 이준석 대출규제 비판", "https://www.mt.co.kr/politics/2026/07/20/2026072009394764215"], ["헤럴드경제 2026.6.14 실거주의무 4.9만호", "https://www.heraldk.com/article/2026061423472675526"], ["참여연대·주거권네트워크 2026.5.18 지선 주거공약 평가", "https://peoplepower21.org/stablelife/2023030"]], {"pro": "청년 실수요자를 대출 규제가 골라 때렸다는 지적은 사실이다(2030 주담대 매수 42.5% 감소). 실거주의무 폐지로 전세 4.9만 호가 풀린다는 계산도 숫자로 제시했다. 시장 원리로 말해 젊은 층에게 설득력이 있다.", "con": "① 2025 대선·2026 지선 두 번 연속 \"세입자 대책 거의 없음\"(참여연대) — 청년 대부분이 세입자인데 세입자가 빠져 있다. ② 대출을 풀면 집값이 먼저 오른다. 2021년 경험이다. 돈 빌려 사는 집은 금리 오르면 청년이 먼저 무너진다. ③ 실거주의무 폐지는 분양받은 사람이 안 살고 세 놓게 하는 것 — 갭투자 허용이다. ④ 이준석 전 대표 본인이 폐버스를 \"차량 거주는 노숙\"이라며 비판했지만 대안은 민간 공급뿐이다.", "rebut": "상대(김성열): \"대출 규제가 청년 사다리를 걷어찼다.\" 김보미 답: \"맞습니다. 청년·신혼 예외는 둬야 합니다. 그런데 대출을 다 풀자는 건 답이 아닙니다. 빚으로 올린 집값은 다음 청년이 냅니다. 세입자 대책이 공약에 한 줄도 없다는 참여연대 평가에는 뭐라고 답하시겠습니까?\"", "agree": "청년·신혼 대출 예외라는 한 가지는 같이 말할 수 있다."}], ["진보당", "지역별 장기공공임대 20% 의무화, 임대료 상한·갱신 무제한, 보유세 강화. \"전세임대 23만은 공공임대가 아니다\"", [["참여연대·주거권네트워크 2026.5.18 지선 주거공약 평가", "https://peoplepower21.org/stablelife/2023030"], ["한국사회복지저널 2026.9.28 정태흥 9.21 비판", "https://www.ksw-news.com/news/articleView.html?idxno=3040183"]], {"pro": "세입자 보호가 가장 두텁다. 전세임대 23만을 공공임대로 세지 말라는 지적, 저소득 대기자 2만 5천이 먼저라는 지적은 정확하다. 정의당·진보당 계열 공약이 시민단체 지선 평가에서 상위다. 공공임대 확대에서 김보미와 같은 편이 될 수 있다.", "con": "① 지역별 20%는 수백만 호 — 연도별 재원표가 없다. ② 임대료 상한·갱신 무제한은 2024년 발의 뒤 \"임대 공급이 줄어든다\"는 반론에 철회된 적이 있다. 공급이 줄면 월세가 더 오를 수 있다. ③ 보유세 강화는 세입자에게 전가될 수 있다(종부세 전가 논란). ④ 전국 4석이라 실행 수단이 없다.", "rebut": "상대(박태훈): \"민주당 정부도 결국 중산층용이다.\" 김보미 답: \"순서를 지켜야 한다는 데 동의합니다. 그런데 임대료 상한을 무제한으로 걸면 집주인이 방을 안 내놓습니다. 저는 상한보다 공공이 직접 가진 방을 늘려서 시장 월세를 끌어내리는 쪽입니다. 그리고 20% 목표의 1년치 예산표를 같이 만들어 보시죠.\"", "agree": "공공임대 확대·세입자 보호에서 연대. \"20%\"의 분모가 다르다는 것만 정리해 두기."}], ["조국혁신당", "99년 국민안심아파트(영구 공공임대), 공공임대 매년 1%씩", [["뉴시스 2026.5.13 조국혁신당 99년 아파트", "https://www.newsis.com/view/NISX20260513_0003627476"], ["뉴시스 2026.8.6 조국혁신당 세입자 우선", "https://www.newsis.com/view/NISX20260806_0003738630"]], {"pro": "\"평생 살 수 있는 공공임대\"라는 메시지가 선명하다. 매년 1%씩이라는 속도 목표는 점검이 가능하다.", "con": "① 99년 임대의 운영비·재건축 재원 계산이 없다. ② 12석 정당이고 1순위 의제는 검찰개혁이라 주거 공약의 무게가 작다. ③ 서울 학생 원룸 같은 소형·단기 수요에 대한 답이 아니다.", "rebut": "학생이 물으면: \"영구 임대라는 방향은 좋습니다. 다만 학생에게 필요한 건 99년이 아니라 당장 4년입니다. 기숙사와 희망하우징이 먼저입니다.\"", "agree": ""}]], "hw": [["청년 주거에서 \"무엇을 우선적으로\"에 대한 김보미의 순서 다섯 가지는?", "① 월세 그 자체 ② 공공이 가진 방(기숙사·희망하우징) ③ 안전·통학 ④ 월세 지원 30만 원·관리비 ⑤ 서울과 지방 같이. 한 줄: \"공공이 가진 방부터, 세입자 대책이 곧 청년 대책.\"", [["📼 관련 카드 #3204", "#card/3204"]]], ["9.21 주거안정플랜 숫자 네 개(총량·수도권·보편형·청년 몫)?", "2030년까지 공적주택 119만 호, 수도권 92만(77%), 보편형 공공임대 19만, 미혼 청년 24.3만 호(신혼·육아 32.8만). 2027년 청년 공공임대 10.6만 호. \"118.8만\"이라 쓴 매체도 있지만 정부 발표는 119만.", [["국토부 주거안정플랜 발표(정책브리핑 2026.9.21)", "https://www.korea.kr/news/policyNewsView.do?newsId=148972316"], ["노컷뉴스 2026.8.28 2027 청년예산", "https://nocutnews.co.kr/news/6571021"]]], ["2027년 청년 주거 예산은?", "9.6조→18.5조, 두 배(노컷). 헤럴드는 18.1조. \"약 18조, 두 배\"로 말한다.", [["노컷뉴스 2026.8.28 2027 청년예산", "https://nocutnews.co.kr/news/6571021"], ["헤럴드경제 2026.8.31 국토부 2027 예산", "https://www.heraldk.com/article/2026083120041480854"]]], ["청년월세지원 조건과 2027년 변화, 김보미 입장은?", "월 20만·최대 24개월·소득 중위 60% 이하. 2027년 중위 100%, 차상위 48개월. 금액은 2022년부터 20만 그대로. 김보미는 \"30만 원으로\".", [["비즈워치 청년월세 상시화·확대", "https://news.bizwatch.co.kr/article/real_estate/2026/09/15/0035"], ["📼 관련 카드 #3241", "#card/3241"]]], ["참여연대가 9.21 플랜에서 지적한 숫자 두 개는?", "① 전세임대 23만을 빼면 장기 공공임대 66.3만(연 13.3만) ② 보편형 6.2조 vs 통합공공임대 출자 +5%. 먼저 인정하고 \"순서\"로 넘어간다.", [["참여연대 2026.9.22 주거안정플랜 논평", "https://peoplepower21.org/stablelife/2029728"], ["참여연대 2026.9.30 2027 주거예산 분석", "https://peoplepower21.org/?p=2030086"]]], ["10·15 대책이 청년에게 어떻게 작용했고 어떻게 답하나?", "LTV 70→40%, 한도 6억, 2030 매수 42.5% 감소. \"투기 잡는 건 맞지만 청년 실수요자가 같이 맞았다. 청년·신혼 예외는 해야 한다. 그래도 대출 다 풀면 집값이 먼저 오른다.\"", [["10·15 대책, 2030 주담대 42.5% 감소(헤럴드경제)", "https://www.heraldk.com/article/2025101517300227331"], ["📼 관련 카드 #3234", "#card/3234"]]], ["학생회 근거 보고서의 서울 20대 응답자 수와, 서울 세부이슈 1위는?", "62명. 서울 전체 세부이슈 1위는 재개발·재건축 58.2%, 2위 주거비 지원·공공임대 44.5%. 전남은 전월세 안정 63.0%가 1위 — \"서울은 집값, 지방은 집세\".", [["중앙선관위 「제9회 지방선거 정책이슈 선정을 위한 빅데이터 분석」(핀인사이트, 2026.3)", "https://policy.nec.go.kr/plc/promotion/initUPRPromotionDetail.do?no=89"]]]], "cuts": [{"title": "청년월세지원 월 20만 원, 2022년 이후 5년째 동결 — 2027년 확대안도 금액은 그대로", "what": "2022년 한시사업으로 출발(월 20만 원, 최대 12개월→이후 24개월). 2026.3월 계속사업으로 상시화됐지만 금액은 월 20만 원 유지. 소득기준은 중위소득 60%(1인 월 약 154만 원)로, 2026년 최저임금 주40시간 세전 월급(약 220만 원)을 받는 청년은 탈락. 2027 예산안(2026.8.28): 소득기준 중위 100%(1인 약 273만 원)로 확대, 차상위 이하는 최대 48개월, 예산 1,300억→2,319억 원. 지원 금액은 월 20만 원 그대로.", "attack": "서울 비아파트 평균 월세가 80만 원인데 청년월세지원은 2022년 20만 원에서 한 푼도 안 올랐다. 최저임금 받는 청년도 못 받는 기준을 5년 방치하고 이제 와서 '확대'라 한다.", "defense": "윤 정부가 한시사업으로 끝내려던 것을 2026년 상시화했고, 2027년에는 소득기준을 60%→100%로 올려 대상을 183만→235만 가구로 넓히고 예산도 78% 늘렸다. 금액 인상보다 사각지대 해소가 우선이며, 주거비 부담은 공공임대 10.6만 호 등 공급 확대로 함께 푼다.", "area": "주거", "src": [["비즈워치 2026.09.15 청년월세지원 조건·2027 변경안", "https://news.bizwatch.co.kr/article/real_estate/2026/09/15/0035"], ["헤럴드경제 2026.08.31 주택예산 '44조' 역대 최대…청년 공공임대 10.6만호 푼다", "https://www.heraldk.com/article/2026083120041480854"], ["뉴시스 2025.12.26 국토부 예산 22.8조…청년·신혼·고령자 주거부터(청년월세 계속사업 전환)", "https://mobile.newsis.com/view/NISX20251226_0003455079"]]}, {"title": "6·27 대책으로 청년 버팀목 전세대출 한도 2억→1.5억 등 정책대출 일괄 축소, 디딤돌·버팀목 실행액 18조 급감", "what": "2025.6.27 '가계부채 관리 강화방안'(이재명 정부 첫 대출규제)에서 주택도시기금 정책대출 한도 축소: 버팀목 청년 2억→1.5억, 신혼(수도권) 3억→2.5억, 신생아 3억→2.4억; 디딤돌 생애최초 3억→2.4억, 신혼 4억→3.2억, 신생아 5억→4억. 결과 2025.1~11월 디딤돌·버팀목 실행액 49.7조→32.0조(-17.7조), 신청액 104.5조→54.8조. 2026년 주택구입·전세자금 융자 예산 14.06조→10.30조(-26.7%), 2027년 예산안은 다시 5.28조(-48.7%). 2026.8.13 대책에서 신혼 소득기준(부부 중 1인 7천만 원)만 완화, 한도는 복원되지 않음.", "attack": "취임 3주 만에 청년 전세대출 한도를 5천만 원 깎고, 청년이 가장 많이 쓰는 디딤돌·버팀목 예산을 2년 연속 반토막 냈다. 집값은 올리고 청년 대출만 조인 결과가 실행액 18조 감소다.", "defense": "수도권 집값 급등기에 정책대출이 갭투자·가격 상승 자금으로 흘러가는 것을 막기 위한 총량관리였고, 서민·실수요 한도는 유지했다. 융자 예산 감소분은 공공임대 출자(2.9조→8.3조)로 돌려 '빚내서 사라'가 아니라 '싸게 살 집'을 늘리는 쪽으로 구조를 바꾼 것이며, 2027년 청년 공적주택은 7.1만→10.6만 호다.", "area": "주거", "src": [["금융위원회 2025.06.27 보도자료 「긴급 가계부채 점검회의」 수도권 중심 「가계부채 관리 강화 방안」", "https://files-scs.pstatic.net/2025/06/27/SL9KCtQBVn/250627_(보도자료) 「긴급 가계부채 점검회의」를 개최하여 수도권 중심의 「가계부채 관리 강화 방안」 발표.pdf"], ["헤럴드경제 2026.01.15 [단독] \"대출 문턱 높이더니\" 디딤돌·버팀목 18조 줄었다", "https://www.heraldk.com/article/2026011514300006676"], ["뉴시스 2025.12.26 국토부 예산 22.8조(융자 14조572억→10조3016억)", "https://mobile.newsis.com/view/NISX20251226_0003455079"], ["참여연대 2026.09.30 2027년 공공임대주택 예산안 분석(주택구입·전세자금 10.3조→5.28조)", "https://peoplepower21.org/stablelife/2030086"]]}, {"title": "10·15 대책 LTV 40%: 대환대출 규제 9일 만에 번복, 청년·신혼 LTV 예외는 '검토'만 하고 8·13에서 '규제 유지' 확정", "what": "2025.10.15 서울 전역·경기 12곳 규제지역 지정, LTV 70%→40%, 15억 초과 주담대 한도 6억→4억·25억 초과 2억. 10.16 금융위가 대환대출도 LTV 40% 적용이라 밝혀 갈아타기 막힘→10.24 '증액 없는 대환은 기존 LTV 적용'으로 번복(추경호 '9일 만에 70→40→70'). 서울 아파트 평균 12.4억 기준 자기자금 7.4억 필요, 30대 가구 평균 순자산 2.54억(국회입법조사처 2025.11). 정부는 2025.10 '청년·신혼 주담대 LTV는 유지'라고만 했고, 2026.7 금융위가 청년·신혼·생애최초 총량 예외·LTV 우대를 검토했으나 2026.8.13 이억원 금융위원장은 'LTV·DSR·주담대 한도 등 핵심 규제는 일관 유지'로 확정, 청년 LTV 예외는 채택되지 않음.", "attack": "서울 집 사려면 현금 7억 들고 오라는 LTV 40%를 1년 넘게 유지하면서 청년·신혼 예외는 '검토'만 네 번 했다. 대환대출은 9일 만에 번복할 수 있었는데 청년 예외는 왜 안 되나.", "defense": "고가주택 과열을 잡아야 중장기적으로 청년의 진입 기회가 열린다. 청년 LTV를 풀면 공급이 따라오지 못한 상태에서 집값만 올라 청년 피해가 더 커진다. 대신 8·13에서 장래소득 반영 의무화, 신혼 결혼페널티 해소, 청년미래보금자리론(LTV 80%), 총량 목표 1.5%→3% 상향으로 실수요 '핀셋' 보완을 했고, 대환대출 번복은 실수요 민원을 즉시 반영한 결과다.", "area": "주거", "src": [["헤럴드경제 2025.10.24 금융위 '대출 갈아타기' 푼다…규제지역 대환대출 LTV 다시 70%로", "https://www.heraldk.com/article/2025102403122431471"], ["CEO스코어데일리 2025.10.27 \"LTV 번복으로 시장 혼란…실수요자 내집 마련 막혔다\"(정무위 종감)", "https://ceoscoredaily.com/page/view/2025102716074068140"], ["더팩트 2025.11.27 서민 주거 안정 목표라더니…부동산 대책, 신혼·청년층 발목(입법조사처 보고서)", "https://news.tf.co.kr/read/economy/2266417.htm"], ["아이뉴스24 2026.07.26 실수요자 총량 예외 검토", "https://www.inews24.com/view/1988835"], ["세정신문 2026.08.13 정부 \"LTV·DSR, 주담대 대출한도 등 대출규제 일관되게 유지\"", "https://taxtimes.co.kr/mobile/article.html?no=276389"]]}, {"title": "청년미래보금자리론 '4억 이하 비아파트' 한정 — 서울 25개 구 중 16곳(64%) 빌라 평균가가 기준 초과", "what": "2026.8.13 대책으로 신설, 2027.1월 출시 예정(2027 예산 597억 원). 대상: 만 39세 이하 생애최초, 연소득 7천만 원 이하, 4억 원·전용 85㎡ 이하 비아파트(빌라·오피스텔), LTV 80%. 직방 분석(2026.7): 서울 연립·다세대 평균 매매가 4억3,233만 원(전년 대비 +11.6%), 4억 이하 자치구는 9곳(도봉·강서·강북·구로·금천·은평·노원·관악·중랑)으로 1년 전 14곳에서 5곳 감소. 아파트 제외와 '만 39세' 컷오프에 형평성 비판, 전세사기 많은 빌라를 청년에게 떠넘긴다는 반발('폐버스 다음은 빌라냐').", "attack": "아파트는 LTV 40%로 막고 청년에겐 '4억 이하 빌라는 80%까지 빌려줄게'라 한다. 전세사기 터진 빌라를 청년에게 땡처리하는 정책이고, 그 4억 기준조차 서울 3분의 2가 못 맞춘다.", "defense": "서울 비아파트 평균 월세 80만 원 수준의 원리금으로 '월세→내 집' 사다리를 놓는 상품이며, 이후 아파트로 갈아탈 때 생애최초 주담대 자격을 유지해 준다. 아파트는 디딤돌 등 기존 수단으로 구입 가능하고, 비아파트 수요를 살려 공급 다변화·빌라 시장 정상화에도 기여한다(금융위).", "area": "주거", "src": [["헤럴드경제 2026.08.20 '4억 커트라인' 청년대출, 서울 빌라 64% '불가'", "https://www.heraldk.com/article/2026082019370493785"], ["데일리안 2026.08.16 '결혼 페널티' 없앴다는데…청년 금융 핀셋지원, 시장선 '반신반의'", "https://www.dailian.co.kr/news/view2/1678587"], ["SBS Biz 2026.08 '폐버스 다음은 빌라냐'…청년한테 빌라 땡처리? 분노", "https://biz.sbs.co.kr/amp/article/20000328928"]]}, {"title": "9·21 주거안정플랜 '보편형 공공임대' 신설 — 2027년 영구·국민·행복주택 신규 예산 0, 저소득 대기자 2.5만 명", "what": "2026.9.21 국토부 주거안정플랜: 2030년까지 공적주택 119만 호(공공임대 89.3만=건설 35만·매입 31.3만·전세임대 23만). 참여연대: 전세임대 23만 호는 민간임대 보증금 지원이라 공공임대로 보기 어렵고, 이를 빼면 실질 66.3만 호(연 13.3만). 중위소득 150% 초과 청년·신혼용 '보편형'을 신설해 물량 50% 우선배정. 2027 예산안(참여연대 9.30 분석): 공공임대 21.3조→29.9조 중 보편형 6.2조 신규(청년 2만 호 3.83조 포함), 보편형 제외 실질 증가 2.4조. 영구임대 출자(40.9억)·국민임대 출융자(1,751억)·행복주택 출융자(1,989억)는 모두 0으로 편성(-100%). 영구·국민임대 1년 이상 대기 2만5천 명. 통합공공임대 융자는 +71%.", "attack": "저소득 청년이 들어가던 행복주택·국민임대 예산은 0원으로 지우고, 중위소득 150% 넘는 청년에게 주택도시기금으로 '보편형' 임대를 짓겠다는 게 서민 주거안정인가. 전세임대 23만 호까지 공급 숫자에 얹어 119만 호로 부풀렸다.", "defense": "행복주택·국민·영구임대는 2022년부터 '통합공공임대'로 유형이 통합돼 신규 편성이 0인 것이며, 통합공공임대 융자는 71% 늘었다. 30대 청년 중위소득이 4,100만 원으로 통합공공임대 기준을 겨우 넘는 맞벌이 청년·신혼이 공공임대 사각지대였고, 보편형은 이들을 위한 것이다. 전세임대도 입주자 입장에선 공공이 보증금을 대는 공공임대이며, 공공임대 예산은 40% 증액됐다.", "area": "주거", "src": [["참여연대 2026.09.22 9·21 주거안정플랜 논평", "https://peoplepower21.org/stablelife/2029728"], ["참여연대 2026.09.30 2027년 공공임대주택 예산안, 고소득층을 위한 청년·신혼부부 대상 보편형 임대주택 확대에 편중돼", "https://peoplepower21.org/stablelife/2030086"], ["MTN 2026.09.22 \"정부 주거안정플랜, 수요층 넓힌 점 긍정적…실효성은 회의적\"", "https://news.mtn.co.kr/news-detail/2026092215285210316"], ["헤럴드경제 2026.08.31 2027 주택예산 44조(보편형 6.2조·청년 2만호 3.83조)", "https://www.heraldk.com/article/2026083120041480854"]]}]}, {"id": "a2", "rank": 2, "title": "의제 2 · 청년 일자리", "q": "열심히 준비해도 취업이 어려운 사회, 청년 일자리 정책은 어디서부터?", "why": "학생회가 2순위로 둔 이유: 같은 설문에서 서울 20대의 경제/일자리 56.5%(2위). 서울 전체 세부이슈는 일자리·창업지원 67.4%가 1위.", "brief": "학생회 발제문이 든 것: \"첫 일자리까지 18.4개월(고용정보원)\", 고등교육 이수율 OECD 1위인데 대졸 고용률 80% vs OECD 87%. 두 숫자 모두 바로잡을 것이 있다(아래 ②). 질문이 \"어디서부터\"이니 답은 \"첫 직장 문턱부터\".", "topics": [{"id": "first", "rank": 1, "title": "첫 직장 문턱부터 — 경력이라는 보증금", "tag": "학생회 발제 · 어디서부터", "say": [{"t": "첫 직장 문턱부터입니다. 기업이 신입 대신 경력을 찾는 건 신입을 가르치는 비용을 혼자 지기 싫어서입니다. 그 비용을 나라가 나눠 지면 됩니다. 그게 제가 말하는 청년취업보장제입니다.", "ev": [{"t": "500대 기업 61.1% 상반기 신규채용 계획 없거나 미정(한경협). 국가데이터처도 경력직 선호·수시채용을 원인으로 지목", "src": [["2026년 5월 청년층 부가조사(국가데이터처, KDI 요약)", "https://eiec.kdi.re.kr/policy/materialView.do?num=284575"]]}, {"t": "\"경력이 없어서 일을 못 하고, 일을 못 해서 경력이 없다\" — 신동아 답변(2805)", "src": [["📼 관련 카드 #2805", "#card/2805"]]}]}, {"t": "저는 청년의 취업을 국가가 책임지는 \"국가청년취업보장제\"를 도입해야 한다고 말해 왔습니다. — 당대표 후보 시절 머니투데이 답변 그대로.", "ev": [{"t": "머니투데이 서면 답변(2413): \"청년의 취업을 국가가 책임지는 국가청년취업보장제를 민주당의 핵심 정책으로 도입해야\"", "src": [["📼 관련 카드 #2413", "#card/2413"]]}, {"t": "오스트리아는 25세까지 견습 자리를 보장(2024년 11,713명, 약 7,140만 유로). 전체 소요 예산은 산출한 숫자가 없으니 지어내지 말 것", "src": [["오스트리아 훈련 보장 2024년 1만1,713명(오스트리아 사회부)", "https://www.sozialministerium.gv.at/Themen/Arbeit/Arbeitsmarkt/Arbeitsmarktfoerderungen/Jugendliche-und-junge-Erwachsene.html"], ["📼 관련 카드 #3236", "#card/3236"]]}]}, {"t": "숫자가 말해 줍니다. 15세부터 29세까지 청년 취업자는 지난달까지 47개월 연속 줄었습니다. 금융위기 이후 가장 깁니다. 졸업하고 한 번이라도 일해 본 청년은 역대 최저입니다.", "ev": [{"t": "2026년 9월 고용동향(10.16): 15~29세 취업자 −14만 7천, 47개월 연속 감소(2022.11~). 고용률 44.0%(−1.1%p) 29개월 연속 하락. 실업률 5.4%", "src": [["2026년 9월 고용동향, 청년 취업자 47개월 감소(스마트투데이)", "https://www.smarttoday.co.kr/ko-kr/articles/112773"], ["국가데이터처 9월 고용동향(KDI)", "https://eiec.kdi.re.kr/policy/materialView.do?num=288191"]]}, {"t": "졸업 후 취업 경험 84.8%(2004년 이후 최저). 첫 취업 소요 11.2개월. 미취업 124.3만 중 1년 이상 60.5만(48.6%)", "src": [["2026년 5월 청년층 부가조사(국가데이터처, KDI 요약)", "https://eiec.kdi.re.kr/policy/materialView.do?num=284575"], ["졸업 후 1년 이상 미취업 48.6%(SBS Biz 2026.7.23)", "https://biz.sbs.co.kr/amp/article/20000324195"]]}, {"t": "15~29세 '쉬었음' 36.4만. 2030 '쉬었음' 65.1만(2026.7)", "src": [["국가데이터처 9월 고용동향(KDI)", "https://eiec.kdi.re.kr/policy/materialView.do?num=288191"], ["SBS Biz 2026.9.1 청년 일자리 예산", "https://biz.sbs.co.kr/amp/article/20000331977"]]}]}]}, {"id": "nums", "rank": 2, "title": "학생회 발제문 숫자 바로잡기 — 18.4개월, 80 vs 87", "tag": "학생회 발제 · 숫자", "say": [{"t": "학생회 자료에 18.4개월이라는 숫자가 나왔는데, 찾아보니 그건 첫 직장에서 버티는 평균 기간이었습니다. 어렵게 들어간 첫 직장을 열에 일곱이 1년 반 만에 그만둡니다. 들어가기도 어렵고, 버티기도 어렵습니다.", "ev": [{"t": "국회예산정책처: 첫 직장을 그만둔 청년 70.7%, 평균 근속 18.4개월. 그만둔 이유 1위 근로여건 불만 44.4%, 전공 불일치 7.2%", "src": [["첫 직장 퇴사 70.7%·근속 18.4개월(헤럴드경제 2026.5.4)", "https://www.heraldk.com/article/2026050404000057847"], ["오마이뉴스 2026.8.28 박태훈의 청년 오늘 3화", "https://www.ohmynews.com/NWS_Web/View/at_pg.aspx?CNTN_CD=A0003262261"]]}, {"t": "취업 소요기간은 국가데이터처 11.2개월, 고용정보원 청년패널 22.7개월(비수도권 24.6 vs 수도권 21.2)", "src": [["2026년 5월 청년층 부가조사(국가데이터처, KDI 요약)", "https://eiec.kdi.re.kr/policy/materialView.do?num=284575"], ["고용정보원 청년패널, 비수도권 24.6개월(쿠키뉴스)", "https://www.kukinews.com/article/view/kuk202511270015"]]}, {"t": "학생 체면: \"제가 찾아보니 이런 뜻이었습니다\"로만. 카드 3273", "src": [["📼 관련 카드 #3273", "#card/3273"]]}]}, {"t": "여러분이 공부를 덜 해서가 아닙니다. 우리나라 25~34세 대학 이수율은 71%로 OECD 1위인데, 대졸 고용률은 80%로 OECD 평균 86%보다 낮습니다. 이 사회가 받는 보증금이 너무 비싸서입니다.", "ev": [{"t": "OECD 교육지표 2026: 25~34세 고등교육 이수율 71.1% 1위. 25~64세 대졸 고용률 80.1% vs OECD 86.0%. 발제문의 \"87%\"는 옛 숫자", "src": [["OECD 교육지표 2026(파이낸셜뉴스 2026.9.29)", "https://www.fnnews.com/news/202609291351196534"]]}]}]}, {"id": "quality", "rank": 3, "title": "첫 일자리의 질 — 첫 단추가 평생", "tag": "김보미 논점", "say": [{"t": "첫 단추가 평생을 좌우합니다. 계약직으로 시작한 청년 셋 중 하나는 지금도 계약직입니다. 정규직으로 시작한 청년은 다섯 중 하나도 안 됩니다. 그래서 일자리 숫자만큼 첫 일자리의 질이 중요합니다.", "ev": [{"t": "국회예산정책처 「청년층 첫 직장 현황」: 계약직 출발 34.5%는 현재도 계약직, 정규직 출발 18.7%", "src": [["국회예산정책처 「청년층 첫 직장 현황」(2026.5.2 보도)", "https://v.daum.net/v/20260502202635766"]]}, {"t": "20대 임금 대기업 351만 vs 중소기업 230만 원", "src": [["아이뉴스24 2026.8.28 청년 일자리 대책 분석", "https://www.inews24.com/view/1999625"]]}]}, {"t": "청년 정책의 성적표는 몇 명한테 얼마 줬냐가 아니라, 3년 뒤 그 청년이 어디서 무엇을 하고 있느냐여야 합니다.", "ev": [{"t": "같은 말: 신동아(2804), 이맘때 Q8(2911)", "src": [["📼 관련 카드 #2804", "#card/2804"], ["📼 관련 카드 #2911", "#card/2911"]]}]}, {"t": "정권 바뀔 때마다 청년 정책 이름이 바뀝니다. 내일채움공제는 생겼다 없어졌고, 도약계좌는 미래적금으로 바뀌었습니다. 청년은 정책을 믿고 계획을 짜야 하는데, 나라가 계획을 자꾸 바꿉니다.", "ev": [{"t": "청년도약계좌 해지율 15.3%. 청년자산형성 사업 6개 부처 10개 중복(국회예산정책처 2025.11.14)", "src": [["청년도약계좌 해지율 15.3%(한경비즈니스)", "https://magazine.hankyung.com/business/article/202508051953b"], ["국회예산정책처 청년자산형성 지원사업 평가(2025.11.14)", "https://www.nabo.go.kr/ko/notice/releasesView.do?idx=8981"]]}]}]}, {"id": "region", "rank": 4, "title": "지방은 사다리가 통째로 없다 — 세 사다리", "tag": "김보미만 할 수 있는 말", "say": [{"t": "지방은 사다리가 통째로 없습니다. 배울 곳, 일할 곳, 정착할 곳. 이 세 사다리를 지역 안에 놓아야 합니다. 공장을 지어도 사람이 없으면 수도권에서 데려오고, 지역 청년은 구경꾼이 됩니다. 호남 청년이 공무원 시험이 아니라 AI와 반도체에서 꿈을 키울 수 있어야 합니다.", "ev": [{"t": "같은 말: 이맘때 Q12(2915), KBC Q10(1611), 무등일보(1226)", "src": [["📼 관련 카드 #2915", "#card/2915"], ["📼 관련 카드 #1611", "#card/1611"]]}, {"t": "비수도권 청년 취업 소요 24.6개월 vs 수도권 21.2개월(고용정보원 청년패널)", "src": [["고용정보원 청년패널, 비수도권 24.6개월(쿠키뉴스)", "https://www.kukinews.com/article/view/kuk202511270015"]]}, {"t": "지방국립대 2027 신입생 등록금 전액(2,130억). 반론: 수험생 63.9% \"그래도 안 간다\". 연세대 등록금 2.6% 인상", "src": [["세계일보 2026.8.28 지방국립대 등록금", "https://www.segye.com/newsView/20260828512116"], ["연세대 등록금 2.6% 인상(더팩트 2026.2.8)", "https://news.tf.co.kr/read/life/2290752.htm"]]}]}, {"t": "군대도 첫 직장이 될 수 있습니다. 월급을 제대로 받고 첨단 기술을 배우고 전역할 때 경력과 가산점을 들고나오는, 내가 선택해서 가는 첫 직장으로 군대를 바꿔야 합니다.", "ev": [{"t": "정치시그널 돌발 6(3020) 답변 그대로. 모병제 카드 3248", "src": [["📼 관련 카드 #3020", "#card/3020"], ["📼 관련 카드 #3248", "#card/3248"]]}]}]}, {"id": "ai", "rank": 5, "title": "AI — 위협인가 기회인가, 학생들에게 되묻기", "tag": "학생 질문 예상", "say": [{"t": "AI가 여러분에게 위협입니까, 기회입니까? 정말 궁금해서 묻는 겁니다. 저한테 AI는 기회입니다. 김보미365와 나라살림 돋보기를 혼자 만들었습니다. 그런데 그 일을 전에는 개발자 몇 명, 신입 몇 명이 몇 달 하던 일입니다. 그 자리가 청년이 첫 경력을 쌓던 일자리였습니다. AI가 다 해 주니 경력을 쌓을 일자리 자체가 없어집니다.", "ev": [{"t": "전체 원고는 카드 3210. 고교생 150만 천체 발견(Matteo Paz), 스탠퍼드 22~25세 AI 노출 직종 고용 13% 감소, 한국은행 341만 개 대체 가능", "src": [["📼 관련 카드 #3210", "#card/3210"]]}, {"t": "3년간 줄어든 청년 일자리 21.1만의 98.6%가 AI 노출 업종(아이뉴스24 8.28)", "src": [["아이뉴스24 2026.8.28 청년 일자리 대책 분석", "https://www.inews24.com/view/1999625"]]}, {"t": "\"AI 대전환으로 사라질 청년 일자리는 무엇인지…\" 신동아 Q6(2806) 원문", "src": [["📼 관련 카드 #2806", "#card/2806"]]}]}]}], "gov": [{"t": "정부의 틀: 2027년 청년 예산 43.3조(+53.5%, 28.2조에서), 고용노동부 청년 일자리 3.3조(+7천억). 세 갈래 — ① 첫 취업 못 한 청년에게 상담·일경험·수당(K-유스개런티) ② 청년 뽑는 기업에 장려금(도약장려금 10.5만→13만 명, 비수도권 최대 1,800만) ③ 저축에 나라가 얹어 주기(청년미래적금 1.7조).", "ev": [{"t": "노컷뉴스 8.28 2027 청년예산, 고용부 2027 예산", "src": [["노컷뉴스 2026.8.28 2027 청년예산", "https://nocutnews.co.kr/news/6571021"], ["고용노동부 2027 예산 보도자료(KDI)", "https://eiec.kdi.re.kr/policy/materialView.do?num=287616"], ["뉴스서울 2026.9.4 고용부 2027 예산", "https://newsseoul.co.kr/news/view/1065583215213139"]]}, {"t": "K-유스개런티 3,793억·16만 명은 매체마다 달라 비교에 쓰지 말 것(SBS Biz \"세부 미정\")", "src": [["K-유스개런티 3,793억·16만 명(뉴스서울 2026.9.4)", "https://newsseoul.co.kr/news/view/1065583215213139"], ["SBS Biz 2026.9.1 청년 일자리 예산", "https://biz.sbs.co.kr/amp/article/20000331977"]]}, {"t": "일경험 공공 2만·민간 4.5만, 인턴학기 6만, 첨단 직업훈련 12만. 2030 목표 전문인력 30만·일자리 20만·창업 10만", "src": [["SBS Biz 2026.9.1 청년 일자리 예산", "https://biz.sbs.co.kr/amp/article/20000331977"], ["아이뉴스24 2026.8.28 청년 일자리 대책 분석", "https://www.inews24.com/view/1999625"]]}]}, {"t": "노동 쟁점: 정년연장 중재안(2029년 61세→2037년 65세, 처리 목표 세 번 연기), 2027 최저임금 10,700원(+3.7%), 노란봉투법 2026.3.10 시행, 주4.5일은 법제화 아닌 지원(시범 324억), 청년고용촉진특별법 청년 연령 34세(2026.9.8).", "ev": [{"t": "정년연장 지연·KDI 0.2명·한국은행 0.4~1.5명", "src": [["주간경향 2026.8.29 정년연장 지연", "https://weekly.khan.co.kr/article/202608291624001"], ["헤럴드경제 2026.6.21 KDI 정년연장 분석", "https://www.heraldk.com/article/2026062118153278308"], ["머니투데이 2025.11.23 한은·KDI 정년 효과", "https://www.mt.co.kr/economy/2025/11/23/2025112113575318203"]]}, {"t": "최저임금 10,700원, 노란봉투법 시행 후 실제 교섭 10곳", "src": [["세계일보 2026.7.15 2027 최저임금", "https://www.segye.com/newsView/20260715519984"], ["세계일보 2026.6.22 노란봉투법 시행 후", "https://www.segye.com/newsView/20260622507507"]]}, {"t": "청년고용촉진특별법 개정, 공공기관 청년 의무고용 3% 일몰(2026.12.31) 연장 여부 미확인", "src": [["청년고용촉진특별법 개정 국회 통과(SBS Biz)", "https://biz.sbs.co.kr/amp/article/20000291545"], ["헤럴드경제 2026.4.28 윤준병 청년의무고용 7%", "https://www.heraldk.com/article/2026042815230055750"]]}]}, {"t": "비판: 공공 일자리 10만은 한시직, 민간 10만은 보조금 유도(사중손실), 임금격차 구조는 안 다룸. 도약장려금은 2025년 726억 미집행·111억 인건비 전용인데 단가를 2.5배 올림. 자발적 이직 구직급여는 고용보험기금 적자 속 월 2천억. 정부 반론: 공공기관 상반기 신규채용 12,592명(+약 2천), \"첫 경력이 가장 확실한 투자\".", "ev": [{"t": "아이뉴스24 8.28, 경기신문 7.27(예산정책처 결산), 세계일보 사설", "src": [["아이뉴스24 2026.8.28 청년 일자리 대책 분석", "https://www.inews24.com/view/1999625"], ["경기신문 2026.7.27 예산정책처 도약장려금 결산", "https://kgnews.co.kr/mobile/article.html?no=905336"]]}]}, {"t": "김보미 공약과의 차이: 정부 K-유스개런티는 상담·연결·일경험·수당까지. 청년취업보장제는 나라가 첫 고용의 인건비·교육비를 대고 기업·공공기관이 실제 일과 멘토링을 맡는, 경력으로 쳐 주는 첫 일자리. \"차이는 끝이 어디냐.\"", "ev": [{"t": "카드 3236·3216", "src": [["📼 관련 카드 #3236", "#card/3236"], ["📼 관련 카드 #3216", "#card/3216"]]}]}], "ask": [{"q": "\"정년 연장하면 청년 일자리가 준다. 청년 자리를 586이 깔고 앉는다.\"", "who": "개혁신당 김성열", "admit": "걱정은 맞다. 한국은행 0.4~1.5명, KDI 0.2명 감소 추정.", "hit": "\"그 걱정은 저도 합니다. 그래서 정년 연장은 청년 신규채용을 얼마나 보장할지부터 정하고 가야 합니다(조건부). 정면 부정하지 않는다. 최종 입장은 김보미가 정할 것.\"", "ev": [{"t": "한은·KDI 추정", "src": [["머니투데이 2025.11.23 한은·KDI 정년 효과", "https://www.mt.co.kr/economy/2025/11/23/2025112113575318203"], ["헤럴드경제 2026.6.21 KDI 정년연장 분석", "https://www.heraldk.com/article/2026062118153278308"]]}, {"t": "카드 3217(미확정)", "src": [["📼 관련 카드 #3217", "#card/3217"]]}]}, {"q": "\"최저임금을 지역별로 차등하면 지방 일자리가 는다.\"", "who": "개혁신당", "admit": "지방 일자리를 걱정하는 건 같다.", "hit": "\"하한이 7,020원이 됩니다. 강진 청년이 서울 청년과 같은 일 하고 30% 덜 받으면 강진에 남습니까, 떠납니까? 지방 살리자면서 지방 임금을 깎는 건 앞뒤가 안 맞습니다. 텍사스·캐나다 근거는 팩트체크에서 사실 아님으로 나왔습니다.\"", "ev": [{"t": "노컷 팩트체크 2025.5.28", "src": [["노컷뉴스 2025.5.28 최저임금 차등 팩트체크", "https://www.nocutnews.co.kr/news/6346286"]]}, {"t": "카드", "src": [["📼 관련 카드 #3215", "#card/3215"]]}]}, {"q": "\"청년 예산 43조, 빚으로 미래를 당겨 쓴다. 추경은 불난 집에 기름.\"", "who": "개혁신당 김성열", "admit": "빚 걱정은 맞다. 도약장려금 726억 못 쓴 것도 틀렸다.", "hit": "\"그래서 돈 쓰는 내역부터 10원까지 공개하자는 겁니다. 강진에서 군민이 예산을 보기 시작하니 낭비예산 108억이 깎였습니다. 안 쓰는 게 답이 아니라 첫 경력을 보장하는 데 쓰자는 겁니다.\"", "ev": [{"t": "김성열 4.9 모두발언, 예산정책처 결산", "src": [["김성열 최고위원 모두발언 — 추경 비판(개혁신당 2026.4.9)", "https://reformparty.kr/news/press/665-press-764"], ["경기신문 2026.7.27 예산정책처 도약장려금 결산", "https://kgnews.co.kr/mobile/article.html?no=905336"]]}, {"t": "카드", "src": [["📼 관련 카드 #3282", "#card/3282"]]}]}, {"q": "\"공공 일자리 38만 개, 졸업실업급여 24만 — 국가가 책임져야.\"", "who": "진보당 박태훈", "admit": "국가가 책임지자는 방향은 같은 편.", "hit": "\"다만 38만 개가 또 한시직이면 경력이 안 됩니다. 저는 숫자보다 하나하나가 경력으로 인정되는 첫 일자리를 보장하자는 쪽입니다. 38만 개 1년치 예산을 같이 계산해 보시죠.\"", "ev": [{"t": "진보당 경기도당 10.8 논평", "src": [["인천일보 2026.10.8 진보당 경기도당 청년 논평", "https://www.incheonilbo.com/news/articleView.html?idxno=1333767"]]}, {"t": "카드", "src": [["📼 관련 카드 #3225", "#card/3225"]]}]}, {"q": "\"규제 때문에 기업이 못 뽑는다. 노란봉투법·주52시간을 풀어야.\"", "who": "국민의힘 논리(학생 질문 가능)", "admit": "기업이 안 뽑으면 일자리가 없다는 건 맞다.", "hit": "\"그럼 규제 풀면 신입을 뽑습니까? 기업은 규제가 아니라 신입 가르치는 비용 때문에 경력을 찾습니다. 그 비용을 나라가 나눠 지자는 게 청년취업보장제입니다. 근로시간 늘려 생긴 일자리에서 첫 직장 열에 일곱이 1년 반 만에 나갑니다. 이유 1위가 근로여건입니다.\"", "ev": [{"t": "노란봉투법 시행 후 실제 교섭 10곳", "src": [["세계일보 2026.6.22 노란봉투법 시행 후", "https://www.segye.com/newsView/20260622507507"]]}, {"t": "퇴사 이유 1위 근로여건 44.4%", "src": [["첫 직장 퇴사 70.7%·근속 18.4개월(헤럴드경제 2026.5.4)", "https://www.heraldk.com/article/2026050404000057847"]]}]}, {"q": "\"청년이 눈이 높다. 중소기업은 사람이 없다.\"", "who": "학생·보수", "admit": "중소기업 구인난은 사실이다.", "hit": "\"첫 직장을 그만두는 이유 1위는 근로여건 불만 44.4%이지 전공 불일치 7.2%가 아닙니다. 20대 임금이 대기업 351만, 중소기업 230만입니다. 눈이 높은 게 아니라 조건이 견딜 만하지 않은 겁니다. 박태훈 위원장도 같은 숫자를 씁니다.\"", "ev": [{"t": "예산정책처·박태훈 칼럼", "src": [["첫 직장 퇴사 70.7%·근속 18.4개월(헤럴드경제 2026.5.4)", "https://www.heraldk.com/article/2026050404000057847"], ["오마이뉴스 2026.8.28 박태훈의 청년 오늘 3화", "https://www.ohmynews.com/NWS_Web/View/at_pg.aspx?CNTN_CD=A0003262261"]]}, {"t": "임금 격차", "src": [["아이뉴스24 2026.8.28 청년 일자리 대책 분석", "https://www.inews24.com/view/1999625"]]}]}, {"q": "\"15~34세로 넓히면 고용률 56%다. 통계가 나쁘지 않다.\"", "who": "정부 옹호 논리", "admit": "기준을 넓히면 그렇게 보인다.", "hit": "\"15~29세는 44.0%로 29개월째 떨어지고 있습니다. 기준을 바꿔서 좋아 보이게 하는 건 착시입니다. 저는 민주당이지만 그렇게 말하지 않겠습니다.\"", "ev": [{"t": "9월 고용동향, 15~34세 56.1% 논란", "src": [["국가데이터처 9월 고용동향(KDI)", "https://eiec.kdi.re.kr/policy/materialView.do?num=288191"], ["9월 고용동향·청년 15~34세 통계(아이뉴스24)", "https://www.inews24.com/view/2015634"]]}]}, {"q": "\"정권 바뀔 때마다 청년 정책 이름이 바뀐다. 믿을 수 있나.\"", "who": "학생", "admit": "맞다. 내일채움공제→없어짐, 도약계좌→미래적금.", "hit": "\"예산정책처도 10개 사업이 겹친다고 했습니다. 하나로 합치고 정권이 바뀌어도 가게 법에 박아야 합니다. 청년은 정책을 믿고 인생 계획을 짭니다.\"", "ev": [{"t": "도약계좌 해지율, 10개 사업 중복", "src": [["청년도약계좌 해지율 15.3%(한경비즈니스)", "https://magazine.hankyung.com/business/article/202508051953b"], ["국회예산정책처 청년자산형성 지원사업 평가(2025.11.14)", "https://www.nabo.go.kr/ko/notice/releasesView.do?idx=8981"]]}, {"t": "카드", "src": [["📼 관련 카드 #3243", "#card/3243"]]}]}, {"q": "\"여당 의원들도 국감에서 인정했다. 청년 고용률 28개월 연속 하락, 취업자 47개월 감소. 7조 넘게 쓰고 고용률은 떨어졌다. 민주당 정부의 실패다.\"", "who": "개혁신당 김성열·국민의힘", "admit": "숫자는 맞다. 우리 당 박정·안호영·정태호 의원이 국감에서 직접 낸 숫자다. 고용률 하락은 2024년부터 이어진 흐름이기도 하다.", "hit": "\"맞습니다. 우리 당 의원들이 먼저 짚었습니다. 그게 민주당이 살아 있다는 증거라고 생각합니다. 돈을 안 쓴 게 문제가 아니라 그 돈이 상담·수당에서 끝나고 첫 직장까지 안 닿은 게 문제입니다. 그래서 끝을 바꾸자는 겁니다. 첫 경력을 나라가 보장하는 청년취업보장제입니다. 그런데 개혁신당 안처럼 재정을 줄이면 그 첫 직장은 누가 만듭니까?\"", "ev": [{"t": "박정 의원 국감: 3년 7조4600억, 고용률 46.1→44.1%", "src": [["[2026국감] 청년일자리 3년 7조4600억…고용률 46.1→44.1%(스트레이트뉴스 2026.10.13)", "https://www.straightnews.co.kr/news/articleView.html?idxno=313000"]]}, {"t": "안호영 의원 국감: 28개월 연속 하락, 스펙 12.7개", "src": [["노동부 국감: 청년고용률 28개월 하락·노란봉투법 1229곳 중 5곳(뉴스핌 2026.10.13)", "https://www.newspim.com/news/view/20261013001259"]]}, {"t": "카드", "src": [["📼 관련 카드 #3280", "#card/3280"]]}]}, {"q": "\"노란봉투법 시행 7개월, 1,229개 노조가 교섭을 요구했는데 합의는 5곳뿐이다. 기업이 겁나서 청년을 안 뽑는다.\"", "who": "국민의힘(이종배 의원 국감 질의 인용)", "admit": "교섭이 늘고 합의가 적은 건 숫자 그대로다.", "hit": "\"노동부 장관이 국감에서 답했듯이 걱정했던 교섭 쓰나미는 없었습니다. 그리고 청년 일자리가 줄어든 건 법 시행 전인 2022년 11월부터입니다. 4년 동안 사라진 청년 일자리의 94%는 AI 업종에서 나왔다는 한국은행 분석도 있습니다. 노조 탓으로 돌리면 진짜 원인을 놓칩니다.\"", "ev": [{"t": "노동부 국감: 이종배 질의, 김영훈 장관 답변(뉴스핌 2026.10.13)", "src": [["노동부 국감: 청년고용률 28개월 하락·노란봉투법 1229곳 중 5곳(뉴스핌 2026.10.13)", "https://www.newspim.com/news/view/20261013001259"]]}, {"t": "박정 의원 국감: 한국은행 94% AI 업종(아주경제 10.13)", "src": [["[2026국감] 청년일자리 3년 7조4600억…고용률 46.1→44.1%(스트레이트뉴스 2026.10.13)", "https://www.straightnews.co.kr/news/articleView.html?idxno=313000"]]}]}], "parties": [["민주당·정부", "첫 경력 지원(K-유스개런티·장려금·일경험), 정년연장 단계안, 노란봉투법 시행, 주4.5일 시범", [["뉴스서울 2026.9.4 고용부 2027 예산", "https://newsseoul.co.kr/news/view/1065583215213139"], ["주간경향 2026.8.29 정년연장 지연", "https://weekly.khan.co.kr/article/202608291624001"]], {"pro": "\"첫 경력이 가장 확실한 투자\"라는 진단이 김보미와 같다. 청년 예산 43.3조(+53.5%), 고용부 청년 일자리 3.3조, 도약장려금 단가를 비수도권 최대 1,800만 원으로 올려 지방 청년을 챙겼다. 공공기관 상반기 신규채용도 늘렸다.", "con": "① 공공 일자리 10만은 한시직, 민간 10만은 보조금 유도라 보조금 끊기면 사라진다(사중손실). ② 도약장려금 2025년 726억 미집행, 111억 인건비 전용 — 못 쓴 돈을 더 올렸다. ③ 자발적 이직 구직급여는 고용보험기금 적자 속 월 2천억 추가. ④ 3년간 줄어든 청년 일자리 21.1만의 98.6%가 AI 노출 업종인데 AI 전환 대책이 얇다. ⑤ 정년연장 처리 목표를 세 번 넘겼고, 청년 신규채용 보장 조항이 없다. ⑥ 정책 이름이 자꾸 바뀐다(내일채움공제→도약계좌→미래적금).", "rebut": "상대(김성열): \"43조, 빚으로 미래를 당겨 쓴다.\" 김보미 답: \"빚 걱정은 맞습니다. 그래서 10원까지 공개하자는 겁니다. 강진에서 군민이 예산을 보기 시작하니 낭비예산 108억이 깎였습니다. 726억 못 쓴 건 틀렸다고 인정합니다. 그런데 안 쓰는 게 답은 아닙니다. 첫 경력을 나라가 보증하는 청년취업보장제로 돈의 끝을 바꾸자는 겁니다.\"", "agree": "첫 경력 지원이라는 방향은 같이 간다. 차이는 \"상담·수당까지\"(정부)와 \"실제 첫 고용 보장\"(김보미)."}], ["국민의힘", "노란봉투법 재개정·폐지 검토, 주52시간 예외 확대, 주4.5일 \"포퓰리즘\", 정년연장은 임금체계 연동·재고용 선택. \"노조 편들다 청년 일자리 막았다\"", [["뉴시스 2026.4.15 노란봉투법 재개정 추진", "https://www.newsis.com/view/NISX20260415_0003592170"], ["MTN 2026.7.31 주52시간 예외 확대 법안", "https://news.mtn.co.kr/news-detail/2026073116400448666"], ["SBS Biz 2026.10.13 정년연장 국감", "https://biz.sbs.co.kr/amp/article/20000339666"]], {"pro": "기업이 사람을 안 뽑으면 청년 일자리가 없다는 논리는 단순하고 강하다. 정년연장을 임금체계 개편·재고용과 묶자는 안은 KDI·한국은행의 청년 고용 감소 추정과 맞닿는다. 500대 기업 61%가 채용 계획이 없다는 숫자가 이쪽 근거다.", "con": "① 노란봉투법 폐지·주52시간 예외는 첫 직장에 들어간 청년의 근로조건을 깎는다 — 첫 직장을 그만두는 이유 1위가 근로여건 불만(44.4%)이다. ② 주4.5일을 \"포퓰리즘\"이라 하면서 청년 노동시간 대안이 없다. ③ \"기업 자율\"에 맡긴 결과가 지금의 경력직 선호·수시채용이다. ④ 청년 대표 공약이 대출·주식 쪽(청년 공약 10건)이라 일자리 그 자체가 약하다.", "rebut": "상대가 \"규제 때문에 못 뽑는다\"고 하면: \"그럼 규제 풀면 신입을 뽑습니까? 기업은 규제가 아니라 신입 가르치는 비용 때문에 경력을 찾습니다. 그 비용을 나라가 나눠 지자는 게 청년취업보장제입니다. 근로시간 늘려서 생긴 일자리에 첫 직장 열에 일곱이 1년 반 만에 나갑니다.\"", "agree": "정년연장에 청년 고용 영향을 따져 보자는 점은 같다(김보미 조건부 안)."}], ["개혁신당", "최저임금 지역별 ±30% 차등(팩트체크 \"근거 사실 아님\"), 정년연장 반대(\"청년 일자리 어떻게 느나\"), 든든출발자금 5천만 원 대출, 규제 완화", [["노컷뉴스 2025.5.28 최저임금 차등 팩트체크", "https://www.nocutnews.co.kr/news/6346286"], ["파이낸셜뉴스 2025.5.19 이준석 정년연장", "https://www.fnnews.com/news/202505191418234808"], ["더팩트 2025.5.25 든든출발자금", "https://news.tf.co.kr/read/ptoday/2208718.htm"]], {"pro": "정년연장이 청년 일자리를 줄인다는 걱정은 한국은행(0.4~1.5명)·KDI(0.2명) 추정으로 뒷받침된다. 세대 간 형평을 정면으로 말하는 유일한 당이라 2030 남성층에 호소력이 있다. 든든출발자금은 청년에게 바로 닿는 공약이다.", "con": "① 최저임금 지역 차등은 하한이 7,020원 — 강진 청년은 같은 일 하고 30% 덜 받는다. 텍사스·캐나다 근거는 팩트체크에서 \"사실 아님\". ② 5천만 원 대출은 빚으로 시작하라는 것이고 상환 설계가 없다. ③ 정년연장 \"반대\"만 있고 고령 빈곤 대안이 없다. ④ 김성열 본인은 추경을 \"불난 집에 기름\"이라며 재정 긴축을 말하는데, 긴축으로는 첫 경력 보장을 못 한다. ⑤ 3석.", "rebut": "상대(김성열): \"정년연장하면 청년 일자리 어떻게 늡니까.\" 김보미 답: \"그 걱정은 저도 합니다. 그래서 청년 신규채용 보장을 조건으로 걸자는 겁니다. 그런데 최저임금 차등은 묻겠습니다. 강진 청년이 서울 청년보다 30% 덜 받으면 강진에 남습니까, 떠납니까? 지방을 살리자면서 지방 임금을 깎는 건 앞뒤가 안 맞습니다.\"", "agree": "정년연장-청년고용 연계라는 문제의식은 공유. 답이 다를 뿐."}], ["진보당", "청년일자리 국가책임제(공공 일자리 38만, 졸업실업급여 24만), 5인 미만 근로기준법 전면 적용, 최저임금 생계비 기준·플랫폼 적용, 정년연장 환영, 메가특구 노동특례 반대", [["인천일보 2026.10.8 진보당 경기도당 청년 논평", "https://www.incheonilbo.com/news/articleView.html?idxno=1333767"], ["시대일보 2026.10.20 5인 미만 근기법", "https://www.sidae.com/article/2026101513065895682"], ["미래경제뉴스 2026.7.15 진보당 최저임금 논평", "https://www.m-economynews.com/mobile/article.html?no=68774"], ["한국사회복지저널 2026.10.12 메가특구 특례 반대", "https://www.ksw-news.com/news/articleView.html?idxno=3045431"], ["다음 2026.6.10 윤종오 정년연장", "https://v.daum.net/v/20260610160122366"]], {"pro": "\"국가 책임\"이라는 틀이 김보미 청년취업보장제와 가장 가깝다. 5인 미만 사업장 근기법 적용은 첫 직장이 영세업체인 청년을 바로 지킨다. 고졸·플랫폼 청년까지 챙기는 점이 다른 당에 없다.", "con": "① 공공 일자리 38만·졸업실업급여 24만의 연도별 재원표가 없다 — 정부 119만 호도 현실성 논란인데 그보다 크다. ② 공공 일자리는 경력이 안 되는 한시직이 되기 쉽다(정부 10만과 같은 문제). ③ 정년연장을 조건 없이 환영하면 청년 신규채용 감소 추정에 답이 없다. ④ 최저임금 생계비 기준은 5인 미만 영세 자영업 폐업과 충돌. ⑤ 4석.", "rebut": "상대(박태훈): \"민주당 정부는 보조금으로 기업만 챙긴다.\" 김보미 답: \"국가가 책임지자는 데는 같은 편입니다. 다만 공공 일자리 38만 개가 또 한시직이면 경력이 안 됩니다. 저는 숫자보다 하나하나가 경력으로 인정되는 첫 일자리를 보장하자는 쪽입니다. 그리고 38만 개 1년 예산이 얼마인지 같이 계산해 보시죠.\"", "agree": "5인 미만 근기법, 국가 책임 원칙에서 연대 가능."}], ["조국혁신당·정의당·사민당", "AI 일자리 안심보장제·고용영향평가(조국), 일자리 보장제·빅테크 AI 전환기금(정의), 로봇세 AI 일자리기금(사민)", [["뉴시스 2026.5.13 조국혁신당 99년 아파트", "https://www.newsis.com/view/NISX20260513_0003627476"], ["프레시안 2026.5.15 정의당 일자리 공약", "https://pressian.com/pages/articles/2026051413544576863"]], {"pro": "AI가 청년 신입 자리를 먼저 없앤다는 문제를 정면으로 다룬다 — 김보미의 \"경력 쌓을 일자리 자체가 없어진다\"와 같은 문제의식. 빅테크·로봇에 과세해 전환 비용을 대자는 재원 아이디어가 있다.", "con": "① 로봇세·AI 기금은 과세 대상 정의가 어렵고 투자 위축 반론이 있다. ② 고용영향평가는 절차라서 일자리를 만들지 않는다. ③ 원외(정의·사민 각 1석 이하)라 실행 수단이 없다.", "rebut": "학생이 AI를 물으면: \"사라질 일자리와 생길 일자리를 정부가 먼저 계산하고 청년을 옮겨 주자는 겁니다. 로봇세보다 먼저 할 일은, AI가 없앤 신입 자리를 나라가 첫 경력으로 보장하는 겁니다.\"", "agree": "AI 전환 비용을 사회가 나눠 진다는 원칙은 같다."}]], "hw": [["의제 2 \"어디서부터\"에 대한 김보미 답 한 줄과 근거 숫자 셋은?", "\"첫 직장 문턱부터. 경력이라는 보증금을 나라가 대신 내자(청년취업보장제).\" 47개월 연속 감소, 취업 경험 84.8% 최저, 계약직 출발 34.5%.", [["📼 관련 카드 #3205", "#card/3205"], ["2026년 9월 고용동향, 청년 취업자 47개월 감소(스마트투데이)", "https://www.smarttoday.co.kr/ko-kr/articles/112773"], ["2026년 5월 청년층 부가조사(국가데이터처, KDI 요약)", "https://eiec.kdi.re.kr/policy/materialView.do?num=284575"], ["국회예산정책처 「청년층 첫 직장 현황」(2026.5.2 보도)", "https://v.daum.net/v/20260502202635766"]]], ["\"18.4개월\"의 진짜 뜻과 토론에서 쓰는 법은?", "첫 직장을 그만둔 청년의 평균 근속기간(예산정책처), 취업 소요는 11.2개월. \"취업까지 걸린 기간이 아니라 첫 직장을 버틴 기간입니다. 그래서 더 아픈 숫자입니다.\" 학생 체면 지키며.", [["첫 직장 퇴사 70.7%·근속 18.4개월(헤럴드경제 2026.5.4)", "https://www.heraldk.com/article/2026050404000057847"], ["2026년 5월 청년층 부가조사(국가데이터처, KDI 요약)", "https://eiec.kdi.re.kr/policy/materialView.do?num=284575"], ["📼 관련 카드 #3273", "#card/3273"]]], ["이수율과 대졸 고용률 숫자는?", "25~34세 이수율 71.1%(OECD 1위), 25~64세 대졸 고용률 80.1% vs OECD 86.0%. \"여러분이 공부를 덜 해서가 아닙니다.\"", [["OECD 교육지표 2026(파이낸셜뉴스 2026.9.29)", "https://www.fnnews.com/news/202609291351196534"]]], ["2027년 청년 예산 총액과 고용부 청년 일자리 예산은?", "43조 3천억(+53.5%), 고용부 3조 3천억(+7천억). \"29.9조\"는 틀린 숫자.", [["노컷뉴스 2026.8.28 2027 청년예산", "https://nocutnews.co.kr/news/6571021"], ["고용노동부 2027 예산 보도자료(KDI)", "https://eiec.kdi.re.kr/policy/materialView.do?num=287616"]]], ["K-유스개런티와 청년취업보장제는 어떻게 다른가?", "정부는 상담·연결·일경험·수당까지, 김보미는 실제 첫 고용(경력으로 쳐 주는 일자리) 보장. \"차이는 끝이 어디냐.\" 3,793억·16만 명은 매체마다 달라 비교에 쓰지 말 것.", [["K-유스개런티 3,793억·16만 명(뉴스서울 2026.9.4)", "https://newsseoul.co.kr/news/view/1065583215213139"], ["SBS Biz 2026.9.1 청년 일자리 예산", "https://biz.sbs.co.kr/amp/article/20000331977"], ["📼 관련 카드 #3236", "#card/3236"]]], ["도약장려금에서 먼저 인정할 숫자는?", "2025년 726억 미집행(집행률 90.8%), 111억 인건비 전용. 그런데 2027년 단가 2.5배. \"못 쓴 이유부터 봐야 한다.\"", [["경기신문 2026.7.27 예산정책처 도약장려금 결산", "https://kgnews.co.kr/mobile/article.html?no=905336"]]], ["정년연장 중재안과 청년 고용 영향 추정치, 김보미 입장은?", "2029년 61세→2037년 65세. KDI 0.2명, 한국은행 0.4~1.5명. 조건부: 청년 신규채용 보장부터. 최종 입장은 김보미가 정한다.", [["주간경향 2026.8.29 정년연장 지연", "https://weekly.khan.co.kr/article/202608291624001"], ["머니투데이 2025.11.23 한은·KDI 정년 효과", "https://www.mt.co.kr/economy/2025/11/23/2025112113575318203"], ["📼 관련 카드 #3217", "#card/3217"]]], ["최저임금 차등 반박 한 줄은?", "\"강진 청년이 같은 일 하고 30% 덜 받으면 강진에 남습니까?\" 하한 7,020원, 텍사스·캐나다 근거는 팩트체크 사실 아님.", [["노컷뉴스 2025.5.28 최저임금 차등 팩트체크", "https://www.nocutnews.co.kr/news/6346286"]]]], "cuts": [{"title": "청년일자리도약장려금 2025년 726억 불용, 111.7억 원은 공무원 인건비로 전용", "what": "2025년 본예산 7,771.8억 원→1차 추경으로 254.2억 증액(8,026억, 목표 10만→10만7천 명). 집행 7,188.2억 원(집행률 90.8%), 불용 726.1억 원으로 본예산에도 못 미침. 고용노동부는 2025.12.12 사업비 111.7억 원을 본부·노동위원회·지방관서 공무원 인건비로 전용. 국회예산정책처(2026.7 결산 분석): 불용 사유는 사업 시작(2022년)부터 반복된 구조적 문제로 편성 때 예측 가능했고, 추경 증액 사업의 전용은 신중해야 한다고 지적. 2027년에는 지원인원 13만 명, 비수도권 최대 1,800만 원으로 다시 확대.", "attack": "청년 일자리 주겠다고 추경까지 늘린 돈 726억을 못 쓰고 남기더니, 그중 111억은 공무원 월급으로 돌렸다. 이게 '청년 최우선' 정부의 결산인가.", "defense": "장려금은 근속 6·9·12개월 차에 나눠 지급되는 구조라 연말 채용분은 이듬해 지급으로 넘어가며, 인위적 감원 기업은 지원 제외돼 불용이 발생한다. 전용은 국가재정법 절차에 따른 것이고, 2026년 6월 기준 2.5만 기업·5.5만 청년 취업으로 전년(4.5만)보다 실적이 늘었다.", "area": "일자리", "src": [["경기신문 2026.07.27 [결산 심사 손 놓은 국회](4) 청년일자리도약장려금, 추경 증액 불구 본예산 규모도 미집행", "https://kgnews.co.kr/mobile/article.html?no=905336"], ["헤럴드경제 2026.07.01 청년일자리도약장려금 11만5000명 지원…비수도권 중견기업까지 확대", "https://www.heraldk.com/article/2026070118000783295"], ["헤럴드경제 2026.08.31 청년 일자리 예산 3.3조[2027년 예산](도약장려금 13만 명·1,800만 원)", "https://www.heraldk.com/article/2026083122004098221"]]}, {"title": "정년연장 입법, '2025년 연내' → '2026년 상반기' → '지방선거 이후' → '연내' 세 차례 미뤄짐", "what": "민주당은 2025년 연내 정년연장 입법을 약속했으나 2025.12 특위가 제시한 3개 안을 노사 모두 거부해 무산. 2026.1.23 특위 2차 회의에서 '6·3 지방선거 이후 하반기 입법'으로 연기(한국노총 반발 퇴장, 민주노총 '명백한 기만'). 2026.6 말까지 중재안 마련 약속도 지키지 못해 6월 입법 무산. 2026.8.4 노동부 업무보고에서 '연내 법제화'를 하반기 과제로 재명시. 민주당은 연기 사유로 '청년고용 영향 추가 논의'를 들었지만, 중재안에 청년 신규채용 보장 조항이 포함됐다는 내용은 확인되지 않음. 청년(15~29세) 고용률은 2024.5월부터 23개월 연속 하락, '쉬었음' 청년 42.8만 명(2025).", "attack": "청년 일자리 걱정된다며 정년연장을 세 번 미뤘는데, 그 사이 청년 고용률은 23개월 연속 떨어졌고 정작 법안엔 청년 채용 보장 조항 하나 없다. 청년은 연기의 핑계였나.", "defense": "정년연장은 노사 이해가 첨예해 사회적 대화를 충분히 거쳐야 하며, 단계적(2029년 61세→2037년 65세) 중재안으로 청년 채용 충격을 분산한다. 노동부는 공공기관 정원·총인건비 제도 개선과 청년고용의무제 실효성 강화를 병행하기로 했다. 청년 고용률 하락은 2024년부터 시작된 추세로 인구감소·AI 전환·경력직 선호가 원인이다.", "area": "일자리", "src": [["헤럴드경제 2026.01.22 민주당, 정년연장 논의 지선 이후로 제안…한국노총, 반발 퇴장", "https://www.heraldk.com/article/2026012221184410090"], ["주간경향 2026.08.29 '68년생 1년, 76년생 5년 연장' 정말일까…정년연장 어디까지 왔나", "https://weekly.khan.co.kr/article/202608291624001"], ["뉴시스 2026.04.20 청년 고용률 23개월 연속 하락…경총 \"정년연장 논의 신중해야\"", "https://www.newsis.com/view/NISX20260420_0003597589"], ["뉴시스 2025.12.07 2029년부터 단계적 65세 정년 도입?…노사 모두 반발, 연내 처리 미지수", "https://www.newsis.com/view/NISX20251207_0003431560"]]}, {"title": "주 4.5일제: 대선 땐 '법정근로시간 36시간'처럼 알리고, 집권 열흘 만에 '법제화는 검토한 적 없다'", "what": "대선 공약은 '2030년까지 OECD 평균 이하 근로시간·주 4.5일제 지원'. 민주당 의원 법안 발의로 법정근로시간 단축으로 받아들여졌으나, 2025.6.13 정길채 민주당 수석전문위원(공약 기획 참여)이 한국노총 토론회에서 \"공약 준비 과정에서 법제화는 전혀 검토되지 않았다\"고 발언. 이후 정부는 법 개정 대신 2025.12.30 노사정 선언, 2026년 '실노동시간 단축' 예산 9,363억 원(4.5일제 도입 기업에 1인당 연 최대 720만 원 지원 등) 방식으로 전환. 경기도 시범사업 참여기업 68개(2025.6)→약 140개(2026.6).", "attack": "청년들이 주 4.5일제에 표를 줬는데 당선 열흘 만에 '법제화는 검토도 안 했다'고 했다. 지원금 몇 푼으로 기업이 알아서 하라는 게 공약 이행인가.", "defense": "공약은 '법정 36시간'이 아니라 '실노동시간 단축 로드맵'이었다. 일률적 법제화는 중소·제조업 현장 충격이 크므로 노사 자율 도입에 1인당 720만 원(채용 확대 시 960만 원 추가)을 지원하는 것이 더 현실적이며, 2026년 9,363억 원을 투입해 이행점검단까지 가동 중이다.", "area": "일자리", "src": [["다음(경향) 2025.06.13 민주당 \"주 4.5일제, 지원만···법제화 공약 검토 안 했다\"", "https://v.daum.net/v/20250613144225700"], ["데일리안 2026.01 정부, 실노동시간 단축 본격 시동…9363억 투입해 '주 4.5일제' 지원", "https://www.dailian.co.kr/news/view/1598374/"], ["다음(시대) 2026.07.09 주4.5일제 참여사 68개→140개…\"생산성 안 높이면 실패\"", "https://v.daum.net/v/20260709051137143"]]}, {"title": "노란봉투법 시행 200일, 대기업 '신규 공채 축소·경력직 전환' — 청년 취업자 수개월 연속 감소", "what": "노조법 2·3조 개정안(노란봉투법)은 2026.3.10 시행, 2026.9.25 시행 200일. 경총 조사에서 기업 72.9%가 노사관계 불확실성·사법리스크 증가를 예상. 대형 제조업체·대기업 HR 임원들은 하청노조 교섭 리스크로 인건비 확정이 어려워 신규 공채를 줄이고 경력직 수시채용으로 전환한다고 밝힘(머니투데이 2026.9.28). 통계청 2026.8월 고용동향: 취업자 18.4만 명 증가분 대부분이 60세 이상, 청년(15~29세) 취업자는 수개월 연속 감소. 한은 분석: 2016년 정년 60세 연장 후 고령근로자 1명 증가당 청년 0.4~1.5명 감소.", "attack": "노란봉투법·정년연장·상법개정까지 기업 겨냥 입법은 속도전인데, 그 청구서는 신규 채용문이 닫히는 청년에게 날아갔다. 취업자는 늘었다는데 늘어난 건 60대뿐이다.", "defense": "노란봉투법은 불법 파업의 근원인 원청 교섭 회피를 없애고 손배·투쟁 악순환을 끊는 법으로, 시행 후 대규모 파업 급증은 나타나지 않았다. 청년 고용 감소는 2024년부터 이어진 인구구조·AI 전환(챗GPT 확산 후 청년 일자리 21만 개 감소 분석)·경력직 선호가 원인이며, 기업 측 주장은 법 추진 당시 설문에 근거한 것이다.", "area": "일자리", "src": [["다음(머니투데이) 2026.09.28 \"신규 채용, 엄두도 못 내요\"...'때리고 보자' 못질에, 직원 못 뽑는다", "https://v.daum.net/v/ptSloXJ6HL"], ["뉴시스 2026.07.09 챗GPT 확산 후 청년일자리 21만개↓…신규채용부터 타격", "https://www.newsis.com/view/NISX20260709_0003702194"], ["트위그 2026.03.04 \"노란봉투법, 불법 근원 없애고 손배·투쟁 악순환 고리 끊는 법\"", "https://www.twig24.com/news/2026/03/04/20260304006002"]]}, {"title": "K-유스개런티 숫자가 매체마다 다른 이유: 2025년 '90만 명 맞춤지원'은 기존 사업 묶음, 2027년 '3,793억·16만 명'은 신설 수당제", "what": "① 2025.1.21 노동부 '한국형 유스개런티' 첫 발표(윤 정부 말기): 졸업 후 4개월 내 개입을 내걸고 졸업예정자 25만 명 조사, 쉬었음 청년 40만 명 발굴 등 '약 90만 명 맞춤지원'을 제시했으나 별도 예산 없이 기존 사업을 재분류한 것. ② 2027년 예산안(2026.8.31): '청년 첫 취업지원제도(K-유스개런티)' 신설, 예산 3,793억 원·대상 16만 명, 국민취업지원제도 구직촉진수당은 60만→65만 원. ③ 노동부가 약속한 '자발적 이직 청년 생애 1회 구직급여'는 2027 예산안에 미반영. 청년 일자리 예산 5개 사업 2조5,667억 원은 반도체 추가 세수 기반의 '미래대응기금'으로 이관.", "attack": "90만 명이라던 유스개런티가 2년 만에 16만 명짜리 수당제로 줄었고, 청년에게 약속한 '자발적 이직 실업급여'는 예산안에서 사라졌다. 청년 일자리 예산 2.5조는 반도체 경기 좋을 때만 있는 기금에 얹어 놨다.", "defense": "2025년 90만 명은 전 정부의 상담·발굴 인원이고, 2027년 16만 명은 실제 수당·일경험을 보장하는 신규 지원 인원이라 비교 대상이 아니다. 청년 일자리 예산은 2.6조→3.3조로 2021년 이후 최대 증액이며, 미래대응기금은 추가 세수를 청년에 우선 배정하기 위한 장치다. 생애 1회 구직급여는 고용보험법 개정 사항으로 입법 후 반영한다.", "area": "일자리", "src": [["데일리안 2025.01.28 13년전 EU 청년정책 보완한 '한국형 유스개런티'…\"세심한 평가 필요\"", "https://www.dailian.co.kr/news/view/1456202"], ["헤럴드경제 2026.08.31 청년 일자리 예산 3.3조, 2021년 이후 최대폭…노동부 예산 38.95조[2027년 예산]", "https://www.heraldk.com/article/2026083122004098221"], ["SBS Biz 2026.08.04 구직수당 월 65만원 받는다…자발적 이직 청년도 실업급여", "https://biz.sbs.co.kr/amp/article/20000326624"]]}, {"area": "일자리", "title": "청년창업사관학교(청창사) 2027년 예산 전액 삭감 → 2주 만에 장관 '살리겠다' 번복", "what": "2011년 개교, 16년간 토스·직방 등 청년 창업자 9,300여 명 배출. 2027년 예산안(9.22 확인)에서 관련 예산 0원, 거점·인력은 재창업자용 '재도전성공학교'(595억)로 전환. 이유: 거점 19개로 늘며 직영·위탁 혼재, 허위 세금계산서 부정수급 적발, 공간 입주 신청률 8%대(이소영 장관 후보자 9.15 청문회). 총동문회 9.28 국회 긴급 세미나 뒤 이소영 장관이 10.3 페이스북에서 '폐지하지 않고 명맥 유지 방안을 찾겠다, 16기가 마지막이 되지 않게'라고 번복.", "attack": "청년 창업의 등용문을 예산 0원으로 지워 놓고, 반발이 커지자 장관이 페이스북으로 '살리겠다'고 했다. 청년 정책을 이렇게 즉흥적으로 지웠다 살렸다 하는 게 '청년 최우선' 정부인가.", "defense": "부정수급과 입주율 8%는 손봐야 할 문제였고, 현장 의견을 듣고 폐지 대신 개편으로 돌린 것은 말 바꾸기가 아니라 바로잡기다. 김보미 답: 틀린 결정을 고친 건 잘한 일이다. 다만 예산안 제출 전에 현장 의견을 들었어야 했다. 청년 정책은 지웠다 살리는 게 아니라 처음부터 청년이 설계에 들어가야 한다.", "src": [["매일경제 2026.10.8 예산 '0원' 된 청년창업사관학교", "https://www.mk.co.kr/news/society/12159936"], ["매일경제 2026.10.4 이소영 장관 \"청년창업사관학교 살리겠다\"", "https://www.mk.co.kr/news/business/12168062"]]}, {"area": "일자리", "title": "병장 월급 '205만 원'은 2025년 달성 뒤 멈춤 — 2027년 국방예산안엔 병 봉급 인상 항목 없음", "what": "병장 기본급은 2025년 150만 원(+내일준비지원금 55만 = 최대 205만)으로 전 정부 공약이 완성됐고, 2026년 150만 원 유지. 2027년 국방예산 정부안(73조 2,777억, +8.2%, 국방부 9.3 보도자료)은 하사 1호봉 월 300만 원, 단기복무 부사관 장려금 1,000만→1,200만 원 등 간부 처우 중심이고 병 봉급 인상은 들어 있지 않다. '병장 200만 원' 역전 해소가 목표라고 명시.", "attack": "군대를 '첫 직장'으로 만들자면서 병사 월급은 2년째 150만 원에 멈춰 있고, 2027년엔 간부만 올린다. 청년이 가장 많이 가는 첫 직장이 군대인데 그 월급엔 관심이 없다.", "defense": "병 봉급은 2017년 21.6만→2025년 150만 원으로 7배 올라 이미 하사 봉급을 넘어섰고, 간부 이탈로 군 허리가 무너지는 걸 먼저 막아야 한다. 김보미 답: 간부 처우 개선은 맞다. 그런데 병사 월급을 올리느냐 마느냐가 아니라, 복무 기간이 경력·기술·가산점으로 남는 '선택해서 가는 첫 직장'으로 바꾸는 게 핵심이다(모병제 카드 3248).", "src": [["한국경제 2026.9.1 하사 월급 300만원 시대…병장 200만원 역전 해소", "https://www.hankyung.com/article/2026090177857"], ["국방부 보도자료 2026.9.3 2027년 국방예산 정부안(정책브리핑)", "https://www.korea.kr/briefing/pressReleaseView.do?newsId=156779975"]]}, {"title": "청년도약계좌 신규가입 종료 → 청년미래적금 전환: 기존 가입자 '해지해야 갈아타기', 중도해지율 15.9%", "what": "청년도약계좌(윤 정부 상품)는 조세특례제한법 91조의22 일몰에 따라 2025.12.31 신규가입 종료. 2025.7월 말 기준 누적 가입 약 225만 명 중 35만8천 명 중도해지(해지율 15.9%, 2023년 말 8.2%→2024년 14.7%→2025년 15.9%). 해지 사유 1위는 '실업·소득 감소'(39%). 이재명 정부의 청년미래적금(2026.6.22 출시)은 도약계좌와 중복가입 불가로, 기존 가입자는 '특별중도해지' 절차를 밟아야 하며 순서를 어기면(먼저 해지하면) 연계가입 불가. 1차 신청 234만 명 중 적격자 약 150만 명(부적격 80여만 명), 정부가 예상한 320만 명의 절반 미달. 2차 모집은 당초 12월 예정이었다가 10월 7일로 앞당겨짐.", "attack": "정권 바뀔 때마다 청년희망적금→청년도약계좌→청년미래적금으로 이름만 바꾸는 사이, 도약계좌 가입자 3명 중 1명 가까이가 통장을 깼는데 정부는 '해지하고 갈아타라'는 말밖에 없다.", "defense": "도약계좌 종료는 전 정부가 정한 비과세 일몰 시한을 그대로 적용한 것이며, 연계가입 목적 특별중도해지를 거치면 기존 납입분 기여금·비과세가 유지돼 손해 없이 옮길 수 있는 절차를 마련했다. 심사 탈락 비율은 신청 절차가 간단해 생기는 통상적 수준이고, 미래적금은 만기 3년으로 5년 만기였던 도약계좌의 중도해지 문제를 개선했다.", "area": "기타", "src": [["뉴시스 2025.08.06 '이자 9%대인데…' 고용불안·고물가에 청년도약계좌 해지 속출", "https://newsis.com/view/NISX20250806_0003280413"], ["데일리안 2025.08.28 매 정권 바뀌는 '청년OO적금'… 해지 행렬, 왜?", "https://www.dailian.co.kr/news/view/1541250"], ["다음(연합) 2026.06.15 청년미래적금 22일 출시…\"도약계좌 먼저 해지하면 갈아타기 안돼\"", "https://v.daum.net/v/GHriUwwahC"], ["세계일보 2026.08.10 미래적금 신청자는 234만 몰려", "https://www.segye.com/newsView/20260810518333"]]}, {"title": "청년미래적금 설계 세 번 바뀜: '저소득 우선' → '신청자 전원' → 2027년 '소득요건 폐지(연봉 1억도 가입)'", "what": "2026.6.15 금융위 안내: 수요가 기여금 예산을 넘으면 개인소득 낮은 순으로 선정. 6.23 국무회의에서 이재명 대통령이 '요건 갖춘 신청자 전원 가입' 지시, 부족분은 추가 예산으로 대응(당초 7,400억 원, 320만 명분 편성). 2026.8.28 '청년예산 언박싱 2027'에서 소득요건 자체를 폐지하고 예산을 1조 원 늘려 1.7조 원으로 편성, 지방 중소기업 청년엔 납입액의 25% 매칭.", "attack": "두 달 사이 '소득 낮은 청년부터'가 '전원 가입'으로, 다시 '연봉 1억도 가입'으로 바뀌었다. 저소득 청년 자산형성이라던 제도가 고소득 청년 재테크 상품이 된 것 아닌가.", "defense": "연소득 1억 원 초과 청년은 전체의 0.7%에 불과하고, 저소득·비수도권 청년에게는 기여금을 두 배 이상 많이 주는 차등 설계라 형평성 문제가 없다(기재부). 1차 모집에서 예산 대비 가입이 미달했으므로 문턱을 낮춰 더 많은 청년이 혜택을 받게 하는 것이 취지다.", "area": "기타", "src": [["토픽트리 2026.06.24 李 대통령, 신청자 전원 가입 지시", "https://topictree.co.kr/economy/youth-future-savings-account-july-3-deadline/"], ["노컷뉴스 2026.09.01 2027 청년예산(소득요건 폐지, 기재부 '0.7%' 해명)", "https://nocutnews.co.kr/news/6571021"], ["다음(한국경제) 2026.08 연봉 제한 없앤 청년미래적금…지방 中企 청년엔 납입액 25% 얹어준다", "https://v.daum.net/v/UTzHMv8BIj"]]}, {"title": "청년 예산 '30조 → 43.3조, 53.5% 증가' 산식 논란: 2026년 기준액이 29.9조와 28.2조로 다르고 대출·임대 사업비 포함", "what": "2026.4.28 청년정책조정위원회(김민석 총리)가 발표한 2026년 청년정책 시행계획은 389개 과제·약 30조 원(29.9조, 주거 12.6조=42%). 그런데 2026.8.28 '청년예산 언박싱 2027'에서는 2026년 28.2조→2027년 43.3조(+15.1조, 53.5%)로 기준액을 다르게 잡음. 증가분의 59%(8.9조)가 주거이고, 그중 대부분이 청년이 상환해야 하는 보편형 공공임대 출융자(6.2조)·청년미래보금자리론·청년기회자금(5천억 대출) 등 융자 사업. 정치예산연구소 폴티: '43조에 청년이 갚아야 하는 저리대출과 공공임대 사업비가 대거 포함'. 재원은 2026.7월 추가 세수 기반 미래대응기금.", "attack": "4월엔 30조라던 청년예산이 8월엔 28조가 되더니 '53% 늘려 43조'라 한다. 그 43조 안엔 청년이 이자 쳐서 갚아야 할 대출이 잔뜩 들었다. 청년 1인당 1.9억 지원은 숫자 마술이다.", "defense": "시행계획 30조는 48개 부처 사업을 모두 합산한 것이고, 언박싱 28.2조는 2027년과 같은 기준으로 재분류한 비교치라 산식이 다를 뿐 축소가 아니다. 공공임대·정책대출도 청년 주거비를 실제로 낮추는 지원이며, 1인당 최대 1.95억은 생애주기 전체를 합산한 상한이라고 명시했다.", "area": "기타", "src": [["헤럴드경제 2026.04.28 정부, 청년정책에 389개 과제·30조 투입…김 총리 \"꼼꼼히 추진해 달라\"", "https://www.heraldk.com/article/2026042802453555616"], ["노컷뉴스 2026.09.01 2027 청년예산 28.2조→43.3조(53.5%)", "https://nocutnews.co.kr/news/6571021"], ["청년레터 #13 (정치예산연구소 폴티 분석 인용) 청년정책 예산 확대, 환영받을까?", "https://maily.so/youth/posts/3jrk915ez51"], ["비즈워치 2026.09.15 (2026 청년정책 29.9조, 주거 12.6조)", "https://news.bizwatch.co.kr/article/real_estate/2026/09/15/0035"]]}]}], "lessons": [{"id": "parties", "unit": "정당·여론", "title": "5. 정당별 입장 한눈에 — 여섯 정당", "time": "15분", "one": "토론에 나오는 세 정당(민주·개혁신당·진보당)에 국민의힘·조국혁신당·소수정당까지, 주거·일자리 두 의제에서 어디에 서 있는지 비교한다.", "easy": "같은 문제를 두고 당마다 처방이 다르다. 민주당은 \"공공이 짓는다\", 국민의힘·개혁신당은 \"규제를 풀어 민간이 짓게 한다\", 진보당은 \"공공임대를 20%까지, 임대료를 묶는다\". 일자리도 비슷하게 갈린다. 상대가 어느 쪽에 서 있는지 알면 공격이 어디서 올지 보인다.", "nums": [{"t": "민주당 161석·국민의힘 110석·조국혁신당 12석·진보당 4석·개혁신당 3석·기본소득당 1석·사회민주당 1석(6·3 재보선 후)", "src": [["연합/다음 2026.6.4 재보선 후 의석", "https://v.daum.net/v/20260604050957548"], ["경북매일 2026.8.31 개혁신당 3석", "https://kbmaeil.com/article/20260830500658"]]}, {"t": "민주당 김민석 대표(8.17, 54.08%). 국민의힘 장동혁 대표·정점식 원내대표. 개혁신당 이기인 비대위원장(이준석 8.26 사퇴). 진보당 김종훈 대표(7.24). 조국혁신당 신장식(7.25). 정의당 양경규(원외). 기본소득당 오준호", "src": [["뉴스토마토 2026.8.17 민주당 전당대회", "https://newstomato.com/ReadNews.aspx?no=1310490"], ["MTN 2026.8.26 장동혁 1주년", "https://news.mtn.co.kr/news-detail/2026082613574011611"], ["더팩트 2026.9.15 이기인 비대위", "https://news.tf.co.kr/read/ptoday/2365799.htm"], ["서울신문 2026.7.27 김종훈 대표 선출", "https://www.seoul.co.kr/news/politics/2026/07/27/20260727500064"], ["경향신문 2026.7.25 신장식 대표", "https://www.khan.co.kr/article/202607251647001/amp"], ["위키트리 2026.8.29 정의당 양경규", "https://www.wikitree.co.kr/articles/1155862"], ["주간경향 2026.9.7 기본소득당 오준호", "https://weekly.khan.co.kr/article/202609071125011"]]}, {"t": "개혁신당 비호감도 73%로 전 정당 중 최고(갤럽 7월). 6·3 지선 기초의원 1석. 진보당 지선 광역 7·기초 34", "src": [["여성신문 2026.7.10 갤럽 비호감도", "https://www.womennews.co.kr/news/articleView.html?idxno=279787"], ["주간경향 2026.8.26 이준석 사퇴", "https://weekly.khan.co.kr/article/202608260909001"]]}], "gov": [["정당 비교표 보기", "주거 해법·대출 규제·최저임금·정년 연장·노동법·청년 대표 정책을 여섯 정당 나란히 놓은 표와, 상대별 공략·받아치기 카드는 토론회 「정당 비교」 탭에 있다.", [["📼 관련 카드 #/parties", "#event/parties"]]]], "parties": [["민주당", "공공 공급 119만·보편형 19만, 청년예산 43.3조. 약점: 보편형 쏠림, 세입자 대책, 청년최고위원 부결·기탁금", [["국토부 주거안정플랜 발표(정책브리핑 2026.9.21)", "https://www.korea.kr/news/policyNewsView.do?newsId=148972316"], ["뉴시스 2026.7.15 청년최고위원 부결", "https://www.newsis.com/view/NISX20260715_0003710124"], ["데일리안 2026.7.22 기탁금 조정", "https://www.dailian.co.kr/news/view2/1669360"]], {"pro": "집권당이라 돈과 수단이 있다. 공공 공급·청년 예산 두 배·첫 경력 지원까지 숫자로 약속했고, 161석이라 실행할 수 있다.", "con": "정책의 약점(보편형 쏠림, 세입자 대책 공백, 한시직 일자리, 정책 이름 바꾸기)에 더해 당 자체의 약점이 있다 — 청년최고위원제 부결, 기탁금 2,000만 원, 청년 후보 전원 탈락. \"청년 정책을 청년 없이 만든다\"는 비판은 김보미 본인이 한 말이다.", "rebut": "상대가 \"민주당도 똑같다\"고 하면 부정하지 말 것: \"맞습니다. 저도 그렇게 말했습니다. 그래서 바꾸려고 당대표 선거에 나갔고, 떨어졌지만 계속 하고 있습니다. 틀린 건 틀렸다고 하는 민주당 사람도 있다는 걸 오늘 보여 드리겠습니다.\"", "agree": ""}], ["국민의힘", "재초환 폐지·반값전세·등록임대 부활, 노란봉투법 재개정, 주52시간 예외 확대. 주거권네트워크 \"집주인 공약\". 청년안심주택 보증금 사태", [["머니투데이 2026.5.12 국민의힘 지선 1호 공약", "https://www.mt.co.kr/politics/2026/05/12/2026051115314050355"], ["참여연대·주거권네트워크 2026.5.18 지선 주거공약 평가", "https://peoplepower21.org/stablelife/2023030"], ["청년안심주택 296가구 보증금 선지급(서울시 2025.10.2)", "https://mediahub.seoul.go.kr/archives/2015796"]], {"pro": "공급 부족·기업 채용 위축이라는 진단은 공감을 얻는다. ARS 조사에서 20대 지지가 민주당보다 높게 나오는 조사가 있을 만큼 2030에 파고들었다.", "con": "해법이 집주인·기업 쪽으로 기운다 — 재초환 폐지, 등록임대 부활, 노란봉투법 폐지, 주52시간 예외. 세입자이고 신입인 청년에게는 거꾸로 작용할 수 있다. 서울시 청년안심주택(민간 모델)의 보증금 미반환이 반례. 오늘 토론에 안 나오지만 학생 질문으로 나올 수 있다.", "rebut": "\"국민의힘 안은 어떻게 보나\"가 나오면: \"공급이 부족하다는 건 맞습니다. 그런데 재건축으로 나오는 집은 학생이 살 집이 아니고, 민간에 맡긴 청년주택은 보증금을 떼였습니다. 청년은 세입자이고 신입입니다. 그 두 자리를 지키는 공약인지부터 보십시오.\"", "agree": ""}], ["개혁신당(김성열)", "대출 정상화·민간 공급, 최저임금 ±30%, 정년연장 반대, 재정 건전성(\"추경은 불난 집에 기름\"). 세입자 대책 없음", [["머니투데이 2026.7.20 이준석 대출규제 비판", "https://www.mt.co.kr/politics/2026/07/20/2026072009394764215"], ["노컷뉴스 2025.5.28 최저임금 차등 팩트체크", "https://www.nocutnews.co.kr/news/6346286"], ["김성열 최고위원 모두발언 — 추경 비판(개혁신당 2026.4.9)", "https://reformparty.kr/news/press/665-press-764"], ["참여연대·주거권네트워크 2026.5.18 지선 주거공약 평가", "https://peoplepower21.org/stablelife/2023030"]], {"pro": "세대 형평·시장 원리를 또렷하게 말한다. 대출 규제가 청년을 골라 때렸다, 정년연장이 청년 자리를 줄인다는 두 지적은 숫자 근거가 있다. 김성열 전 최고위원은 민주당 보좌진 출신이라 민주당 내부 비판이 구체적일 것.", "con": "① 청년 대다수가 세입자인데 세입자 대책이 두 번 연속 \"거의 없음\". ② 대출 완화는 집값을 먼저 올린다. ③ 최저임금 지역 차등은 지방 청년 임금을 깎는다(팩트체크 \"근거 사실 아님\"). ④ 재정 긴축과 청년 일자리 보장은 같이 갈 수 없다. ⑤ 이준석 대표 사퇴 뒤 비대위, 3석 — 공약을 실행할 힘이 약하다.", "rebut": "공격 두 가지만 기억: (주거) \"세입자 대책이 공약에 한 줄도 없습니다.\" (일자리) \"강진 청년 임금을 30% 깎으면 강진에 남습니까?\" 인신공격·과거(참고인 조사, 탈당·복당, 하남갑 득표)는 절대 먼저 꺼내지 않는다.", "agree": "청년·신혼 대출 예외, 정년연장-청년고용 연계 문제의식은 같이 말할 수 있다."}], ["진보당(박태훈)", "장기공공임대 20%, 임대료 상한, 청년일자리 국가책임제, 5인 미만 근기법. 이재명 정부엔 비판적 지지, 박태훈은 대통령과 가까움", [["참여연대·주거권네트워크 2026.5.18 지선 주거공약 평가", "https://peoplepower21.org/stablelife/2023030"], ["인천일보 2026.10.8 진보당 경기도당 청년 논평", "https://www.incheonilbo.com/news/articleView.html?idxno=1333767"], ["서울신문 2026.7.27 김종훈 대표 선출", "https://www.seoul.co.kr/news/politics/2026/07/27/20260727500064"], ["폴리뉴스 2026.9.14 이재명 대통령, 박태훈 글에 답", "https://www.polinews.co.kr/news/articleView.html?idxno=743042"]], {"pro": "세입자·영세 사업장 청년을 가장 두텁게 지킨다. 공공임대 확대·국가 책임 일자리에서 김보미와 같은 편이 돼 개혁신당과 2대1 구도를 만들 수 있다. 박태훈 위원장은 대학생 당사자라 학생 공감이 높다.", "con": "① 38만 공공 일자리, 지역별 20% 공공임대 — 재원표가 없다. ② 임대료 상한·갱신 무제한은 공급 감소 반론에 한 번 철회된 안. ③ 조건 없는 정년연장 환영은 청년 고용 감소 추정에 답이 없다. ④ 4석. ⑤ 민주당 정부와 가까워서 \"비판적 지지\"의 선이 흐릿하다.", "rebut": "같은 편으로 묶되 숫자로 구분: \"방향은 같습니다. 그런데 20%와 38만의 1년치 예산을 같이 계산해 보시죠. 저는 숫자가 큰 약속보다, 하나하나가 경력이 되는 첫 일자리와 이미 있는 공공의 방부터 채우는 쪽입니다.\"", "agree": "공공임대 확대, 5인 미만 근기법, 국가 책임 원칙에서 연대."}], ["조국혁신당", "99년 국민안심아파트, AI 일자리 안심보장제. 검찰개혁 1순위", [["뉴시스 2026.5.13 조국혁신당 99년 아파트", "https://www.newsis.com/view/NISX20260513_0003627476"], ["경향신문 2026.7.25 신장식 대표", "https://www.khan.co.kr/article/202607251647001/amp"]], {"pro": "영구 임대·AI 일자리 보장이라는 선명한 메시지. 12석.", "con": "주거·일자리가 당의 중심 의제가 아니고(검찰개혁 1순위) 재원 계산이 없다. 학생 원룸 같은 단기 수요에 답이 아니다.", "rebut": "학생이 물으면 한 줄: \"방향은 좋지만 학생에게 필요한 건 99년이 아니라 당장 4년입니다.\"", "agree": ""}], ["정의당·기본소득당·사민당", "정의당 세입자 보호 공약이 지선 평가 1위(원외). 기본소득당 1석(용혜인 장관 후보자). 사민당 로봇세 AI 일자리기금", [["참여연대·주거권네트워크 2026.5.18 지선 주거공약 평가", "https://peoplepower21.org/stablelife/2023030"], ["주간경향 2026.9.7 기본소득당 오준호", "https://weekly.khan.co.kr/article/202609071125011"]], {"pro": "세입자 보호 공약이 시민단체 평가에서 가장 좋다(정의당). AI 전환 비용을 사회가 나눠 지자는 재원 발상이 있다.", "con": "원외이거나 1석이라 실행 수단이 없고, 로봇세·일자리 보장제는 재원·과세 정의가 불명확하다.", "rebut": "\"군소정당 공약은 어떻게 보나\": \"세입자 보호는 정의당 안이 가장 낫다고 시민단체가 평가했습니다. 좋은 안은 누가 냈든 가져다 쓰는 게 정치입니다.\"", "agree": ""}]], "issues": [["토론 구도", "공공임대 확대에서 진보당과 같은 편, 개혁신당과 1대2 구도가 가능. 단 \"20%\"의 분모가 다르다(진보당 지역별 20% / 정부 전체 주택 10% / 민주당 특위 임대시장 20%).", [["뉴시스 2026.9.17 민주당 주거복지특위", "https://www.newsis.com/view/NISX20260917_0003793435"], ["한국사회복지저널 2026.9.28 정태흥 9.21 비판", "https://www.ksw-news.com/news/articleView.html?idxno=3040183"], ["📼 관련 카드 #3223", "#card/3223"]]], ["김성열은 민주당 출신", "민주당 보좌진 출신이라 \"민주당은 청년을 병풍으로 쓴다\"는 공격이 날카로울 것. 답: 맞다, 저도 똑같이 말했다. 바꾸려면 결정하는 방에 들어가야 한다.", [["📼 관련 카드 #3284", "#card/3284"], ["📼 관련 카드 #3281", "#card/3281"]]]], "hw": [["여섯 정당의 의석수를 말해 보라.", "민주 161, 국민의힘 110, 조국혁신당 12, 진보당 4, 개혁신당 3, 기본소득당 1, 사회민주당 1(6·3 재보선 후 기준, 10월 현재 미확인).", [["연합/다음 2026.6.4 재보선 후 의석", "https://v.daum.net/v/20260604050957548"], ["경북매일 2026.8.31 개혁신당 3석", "https://kbmaeil.com/article/20260830500658"]]], ["공공임대 \"20%\"가 세 가지로 다른 이유는?", "진보당은 지역별 주택의 20%, 정부는 전체 주택의 10%(250만 호), 민주당 주거복지특위는 임대시장의 20%. 분모가 다르니 같은 숫자로 비교하면 안 된다.", [["뉴시스 2026.9.17 민주당 주거복지특위", "https://www.newsis.com/view/NISX20260917_0003793435"], ["한국사회복지저널 2026.9.28 정태흥 9.21 비판", "https://www.ksw-news.com/news/articleView.html?idxno=3040183"]]], ["개혁신당 주거 공약에 대한 시민단체 평가는?", "참여연대·주거권네트워크: 2025 대선 \"세입자 대책 거의 없음\", 2026 지선 \"임대인 인센티브 치중, 세입자 보호 부적절\". 두 번 연속.", [["참여연대 2025.5.13 대선 주거공약 평가", "https://peoplepower21.org/stablelife/1991954"], ["참여연대·주거권네트워크 2026.5.18 지선 주거공약 평가", "https://peoplepower21.org/stablelife/2023030"]]]]}, {"id": "polls", "unit": "정당·여론", "title": "6. 여론과 민심 — 숫자를 말할 때 조사기관부터", "time": "10분", "one": "갤럽(전화면접)은 민주당 우위, ARS 조사는 국민의힘 우위로 정반대다. 18~29세는 어느 당도 아닌 무당층이 절반 가까이다. 숫자를 인용할 땐 조사기관과 방식을 반드시 붙인다.", "easy": "같은 주에 나온 여론조사도 묻는 방식에 따라 결과가 뒤집힌다. 사람이 직접 전화해 묻는 조사(갤럽)에서는 민주당이 앞서고, 기계가 묻는 ARS 조사에서는 국민의힘이 앞선다. 그래서 \"청년이 국민의힘으로 갔다\"고 하면 틀리기 쉽고, \"청년은 양당을 다 떠났다\"가 근거상 정확하다.", "nums": [{"t": "한국갤럽 10.20~22(전화면접 1,001명): 대통령 긍정 40%, 민주 37%·국민의힘 28%·조국혁신당 3%·개혁신당 2%·진보당 1%, 무당층 27%. 18~29세 대통령 긍정 24%, 30대 22%", "src": [["한국갤럽 10.20~22 대통령 40%·민주 37%·국힘 28%(전자신문 2026.10.23)", "https://www.etnews.com/20261023000145"]]}, {"t": "한국갤럽 10.13~15: 민주 36%·국민의힘 27%. 18~29세 민주 18%·국민의힘 27%·무당층 47%. 18~29세 \"정부 견제\" 54%", "src": [["톱스타뉴스 2026.10.16 갤럽 10월 3주", "https://www.topstarnews.net/news/articleView.html?idxno=16248734"], ["주간경향 2026.10.16 갤럽 정당지지도", "https://weekly.khan.co.kr/article/202610161744001"]]}, {"t": "미디어토마토 10.5~6(ARS): 국민의힘 37.6%·민주 37.0%. 20대 국민의힘 42.5%·민주 31.2%", "src": [["뉴스토마토 2026.10.8 미디어토마토", "https://newstomato.com/ReadNews.aspx?no=1315995"]]}, {"t": "여론조사공정 10.4~5(ARS): 국민의힘 45.3%·민주 35.6%, 18~20대 국민의힘 53.8%. 리얼미터 10.15~16: 국민의힘 40.9%·민주 36.2%, 진보당 1.1%", "src": [["위키트리 2026.10.6 여론조사공정(ARS)", "https://www.wikitree.co.kr/articles/1164344"], ["파이낸셜뉴스 2026.10.19 리얼미터", "https://www.fnnews.com/news/202610190810386048"]]}, {"t": "선관위 보고서 설문(3.9~16): 서울 20대(62명) 주거/도시 69.4%·경제/일자리 56.5%. 서울 전체(328명) 64.3%·62.2%", "src": [["중앙선관위 「제9회 지방선거 정책이슈 선정을 위한 빅데이터 분석」(핀인사이트, 2026.3)", "https://policy.nec.go.kr/plc/promotion/initUPRPromotionDetail.do?no=89"]]}], "gov": [["조사 읽는 법", "표본·방식·기간·의뢰처를 본다. 전화면접과 ARS는 응답층이 달라 결과가 갈린다. 상세는 중앙선거여론조사심의위원회 홈페이지. 토론에서는 \"갤럽 조사로는\"처럼 기관 이름을 먼저 말한다.", [["한국갤럽 10.20~22 대통령 40%·민주 37%·국힘 28%(전자신문 2026.10.23)", "https://www.etnews.com/20261023000145"], ["뉴스토마토 2026.10.8 미디어토마토", "https://newstomato.com/ReadNews.aspx?no=1315995"]]]], "parties": null, "issues": [["\"20대가 민주당을 떠났다\"", "답: 떠난 게 아니라 기대할 이유를 못 찾은 것. 갤럽에서 18~29세 무당층이 47%다. 분노보다 무서운 게 무관심. 그래서 청년이 결정하는 자리에 앉게 하자.", [["톱스타뉴스 2026.10.16 갤럽 10월 3주", "https://www.topstarnews.net/news/articleView.html?idxno=16248734"], ["📼 관련 카드 #3231", "#card/3231"]]]], "hw": [["갤럽 최신 정당 지지도와 18~29세 수치는?", "10.20~22: 민주 37%·국민의힘 28%. 10.13~15 조사에서 18~29세는 민주 18%·국민의힘 27%·무당층 47%.", [["한국갤럽 10.20~22 대통령 40%·민주 37%·국힘 28%(전자신문 2026.10.23)", "https://www.etnews.com/20261023000145"], ["톱스타뉴스 2026.10.16 갤럽 10월 3주", "https://www.topstarnews.net/news/articleView.html?idxno=16248734"]]], ["왜 \"청년이 국민의힘으로 갔다\"고 말하면 위험한가?", "전화면접(갤럽)에서는 18~29세 무당층이 47%로 가장 많고, ARS에서만 국민의힘이 크게 앞선다. 방식에 따라 정반대라 조사기관을 붙이지 않으면 반박당한다.", [["톱스타뉴스 2026.10.16 갤럽 10월 3주", "https://www.topstarnews.net/news/articleView.html?idxno=16248734"], ["위키트리 2026.10.6 여론조사공정(ARS)", "https://www.wikitree.co.kr/articles/1164344"]]]]}, {"id": "local", "unit": "지방·강진", "title": "7. 지방 청년과 강진 — 김보미만 할 수 있는 이야기", "time": "10분", "one": "서울 청년의 주거 절망과 지방 청년의 일자리 절망은 같은 문제의 양면이다. 강진은 빈집이 늘고, 미래대응기금 때문에 보통교부세가 30% 줄 수 있다는 분석이 나왔다.", "easy": "서울은 방이 없어 난리인데 강진은 사람이 없어 빈집이 는다. 지방에 좋은 일자리와 학교가 있어야 처음부터 서울로 안 올라와도 된다. 김보미는 강진에서 임대아파트에 살면서 수도권에서는 방을 못 구해 언니 집에서 출퇴근한다. 이 경험이 상대 두 사람에게 없는 김보미의 무기다.", "nums": [{"t": "승원팰리체 리버시티 전용 84㎡(34평형), 226세대, 10년 민간임대. 강진 30평대 아파트 평당 평균 808만 원", "src": [["승원팰리체 리버시티 전용84㎡ 34평형 226세대(장강뉴스)", "https://www.jgynews.com/news/articleView.html?idxno=33434"], ["승원팰리체 리버시티 10년 민간임대(강진일보)", "https://www.nsori.com/news/articleView.html?idxno=23309"], ["강진군 30평대 아파트 시세·실거래(리치고)", "https://m.richgo.ai/realty/apt-hub/%EC%A0%84%EB%82%A8%EA%B4%91%EC%A3%BC/%EA%B0%95%EC%A7%84%EA%B5%B0/30%ED%8F%89%EB%8C%80"]]}, {"t": "미래대응기금(162.3조) 전출분을 내국세에서 먼저 빼면 2027년 강진군 보통교부세 3,580억→2,490억(-1,090억, 30.4%) 분석(나라살림연구소). 전국 감소 29.6조(강광석)/30.5조(서명옥)로 매체마다 다름", "src": [["강진군 보통교부세 1,090억(30.4%) 감소 분석(중도일보 2026.10.23)", "https://www.joongdo.co.kr/web/view.php?key=20261023010006661"]]}, {"t": "전남형 청년마을 4,191명 다녀가 68명 정착. 화순 만원주택 567명 전입. 강진 육아양육수당 월 60만 원, 시행 전후 출생아 83→128명(군 통계)", "src": [["전남형 청년마을 4,191명 중 68명 정착(헤럴드경제 2026.6.3)", "https://www.heraldk.com/article/2026060317462970644"], ["화순 만원주택, 567명 전입(위키트리)", "https://www.wikitree.co.kr/articles/1143545"], ["강진 육아수당 출생아 +54.2%(뉴스서울)", "https://newsseoul.co.kr/news/view/1065584424875698"]]}, {"t": "경남 청년 행복주택 대기 5.7개월(2024)→8.1개월(2026), 매입임대 경쟁률 12대 1에 계약 포기 645명(진보당 전희영, LH 자료)", "src": [["노컷뉴스 2026.10.19 경남 청년 임대 대기", "https://nocutnews.co.kr/news/6593477"]]}, {"t": "강진 청년기본조례 청년 나이 49세→45세(2022.12). 이유: 45·50세면 부모 세대까지 들어와 진짜 청년이 빠진다", "src": [["강진 청년기본조례 45세 조정(미래일보 2022)", "https://hkmd.kr/news/article.html?no=70232"], ["📼 관련 카드 #3206", "#card/3206"]]}], "gov": [["정부 균형발전 정책", "지방국립대 등록금 전액(2027), 서울대 10개 만들기(부산대·전남대·충남대 3곳 선정, 학교당 5년 약 5천억), 비수도권 도약장려금 1,800만·미래적금 25%, 메가프로젝트·호남 반도체. 반론: 수험생 63.9% \"등록금 전액 지원해도 지방국립대 안 간다\".", [["세계일보 2026.8.28 지방국립대 등록금", "https://www.segye.com/newsView/20260828512116"], ["2027 청년 첫취업·도약장려금(SBS Biz 2026.9.1)", "https://biz.sbs.co.kr/amp/article/20000331977"], ["📼 관련 카드 #1611", "#card/1611"]]]], "parties": null, "issues": [["\"지방 기피는 심리 문제, 법인세를 지자체가 정하게\"(이준석 발언)", "답: 면소재지에 밥 먹을 식당이 없어지는 건 심리가 아니다. 세금 몇 % 깎아 준다고 기업이 오지 않는다. 사람·교통·학교가 먼저.", [["이준석 연세대 학식먹자(시대 2025.5.12)", "https://www.sidae.com/article/2025051214455242590"], ["전남형 청년마을 4,191명 중 68명 정착(헤럴드경제 2026.6.3)", "https://www.heraldk.com/article/2026060317462970644"], ["📼 관련 카드 #3214", "#card/3214"]]], ["\"농어촌 기본소득은 선심성\"(김성열)", "답: 지방이 사라지는 걸 막는 돈을 선심이라 하면 안 된다. 다만 3년 뒤 청년이 몇 명 남았는지로 평가하자. 금액·대상은 준비된 자료 없음.", [["김성열 최고위원 모두발언 — 추경 비판(개혁신당 2026.4.9)", "https://reformparty.kr/news/press/665-press-764"], ["📼 관련 카드 #3283", "#card/3283"]]]], "hw": [["강진 보통교부세가 왜, 얼마나 줄 수 있나?", "미래대응기금 전출분을 내국세에서 먼저 빼고 교부세를 계산하는 방식 때문. 2027년 3,580억→2,490억, 1,090억(30.4%) 감소 분석(강광석 통합특별시의원, 나라살림연구소). 전국 수치는 29.6조/30.5조로 매체마다 다르니 \"약 30조\"로.", [["강진군 보통교부세 1,090억(30.4%) 감소 분석(중도일보 2026.10.23)", "https://www.joongdo.co.kr/web/view.php?key=20261023010006661"]]], ["\"세 사다리\"는 무엇인가?", "배울 곳, 일할 곳, 정착할 곳. 지역 안에 이 셋을 놓아야 청년이 남는다. 공장을 지어도 사람이 없으면 수도권에서 데려오고 지역 청년은 구경꾼이 된다(이맘때 Q12, KBC Q10).", [["📼 관련 카드 #2915", "#card/2915"], ["📼 관련 카드 #1611", "#card/1611"]]]]}, {"id": "politics", "unit": "정치제도", "title": "8. 청년 정치 — 정외과 학생이 물을 것들", "time": "10분", "one": "한국 국회의 40세 미만 의원은 4.7%로 155개국 중 142위. 청년 정치 예산은 법으로 있지만 99.3%가 사무처 급여로 쓰인 당도 있다. 김보미가 당대표 선거에서 겪은 기탁금·청년최고위원 부결이 살아 있는 사례다.", "easy": "청년이 정치에 들어가려면 돈의 벽(기탁금), 정보의 벽(규칙을 기득권만 먼저 안다), 족보의 벽(계파)이 있다. 법으로 피선거권을 18세로 낮췄지만 돈의 벽은 그대로다. 북유럽은 정당 청년조직에서 총리가 나오는데 우리 정당엔 청년이 클 길이 없다.", "nums": [{"t": "22대 국회 40세 미만 4.7%, 155개국 중 142위. IPU 2025: 세계 40세 이하 의원 19.0%, 북유럽 30.3%, 동아시아 7.2%", "src": [["22대 국회 40세 미만 4.7%·142위(서울신문 2025.11.21)", "https://seoul.co.kr/news/plan/youngman_area_future/2025/11/21/20251121008003"], ["IPU 청년의원 보고서 2025(원문 PDF)", "https://agora-parl.org/sites/default/files/agora-documents/20250902_YouthParticipation_2025_EN_LR.pdf"]]}, {"t": "2023년 한 당은 청년정치발전비의 99.3%를 청년본부 사무처 급여로 사용. 22대 총선 양당 지역구 공천자 중 청년 3%대. 국회의원 지역구 기탁금 1,500만 원", "src": [["청년정치발전비 99.3% 급여(서울신문 2024.3.18)", "https://m.seoul.co.kr/news/2024/03/18/20240318004004"], ["22대 총선 청년 공천 3%대(서울신문 2024.3.5)", "https://m.seoul.co.kr/news/2024/03/05/20240305004006"]]}, {"t": "민주당 청년최고위원 선출제 최고위 부결(7.14) → 청년 몫 지명직 전용기(8.20). 기탁금 당대표 1억→8천만, 최고위원 5천만→3천만(7.21, 대통령 재검토 요구 뒤). 39세 이하 비현역 50% 감면", "src": [["뉴시스 2026.7.15 청년최고위원 부결", "https://www.newsis.com/view/NISX20260715_0003710124"], ["데일리안 2026.7.22 기탁금 조정", "https://www.dailian.co.kr/news/view2/1669360"], ["청년 몫 지명직 전용기 의원(주간경향 2026.8.21)", "https://weekly.khan.co.kr/article/202608211114001"]]}, {"t": "6·3 지선 39세 이하 후보 10.4%, 당선 9.5%(403명), 단체장 0명. 진보당 손솔 의원은 22대 최연소(30세)", "src": [["22대 총선 청년 공천 3%대(서울신문 2024.3.5)", "https://m.seoul.co.kr/news/2024/03/05/20240305004006"], ["미래경제뉴스 2026.8.15 진보당 4기 지도부", "https://www.m-economynews.com/mobile/article.html?no=69793"]]}, {"t": "정당 국고보조금 2026년 970억 중 양당 86%. 개혁신당 2024년 보조금 6.6억 \"먹튀\" 논란", "src": [["뉴시스 2024.2.21 개혁신당 보조금 논란", "https://www.newsis.com/view/NISX20240221_0002634632"]]}], "gov": [["제도 논의", "피선거권 18세, 국회 개헌 논의(4년 중임·내각제), 선거제 비례성·위성정당. 김보미 입장: 개헌은 필요하지만 정당 개혁은 개헌 없이 지금 당장 할 수 있다. 개헌안 세부 입장은 만들지 않았으니 \"국회 논의를 지켜보되 정당 개혁이 먼저\"로.", [["스웨덴 총리 인준 부결(스웨덴 의회 2026.10.15)", "https://www.riksdagen.se/en/news/articles/2026/oct/15/no-to-magdalena-andersson-socdem-as-prime_cmsd2ab1134-a03c-4be2-b345-af0aacff33d3en/"], ["📼 관련 카드 #3254", "#card/3254"]]]], "parties": null, "issues": [["\"이준석은 36세에 당대표가 됐는데 민주당은 왜 안 되나\"", "답: 사람이 아니라 판의 문제. 국민의힘은 토론·미디어로 승부가 나는 판이 열렸고 민주당은 조직·명부로 승부가 난다. 제 예비경선은 선거운동이 이틀도 안 됐고 토론은 한 번도 없었다.", [["📼 관련 카드 #3247", "#card/3247"]]], ["\"청년 할당제는 역차별\"", "답: 할당보다 경로가 먼저. 다만 공천자 중 청년 3%대인 지금은 공천 목표제 정도는 필요. 김보미 공약은 \"청년 공천 목표제\"지 의무 할당이 아니다.", [["22대 총선 청년 공천 3%대(서울신문 2024.3.5)", "https://m.seoul.co.kr/news/2024/03/05/20240305004006"], ["당 예산 10% 청년 편성 공약(프레시안 2026.7.16)", "https://pressian.com/pages/articles/2026071617485205196"], ["📼 관련 카드 #3255", "#card/3255"]]]], "hw": [["한국 국회 40세 미만 의원 비율과 세계 순위는?", "4.7%, 155개국 중 142위. 북유럽은 30.3%.", [["22대 국회 40세 미만 4.7%·142위(서울신문 2025.11.21)", "https://seoul.co.kr/news/plan/youngman_area_future/2025/11/21/20251121008003"], ["IPU 청년의원 보고서 2025(원문 PDF)", "https://agora-parl.org/sites/default/files/agora-documents/20250902_YouthParticipation_2025_EN_LR.pdf"]]], ["김보미가 당대표 선거에서 겪은 \"돈의 벽\" 숫자는?", "당대표 기탁금 1억(→8천만으로 인하), 다섯 군데서 빌림. 청년최고위원 선출제는 7.14 최고위에서 부결됐고 청년 몫은 지명으로 처리됐다.", [["데일리안 2026.7.22 기탁금 조정", "https://www.dailian.co.kr/news/view2/1669360"], ["뉴시스 2026.7.15 청년최고위원 부결", "https://www.newsis.com/view/NISX20260715_0003710124"], ["📼 관련 카드 #3232", "#card/3232"]]]]}]};
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
  if(OLD){document.body.classList.remove('v2');document.documentElement.classList.remove('v2');const _t=document.getElementById('v2top');if(_t)_t.remove();foot();oldRender();return}
  document.body.classList.add('v2');document.documentElement.classList.add('v2');top();foot();
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
