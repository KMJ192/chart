import crypto from 'crypto';

export function makeHash(id: string) {
  return crypto.createHash('sha256').update(id).digest('hex');
}
