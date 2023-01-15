import { forwardRef } from 'react';

import type { Properties as CSSType } from 'csstype';
import Canvas from './Canvas';

import type { CanvasProperties } from './types';

type Props = {
  id: string;
  canvasLayer: Array<CanvasProperties>;
  className?: string;
  style?: CSSType;
};

const CanvasLayer = forwardRef<HTMLDivElement, Props>(
  ({ id, className, canvasLayer, style }, ref) => {
    return (
      <div id={id} className={className} style={style} ref={ref}>
        {canvasLayer.map((info) => {
          return (
            <Canvas
              width={info.width}
              height={info.height}
              ref={info.ref}
              id={info.id}
              className={info.className}
              style={info.style}
            />
          );
        })}
      </div>
    );
  },
);

CanvasLayer.defaultProps = {
  className: undefined,
  style: undefined,
};

export default CanvasLayer;
