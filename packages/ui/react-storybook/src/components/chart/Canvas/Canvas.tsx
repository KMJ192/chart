import { forwardRef } from 'react';

import { Properties as CSSType } from 'csstype';

type Props = {
  width: number;
  height: number;
  id?: string;
  className?: string;
  style?: CSSType;
};

const Canvas = forwardRef<HTMLCanvasElement, Props>(
  ({ width, height, id, className, style }, ref) => {
    return (
      <canvas ref={ref} width={width} height={height} id={id} className={className} style={style} />
    );
  },
);

Canvas.defaultProps = {
  id: undefined,
  className: undefined,
  style: undefined,
};

export default Canvas;
