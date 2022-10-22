import React from 'react';

import { Story } from '@storybook/react';
import Graph from './Graph';

import { GraphType } from './types';

export default {
  title: 'Graph',
  component: Graph,
  parameters: {
    componentSubtitle: 'Graph',
  },
};

const graphTemplate = (args: GraphType): JSX.Element => {
  return <Graph {...args} />;
};

export const lineGraph: Story<GraphType> = graphTemplate.bind({});
lineGraph.args = {};
