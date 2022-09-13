// Graph Types
type GraphType = 'line' | 'bar' | 'line+bar';

interface Axis {
  name: string;
  max: number;
  min: number;
  unitsPerTick: number;
  tickColor: string;
  lineWidth: number;
  lineColor: string;
  output: string[];
}

interface Series {
  name: string;
  barData?: number[] | number[][];
  barColor?: string[];
  barWidth?: number;
  lineData?: number[];
  lineColor?: string;
  lineWidth?: number;
  dependsXAxis?: 'bottom' | 'top';
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
  padding: Partial<RectArea<number>>;
  tickSize: Partial<RectArea<Size>>;
};

type GraphDataParam = {
  axis: Partial<RectArea<Partial<Axis>>>;
  series: Partial<{
    left: Partial<Series>[];
    right: Partial<Series>[];
  }>;
};

export { GraphParam, GraphDataParam, GraphType, RenderOptions, Axis, Series };
