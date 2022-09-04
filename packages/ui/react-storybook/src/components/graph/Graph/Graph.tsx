import React from 'react';

type Props = {
  type?: 'line';
};

function Graph({ type }: Props) {
  return <div>Graph</div>;
}

Graph.defaultProps = {
  type: 'line',
};

export default Graph;
