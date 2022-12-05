import Canvas from '@src/ViewObject/Canvas';

import type { PieChartParam } from './types';

class PieChart {
  private canvasLayer: Canvas;

  constructor({ nodeId, width, height, canvasLayerInfo }: PieChartParam) {
    this.canvasLayer = new Canvas({ nodeId, width, height, canvasLayerInfo });
  }
}
