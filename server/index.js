import http from 'node:http';
import crypto from 'node:crypto';

const port = Number(process.env.PORT || 8787);
const username = process.env.OWNER_USERNAME || 'golden_admin';
const password = process.env.OWNER_PASSWORD || 'Golden@2026';
const passwordSalt = process.env.OWNER_PASSWORD_SALT || 'golden-car-auth-v1';
const passwordHash = crypto.scryptSync(password, passwordSalt, 64).toString('hex');
const sessions = new Map();
const attempts = new Map();
const sessionLifetime = 1000 * 60 * 60 * 8;

function sendJson(response, status, payload, headers = {}) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', ...headers });
  response.end(JSON.stringify(payload));
}

function parseCookies(request) {
  return Object.fromEntries((request.headers.cookie || '').split(';').filter(Boolean).map(cookie => {
    const index = cookie.indexOf('=');
    return [cookie.slice(0, index).trim(), decodeURIComponent(cookie.slice(index + 1).trim())];
  }));
}

function isAuthorized(request) {
  const token = parseCookies(request).gc_session;
  const session = token && sessions.get(token);
  if (!session || session.expiresAt < Date.now()) {
    if (token) sessions.delete(token);
    return false;
  }
  session.expiresAt = Date.now() + sessionLifetime;
  return true;
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', chunk => {
      body += chunk;
      if (body.length > 10_000) request.destroy();
    });
    request.on('end', () => {
      try { resolve(JSON.parse(body || '{}')); } catch { reject(new Error('Invalid JSON')); }
    });
    request.on('error', reject);
  });
}

function isRateLimited(ip) {
  const record = attempts.get(ip);
  return record && record.resetAt > Date.now() && record.failures >= 5;
}

function registerFailure(ip) {
  const current = attempts.get(ip);
  const record = current && current.resetAt > Date.now()
    ? current
    : { failures: 0, resetAt: Date.now() + 15 * 60 * 1000 };
  record.failures += 1;
  attempts.set(ip, record);
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const ip = request.socket.remoteAddress || 'unknown';
  response.setHeader('Cache-Control', 'no-store');

  if (url.pathname === '/api/auth/login' && request.method === 'POST') {
    if (isRateLimited(ip)) return sendJson(response, 429, { error: 'Too many attempts' });
    try {
      const body = await readBody(request);
      const submittedHash = crypto.scryptSync(String(body.password || ''), passwordSalt, 64).toString('hex');
      const validUser = String(body.username || '') === username;
      const validPassword = crypto.timingSafeEqual(Buffer.from(submittedHash, 'hex'), Buffer.from(passwordHash, 'hex'));
      if (!validUser || !validPassword) {
        registerFailure(ip);
        return sendJson(response, 401, { error: 'Invalid credentials' });
      }
      attempts.delete(ip);
      const token = crypto.randomBytes(32).toString('hex');
      sessions.set(token, { expiresAt: Date.now() + sessionLifetime });
      return sendJson(response, 200, { authenticated: true }, {
        'Set-Cookie': `gc_session=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${sessionLifetime / 1000}`,
      });
    } catch {
      return sendJson(response, 400, { error: 'Invalid request' });
    }
  }

  if (url.pathname === '/api/auth/me' && request.method === 'GET') {
    return sendJson(response, 200, { authenticated: isAuthorized(request) });
  }

  if (url.pathname === '/api/auth/logout' && request.method === 'POST') {
    const token = parseCookies(request).gc_session;
    if (token) sessions.delete(token);
    return sendJson(response, 200, { authenticated: false }, { 'Set-Cookie': 'gc_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0' });
  }

  sendJson(response, 404, { error: 'Not found' });
});

server.listen(port, () => console.log(`Auth server listening on http://localhost:${port}`));
