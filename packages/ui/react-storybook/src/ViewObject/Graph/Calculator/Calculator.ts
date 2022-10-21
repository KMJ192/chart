import { cloneDeep } from 'lodash';

import type { AxisStyleType, CalculatorParam } from './types';
import type { Axis, GraphDataParam, RenderOptions, RenderOptionsSetterParam } from '../types';

// 데이터 연산
class Calculator {
  // canvas padding
  private padding: RectArea<number>;

  private axisStyle: BowlArea<AxisStyleType>;

  // axis별 최대값
  private max: BowlArea<number> = {
    bottom: 0,
    left: 0,
    right: 0,
  };

  // axis별 최소값
  private min: BowlArea<number> = {
    bottom: 0,
    left: Infinity,
    right: Infinity,
  };

  private size: Size = {
    width: 0,
    height: 0,
  };

  private range: BowlArea<number> = {
    bottom: 0,
    left: 0,
    right: 0,
  };

  private scale: number;

  private middlePosition: number;

  // 각 축 별 그려질 시작 지점
  private startPoint: BowlArea<Vector> = {
    bottom: {
      x: 0,
      y: 0,
    },
    left: {
      x: 0,
      y: 0,
    },
    right: {
      x: 0,
      y: 0,
    },
  };

  // canvas area
  private area: { start: Vector; end: Vector } = {
    start: {
      x: 0,
      y: 0,
    },
    end: {
      x: 0,
      y: 0,
    },
  };

  private elementArea: BowlArea<number> = {
    bottom: 0,
    left: 0,
    right: 0,
  };

  /**
   * 기본 렌더링 옵션
   * left y축, botton x축 true,
   * right y축 optional
   */
  private renderOption: RenderOptions = {
    series: {
      left: true,
      right: false,
    },
    seriesInfo: {
      left: {
        outputText: true,
      },
      right: {
        outputText: false,
      },
    },
    axis: {
      bottom: true,
      left: true,
      right: false,
    },
    axisInfo: {
      bottom: {
        outputText: true,
        tick: true,
      },
      left: {
        outputText: true,
        tick: true,
      },
      right: {
        outputText: false,
        tick: false,
      },
    },
    verticalGuideLine: true,
    horizontalGuideLine: {
      left: true,
      right: false,
    },
    legend: true,
    tooltip: true,
  };

  private axisOutputArray: BowlArea<Array<string>> = {
    bottom: [],
    left: [],
    right: [],
  };

  constructor({ padding, axis }: CalculatorParam) {
    this.padding = padding;

    this.scale = 0;

    this.middlePosition = 0;

    this.axisStyle = {
      bottom: {
        lineWidth: axis.bottom.lineWidth,
        lineColor: axis.bottom.lineColor,
        tickSize: axis.bottom.tickSize,
        tickPosition: axis.bottom.tickPosition,
        tickColor: axis.bottom.tickColor,
        font: axis.bottom.font,
        fontColor: axis.bottom.fontColor,
        guideLineColor: axis.bottom.guideLineColor,
      },
      left: {
        lineWidth: axis.left.lineWidth,
        lineColor: axis.left.lineColor,
        tickSize: axis.left.tickSize,
        tickPosition: axis.left.tickPosition,
        tickColor: axis.left.tickColor,
        font: axis.left.font,
        fontColor: axis.left.fontColor,
        guideLineColor: axis.left.guideLineColor,
      },
      right: {
        lineWidth: axis.right.lineWidth,
        lineColor: axis.right.lineColor,
        tickSize: axis.right.tickSize,
        tickPosition: axis.right.tickPosition,
        tickColor: axis.right.tickColor,
        font: axis.right.font,
        fontColor: axis.right.fontColor,
        guideLineColor: axis.right.guideLineColor,
      },
    };
  }

