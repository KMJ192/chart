// Graph Types
type GraphType = 'line' | 'bar' | 'line+bar';

type Axis = {
  name: string;
  unitsPerTick: number;
  tickColor: string;
  tickSize: Size;
  tickPosition: 'in' | 'out' | 'middle';
  lineWidth: number;
  lineColor: string;
  guideLineColor: string;
  output: Array<string>;
  font: string;
  fontColor: string;
  max?: number;
  min?: number;
};

type Series = {
  name: string;
  lineColor: string;
  lineWidth: number;
  bulletSize: number;
  barWidth: number;
  barColor: Array<string | Array<string>>;
  lineData: Array<number>;
  barData: Array<number | Array<number>>;
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
  width: number;
  height: number;
  padding: RectArea<number>;
  axis: BowlArea<Axis>;
};

type GraphDataParam = {
  axis: BowlArea<Axis>;
  series: {
    left: Array<Series>;
    right: Array<Series>;
  };
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
