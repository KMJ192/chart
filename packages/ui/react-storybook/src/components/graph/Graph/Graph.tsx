import React, { useEffect, useMemo } from 'react';

// eslint-disable-next-line import/no-named-default
import { default as LineGraph } from '@src/ViewObject/Graph';
import type { Axis, Series } from '@src/ViewObject/Graph/types';

type Props = {
  type?: 'line';
};

const axis: RectArea<Axis> = {
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
    max: 10,
    min: 0,
    unitsPerTick: 1,
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
  yLeft: Series[];
  yRight: Series[];
} = {
  yLeft: [
    {
      name: 'left1',
      dep: 'bottom',
      color: 'red',
      lineWidth: 1,
      series: [1, 4, 6, 1, 7, 9, 6, 3, 5, 2],
    },
    {
      name: 'left2',
      dep: 'bottom',
      color: 'blue',
      lineWidth: 1,
      series: [4, 2, 7, 8, 4, 6, 3, 1, 3, 2],
    },
  ],
  yRight: [
    {
      name: 'right1',
      dep: 'bottom',
      color: 'green',
      lineWidth: 1,
      series: [3, 4, 6, 2, 1, 4, 2, 6, 6, 3],
    },
    {
      name: 'right2',
      dep: 'bottom',
      color: 'black',
      lineWidth: 1,
      series: [5, 2, 3, 4, 7, 6, 5, 2, 3, 9],
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
