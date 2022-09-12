import { cloneDeep } from 'lodash';

import type { Axis, CalculatorParam, GraphDataParam, GraphType, Series } from './types';

// 데이터 연산
class Calculator {
  private graphType: GraphType;

  // axis별 최대값
  private max: RectArea<number> = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  // axis별 최소값
  private min: RectArea<number> = {
    top: 0,
    bottom: 0,
    left: Infinity,
    right: Infinity,
  };

  private size: Size = {
    width: 0,
    height: 0,
  };

  // canvas padding
  private padding: RectArea<number> = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  private tickSize: RectArea<Size> = {
    top: {
      width: 1,
      height: 3,
    },
    bottom: {
      width: 1,
      height: 3,
    },
    left: {
      width: 1,
      height: 3,
    },
    right: {
      width: 1,
      height: 3,
    },
  };

  private range: RectArea<number> = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  private scale: number;

  private middlePosition: number;

  private startPoint: RectArea<Vector> = {
    top: {
      x: 0,
      y: 0,
    },
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

  private elementArea: RectArea<number> = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  private canvasArea: Bounds<Vector> = {
    start: {
      x: 0,
      y: 0,
    },
    end: {
      x: 0,
      y: 0,
    },
  };

  /**
   * 기본 렌더링 옵션
   * left y축, botton x축 true,
   * right y축, top x축 optional
   */
  private renderOption: {
    series: {
      left: boolean;
      right: boolean;
    };
    axis: RectArea<boolean>;
  } = {
    series: {
      left: true,
      right: false,
    },
    axis: {
      top: false,
      bottom: true,
      left: true,
      right: false,
    },
  };

  constructor({ padding, graphType, tickSize }: CalculatorParam) {
    this.graphType = graphType;

    this.padding = padding;

    this.tickSize = tickSize;

    this.scale = 0;

    this.middlePosition = 0;
  }

  set renderOptionSetter(
    renderOption: Partial<{
      series: {
        left?: boolean;
        right?: boolean;
      };
      axis: Partial<RectArea<boolean>>;
    }>,
  ) {
    if (typeof renderOption.axis?.top === 'boolean') {
      this.renderOption.axis.top = renderOption.axis.top;
    }

    if (typeof renderOption.axis?.bottom === 'boolean') {
      this.renderOption.axis.bottom = renderOption.axis.bottom;
    }

    if (typeof renderOption.axis?.left === 'boolean') {
      this.renderOption.axis.left = renderOption.axis.left;
    }

    if (typeof renderOption.axis?.right === 'boolean') {
      this.renderOption.axis.right = renderOption.axis.right;
    }

    if (typeof renderOption.series?.left === 'boolean') {
      this.renderOption.series.left = renderOption.series.left;
    }

    if (typeof renderOption.series?.right === 'boolean') {
      this.renderOption.series.right = renderOption.series.right;
    }
  }

  public validationCheck = (data: GraphDataParam) => {
    // 1. 그냥 데이터가 없음 -> throw
    if (!data) throw Error('Necessary value : axis info, series info');

    // 2. axis 정보가 없음 -> throw
    if (!data.axis) throw Error('Necessary value : axis info');

    // 3. 왼쪽 y축 정보가 없음 -> throw
    if (!data.axis.left) throw Error('Necessary value : left axis info');

    // 4. 아래쪽 x축 정보가 없음 -> throw
    if (!data.axis.bottom) throw Error('Necessary value : bottom axis info');

    // 5. 오른쪽 y축의 렌더링 옵션을 true로 설정했지만 정보가 없는 경우 -> 렌더링 하지 않음, 경고
    if (this.renderOption.axis.right && !data.axis.right) {
      this.renderOption.axis.right = false;
      // eslint-disable-next-line no-console
      console.warn(`No right axis info. (But setted render option true)`);
    }

    // 6. 위쪽 x축의 렌더링 옵션을 true 설정헀지만 정보가 없는 경우 -> 렌더링 하지않음, 경고
    if (this.renderOption.axis.top && !data.axis.top) {
      this.renderOption.axis.top = false;
      // eslint-disable-next-line no-console
      console.warn(`No top axis info. (But setted render option true)`);
    }

    // 7. optional data의 입력 data 유무에 따른 render option 조정
    const { axis } = data;
    // 7-1. right y축 정보가 없는 경우
    if (axis.right) {
      this.renderOption.axis.right = true;
      this.renderOption.series.right = true;
    }
    // 7-2. top x축 정보가 없는 경우
    if (axis.top) {
      this.renderOption.axis.top = true;
    }
  };

  public setMinMax = (data: GraphDataParam) => {
    // top, right는 렌더 옵션에 따라 설정(렌더링 false일 경우 isSet에 true로 두어 연산하지 않음)
    const isSet: RectArea<{ max: boolean; min: boolean }> = {
      top: {
        max: !this.renderOption.axis.top,
        min: !this.renderOption.axis.top,
      },
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
    // ===== 1-4. top axis =====
    if (typeof axis.top?.max === 'number') {
      this.max.top = axis.top.max;
      isSet.top.max = true;
    }
    if (typeof axis.top?.min === 'number') {
      this.min.top = axis.top.min;
      isSet.top.min = true;
    }

    // ======= 2. axis별 max, min값 정의 =======
    if (
      !isSet.left.max ||
      !isSet.left.min ||
      !isSet.right.max ||
      !isSet.right.min ||
      !isSet.bottom.max ||
      !isSet.top.max
    ) {
      const tmp = cloneDeep(isSet);
      // 2-1. left axis 참조 -> left y축 및 종속 x축(top or bottom)의 max, min
      if (!isSet.left.max || !isSet.left.min || !isSet.bottom.max || !isSet.top.max) {
        series.left?.forEach((s: Partial<Series>) => {
          const isLineData = Array.isArray(s.lineData);
          const isBarData = Array.isArray(s.barData);
          const xAxisPos = s.dependsXAxis || 'bottom';
          // ===== x축의 max 설정 =====
          if (isLineData) {
            if (xAxisPos === 'bottom' && !isSet.bottom.max) {
              this.max.bottom = Math.max(s.lineData?.length || 0);
              tmp.bottom.max = true;
            }
            if (xAxisPos === 'top' && !isSet.top.max) {
              this.max.top = Math.max(this.max.top, s.lineData?.length || 0);
              tmp.top.max = true;
            }
          }
          if (isBarData) {
            if (xAxisPos === 'bottom' && !isSet.bottom.max) {
              this.max.bottom = Math.max(s.barData?.length || 0);
              tmp.bottom.max = true;
            }
            if (xAxisPos === 'top' && !isSet.top.max) {
              this.max.top = Math.max(this.max.top, s.barData?.length || 0);
              tmp.top.max = true;
            }
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
      if (!isSet.right.max || !isSet.right.min || !isSet.bottom.max || !isSet.top.max) {
        series.right?.forEach((s: Partial<Series>) => {
          const isLineData = Array.isArray(s.lineData);
          const isBarData = Array.isArray(s.barData);
          const xAxisPos = s.dependsXAxis || 'bottom';
          // ===== x축의 max 설정 =====
          if (isLineData) {
            if (xAxisPos === 'bottom' && !isSet.bottom.max) {
              this.max.bottom = Math.max(s.lineData?.length || 0);
              tmp.bottom.max = true;
            }
            if (xAxisPos === 'top' && !isSet.top.max) {
              this.max.top = Math.max(this.max.top, s.lineData?.length || 0);
              tmp.top.max = true;
            }
          }
          if (isBarData) {
            if (xAxisPos === 'bottom' && !isSet.bottom.max) {
              this.max.bottom = Math.max(s.barData?.length || 0);
              tmp.bottom.max = true;
            }
            if (xAxisPos === 'top' && !isSet.top.max) {
              this.max.top = Math.max(this.max.top, s.barData?.length || 0);
              tmp.top.max = true;
            }
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
      if (!isSet.top.min) {
        if (this.max.top < 0) {
          this.min.top = this.max.top;
        } else {
          this.min.top = 0;
        }
        tmp.top.min = true;
      }

      isSet.bottom = cloneDeep(tmp.bottom);
      isSet.left = cloneDeep(tmp.left);
      isSet.right = cloneDeep(tmp.right);
      isSet.top = cloneDeep(tmp.top);
    }

    if (!isSet.left.max) throw Error(`left y axis의 최대값을 특정할 수 없습니다.`);
    if (!isSet.left.min) throw Error(`left y axis의 최소값을 특정할 수 없습니다.`);
    if (!isSet.right.max) throw Error(`right y axis의 최대값을 특정할 수 없습니다.`);
    if (!isSet.right.min) throw Error(`right y axis의 최소값을 특정할 수 없습니다.`);
    if (!isSet.bottom.max) throw Error(`bottom x axis의 최대값을 특정할 수 없습니다.`);
    if (!isSet.bottom.min) throw Error(`bottom x axis의 최소값을 특정할 수 없습니다.`);
    if (!isSet.top.max) throw Error(`top x axis의 최대값을 특정할 수 없습니다.`);
    if (!isSet.top.min) throw Error(`top x axis의 최소값을 특정할 수 없습니다.`);
  };

  public setRange = (axis: Partial<RectArea<Partial<Axis>>>) => {
    this.range.bottom = this.max.bottom - this.min.bottom;
    this.range.top = this.max.top - this.min.top;

    this.range.left = this.max.left - this.min.left;
    // range가 나누어 떨어지지 않을 경우 => 추후 테스트
    const leftUnitPerTick = axis.right?.unitsPerTick || 1;
    const leftMod = this.range.left % leftUnitPerTick;
    if (leftMod !== 0) {
      this.max.left += leftUnitPerTick - leftMod;
      this.range.left = this.max.left - this.min.left;
    }

    this.range.right = this.max.right - this.min.right;
    const rightUnitPerTick = axis.right?.unitsPerTick || 1;
    const rightMod = this.range.right % rightUnitPerTick;
    if (rightMod !== 0) {
      this.max.right += rightUnitPerTick - rightMod;
      this.range.right += this.max.right - this.min.right;
    }
  };

  public setSize = (canvas: HTMLCanvasElement) => {
    this.size.width =
      canvas.width -
      this.padding.left * 2 -
      this.padding.right * 2 -
      this.tickSize.left.height -
      this.tickSize.right.height -
      this.padding.left * 2 -
      this.tickSize.left.height;

    this.size.height =
      canvas.height -
      this.padding.bottom -
      this.padding.top -
      this.tickSize.bottom.height -
      this.tickSize.top.height -
      this.padding.left * 2 -
      this.tickSize.left.height;
  };

  public setStartPoint = () => {
    this.startPoint.bottom.x = this.padding.left * 2 + this.tickSize.left.height;
    this.startPoint.bottom.y = this.padding.left * 2 + this.size.height;
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
      top: (this.area.end.x - this.area.start.x) / this.range.top,
      bottom: (this.area.end.x - this.area.start.x) / this.range.bottom,
      left: (this.area.start.y - this.area.end.y) / this.range.left,
      right: (this.area.start.y - this.area.end.y) / this.range.right,
    };
  };

  public display = () => {
    // eslint-disable-next-line no-console
    console.log(this);
  };
}

export default Calculator;
