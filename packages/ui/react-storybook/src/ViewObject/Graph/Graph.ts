import { isEqual } from 'lodash';

import Canvas from '../Canvas';
import Calculator from './Calculator';
import Draw from './Draw';

import type { CanvasLayerInfo } from '../Canvas/types';
import type { GraphDataParam, GraphType, GraphParam, RenderOptions } from './types';
import { throttle } from 'lodash';

class Graph {
  private graphType: GraphType;

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

  private canvasSize: Size = {
    width: 1800,
    height: 700,
  };

  private data?: GraphDataParam;

  private renderOptions?: Partial<RenderOptions>;

  constructor({ graphType, nodeId, width, height, padding, tickSize }: Partial<GraphParam>) {
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
      graphType,
      padding: {
        top: padding?.top || 10,
        bottom: padding?.bottom || 10,
        left: padding?.left || 10,
        right: padding?.right || 10,
      },
      tickSize: {
        bottom: {
          width: tickSize?.bottom?.width || 1,
          height: tickSize?.bottom?.height || 7,
        },
        left: {
          width: tickSize?.left?.width || 1,
          height: tickSize?.left?.height || 7,
        },
        right: {
          width: tickSize?.right?.width || 1,
          height: tickSize?.right?.height || 7,
        },
      },
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
    // 3. 데이터 유효성 검사
    this.calculator.validationCheck(this.data);

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

  public render(data: GraphDataParam, renderOptions?: Partial<RenderOptions>) {
    this.canvas.appendCanvasNode();

    const isUpdateData = !isEqual(this.data, data);
    const isUpdateRenderOption = !isEqual(this.renderOptions, renderOptions);

    if (!isUpdateData && !isUpdateRenderOption) {
      return null;
    }

    if (isUpdateData) {
      this.data = data;
    }

    if (isUpdateRenderOption) {
      this.renderOptions = renderOptions;
    }

    this.canvas.addEvents(this.canvasResize);

    this.draw();

    return () => {
      this.canvas.removeEvents();
    };
  }
}

export default Graph;
