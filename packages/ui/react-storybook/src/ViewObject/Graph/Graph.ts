// Graph Type
import type { AxisData, Series, SeriesData, GraphParam, GraphType, RenderOptions } from './types';

// Canvas Obj Info
import Canvas from '../Canvas';
import type { CanvasLayerInfo } from '../Canvas/types';
import GraphCalculator from './GraphCalculator';

class Graph {
  private canvas?: Canvas;

  private calculator: GraphCalculator;

  private graphType: GraphType = 'line';

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

  private size: Size = {
    width: 1800,
    height: 700,
  };

  private axis: AxisData = {
    xAxis: {
      name: 'x',
      max: 0,
      min: 0,
      unitsPerTick: 1,
      tickHeight: 3,
      tickColor: '#000',
      output: ['0'],
    },
    yAxisLeft: {
      name: 'y-left',
      max: 0,
      min: 0,
      unitsPerTick: 1,
      tickHeight: 3,
      tickColor: '#000',
      output: ['0'],
    },
    yAxisRight: {
      name: 'y-right',
      max: 0,
      min: 0,
      unitsPerTick: 1,
      tickHeight: 3,
      tickColor: '#000',
      output: ['0'],
    },
  };

  private series: SeriesData = {
    yLeft: [],
    yRight: [],
  };

  constructor({ nodeId, width, height, graphType, style, axis, series }: Partial<GraphParam>) {
    if (width) {
      this.size.width = width;
    }

    if (height) {
      this.size.height = height;
    }

    if (graphType) {
      this.graphType = graphType;
    }

    this.canvasLayerInfo[0].style = style;

    if (axis?.xAxis) {
      this.axis.xAxis = axis.xAxis;
    }

    if (axis?.yAxisLeft) {
      this.axis.yAxisLeft = axis.yAxisLeft;
    }

    if (axis?.yAxisRight) {
      this.axis.yAxisRight = axis.yAxisRight;
    }

    if (series?.yLeft) {
      series.yLeft.forEach(
        ({ name, color, lineWidth, series: s }: Partial<Series>, idx: number) => {
          this.series.yLeft[idx].name = name;
          this.series.yLeft[idx].color = color;
          this.series.yLeft[idx].lineWidth = lineWidth;
          this.series.yLeft[idx].series = s;
        },
      );
    }

    if (series?.yRight) {
      series.yRight.forEach(
        ({ name, color, lineWidth, series: s }: Partial<Series>, idx: number) => {
          this.series.yRight[idx].name = name;
          this.series.yRight[idx].color = color;
          this.series.yRight[idx].lineWidth = lineWidth;
          this.series.yRight[idx].series = s;
        },
      );
    }

    if (nodeId) {
      this.canvas = new Canvas({
        nodeId,
        width: this.size.width,
        height: this.size.height,
        canvasLayerInfo: this.canvasLayerInfo,
      });
    }

    this.calculator = new GraphCalculator();
  }

  public render = (options: Partial<RenderOptions>) => {
    // if (options.legend) {}
    // if (options.tick) {}
    // if (options.tooltip) {}

    this.canvas?.appendCanvasNode();
    // this.canvas?.size;

    return () => {
      console.log('unmount');
    };
  };
}

export default Graph;
