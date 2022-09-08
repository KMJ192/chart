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
  dep: 'bottom' | 'top';
  color: string;
  lineWidth: number;
  series: number[];
}

type GraphParam = {
  nodeId: string;
  graphType: GraphType;
  width: number;
  height: number;
};

type GraphDataParam = {
  axis: Partial<RectArea<Partial<Axis>>>;
  series: Partial<{
    yLeft: Partial<Series>[];
    yRight: Partial<Series>[];
  }>;
};

type RenderOptions = {
  axis: RectArea<boolean>;
  series: RectArea<boolean>;
  text: RectArea<boolean>;
  legend: boolean;
  tooltip: boolean;
};

type CalculatorParam = {
  canvasSize: Size;
};

export { GraphParam, GraphDataParam, GraphType, RenderOptions, CalculatorParam, Axis, Series };
