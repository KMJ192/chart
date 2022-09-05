import crypto from 'crypto';

export function hash(id: string) {
  return crypto.createHash('sha256').update(id).digest('hex');
}
