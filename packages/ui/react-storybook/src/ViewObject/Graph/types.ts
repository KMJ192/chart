import type CSS from 'csstype';

// Graph Types
type GraphType = 'line' | 'bar' | 'line+bar';

interface AxisPosition<T> {
  xAxis: T;
  yAxisLeft: T;
  yAxisRight: T;
}

interface Axis {
  name: string;
  max: number;
  min: number;
  unitsPerTick: number;
  tickHeight: number;
  tickColor: string;
  output: string[];
}

interface Series {
  name: string;
  series: number[];
  color: string;
  lineWidth: number;
}

interface SeriesData {
  yLeft: Partial<Series>[];
  yRight: Partial<Series>[];
}

type AxisData = AxisPosition<Partial<Axis>>;

interface RenderOptions {
  tick: boolean;
  tooltip: boolean;
  legend: boolean;
}

type Padding = RectArea<number>;

type Tick<T = Size> = RectArea<T>;

type GraphParam = {
  nodeId: string;
  width: number;
  height: number;
  graphType: GraphType;
  axis: Partial<AxisData>;
  series: Partial<SeriesData>;
  style: CSS.Properties;
  padding: Padding;
  tick: Tick<Partial<Size>>;
};

// GraphCalculator type
interface Area {
  start: Vector;
  end: Vector;
}

type GraphCalculatorParam = {
  padding: Padding;
  tick: Tick<Size>;
};

export type {
  GraphParam,
  GraphCalculatorParam,
  GraphType,
  Area,
  AxisPosition,
  Axis,
  AxisData,
  Series,
  SeriesData,
  RenderOptions,
  Padding,
  Tick,
};
