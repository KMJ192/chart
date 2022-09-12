import React, { useEffect, useMemo } from 'react';

// eslint-disable-next-line import/no-named-default
import { default as LineGraph } from '@src/ViewObject/Graph';
import type { Axis, Series } from '@src/ViewObject/Graph/types';

type Props = {
  type?: 'line';
};

const axis: RectArea<Partial<Axis>> = {
  top: {
    name: 'x-top',
    max: 10,
    min: 0,
    unitsPerTick: 1,
    tickSize: {
      width: 1,
      height: 3,
    },
    tickColor: '#000',
  },
  bottom: {
    name: 'x-bottom',
    max: 10,
    min: 0,
    unitsPerTick: 1,
    tickSize: {
      width: 1,
      height: 3,
    },
    tickColor: '#000',
  },
  left: {
    name: 'y-left',
    unitsPerTick: 1,
    max: 10,
    min: 0,
    tickSize: {
      width: 1,
      height: 3,
    },
    tickColor: '#000',
  },
  right: {
    name: 'y-right',
    max: 10,
    min: 0,
    unitsPerTick: 1,
    tickSize: {
      width: 1,
      height: 3,
    },
    tickColor: '#000',
  },
};

const series: {
  left: Partial<Series>[];
  right: Partial<Series>[];
} = {
  left: [
    {
      name: 'left1',
      dependsXAxis: 'bottom',
      lineColor: 'red',
      lineWidth: 1,
      lineData: [1, 4, 6, 1, 7, 9, 6, 3, 5, 2],
    },
    {
      name: 'left2',
      dependsXAxis: 'bottom',
      lineColor: 'blue',
      lineWidth: 1,
      barData: [[4], [2], [7], [8], [4], [6], [3], [1], [3], [2]],
    },
  ],
  right: [
    {
      name: 'right1',
      dependsXAxis: 'bottom',
      lineColor: 'green',
      lineWidth: 1,
      lineData: [3, 4, 6, 2, 1, 4, 2, 6, 6, 3],
    },
    {
      name: 'right2',
      dependsXAxis: 'bottom',
      lineColor: 'black',
      lineWidth: 1,
      lineData: [5, 2, 3, 4, 7, 6, 5, 2, 3, 9],
    },
  ],
};

function Graph({ type }: Props) {
  const graph = useMemo(
    () =>
      new LineGraph({
        nodeId: 'line-graph',
        graphType: type,
      }),
    [type],
  );

  useEffect(() => {
    const unmount = graph.render({
      axis,
      series,
    });
    return () => {
      unmount();
    };
  }, [graph]);

  return <div id='line-graph'></div>;
}

Graph.defaultProps = {
  type: 'line',
};

export default Graph;
