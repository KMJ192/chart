import React, { useEffect, useMemo } from 'react';

// eslint-disable-next-line import/no-named-default
import { default as LineGraph } from '@src/ViewObject/Graph';

// utils
import { makeCommonBowlArea, makeCommonRectArea } from '@src/utils/utils';

// types
import type { Axis, Series } from '@src/ViewObject/Graph/types';

// CSS Module
import classNames from 'classnames/bind';
import style from './Graph.module.scss';

const cx = classNames.bind(style);

type Props = {
  type?: 'line';
};

const axis: Partial<BowlArea<Partial<Axis>>> = {
  bottom: {
    name: 'x-bottom',
    max: 9,
    min: 0,
    unitsPerTick: 1,
    tickColor: '#000',
    output: [],
  },
  left: {
    name: 'y-left',
    unitsPerTick: 1,
    max: 10,
    min: 0,
    tickColor: '#000',
  },
  right: {
    name: 'y-right',
    max: 10,
    min: 0,
    unitsPerTick: 1,
    tickColor: '#000',
  },
};

const series: Partial<{
  left: Partial<Series>[];
  right: Partial<Series>[];
}> = {
  left: [
    {
      name: 'left1',
      lineColor: 'red',
      lineWidth: 1,
      lineData: [1, 4, 6, 1, 7, 9, 6, 3, 5, 2],
    },
    {
      name: 'left2',
      lineColor: 'blue',
      lineWidth: 1,
      // lineData: [8, 2, 7, 1, 3, 1, 10, 8, 4, 3],
      lineData: [4, 2, 7, 8, 4, 6, 3, 1, 3, 2],
      barData: [4, 2, 7, 8, 4, 6, 3, 1, 3, 2],
    },
  ],
  right: [
    {
      name: 'right1',
      lineColor: 'green',
      lineWidth: 1,
      lineData: [3, 4, 6, 2, 1, 4, 2, 6, 0, 3],
    },
    {
      name: 'right2',
      lineColor: 'black',
      lineWidth: 1,
      lineData: [1, 2, 3, 4, 7, 6, 5, 2, 3, 9],
    },
  ],
};

function Graph({ type }: Props) {
  const graph = useMemo(
    () =>
      new LineGraph({
        nodeId: 'line-graph',
        graphType: type,
        tickSize: makeCommonBowlArea<Size>({ width: 1, height: 15 }),
        padding: makeCommonRectArea<number>(50),
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

  return <div id='line-graph' className={cx('graph')}></div>;
}

Graph.defaultProps = {
  type: 'line',
};

export default Graph;
