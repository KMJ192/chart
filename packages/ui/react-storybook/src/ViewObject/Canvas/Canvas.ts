import type { CanvasParam, CanvasLayer, CanvasLayerInfo } from './types';

class Canvas {
  private nodeId: string;

  private canvasContainer: HTMLElement;

  private canvasLayer: CanvasLayer[];

  private layerDictionary: { [key: string]: number };

  private isAppend: boolean;

  private events: Array<unknown>;

  constructor({ nodeId, canvasLayerInfo, width, height }: CanvasParam) {
    const dpr = window.devicePixelRatio;

    this.nodeId = nodeId;

    this.canvasContainer = document.createElement('div');

    this.canvasLayer = [];

    this.layerDictionary = {};

    canvasLayerInfo.forEach((level: CanvasLayerInfo, idx) => {
      const { type, id, style } = level;
      const canvas = document.createElement('canvas') as HTMLCanvasElement;
      canvas.id = id;
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

      // Set canvas style
      // if (style !== undefined) {
      Object.entries(style).forEach(([key, value]) => {
        (canvas.style as ObjectType)[key] = value;
      });
      // }

      canvas.style.position = 'absolute';
      canvas.style.width = '100%';

      // Save canvas type
      this.layerDictionary = {
        ...this.layerDictionary,
        [type]: idx,
      };

      // anti aliasing
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      this.canvasContainer.style.position = 'relative';
      this.canvasContainer.appendChild(canvas);

      this.canvasLayer[idx] = {
        type,
        id,
        canvas,
        ctx,
      };
    });

    this.isAppend = false;

    this.events = [];
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

  public appendCanvasNode = () => {
    if (!this.isAppend) {
      const node = document.getElementById(this.nodeId);
      node?.appendChild(this.canvasContainer);
    }
  };

  public addEvents = (event: () => (() => void | unknown) | Array<() => () => void | unknown>) => {
    if (Array.isArray(event)) {
      for (let i = 0; i < event.length; i++) {
        this.events.push(event[i]());
      }
      return;
    }
    this.events.push(event());
  };

  public removeEvents = () => {
    for (let i = 0; i < this.events.length; i++) {
      const retFunc = this.events[i];
      if (typeof retFunc === 'function') {
        retFunc();
      }
    }
  };

  get getCanvasLayer(): CanvasLayer[] {
    return this.canvasLayer;
  }
}

export default Canvas;
