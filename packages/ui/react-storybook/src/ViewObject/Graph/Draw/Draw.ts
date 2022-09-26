import Calculator from '../Calculator';

import type { DrawParam } from './types';
import type { CanvasLayer } from '@src/ViewObject/Canvas/types';
import { crispPixel } from '@src/ViewObject/Canvas/utils';
import { Axis } from '../types';

class Draw {
  private calculator: Calculator;

  constructor({ calculator }: DrawParam) {
    this.calculator = calculator;
  }

  // Draw axis
  public drawAxis = (layer: CanvasLayer) => {
    const renderOption = this.calculator.renderOptionGetter;
    if (!renderOption.axis.bottom && !renderOption.axis.left && !renderOption.axis.right) {
      return;
    }

    const { ctx } = layer;
    const axisStyle = this.calculator.axisStyleGetter;
    const startPoint = this.calculator.axisStartPointGetter;
    const { width, height } = this.calculator.sizeGetter;

    ctx.save();

    if (renderOption.axis.bottom) {
      const { lineColor, lineWidth } = axisStyle.bottom;
      const { x, y } = startPoint.bottom;

      const xPoint = x;
      const yPoint = crispPixel(y, lineWidth);
      // const yPoint = y;

      ctx.strokeStyle = lineColor;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(xPoint, yPoint);
      ctx.lineTo(xPoint + width, yPoint);
      ctx.stroke();
      ctx.closePath();
    }

    if (renderOption.axis.left) {
      const { lineColor, lineWidth } = axisStyle.left;
      const { x, y } = startPoint.left;

      const xPoint = crispPixel(x, lineWidth);
      // const xPoint = x;
      const yPoint = y;

      ctx.strokeStyle = lineColor;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(xPoint, yPoint);
      ctx.lineTo(xPoint, yPoint - height);
      ctx.stroke();
      ctx.closePath();
    }

    if (renderOption.axis.right) {
      const { lineColor, lineWidth } = axisStyle.right;
      const { x, y } = startPoint.right;

      ctx.strokeStyle = lineColor;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y - height);
      ctx.stroke();
      ctx.closePath();
    }

