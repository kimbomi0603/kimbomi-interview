import re,json
h=open('/home/claude/kimbomi0603/kimbomi-interview/dashboard.html',encoding='utf-8').read()
d=json.loads(re.search(r'<script id="__payload" type="application/json">(.*?)</script>',h,re.S).group(1).replace('<\\/','</'))
by={c['no']:c for c in d['DATA']}
ST=json.load(open('study.json',encoding='utf-8'))
def src(no): return [x[0]+(' — '+x[1] if x[1].startswith('http') else '') for x in by[no].get('src',[]) if not x[1].startswith('#')]
plan=[('0. 실전 운영판 — 진행 방식 확정(10.26 통화) · 첫 1분과 30초 카드','사회자 발제 → 의제별 약 15분 자유토론 × 2. 현장에서는 이 장만 보면 됨',3285,False),('1. 인사말·자기소개','약 1분 10초 · 기조발언 앞',3209,False),('2. 기조발언 (개정본)','약 3분 · 10.26 김보미 구술 반영',3201,False),('2-1. 기조발언 압축본','1분 30초 · 시간이 짧을 때 이것만',3203,False),
('3. 의제 1 · 청년 주거 — 지금 있는 정책부터 (정부·서울시·LH)','1분 · 열거한 뒤 3-1로',3275,False),('3-1. 의제 1 · 청년 주거 — "무엇을 우선적으로 바꿔야 하는가"','1~2분',3204,False),
('4. 의제 2 · 청년 일자리 — 지금 있는 정책부터 (정부·서울시)','1분 · 열거한 뒤 4-1로',3276,False),('4-1. 의제 2 · 청년 일자리 — "어디서부터?"','1~2분',3205,False),('4-2. 의제 2 보충 · AI는 위협인가 기회인가','2분 · 학생 질문이 오거나 시간이 남을 때',3210,False),
('5. 학생회 질문 ① 8년 지방의원, 조례·정책으로 무엇을 만들었나','1분',3206,False),('5-1. 학생회 질문 ② 떨어져도 왜 계속 도전하나','1분',3207,False),('6. 마무리 발언','1분',3274,False),
('부록 A. 주거 보충 — 빈 공공임대·청년 첫 집·낡은 청사를 청년주택으로','LH 국정감사 자료(강득구 의원실 질의자료, SBS Biz·노컷뉴스 교차 확인)',3277,True),('부록 B. 주거 — 상황 봐서 골라 쓰는 숫자와 한 줄','출처: 슬로우뉴스 「슬로우레터」 9~10월 호',3278,True),('부록 C. 일자리 — 상황 봐서 골라 쓰는 숫자와 한 줄','출처: 슬로우뉴스 「슬로우레터」 9~10월 호',3279,True)]
extra=[]
import os
if os.path.exists('gukgam_card.txt'):
    extra=[('부록 D. 이번 국정감사에서 나온 지적','2026 국정감사(10월) — 의원·상임위·보도 출처를 함께 말할 것',int(open('gukgam_card.txt').read().strip()),True)]
secs=[]
for t,sub,no,withsrc in plan+extra:
    c=by[no]; brk=t.startswith(('0.','2. ','3-1','4-2','6.','부록')); secs.append({'brk':brk,'title':t,'sub':sub,'lines':c['script'],'cite':c.get('cite',[]),'warn':c.get('warn',''),'src':src(no) if withsrc else []})
asks=[[a['title'].split('·')[0].strip(),q['who'],q['q'],q['admit'],q['hit']] for a in ST['agenda'] for q in a['ask']]
json.dump({'secs':secs,'asks':asks,'warn':by[3272]['script']},open('script_data.json','w',encoding='utf-8'),ensure_ascii=False)
print(len(secs),len(asks))
