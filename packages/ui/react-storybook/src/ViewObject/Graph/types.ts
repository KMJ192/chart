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
  guideLineColor: string;
  output: Array<string>;
};

type Series = {
  name: string;
  lineColor: string;
  lineWidth: number;
  linePointRadius: number;
  lineData: Array<number>;
  barWidth: number;
  barColor: Array<string> | Array<Array<string>>;
  barData: Array<number> | Array<Array<number>>;
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
  verticalGuideLine: boolean;
  horizontalGuideLine: {
    left: boolean;
    right: boolean;
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
  tickPosition: Partial<BowlArea<'in' | 'out' | 'middle'>>;
};

type GraphDataParam = {
  axis: Partial<BowlArea<Partial<Axis>>>;
  series: Partial<{
    left: Array<Partial<Series>>;
    right: Array<Partial<Series>>;
  }>;
};

interface RenderOptionsSetterParam extends RenderOptions {
  data: GraphDataParam;
}

export {
  GraphParam,
  GraphDataParam,
  GraphType,
  RenderOptions,
  RenderOptionsSetterParam,
  Axis,
  Series,
};
