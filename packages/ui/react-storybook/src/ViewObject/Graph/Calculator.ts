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
    series: RectArea<boolean>;
    axis: RectArea<boolean>;
  } = {
    series: {
      top: false,
      bottom: true,
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
      series: Partial<RectArea<boolean>>;
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

    if (typeof renderOption.series?.top === 'boolean') {
      this.renderOption.series.top = renderOption.series.top;
    }

    if (typeof renderOption.series?.bottom === 'boolean') {
      this.renderOption.series.bottom = renderOption.series.bottom;
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
  };

  set minMaxSetter(data: GraphDataParam) {
    const isSet: RectArea<{ max: boolean; min: boolean }> = {
      top: {
        max: false,
        min: false,
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
        max: false,
        min: false,
      },
    };

    const { axis, series } = data;

    // ==== 1. left y축(필수 데이터) 최대 최소값 정의 ====
    if (typeof axis.left?.max === 'number') {
      // max값이 입력값으로 들어 온 경우
      this.max.left = axis.left.max;
      isSet.left.max = true;
    }

    if (typeof axis.left?.min === 'number') {
      this.min.left = axis.left.min;
      isSet.left.min = true;
    }

    if (!isSet.left.max || !isSet.left.min) {
      const tmpFlag = {
        max: isSet.left.max,
        min: isSet.left.min,
      };
      series.yLeft?.forEach((s: Partial<Series>) => {
        if (s?.data) {
          s.data.forEach((d: number | number[]) => {
            if (!isSet.left.max) {
              if (Array.isArray(d)) {
                if (this.graphType === 'line') {
                  throw Error(
                    `정의된 그래프 타입은 'line'이지만, series의 데이터로 2차원 배열이 올 수 없습니다.`,
                  );
                }
                if (s.type === 'line') {
                  throw Error(`series의 타입이 'line'일 때 데이터로 2차원 배열이 올 수 없습니다.`);
                }
                d.forEach((n) => {
                  this.max.left = Math.max(this.max.left, n);
                });
              } else {
                this.max.left = Math.max(this.max.left, d);
              }
              tmpFlag.max = true;
            }
            if (!isSet.left.min) {
              if (Array.isArray(d)) {
                if (s.type === 'line') {
                  throw Error(`series의 타입이 'line'일 때 데이터로 2차원 배열이 올 수 없습니다.`);
                }
                if (this.graphType === 'line') {
                  throw Error(
                    `정의된 그래프 타입은 'line'이지만, series의 데이터로 2차원 배열이 올 수 없습니다.`,
                  );
                }
                d.forEach((n) => {
                  this.min.left = Math.min(this.min.left, n);
                });
              } else {
                this.min.left = Math.min(this.min.left, d);
              }
              tmpFlag.min = true;
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

    // ==== 2. bottom x축(필수 데이터) 최대 최소값 정의 ====
    if (typeof axis.bottom?.max === 'number') {
      this.max.bottom = axis.bottom.max;
      isSet.bottom.max = true;
    }

    if (typeof axis.bottom?.min === 'number') {
      this.min.bottom = axis.bottom.min;
      isSet.bottom.min = true;
    }

    // ==== 2. bottom x축(필수 데이터) 최대 최소값 정의 ====

    // ==== 3. right y축(옵션 데이터) 최대 최소값 정의 ====
    // ==== 3. right y축(옵션 데이터) 최대 최소값 정의 ====

    // ==== 4. top x축(옵션 데이터) 최대 최소값 정의 ====
    // ==== 4. top x축(옵션 데이터) 최대 최소값 정의 ====
  }

  public display = () => {
    // eslint-disable-next-line no-console
    console.log(this);
  };
}

export default Calculator;
