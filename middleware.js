// 비밀번호 게이트
//
// 보안 원칙: 401 응답은 인증 실패 사실 외에 아무것도 알려주지 않는다.
// 아이디, 비밀번호 길이, 환경변수 설정 여부, 입력값 일치 여부를 노출하면
// 공격자에게 탐색 범위를 좁혀 주므로 어떤 진단 정보도 출력하지 않는다.
// (2026-09-01 진단 출력 블록 제거 — 아이디 평문·비밀번호 길이가 공개돼 있었음)

export const config = { matcher: '/(.*)' };

const UNAUTHORIZED = () =>
  new Response('접근하려면 아이디와 비밀번호가 필요합니다.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="kimbomi-interview", charset="UTF-8"',
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
      'referrer-policy': 'no-referrer'
    }
  });

// 길이 정보가 응답 시간으로 새지 않도록 상수 시간에 가깝게 비교한다.
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const len = Math.max(a.length, b.length);
  let diff = a.length ^ b.length;
  for (let i = 0; i < len; i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

// 설정 누락은 응답으로는 알리지 않되(정보 노출 방지) 서버 로그에는 남긴다.
// Vercel → 프로젝트 → Logs 에서 확인. 이 줄이 찍히면 누가 무엇을 입력해도 로그인이 안 되는 상태다.
// 필요한 환경변수: SITE_USER, SITE_PASS — 둘 다 Production·Preview 모두 체크할 것.
// 값을 등록·수정한 뒤에는 반드시 재배포해야 반영된다(환경변수는 배포 시점에 묶인다).
function logMisconfig(problem) {
  try {
    console.error(
      '[auth-gate] 설정 문제로 모든 로그인이 차단되고 있습니다. ' +
      problem.join(', ') + ' — ' +
      'Vercel → Settings → Environment Variables 등록 후 재배포 필요.'
    );
  } catch (e) {}
}

export default function middleware(request) {
  const rawUser = process.env.SITE_USER;
  const rawPass = process.env.SITE_PASS;

  // 환경변수가 없으면 열지 않고 닫는다(fail closed). 아이디 기본값도 두지 않는다.
  if (rawUser === undefined || rawPass === undefined) {
    const missing = [];
    if (rawUser === undefined) missing.push('SITE_USER 미등록');
    if (rawPass === undefined) missing.push('SITE_PASS 미등록');
    logMisconfig(missing);
    return UNAUTHORIZED();
  }

  const USER = String(rawUser).trim();
  const PASS = String(rawPass).trim();
  if (USER === '' || PASS === '') {
    const empty = [];
    if (USER === '') empty.push('SITE_USER 값이 비어 있음');
    if (PASS === '') empty.push('SITE_PASS 값이 비어 있음');
    logMisconfig(empty);
    return UNAUTHORIZED();
  }

  const header = request.headers.get('authorization') || '';
  if (header.slice(0, 6).toLowerCase() !== 'basic ') return UNAUTHORIZED();

  let gotUser = '', gotPass = '';
  try {
    const decoded = atob(header.slice(6).trim());
    const i = decoded.indexOf(':');
    if (i < 0) return UNAUTHORIZED();
    gotUser = decoded.slice(0, i).trim();
    gotPass = decoded.slice(i + 1).trim();
  } catch (e) {
    return UNAUTHORIZED();
  }

  // 두 비교를 모두 수행해 어느 쪽이 틀렸는지 응답 시간으로 구분되지 않게 한다.
  const userOk = safeEqual(gotUser, USER);
  const passOk = safeEqual(gotPass, PASS);
  if (userOk && passOk) return;

  return UNAUTHORIZED();
}
