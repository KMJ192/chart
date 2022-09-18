import crypto from 'crypto';

export function hash(id: string) {
  return crypto.createHash('sha256').update(id).digest('hex');
}

export function makeCommonRectArea<T>(obj: T): RectArea<T> {
  return {
    top: obj,
    bottom: obj,
    left: obj,
    right: obj,
  };
}

export function makeCommonBowlArea<T>(data: T): BowlArea<T> {
  return {
    bottom: data,
    left: data,
    right: data,
  };
}
