import _ from 'lodash';

import Canvas from '../Canvas';
import Calculator from './Calculator';
import Draw from './Draw';

import type { CanvasLayerInfo } from '../Canvas/types';
import type { GraphDataParam, GraphParam, RenderOptions } from './types';
import { throttle } from 'lodash';

class Graph {
  private canvas: Canvas;

  private calculator: Calculator;

  private drawObj: Draw;

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

  private canvasSize: Size;

  private data?: GraphDataParam;

  private renderOptions?: Partial<RenderOptions>;

  constructor({ nodeId, width, height, padding, axis }: GraphParam) {
    if (!nodeId) throw Error('Necessary value : nodeId ');

    this.canvasSize = {
      width,
      height,
    };

    this.canvas = new Canvas({
      nodeId,
      canvasLayerInfo: this.canvasLayerInfo,
      width: this.canvasSize.width,
      height: this.canvasSize.height,
    });

    this.calculator = new Calculator({
      padding: {
        top: padding.top,
        bottom: padding.bottom,
        left: padding.left,
        right: padding.right,
      },
      axis,
    });

    this.drawObj = new Draw({ calculator: this.calculator });
  }

  private draw = () => {
    this.canvas.correctionCanvas();

    const canvasLayer = this.canvas.getCanvasLayer;

    // 2. 그래프 렌더링 옵션 설정
    this.calculator.renderOptionSetter = {
      series: this.renderOptions?.series,
      axis: this.renderOptions?.axis,
      data: this.data,
    };

    if (this.data) {
      // 4. 최대값 최소값 설정
      this.calculator.setMinMax(this.data);

      // 5. axis 데이터 별 range 설정
      this.calculator.setRange(this.data.axis);

      // 6. 크기 설정
      this.calculator.setSize(canvasLayer[0].canvas);

      // 7. axis 별 시작점 설정
      this.calculator.setStartPoint();

      // 8. 그래프 내부 영역
      this.calculator.setArea();

      // 9. series 차지 영역
      this.calculator.setElementArea();

      // 10. axis 스타일 설정
      this.calculator.setAxisStyle(this.data.axis);

      // 11. draw axis info
      this.drawObj.drawAxisInfo(canvasLayer[0], this.data.axis);

      // 12. draw series
      this.drawObj.drawSeries(canvasLayer[0], this.data.series);

      // 13. draw axis
      this.drawObj.drawAxis(canvasLayer[0]);
    }
  };

  private canvasResize = () => {
    const resizeEvent = throttle(() => {
      this.draw();
    }, 800);

    window.addEventListener('resize', resizeEvent);
    return () => {
      window.removeEventListener('resize', resizeEvent);
    };
  };

  public render(data: GraphDataParam, renderOptions?: RenderOptions) {
    this.canvas.appendCanvasNode();

    const isUpdateData = !_.isEqual(this.data, data);
    const isUpdateRenderOption = !_.isEqual(this.renderOptions, renderOptions);

    if (!isUpdateData && !isUpdateRenderOption) {
      return null;
    }

    if (isUpdateData) {
      this.data = data;
    }

    if (isUpdateRenderOption) {
      this.renderOptions = renderOptions;
    }

    if (isUpdateData || isUpdateRenderOption) {
      this.canvas.addEvents(this.canvasResize);

      this.draw();
    }

    return () => {
      this.canvas.removeEvents();
    };
  }
}

export default Graph;
