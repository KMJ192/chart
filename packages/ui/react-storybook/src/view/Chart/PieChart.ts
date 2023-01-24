import Canvas from './Canvas';
import type { CanvasLayer } from './Canvas';
import Slider from '../Slider/Slider';

type DataType = {
  total: number;
  // 반지름
  radius: number;
  // pie chart 시작 각도 => 0시, 3시, 6시, 9시
  startDegree: 0 | 3 | 6 | 9;
  name: Array<string>;
  color: Array<{
    backgroundColor: string;
    strokeColor: string;
  }>;
  value: Array<number>;
};

type Params = {
  canvasLayer: CanvasLayer;
};

export default class PieChart {
  // Canvas object
  private canvas: Canvas;

  // Slider object
  private slider: Slider;

  // 출력 데이터
  private data: DataType;

  // 나머지 데이터
  private restData: number;

  constructor(params: Params) {
    this.data = {
      startDegree: 0,
      total: 0,
      radius: 0,
      name: [],
      color: [],
      value: [],
    };

    this.restData = 0;

    this.canvas = new Canvas({ canvasLayer: params.canvasLayer });

    this.slider = new Slider({ canvasLayer: params.canvasLayer });
  }

  public generate = (data: DataType) => {
    this.data = data;

    // 시작 각도 계산
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

    this.restData = this.data.total - this.data.value.reduce((a, b) => a + b);
    const drawData: Array<{
      value: number;
      name: string;
      backgroundColor: string;
      strokeColor: string;
      rate: number;
    }> = [];
    for (let i = 0; i < this.data.value.length; i++) {
      const value = this.data.value[i];
      const name = this.data.name[i];
      const { backgroundColor, strokeColor } = this.data.color[i];
      const rate = degree * (value / this.data.total);
      drawData.push({
        rate,
        value,
        name,
        backgroundColor,
        strokeColor,
      });
    }
    drawData.push({
      rate: degree * (this.restData / this.data.total),
      value: this.restData,
      name: '',
      backgroundColor: '',
      strokeColor: '',
    });

    let curDegree = 0;
    const center = {
      x: width / 2,
      y: height / 2,
    };

    for (let i = 0; i < drawData.length; i++) {
      const { rate } = drawData[i];
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(center.x, center.y);
      let start = 0;
      let end = 0;
      if (i === 0) {
        start = startDegree + (Math.PI / 180) * 0;
        end = startDegree + (Math.PI / 180) * rate;
        curDegree = rate;
      } else {
        start = startDegree + (Math.PI / 180) * curDegree;
        end = startDegree + (Math.PI / 180) * (curDegree + rate);
        curDegree += rate;
      }

      ctx.arc(center.x, center.y, this.data.radius, start, end, false);

      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }

    this.test();
  };

  private test = () => {
    const { canvas, ctx } = this.canvas.layer[0];
    ctx.save();
    ctx.scale(1.5, 1.5);
    ctx.restore();
  };
}

export type { DataType as PieChartDataType };
