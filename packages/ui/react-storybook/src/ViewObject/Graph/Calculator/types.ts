import { GraphType } from '../types';

type CalculatorParam = {
  padding: RectArea<number>;
  graphType: GraphType;
  tickSize: RectArea<Size>;
};

export { CalculatorParam };
