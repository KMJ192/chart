type GraphParam = {
  nodeId: string;
  width: number;
  height: number;
};

interface Axis {
  name: string;
  max: number;
  min: number;
  unitsPerTick: number;
  tickHeight: number;
  tickColor: number;
}

export type { GraphParam, Axis };
