import { RefObject } from 'react';

import { Properties as CSSType } from 'csstype';

type CanvasProperties = {
  width: number;
  height: number;
  ref?: RefObject<HTMLCanvasElement>;
  id?: string;
  className?: string;
  style?: Omit<Omit<CSSType, 'position'>, 'width'>;
};

export type { CanvasProperties };
