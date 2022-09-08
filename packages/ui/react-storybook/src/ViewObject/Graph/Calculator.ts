import type { Axis, CalculatorParam, GraphDataParam, RenderOptions, Series } from './types';

// 데이터 연산
class Calculator {
  private max: RectArea<number> = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  private min: RectArea<number> = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
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

  constructor({ canvasSize }: CalculatorParam) {
    this.canvasSize = canvasSize;

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

  public setMinMax = (data: GraphDataParam) => {
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
    // 입력받은 axis데이터의 max값이 입력되어 있는지 여부 확인
    if (axis.top?.max !== undefined) {
      isSet.top.max = true;
    }
  };

  public display = () => {
    console.log(this.max);
  };
}

export default Calculator;
