import type CSS from 'csstype';

// Graph Types
type GraphType = 'line' | 'bar' | 'line+bar';

interface Axis {
  name: string;
  max: number;
  min: number;
  unitsPerTick: number;
  tickSize: Size;
  tickColor: string;
}

interface Series {
  name: string;
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
  axis: RectArea<Axis>;
  series: RectArea<Series>;
};

type RenderOptions = {
  axis?: RectArea<boolean>;
  series?: RectArea<boolean>;
  text?: RectArea<boolean>;
  legend?: boolean;
  tooltip?: boolean;
};

type CalculatorParam = {
  canvasSize: Size;
};

export { GraphParam, GraphDataParam, GraphType, RenderOptions, CalculatorParam, Axis, Series };

// interface Axis {}

// interface AxisPosition<T> {
//   xAxis: T;
//   yAxisLeft: T;
//   yAxisRight: T;
// }

// interface Axis {
//   name: string;
//   max: number;
//   min: number;
//   unitsPerTick: number;
//   tickHeight: number;
//   tickColor: string;
//   output: string[];
// }

// type AxisData = AxisPosition<Partial<Axis>>;

// interface Series {
//   name: string;
//   color: string;
//   lineWidth: number;
//   series: number[];
// }

// interface SeriesData {
//   yLeft: Partial<Series>[];
//   yRight: Partial<Series>[];
// }

// interface RenderOptions {
//   tick: boolean;
//   tooltip: boolean;
//   legend: boolean;
// }

// type Padding = RectArea<number>;

// type Tick<T = Size> = RectArea<T>;

// type GraphParam = {
//   nodeId: string;
//   width: number;
//   height: number;
//   graphType: GraphType;
//   axis: Partial<AxisData>;
//   series: Partial<SeriesData>;
//   style: CSS.Properties;
//   padding: Padding;
//   tick: Tick<Partial<Size>>;
// };

// // GraphCalculator type
// interface Area {
//   start: Vector;
//   end: Vector;
// }

// type GraphCalculatorParam = {
//   padding: Padding;
//   tick: Tick<Size>;
// };

// interface MinMax {
//   min: number;
//   max: number;
// }

// export type {
//   GraphParam,
//   GraphCalculatorParam,
//   GraphType,
//   Area,
//   AxisPosition,
//   Axis,
//   AxisData,
//   Series,
//   SeriesData,
//   RenderOptions,
//   Padding,
//   Tick,
//   MinMax,
// };
