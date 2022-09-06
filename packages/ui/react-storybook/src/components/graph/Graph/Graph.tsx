import React, { useEffect, useMemo } from 'react';

// eslint-disable-next-line import/no-named-default
import { default as LineGraph } from '@src/ViewObject/Graph';

type Props = {
  type?: 'line';
};

function Graph({ type }: Props) {
  const graph = useMemo(() => new LineGraph({ nodeId: 'line-graph' }), []);

  useEffect(() => {
    const unmount = graph.render({});

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
