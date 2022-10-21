import type { Axis } from '../types';

type CalculatorParam = {
  padding: RectArea<number>;
  axis: BowlArea<Axis>;
};

type AxisStyleType = {
  lineWidth: number;
  lineColor: string;
  tickSize: Size;
  tickPosition: 'in' | 'out' | 'middle';
  tickColor: string;
  font: string;
  fontColor: string;
  guideLineColor: string;
};

export type { AxisStyleType, CalculatorParam };
