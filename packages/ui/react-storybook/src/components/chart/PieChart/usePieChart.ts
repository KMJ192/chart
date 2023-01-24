import { RefObject, useEffect } from 'react';

import PieChart from '@src/view/Chart/PieChart';
import type { PieChartDataType } from '@src/view/Chart/PieChart';

type Props = {
  canvasLayerRef: RefObject<HTMLDivElement>;
  canvasRef: RefObject<HTMLCanvasElement>;
  data: PieChartDataType;
};

function usePieChart({ canvasLayerRef, canvasRef, data }: Props) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const canvasLayer = [
        {
          canvas,
          ctx: canvas.getContext('2d') as CanvasRenderingContext2D,
        },
      ];
      const pieChart = new PieChart({ canvasLayer });
      pieChart.generate(data);
    }
  }, []);
}

export default usePieChart;