  set renderOptionSetter(renderOption: Partial<RenderOptionsSetterParam>) {
    const isRightAxisData = renderOption.data?.axis.right !== undefined;

    // 1. axis 렌더링 여부
    if (typeof renderOption.axis?.bottom === 'boolean') {
      this.renderOption.axis.bottom = renderOption.axis.bottom;
    }

    if (typeof renderOption.axis?.left === 'boolean') {
      this.renderOption.axis.left = renderOption.axis.left;
    }

    if (typeof renderOption.axis?.right === 'boolean') {
      this.renderOption.axis.right = renderOption.axis.right;
    } else if (isRightAxisData === true) {
      this.renderOption.axis.right = true;
    }

    // 2. axis info 렌더링 여부
    // 2-1. outputText
    if (typeof renderOption.axisInfo?.bottom.outputText === 'boolean') {
      this.renderOption.axisInfo.bottom.outputText = renderOption.axisInfo.bottom.outputText;
    }

    if (typeof renderOption.axisInfo?.left.outputText === 'boolean') {
      this.renderOption.axisInfo.left.outputText = renderOption.axisInfo.left.outputText;
    }

    if (typeof renderOption.axisInfo?.right.outputText === 'boolean') {
      this.renderOption.axisInfo.right.outputText = renderOption.axisInfo.right.outputText;
    } else if (isRightAxisData === true) {
      this.renderOption.axisInfo.right.outputText = true;
    }

    // 2-2. tick
    if (typeof renderOption.axisInfo?.bottom.tick === 'boolean') {
      this.renderOption.axisInfo.bottom.tick = renderOption.axisInfo.bottom.tick;
    }

    if (typeof renderOption.axisInfo?.left.tick === 'boolean') {
      this.renderOption.axisInfo.left.tick = renderOption.axisInfo.left.tick;
    }

    if (typeof renderOption.axisInfo?.right.tick === 'boolean') {
      this.renderOption.axisInfo.right.tick = renderOption.axisInfo.right.tick;
    } else if (isRightAxisData === true) {
      this.renderOption.axisInfo.right.tick = true;
    }

    // 3. series 렌더링 여부
    if (typeof renderOption.series?.left === 'boolean') {
      this.renderOption.series.left = renderOption.series.left;
    }

    if (typeof renderOption.series?.right === 'boolean') {
      this.renderOption.series.right = renderOption.series.right;
    } else if (isRightAxisData === true) {
      this.renderOption.series.right = true;
    }

    // 4. series text 렌더링 여부
    if (typeof renderOption.seriesInfo?.left.outputText === 'boolean') {
      this.renderOption.seriesInfo.left.outputText = renderOption.seriesInfo.left.outputText;
    }

    if (typeof renderOption.seriesInfo?.right.outputText === 'boolean') {
      this.renderOption.seriesInfo.right.outputText = renderOption.seriesInfo.right.outputText;
    } else if (isRightAxisData === true) {
      this.renderOption.seriesInfo.right.outputText = true;
    }

    // 5. guideLine 렌더링 여부
    if (typeof renderOption.verticalGuideLine === 'boolean') {
      this.renderOption.verticalGuideLine = renderOption.verticalGuideLine;
    }

    if (typeof renderOption.horizontalGuideLine?.left === 'boolean') {
      this.renderOption.horizontalGuideLine.left = renderOption.horizontalGuideLine.left;
    }

    if (typeof renderOption.horizontalGuideLine?.right === 'boolean') {
      this.renderOption.horizontalGuideLine.right = renderOption.horizontalGuideLine.right;
    } else if (isRightAxisData) {
      this.renderOption.horizontalGuideLine.right = true;
    }

    // 6. legend 렌더링 여부
    if (typeof renderOption.legend === 'boolean') {
      this.renderOption.legend = renderOption.legend;
    }

    // 7. tooltip 렌더링 여부
    if (typeof renderOption.tooltip === 'boolean') {
      this.renderOption.tooltip = renderOption.tooltip;
    }
  }

  // =============== Getter ===============
  get scaleGetter() {
    return this.scale;
  }

