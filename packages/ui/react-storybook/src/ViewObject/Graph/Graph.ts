import Canvas from '../Canvas';
import Calculator from './Calculator';

import type { CanvasLayerInfo } from '../Canvas/types';
import type { GraphDataParam, GraphType, GraphParam, RenderOptions } from './types';

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

    this.graphType = graphType;

    this.canvasSize.width = width || this.canvasSize.width;
    this.canvasSize.height = height || this.canvasSize.height;

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

  public render(data: GraphDataParam, renderOptions?: Partial<RenderOptions>) {
    this.canvas.appendCanvasNode();
    this.calculator.setMinMax(data);

    return () => {
      console.log('unmount');
    };
  }
}

export default Graph;
