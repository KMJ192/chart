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

const axis: Partial<BowlArea<Partial<Axis>>> = {
  bottom: {
    name: 'x-bottom',
    // max: 10,
    // min: 0,
    unitsPerTick: 1,
    tickColor: '#000',
    // output: [
    //   '0.0',
    //   '0.5',
    //   '1.0',
    //   '1.5',
    //   '2.0',
    //   '2.5',
    //   '3.0',
    //   '3.5',
    //   '4.0',
    //   '4.5',
    //   '5.0',
    //   '5.5',
    //   '6.0',
    //   '6.5',
    //   '7.0',
    //   '7.5',
    //   '8.0',
    //   '8.5',
    //   '9.0',
    //   '9.5',
    //   '10.0',
    // ],
  },
  left: {
    name: 'y-left',
    unitsPerTick: 1,
    max: 10,
    min: 0,
    tickColor: '#000',
    // output: [
    //   '0.0',
    //   '0.5',
    //   '1.0',
    //   '1.5',
    //   '2.0',
    //   '2.5',
    //   '3.0',
    //   '3.5',
    //   '4.0',
    //   '4.5',
    //   '5.0',
    //   '5.5',
    //   '6.0',
    //   '6.5',
    //   '7.0',
    //   '7.5',
    //   '8.0',
    //   '8.5',
    //   '9.0',
    //   '9.5',
    //   '10.0',
    // ],
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
      // lineData: [1, 4, 6, 1, 7, 9, 6, 3, 5, 2],
      // linePointRadius: 3,
      barColor: [['red', 'blue', 'skyblue', 'green']],
      barData: [[2, 1, 2, 4], [1, 2], 7, 8, 4, 6, 3, 1, 3, 2],
    },
    // {
    //   name: 'left2',
    //   lineColor: 'blue',
    //   lineWidth: 1,
    //   lineData: [8, 2, 7, 1, 3, 1, 10, 8, 4, 3],
    //   linePointRadius: 3,
    // },
  ],
  right: [
    {
      name: 'right1',
      lineColor: 'green',
      lineWidth: 1,
      // lineData: [3, 4, 6, 2, 1, 4, 2, 6, 0, 3],
      lineData: [3],
      linePointRadius: 3,
      // barColor: [
      //   ['red', 'blue', 'skyblue', 'green'],
      //   ['blue', 'green'],
      //   'skyblue',
      //   'green',
      //   'black',
      //   'red',
      //   'blue',
      //   'skyblue',
      //   'green',
      //   'black',
      // ],
      // barColor: [['red', 'blue', 'skyblue', 'green']],
      // barData: [[2, 1, 2, 4], [1, 2], 7, 8, 4, 6, 3, 1, 3, 2],
      // barData: [2],
    },
    // {
    //   name: 'right2',
    //   linePointRadius: 3,
    //   lineColor: 'black',
    //   lineWidth: 1,
    //   lineData: [1, 2, 3, 4, 7, 6, 5, 2, 3, 9],
    //   // barData: [[2, 1, 2, 4], [1, 2], 7, 8, 4, 6, 3, 1, 3, 2],
    // },
  ],
};

function Graph() {
  const graph = useMemo(
    () =>
      new LineGraph({
        nodeId: 'line-graph',
        tickSize: makeCommonBowlArea<Size>({ width: 1, height: 15 }),
        padding: makeCommonRectArea<number>(50),
      }),
    [],
  );

  useEffect(() => {
    const unmount = graph.render({
      axis,
      series,
    });
    return () => {
      if (typeof unmount === 'function') unmount();
    };
  }, [graph]);

  return <div id='line-graph' className={cx('graph')}></div>;
}

export default Graph;