  get renderOptionGetter(): {
    series: {
      left: boolean;
      right: boolean;
    };
    axis: BowlArea<boolean>;
    axisInfo: BowlArea<{
      outputText: boolean;
      tick: boolean;
    }>;
    verticalGuideLine: boolean;
    horizontalGuideLine: {
      left: boolean;
      right: boolean;
    };
  } {
    return this.renderOption;
  }

  get axisStyleGetter(): BowlArea<{
    lineWidth: number;
    lineColor: string;
    tickSize: Size;
    tickColor: string;
    tickPosition: 'in' | 'out' | 'middle';
    font: string;
    fontColor: string;
    guideLineColor: string;
  }> {
    return this.axisStyle;
  }

  get axisStartPointGetter(): BowlArea<Vector> {
    return this.startPoint;
  }

  get sizeGetter(): Size {
    return {
      width: this.size.width,
      height: this.size.height,
    };
  }

  get rangeGetter(): BowlArea<number> {
    return this.range;
  }

  get areaGetter(): { start: Vector; end: Vector } {
    return this.area;
  }

  get elementAreaGetter(): BowlArea<number> {
    return this.elementArea;
  }

  get startPointerGetter(): BowlArea<Vector> {
    return this.startPoint;
  }

  get minMaxGetter(): BowlArea<{ max: number; min: number }> {
    return {
      bottom: {
        max: this.max.bottom,
        min: this.min.bottom,
      },
      left: {
        max: this.max.left,
        min: this.min.left,
      },
      right: {
        max: this.max.right,
        min: this.min.right,
      },
    };
  }

  get axisOutputArrGetter(): BowlArea<Array<string>> {
    return this.axisOutputArray;
  }
  // =============== Getter ===============

  public setAxisStyle = (axis: BowlArea<Axis>) => {
    this.axisStyle.bottom.lineWidth = axis.bottom.lineWidth;
    this.axisStyle.left.lineWidth = axis.left.lineWidth;
    this.axisStyle.right.lineWidth = axis.right.lineWidth;
  };

