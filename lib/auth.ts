import crypto from 'crypto';

export type AdminUser = {
  email: string;
  passwordHash?: string; // sha256(salt + password)
  salt?: string;
  role?: 'owner' | 'admin';
};

export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const s = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.createHash('sha256').update(`${s}:${password}`).digest('hex');
  return { hash, salt: s };
}

export function verifyPassword(password: string, salt: string, hash: string): boolean {
  const { hash: h } = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(h), Buffer.from(hash));
}


