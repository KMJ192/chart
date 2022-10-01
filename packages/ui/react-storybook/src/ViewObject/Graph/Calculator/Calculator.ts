import { cloneDeep } from 'lodash';

import type { CalculatorParam } from './types';
import type {
  Axis,
  GraphDataParam,
  GraphType,
  RenderOptions,
  RenderOptionsSetterParam,
  Series,
} from '../types';

// 데이터 연산
class Calculator {
  private graphType: GraphType;

  // canvas padding
  private padding: RectArea<number>;

  private axisStyle: BowlArea<{
    lineWidth: number;
    lineColor: string;
    tickSize: Size;
    tickPosition: 'in' | 'out' | 'middle';
    tickColor: string;
    font: string;
    fontColor: string;
    guideLineColor: string;
  }> = {
    bottom: {
      lineWidth: 1,
      lineColor: '#000',
      tickSize: {
        width: 1,
        height: 3,
      },
      tickColor: '#000',
      tickPosition: 'out',
      font: '14px sans-serif',
      fontColor: '#000',
      guideLineColor: '#E2E2E2',
    },
    left: {
      lineWidth: 1,
      lineColor: '#000',
      tickSize: {
        width: 1,
        height: 3,
      },
      tickColor: '#000',
      tickPosition: 'out',
      font: '14px sans-serif',
      fontColor: '#000',
      guideLineColor: '#E2E2E2',
    },
    right: {
      lineWidth: 1,
      lineColor: '#000',
      tickSize: {
        width: 1,
        height: 3,
      },
      tickColor: '#000',
      tickPosition: 'out',
      font: '14px sans-serif',
      fontColor: '#000',
      guideLineColor: '#E2E2E2',
    },
  };

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
    // top: 0,
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

