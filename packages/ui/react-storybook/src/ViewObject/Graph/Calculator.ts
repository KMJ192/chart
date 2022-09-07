// import type {
//   Axis,
//   AxisPosition,
//   Area,
//   Padding,
//   Tick,
//   GraphCalculatorParam,
//   MinMax,
//   AxisData,
//   SeriesData,
//   Series,
// } from './types';

import type { Axis, CalculatorParam, Series } from './types';

// class GraphCalculator {
//   private range: AxisPosition<number> = {
//     xAxis: 0,
//     yAxisLeft: 0,
//     yAxisRight: 0,
//   };

//   private min_max: AxisPosition<MinMax> = {
//     xAxis: {
//       min: 0,
//       max: 0,
//     },
//     yAxisLeft: {
//       min: 0,
//       max: 0,
//     },
//     yAxisRight: {
//       min: 0,
//       max: 0,
//     },
//   };

//   private startPoint: AxisPosition<Vector> = {
//     xAxis: {
//       x: 0,
//       y: 0,
//     },
//     yAxisLeft: {
//       x: 0,
//       y: 0,
//     },
//     yAxisRight: {
//       x: 0,
//       y: 0,
//     },
//   };

//   private area: Area = {
//     start: {
//       x: 0,
//       y: 0,
//     },
//     end: {
//       x: 0,
//       y: 0,
//     },
//   };

//   private canvasSize: Size = {
//     width: 0,
//     height: 0,
//   };

//   private axisSize: Size = {
//     width: 0,
//     height: 0,
//   };

//   private padding: Padding = {
//     top: 0,
//     bottom: 0,
//     left: 0,
//     right: 0,
//   };

//   private tick: Tick<Size> = {
//     top: {
//       width: 1,
//       height: 3,
//     },
//     bottom: {
//       width: 1,
//       height: 3,
//     },
//     left: {
//       width: 1,
//       height: 3,
//     },
//     right: {
//       width: 1,
//       height: 3,
//     },
//   };

//   constructor({ padding, tick }: GraphCalculatorParam) {
//     this.padding = padding;

//     this.tick = tick;
//   }

//   // 1.Canvas의 크기 get
//   public initCanvasSize = ({ width: canvasWidth, height: canvasHeight }: Size) => {
//     this.canvasSize.width = canvasWidth - this.startPoint.xAxis.x;
//     this.canvasSize.height = canvasHeight;
//   };

//   public calcRelations = () => {
//     const leftP = this.padding.left * 2;
//     const rightP = this.padding.right * 2;

//     this.axisSize.width =
//       this.canvasSize.width -
//       this.tick.left.height -
//       leftP -
//       leftP -
//       rightP -
//       this.tick.left.height -
//       this.tick.right.height;
//     this.axisSize.height =
//       this.canvasSize.height -
//       this.tick.left.height -
//       leftP -
//       this.padding.bottom -
//       this.tick.bottom.height; // 폰트 높이 만큼 수정

//     const startPointX = leftP + this.tick.left.height;
//     const startPointY = leftP + this.axisSize.height;
//     this.startPoint = {
//       xAxis: {
//         x: startPointX,
//         y: startPointY,
//       },
//       yAxisLeft: {
//         x: startPointX,
//         y: startPointY,
//       },
//       yAxisRight: {
//         x: startPointX + this.axisSize.width,
//         y: startPointY,
//       },
//     };
//   };

//   set setMinMax({ axis, series }: { axis: AxisData; series: SeriesData }) {
//     if (typeof axis.xAxis.max === 'number' && axis.xAxis.max > 0) {
//       // axis에 max값을 직접 입력 해준 경우
//       this.min_max.xAxis.max = axis.xAxis.max;
//     } else if (axis.xAxis.output) {
//       // max값이 없지만 output 배열이 있을 경우
//       this.min_max.xAxis.max = axis.xAxis.output.length;
//     } else {
//       // max값도 없고, output 배열도 없는 경우
//       // series에서 가장 긴 값을 max로 설정
//       series.yLeft.forEach((s: Partial<Series>) => {
//         this.min_max.xAxis.max = Math.max(s.series?.length || 0, this.min_max.xAxis.max);
//       });

//       series.yRight.forEach((s: Partial<Series>) => {
//         this.min_max.xAxis.max = Math.max(s.series?.length || 0, this.min_max.xAxis.max);
//       });
//     }

//     if (typeof axis.xAxis.min === 'number' && axis.xAxis.min !== 0) {
//       this.min_max.xAxis.min = axis.xAxis.min;
//     }
//   }

//   // set xAxisMinMax(xAxis: Partial<Axis>) {
//   //   if (typeof xAxis.max === 'number') {
//   //     this.min_max.xAxis.max = xAxis.max;
//   //   } else if (xAxis.output) {
//   //     this.min_max.xAxis.max = xAxis.output.length - 1;
//   //   }
//   //   if (typeof xAxis.min === 'number') {
//   //     this.min_max.xAxis.min = xAxis.min;
//   //   }
//   // }

//   // set yAxisLeftMinMax({ min, max }: MinMax) {
//   //   this.min_max.yAxisLeft = {
//   //     min,
//   //     max,
//   //   };
//   // }

//   // set yAxisRightMinMax({ min, max }: MinMax) {
//   //   this.min_max.yAxisRight = {
//   //     min,
//   //     max,
//   //   };
//   // }

//   get xAxisRange(): number {
//     return this.range.xAxis;
//   }

//   get yAxisLeftRange(): number {
//     return this.range.yAxisLeft;
//   }

//   get yAxisRightRange(): number {
//     return this.range.yAxisRight;
//   }

//   get dataArea() {
//     return this.area;
//   }

//   // public calcMax = () => {};
// }

// export default GraphCalculator;

class Calculator {
  private max: RectArea<number> = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  private min: RectArea<number> = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  private padding: RectArea<number> = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  private canvasSize: Size = {
    width: 0,
    height: 0,
  };

  private tickSize: RectArea<Size> = {
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

  private range: RectArea<number> = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  private scale: number;

  private startPoint: RectArea<Vector> = {
    top: {
      x: 0,
      y: 0,
    },
    bottom: {
      x: 0,
      y: 0,
    },
    left: {
      x: 0,
      y: 0,
    },
    right: {
      x: 0,
      y: 0,
    },
  };

  private elementArea: RectArea<number> = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  private canvasArea: Bounds<Vector> = {
    start: {
      x: 0,
      y: 0,
    },
    end: {
      x: 0,
      y: 0,
    },
  };

  constructor({ canvasSize }: CalculatorParam) {
    this.canvasSize = canvasSize;

    this.scale = 0;
  }

  public setMinMax = (axis: RectArea<Axis>, series: RectArea<Series>) => {
    if (axis.bottom.max > 0) {
      this.max.bottom = axis.bottom.max;
    } else {
    }
  };
}

export default Calculator;
