// Graph Types
type GraphType = 'line' | 'bar' | 'line+bar';

interface Axis {
  name: string;
  max: number;
  min: number;
  unitsPerTick: number;
  tickSize: Size;
  tickColor: string;
  output?: string[];
}

interface Series {
  name: string;
  data: number[] | number[][];
  dep?: 'bottom' | 'top';
  color?: string;
  lineWidth?: number;
  barWidth?: number;
  type?: Exclude<GraphType, 'line+bar'>;
}

type RenderOptions = {
  axis: RectArea<boolean>;
  series: {
    left: boolean;
    right: boolean;
  };
  text: RectArea<boolean>;
  legend: boolean;
  tooltip: boolean;
};

type GraphParam = {
  nodeId: string;
  graphType: GraphType;
  width: number;
  height: number;
  padding: RectArea<number>;
};

type GraphDataParam = {
  axis: Partial<RectArea<Partial<Axis>>>;
  series: Partial<{
    left: Partial<Series>[];
    right: Partial<Series>[];
  }>;
};

type CalculatorParam = {
  canvasSize: Size;
  padding: RectArea<number>;
  graphType: GraphType;
};

export { GraphParam, GraphDataParam, GraphType, RenderOptions, CalculatorParam, Axis, Series };