  constructor({ padding, graphType, tickSize }: CalculatorParam) {
    this.graphType = graphType;

    this.padding = padding;

    this.scale = 0;

    this.middlePosition = 0;

    this.axisStyle.bottom.tickSize = tickSize.bottom;
    this.axisStyle.left.tickSize = tickSize.left;
    this.axisStyle.right.tickSize = tickSize.right;
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

  // eslint-disable-next-line class-methods-use-this
  public validationCheck = (data: GraphDataParam) => {
    // 1. 그냥 데이터가 없음 -> throw
    if (!data) throw Error('Necessary value : axis info, series info');

    // 2. axis 정보가 없음 -> throw
    if (!data.axis) throw Error('Necessary value : axis info');

    // 3. left y축 정보가 없음 -> throw
    if (!data.axis.left) throw Error('Necessary value : left axis info');

    // 4. bottom x축 정보가 없음 -> throw
    if (!data.axis.bottom) throw Error('Necessary value : bottom axis info');
  };

  public setAxisStyle = (axis: Partial<BowlArea<Partial<Axis>>>) => {
    this.axisStyle.bottom.lineWidth = axis.bottom?.lineWidth || 1;
    this.axisStyle.left.lineWidth = axis.left?.lineWidth || 1;
    this.axisStyle.right.lineWidth = axis.right?.lineWidth || 1;
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
    if (typeof axis.left?.max === 'number') {
      this.max.left = axis.left.max;
      isSet.left.max = true;
    }
    if (typeof axis.left?.min === 'number') {
      this.min.left = axis.left.min;
      isSet.left.min = true;
    }
    // ===== 1-2. bottom axis =====
    if (typeof axis.right?.max === 'number') {
      this.max.right = axis.right.max;
      isSet.right.max = true;
    }
    if (typeof axis.right?.min === 'number') {
      this.min.right = axis.right.min;
      isSet.right.min = true;
    }
    // ===== 1-3. right axis =====
    if (typeof axis.bottom?.max === 'number') {
      this.max.bottom = axis.bottom.max;
      isSet.bottom.max = true;
    }
    if (typeof axis.bottom?.min === 'number') {
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
        series.left?.forEach((s: Partial<Series>) => {
          const isLineData = Array.isArray(s.lineData);
          const isBarData = Array.isArray(s.barData);
          // ===== x축의 max 설정 =====
          if (isLineData && !isSet.bottom.max) {
            this.max.bottom = Math.max(s.lineData?.length || 0);
            tmp.bottom.max = true;
          }
          if (isBarData && !isSet.bottom.max) {
            this.max.bottom = Math.max(s.barData?.length || 0);
            tmp.bottom.max = true;
          }
          // left y축 max, min 설정
          if (!isSet.left.max || !isSet.left.min) {
            s.lineData?.forEach((_data: number) => {
              if (!isSet.left.max) {
                this.max.left = Math.max(this.max.left, _data);
                tmp.left.max = true;
              }
              if (!isSet.left.min) {
                this.min.left = Math.min(this.min.left, _data);
                tmp.left.min = true;
              }
            });
            s.barData?.forEach((_data: number | number[]) => {
              if (Array.isArray(_data)) {
                let all = 0;
                _data.forEach((d: number) => {
                  all += d;
                  if (!isSet.left.min) {
                    this.min.left = Math.min(this.min.left, d);
                    tmp.left.min = true;
                  }
                });
                if (!isSet.left.max) {
                  this.max.left = Math.max(this.max.left, all);
                  tmp.left.max = true;
                }
              } else {
                if (!isSet.left.max) {
                  this.max.left = Math.max(this.max.left, _data);
                  tmp.left.max = true;
                }
                if (!isSet.left.min) {
                  this.min.left = Math.min(this.min.left, _data);
                  tmp.left.min = true;
                }
              }
            });
          }
        });
      }

      // 2-2. right axis 참조 -> right y축 및 종속 x축(top or bottom)의 max, min
      if (!isSet.right.max || !isSet.right.min || !isSet.bottom.max) {
        series.right?.forEach((s: Partial<Series>) => {
          const isLineData = Array.isArray(s.lineData);
          const isBarData = Array.isArray(s.barData);
          // ===== x축의 max 설정 =====
          if (isLineData && !isSet.bottom.max) {
            this.max.bottom = Math.max(s.lineData?.length || 0);
            tmp.bottom.max = true;
          }
          if (isBarData && !isSet.bottom.max) {
            this.max.bottom = Math.max(s.barData?.length || 0);
            tmp.bottom.max = true;
          }

          // right y축 max, min 설정
          if (!isSet.right.max || !isSet.right.min) {
            s.lineData?.forEach((_data: number) => {
              if (!isSet.right.max) {
                this.max.right = Math.max(this.max.right, _data);
                tmp.right.max = true;
              }
              if (!isSet.right.min) {
                this.min.right = Math.min(this.min.right, _data);
                tmp.right.min = true;
              }
            });
            s.barData?.forEach((_data: number | number[]) => {
              if (Array.isArray(_data)) {
                let all = 0;
                _data.forEach((d: number) => {
                  all += d;
                  if (!isSet.right.min) {
                    this.min.right = Math.min(this.min.right, d);
                    tmp.right.min = true;
                  }
                });
                if (!isSet.right.max) {
                  this.max.right = Math.max(this.max.right, all);
                  tmp.right.max = true;
                }
              } else {
                if (!isSet.right.max) {
                  this.max.right = Math.max(this.max.right, _data);
                  tmp.right.max = true;
                }
                if (!isSet.right.min) {
                  this.min.right = Math.min(this.min.right, _data);
                  tmp.right.min = true;
                }
              }
            });
          }
        });
      }
      // ===== x축 min 값 세팅 =====
      if (!isSet.bottom.min) {
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

    if (!isSet.left.max) throw Error(`left y axis의 최대값을 특정할 수 없습니다.`);
    if (!isSet.left.min) throw Error(`left y axis의 최소값을 특정할 수 없습니다.`);
    if (!isSet.right.max) throw Error(`right y axis의 최대값을 특정할 수 없습니다.`);
    if (!isSet.right.min) throw Error(`right y axis의 최소값을 특정할 수 없습니다.`);
    if (!isSet.bottom.max) throw Error(`bottom x axis의 최대값을 특정할 수 없습니다.`);
    if (!isSet.bottom.min) throw Error(`bottom x axis의 최소값을 특정할 수 없습니다.`);
  };

  public setRange = (axis: Partial<BowlArea<Partial<Axis>>>) => {
    const isOutputArr = axis.bottom?.output && Array.isArray(axis.bottom.output);

    if (isOutputArr && (axis.bottom?.output as Array<string>).length - 1 > 0) {
      this.range.bottom = (axis.bottom?.output as Array<string>).length - 1;
    } else {
      this.range.bottom = this.max.bottom - this.min.bottom;
    }

    this.range.left = this.max.left - this.min.left;
    this.range.right = this.max.right - this.min.right;

    const leftUnitPerTick = axis.left?.unitsPerTick || 1;
    const leftMod = this.range.left % leftUnitPerTick;
    if (leftMod !== 0) {
      this.max.left += leftUnitPerTick - leftMod;
      this.range.left = this.max.left - this.min.left;
    }

    const rightUnitPerTick = axis.right?.unitsPerTick || 1;
    const rightMod = this.range.right % rightUnitPerTick;
    if (rightMod !== 0) {
      this.max.right += rightUnitPerTick - rightMod;
      this.range.right += this.max.right - this.min.right;
    }
  };

  public setSize = (canvas: HTMLCanvasElement) => {
    const dpr = window.devicePixelRatio;
    this.size.width =
      canvas.width / dpr -
      this.padding.left -
      this.padding.right -
      this.axisStyle.left.tickSize.height -
      this.axisStyle.right.tickSize.height;

    this.size.height =
      canvas.height / dpr -
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