  public setMinMax = (data: GraphDataParam) => {
    // right는 렌더 옵션에 따라 설정(렌더링 false일 경우 isSet에 true로 두어 연산하지 않음)
    const isSet: BowlArea<{ max: boolean; min: boolean }> = {
      bottom: {
        max: false,
        min: false,
      },
      left: {
        max: false,
        min: false,
      },
      right: {
        max: !this.renderOption.axis.right,
        min: !this.renderOption.axis.right,
      },
    };

    const { axis, series } = data;

    // ======= 1. max, min 입력 여부 및 입력값 확인 =======
    // ===== 1-1. left axis =====
    if (typeof axis.left.max === 'number') {
      this.max.left = axis.left.max;
      isSet.left.max = true;
    }
    if (typeof axis.left.min === 'number') {
      this.min.left = axis.left.min;
      isSet.left.min = true;
    }
    // ===== 1-2. bottom axis =====
    if (typeof axis.right.max === 'number') {
      this.max.right = axis.right.max;
      isSet.right.max = true;
    }
    if (typeof axis.right.min === 'number') {
      this.min.right = axis.right.min;
      isSet.right.min = true;
    }
    // ===== 1-3. right axis =====
    if (typeof axis.bottom.max === 'number') {
      this.max.bottom = axis.bottom.max;
      isSet.bottom.max = true;
    }
    if (typeof axis.bottom.min === 'number') {
      this.min.bottom = axis.bottom.min;
      isSet.bottom.min = true;
    }

    // ======= 2. axis별 max, min값 정의 =======
    if (
      !isSet.left.max ||
      !isSet.left.min ||
      !isSet.right.max ||
      !isSet.right.min ||
      !isSet.bottom.max
    ) {
      const tmp = cloneDeep(isSet);
      // 2-1. left axis 참조 -> left y축 및 종속 x축(top or bottom)의 max, min
      if (!isSet.left.max || !isSet.left.min || !isSet.bottom.max) {
        for (let idx1 = 0; idx1 < series.left.length; idx1++) {
          const s = series.left[idx1];

          // ===== x축의 max 설정 =====
          if (!isSet.bottom.max) {
            this.max.bottom = Math.max(this.max.bottom, s.lineData?.length || 0);
            tmp.bottom.max = true;
          }
          if (!isSet.bottom.max) {
            this.max.bottom = Math.max(this.max.bottom, s.barData?.length || 0);
            tmp.bottom.max = true;
          }
          // left y축 max, min 설정
          if (!isSet.left.max || !isSet.left.min) {
            for (let idx2 = 0; idx2 < s.lineData.length; idx2++) {
              const d = s.lineData[idx2];

              if (!isSet.left.max) {
                this.max.left = Math.max(this.max.left, d);
                tmp.left.max = true;
              }
              if (!isSet.left.min) {
                this.min.left = Math.min(this.min.left, d);
                tmp.left.min = true;
              }
            }

            for (let idx2 = 0; idx2 < s.barData.length; idx2++) {
              const d = s.barData[idx2];
              let barData = [];
              if (Array.isArray(d)) {
                barData = d;
              } else {
                barData.push(d);
              }

              let all = 0;
              barData.forEach((bd: number) => {
                all += bd;
                if (!isSet.left.min) {
                  this.min.left = Math.min(this.min.left, bd);
                  tmp.left.min = true;
                }
              });
              if (!isSet.left.max) {
                this.max.left = Math.max(this.max.left, all);
                tmp.left.max = true;
              }
            }
          }
        }
      }

      // 2-2. right axis 참조 -> right y축 및 종속 x축(top or bottom)의 max, min
      if (!isSet.right.max || !isSet.right.min || !isSet.bottom.max) {
        for (let idx1 = 0; idx1 < series.right.length; idx1++) {
          const s = series.right[idx1];

          // ===== x축의 max 설정 =====
          if (!isSet.bottom.max) {
            this.max.bottom = Math.max(this.max.bottom, s.lineData.length);
            tmp.bottom.max = true;
          }
          if (!isSet.bottom.max) {
            this.max.bottom = Math.max(this.max.bottom, s.barData.length);
            tmp.bottom.max = true;
          }

          // right y축 max, min 설정
          if (!isSet.right.max || !isSet.right.min) {
            for (let idx2 = 0; idx2 < s.lineData.length; idx2++) {
              const d = s.lineData[idx2];
              if (!isSet.right.max) {
                this.max.right = Math.max(this.max.right, d);
                tmp.right.max = true;
              }
              if (!isSet.right.min) {
                this.min.right = Math.min(this.min.right, d);
                tmp.right.min = true;
              }
            }
            for (let idx2 = 0; idx2 < s.barData.length; idx2++) {
              const d = s.barData[idx2];
              let barData = [];
              if (Array.isArray(d)) {
                barData = d;
              } else {
                barData.push(d);
              }
              let all = 0;
              barData.forEach((bd: number) => {
                all += bd;
                if (!isSet.right.min) {
                  this.min.right = Math.min(this.min.right, bd);
                  tmp.right.min = true;
                }
                if (!isSet.right.max) {
                  this.max.right = Math.max(this.max.right, all);
                  tmp.right.max = true;
                }
              });
            }
          }
        }
      }

      // ===== x축 min 값 세팅 =====
      if (isSet.bottom.min === false) {
        if (this.max.bottom < 0) {
          this.min.bottom = this.max.bottom;
        } else {
          this.min.bottom = 0;
        }
        tmp.bottom.min = true;
      }

      isSet.bottom = cloneDeep(tmp.bottom);
      isSet.left = cloneDeep(tmp.left);
      isSet.right = cloneDeep(tmp.right);
    }

    if (!isSet.left.max) {
      this.max.left = 0;
    }
    if (!isSet.left.min) {
      this.min.left = 0;
    }
    if (!isSet.right.max) {
      this.max.right = 0;
    }
    if (!isSet.right.min) {
      this.min.right = 0;
    }
    if (!isSet.bottom.max) {
      this.max.bottom = 0;
    }
    if (!isSet.bottom.min) {
      this.min.bottom = 0;
    }
  };

