import type CSS from 'csstype';

type GraphParam = {
  nodeId: string;
  width: number;
  height: number;
  style: CSS.Properties;
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
