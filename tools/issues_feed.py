#!/usr/bin/env python3
"""현안 브리핑 자료 병합기.

예약 작업이 조사 결과(JSON 한 건)를 만들면, 이 스크립트가 data/issues-feed.json에 붙인다.
사용: python3 tools/issues_feed.py <brief.json> [--weekly]

brief.json 형식:
{
 "title": "10.25(토) 저녁 브리핑",
 "lead": "오늘 한 줄 정리",
 "n": 37,                        # 확인한 기사 수
 "items": [
   {"kind": "핫이슈|의제|정당|현안|지방|기타",
    "title": "...", "summary": "...", "why": "...", "line": "대표님이 할 말 초안",
    "ask": "받을 수 있는 질문", "warn": "주의", "src": [["매체 날짜 제목", "https://..."]]}
 ]
}
"""
import json, sys, datetime, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
FEED = ROOT / 'data' / 'issues-feed.json'

def main():
    if len(sys.argv) < 2:
        print(__doc__); sys.exit(1)
    weekly = '--weekly' in sys.argv
    src = [a for a in sys.argv[1:] if not a.startswith('--')][0]
    brief = json.load(open(src, encoding='utf-8'))
    feed = json.load(open(FEED, encoding='utf-8')) if FEED.exists() else {"updated": "", "briefs": [], "weekly": []}
    now = datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=9)))
    brief.setdefault('at', now.isoformat(timespec='minutes'))
    for it in brief.get('items', []):
        it.setdefault('kind', '현안'); it.setdefault('src', [])
        it['src'] = [s for s in it['src'] if isinstance(s, list) and len(s) == 2 and str(s[1]).startswith('http')]
    key = 'weekly' if weekly else 'briefs'
    feed.setdefault(key, [])
    feed[key] = [b for b in feed[key] if b.get('at') != brief['at']]
    feed[key].append(brief)
    feed['briefs'] = sorted(feed.get('briefs', []), key=lambda b: b.get('at', ''))[-30:]
    feed['weekly'] = sorted(feed.get('weekly', []), key=lambda b: b.get('at', ''))[-12:]
    feed['updated'] = now.isoformat(timespec='minutes')
    json.dump(feed, open(FEED, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('merged', key, brief['at'], len(brief.get('items', [])), 'items')

if __name__ == '__main__':
    main()
