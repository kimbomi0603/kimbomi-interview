// 서버 단 비밀번호 보호
//  · 비밀번호가 맞기 전에는 페이지 내용 자체를 보내지 않습니다.
//  · 한 번 입력하면 그 컴퓨터에서는 90일간 다시 묻지 않습니다.
//  · 비밀번호는 Vercel 환경변수 SITE_PASS 에만 있고 코드에는 남지 않습니다.

export const config = { matcher: '/(.*)' };

const COOKIE = 'kb_gate';
const DAYS = 90;

async function token(pass) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('kb-gate:' + pass));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function ask(msg) {
  return new Response(msg, {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="kimbomi-interview", charset="UTF-8"',
      'content-type': 'text/plain; charset=utf-8'
    }
  });
}

export default async function middleware(request) {
  const USER = process.env.SITE_USER || 'bomi';
  const PASS = process.env.SITE_PASS;

  if (!PASS) {
    return new Response('설정 필요: Vercel 환경변수 SITE_PASS 가 비어 있습니다.', {
      status: 500, headers: { 'content-type': 'text/plain; charset=utf-8' }
    });
  }

  const good = await token(PASS);

  // 1) 이미 인증된 컴퓨터인지 쿠키 확인
  const cookie = request.headers.get('cookie') || '';
  const m = cookie.match(new RegExp('(?:^|;\\s*)' + COOKIE + '=([a-f0-9]{64})'));
  if (m && m[1] === good) return;   // 통과

  // 2) 비밀번호 입력 확인
  const auth = request.headers.get('authorization') || '';
  if (auth.startsWith('Basic ')) {
    try {
      const d = atob(auth.slice(6));
      const i = d.indexOf(':');
      if (d.slice(0, i) === USER && d.slice(i + 1) === PASS) {
        // 통과시키면서 90일짜리 쿠키를 심어 다음부터는 묻지 않음
        return new Response(null, {
          status: 302,
          headers: {
            'location': new URL(request.url).pathname || '/',
            'set-cookie': `${COOKIE}=${good}; Path=/; Max-Age=${DAYS * 86400}; HttpOnly; Secure; SameSite=Lax`
          }
        });
      }
    } catch (e) { /* 잘못된 헤더 → 아래에서 재요청 */ }
  }

  return ask('접근하려면 아이디와 비밀번호가 필요합니다.');
}
