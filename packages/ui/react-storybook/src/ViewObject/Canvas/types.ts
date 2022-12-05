import { Properties as CSSProperties } from 'csstype';

type CanvasLayerInfo = {
  type: string;
  id: string;
  style: Omit<Omit<CSSProperties, 'position'>, 'width'>;
};

interface CanvasLayer extends Omit<CanvasLayerInfo, 'style'> {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}

type CanvasParam = {
  nodeId: string;
  width: number;
  height: number;
  canvasLayerInfo: Array<CanvasLayerInfo>;
};

export type { CanvasParam, CanvasLayer, CanvasLayerInfo };
