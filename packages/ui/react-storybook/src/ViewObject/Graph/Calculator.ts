import { cloneDeep } from 'lodash';

import type { CalculatorParam, GraphDataParam, GraphType, Series } from './types';

// 데이터 연산
class Calculator {
  private graphType: GraphType;

  private max: RectArea<number> = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  private min: RectArea<number> = {
    top: 0,
    bottom: 0,
    left: Infinity,
    right: Infinity,
  };

  private padding: RectArea<number> = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  private canvasSize: Size = {
    width: 0,
    height: 0,
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

  constructor({ canvasSize, padding, graphType }: CalculatorParam) {
    this.graphType = graphType;

    this.canvasSize = canvasSize;

    this.padding = padding;

    this.scale = 0;
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
    if (!axis.right) {
      this.renderOption.axis.right = false;
      this.renderOption.series.right = false;
    }
    // 7-2. top x축 정보가 없는 경우
    if (!axis.top) {
      this.renderOption.axis.top = false;
    }
  };

  set minMaxSetter(data: GraphDataParam) {
    // top, right는 렌더 옵션에 따라 설정
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
    // ======= 1. max, min 입력 여부 및 입력값 확인 =======

    // ======= 2. axis별 max, min값 정의 =======
    if (
      !isSet.left.max ||
      !isSet.left.min ||
      !isSet.bottom.max ||
      !isSet.bottom.min ||
      !isSet.right.max ||
      !isSet.right.min ||
      !isSet.top.max ||
      !isSet.top.min
    ) {
      const tmp = cloneDeep(isSet);
      // 2-1. left axis 참조 -> left y축 및 종속 x축(top or bottom)의 max, min
      series.left?.forEach((s: Partial<Series>) => {
        const isLineData = Array.isArray(s.lineData);
        const isBarData = Array.isArray(s.barData);
        const xAxisPos = s.dependsXAxis || 'bottom';
        if (isLineData) {
          if (xAxisPos === 'bottom' && !isSet.bottom.max) {
            this.max.bottom = s.lineData?.length || 0;
            // x축 min값 정하는 방법
            tmp.bottom.max = true;
          }
          if (xAxisPos === 'top' && !isSet.top.max) {
            this.min.top = Math.max(this.max.top, s.lineData?.length || 0);
            tmp.top.max = true;
          }
          s.lineData?.forEach((_data: number) => {});
        }
        if (isBarData) {
          s.barData?.forEach((_data: number | number[]) => {
            if (Array.isArray(_data)) {
              _data.forEach((d: number) => {});
            }
          });
        }
      });

      // 2-2. right axis 참조 -> right y축 및 종속 x축(top or bottom)의 max, min
      series.right?.forEach((s: Partial<Series>) => {
        const isLineData = Array.isArray(s.lineData);
        const isBarData = Array.isArray(s.barData);
        const xAxisPos = s.dependsXAxis || 'bottom';
        if (isLineData) {
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
        }
        if (isBarData) {
          s.barData?.forEach((_data: number | number[]) => {
            if (Array.isArray(_data)) {
              _data.forEach((d: number) => {});
            }
          });
        }
      });

      isSet.bottom = cloneDeep(tmp.bottom);
      isSet.left = cloneDeep(tmp.left);
      isSet.right = cloneDeep(tmp.right);
      isSet.top = cloneDeep(tmp.top);
    }
    // ======= 2. axis별 max, min값 정의 =======

    // ==== 1. left y축(필수 데이터) 최대 최소값 정의 ====
    if (!isSet.left.max || !isSet.left.min) {
      const tmpFlag = {
        max: isSet.left.max,
        min: isSet.left.min,
      };
      series.left?.forEach((s: Partial<Series>) => {
        const isLineData = Array.isArray(s.lineData);
        const isBarData = Array.isArray(s.barData);
        if (isLineData) {
          s.lineData?.forEach((_data: number) => {
            if (!isSet.left.max) {
              this.max.left = Math.max(this.max.left, _data);
              tmpFlag.max = true;
            }
            if (!isSet.left.min) {
              this.min.left = Math.min(this.min.left, _data);
              tmpFlag.min = true;
            }
          });
        }
        if (isBarData) {
          s.barData?.forEach((_data: number | number[]) => {
            if (Array.isArray(_data)) {
              _data.forEach((d: number) => {
                if (!isSet.left.max) {
                  this.max.left = Math.max(this.max.left, d);
                  tmpFlag.max = true;
                }
                if (!isSet.left.min) {
                  this.min.left = Math.min(this.min.left, d);
                  tmpFlag.min = true;
                }
              });
            } else {
              if (!isSet.left.max) {
                this.max.left = Math.max(this.max.left, _data);
                tmpFlag.max = true;
              }
              if (!isSet.left.min) {
                this.min.left = Math.min(this.min.left, _data);
                tmpFlag.min = true;
              }
            }
          });
        }
      });
      isSet.left.max = tmpFlag.max;
      isSet.left.min = tmpFlag.min;
    }

    if (!isSet.left.max) throw Error(`left axis의 최대값을 특정할 수 없습니다.`);
    if (!isSet.left.min) throw Error(`left axis의 최소값을 특정할 수 없습니다.`);
    // ==== 1. left y축(필수 데이터) 최대 최소값 정의 ====
  }

  public display = () => {
    // eslint-disable-next-line no-console
    console.log(this);
  };
}

export default Calculator;
