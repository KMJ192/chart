import { Properties as CSSProperties } from 'csstype';

interface CanvasLayerInfo {
  type: string;
  id: string;
  style?: Omit<Omit<CSSProperties, 'position'>, 'width'>;
}

interface CanvasLayer extends Omit<CanvasLayerInfo, 'style'> {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}

type CanvasParam = {
  nodeId: string;
  width: number;
  height: number;
  canvasLayerInfo: CanvasLayerInfo[];
};

export type { CanvasParam, CanvasLayer, CanvasLayerInfo };
