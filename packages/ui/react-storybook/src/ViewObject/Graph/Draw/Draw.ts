import Calculator from '../Calculator';

import type { DrawParam } from './types';
import type { CanvasLayer } from '@src/ViewObject/Canvas/types';
import { crispPixel } from '@src/ViewObject/Canvas/utils';
import { Axis, Series } from '../types';

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
        tickColor,
        font,
        fontColor,
        lineWidth,
        guideLineColor,
      } = axisStyle.bottom;

      const unitsPerTick = axis.bottom?.unitsPerTick || 1;
      const isLastModuler = range.bottom % unitsPerTick !== 0;

      const isOutputArr = axis.bottom?.output && Array.isArray(axis.bottom.output);
      const step = isOutputArr ? 1 : unitsPerTick;
      const dest = isOutputArr ? (axis.bottom?.output as Array<string>).length : range.bottom;

      ctx.lineWidth = tickWidht;
      ctx.font = font;
      ctx.fillStyle = fontColor;

      let yPoint = startPoint.bottom.y;
      let tickOut = 0;
      if (tickPosition === 'in') {
        yPoint = startPoint.bottom.y - tickHeight - lineWidth;
        tickOut = tickHeight + lineWidth;
      }
      if (tickPosition === 'middle') {
        yPoint = startPoint.bottom.y - tickHeight / 2;
        tickOut = tickHeight / 2;
      }

      for (let i = 0; i <= dest; i += step) {
        const xPoint = crispPixel(i * elementArea.bottom + startPoint.bottom.x, tickWidht);
        if (renderOption.axisInfo.bottom.outputText) {
          let value = '';
          if (isOutputArr) {
            value = (axis.bottom?.output as Array<string>)[i] || '';
          } else {
            value = String(i);
          }
          const metrics = ctx.measureText(value);
          const { width: fontWidth } = metrics;
          const fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;

          ctx.fillText(value, xPoint - fontWidth / 2, yPoint + tickHeight + fontHeight);
        }

        if (renderOption.verticalGuideLine) {
          ctx.beginPath();
          ctx.strokeStyle = guideLineColor;
          if (!isLastModuler && i !== 0 && i !== range.bottom) {
            ctx.moveTo(xPoint, yPoint);
            ctx.lineTo(xPoint, yPoint - size.height + tickOut);
            ctx.stroke();
          } else if (i !== 0 && i !== range.bottom) {
            ctx.moveTo(xPoint, yPoint);
            ctx.lineTo(xPoint, yPoint - size.height + tickOut);
            ctx.stroke();
          }
          ctx.closePath();
        }

        if (renderOption.axisInfo.bottom.tick) {
          ctx.beginPath();
          ctx.strokeStyle = tickColor;
          ctx.moveTo(xPoint, yPoint);
          ctx.lineTo(xPoint, yPoint + tickHeight);
          ctx.stroke();
          ctx.closePath();
        }
      }

      if (isLastModuler) {
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

        if (renderOption.axisInfo.bottom.tick) {
          ctx.beginPath();
          ctx.strokeStyle = tickColor;
          ctx.moveTo(xPoint, yPos);
          ctx.lineTo(xPoint, yPos + tickHeight);
          ctx.stroke();
          ctx.closePath();
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
      }
    }
    // ==================== 1. Draw bottom x ====================

    // ==================== 2. Draw left y ====================
    if (renderOption.axis.left) {
      const {
        tickSize: { height: tickHeight, width: tickWidht },
        tickPosition,
        tickColor,
        lineWidth,
        font,
        fontColor,
        guideLineColor,
      } = axisStyle.left;

      const unitsPerTick = axis.left?.unitsPerTick || 1;

      ctx.lineWidth = tickWidht;
      ctx.font = font;
      ctx.fillStyle = fontColor;

      let xPoint = startPoint.left.x;
      let tickOut = 0;
      if (tickPosition === 'in') {
        xPoint = startPoint.left.x + tickHeight + lineWidth;
        tickOut = tickHeight + lineWidth;
      }
      if (tickPosition === 'middle') {
        xPoint = startPoint.left.x + tickHeight / 2;
        tickOut = tickHeight / 2;
      }

      for (let i = 0; i <= range.left; i += unitsPerTick) {
        const yPoint = crispPixel(startPoint.left.y - i * elementArea.left, tickWidht);

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

        if (i !== 0 && renderOption.horizontalGuideLine.left) {
          ctx.beginPath();
          ctx.strokeStyle = guideLineColor;
          ctx.moveTo(xPoint, yPoint);
          ctx.lineTo(xPoint + size.width - tickOut, yPoint);
          ctx.stroke();
          ctx.closePath();
        }

        if (renderOption.axisInfo.left.tick) {
          ctx.beginPath();
          ctx.strokeStyle = tickColor;
          ctx.moveTo(xPoint, yPoint);
          ctx.lineTo(xPoint - tickHeight, yPoint);
          ctx.stroke();
          ctx.closePath();
        }
      }
    }
    // ==================== 2. Draw left y ====================

    // ==================== 3. Draw right y ====================
    if (renderOption.axis.right) {
      const {
        tickSize: { height: tickHeight, width: tickWidht },
        tickPosition,
        tickColor,
        lineWidth,
        font,
        fontColor,
        guideLineColor,
      } = axisStyle.right;

      const unitsPerTick = axis.right?.unitsPerTick || 1;

      ctx.strokeStyle = tickColor;
      ctx.lineWidth = tickWidht;
      ctx.font = font;
      ctx.fillStyle = fontColor;

      let xPoint = startPoint.right.x;
      let tickOut = 0;
      if (tickPosition === 'in') {
        xPoint = startPoint.right.x - tickHeight - lineWidth;
        tickOut = tickHeight + lineWidth;
      }
      if (tickPosition === 'middle') {
        xPoint = startPoint.right.x - tickHeight / 2;
        tickOut = tickHeight / 2;
      }

      for (let i = 0; i <= range.right; i += unitsPerTick) {
        const yPoint = crispPixel(startPoint.right.y - i * elementArea.right, tickWidht);

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

        if (i !== 0 && renderOption.horizontalGuideLine.right) {
          ctx.beginPath();
          ctx.strokeStyle = guideLineColor;
          ctx.moveTo(xPoint, yPoint);
          ctx.lineTo(xPoint - size.width + tickOut, yPoint);
          ctx.stroke();
          ctx.closePath();
        }

        if (renderOption.axisInfo.right.tick) {
          ctx.beginPath();
          ctx.strokeStyle = tickColor;
          ctx.moveTo(xPoint, yPoint);
          ctx.lineTo(xPoint + tickHeight, yPoint);
          ctx.stroke();
          ctx.closePath();
        }
      }
    }
    // ==================== 3. Draw right y ====================

    ctx.restore();
  };

  public drawSeries = (
    layer: CanvasLayer,
    series: Partial<{
      left: Array<Partial<Series>>;
      right: Array<Partial<Series>>;
    }>,
    outputArrLength: number,
  ) => {
    const { ctx } = layer;

    const scale = this.calculator.scaleGetter;
    const startPoint = this.calculator.startPointerGetter;
    const size = this.calculator.sizeGetter;
    const minMax = this.calculator.minMaxGetter;
    const range = this.calculator.rangeGetter;
    const area = this.calculator.areaGetter;
    const elementArea = this.calculator.elementAreaGetter;

    ctx.save();

    if (Array.isArray(series.left)) {
      const { left: yAxis } = series;
      for (let idx1 = 0; idx1 < yAxis.length; idx1++) {
        const { name, barData, barColor, barWidth } = yAxis[idx1];
        if (barData !== undefined) {
          let length = Array.isArray(barData) ? barData.length : 0;
          length = Math.max(outputArrLength, length);
          const bw = typeof barWidth === 'number' ? barWidth : 50;

          // 1. draw bar 그래프
          for (let idx2 = 0; idx2 <= length; idx2++) {
            if (idx2 < barData.length) {
              const data = barData[idx2];
              if (Array.isArray(data)) {
                // 1-1. 2D array 데이터
                const xPoint = idx2 * scale + startPoint.left.x;
                let next = area.start.y;
                for (let i = 0; i < data.length; i++) {
                  if (Array.isArray(barColor) && Array.isArray(barColor[idx2])) {
                    ctx.fillStyle = barColor[idx2][i];
                  } else if (Array.isArray(barColor) && typeof barColor[idx2] === 'string') {
                    ctx.fillStyle = String(barColor[idx2]);
                  } else if (typeof barColor === 'string') {
                    ctx.fillStyle = barColor;
                  } else {
                    ctx.fillStyle = 'rgb(204, 204, 204)';
                  }
                  const d = data[i];
                  const yPoint = -elementArea.left * d;

                  if (idx2 === 0) {
                    ctx.fillRect(xPoint, next, bw / 2, yPoint);
                  } else if (idx2 === length - 1) {
                    ctx.fillRect(xPoint - bw / 2, next, bw / 2, yPoint);
                  } else {
                    ctx.fillRect(xPoint - bw / 2, next, bw, yPoint);
                  }
                  next += yPoint;
                }
              } else {
                // 1-2. 1D array 데이터
                if (Array.isArray(barColor)) {
                  if (!Array.isArray(barColor[idx2])) {
                    ctx.fillStyle = String(barColor[idx2]) || 'rgb(204, 204, 204)';
                  } else {
                    throw Error('barColor 데이터 타입이 잘못되었습니다.');
                  }
                } else if (typeof barColor === 'string') {
                  ctx.fillStyle = barColor;
                }
                const xPoint = idx2 * scale + startPoint.left.x;
                const yPoint = -elementArea.left * data;

                if (idx2 === 0) {
                  ctx.fillRect(xPoint, area.start.y, bw / 2, yPoint);
                } else if (idx2 === length - 1) {
                  ctx.fillRect(xPoint - bw / 2, area.start.y, bw / 2, yPoint);
                } else {
                  ctx.fillRect(xPoint - bw / 2, area.start.y, bw, yPoint);
                }
              }
            }
          }
        }
      }

      // 2. draw line 그래프
      for (let idx1 = 0; idx1 < yAxis.length; idx1++) {
        const { name, linePointRadius, lineColor, lineWidth, lineData } = yAxis[idx1];
        if (lineData !== undefined) {
          ctx.strokeStyle = lineColor || '#000';
          ctx.fillStyle = lineColor || '#000';
          ctx.lineWidth = lineWidth || 1;

          const length = Array.isArray(lineData) ? lineData.length : 0;

          ctx.beginPath();
          ctx.moveTo(startPoint.left.x, startPoint.left.y);
          for (let idx2 = 0; idx2 < length; idx2++) {
            if (idx2 < lineData.length) {
              const data = lineData[idx2];
              const xPoint = idx2 * scale + startPoint.left.x;
              const yPoint = Math.floor(
                startPoint.left.y - ((data - minMax.left.min) * size.height) / range.left,
              );
              if (idx2 > 0) {
                ctx.lineTo(xPoint, yPoint);
                ctx.stroke();
              }
              if (typeof linePointRadius === 'number' && linePointRadius > 0) {
                ctx.beginPath();
                ctx.arc(xPoint, yPoint, linePointRadius, 0, 2 * Math.PI, false);
                ctx.fill();
                ctx.closePath();
              }
              ctx.moveTo(xPoint, yPoint);
            }
          }
          ctx.closePath();
        }
      }
    }

    ctx.restore();
  };
}

export default Draw;
