import { forwardRef } from 'react';

import type { Properties as CSSType } from 'csstype';

import Canvas from './Canvas';
import type { CanvasProperties } from './types';

type Props = {
  canvasLayer: Array<CanvasProperties>;
  id?: string;
  className?: string;
  style?: CSSType;
};

const CanvasLayer = forwardRef<HTMLDivElement, Props>(
  ({ id, className, canvasLayer, style }, ref) => {
    return (
      <div
        id={id}
        className={className}
        style={{
          ...style,
          position: 'relative',
        }}
        ref={ref}
      >
        {canvasLayer.map((info, idx) => {
          return (
            <Canvas
              key={`${info.key}-${idx}`}
              width={info.width}
              height={info.height}
              ref={info.ref}
              id={info.id}
              className={info.className}
              style={{
                ...info.style,
                position: 'absolute',
              }}
            />
          );
        })}
      </div>
    );
  },
);

CanvasLayer.defaultProps = {
  id: undefined,
  className: undefined,
  style: undefined,
};

export default CanvasLayer;
