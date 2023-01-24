import { useRef, forwardRef, useEffect } from 'react';
import type { Properties as CSSType } from 'csstype';

import CanvasLayer from '../Canvas/CanvasLayer';

import type { CanvasProperties } from '../Canvas/types';

import usePieChart from './usePieChart';

import type { PieChartDataType } from '@src/view/Chart/PieChart';

type Props = {
  width: number;
  height: number;
  data: PieChartDataType;
  id?: string;
  className?: string;
  style?: CSSType;
};

// https://lts0606.tistory.com/292

const PieChart = forwardRef<HTMLDivElement, Props>(
  ({ width, height, id, data, className, style }, ref) => {
    const canvasLayerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const canvasPropertiesRef = useRef<Array<CanvasProperties>>([
      {
        width,
        height,
        key: 0,
        ref: canvasRef,
      },
    ]);

    usePieChart({ canvasLayerRef, canvasRef, data });

    return (
      <CanvasLayer
        id={id}
        className={className}
        style={style}
        ref={canvasLayerRef}
        canvasLayer={canvasPropertiesRef.current}
      />
    );
  },
);

export type { Props as PieChartProps };
export default PieChart;