    ctx.restore();
  };

  // Draw axis information
  public drawAxisInfo = (layer: CanvasLayer, axis: Partial<BowlArea<Partial<Axis>>>) => {
    const renderOption = this.calculator.renderOptionGetter;
    if (!renderOption.axis.bottom && !renderOption.axis.left && !renderOption.axis.right) {
      return;
    }
    const { ctx } = layer;
    const range = this.calculator.rangeGetter;
    const size = this.calculator.sizeGetter;
    const elementArea = this.calculator.elementAreaGetter;
    const startPoint = this.calculator.startPointerGetter;
    const axisStyle = this.calculator.axisStyleGetter;
    const minMax = this.calculator.minMaxGetter;

    ctx.save();

    // ==================== 1. Draw bottom x ====================
    if (renderOption.axis.bottom) {
      const {
        tickSize: { height: tickHeight, width: tickWidht },
        tickPosition,
        lineColor,
        font,
        fontColor,
        lineWidth,
      } = axisStyle.bottom;

      const unitsPerTick = axis.bottom?.unitsPerTick || 1;

      ctx.strokeStyle = lineColor;
      ctx.lineWidth = tickWidht;
      ctx.font = font;
      ctx.fillStyle = fontColor;

      const yPoint = (() => {
        if (tickPosition === 'in') {
          return startPoint.bottom.y - tickHeight - lineWidth;
        }
        if (tickPosition === 'middle') {
          return startPoint.bottom.y - tickHeight / 2;
        }
        if (tickPosition === 'out') {
          return startPoint.bottom.y;
        }
        return startPoint.bottom.y;
      })();
      for (let i = 0; i <= range.bottom; i += unitsPerTick) {
        const xPoint = crispPixel(i * elementArea.bottom + startPoint.bottom.x, tickWidht);

        ctx.beginPath();

        if (renderOption.axisInfo.bottom.tick) {
          ctx.moveTo(xPoint, yPoint);
          ctx.lineTo(xPoint, yPoint + tickHeight);
          ctx.stroke();
        }

        if (renderOption.axisInfo.bottom.outputText) {
          let value = '';
          if (axis.bottom?.output && axis.bottom.output[i] !== undefined) {
            value = axis.bottom.output[i];
          } else {
            value = String(i);
          }
          const metrics = ctx.measureText(value);
          const { width: fontWidth } = metrics;
          const fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;

          ctx.fillText(value, xPoint - fontWidth / 2, yPoint + tickHeight + fontHeight);
        }

        if (renderOption.verticalGuideLine) {
          ctx.moveTo(xPoint, yPoint);
          ctx.lineTo(xPoint, yPoint - size.height);
          ctx.stroke();
        }

        ctx.closePath();
      }

      if (range.bottom % unitsPerTick !== 0) {
        const xPoint =
          crispPixel(minMax.bottom.max * elementArea.bottom + startPoint.bottom.x, tickWidht) - 0.5;
        const yPos = (() => {
          if (tickPosition === 'in') {
            return startPoint.bottom.y - tickHeight - lineWidth;
          }
          if (tickPosition === 'middle') {
            return startPoint.bottom.y - tickHeight / 2;
          }
          if (tickPosition === 'out') {
            return startPoint.bottom.y;
          }
          return startPoint.bottom.y;
        })();

        ctx.beginPath();

        if (renderOption.axisInfo.bottom.tick) {
          ctx.moveTo(xPoint, yPos);
          ctx.lineTo(xPoint, yPos + tickHeight);
          ctx.stroke();
        }

        if (renderOption.axisInfo.bottom.outputText) {
          let value = '';
          if (axis.bottom?.output && axis.bottom.output[range.bottom + 1] !== undefined) {
            value = axis.bottom.output[range.bottom + 1];
          } else {
            value = String(minMax.bottom.max);
          }
          const metrics = ctx.measureText(value);
          const { width: fontWidth } = metrics;
          const fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;

          ctx.fillText(value, xPoint - fontWidth / 2, yPos + tickHeight + fontHeight);
        }

        ctx.closePath();
      }
    }
    // ==================== 1. Draw bottom x ====================

    // ==================== 2. Draw left y ====================
    if (renderOption.axis.left) {
      const {
        tickSize: { height: tickHeight, width: tickWidht },
        tickPosition,
        lineColor,
        lineWidth,
        font,
        fontColor,
      } = axisStyle.left;

      const unitsPerTick = axis.left?.unitsPerTick || 1;

      ctx.strokeStyle = lineColor;
      ctx.lineWidth = tickWidht;
      ctx.font = font;
      ctx.fillStyle = fontColor;

      const xPoint = (() => {
        if (tickPosition === 'in') {
          return startPoint.left.x + tickHeight + lineWidth;
        }
        if (tickPosition === 'middle') {
          return startPoint.left.x + tickHeight / 2;
        }
        if (tickPosition === 'out') {
          return startPoint.left.x;
        }
        return startPoint.left.x;
      })();
      for (let i = 0; i <= range.left; i += unitsPerTick) {
        const yPoint = crispPixel(startPoint.left.y - i * elementArea.left, tickWidht);

        ctx.beginPath();

        if (renderOption.axisInfo.left.tick) {
          ctx.moveTo(xPoint, yPoint);
          ctx.lineTo(xPoint - tickHeight, yPoint);
          ctx.stroke();
        }

        if (renderOption.axisInfo.left.outputText) {
          let value = '';
          if (axis.left?.output && axis.left.output[i] !== undefined) {
            value = axis.left.output[i];
          } else {
            value = String(i);
          }
          const metrics = ctx.measureText(value);
          const { width: fontWidth } = metrics;
          const fontHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

          ctx.fillText(value, xPoint - tickHeight - fontWidth - 4, yPoint + fontHeight / 2);
        }

        if (renderOption.horizontalGuideLine.left) {
          ctx.moveTo(xPoint, yPoint);
          ctx.lineTo(xPoint + size.width, yPoint);
          ctx.stroke();
        }

        ctx.closePath();
      }
    }
    // ==================== 2. Draw left y ====================

    // ==================== 3. Draw right y ====================
    if (renderOption.axis.right) {
      const {
        tickSize: { height: tickHeight, width: tickWidht },
        tickPosition,
        lineColor,
        lineWidth,
        font,
        fontColor,
      } = axisStyle.right;

      const unitsPerTick = axis.right?.unitsPerTick || 1;

      ctx.strokeStyle = lineColor;
      ctx.lineWidth = tickWidht;
      ctx.font = font;
      ctx.fillStyle = fontColor;

      const xPoint = (() => {
        if (tickPosition === 'in') {
          return startPoint.right.x - tickHeight - lineWidth;
        }
        if (tickPosition === 'middle') {
          return startPoint.right.x - tickHeight / 2;
        }
        if (tickPosition === 'out') {
          return startPoint.right.x;
        }
        return startPoint.right.x;
      })();

      for (let i = 0; i <= range.right; i += unitsPerTick) {
        const yPoint = crispPixel(startPoint.right.y - i * elementArea.right, tickWidht);

        ctx.beginPath();

        if (renderOption.axisInfo.right.tick) {
          ctx.moveTo(xPoint, yPoint);
          ctx.lineTo(xPoint + tickHeight, yPoint);
          ctx.stroke();
        }

        if (renderOption.axisInfo.right.outputText) {
          let value = '';
          if (axis.right?.output && axis.right.output[i] !== undefined) {
            value = axis.right.output[i];
          } else {
            value = String(i);
          }
          const metrics = ctx.measureText(value);
          const fontHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

          ctx.fillText(value, xPoint + tickHeight + 4, yPoint + fontHeight / 2);
        }

        if (renderOption.horizontalGuideLine.right) {
          ctx.moveTo(xPoint, yPoint);
          ctx.lineTo(xPoint - size.width, yPoint);
          ctx.stroke();
        }

        ctx.closePath();
      }
    }
    // ==================== 3. Draw right y ====================

    ctx.restore();
  };
}

export default Draw;
