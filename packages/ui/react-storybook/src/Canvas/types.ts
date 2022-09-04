import type CSS from 'csstype';

interface CanvasLayerInfo {
  type: string;
  id: string;
  style: Omit<Omit<CSS.Properties, 'position'>, 'width'>;
}

interface CanvasLayer extends Omit<CanvasLayerInfo, 'style'> {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}

type CanvasParam = {
  nodeId: string;
  canvasLayer: CanvasLayerInfo[];
  width: number;
  height: number;
};

export type { CanvasParam, CanvasLayer, CanvasLayerInfo };
