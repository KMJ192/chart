import type { CanvasParam, CanvasLayer, CanvasLayerInfo } from './types';

class Canvas {
  private node: HTMLElement;

  private canvasContainer: HTMLElement;

  private canvasLayer: CanvasLayer[];

  private layerDictionary: { [key: string]: number };

  private width: number;

  private height: number;

  constructor({ nodeId, canvasLayer, width, height }: CanvasParam) {
    const dpr = window.devicePixelRatio;

    this.node = document.getElementById(nodeId) as HTMLElement;

    this.canvasContainer = document.createElement('div');

    this.canvasLayer = [];

    this.layerDictionary = {};

    this.width = width;

    this.height = height;

    canvasLayer.forEach((level: CanvasLayerInfo, idx) => {
      const { type, id, style } = level;
      const canvas = document.createElement('canvas') as HTMLCanvasElement;
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

      // Set canvas style
      Object.entries(style).forEach(([key, value]) => {
        (canvas.style as ObjectType)[key] = value;
      });
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

    this.node.appendChild(this.canvasContainer);
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

  // public drawLine = () => {};

  // public drawCycle = () => {};

  // public drawRect = () => {};

  // public drawText = () => {};

  get canvas() {
    return this.canvasLayer;
  }

  get size() {
    return {
      width: this.width,
      height: this.height,
    };
  }
}

export default Canvas;
