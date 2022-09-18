// number type 확인
function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

// value의 integer type 여부 확인
function isInteger(value: unknown): value is number {
  // number 타입 && 유한 숫자타입 && value의 소수점 버림이 value와 같을 경우 true
  // eslint-disable-next-line no-restricted-globals
  return isNumber(value) && isFinite(value) && Math.floor(value) === value;
}

// pixel 보정
export function crispPixel(pixel: number, thickness = 1) {
  const halfThickness = thickness / 2;

  // 좌표가 홀수일 경우 좌표를 반올림, 내림하여 픽셀 보정
  return thickness % 2
    ? (isInteger(pixel) ? pixel : Math.round(pixel - halfThickness)) + halfThickness
    : Math.round(pixel);
}
