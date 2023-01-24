import Canvas from './Canvas';
import type { CanvasLayer } from './Canvas';

// type DataType = Array<{
//   name: string;
//   value: number;
//   color: string;
// }>;
type DataType = {
  total: number;
  // 반지름
  radius: number;
  // pie chart 시작 각도 => 0시, 3시, 6시, 9시
  startDegree: 0 | 3 | 6 | 9;
  name: Array<string>;
  color: Array<string>;
  value: Array<number>;
};

type Params = {
  canvasLayer: CanvasLayer;
};

export default class PieChart {
  // Canvas object
  private canvas: Canvas;

  // 출력 데이터
  private data: DataType;

  constructor(params: Params) {
    this.data = {
      startDegree: 0,
      total: 0,
      radius: 0,
      name: [],
      color: [],
      value: [],
    };

    this.canvas = new Canvas({ canvasLayer: params.canvasLayer });
  }

  public generate = (data: DataType) => {
    this.data = data;
    let curTotal = this.data.total ?? 0;
    if (typeof this.data.total !== 'number') {
      this.data.total = this.data.value.reduce((a, b) => a + b);
    }

    let startDegree = 0;
    if (data.startDegree === 0) {
      startDegree = (Math.PI / 180) * -90;
    } else if (data.startDegree === 3) {
      startDegree = 0;
    } else if (data.startDegree === 6) {
      startDegree = (Math.PI / 180) * 90;
    } else if (data.startDegree === 9) {
      startDegree = (Math.PI / 180) * 180;
    }

    const { canvas, ctx } = this.canvas.layer[0];

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    ctx.clearRect(0, 0, width, height);

    const degree = 360;

    const rate = this.data.value.slice().map((data) => {
      const r = data / this.data.total;
      return degree * r;
    });

    let curDegree = 0;
    const center = {
      x: width / 2,
      y: height / 2,
    };

    // this.test();
    for (let i = 0; i < rate.length; i++) {
      ctx.save();
      ctx.strokeStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.moveTo(center.x, center.y);
      const item = rate[i];
      let start = 0;
      let end = 0;
      if (i === 0) {
        start = startDegree + (Math.PI / 180) * 0;
        end = startDegree + (Math.PI / 180) * item;
        curDegree = item;
      } else {
        start = startDegree + (Math.PI / 180) * curDegree;
        end = startDegree + (Math.PI / 180) * (curDegree + item);
        curDegree += item;
      }
      ctx.arc(center.x, center.y, this.data.radius, start, end, false);

      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }
  };

  private test = () => {
    const { canvas, ctx } = this.canvas.layer[0];

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const center = {
      x: width / 2,
      y: height / 2,
    };
    const startDeg = (Math.PI / 180) * -90;

    let start = startDeg;
    let end = startDeg + (Math.PI / 180) * 40;
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.strokeStyle = '#FFFFFF';
    ctx.moveTo(center.x, center.y);
    ctx.arc(center.x, center.y, 100, start, end, false);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  };
}

export type { DataType as PieChartDataType };
