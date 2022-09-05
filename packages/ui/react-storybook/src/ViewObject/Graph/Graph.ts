import Canvas from '../Canvas';
import { CanvasLayerInfo } from '../Canvas/types';
import { GraphParam } from './types';

import crypto from 'crypto';

const hashCreator = crypto.createHash('sha512');

class Graph {
  private canvas: Canvas;

  private canvasLayer: CanvasLayerInfo;

  constructor({ nodeId, width, height }: GraphParam) {
    this.canvasLayer = [];

    this.canvas = new Canvas({ nodeId, width, height });
  }
}

export default Graph;
