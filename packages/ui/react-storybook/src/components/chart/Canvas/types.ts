import { RefObject } from 'react';

import { Properties as CSSType } from 'csstype';

type CanvasProperties = {
  width: number;
  height: number;
  key: string | number;
  ref?: RefObject<HTMLCanvasElement>;
  id?: string;
  className?: string;
  style?: CSSType;
};

export type { CanvasProperties };
