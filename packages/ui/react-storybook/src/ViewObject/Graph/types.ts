// Graph Types
type GraphType = 'line' | 'bar' | 'line+bar';

type Axis = {
  name: string;
  max: number;
  min: number;
  unitsPerTick: number;
  tickColor: string;
  lineWidth: number;
  lineColor: string;
  output: string[];
};

type Series = {
  name: string;
  barData?: number[] | number[][];
  barColor?: string[];
  barWidth?: number;
  lineData?: number[];
  lineColor?: string;
  lineWidth?: number;
};

type RenderOptions = {
  axis: BowlArea<boolean>;
  axisInfo: BowlArea<{
    outputText: boolean;
    tick: boolean;
  }>;
  series: {
    left: boolean;
    right: boolean;
  };
  seriesInfo: {
    left: {
      outputText: boolean;
    };
    right: {
      outputText: boolean;
    };
  };
  legend: boolean;
  tooltip: boolean;
};

type GraphParam = {
  nodeId: string;
  graphType: GraphType;
  width: number;
  height: number;
  padding: Partial<RectArea<number>>;
  tickSize: Partial<BowlArea<Size>>;
};

type GraphDataParam = {
  axis: Partial<BowlArea<Partial<Axis>>>;
  series: Partial<{
    left: Partial<Series>[];
    right: Partial<Series>[];
  }>;
};

export { GraphParam, GraphDataParam, GraphType, RenderOptions, Axis, Series };
