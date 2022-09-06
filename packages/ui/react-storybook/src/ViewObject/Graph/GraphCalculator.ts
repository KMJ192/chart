import type { AxisPosition, Area, Padding, Tick, GraphCalculatorParam } from './types';

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

  private canvasSize: Size = {
    width: 0,
    height: 0,
  };

  private axisSize: Size = {
    width: 0,
    height: 0,
  };

  private padding: Padding = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  private tick: Tick<Size> = {
    top: {
      width: 1,
      height: 3,
    },
    bottom: {
      width: 1,
      height: 3,
    },
    left: {
      width: 1,
      height: 3,
    },
    right: {
      width: 1,
      height: 3,
    },
  };

  constructor({ padding, tick }: GraphCalculatorParam) {
    this.padding = padding;

    this.tick = tick;
  }

  // 1.Canvas의 크기 get
  public initCanvasSize = ({ width: canvasWidth, height: canvasHeight }: Size) => {
    this.canvasSize.width = canvasWidth - this.startPoint.xAxis.x;
    this.canvasSize.height = canvasHeight;
  };

  public calcRelations = () => {
    const leftP = this.padding.left * 2;
    const rightP = this.padding.right * 2;

    this.axisSize.width =
      this.canvasSize.width -
      this.startPoint.xAxis.x -
      leftP -
      rightP -
      this.tick.left.height -
      this.tick.right.height;
    this.axisSize.height =
      this.canvasSize.height -
      leftP -
      this.tick.left.height -
      this.padding.bottom -
      this.tick.bottom.height; // 폰트 높이 만큼 수정

    this.startPoint = {
      xAxis: {
        x: leftP + this.tick.left.height,
        y: leftP + this.axisSize.height,
      },
      yAxisLeft: {
        x: leftP + this.tick.left.height,
        y: leftP + this.axisSize.height,
      },
      yAxisRight: {
        x: leftP + this.tick.left.height + this.axisSize.width,
        y: leftP + this.axisSize.height,
      },
    };
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
