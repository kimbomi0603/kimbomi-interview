// 비밀번호 게이트 — 진단 모드
// 비밀번호 자체는 절대 출력하지 않고, 길이/일치여부만 알려줍니다.

export const config = { matcher: '/(.*)' };

export default function middleware(request) {
  const rawUser = process.env.SITE_USER;
  const rawPass = process.env.SITE_PASS;
  const USER = (rawUser === undefined ? 'bomi' : String(rawUser)).trim();
  const PASS = rawPass === undefined ? undefined : String(rawPass).trim();

  const header = request.headers.get('authorization') || '';
  let gotUser = null, gotPass = null;
  if (header.slice(0, 6).toLowerCase() === 'basic ') {
    try {
      const d = atob(header.slice(6).trim());
      const i = d.indexOf(':');
      if (i > -1) { gotUser = d.slice(0, i); gotPass = d.slice(i + 1); }
    } catch (e) {}
  }

  if (PASS !== undefined && PASS !== '' && gotUser !== null &&
      gotUser.trim() === USER && gotPass.trim() === PASS) {
    return; // 통과
  }

  // 진단 정보 (값은 노출하지 않음)
  const diag = [
    'SITE_PASS 정의됨   : ' + (rawPass !== undefined),
    'SITE_PASS 글자수   : ' + (rawPass === undefined ? '-' : String(rawPass).length),
    'SITE_PASS 공백제거 : ' + (PASS === undefined ? '-' : PASS.length),
    'SITE_USER 값       : ' + USER,
    '보낸 아이디        : ' + (gotUser === null ? '(없음)' : gotUser),
    '보낸 비번 글자수   : ' + (gotPass === null ? '-' : gotPass.length),
    '아이디 일치        : ' + (gotUser !== null && gotUser.trim() === USER),
    '비번 일치          : ' + (gotPass !== null && PASS !== undefined && gotPass.trim() === PASS),
  ].join('\n');

  return new Response('접근하려면 아이디와 비밀번호가 필요합니다.\n\n--- 진단 ---\n' + diag, {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="kimbomi-interview", charset="UTF-8"',
      'content-type': 'text/plain; charset=utf-8'
    }
  });
}
