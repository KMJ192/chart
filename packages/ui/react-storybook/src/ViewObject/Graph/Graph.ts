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

  constructor({ graphType, nodeId, width, height, padding }: Partial<GraphParam>) {
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
      canvasSize: { width: this.canvasSize.width, height: this.canvasSize.height },
      padding: {
        top: padding?.top || 0,
        bottom: padding?.bottom || 0,
        left: padding?.left || 0,
        right: padding?.right || 0,
      },
    });
  }

  public render(data: GraphDataParam, renderOptions?: Partial<RenderOptions>) {
    // 1. canvas 노드 생성
    this.canvas.appendCanvasNode();

    // 2. 그래프 렌더링 옵션 설정
    this.calculator.renderOptionSetter = {
      series: renderOptions?.series,
      axis: renderOptions?.axis,
    };

    // 3. 데이터 유효성 검사
    this.calculator.validationCheck(data);

    // 4. 최대값 최소값 검사 (range 설정)
    this.calculator.setMinMax(data);

    this.calculator.setElementArea();

    this.calculator.display();

    return () => {
      // console.log('unmount');
    };
  }
}

export default Graph;
