import type { AxisPosition, Area } from './types';

class GraphCalculator {
  private range: AxisPosition<number> = {
    xAxis: 0,
    yAxisLeft: 0,
    yAxisRight: 0,
  };

  private startPoint: AxisPosition<Vector> = {
    xAxis: {
      x: 0,
      y: 0,
    },
    yAxisLeft: {
      x: 0,
      y: 0,
    },
    yAxisRight: {
      x: 0,
      y: 0,
    },
  };

  private area: Area = {
    start: {
      x: 0,
      y: 0,
    },
    end: {
      x: 0,
      y: 0,
    },
  };

  private width: number;

  private height: number;

  constructor() {
    this.width = 0;
    this.height = 0;
  }

  // 1.Canvas의 크기 get
  public initCanvasSize = ({ width: canvasWidth, height: canvasHeight }: Size) => {
    this.width = canvasWidth - this.startPoint.xAxis.x;
    this.height = canvasHeight;
  };

  get xAxisRange(): number {
    return this.range.xAxis;
  }

  get yAxisLeftRange(): number {
    return this.range.yAxisLeft;
  }

  get yAxisRightRange(): number {
    return this.range.yAxisRight;
  }

  get dataArea() {
    return this.area;
  }

  // public calcMax = () => {};
}

export default GraphCalculator;
