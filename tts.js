/* 공통 음성 듣기 — 🎧 3분 브리핑(#brief) 듣기 + ▶ 전체 듣기
   페이지에 자체 #player가 있으면 '브리핑 듣기'만 붙인다. (2026.9.17) */
(function(){
  var synth = window.speechSynthesis;
  var css = '.brief{background:#fffbea!important;border:1.5px solid #ecd67a!important;border-left:5px solid #e8a800!important;border-radius:12px;padding:16px 20px;margin:18px 0}'
    + '.brief .bt{color:#8a6400!important;font-weight:900;display:block;margin-bottom:8px}'
    + '.brief .lead{font-size:17.5px;font-weight:800;line-height:1.6;margin:0 0 10px}'
    + '.brief ul{margin:0 0 10px;padding-left:20px}.brief li{margin-bottom:6px}.brief p{margin:0 0 8px}'
    + '.ttsp{position:sticky;top:52px;z-index:40;background:#211d17;color:#fff;border-radius:12px;padding:10px 14px;margin:0 0 20px;font-size:13.5px}'
    + '.ttsp .row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}'
    + '.ttsp button{background:#e8c34d;color:#211d17;border:none;border-radius:8px;padding:8px 12px;font-weight:800;font-size:13.5px;cursor:pointer}'
    + '.ttsp button.g{background:rgba(255,255,255,.14);color:#fff}'
    + '.ttsp .st{font-size:12.5px;color:#c9c2b4;margin-left:auto}'
    + '.ttsp .bar{height:4px;background:rgba(255,255,255,.16);border-radius:99px;margin-top:9px;overflow:hidden}'
    + '.ttsp .bar i{display:block;height:100%;width:0;background:#e8c34d;transition:width .3s}'
    + '.tts-reading{background:#fff6cc!important;outline:2px solid #e8c34d;border-radius:4px}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  if (!synth || typeof SpeechSynthesisUtterance === 'undefined') return;

  var own = !!document.getElementById('player');
  var briefEl = document.getElementById('brief');
  if (own && !briefEl) return;

  var box = document.createElement('div');
  box.className = 'ttsp';
  box.innerHTML = '<div class="row"><b>🔊 듣기</b>'
    + (briefEl ? '<button id="ttsBrief">🎧 3분 브리핑</button>' : '')
    + (own ? '' : '<button id="ttsPlay"' + (briefEl ? ' class="g"' : '') + '>▶ 전체 듣기</button>'
      + '<button class="g" id="ttsPrev">⏮ 이전</button><button class="g" id="ttsNext">다음 ⏭</button>')
    + '<button class="g" id="ttsRate">배속 1×</button><button class="g" id="ttsStop">■ 정지</button>'
    + '<span class="st" id="ttsSt">운전 중에도 들을 수 있습니다</span></div><div class="bar"><i id="ttsBar"></i></div>';
  var tb = document.querySelector('.topbar');
  function fixTop(){ if (tb && getComputedStyle(tb).position === 'sticky') box.style.top = tb.offsetHeight + 'px'; }
  fixTop(); addEventListener('resize', fixTop);
  var mainEl = document.getElementById('main');
  var hero = document.querySelector('header.hero') || document.querySelector('header');
  var wrap = document.querySelector('.wrap') || document.body;
  if (briefEl) { briefEl.parentNode.insertBefore(box, briefEl); }
  else if (mainEl) { var lay = mainEl.closest('.layout') || mainEl; box.style.position = 'static'; box.style.maxWidth = '1240px'; box.style.margin = '12px auto'; lay.parentNode.insertBefore(box, lay); }
  else if (hero && hero.parentNode) hero.parentNode.insertBefore(box, hero.nextSibling);
  else wrap.insertBefore(box, wrap.firstChild);

  var SEL = 'h2,h3,p,li,dt,dd,.q,.a,.t,.quote';
  var queue = [], marks = [], chapters = [];
  function push(el){
    var t = (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
    if (!t) return;
    var buf = '';
    t.split(/(?<=[.!?…])\s+/).forEach(function(p){
      if (buf && (buf + ' ' + p).length > 170) { queue.push(buf); marks.push(el); buf = p; }
      else buf = buf ? buf + ' ' + p : p;
    });
    if (buf) { queue.push(buf); marks.push(el); }
  }
  function walk(r){
    chapters.push(queue.length);
    if (!r.querySelector(SEL)) { push(r); return; }
    Array.prototype.forEach.call(r.querySelectorAll(SEL), function(el){
      if (el.closest('table') || el.closest('.ttsp')) return;
      if (el.querySelector(SEL)) return;
      push(el);
    });
  }
  function build(mode){
    queue = []; marks = []; chapters = [];
    if (mode === 'brief') { walk(briefEl); return; }
    if (briefEl) walk(briefEl);
    var roots = document.querySelectorAll('section.lv');
    if (!roots.length) { roots = mainEl ? mainEl.querySelectorAll(':scope > *') : [wrap]; }
    Array.prototype.forEach.call(roots, function(r){ if (r !== briefEl && !r.contains(box)) walk(r); });
  }

  var i = 0, playing = false, mode = null, rates = [1, 1.25, 1.5, 0.85], rate = 1, last = null;
  var $ = function(id){ return document.getElementById(id); };
  function mark(el){
    if (last) last.classList.remove('tts-reading');
    last = el; if (!el) return;
    el.classList.add('tts-reading');
    var r = el.getBoundingClientRect();
    if (r.top < 120 || r.bottom > innerHeight - 40) scrollTo({ top: scrollY + r.top - 200, behavior: 'smooth' });
  }
  function status(){ $('ttsSt').textContent = (mode === 'brief' ? '브리핑 ' : '') + (i + 1) + ' / ' + queue.length; $('ttsBar').style.width = ((i + 1) / queue.length * 100) + '%'; }
  function labels(){
    if ($('ttsBrief')) $('ttsBrief').textContent = (playing && mode === 'brief') ? '⏸ 일시정지' : '🎧 3분 브리핑';
    if ($('ttsPlay')) $('ttsPlay').textContent = (playing && mode === 'all') ? '⏸ 일시정지' : '▶ 전체 듣기';
  }
  function speak(){
    if (i >= queue.length) { stop(); $('ttsSt').textContent = '재생 완료'; $('ttsBar').style.width = '100%'; return; }
    mark(marks[i]); status();
    var u = new SpeechSynthesisUtterance(queue[i]); u.lang = 'ko-KR'; u.rate = rate;
    u.onend = u.onerror = function(){ if (playing) { i++; speak(); } };
    synth.speak(u);
  }
  function stop(){ playing = false; synth.cancel(); mark(null); labels(); }
  function toggle(m){
    if (own && window.speechSynthesis.speaking && mode !== m) synth.cancel();
    if (playing && mode === m) { playing = false; synth.cancel(); labels(); return; }
    if (mode !== m || i === 0 || i >= queue.length) { mode = m; build(m); i = 0; }
    if (!queue.length) return;
    playing = true; synth.cancel(); labels(); speak();
  }
  function jump(n){ i = Math.max(0, Math.min(queue.length - 1, n)); synth.cancel(); if (playing) speak(); else { mark(marks[i]); status(); } }
  if ($('ttsBrief')) $('ttsBrief').onclick = function(){ toggle('brief'); };
  if ($('ttsPlay')) $('ttsPlay').onclick = function(){ toggle('all'); };
  $('ttsStop').onclick = function(){ stop(); i = 0; $('ttsSt').textContent = '정지됨'; $('ttsBar').style.width = '0'; };
  $('ttsRate').onclick = function(){ rate = rates[(rates.indexOf(rate) + 1) % rates.length]; this.textContent = '배속 ' + rate + '×'; if (playing) { synth.cancel(); speak(); } };
  if ($('ttsNext')) $('ttsNext').onclick = function(){ if (!mode) { mode = 'all'; build('all'); } for (var c = 0; c < chapters.length; c++) if (chapters[c] > i) return jump(chapters[c]); jump(queue.length - 1); };
  if ($('ttsPrev')) $('ttsPrev').onclick = function(){ if (!mode) { mode = 'all'; build('all'); } for (var c = chapters.length - 1; c >= 0; c--) if (chapters[c] < i - 1) return jump(chapters[c]); jump(0); };
  addEventListener('beforeunload', function(){ synth.cancel(); });
})();
