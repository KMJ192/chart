import Canvas from './Canvas';
import type { CanvasLayer } from './Canvas';

// type DataType = Array<{
//   name: string;
//   value: number;
//   color: string;
// }>;
type DataType = {
  name: Array<string>;
  color: Array<string>;
  value: Array<number>;
};

type Params = {
  canvasLayer: CanvasLayer;
};

export default class PieChart {
  private canvasLayer: CanvasLayer;

  private canvas: Canvas;

  private data: DataType;

  private total: number;

  constructor(params: Params) {
    this.canvasLayer = params.canvasLayer;

    this.data = {
      name: [],
      color: [],
      value: [],
    };

    this.total = 0;

    this.canvas = new Canvas({ canvasLayer: this.canvasLayer });
  }

  public generate = (data: DataType) => {
    this.data = data;

    this.total = this.data.value.reduce((a, b) => a + b);

    const degree = 360;

    const rate = this.data.value.slice().map((data) => {
      const r = data / this.total;
      return degree * r;
    });

    let curDegree = 0;
    for (let i = 0; i < rate.length; i++) {
      const item = rate[i];
      if (i === 0) {
        curDegree = item;
      } else {
        curDegree += item;
      }
      console.log(curDegree);
    }
  };
}

export type { DataType as PieChartDataType };
