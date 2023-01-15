import Canvas from './Canvas';
import type { CanvasLayer } from './Canvas';

type DataType = Array<{
  name: string;
  value: number;
  color: string;
}>;

type Params = {
  canvasLayer: CanvasLayer;
};

export default class PieChart {
  private canvasLayer: CanvasLayer;

  private canvas: Canvas;

  private data: DataType;

  constructor(params: Params) {
    this.canvasLayer = params.canvasLayer;

    this.data = [];

    this.canvas = new Canvas({ canvasLayer: this.canvasLayer });
  }

  public initData = (data: DataType) => {
    this.data = data;
  };
}

export type { DataType as PieChartDataType };
