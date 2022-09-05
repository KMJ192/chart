import type { GraphParam } from './types';

import Canvas from '../Canvas';
import type { CanvasLayerInfo } from '../Canvas/types';

class Graph {
  private canvas: Canvas;

  private canvasLayerInfo: CanvasLayerInfo[];

  constructor({ nodeId, width, height, style }: GraphParam) {
    this.canvasLayerInfo = [
      {
        type: 'main',
        id: 'data-graph',
        style,
      },
      {
        type: 'animation',
        id: 'guide-line',
        style,
      },
      {
        type: 'static',
        id: 'data-static',
        style,
      },
    ];

    this.canvas = new Canvas({ nodeId, width, height, canvasLayerInfo: this.canvasLayerInfo });
  }
}

export default Graph;