  public setRange = (axis: BowlArea<Axis>) => {
    // 입력된 output 배열이 있을 경우 range가 변경되어야 하므로 먼저 설정

    this.axisOutputArray.bottom = axis.bottom.output;

    this.axisOutputArray.left = axis.left.output;

    this.axisOutputArray.right = axis.right.output;

    const isRangeOfOutputArrayBot =
      this.axisOutputArray.bottom.length > this.max.bottom - this.min.bottom;
    if (isRangeOfOutputArrayBot) {
      this.range.bottom = this.axisOutputArray.bottom.length - 1;
    } else {
      this.range.bottom = this.max.bottom - this.min.bottom - 1;
    }

    const isRangeOfOutputArrayLeft =
      this.axisOutputArray.left.length > this.max.left - this.min.left;
    if (isRangeOfOutputArrayLeft) {
      this.range.left = this.axisOutputArray.left.length - 1;
    } else {
      this.range.left = this.max.left - this.min.left;
    }

    const isRangeOfOutputArrayRight =
      this.axisOutputArray.right.length > this.max.right - this.min.right;
    if (isRangeOfOutputArrayRight) {
      this.range.right = this.axisOutputArray.right.length - 1;
    } else {
      this.range.right = this.max.right - this.min.right;
    }

    const leftUnitPerTick = axis.left.unitsPerTick;
    const leftMod = this.range.left % leftUnitPerTick;
    if (leftMod !== 0) {
      this.max.left += leftUnitPerTick - leftMod;
      this.range.left = this.max.left - this.min.left;
    }

    const rightUnitPerTick = axis.right.unitsPerTick;
    const rightMod = this.range.right % rightUnitPerTick;
    if (rightMod !== 0) {
      this.max.right += rightUnitPerTick - rightMod;
      this.range.right += this.max.right - this.min.right;
    }
  };

  public setSize = (canvas: HTMLCanvasElement) => {
    // const dpr = window.devicePixelRatio;
    this.size.width =
      canvas.width -
      this.padding.left -
      this.padding.right -
      this.axisStyle.left.tickSize.height -
      this.axisStyle.right.tickSize.height;

    this.size.height =
      canvas.height -
      this.padding.bottom -
      this.padding.top -
      this.axisStyle.bottom.tickSize.height;

    this.scale = this.size.width / this.range.bottom;
    if (this.scale === Infinity) {
      this.scale = 1;
    }
  };

  public setStartPoint = () => {
    this.startPoint.bottom = {
      x: this.padding.left + this.axisStyle.left.tickSize.height,
      y: this.size.height + this.padding.bottom,
    };
    this.startPoint.left = {
      x: this.startPoint.bottom.x,
      y: this.startPoint.bottom.y,
    };
    this.startPoint.right = {
      x: this.startPoint.left.x + this.size.width,
      y: this.startPoint.left.y,
    };
  };

  public setArea = () => {
    this.area.start = {
      x: this.startPoint.bottom.x,
      y: this.startPoint.bottom.y,
    };
    this.area.end = {
      x: this.startPoint.bottom.x + this.size.width,
      y: this.startPoint.bottom.y - this.size.height,
    };
  };

  public setElementArea = () => {
    this.middlePosition = this.area.start.x + (this.area.end.x - this.area.start.x) / 2;

    this.elementArea = {
      bottom: (this.area.end.x - this.area.start.x) / this.range.bottom,
      left: (this.area.start.y - this.area.end.y) / this.range.left,
      right: (this.area.start.y - this.area.end.y) / this.range.right,
    };
  };
}

export default Calculator;
