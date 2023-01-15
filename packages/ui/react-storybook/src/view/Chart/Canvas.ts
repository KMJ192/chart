import { RAF } from '@src/utils/utils';

type CanvasLayer = Array<{
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}>;

type Params = {
  canvasLayer: CanvasLayer;
};

export default class Canvas {
  private canvasLayer: CanvasLayer;

  private events: Array<unknown>;

  constructor({ canvasLayer }: Params) {
    this.canvasLayer = canvasLayer;

    this.events = [];
  }

  public correctionCanvas = RAF(() => {
    const dpr = window.devicePixelRatio;

    this.canvasLayer.forEach(({ canvas }) => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    });
  });

  public mousePosition = (layerIdx: number, { x, y }: Vector) => {
    const { canvas } = this.canvasLayer[layerIdx];
    const bBox = canvas.getBoundingClientRect();

    return {
      x: (x - bBox.left) * (canvas.width / bBox.width),
      y: (y - bBox.top) * (canvas.height / bBox.height),
    };
  };

  public zoom = () => {};

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
}

export type { CanvasLayer };
