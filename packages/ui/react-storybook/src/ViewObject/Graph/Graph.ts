// // Graph Type
// import type {
//   AxisData,
//   Series,
//   SeriesData,
//   GraphParam,
//   GraphType,
//   RenderOptions,
//   Padding,
//   Tick,
// } from './types';

import Canvas from '../Canvas';
import { CanvasLayerInfo } from '../Canvas/types';
import Calculator from './Calculator';
import type { GraphDataParam, GraphType, GraphParam, RenderOptions } from './types';

// // Canvas Obj Info
// import Canvas from '../Canvas';
// import type { CanvasLayerInfo } from '../Canvas/types';
// import GraphCalculator from './GraphCalculator';

// class Graph {
//   private canvas?: Canvas;

//   private calculator: GraphCalculator;

//   private graphType: GraphType = 'line';

//   private canvasLayerInfo: CanvasLayerInfo[] = [
//     {
//       type: 'main',
//       id: 'main-layer',
//     },
//     {
//       type: 'animation',
//       id: 'animation-layer',
//     },
//     {
//       type: 'static',
//       id: 'static-layer',
//     },
//   ];

//   private size: Size = {
//     width: 1800,
//     height: 700,
//   };

//   private axis: AxisData = {
//     xAxis: {
//       name: 'x',
//       max: 0,
//       min: 0,
//       unitsPerTick: 1,
//       tickHeight: 3,
//       tickColor: '#000',
//       output: [],
//     },
//     yAxisLeft: {
//       name: 'y-left',
//       max: 0,
//       min: 0,
//       unitsPerTick: 1,
//       tickHeight: 3,
//       tickColor: '#000',
//       output: [],
//     },
//     yAxisRight: {
//       name: 'y-right',
//       max: 0,
//       min: 0,
//       unitsPerTick: 1,
//       tickHeight: 3,
//       tickColor: '#000',
//       output: [],
//     },
//   };

//   private series: SeriesData = {
//     yLeft: [],
//     yRight: [],
//   };

//   constructor({
//     nodeId,
//     width,
//     height,
//     graphType,
//     style,
//     axis,
//     series,
//     padding,
//     tick,
//   }: Partial<GraphParam>) {
//     if (width) {
//       this.size.width = width;
//     }

//     if (height) {
//       this.size.height = height;
//     }

//     if (graphType) {
//       this.graphType = graphType;
//     }

//     this.canvasLayerInfo[0].style = style;

//     if (axis?.xAxis) {
//       this.axis.xAxis = axis.xAxis;
//     }

//     if (axis?.yAxisLeft) {
//       this.axis.yAxisLeft = axis.yAxisLeft;
//     }

//     if (axis?.yAxisRight) {
//       this.axis.yAxisRight = axis.yAxisRight;
//     }

//     if (series?.yLeft) {
//       series.yLeft.forEach(
//         ({ name, color, lineWidth, series: s }: Partial<Series>, idx: number) => {
//           this.series.yLeft[idx].name = name;
//           this.series.yLeft[idx].color = color;
//           this.series.yLeft[idx].lineWidth = lineWidth;
//           this.series.yLeft[idx].series = s;
//         },
//       );
//     }

//     if (series?.yRight) {
//       series.yRight.forEach(
//         ({ name, color, lineWidth, series: s }: Partial<Series>, idx: number) => {
//           this.series.yRight[idx].name = name;
//           this.series.yRight[idx].color = color;
//           this.series.yRight[idx].lineWidth = lineWidth;
//           this.series.yRight[idx].series = s;
//         },
//       );
//     }

//     if (nodeId) {
//       this.canvas = new Canvas({
//         nodeId,
//         width: this.size.width,
//         height: this.size.height,
//         canvasLayerInfo: this.canvasLayerInfo,
//       });
//     }

//     this.calculator = new GraphCalculator({
//       padding: {
//         top: padding?.top || 0,
//         bottom: padding?.bottom || 0,
//         left: padding?.left || 0,
//         right: padding?.right || 0,
//       },
//       tick: {
//         top: {
//           height: tick?.top?.height || 3,
//           width: tick?.top?.width || 1,
//         },
//         bottom: {
//           height: tick?.bottom?.height || 3,
//           width: tick?.bottom?.width || 1,
//         },
//         left: {
//           height: tick?.left?.height || 3,
//           width: tick?.left?.width || 1,
//         },
//         right: {
//           height: tick?.right?.height || 3,
//           width: tick?.right?.width || 1,
//         },
//       },
//     });
//   }

//   public render = (options: Partial<RenderOptions>) => {
//     // if (options.legend) {}
//     // if (options.tick) {}
//     // if (options.tooltip) {}
//     if (this.canvas) {
//       this.canvas.appendCanvasNode();
//       const {
//         size: { width, height },
//       } = this.canvas;
//       this.calculator.initCanvasSize({ width, height });
//     }

//     return () => {
//       console.log('unmount');
//     };
//   };
// }

// export default Graph;

class Graph {
  private graphType: GraphType;

  private canvas: Canvas;

  private calculator: Calculator;

  private canvasLayerInfo: CanvasLayerInfo[] = [
    {
      type: 'main',
      id: 'main-layer',
    },
    {
      type: 'animation',
      id: 'animation-layer',
    },
    {
      type: 'static',
      id: 'static-layer',
    },
  ];

  private canvasSize: Size = {
    width: 1800,
    height: 700,
  };

  constructor({ graphType, nodeId, width, height }: Partial<GraphParam>) {
    if (!nodeId) throw Error('Necessary value : nodeId ');
    if (!graphType) throw Error('Necessary value : graphType');

    this.graphType = graphType || 'line';

    this.canvasSize.width = width || 1800;
    this.canvasSize.height = height || 700;

    this.canvas = new Canvas({
      nodeId,
      canvasLayerInfo: this.canvasLayerInfo,
      width: this.canvasSize.width,
      height: this.canvasSize.height,
    });

    this.calculator = new Calculator({
      canvasSize: { width: this.canvasSize.width, height: this.canvasSize.height },
    });
  }

  public render(data: GraphDataParam, renderOptions: RenderOptions) {
    this.canvas.appendCanvasNode();

    this.calculator.setMinMax(data.axis, data.series);

    return () => {
      console.log('unmount');
    };
  }
}

export default Graph;
