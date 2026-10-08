import crypto from 'crypto';

const getSecret = () => process.env.JWT_SECRET || 'cleaner-super-secret-key';

export const generateToken = (payload, expiresInMs = 7 * 24 * 60 * 60 * 1000) => {
  const secret = getSecret();
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const exp = Date.now() + expiresInMs;
  const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString('base64url');
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${header}.${body}`)
    .digest('base64url');
  return `${header}.${body}.${signature}`;
};

export const verifyToken = (token) => {
  try {
    if (!token) return { valid: false, error: 'Token missing' };
    const parts = token.split('.');
    if (parts.length !== 3) return { valid: false, error: 'Malformed token' };
    const [header, body, signature] = parts;
    const secret = getSecret();
    const expectedSig = crypto
      .createHmac('sha256', secret)
      .update(`${header}.${body}`)
      .digest('base64url');
    if (signature !== expectedSig) return { valid: false, error: 'Invalid signature' };
    const decoded = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (decoded.exp && Date.now() > decoded.exp) {
      return { valid: false, error: 'Token expired' };
    }
    return { valid: true, decoded };
  } catch (err) {
    return { valid: false, error: err.message };
  }
};

export default {
  generateToken,
  verifyToken,
};
