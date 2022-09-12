import { hash } from '@src/utils/utils';
import type { CanvasParam, CanvasLayer, CanvasLayerInfo } from './types';

class Canvas {
  private nodeId: string;

  private canvasContainer: HTMLElement;

  private canvasLayer: CanvasLayer[];

  private layerDictionary: { [key: string]: number };

  private width: number;

  private height: number;

  private isAppend: boolean;

  constructor({ nodeId, canvasLayerInfo, width, height }: CanvasParam) {
    const dpr = window.devicePixelRatio;

    this.nodeId = nodeId;

    this.canvasContainer = document.createElement('div');

    this.canvasLayer = [];

    this.layerDictionary = {};

    this.width = width;

    this.height = height;

    canvasLayerInfo.forEach((level: CanvasLayerInfo, idx) => {
      const { type, id, style } = level;
      const canvas = document.createElement('canvas') as HTMLCanvasElement;
      canvas.id = `${id}-${hash(id)}`;
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

      if (style !== undefined) {
        // Set canvas style
        Object.entries(style).forEach(([key, value]) => {
          (canvas.style as ObjectType)[key] = value;
        });
      }

      canvas.style.position = 'absolute';
      canvas.style.width = '100%';

      // Save canvas type
      this.layerDictionary = {
        ...this.layerDictionary,
        [type]: idx,
      };

      // Correction anti aliasing
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      this.canvasContainer.appendChild(canvas);

      this.canvasLayer[idx] = {
        type,
        id,
        canvas,
        ctx,
      };
    });

    this.isAppend = false;
  }

  public correctionCanvas = () => {
    const dpr = window.devicePixelRatio;

    this.canvasLayer.forEach((layer: CanvasLayer) => {
      const { canvas } = layer;
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    });
  };

  public mousePosition = (layerIdx: number, { x, y }: Vector) => {
    const { canvas } = this.canvasLayer[layerIdx];
    const bbox = canvas.getBoundingClientRect();

    return {
      x: (x - bbox.left) * (canvas.width / bbox.width),
      y: (y - bbox.top) * (canvas.height / bbox.height),
    };
  };

  public drawLine = (layerLevel: number, startPosition: Vector, endPosition: Vector) => {
    const { ctx } = this.canvasLayer[layerLevel];

    ctx.save();

    ctx.beginPath();
    ctx.moveTo(startPosition.x, startPosition.y);
    ctx.lineTo(endPosition.x, endPosition.y);
    ctx.stroke();
    ctx.closePath();

    ctx.restore();
  };

  public drawCycle = (layerLevel: number, position: Vector, radius: number, isFill?: boolean) => {
    const { ctx } = this.canvasLayer[layerLevel];
    const { x, y } = position;

    ctx.save();

    // ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    if (isFill) {
      ctx.fill();
    }
    // ctx.closePath();

    ctx.restore();
  };

  public drawText = (layerLevel: number, position: Vector, text: string) => {
    const { ctx } = this.canvasLayer[layerLevel];
    const { x, y } = position;

    ctx.save();

    ctx.fillText(text, x, y);

    ctx.restore();
  };

  // public drawRect = () => {};

  // public drawText = () => {};

  // public clearArea = () => {};

  // public clearCanvas () => {};

  public appendCanvasNode = () => {
    if (!this.isAppend) {
      const node = document.getElementById(this.nodeId);
      node?.appendChild(this.canvasContainer);
    }
  };

  get getCanvas(): CanvasLayer[] {
    return this.canvasLayer;
  }

  get size(): Size {
    return {
      width: this.width,
      height: this.height,
    };
  }
}

export default Canvas;
