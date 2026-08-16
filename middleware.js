// 서버 단 비밀번호 보호 (단순·안정 버전)
//  · 비밀번호가 맞기 전에는 페이지 내용 자체를 보내지 않습니다.
//  · 비밀번호는 Vercel 환경변수 SITE_PASS 에만 있고 코드에는 남지 않습니다.

export const config = { matcher: '/(.*)' };

export default function middleware(request) {
  const USER = (process.env.SITE_USER || 'bomi').trim();
  const RAW  = process.env.SITE_PASS;

  // 값이 아예 없으면 진단 메시지 (내용은 계속 보호됨)
  if (RAW === undefined || RAW === null || String(RAW).trim() === '') {
    return new Response('설정 필요: Vercel 환경변수 SITE_PASS 가 비어 있습니다.', {
      status: 500, headers: { 'content-type': 'text/plain; charset=utf-8' }
    });
  }
  const PASS = String(RAW).trim();

  const header = request.headers.get('authorization') || '';
  if (header.slice(0, 6).toLowerCase() === 'basic ') {
    let decoded = '';
    try { decoded = atob(header.slice(6).trim()); } catch (e) { decoded = ''; }
    const i = decoded.indexOf(':');
    if (i > -1) {
      const u = decoded.slice(0, i).trim();
      const p = decoded.slice(i + 1);
      if (u === USER && (p === PASS || p.trim() === PASS)) {
        return;                       // 통과 — 원래 페이지를 그대로 보여줌
      }
    }
  }

  return new Response('접근하려면 아이디와 비밀번호가 필요합니다.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="kimbomi-interview", charset="UTF-8"',
      'content-type': 'text/plain; charset=utf-8'
    }
  });
}
