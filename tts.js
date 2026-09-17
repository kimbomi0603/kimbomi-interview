/* 공통 음성 듣기 플레이어 — 페이지 본문(section.lv 등)을 순서대로 읽어 줍니다.
   페이지에 이미 #player 가 있으면 동작하지 않습니다. */
(function(){
  if (document.getElementById('player')) return;
  var synth = window.speechSynthesis;
  if (!synth || typeof SpeechSynthesisUtterance === 'undefined') return;

  var css = '.ttsp{position:sticky;top:52px;z-index:40;background:#211d17;color:#fff;border-radius:12px;padding:10px 14px;margin:0 0 24px;font-size:13.5px}'
    + '.ttsp .row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}'
    + '.ttsp button{background:#e8c34d;color:#211d17;border:none;border-radius:8px;padding:7px 12px;font-weight:800;font-size:13.5px;cursor:pointer}'
    + '.ttsp button.g{background:rgba(255,255,255,.14);color:#fff}'
    + '.ttsp .st{font-size:12.5px;color:#c9c2b4;margin-left:auto}'
    + '.ttsp .bar{height:4px;background:rgba(255,255,255,.16);border-radius:99px;margin-top:9px;overflow:hidden}'
    + '.ttsp .bar i{display:block;height:100%;width:0;background:#e8c34d;transition:width .3s}'
    + '.tts-reading{background:#fff6cc!important;outline:2px solid #e8c34d;border-radius:4px}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var box = document.createElement('div');
  box.className = 'ttsp';
  box.innerHTML = '<div class="row"><b>🔊 듣기</b>'
    + '<button id="ttsPlay">▶ 듣기</button><button class="g" id="ttsPrev">⏮ 이전 단계</button>'
    + '<button class="g" id="ttsNext">다음 단계 ⏭</button><button class="g" id="ttsRate">배속 1×</button>'
    + '<button class="g" id="ttsStop">■ 정지</button><span class="st" id="ttsSt">운전 중에도 들을 수 있습니다</span></div>'
    + '<div class="bar"><i id="ttsBar"></i></div>';
  var hero = document.querySelector('header.hero') || document.querySelector('header');
  var mainEl = document.getElementById('main');
  var wrap = document.querySelector('.wrap') || document.body;
  if (mainEl) { var lay = mainEl.closest('.layout') || mainEl; box.style.position = 'static'; box.style.maxWidth = '1240px'; box.style.margin = '12px auto'; lay.parentNode.insertBefore(box, lay); }
  else if (hero && hero.parentNode) hero.parentNode.insertBefore(box, hero.nextSibling);
  else wrap.insertBefore(box, wrap.firstChild);

  var queue = [], marks = [], chapters = [];
  var SEL = 'h2,h3,p,li,dt,dd,.q,.a,.t,.quote';
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
  function build(){
    queue = []; marks = []; chapters = [];
    var roots = document.querySelectorAll('section.lv');
    if (!roots.length) { var mm = document.getElementById('main'); roots = mm ? mm.querySelectorAll(':scope > *') : [wrap]; }
    Array.prototype.forEach.call(roots, function(r){
      chapters.push(queue.length);
      if (!r.querySelector(SEL)) { push(r); return; }
      Array.prototype.forEach.call(r.querySelectorAll(SEL), function(el){
        if (el.closest('table') || el.closest('.ttsp')) return;
        if (el.querySelector(SEL)) return;
        push(el);
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll('.box.key'), function(bk){
      if (bk.closest('section.lv')) return; chapters.push(queue.length); push(bk);
    });
  }
  build();
  if (!queue.length && !document.getElementById('main')) { box.remove(); return; }

  var i = 0, playing = false, rates = [1, 1.25, 1.5, 0.85], rate = 1, last = null;
  var $ = function(id){ return document.getElementById(id); };
  function mark(el){
    if (last) last.classList.remove('tts-reading');
    last = el; if (!el) return;
    el.classList.add('tts-reading');
    var r = el.getBoundingClientRect();
    if (r.top < 110 || r.bottom > innerHeight - 40) scrollTo({ top: scrollY + r.top - 180, behavior: 'smooth' });
  }
  function status(){ $('ttsSt').textContent = (i + 1) + ' / ' + queue.length; $('ttsBar').style.width = ((i + 1) / queue.length * 100) + '%'; }
  function speak(){
    if (i >= queue.length) { stop(); $('ttsSt').textContent = '재생 완료'; return; }
    mark(marks[i]); status();
    var u = new SpeechSynthesisUtterance(queue[i]); u.lang = 'ko-KR'; u.rate = rate;
    u.onend = u.onerror = function(){ if (playing) { i++; speak(); } };
    synth.speak(u);
  }
  function stop(){ playing = false; synth.cancel(); $('ttsPlay').textContent = '▶ 듣기'; mark(null); }
  function jump(n){ i = Math.max(0, Math.min(queue.length - 1, n)); synth.cancel(); if (playing) speak(); else { mark(marks[i]); status(); } }
  $('ttsPlay').onclick = function(){
    if (playing) { playing = false; synth.cancel(); this.textContent = '▶ 이어 듣기'; return; }
    if (i === 0) build();
    if (!queue.length) return;
    playing = true; this.textContent = '⏸ 일시정지'; synth.cancel(); speak();
  };
  $('ttsStop').onclick = function(){ stop(); i = 0; $('ttsSt').textContent = '정지됨'; $('ttsBar').style.width = '0'; };
  $('ttsRate').onclick = function(){ rate = rates[(rates.indexOf(rate) + 1) % rates.length]; this.textContent = '배속 ' + rate + '×'; if (playing) { synth.cancel(); speak(); } };
  $('ttsNext').onclick = function(){ for (var c = 0; c < chapters.length; c++) if (chapters[c] > i) return jump(chapters[c]); jump(queue.length - 1); };
  $('ttsPrev').onclick = function(){ for (var c = chapters.length - 1; c >= 0; c--) if (chapters[c] < i - 1) return jump(chapters[c]); jump(0); };
  addEventListener('beforeunload', function(){ synth.cancel(); });
})();
